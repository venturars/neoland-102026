"""Existencia, cierre y validez de un registro de asistencia."""

from .codes import is_valid_code
from .names import clean_name


class SessionNotFound(Exception):
    """La clase solicitada no existe."""


class SessionClosed(Exception):
    """La clase no admite más registros."""


class InvalidCode(Exception):
    """El código no corresponde a una ventana aceptada."""


def require_session(session: dict | None) -> dict:
    """Exige una sesión existente sin consultar datos.

    :param session: datos de la sesión o None.
    :return: la misma sesión; lanza SessionNotFound si falta.
    :rtype: dict

    Usage::

        require_session(session)
    """
    if session is None:
        raise SessionNotFound("Esta clase no existe. Revisa el enlace.")
    return session


def validate_check_in(session: dict | None, fields: dict, now: float) -> str:
    """Valida en el orden de las reglas originales.

    :param session: sesión obtenida por quien llama.
    :param fields: datos recibidos con nombre y código.
    :param now: instante Unix de validación.
    :return: nombre recortado; lanza el error de la primera regla incumplida.
    :rtype: str

    Usage::

        validate_check_in(session, {"name": "Ana", "code": code}, 1800000000.0)
    """
    session = require_session(session)
    if session["closed_at"] is not None:
        raise SessionClosed("La asistencia de esta clase ya está cerrada.")
    name = clean_name(fields.get("name"))
    if not is_valid_code(session["secret"], fields.get("code", ""), now):
        raise InvalidCode("El código no es válido o ha caducado. Pide el código actual al profesor.")
    return name
