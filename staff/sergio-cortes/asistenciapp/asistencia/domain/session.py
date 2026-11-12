"""Reglas de una clase: si existe, si sigue abierta y si el código vale.

Usage::

  session = require_session(loaded)
  ensure_open(session)
  ensure_code(session["secret"], code, now)
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
    """Devuelve la sesión, o avisa si no está.

    :param session: sesión cargada, o None si no existe.
    :return: la misma sesión.
    :rtype: dict
    :raises SessionNotFound: si no hay sesión.

    Usage::

      session = require_session(loaded)
    """
    if session is None:
        raise SessionNotFound()
    return session


def ensure_open(session: dict) -> None:
    """Avisa si la clase ya está cerrada.

    :param session: sesión con la clave ``closed_at``.
    :return: None si sigue abierta.
    :rtype: None
    :raises SessionClosed: si ``closed_at`` tiene valor.

    Usage::

      ensure_open(session)
    """
    if session["closed_at"] is not None:
        raise SessionClosed()


def ensure_code(secret: bytes, code: str, t: float) -> None:
    """Avisa si el código no vale en ese instante.

    :param secret: secreto de la sesión, en bytes.
    :param code: código que escribió el alumno.
    :param t: instante Unix, en segundos.
    :return: None si el código vale.
    :rtype: None
    :raises InvalidCode: si no es el de esta ventana ni el de la anterior.

    Usage::

      ensure_code(secret, code, now)
    """
    if not is_valid_code(secret, code, t):
        raise InvalidCode()
