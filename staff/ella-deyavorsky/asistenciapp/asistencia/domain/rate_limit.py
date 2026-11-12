"""Regla del límite de intentos de registro por IP y su error (spec 006)."""

MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20

BAN_MESSAGE = (
    "Tu IP ha sido bloqueada por hacer demasiados intentos de registro. "
    "Si es un error, avisa al profesor."
)


class IpBanned(Exception):
    """La IP está en la lista negra y no puede registrarse."""


def is_over_limit(in_last_second: int, in_last_minute: int) -> bool:
    """Dice si una IP se ha pasado de los límites (CA-02, CA-04).

    :param in_last_second: intentos de la IP en el último segundo, contando el actual.
    :param in_last_minute: intentos de la IP en el último minuto, contando el actual.
    :return: ``True`` si supera 5 por segundo o 20 por minuto.
    :rtype: bool

    Usage::

        >>> is_over_limit(5, 5)
        False
        >>> is_over_limit(6, 6)
        True
    """
    return in_last_second > MAX_PER_SECOND or in_last_minute > MAX_PER_MINUTE


def ensure_not_blocked(blocked: bool) -> None:
    """Comprueba que la IP no está en la lista negra (CA-06).

    :param blocked: si el almacenamiento dice que la IP está bloqueada.
    :return: nada si no lo está.
    :rtype: None
    :raises IpBanned: si la IP está bloqueada.

    Usage::

        >>> ensure_not_blocked(False)
    """
    if blocked:
        raise IpBanned(BAN_MESSAGE)
