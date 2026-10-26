"""Fases y resultados de carrera, sin HTTP, SQL ni reloj global."""
from dataclasses import dataclass
from uuid import UUID

MAX_ATTEMPTS = 3
COUNTDOWN_SECONDS = 3
LIFETIME_SECONDS = 7200


class RaceError(Exception):
    """Rechazo de negocio con estado traducido por el borde HTTP."""

    def __init__(self, status: int, message: str) -> None:
        """Conserva un rechazo sin datos secretos.

        :param status: estado HTTP de traducción.
        :param message: explicación visible en español.
        :return: None.
        :rtype: None

        Usage::

            RaceError(403, "Acceso de carrera no válido.")
        """
        super().__init__(message)
        self.status = status


@dataclass(frozen=True)
class Outcome:
    """Datos y estado de una operación; no contiene derecho a ejecutar B."""
    body: dict
    status: int = 200


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
