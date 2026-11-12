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
    return int(t // WINDOW_SECONDS)


def _code_for_window(secret: bytes, window: int) -> str:
    digest = hmac.new(secret, window.to_bytes(8, "big"), hashlib.sha256).digest()
    return f"{int.from_bytes(digest[:4], 'big') % 10_000:04d}"


def code_for(secret: bytes, t: float) -> str:
    """Código vigente en el instante t (segundos Unix).

    :param secret: secreto de la sesión.
    :param t: instante en segundos Unix.
    :return: el código de 4 cifras.
    :rtype: str

    Usage::

        >>> code_for(b"secreto", 1_800_000_000.0)  # doctest: +SKIP
        '0420'
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Acepta el código de la ventana actual y el de la anterior (CA-05).

    :param secret: secreto de la sesión.
    :param code: código que escribió el alumno.
    :param t: instante en segundos Unix.
    :return: ``True`` si el código vale en ese instante.
    :rtype: bool

    Usage::

        >>> is_valid_code(b"secreto", "0000", 1_800_000_000.0)  # doctest: +SKIP
        False
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Segundos (redondeados hacia arriba) hasta que cambie el código.

    :param t: instante en segundos Unix.
    :return: segundos que faltan para el siguiente código.
    :rtype: int

    Usage::

        >>> seconds_left(30.0)
        30
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
