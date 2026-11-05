import ollama

from settings import MODEL, NUM_CTX, QUERY_INSTRUCTION


def embed_texts(texts: list[str], is_query: bool) -> list[list[float]]:
    if len(texts) == 0:
        raise RuntimeError("No texts to embed")

    inputs = texts
    if is_query:
        inputs = [
            f"Instruct: {QUERY_INSTRUCTION}\nQuery:{text}" for text in texts
        ]

    try:
        response = ollama.embed(
            model=MODEL,
            input=inputs,
            truncate=False,
            options={"num_ctx": NUM_CTX},
        )
    except ConnectionError:
        raise RuntimeError("Ollama is not running. Start it and try again")
    except ollama.ResponseError as error:
        if "context length" in str(error):
            raise RuntimeError(
                f"A text is longer than {NUM_CTX} tokens. "
                "Raise NUM_CTX in scripts/settings.py"
            )
        if "not found" in str(error):
            raise RuntimeError(
                f"Model {MODEL} not found. Run: ollama pull {MODEL}"
            )
        raise

    embeddings = [list(vector) for vector in response.embeddings]
    return embeddings
