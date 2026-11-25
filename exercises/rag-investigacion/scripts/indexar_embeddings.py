"""Indexa el corpus de Python con otros modelos de embeddings, una colección de Qdrant por modelo (issue #28).

Uso:

    uv run python scripts/indexar_embeddings.py qwen3_06b bge_m3 embeddinggemma
    uv run python scripts/indexar_embeddings.py qwen3_8b --lote 8
    uv run python scripts/indexar_embeddings.py jina_code --lote 8
    uv run python scripts/indexar_embeddings.py --referencia

Cada clave crea `pydocs_<clave>_est1500_m200_sinruta` con los chunks de `trocear_por_estructura` 1500/200 y los
seis metadatos de #26. El script se reanuda: una colección completa con entrada en el registro se salta; una
incompleta se borra y se indexa de nuevo. La entrada de `data/resultados/indexacion_embeddings.json` se escribe
solo con la colección completa. `nomic` no se indexa nunca: `--referencia` crea su entrada sin escribir en Qdrant.
"""

from __future__ import annotations

import argparse
import csv
import json
import time
from datetime import datetime
from pathlib import Path

import ollama
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PayloadSchemaType, PointStruct, VectorParams

from comparar_embeddings import MODELOS, preparar_documento, trocear_por_estructura
from embeddings_modelos import (
    cargar_codificador,
    comprobar_modelo,
    contar_truncados,
    dispositivo,
    dispositivo_ollama,
    embeber,
    liberar_vram_ollama,
    nombre_coleccion,
)
from metadatos import metadatos_chunks

RAIZ = Path(__file__).resolve().parent.parent
CARPETA_CORPUS = RAIZ / "data" / "python-docs-3.15" / "python-3.15-docs-md-clean"
REGISTRO = RAIZ / "data" / "resultados" / "indexacion_embeddings.json"
TROCEO_CSV = RAIZ / "data" / "resultados" / "troceo_estructura.csv"
MAXIMO = 1500
MINIMO = 200
LOTE = 32
CAMPOS_INDICE = ("modulo", "tipo_pagina")
REFERENCIA = "nomic"


def leer_registro(registro: Path) -> dict:
    """El JSON del registro, o `{}` si no existe."""
    registro = Path(registro)
    if not registro.exists():
        return {}
    return json.loads(registro.read_text(encoding="utf-8"))


def guardar_entrada(registro: Path, clave: str, entrada: dict) -> None:
    """Lee el registro entero, actualiza `clave` y lo guarda entero."""
    registro = Path(registro)
    datos = leer_registro(registro)
    datos[clave] = entrada
    registro.parent.mkdir(parents=True, exist_ok=True)
    registro.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def coleccion_completa(qdrant, coleccion: str, n_chunks: int, registro: Path, clave: str) -> bool:
    """`True` si la colección existe, tiene `n_chunks` puntos, el primero lleva `modulo` y el registro tiene `clave`."""
    if not qdrant.collection_exists(coleccion):
        return False
    if qdrant.count(coleccion, exact=True).count != n_chunks:
        return False
    puntos, _ = qdrant.scroll(coleccion, limit=1, with_payload=True, with_vectors=False)
    if not puntos or "modulo" not in (puntos[0].payload or {}):
        return False
    return clave in leer_registro(registro)


def validar_claves(claves: list[str]) -> None:
    """`ValueError` si alguna clave es `nomic` (RF-07) o no está en `MODELOS` (CB-03)."""
    for clave in claves:
        if clave == REFERENCIA:
            raise ValueError(
                f"{REFERENCIA} no se indexa: su colección {nombre_coleccion(REFERENCIA)} no se toca. "
                "Usa --referencia para crear su entrada del registro."
            )
        if clave not in MODELOS:
            validas = ", ".join(c for c in MODELOS if c != REFERENCIA)
            raise ValueError(f"Clave desconocida: {clave}. Claves válidas: {validas}.")


def indexar_modelo(
    qdrant,
    clave: str,
    chunks: list[dict],
    metadatos: dict[int, dict],
    embebedor,
    registro: Path,
    dispositivo: str,
    lote: int = LOTE,
) -> dict | None:
    """Indexa `chunks` en la colección de `clave` y devuelve su entrada del registro, o `None` si ya estaba.

    `embebedor(textos)` devuelve `(vectores, truncados)`. Rechaza `nomic` y las claves fuera de `MODELOS` antes de
    tocar Qdrant. La entrada del registro se escribe solo con la colección completa.
    """
    validar_claves([clave])
    coleccion = nombre_coleccion(clave)
    if coleccion_completa(qdrant, coleccion, len(chunks), registro, clave):
        print(f"{coleccion} ya está completa y en el registro: se salta {clave}.")
        return None
    if qdrant.collection_exists(coleccion):
        print(f"{coleccion} existe incompleta: se borra y se indexa de nuevo.")
        qdrant.delete_collection(coleccion)
    truncados = 0
    dimension = 0
    inicio = time.perf_counter()
    for i in range(0, len(chunks), lote):
        grupo = chunks[i : i + lote]
        vectores, truncados_lote = embebedor([preparar_documento(clave, c["texto"]) for c in grupo])
        truncados += truncados_lote
        if i == 0:
            dimension = len(vectores[0])
            qdrant.create_collection(coleccion, vectors_config=VectorParams(size=dimension, distance=Distance.COSINE))
        puntos = [
            PointStruct(
                id=c["id"],
                vector=list(v),
                payload={
                    "fuente": c["fuente"],
                    "texto": c["texto"],
                    "ruta_titulos": c["ruta_titulos"],
                    **metadatos[c["id"]],
                },
            )
            for c, v in zip(grupo, vectores)
        ]
        qdrant.upsert(coleccion, points=puntos, wait=True)
    segundos = time.perf_counter() - inicio
    for campo in CAMPOS_INDICE:
        qdrant.create_payload_index(coleccion, campo, field_schema=PayloadSchemaType.KEYWORD, wait=True)
    puntos_finales = qdrant.count(coleccion, exact=True).count
    if puntos_finales != len(chunks):
        raise RuntimeError(f"{coleccion} tiene {puntos_finales} puntos y hay {len(chunks)} chunks; sin entrada en el registro")
    entrada = {
        "nombre": MODELOS[clave]["nombre"],
        "proveedor": MODELOS[clave]["proveedor"],
        "coleccion": coleccion,
        "dimension": dimension,
        "num_ctx": MODELOS[clave].get("num_ctx"),
        "truncados": truncados,
        "tiempo_indexacion_s": segundos,
        "dispositivo": dispositivo,
        "fecha": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    guardar_entrada(registro, clave, entrada)
    return entrada


def _tiempo_referencia(csv_ruta: Path) -> float:
    """Indexación (s) de la fila `sinruta` 1500/200 de `troceo_estructura.csv`."""
    with Path(csv_ruta).open(encoding="utf-8", newline="") as f:
        for fila in csv.DictReader(f):
            if (
                fila["troceo"] == "estructura"
                and fila["maximo"] == str(MAXIMO)
                and fila["minimo"] == str(MINIMO)
                and fila["con_ruta"] == "False"
            ):
                return float(fila["indexación (s)"])
    raise RuntimeError(f"{csv_ruta} no tiene la fila estructura {MAXIMO}/{MINIMO} sin ruta")


def crear_referencia(qdrant, cliente, chunks: list[dict], registro: Path, csv_ruta: Path = TROCEO_CSV) -> dict:
    """Crea la entrada de `nomic` sin escribir en Qdrant (RF-06): solo lee la colección y sondea Ollama."""
    modelo = MODELOS[REFERENCIA]
    coleccion = nombre_coleccion(REFERENCIA)
    comprobar_modelo(REFERENCIA, cliente)
    info = qdrant.get_collection(coleccion)
    dimension = info.config.params.vectors.size
    contexto = next(v for k, v in cliente.show(modelo["nombre"]).modelinfo.items() if k.endswith(".context_length"))
    textos = [preparar_documento(REFERENCIA, c["texto"]) for c in chunks]
    truncados = sum(
        contar_truncados(REFERENCIA, textos[i : i + LOTE], cliente, num_ctx=contexto) for i in range(0, len(textos), LOTE)
    )
    cliente.embed(model=modelo["nombre"], input=[textos[0]])
    entrada = {
        "nombre": modelo["nombre"],
        "proveedor": modelo["proveedor"],
        "coleccion": coleccion,
        "dimension": dimension,
        "num_ctx": contexto,
        "truncados": truncados,
        "tiempo_indexacion_s": _tiempo_referencia(csv_ruta),
        "dispositivo": dispositivo_ollama(cliente, modelo["nombre"]),
        "fecha": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    guardar_entrada(registro, REFERENCIA, entrada)
    return entrada


def _indexar_clave(qdrant, cliente, clave, chunks, metadatos, registro, lote):
    """Prepara el embebedor y el dispositivo de `clave` e indexa; libera lo que haya cargado en Ollama."""
    modelo = MODELOS[clave]
    if coleccion_completa(qdrant, nombre_coleccion(clave), len(chunks), registro, clave):
        return indexar_modelo(qdrant, clave, chunks, metadatos, None, registro, "", lote)
    if modelo["proveedor"] == "ollama":
        comprobar_modelo(clave, cliente)
        embeber(clave, [preparar_documento(clave, "calentamiento")], cliente)
        d = dispositivo_ollama(cliente, modelo["nombre"])
        entrada = indexar_modelo(
            qdrant, clave, chunks, metadatos, lambda t: embeber(clave, t, cliente_ollama=cliente), registro, d, lote
        )
        liberar_vram_ollama(cliente)
        return entrada
    liberar_vram_ollama(cliente)
    codificador = cargar_codificador(clave)
    d = codificador.device.type
    return indexar_modelo(
        qdrant, clave, chunks, metadatos, lambda t: embeber(clave, t, codificador=codificador), registro, d, lote
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Indexa el corpus con otros modelos de embeddings.")
    parser.add_argument("claves", nargs="*", help=f"Claves de MODELOS (distintas de {REFERENCIA}).")
    parser.add_argument("--lote", type=int, default=LOTE, help=f"Textos por lote (por defecto {LOTE}).")
    parser.add_argument("--referencia", action="store_true", help=f"Crea la entrada de {REFERENCIA} sin escribir en Qdrant.")
    args = parser.parse_args()
    if not args.claves and not args.referencia:
        parser.error("indica al menos una clave o --referencia")
    if args.lote < 1:
        parser.error("--lote debe ser al menos 1")
    try:
        validar_claves(args.claves)
    except ValueError as error:
        parser.error(str(error))

    qdrant = QdrantClient("localhost", port=6333, timeout=600)
    cliente = ollama.Client()
    chunks = trocear_por_estructura(CARPETA_CORPUS, MAXIMO, MINIMO)
    print(f"{len(chunks)} chunks; dispositivo de PyTorch: {dispositivo()}")
    try:
        if args.referencia:
            entrada = crear_referencia(qdrant, cliente, chunks, REGISTRO)
            liberar_vram_ollama(cliente)
            print(f"Entrada de {REFERENCIA} creada: {entrada['dispositivo']}, {entrada['truncados']} truncados")
        if args.claves:
            metadatos = metadatos_chunks(CARPETA_CORPUS, chunks)
            for clave in args.claves:
                entrada = _indexar_clave(qdrant, cliente, clave, chunks, metadatos, REGISTRO, args.lote)
                if entrada is not None:
                    print(
                        f"{clave}: {entrada['tiempo_indexacion_s']:.1f} s, dimensión {entrada['dimension']}, "
                        f"{entrada['truncados']} truncados, {entrada['dispositivo']}"
                    )
    except RuntimeError as error:
        raise SystemExit(f"Error: {error}") from error


if __name__ == "__main__":
    main()
