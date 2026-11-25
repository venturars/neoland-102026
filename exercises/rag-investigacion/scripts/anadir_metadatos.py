"""Añade los metadatos de cada chunk al payload de la colección final (issue #26).

Uso:

    uv run python scripts/anadir_metadatos.py

No recalcula vectores ni borra la colección. Antes de escribir comprueba que la colección
tiene un punto por chunk y que `fuente` y `texto` de cada id coinciden; si algo no cuadra,
para sin escribir. Después crea un snapshot, escribe el payload y los índices keyword de
`modulo` y `tipo_pagina`. Ejecutarlo dos veces deja el mismo payload.
"""

from __future__ import annotations

from pathlib import Path

from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType, SetPayload, SetPayloadOperation

from comparar_embeddings import trocear_por_estructura
from metadatos import metadatos_chunks


COLECCION = "pydocs_nomic_est1500_m200_sinruta"
RAIZ = Path(__file__).resolve().parent.parent
CARPETA_CORPUS = RAIZ / "data" / "python-docs-3.15" / "python-3.15-docs-md-clean"
MAXIMO = 1500
MINIMO = 200
LOTE = 500
CAMPOS_INDICE = ("modulo", "tipo_pagina")


def _comprobar(qdrant, coleccion: str, chunks: list[dict]) -> None:
    """Lanza RuntimeError si la colección no cuadra con los chunks. No escribe."""
    try:
        puntos = qdrant.count(coleccion, exact=True).count
    except Exception as error:
        raise RuntimeError(f"Qdrant no tiene la colección {coleccion}: {error}") from error
    if puntos != len(chunks):
        raise RuntimeError(
            f"{coleccion} tiene {puntos} puntos y el troceo {len(chunks)} chunks; no se escribe nada"
        )
    por_id = {c["id"]: c for c in chunks}
    vistos: set = set()
    offset = None
    while True:
        registros, offset = qdrant.scroll(
            coleccion, limit=256, offset=offset, with_payload=True, with_vectors=False
        )
        for r in registros:
            chunk = por_id.get(r.id)
            payload = r.payload or {}
            if chunk is None:
                raise RuntimeError(f"El id {r.id} de la colección no existe en el troceo; no se escribe nada")
            if payload.get("fuente") != chunk["fuente"] or payload.get("texto") != chunk["texto"]:
                raise RuntimeError(
                    f"El id {r.id} no coincide con el chunk (fuente o texto); no se escribe nada"
                )
            vistos.add(r.id)
        if offset is None:
            break
    if len(vistos) != len(chunks):
        faltan = sorted(set(por_id) - vistos)
        raise RuntimeError(f"Faltan en la colección los ids {faltan[:5]}; no se escribe nada")


def anadir_metadatos(qdrant, carpeta: Path, coleccion: str = COLECCION) -> int:
    """Añade los seis metadatos al payload de `coleccion`. Devuelve los puntos actualizados."""
    chunks = trocear_por_estructura(Path(carpeta), MAXIMO, MINIMO)
    _comprobar(qdrant, coleccion, chunks)
    metadatos = metadatos_chunks(Path(carpeta), chunks)
    snapshot = qdrant.create_snapshot(coleccion)
    anadir_metadatos.ultimo_snapshot = getattr(snapshot, "name", None)
    ids = sorted(metadatos)
    for i in range(0, len(ids), LOTE):
        operaciones = [
            SetPayloadOperation(set_payload=SetPayload(payload=metadatos[id_], points=[id_]))
            for id_ in ids[i : i + LOTE]
        ]
        qdrant.batch_update_points(coleccion, operaciones, wait=True)
    for campo in CAMPOS_INDICE:
        qdrant.create_payload_index(coleccion, campo, field_schema=PayloadSchemaType.KEYWORD, wait=True)
    return len(ids)


def main() -> None:
    qdrant = QdrantClient("localhost", port=6333, timeout=600)
    n = anadir_metadatos(qdrant, CARPETA_CORPUS)
    print(f"Metadatos añadidos a {n} puntos de {COLECCION}")
    print(f"Snapshot: {anadir_metadatos.ultimo_snapshot}")
    print(f"Índices keyword: {', '.join(CAMPOS_INDICE)}")


if __name__ == "__main__":
    main()
