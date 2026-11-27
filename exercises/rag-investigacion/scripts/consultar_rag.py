"""Paso reutilizable «consultar el RAG» con la configuración decidida.

Uso desde terminal:

    uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?"

    uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?" --modulo asyncio

La instancia carga el reranker una vez. El modelo de embeddings, la colección y
`reordenar` son parámetros; por defecto nomic, su colección y el reranker. Cada
consulta calcula el embedding con ese modelo, recupera 20 candidatos de Qdrant,
los reordena y devuelve los 4 mejores.
Con `filtros` (`modulo`, `tipo_pagina`; `--modulo` y `--tipo-pagina` en terminal,
repetibles) los candidatos salen solo de los chunks que los cumplen; si no hay
candidatos, o con `reordenar=True` ninguno llega a `umbral` en `score_reranking`, la
búsqueda se repite sin filtro con el mismo vector; con `reordenar=False` solo se repite
si no hay candidatos. Cada chunk lleva sus seis metadatos y `filtrado`.
"""

from __future__ import annotations

import argparse
import json

import ollama
from qdrant_client import QdrantClient
from qdrant_client.models import FieldCondition, Filter, MatchAny
from sentence_transformers import CrossEncoder

from comparar_embeddings import MODELOS, preparar_query
from embeddings_modelos import cargar_codificador, dispositivo, embeber


COLECCION = "pydocs_nomic_est1500_m200_sinruta"
MODELO = "nomic"
RERANKER = "cross-encoder/ms-marco-MiniLM-L-6-v2"
CANDIDATOS = 20
K = 4
UMBRAL_REPETICION = 0.0
CAMPOS_FILTRO = ("modulo", "tipo_pagina")
CAMPOS_METADATOS = (
    "modulo",
    "tipo_pagina",
    "simbolos",
    "deprecated",
    "added_in",
    "tiene_codigo",
)
_VALOR_POR_DEFECTO = {
    "modulo": "",
    "tipo_pagina": "",
    "simbolos": [],
    "deprecated": False,
    "added_in": [],
    "tiene_codigo": False,
}


def construir_filtro(filtros: dict | None) -> Filter | None:
    """Valida `filtros` y los convierte en un filtro de Qdrant (None si no hay)."""
    if not filtros:
        return None
    condiciones = []
    for clave, valor in filtros.items():
        if clave not in CAMPOS_FILTRO:
            raise ValueError(
                f"Filtro no válido: {clave!r}. Claves permitidas: {', '.join(CAMPOS_FILTRO)}"
            )
        valores = [valor] if isinstance(valor, str) else valor
        if not isinstance(valores, (list, tuple)) or not valores:
            raise ValueError(f"El filtro {clave!r} necesita un texto o una lista de textos")
        for elemento in valores:
            if not isinstance(elemento, str) or not elemento:
                raise ValueError(f"El filtro {clave!r} solo acepta textos no vacíos")
        condiciones.append(FieldCondition(key=clave, match=MatchAny(any=list(valores))))
    return Filter(must=condiciones)


class ConsultorRAG:
    """Recupera y reordena chunks sin cargar modelos en cada consulta."""

    def __init__(
        self,
        qdrant,
        cliente_ollama,
        reranker,
        coleccion: str = COLECCION,
        modelo: str = MODELO,
        codificador=None,
    ) -> None:
        self.qdrant = qdrant
        self.cliente_ollama = cliente_ollama
        self.reranker = reranker
        self.coleccion = coleccion
        self.modelo = modelo
        self.codificador = codificador

    @classmethod
    def local(cls, coleccion: str = COLECCION, modelo: str = MODELO) -> "ConsultorRAG":
        """Construye el consultor para los servicios locales del proyecto.

        El reranker corre en `dispositivo()`. Con un modelo de sentence-transformers carga también
        el codificador.
        """
        if coleccion == COLECCION:
            orden_indexacion = "ejecuta el notebook 07"
            orden_metadatos = "`uv run python scripts/anadir_metadatos.py`"
        else:
            orden_indexacion = orden_metadatos = f"`uv run python scripts/indexar_embeddings.py {modelo}`"
        qdrant = QdrantClient("localhost", port=6333)
        try:
            qdrant.get_collection(coleccion)
        except Exception as error:
            raise RuntimeError(
                f"Qdrant no responde o no tiene {coleccion}. "
                f"Arráncalo y {orden_indexacion}."
            ) from error
        try:
            registros, _ = qdrant.scroll(coleccion, limit=1, with_payload=True, with_vectors=False)
        except Exception as error:
            raise RuntimeError(f"No se pudo leer {coleccion} en Qdrant.") from error
        if registros and "modulo" not in (registros[0].payload or {}):
            raise RuntimeError(
                f"{coleccion} no tiene los metadatos. Ejecuta {orden_metadatos}."
            )
        cliente_ollama = ollama.Client()
        nombre = MODELOS[modelo]["nombre"]
        codificador = None
        if MODELOS[modelo]["proveedor"] == "ollama":
            try:
                cliente_ollama.show(nombre)
            except Exception as error:
                raise RuntimeError(
                    f"Ollama no responde o no tiene {nombre}. Ejecuta `ollama pull {nombre}`."
                ) from error
        else:
            try:
                codificador = cargar_codificador(modelo)
            except Exception as error:
                raise RuntimeError(f"No se pudo cargar el codificador {nombre}.") from error
        try:
            reranker = CrossEncoder(RERANKER, device=dispositivo())
        except Exception as error:
            raise RuntimeError(f"No se pudo cargar el reranker {RERANKER}.") from error
        return cls(qdrant, cliente_ollama, reranker, coleccion, modelo, codificador)

    def consultar(
        self,
        pregunta: str,
        candidatos: int = CANDIDATOS,
        k: int = K,
        filtros: dict | None = None,
        umbral: float | None = UMBRAL_REPETICION,
        reordenar: bool = True,
    ) -> list[dict]:
        """Devuelve los `k` chunks mejor puntuados de `candidatos` recuperados.

        `filtros` acepta `modulo` y `tipo_pagina` (texto o lista de textos). Si la búsqueda
        filtrada no llega a `umbral` en `score_reranking`, se repite sin filtro con el mismo
        vector. Con `umbral=None` no se repite. Con `reordenar=False` se ordena por `score_vectorial`,
        `score_reranking` es None y la búsqueda filtrada solo se repite si no devuelve candidatos.
        """
        if not pregunta.strip():
            raise ValueError("La pregunta no puede estar vacía")
        if candidatos < 1:
            raise ValueError("candidatos debe ser al menos 1")
        if k < 1 or k > candidatos:
            raise ValueError("k debe estar entre 1 y candidatos")
        query_filter = construir_filtro(filtros)

        vectores, _ = embeber(
            self.modelo,
            [preparar_query(self.modelo, pregunta)],
            self.cliente_ollama,
            self.codificador,
        )
        vector = vectores[0]
        resultados = self._buscar_y_reordenar(
            pregunta, vector, candidatos, query_filter, reordenar
        )
        if query_filter is not None:
            if reordenar:
                repetir = umbral is not None and not any(
                    r["score_reranking"] >= umbral for r in resultados
                )
            else:
                repetir = not resultados
            if repetir:
                resultados = self._buscar_y_reordenar(
                    pregunta, vector, candidatos, None, reordenar
                )
                filtrado = False
            else:
                filtrado = True
        else:
            filtrado = False
        for resultado in resultados:
            resultado["filtrado"] = filtrado
        return resultados[:k]

    def _buscar_y_reordenar(
        self,
        pregunta: str,
        vector,
        candidatos: int,
        query_filter: Filter | None,
        reordenar: bool = True,
    ) -> list[dict]:
        """Busca `candidatos` en Qdrant y los ordena por `score_reranking` (o `score_vectorial`)."""
        argumentos = {"query": vector, "limit": candidatos, "with_payload": True}
        if query_filter is not None:
            argumentos["query_filter"] = query_filter
        puntos = self.qdrant.query_points(self.coleccion, **argumentos).points
        recuperados = []
        for punto in puntos:
            payload = punto.payload
            chunk = {
                "id": punto.id,
                "fuente": payload["fuente"],
                "texto": payload["texto"],
                "ruta_titulos": payload.get("ruta_titulos", ""),
                "score_vectorial": float(punto.score),
            }
            for campo in CAMPOS_METADATOS:
                chunk[campo] = payload.get(campo, _VALOR_POR_DEFECTO[campo])
            recuperados.append(chunk)
        if not recuperados:
            return []
        if not reordenar:
            for resultado in recuperados:
                resultado["score_reranking"] = None
            recuperados.sort(key=lambda resultado: resultado["score_vectorial"], reverse=True)
            return recuperados
        scores = self.reranker.predict(
            [(pregunta, resultado["texto"]) for resultado in recuperados]
        )
        for resultado, score in zip(recuperados, scores):
            resultado["score_reranking"] = float(score)
        recuperados.sort(key=lambda resultado: resultado["score_reranking"], reverse=True)
        return recuperados


def main() -> None:
    parser = argparse.ArgumentParser(description="Consulta el RAG local del proyecto")
    parser.add_argument("pregunta", help="Pregunta en inglés para la documentación de Python")
    parser.add_argument("--k", type=int, default=K, help="Chunks finales (por defecto: 4)")
    parser.add_argument(
        "--candidatos", type=int, default=CANDIDATOS, help="Candidatos antes de reranking"
    )
    parser.add_argument(
        "--modulo", action="append", help="Filtra por módulo de Python (repetible)"
    )
    parser.add_argument(
        "--tipo-pagina", action="append", help="Filtra por tipo de página (repetible)"
    )
    args = parser.parse_args()
    filtros = {}
    if args.modulo:
        filtros["modulo"] = args.modulo
    if args.tipo_pagina:
        filtros["tipo_pagina"] = args.tipo_pagina
    consultor = ConsultorRAG.local()
    resultados = consultor.consultar(
        args.pregunta, args.candidatos, args.k, filtros=filtros or None
    )
    print(json.dumps(resultados, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
