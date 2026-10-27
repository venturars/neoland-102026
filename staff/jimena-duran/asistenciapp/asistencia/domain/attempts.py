"""Regla de exceso de intentos de registro y aviso de bloqueo."""

MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20


class Banned(Exception):
    """La dirección ya está bloqueada o acaba de superar un máximo."""

    def __init__(self) -> None:
        super().__init__("Esta dirección queda bloqueada por haber superado los intentos permitidos.")


def over_limit(second: int, minute: int) -> bool:
    """Evalúa los recuentos que incluyen el intento actual.

    :param second: intentos de la dirección en el último segundo.
    :param minute: intentos de la dirección en el último minuto.
    :return: si algún recuento supera su máximo.
    :rtype: bool

    Usage::

      blocked = over_limit(6, 6)
    """
    return second > MAX_PER_SECOND or minute > MAX_PER_MINUTE
