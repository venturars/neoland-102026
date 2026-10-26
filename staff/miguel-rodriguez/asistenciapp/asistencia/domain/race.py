"""Fases y resultados de carrera, sin HTTP, SQL ni reloj global."""
from uuid import UUID

MAX_ATTEMPTS = 3
COUNTDOWN_SECONDS = 3
LIFETIME_SECONDS = 7200


class RaceError(Exception):
    """Identifica un rechazo de negocio sin decidir la respuesta HTTP."""

    def __init__(self, reason: str, message: str) -> None:
        """Conserva el motivo y la explicación visible, sin datos secretos.

        :param reason: motivo de negocio que traducirá el adaptador.
        :param message: explicación visible en español.
        :return: None.
        :rtype: None

        Usage::

            RaceError("access_denied", "Acceso de carrera no válido.")
        """
        super().__init__(message)
        self.reason = reason


def phase(starts_at: float | None, closed_at: str | None, expires_at: float, now: float) -> str:
    """Deriva la fase sin abrir de nuevo una carrera cerrada.

    :param starts_at: salida fijada o None.
    :param closed_at: cierre guardado o None.
    :param expires_at: límite original de acceso.
    :param now: reloj recibido del servidor.
    :return: fase del contrato.
    :rtype: str

    Usage::

        phase(None, None, 7200, 0)
    """
    if closed_at is not None:
        return "closed"
    if now >= expires_at:
        return "expired"
    if starts_at is None:
        return "lobby"
    return "countdown" if now < starts_at else "open"


def valid_operation_id(value: object) -> bool:
    """Exige UUID canónica sin conversiones permisivas.

    :param value: identificador de envío.
    :return: si su representación es canónica.
    :rtype: bool

    Usage::

        valid_operation_id("d8620a89-9c8f-4cc7-8057-1f0913ca59b0")
    """
    if not isinstance(value, str) or len(value) != 36:
        return False
    try:
        return str(UUID(value)) == value
    except ValueError:
        return False
