import ollama

from settings import CHAT_MODEL


def generate_answer(messages: list[dict]) -> str:
    if len(messages) == 0:
        raise RuntimeError("No messages to send")

    try:
        response = ollama.chat(model=CHAT_MODEL, messages=messages)
    except ConnectionError:
        raise RuntimeError("Ollama is not running. Start it and try again")
    except ollama.ResponseError as error:
        if "not found" in str(error):
            raise RuntimeError(f"Model {CHAT_MODEL} not found. Run: ollama pull {CHAT_MODEL}")
        raise

    return response.message.content
