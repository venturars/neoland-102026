"""Calcula el código de asistencia vigente.

El código se obtiene del secreto de la sesión y de la ventana de tiempo
actual, como en las apps de doble factor: no hay que guardar ni borrar códigos.

Usage::

  >>> from asistencia.domain.codes import code_for
  >>> code_for(secret, now)
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
    """Devuelve el código vigente en ese instante.

    :param secret: secreto de la sesión, en bytes.
    :param t: instante Unix, en segundos.
    :return: cuatro dígitos.
    :rtype: str

    Usage::

      code = code_for(secret, now)
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Dice si el código vale en ese instante (ventana actual o la anterior).

    :param secret: secreto de la sesión, en bytes.
    :param code: código que escribió el alumno.
    :param t: instante Unix, en segundos.
    :return: True si el código vale.
    :rtype: bool

    Usage::

      ok = is_valid_code(secret, code, now)
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Segundos (redondeados hacia arriba) hasta que cambie el código.

    :param t: instante Unix, en segundos.
    :return: segundos restantes de la ventana.
    :rtype: int

    Usage::

      left = seconds_left(now)
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
