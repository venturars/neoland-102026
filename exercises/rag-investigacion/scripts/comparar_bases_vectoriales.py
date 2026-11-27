"""Compara Qdrant y Chroma como servidores con lecturas asíncronas.

Preparación única, con el servidor Chroma parado:

    uv run python scripts/comparar_bases_vectoriales.py preparar

Después se arranca Chroma y se mide:

    uv run chroma run --path notebooks/chroma_db --host 127.0.0.1 --port 8000
    uv run python scripts/comparar_bases_vectoriales.py medir

Las queries se embeben antes del cronómetro. Cada worker usa un cliente propio,
como lo harían agentes independientes. El CSV guarda tres rondas con 1, 4 y 8
workers por base.
"""

from __future__ import annotations

import argparse
import asyncio
import random
import time
from collections import Counter
from pathlib import Path

import chromadb
import ollama
import pandas as pd
from qdrant_client import AsyncQdrantClient, QdrantClient

from comparar_embeddings import MODELOS, leer_golden_set, preparar_query


RAIZ = Path(__file__).resolve().parents[1]
RUTA_CHROMA = RAIZ / "notebooks" / "chroma_db"
RUTA_GOLDEN = RAIZ / "docs" / "GOLDEN_SET_PYTHON_DOCS.md"
RUTA_CSV = RAIZ / "data" / "resultados" / "bases_vectoriales.csv"
COLECCION = "pydocs_nomic_est1500_m200_sinruta"
MODELO = "nomic"
K = 20
WORKERS = (1, 4, 8)
RONDAS = 3
REPETICIONES = 20
LOTE = 500
SEMILLA = 42


def _vector_denso(vector):
    if isinstance(vector, dict):
        if len(vector) != 1:
            raise RuntimeError("El punto de origen tiene más de un vector")
        return next(iter(vector.values()))
    return vector


def preparar_chroma() -> None:
    """Copia una vez en Chroma los vectores ya calculados en Qdrant."""
    qdrant = QdrantClient("localhost", port=6333)
    if not qdrant.collection_exists(COLECCION):
        raise RuntimeError(
            f"No existe {COLECCION}. Créala con notebooks/07_comparar_troceo_estructura.ipynb."
        )
    esperados = qdrant.count(COLECCION, exact=True).count
    cliente = chromadb.PersistentClient(path=str(RUTA_CHROMA))
    nombres = {coleccion.name for coleccion in cliente.list_collections()}
    if COLECCION in nombres:
        existentes = cliente.get_collection(COLECCION, embedding_function=None).count()
        if existentes != esperados:
            raise RuntimeError(
                f"Chroma ya tiene {COLECCION} con {existentes} puntos; se esperaban {esperados}."
            )
        print(f"Chroma ya está preparado: {existentes} puntos")
        return

    inicio = time.perf_counter()
    coleccion = cliente.create_collection(
        COLECCION,
        configuration={
            "hnsw": {
                "space": "cosine",
                "ef_construction": 100,
                "max_neighbors": 16,
                "ef_search": 100,
            }
        },
        embedding_function=None,
    )
    offset = None
    while True:
        puntos, siguiente = qdrant.scroll(
            COLECCION,
            offset=offset,
            limit=LOTE,
            with_payload=True,
            with_vectors=True,
        )
        if not puntos:
            break
        coleccion.add(
            ids=[str(punto.id) for punto in puntos],
            embeddings=[_vector_denso(punto.vector) for punto in puntos],
            documents=[punto.payload["texto"] for punto in puntos],
            metadatas=[
                {
                    "fuente": punto.payload["fuente"],
                    "ruta_titulos": punto.payload.get("ruta_titulos", ""),
                }
                for punto in puntos
            ],
        )
        if siguiente is None:
            break
        offset = siguiente
    if coleccion.count() != esperados:
        raise RuntimeError(f"Chroma tiene {coleccion.count()} puntos; se esperaban {esperados}.")
    print(f"Chroma preparado: {esperados} puntos en {time.perf_counter() - inicio:.1f} s")


def embeber_queries() -> list[list[float]]:
    preguntas = [
        pregunta
        for pregunta in leer_golden_set(RUTA_GOLDEN)
        if pregunta["categoria"] != "E"
    ]
    textos = [preparar_query(MODELO, pregunta["query"]) for pregunta in preguntas]
    return ollama.embed(model=MODELOS[MODELO]["nombre"], input=textos).embeddings


async def clientes_qdrant(n: int):
    return [
        AsyncQdrantClient(host="127.0.0.1", port=6333, timeout=30, pool_size=8)
        for _ in range(n)
    ]


async def clientes_chroma(n: int):
    colecciones = []
    for _ in range(n):
        cliente = await chromadb.AsyncHttpClient(host="127.0.0.1", port=8000)
        colecciones.append(
            await cliente.get_collection(COLECCION, embedding_function=None)
        )
    return colecciones


async def buscar_qdrant(cliente, vector: list[float]) -> list[str]:
    respuesta = await cliente.query_points(
        collection_name=COLECCION,
        query=vector,
        limit=K,
        with_payload=False,
        with_vectors=False,
    )
    return [str(punto.id) for punto in respuesta.points]


async def buscar_chroma(coleccion, vector: list[float]) -> list[str]:
    respuesta = await coleccion.query(
        query_embeddings=[vector], n_results=K, include=[]
    )
    return respuesta["ids"][0]


async def equivalencia(vectores: list[list[float]]) -> tuple[float, float]:
    qdrant = (await clientes_qdrant(1))[0]
    chroma = (await clientes_chroma(1))[0]
    top1 = []
    solapes = []
    for vector in vectores:
        ids_qdrant = await buscar_qdrant(qdrant, vector)
        ids_chroma = await buscar_chroma(chroma, vector)
        top1.append(ids_qdrant[0] == ids_chroma[0])
        solapes.append(len(set(ids_qdrant) & set(ids_chroma)) / K)
    await qdrant.close()
    return sum(top1) / len(top1), sum(solapes) / len(solapes)


async def ejecutar_worker(base, cliente, vectores, latencias, errores) -> None:
    buscar = buscar_qdrant if base == "Qdrant" else buscar_chroma
    for vector in vectores:
        inicio = time.perf_counter_ns()
        try:
            ids = await buscar(cliente, vector)
            if len(ids) != K:
                raise RuntimeError(f"la búsqueda devolvió {len(ids)} resultados")
        except Exception as error:
            errores[type(error).__name__] += 1
        else:
            latencias.append((time.perf_counter_ns() - inicio) / 1_000_000)


async def medir_ronda(base, workers, vectores, ronda) -> dict:
    clientes = (
        await clientes_qdrant(workers)
        if base == "Qdrant"
        else await clientes_chroma(workers)
    )
    buscar = buscar_qdrant if base == "Qdrant" else buscar_chroma
    await asyncio.gather(
        *[
            buscar(cliente, vectores[indice % len(vectores)])
            for indice, cliente in enumerate(clientes)
        ]
    )

    particiones = [vectores[indice::workers] for indice in range(workers)]
    latencias = []
    errores = Counter()
    inicio = time.perf_counter()
    await asyncio.gather(
        *[
            ejecutar_worker(base, cliente, lote, latencias, errores)
            for cliente, lote in zip(clientes, particiones)
        ]
    )
    duracion_s = time.perf_counter() - inicio
    if base == "Qdrant":
        await asyncio.gather(*[cliente.close() for cliente in clientes])

    intentos = len(vectores)
    exitosas = len(latencias)
    serie = pd.Series(latencias, dtype=float)
    return {
        "base": base,
        "workers": workers,
        "ronda": ronda,
        "intentos": intentos,
        "exitosas": exitosas,
        "errores": intentos - exitosas,
        "tasa error": (intentos - exitosas) / intentos,
        "duración (s)": duracion_s,
        "throughput (consultas/s)": exitosas / duracion_s,
        "latencia media (ms)": serie.mean(),
        "latencia p50 (ms)": serie.quantile(0.50),
        "latencia p95 (ms)": serie.quantile(0.95),
        "latencia p99 (ms)": serie.quantile(0.99),
        "tipos de error": ", ".join(f"{k}:{v}" for k, v in errores.items()) or "ninguno",
    }


async def medir() -> None:
    vectores_base = embeber_queries()
    carga = vectores_base * REPETICIONES
    random.Random(SEMILLA).shuffle(carga)
    top1_igual, solape_top20 = await equivalencia(vectores_base)
    filas = []
    for workers in WORKERS:
        for ronda in range(1, RONDAS + 1):
            orden = ("Qdrant", "Chroma") if ronda % 2 else ("Chroma", "Qdrant")
            for base in orden:
                fila = await medir_ronda(base, workers, carga, ronda)
                fila.update(
                    {
                        "puntos": 7955,
                        "preguntas únicas": len(vectores_base),
                        "repeticiones por pregunta": REPETICIONES,
                        "k": K,
                        "top1 igual": top1_igual,
                        "solape top20": solape_top20,
                    }
                )
                filas.append(fila)
                print(
                    base,
                    f"workers={workers}",
                    f"ronda={ronda}",
                    f"p95={fila['latencia p95 (ms)']:.1f} ms",
                    f"qps={fila['throughput (consultas/s)']:.1f}",
                    f"errores={fila['errores']}",
                )

    resultado = pd.DataFrame(filas)
    if resultado["errores"].sum() != 0 or resultado.isna().any().any():
        raise RuntimeError("El benchmark tuvo errores o produciría celdas vacías.")
    RUTA_CSV.parent.mkdir(parents=True, exist_ok=True)
    resultado.to_csv(RUTA_CSV, index=False)
    print(f"Guardado {RUTA_CSV.relative_to(RAIZ)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("accion", choices=("preparar", "medir"))
    args = parser.parse_args()
    if args.accion == "preparar":
        preparar_chroma()
    else:
        asyncio.run(medir())


if __name__ == "__main__":
    main()
