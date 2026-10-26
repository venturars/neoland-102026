"""Códigos de asistencia de 4 dígitos que rotan cada 30 segundos.

El código se calcula con el secreto de la clase y la ventana de tiempo
actual. No se guarda ni se borra.
"""

import hashlib
import hmac
import math

WINDOW_SECONDS = 30


def _window(t: float) -> int:
    return int(t // WINDOW_SECONDS)


def _code_for_window(secret: bytes, window: int) -> str:
    digest = hmac.new(secret, window.to_bytes(8, "big"), hashlib.sha256).digest()
    return f"{int.from_bytes(digest[:4], 'big') % 10_000:04d}"


def code_for(secret: bytes, t: float) -> str:
    """Código vigente en el instante t.

    :param secret: Secreto de la clase.
    :param t: Segundos Unix.
    :return: Cuatro dígitos.
    :rtype: str

    Usage::

        code_for(secreto, reloj())
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: object, t: float) -> bool:
    """Acepta el código de la ventana actual y el de la anterior.

    :param secret: Secreto de la clase.
    :param code: Código presentado.
    :param t: Segundos Unix.
    :return: True si coincide con la ventana actual o la previa.
    :rtype: bool
    """
    presented = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(presented, _code_for_window(secret, window))
        for window in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Segundos, redondeados hacia arriba, hasta que cambie el código.

    :param t: Segundos Unix.
    :return: Segundos que le quedan a la ventana actual.
    :rtype: int
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
