from format_rag_context import format_rag_context
from generate_answer import generate_answer
from search_docs import search_docs


def ask_docs(
    question: str,
    n: int = 5,
    area: str | None = None,
    module: str | None = None,
    kind: str | None = None,
) -> str:
    results = search_docs(question, n, area, module, kind)
    if len(results) == 0:
        return "No relevant documentation was found. Try a different question or remove filters."

    messages = format_rag_context(question, results)
    answer = generate_answer(messages)
    return answer
