"""Reglas de una clase: existe, sigue abierta y el código presentado vale.

Estas comprobaciones reciben datos ya cargados. No abren una base y no
hablan con el navegador.
"""

from asistencia.domain.codes import is_valid_code


class SessionNotFound(Exception):
    """La clase no existe."""


class SessionClosed(Exception):
    """La clase ya está cerrada."""


class InvalidCode(Exception):
    """El código no es el vigente ni el de la ventana anterior."""


def require_session(session: dict | None) -> dict:
    """Comprueba que la clase cargada exista.

    :param session: Clase ya leída, o None si no estaba.
    :return: La misma clase.
    :rtype: dict
    :raises SessionNotFound: Si no hay clase.

    Usage::

        require_session({"id": "abc", "closed_at": None})
    """
    if session is None:
        raise SessionNotFound("Esta clase no existe.")
    return session


def require_open(session: dict) -> None:
    """Comprueba que la clase siga admitiendo registros.

    :param session: Clase ya leída, con closed_at.
    :return: Nada.
    :rtype: None
    :raises SessionClosed: Si closed_at tiene un valor.
    """
    if session["closed_at"] is not None:
        raise SessionClosed("La clase ya está cerrada.")


def require_code(session: dict, code: object, now: float) -> None:
    """Comprueba que el código presentado esté vigente.

    :param session: Clase ya leída, con su secreto.
    :param code: Código presentado.
    :param now: Segundos Unix.
    :return: Nada.
    :rtype: None
    :raises InvalidCode: Si el código no vale.

    Usage::

        require_code(clase, "1234", reloj())
    """
    if not is_valid_code(session["secret"], code, now):
        raise InvalidCode("El código no es válido.")
