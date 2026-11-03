"""Reglas de una clase: si existe, si sigue abierta y si el código vale.

Cada regla lanza su propio error con el mensaje que ve el alumno. Quien la
llama decide cómo mostrarlo.

Usage::

  >>> session = require_session(store_row)
  >>> require_open(session)
  >>> require_valid_code(session, "0427", time.time())
"""

from asistencia.domain.codes import is_valid_code


class SessionNotFound(Exception):
    """La clase no existe."""

    def __init__(self) -> None:
        super().__init__("Esta clase no existe. Revisa el enlace.")


class SessionClosed(Exception):
    """La asistencia de la clase ya está cerrada."""

    def __init__(self) -> None:
        super().__init__("La asistencia de esta clase ya está cerrada.")


class InvalidCode(Exception):
    """El código no es el vigente ni el anterior."""

    def __init__(self) -> None:
        super().__init__("El código no es válido o ha caducado. Pide el código actual al profesor.")


def is_open(session: dict) -> bool:
    """Dice si la clase acepta registros.

    :param session: clase con la clave ``closed_at``.
    :return: ``True`` si no se ha cerrado.
    :rtype: bool

    Usage::

      >>> is_open({"closed_at": None})
      True
    """
    return session["closed_at"] is None


def require_session(session: dict | None) -> dict:
    """Devuelve la clase si existe.

    :param session: clase leída, o ``None`` si no se encontró.
    :return: la misma clase.
    :rtype: dict
    :raises SessionNotFound: si es ``None``.

    Usage::

      >>> session = require_session(sqlite_store.get_session(conn, session_id))
    """
    if session is None:
        raise SessionNotFound()
    return session


def require_open(session: dict) -> None:
    """Comprueba que la clase sigue abierta.

    :param session: clase con la clave ``closed_at``.
    :raises SessionClosed: si ya se cerró.

    Usage::

      >>> require_open(session)
    """
    if not is_open(session):
        raise SessionClosed()


def require_valid_code(session: dict, code: str, t: float) -> None:
    """Comprueba que el código escrito vale para esta clase en el instante ``t``.

    :param session: clase con la clave ``secret``.
    :param code: código que escribió el alumno.
    :param t: instante en segundos Unix.
    :raises InvalidCode: si no es el vigente ni el anterior.

    Usage::

      >>> require_valid_code(session, "0427", time.time())
    """
    if not is_valid_code(session["secret"], code, t):
        raise InvalidCode()
