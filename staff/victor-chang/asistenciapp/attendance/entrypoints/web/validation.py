"""Lectura de lo que llega en una petición (spec 005 · plan §2.6; ARCHITECTURE.md · E1). T12 lo hace estricto."""

from typing import Any

from flask import request


def json_body() -> dict[str, Any]:
    """El cuerpo JSON si es un objeto. Temporal hasta T12: cualquier otra cosa cuenta como vacío."""
    body = request.get_json(silent=True)
    return body if isinstance(body, dict) else {}
