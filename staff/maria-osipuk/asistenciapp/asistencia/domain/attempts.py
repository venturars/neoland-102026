"""Reglas del tope de intentos de registro.

Reciben cuántos intentos hay ya en cada ventana, incluido el que acaba
de llegar. No abren una base y no hablan con el navegador.
"""

BLOCKED_MESSAGE = "Demasiados intentos de registro. Este intento no se ha guardado."


class RegistrationBlocked(Exception):
    """Esta dirección ya no puede registrar en esta versión."""

    def __init__(self) -> None:
        super().__init__(BLOCKED_MESSAGE)


def exceeds(in_second: int, in_minute: int) -> bool:
    """Dice si este intento, ya contado, se pasa del tope.

    :param in_second: Intentos de la dirección en el último segundo, incluido este.
    :param in_minute: Intentos de la dirección en el último minuto, incluido este.
    :return: True si hay más de 5 en el segundo o más de 20 en el minuto.
    :rtype: bool

    Usage::

        exceeds(6, 6)
    """
    return in_second > 5 or in_minute > 20
