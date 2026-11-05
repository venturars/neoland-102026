"""Códigos de asistencia de 4 dígitos que rotan cada 30 s (plan §2.1).

El código se calcula a partir del secreto de la sesión y de la "ventana"
de tiempo actual, como en las apps de doble factor (TOTP): no hay que
guardar ni borrar códigos.
"""

import hashlib
import hmac
import math

WINDOW_SECONDS = 30


def _window(instant: float) -> int:
    """Obtiene la ventana de rotación de un instante.

    :param instant: segundos Unix.
    :return: número de ventana.
    :rtype: int

    Usage::

        _window(1800000000.0)
    """
    return int(instant // WINDOW_SECONDS)


def _code_for_window(secret: bytes, window: int) -> str:
    """Calcula las cuatro cifras de una ventana.

    :param secret: secreto de la sesión.
    :param window: número de ventana.
    :return: código de cuatro dígitos.
    :rtype: str

    Usage::

        _code_for_window(b"secreto", 60000000)
    """
    window_bytes = window.to_bytes(8, "big")
    signature = hmac.new(secret, window_bytes, hashlib.sha256)
    digest = signature.digest()
    number = int.from_bytes(digest[:4], 'big')
    code = number % 10_000
    return f"{code:04d}"


def code_for(secret: bytes, instant: float) -> str:
    """Calcula el código vigente.

    :param secret: secreto de la sesión.
    :param instant: segundos Unix.
    :return: código de cuatro dígitos.
    :rtype: str

    Usage::

        code_for(b"secreto", 1800000000.0)
    """
    window = _window(instant)
    return _code_for_window(secret, window)


def is_valid_code(secret: bytes, code: str, instant: float) -> bool:
    """Acepta el código actual o el inmediatamente anterior.

    :param secret: secreto de la sesión.
    :param code: código recibido.
    :param instant: segundos Unix.
    :return: si coincide una ventana aceptada.
    :rtype: bool

    Usage::

        is_valid_code(b"secreto", "1234", 1800000000.0)
    """
    code = str(code).strip()
    current = _window(instant)
    for candidate_window in (current, current - 1):
        candidate_code = _code_for_window(secret, candidate_window)
        if hmac.compare_digest(code, candidate_code):
            return True
    return False


def seconds_left(instant: float) -> int:
    """Calcula los segundos hasta el siguiente código.

    :param instant: segundos Unix.
    :return: segundos restantes redondeados hacia arriba.
    :rtype: int

    Usage::

        seconds_left(1800000000.0)
    """
    return math.ceil(WINDOW_SECONDS - (instant % WINDOW_SECONDS))
