"""Decide si una IP se ha pasado de intentos con código inválido (spec 006).

No abre la base ni dibuja pantallas.

Usage::

  if over_limit(in_last_second, in_last_minute):
      raise Banned()
"""

MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20
ATTEMPT_RETENTION_SECONDS = 60
BAN_MESSAGE = (
    "Demasiados intentos incorrectos. Tu conexión quedó bloqueada. "
    "Pide al profesor que te desbloquee."
)


class Banned(Exception):
    """La IP superó los intentos permitidos."""

    def __init__(self) -> None:
        super().__init__(BAN_MESSAGE)


def over_limit(in_last_second: int, in_last_minute: int) -> bool:
    """Dice si esos recuentos se pasan del máximo.

    :param in_last_second: intentos en el último segundo, incluido el actual.
    :param in_last_minute: intentos en el último minuto, incluido el actual.
    :return: True si el segundo pasa de 5 o el minuto de 20.
    :rtype: bool

    Usage::

      blocked = over_limit(6, 6)
    """
    return in_last_second > MAX_PER_SECOND or in_last_minute > MAX_PER_MINUTE
