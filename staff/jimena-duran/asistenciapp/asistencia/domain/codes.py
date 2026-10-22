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

    :param secret: secreto de la sesión en bytes.
    :param t: instante Unix en segundos.
    :return: código vigente de cuatro cifras.
    :rtype: str

    Usage::

      result = code_for(secret, t)
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Acepta el código de la ventana actual y el de la anterior (CA-05).

    :param secret: secreto de la sesión en bytes.
    :param code: código introducido.
    :param t: instante Unix en segundos.
    :return: si el código pertenece a una ventana válida.
    :rtype: bool

    Usage::

      result = is_valid_code(secret, code, t)
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Segundos (redondeados hacia arriba) hasta que cambie el código.

    :param t: instante Unix en segundos.
    :return: segundos restantes hasta cambiar de ventana.
    :rtype: int

    Usage::

      result = seconds_left(t)
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
