"""Forma y tipo de lo que llega en una petición (spec 005 · plan §2.6 · CA-06; ARCHITECTURE.md · E1).

Lo que no tiene la forma esperada se rechaza con MalformedRequestError (400), y nada se convierte:
un número no se acepta donde se espera texto. Las reglas del significado (un nombre vacío, un
código caducado) las decide el dominio (E2).
"""

from enum import StrEnum
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


def choice[E: StrEnum](body: dict[str, Any], key: str, kind: type[E], default: E | None = None) -> E:
    """El campo `key` como uno de los valores de `kind`; si no está, `default` (spec 004 · plan §4).

    Raises:
        MalformedRequestError: el campo no es uno de esos valores, o falta y no tiene valor por defecto.
    """
    if key not in body and default is not None:
        return default
    value = body.get(key)
    if not isinstance(value, str) or value not in kind:
        raise MalformedRequestError
    return kind(value)
