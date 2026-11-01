"""Códigos de asistencia de 4 cifras que cambian cada 30 segundos.

El código sale del secreto de la clase y de la ventana de tiempo actual,
como en las apps de doble factor (TOTP): no hay que guardar ni borrar códigos.

Usage::

  >>> code = code_for(secret, time.time())
  >>> is_valid_code(secret, code, time.time())
  True
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
    """Devuelve el código vigente en el instante ``t``.

    :param secret: secreto de la clase.
    :param t: instante en segundos Unix.
    :return: código de 4 cifras, con ceros a la izquierda.
    :rtype: str

    Usage::

      >>> code_for(secret, time.time())
      '0427'
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Dice si el código escrito por el alumno vale en el instante ``t``.

    Se acepta el de la ventana actual y el de la anterior, para que no falle
    quien lo escribe justo cuando cambia.

    :param secret: secreto de la clase.
    :param code: código que escribió el alumno.
    :param t: instante en segundos Unix.
    :return: ``True`` si el código vale.
    :rtype: bool

    Usage::

      >>> is_valid_code(secret, "0427", time.time())
      True
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Devuelve cuántos segundos faltan para que cambie el código.

    :param t: instante en segundos Unix.
    :return: segundos restantes, redondeados hacia arriba (1–30).
    :rtype: int

    Usage::

      >>> seconds_left(time.time())
      17
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
