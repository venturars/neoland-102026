"""Llegada a tiempo o tardía.

Mira solo la hora de apertura y la hora del registro. No abre la base
y no conoce el navegador.
"""

from datetime import datetime, timedelta

MARGIN = timedelta(minutes=5)
ON_TIME = "A tiempo"
LATE = "Llegada tardía"


def label(opened_at: str, checked_at: str) -> str:
    """Dice si el registro cae dentro de los 5 minutos.

    :param opened_at: hora de apertura, en ISO.
    :param checked_at: hora del registro, en ISO.
    :return: «A tiempo» si no han pasado más de 5 minutos, y «Llegada tardía» si ha pasado más.
    """
    opened = datetime.fromisoformat(opened_at)
    checked = datetime.fromisoformat(checked_at)
    if checked - opened <= MARGIN:
        return ON_TIME
    return LATE
