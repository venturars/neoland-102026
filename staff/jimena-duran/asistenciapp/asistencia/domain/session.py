"""Reglas de existencia y validez de una sesión de asistencia."""
from asistencia.domain.codes import is_valid_code
from asistencia.domain.names import clean_name

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."

class SessionNotFound(ValueError):
    """La sesión solicitada no existe."""

class SessionClosed(ValueError):
    """La sesión ya no acepta registros."""

class InvalidCode(ValueError):
    """El código no es válido en este instante."""

def require_session(session: dict | None) -> dict:
    """Exige una sesión existente.

    :param session: sesión o ausencia de ella.
    :return: sesión existente.
    :rtype: dict

    Usage::

      session = require_session(row)
    """
    if session is None:
        raise SessionNotFound(NOT_FOUND)
    return session

def validate_checkin(session: dict, name: str, code: str, instant: float) -> str:
    """Valida estado, nombre y código en el orden original.

    :param session: sesión existente.
    :param name: nombre recibido.
    :param code: código recibido.
    :param instant: instante del reloj.
    :return: nombre limpio.
    :rtype: str

    Usage::

      name = validate_checkin(session, name, code, now)
    """
    if session["closed_at"] is not None:
        raise SessionClosed(CLOSED)
    name = clean_name(name)
    if not is_valid_code(session["secret"], code, instant):
        raise InvalidCode(INVALID_CODE)
    return name
