"""Límite de intentos de registro por conexión, para frenar a quien prueba códigos con un script.

Usage::

  >>> if exceeds_limit(previous_attempts, time.time()):
  ...     raise Blocked()
"""

MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20


class Blocked(Exception):
    """La conexión superó el límite y está en la lista de bloqueo."""

    def __init__(self) -> None:
        super().__init__(
            "Esta conexión ha quedado bloqueada por demasiados intentos de registro. Habla con el profesor."
        )


def exceeds_limit(previous: list[float], t: float) -> bool:
    """Dice si el intento del instante ``t`` supera alguno de los dos límites.

    Cuenta el intento actual junto con los anteriores que caen en el último
    segundo y en el último minuto.

    :param previous: instantes (segundos Unix) de los intentos anteriores de esa conexión.
    :param t: instante del intento actual.
    :return: ``True`` si pasa de ``MAX_PER_SECOND`` en un segundo o de ``MAX_PER_MINUTE`` en un minuto.
    :rtype: bool

    Usage::

      >>> exceeds_limit([t, t, t, t, t], t)
      True
    """
    in_last_second = 1 + sum(1 for p in previous if t - p < 1)
    in_last_minute = 1 + sum(1 for p in previous if t - p < 60)
    return in_last_second > MAX_PER_SECOND or in_last_minute > MAX_PER_MINUTE
