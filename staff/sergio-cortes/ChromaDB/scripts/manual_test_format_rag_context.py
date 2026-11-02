import json
import sys

from format_rag_context import format_rag_context


def manual_test_format_rag_context() -> None:
    sys.stdout.reconfigure(encoding="utf-8")

    question = "How do I read a text file with pathlib?"
    results = [
        {
            "id": "library/pathlib.html#pathlib.Path.read_text:0",
            "text": "pathlib > Path > read_text\n\nRead the file as text.",
            "metadata": {
                "page": "library/pathlib.html",
                "area": "library",
                "kind": "api",
                "breadcrumb": "pathlib > Path > read_text",
                "version": "3.15",
                "anchor": "pathlib.Path.read_text",
            },
            "distance": 0.21,
        },
        {
            "id": "tutorial/introduction.html#:0",
            "text": "Tutorial > Introduction\n\nPython is an easy to learn language.",
            "metadata": {
                "page": "tutorial/introduction.html",
                "area": "tutorial",
                "kind": "guide",
                "breadcrumb": "Tutorial > Introduction",
                "version": "3.15",
            },
            "distance": 0.55,
        },
    ]

    messages = format_rag_context(question, results)

    print("Returned messages:")
    print(json.dumps(messages, indent=2, ensure_ascii=False))
    print()

    if len(messages) != 2:
        raise RuntimeError(f"Expected 2 messages, got {len(messages)}")
    if messages[0]["role"] != "system":
        raise RuntimeError(f"Expected first role 'system', got {messages[0]['role']!r}")
    if messages[1]["role"] != "user":
        raise RuntimeError(f"Expected second role 'user', got {messages[1]['role']!r}")

    user_content = messages[1]["content"]
    if "Read the file as text." not in user_content:
        raise RuntimeError("First fragment text not found in user message")
    if "Python is an easy to learn language." not in user_content:
        raise RuntimeError("Second fragment text not found in user message")

    source_with_anchor = "--- Source: library/pathlib.html#pathlib.Path.read_text ---"
    source_without_anchor = "--- Source: tutorial/introduction.html ---"
    if source_with_anchor not in user_content:
        raise RuntimeError(f"Expected source line with anchor: {source_with_anchor!r}")
    if source_without_anchor not in user_content:
        raise RuntimeError(f"Expected source line without anchor: {source_without_anchor!r}")

    print("All checks passed.")


if __name__ == "__main__":
    manual_test_format_rag_context()
