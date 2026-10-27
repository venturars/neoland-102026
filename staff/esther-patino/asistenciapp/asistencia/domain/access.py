"""Límite de llamadas para pasar lista.

Mira solo las horas de una IP y el instante actual. No abre la base
y no conoce el navegador.
"""

SECOND = 1.0
MINUTE = 60.0
MAX_PER_SECOND = 5
MAX_PER_MINUTE = 20


def is_attack(times: list[float], now: float) -> bool:
    """Dice si estas llamadas ya superan el límite.

    :param times: horas de las llamadas de una IP, en segundos. Incluye la actual.
    :param now: instante actual, en segundos.
    :return: True si hay más de 5 en el último segundo o más de 20 en el último minuto.
    """
    in_second = sum(1 for stamp in times if now - stamp < SECOND)
    in_minute = sum(1 for stamp in times if now - stamp < MINUTE)
    return in_second > MAX_PER_SECOND or in_minute > MAX_PER_MINUTE
