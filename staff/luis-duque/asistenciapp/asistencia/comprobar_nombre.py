"""Comprueba un nombre en el ordenador del profesor.

Habla solo con Ollama en 127.0.0.1. Si la llamada no se puede hacer, avisa
para que el registro entre igual.
"""

import json
import urllib.error
import urllib.request

URL = "http://127.0.0.1:11434/v1/systemone"
MODEL = "nimble-v3"

REAL = "real"
ALIAS = "alias"
INVALID = "invalid"


class NoSePudoComprobar(Exception):
    pass


def resultado(certeza_nombre, certeza_alias):
    """0,5 o más en el nombre real gana. Si no, el alias. Si tampoco, no es un nombre."""
    if certeza_nombre >= 0.5:
        return REAL
    if certeza_alias >= 0.5:
        return ALIAS
    return INVALID


def remember(ask):
    """Guarda el resultado mientras la app sigue abierta. La clave va en minúsculas."""
    seen = {}

    def check(name):
        key = name.casefold()
        if key in seen:
            return seen[key]
        result = ask(key)
        seen[key] = result
        return result

    return check


def clasificar(text, opener=urllib.request.urlopen):
    payload = {
        "model": MODEL,
        "state": text,
        "questions": {
            "real_name": {
                "type": "noul",
                "instructions": (
                    "Is this text a real personal name? "
                    "A short form that can be used as a real given name, such as Pepe or Dani, counts."
                ),
                "criteria": {
                    "true": "It is a real personal name.",
                    "false": "It is not a real personal name.",
                },
            },
            "alias": {
                "type": "noul",
                "instructions": (
                    "Is this text an alias or a nickname that is not a real personal name, such as el moto?"
                ),
                "criteria": {
                    "true": "It is an alias or a nickname.",
                    "false": "It is not an alias or a nickname.",
                },
            },
        },
    }
    request = urllib.request.Request(
        URL,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with opener(request) as response:
            body = json.loads(response.read().decode())
            answers = body["answers"]
            return resultado(
                float(answers["real_name"]["noul"]),
                float(answers["alias"]["noul"]),
            )
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError, TypeError, ValueError, OSError):
        raise NoSePudoComprobar() from None
