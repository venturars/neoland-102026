"""La llamada a Ollama solo sale hacia 127.0.0.1."""

import json
import urllib.error

import pytest

from asistencia.comprobar_nombre import (
    ALIAS,
    INVALID,
    REAL,
    URL,
    NoSePudoComprobar,
    clasificar,
    resultado,
)


def test_half_or_more_is_a_real_name():
    assert resultado(0.5, 0.9) == REAL
    assert resultado(0.49, 0.9) == ALIAS
    assert resultado(0.49, 0.49) == INVALID


class Response:
    def __init__(self, payload):
        self.payload = json.dumps(payload).encode()

    def read(self):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False


def test_call_stays_on_localhost():
    seen = {}

    def opener(request):
        seen["url"] = request.full_url
        seen["body"] = json.loads(request.data.decode())
        return Response(
            {"answers": {"real_name": {"noul": 0.8}, "alias": {"noul": 0.1}}}
        )

    assert clasificar("Ana García", opener) == REAL
    assert seen["url"] == URL
    assert seen["url"].startswith("http://127.0.0.1:11434/")
    assert seen["body"]["model"] == "nimble-v3"
    assert "11434" not in seen["url"].split("127.0.0.1", 1)[0]


def test_failure_means_the_check_could_not_run():
    def opener(request):
        raise urllib.error.URLError("ollama no responde")

    with pytest.raises(NoSePudoComprobar):
        clasificar("Ana", opener)
