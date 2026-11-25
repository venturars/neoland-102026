"""Ejecuta el golden set con el paso final «consultar el RAG».

Uso: uv run python scripts/validar_rag_final.py
"""

from __future__ import annotations

import time
from pathlib import Path

import pandas as pd

from comparar_embeddings import (
    calcular_metricas,
    leer_evidencias,
    leer_golden_set,
    rango_primer_acierto,
    rango_primer_acierto_evidencia,
)
from consultar_rag import ConsultorRAG


RAIZ = Path(__file__).resolve().parents[1]
GOLDEN = RAIZ / "docs" / "GOLDEN_SET_PYTHON_DOCS.md"
EVIDENCIAS = RAIZ / "docs" / "golden_set_evidencias.json"
SALIDA = RAIZ / "data" / "resultados" / "validacion_final.csv"
K = 4


def main() -> None:
    preguntas = leer_golden_set(GOLDEN)
    evidencias = leer_evidencias(EVIDENCIAS)
    consultor = ConsultorRAG.local()

    filas = []
    for pregunta in preguntas:
        inicio = time.perf_counter()
        resultados = consultor.consultar(pregunta["query"])
        latencia_ms = (time.perf_counter() - inicio) * 1000
        rango = None
        rango_evidencia = None
        if pregunta["fuentes"]:
            rango = rango_primer_acierto(
                [resultado["fuente"] for resultado in resultados], pregunta["fuentes"]
            )
            rango_evidencia = rango_primer_acierto_evidencia(
                resultados, evidencias[pregunta["id"]]
            )
        filas.append(
            {
                "id": pregunta["id"],
                "categoría": pregunta["categoria"],
                "rango fuente": rango,
                "rango evidencia": rango_evidencia,
                "latencia total (ms)": latencia_ms,
                "primera fuente": resultados[0]["fuente"] if resultados else "",
                "primer score reranking": (
                    resultados[0]["score_reranking"] if resultados else None
                ),
            }
        )

    df = pd.DataFrame(filas)
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(SALIDA, index=False)

    evaluadas = df[df["categoría"] != "E"]
    rangos = [None if pd.isna(valor) else int(valor) for valor in evaluadas["rango fuente"]]
    rangos_evidencia = [
        None if pd.isna(valor) else int(valor)
        for valor in evaluadas["rango evidencia"]
    ]
    fuente = calcular_metricas(rangos, K)
    evidencia = calcular_metricas(rangos_evidencia, K)
    print("Preguntas A-D:", len(evaluadas))
    print("Fuente:", fuente)
    print("Evidencia:", evidencia)
    print(f"Latencia media total: {evaluadas['latencia total (ms)'].mean():.1f} ms")
    print(f"Guardado {SALIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
