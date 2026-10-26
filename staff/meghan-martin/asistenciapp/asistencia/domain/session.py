"""Reglas de una clase: si existe, si sigue abierta y si el código vale.

Ejemplo: require_session(cargada) devuelve la clase o avisa que no está.
"""

from asistencia.domain.codes import is_valid_code

NOT_FOUND = "Esta clase no existe. Revisa el enlace."
CLOSED = "La asistencia de esta clase ya está cerrada."
INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."


class SessionNotFound(Exception):
    """La clase no existe."""

    def __init__(self) -> None:
        super().__init__(NOT_FOUND)


class SessionClosed(Exception):
    """La asistencia de esta clase ya está cerrada."""

    def __init__(self) -> None:
        super().__init__(CLOSED)


class InvalidCode(Exception):
    """El código no es válido o ha caducado."""

    def __init__(self) -> None:
        super().__init__(INVALID_CODE)


def require_session(session: dict | None) -> dict:
    """Devuelve la clase si está cargada.

    Recibe la clase o None. Devuelve la misma clase.
    Ejemplo: require_session(cargada).
    """
    if session is None:
        raise SessionNotFound()
    return session


def ensure_open(session: dict) -> None:
    """Avisa si la clase ya se cerró.

    Recibe la clase. No devuelve nada si sigue abierta.
    Ejemplo: ensure_open(clase).
    """
    if session["closed_at"] is not None:
        raise SessionClosed()


def ensure_code(secret: bytes, code: str, t: float) -> None:
    """Avisa si el código no vale en ese instante.

    Recibe el secreto, el código escrito y el instante en segundos.
    No devuelve nada si el código vale.
    Ejemplo: ensure_code(secreto, codigo, ahora).
    """
    if not is_valid_code(secret, code, t):
        raise InvalidCode()
