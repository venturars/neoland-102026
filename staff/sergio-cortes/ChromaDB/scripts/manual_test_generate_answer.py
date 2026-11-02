import sys

from generate_answer import generate_answer


def manual_test_generate_answer() -> None:
    sys.stdout.reconfigure(encoding="utf-8")

    messages = [
        {
            "role": "system",
            "content": "You are an assistant for the official Python documentation.",
        },
        {
            "role": "user",
            "content": "What does Path.read_text() do?",
        },
    ]

    answer = generate_answer(messages)

    print("Answer:")
    print(answer)
    print()

    if not isinstance(answer, str):
        raise RuntimeError(f"Expected str, got {type(answer)!r}")
    if answer.strip() == "":
        raise RuntimeError("Answer is empty")

    print("All checks passed.")


if __name__ == "__main__":
    manual_test_generate_answer()
