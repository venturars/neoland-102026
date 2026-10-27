"""Pase de 2 minutos tras validar el código y recibo del registro (spec 007, RF-11, RF-17).

Los dos se firman con el secreto de la sesión, como el código rotatorio. Este
módulo no guarda nada: que un pase ya se usó lo apunta el almacenamiento (CA-21).
"""

import hashlib
import hmac

PASS_SECONDS = 120
PASS_EXPIRED = "Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor."
PASS_USED = "Este pase ya se ha usado: escribe el código otra vez."


class PassExpired(Exception):
    """El pase falta, no es válido o ya caducó."""


class PassUsed(Exception):
    """El pase ya sirvió para un registro: un pase, un registro (CA-21)."""


def _sign(secret: bytes, message: str) -> str:
    return hmac.new(secret, message.encode(), hashlib.sha256).hexdigest()[:32]


def issue_pass(secret: bytes, t: float) -> str:
    """Pase que deja registrarse durante 2 minutos sin volver a escribir el código (CA-11).

    :param secret: secreto de la sesión.
    :param t: instante en que se valida el código, en segundos Unix.
    :return: el pase, con la hora de emisión y su firma.
    :rtype: str

    Usage::

        >>> issue_pass(b"secreto", 1_800_000_000.0).startswith("1800000000.")
        True
    """
    issued = int(t)
    return f"{issued}.{_sign(secret, f'pass:{issued}')}"


def pass_is_valid(secret: bytes, token: str | None, t: float) -> bool:
    """Dice si el pase es de esta sesión y no ha caducado (CA-11, CA-16).

    :param secret: secreto de la sesión.
    :param token: el pase que envía el navegador.
    :param t: instante actual en segundos Unix.
    :return: ``True`` si vale.
    :rtype: bool

    Usage::

        >>> pass_is_valid(b"s", issue_pass(b"s", 0.0), 60.0)
        True
    """
    try:
        issued_text, signature = str(token).split(".")
        issued = int(issued_text)
    except ValueError:
        return False
    if not hmac.compare_digest(signature, _sign(secret, f"pass:{issued}")):
        return False
    return 0 <= t - issued <= PASS_SECONDS


def receipt_for(secret: bytes, checkin_id: int) -> str:
    """Recibo que guarda el navegador para saber si su registro sigue ahí (CA-14).

    :param secret: secreto de la sesión.
    :param checkin_id: identificador del registro.
    :return: el recibo.
    :rtype: str

    Usage::

        >>> len(receipt_for(b"secreto", 7))
        32
    """
    return _sign(secret, f"receipt:{checkin_id}")


def receipt_is_valid(secret: bytes, checkin_id: int, receipt: str | None) -> bool:
    """Dice si el recibo corresponde a ese registro de esa sesión (CA-14).

    :param secret: secreto de la sesión.
    :param checkin_id: identificador del registro.
    :param receipt: el recibo que envía el navegador.
    :return: ``True`` si vale.
    :rtype: bool

    Usage::

        >>> receipt_is_valid(b"s", 7, receipt_for(b"s", 7))
        True
    """
    return hmac.compare_digest(str(receipt or ""), receipt_for(secret, checkin_id))
