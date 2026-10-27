import ollama

from settings import MODEL, QUERY_INSTRUCTION


def embed_texts(texts: list[str], is_query: bool) -> list[list[float]]:
    if len(texts) == 0:
        raise RuntimeError("No texts to embed")

    inputs = texts
    if is_query:
        inputs = [f"Instruct: {QUERY_INSTRUCTION}\nQuery:{text}" for text in texts]

    try:
        response = ollama.embed(model=MODEL, input=inputs, truncate=False)
    except ConnectionError:
        raise RuntimeError("Ollama is not running. Start it and try again")

    embeddings = [list(vector) for vector in response.embeddings]
    return embeddings
