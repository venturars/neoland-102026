"""Decide si una IP se ha pasado de códigos fallados.

No abre la base ni dibuja pantallas.

Usage::

  if over_limit(in_last_second, in_last_minute):
      raise Banned()
"""

MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20
BAN_SECONDS = 10 * 60
BAN_MESSAGE = (
    f"Esta dirección queda bloqueada {BAN_SECONDS // 60} minutos por fallar el código demasiadas veces. "
    "Espera y pide el código actual al profesor."
)


class Banned(Exception):
    """La IP falló el código demasiadas veces."""

    def __init__(self) -> None:
        super().__init__(BAN_MESSAGE)


def over_limit(in_last_second: int, in_last_minute: int) -> bool:
    """Dice si esos recuentos se pasan del máximo.

    :param in_last_second: códigos fallados en el último segundo, incluido el actual.
    :param in_last_minute: códigos fallados en el último minuto, incluido el actual.
    :return: True si el segundo pasa de 5 o el minuto de 20.
    :rtype: bool

    Usage::

      blocked = over_limit(6, 6)
    """
    return in_last_second > MAX_PER_SECOND or in_last_minute > MAX_PER_MINUTE
