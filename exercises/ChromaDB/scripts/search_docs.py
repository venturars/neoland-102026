import chromadb

from embed_texts import embed_texts
from settings import COLLECTION, DB_DIR


def search_docs(
    query: str, n: int, area: str | None, module: str | None, kind: str | None
) -> list[dict]:
    if query.strip() == "":
        raise RuntimeError("The question is empty")
    if n < 1:
        raise RuntimeError("The number of results must be 1 or more")

    client = chromadb.PersistentClient(path=str(DB_DIR))
    existing = [collection.name for collection in client.list_collections()]
    if COLLECTION not in existing:
        raise RuntimeError("Index not found. Run scripts/build_index.py")
    collection = client.get_collection(COLLECTION, embedding_function=None)

    filters = []
    if area:
        filters.append({"area": area})
    if module:
        filters.append({"module": module})
    if kind:
        filters.append({"kind": kind})
    where = None
    if len(filters) == 1:
        where = filters[0]
    if len(filters) > 1:
        where = {"$and": filters}

    response = collection.query(
        query_embeddings=embed_texts([query], True),
        n_results=n,
        where=where,
        include=["documents", "metadatas", "distances"],
    )

    results = []
    for position in range(len(response["ids"][0])):
        results.append(
            {
                "id": response["ids"][0][position],
                "text": response["documents"][0][position],
                "metadata": response["metadatas"][0][position],
                "distance": response["distances"][0][position],
            }
        )
    return results
