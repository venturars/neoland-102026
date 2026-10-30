"""Decisiones de negocio sobre una sesión de asistencia y sus errores (CA-05)."""

from asistencia.domain.codes import is_valid_code
from asistencia.domain.roster import (
    ARCHIVED,
    EMPTY_GROUP,
    HAS_OPEN_SESSION,
    EmptyGroup,
    GroupArchived,
    GroupHasOpenSession,
)

NOT_FOUND = "Esta clase no existe. Revisa el enlace."
CLOSED = "La asistencia de esta clase ya está cerrada."
INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CHECKIN_NOT_FOUND = "Ese registro no existe en esta clase."


class SessionNotFound(LookupError):
    """La sesión pedida no existe."""


class SessionClosed(Exception):
    """La sesión ya no admite registros."""


class InvalidCode(Exception):
    """El código no vale o ha caducado."""


class CheckinNotFound(LookupError):
    """El registro no existe en esa sesión."""


def ensure_exists(session: dict | None) -> dict:
    """Comprueba que la sesión existe.

    :param session: la sesión que devolvió el almacenamiento, o ``None``.
    :return: la misma sesión.
    :rtype: dict
    :raises SessionNotFound: si ``session`` es ``None``.

    Usage::

        >>> ensure_exists({"id": "abc"})
        {'id': 'abc'}
    """
    if session is None:
        raise SessionNotFound(NOT_FOUND)
    return session


def ensure_open(session: dict) -> None:
    """Comprueba que la sesión admite registros (CA-09).

    :param session: la sesión, con su campo ``closed_at``.
    :return: nada si está abierta.
    :rtype: None
    :raises SessionClosed: si la sesión ya está cerrada.

    Usage::

        >>> ensure_open({"closed_at": None})
    """
    if session["closed_at"] is not None:
        raise SessionClosed(CLOSED)


def ensure_valid_code(session: dict, code: str, t: float) -> None:
    """Comprueba el código escrito por el alumno (CA-06).

    :param session: la sesión, con su campo ``secret``.
    :param code: el código que escribió el alumno.
    :param t: instante en segundos Unix.
    :return: nada si el código vale.
    :rtype: None
    :raises InvalidCode: si el código no vale o ha caducado.

    Usage::

        >>> ensure_valid_code({"secret": b"s"}, "x", 0.0)  # doctest: +SKIP
    """
    if not is_valid_code(session["secret"], code, t):
        raise InvalidCode(INVALID_CODE)


def ensure_can_open(group: dict, student_count: int) -> None:
    """Comprueba que se puede abrir una sesión con el grupo (spec 007, RF-5, RF-8b, CA-19).

    :param group: el grupo, con su campo ``archived_at``.
    :param student_count: alumnos que tiene el grupo.
    :return: nada si se puede abrir.
    :rtype: None
    :raises GroupArchived: si el grupo está archivado.
    :raises EmptyGroup: si el grupo no tiene alumnos.

    Usage::

        >>> ensure_can_open({"archived_at": None}, 3)
    """
    if group["archived_at"] is not None:
        raise GroupArchived(ARCHIVED)
    if student_count == 0:
        raise EmptyGroup(EMPTY_GROUP)


def ensure_can_delete(open_sessions: int) -> None:
    """Comprueba que se puede borrar un grupo (spec 007, RF-6, CA-09).

    :param open_sessions: sesiones abiertas del grupo.
    :return: nada si se puede borrar.
    :rtype: None
    :raises GroupHasOpenSession: si tiene alguna sesión abierta.

    Usage::

        >>> ensure_can_delete(0)
    """
    if open_sessions:
        raise GroupHasOpenSession(HAS_OPEN_SESSION)
