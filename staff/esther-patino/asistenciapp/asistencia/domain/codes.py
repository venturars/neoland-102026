"""Códigos de asistencia de 4 dígitos que rotan cada 30 s.

El código se calcula a partir del secreto de la sesión y de la ventana
de tiempo actual: no hay que guardar ni borrar códigos.
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
    """Calcula el código vigente en un instante.

    :param secret: secreto de la clase.
    :param t: instante, en segundos Unix.
    :return: el código de cuatro cifras.
    """
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Comprueba el código de la ventana actual y el de la anterior.

    :param secret: secreto de la clase.
    :param code: código que escribió el alumno.
    :param t: instante, en segundos Unix.
    :return: True si el código corresponde a esta ventana o a la anterior.
    """
    code = str(code).strip()
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Calcula cuántos segundos quedan hasta que cambie el código.

    :param t: instante, en segundos Unix.
    :return: los segundos que faltan, redondeados hacia arriba.
    """
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
