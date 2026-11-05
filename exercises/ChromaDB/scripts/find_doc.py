import chromadb

from settings import COLLECTION, DB_DIR


def find_doc(name: str) -> list[dict]:
    if name.strip() == "":
        raise RuntimeError("The name is empty")

    client = chromadb.PersistentClient(path=str(DB_DIR))
    existing = [collection.name for collection in client.list_collections()]
    if COLLECTION not in existing:
        raise RuntimeError("Index not found. Run scripts/build_index.py")
    collection = client.get_collection(COLLECTION, embedding_function=None)

    # Búsqueda exacta por nombre, sin vectores.
    # El nombre tiene que estar en la lista anchors.
    response = collection.get(
        where={"anchors": {"$contains": name.strip()}},
        include=["documents", "metadatas"],
    )

    results = []
    for position in range(len(response["ids"])):
        results.append(
            {
                "id": response["ids"][position],
                "text": response["documents"][position],
                "metadata": response["metadatas"][position],
            }
        )
    results.sort(key=lambda result: result["id"])
    return results
