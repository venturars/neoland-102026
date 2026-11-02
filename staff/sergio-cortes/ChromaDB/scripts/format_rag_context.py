from settings import VERSION


def format_rag_context(question: str, results: list[dict]) -> list[dict]:
    if question.strip() == "":
        raise RuntimeError("The question is empty")
    if len(results) == 0:
        raise RuntimeError("No results to format")

    docs_name = "Python documentation"
    if VERSION != "":
        docs_name = f"Python {VERSION} documentation"

    system_content = (
        f"You are an assistant for the official {docs_name}. "
        "Answer the user's question using only the passages provided below. "
        "When you use information from a passage, cite its source (page#anchor). "
        "If the passages do not contain enough information, say so and do not invent APIs or behavior."
    )

    passage_blocks = []
    for result in results:
        metadata = result["metadata"]
        source = metadata["page"]
        if "anchor" in metadata:
            source = f"{source}#{metadata['anchor']}"
        block = f"--- Source: {source} ---\n{result['text']}"
        passage_blocks.append(block)

    passages_text = "\n\n".join(passage_blocks)
    user_content = f"Question:\n{question.strip()}\n\nDocumentation passages:\n\n{passages_text}"

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content},
    ]
    return messages
