"""Códigos de asistencia de 4 dígitos que rotan cada 30 s (plan §2.1).

El código se calcula a partir del secreto de la sesión y de la "ventana"
de tiempo actual, como en las apps de doble factor (TOTP): no hay que
guardar ni borrar códigos.
"""

import hashlib
import hmac
import math

WINDOW_SECONDS = 30


def _window(t: float) -> int:
    """Obtiene la ventana de rotación de un instante.

    :param t: segundos Unix.
    :return: número de ventana.
    :rtype: int

    Usage::

        _window(1800000000.0)
    """
    return int(t // WINDOW_SECONDS)


def _code_for_window(secret: bytes, window: int) -> str:
    """Calcula las cuatro cifras de una ventana.

    :param secret: secreto de la sesión.
    :param window: número de ventana.
    :return: código de cuatro dígitos.
    :rtype: str

    Usage::

        _code_for_window(b"secreto", 60000000)
    """
    digest = hmac.new(secret, window.to_bytes(8, "big"), hashlib.sha256).digest()
    return f"{int.from_bytes(digest[:4], 'big') % 10_000:04d}"


def code_for(secret: bytes, t: float) -> str:
    """Calcula el código vigente.

    :param secret: secreto de la sesión.
    :param t: segundos Unix.
    :return: código de cuatro dígitos.
    :rtype: str

    Usage::

        code_for(b"secreto", 1800000000.0)
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Acepta el código actual o el inmediatamente anterior.

    :param secret: secreto de la sesión.
    :param code: código recibido.
    :param t: segundos Unix.
    :return: si coincide una ventana aceptada.
    :rtype: bool

    Usage::

        is_valid_code(b"secreto", "1234", 1800000000.0)
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Calcula los segundos hasta el siguiente código.

    :param t: segundos Unix.
    :return: segundos restantes redondeados hacia arriba.
    :rtype: int

    Usage::

        seconds_left(1800000000.0)
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
