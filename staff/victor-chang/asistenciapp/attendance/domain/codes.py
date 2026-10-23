"""Códigos de asistencia de 4 dígitos que rotan cada 30 s (spec 001 · plan §2.1).

El código se calcula a partir del secreto de la sesión y de la "ventana"
de tiempo actual, como en las apps de doble factor (TOTP): no hay que
guardar ni borrar códigos.
"""

import hashlib
import hmac
import math
import re

WINDOW_SECONDS = 30
# [0-9] y no \d: \d también acepta dígitos Unicode (p. ej. árabes), que compare_digest no admite.
CODE_FORMAT = re.compile(r"[0-9]{4}")


def _window(t: float) -> int:
    return int(t // WINDOW_SECONDS)


def _code_for_window(secret: bytes, window: int) -> str:
    digest = hmac.new(secret, window.to_bytes(8, "big"), hashlib.sha256).digest()
    return f"{int.from_bytes(digest[:4], 'big') % 10_000:04d}"


def code_for(secret: bytes, t: float) -> str:
    """Código vigente en el instante t (segundos Unix)."""
    return _code_for_window(secret, _window(t))


def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Acepta el código de la ventana actual y el de la anterior (CA-05).

    Recibe siempre texto: un número no se convierte (spec 005 · CA-06; ARCHITECTURE.md · E1).
    """
    code = code.strip()
    if not CODE_FORMAT.fullmatch(code):
        return False
    current = _window(t)
    return any(
        hmac.compare_digest(code, _code_for_window(secret, w))
        for w in (current, current - 1)
    )


def seconds_left(t: float) -> int:
    """Segundos (redondeados hacia arriba) hasta que cambie el código."""
    return math.ceil(WINDOW_SECONDS - (t % WINDOW_SECONDS))
