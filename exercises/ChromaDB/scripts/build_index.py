import time
from collections import Counter

import chromadb

from embed_texts import embed_texts
from settings import BATCH_SIZE, COLLECTION, DB_DIR, MD_DIR
from split_doc import split_doc


def build_index() -> None:
    if not MD_DIR.is_dir():
        raise RuntimeError(f"Markdown folder not found: {MD_DIR}. Run scripts/convert_docs.py")

    start = time.time()
    md_paths = sorted(path for path in MD_DIR.rglob("*.md") if path.name != "LICENSE.md")
    chunks = []
    for md_path in md_paths:
        chunks = chunks + split_doc(md_path)
    print(f"Chunks: {len(chunks)}")

    client = chromadb.PersistentClient(path=str(DB_DIR))
    # Se rehace entera para que no queden fragmentos de páginas que ya no existen
    existing = [collection.name for collection in client.list_collections()]
    if COLLECTION in existing:
        client.delete_collection(COLLECTION)
    collection = client.create_collection(
        COLLECTION,
        embedding_function=None,
        configuration={"hnsw": {"space": "cosine"}},
    )

    for batch_start in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[batch_start:batch_start + BATCH_SIZE]
        texts = [chunk["text"] for chunk in batch]
        collection.add(
            ids=[chunk["id"] for chunk in batch],
            documents=texts,
            metadatas=[chunk["metadata"] for chunk in batch],
            embeddings=embed_texts(texts, False),
        )
        done = batch_start + len(batch)
        if done % (BATCH_SIZE * 50) < BATCH_SIZE or done == len(chunks):
            print(f"  {done}/{len(chunks)}  {time.time() - start:.0f} s")

    areas = Counter(chunk["metadata"]["area"] for chunk in chunks)
    for area, count in areas.most_common():
        print(f"{area:<14}{count:>7}")
    print(f"Collection {COLLECTION}: {collection.count()} chunks")
    print(f"Time: {time.time() - start:.0f} s")


if __name__ == "__main__":
    build_index()
