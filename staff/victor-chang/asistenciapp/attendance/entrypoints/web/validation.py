"""Forma y tipo de lo que llega en una petición (spec 005 · plan §2.6 · CA-06; ARCHITECTURE.md · E1).

Lo que no tiene la forma esperada se rechaza con MalformedRequestError (400), y nada se convierte:
un número no se acepta donde se espera texto. Las reglas del significado (un nombre vacío, un
código caducado) las decide el dominio (E2).
"""

from typing import Any

from flask import request

from attendance.entrypoints.web.errors import MalformedRequestError


def json_object() -> dict[str, Any]:
    """El cuerpo de la petición como objeto JSON; sin cuerpo, un objeto vacío.

    Raises:
        MalformedRequestError: hay cuerpo, pero no es un objeto JSON.
    """
    if not request.get_data():
        return {}
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        raise MalformedRequestError
    return body


def optional_str(body: dict[str, Any], key: str) -> str:
    """El campo de texto `key`; si no está, texto vacío.

    Raises:
        MalformedRequestError: el campo está, pero no es texto.
    """
    if key not in body:
        return ""
    value = body[key]
    if not isinstance(value, str):
        raise MalformedRequestError
    return value
