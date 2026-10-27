"""Tipos de datos de clases y registros, y sus reglas puras (spec 005 · plan §2.2; spec 001 · plan §2.8).

Las fechas viajan como texto ISO 8601 en UTC (ARCHITECTURE.md · D6). La hora llega siempre
desde fuera, en segundos Unix (M5; excepción de spec 005 · plan §5).
"""

from dataclasses import dataclass
from datetime import UTC, datetime, tzinfo
from enum import StrEnum

from attendance.domain.errors import TitleTooLongError

MAX_TITLE_LENGTH = 20


class Mode(StrEnum):
    """Cómo se pasa lista en una clase (spec 004 · HU-07; valores en inglés, plan §8.6)."""

    CODE = "code"
    AUTOMATIC = "automatic"


@dataclass(frozen=True)
class Session:
    """Una clase, con el secreto del que sale su código rotatorio."""

    id: str
    title: str
    secret: bytes
    opened_at: str
    closed_at: str | None
    mode: Mode = Mode.CODE
    meeting_code: str | None = None  # solo en modo automático (spec 004 · CA-01)

    @property
    def is_open(self) -> bool:
        """True mientras la clase no se ha cerrado (spec 001 · CA-13)."""
        return self.closed_at is None


@dataclass(frozen=True)
class SessionSummary:
    """Una clase en la lista del profesor: sin secreto y con su total (spec 001 · CA-16)."""

    id: str
    title: str
    opened_at: str
    closed_at: str | None
    total: int
    mode: Mode = Mode.CODE


@dataclass(frozen=True)
class Checkin:
    """El registro de un alumno en una clase."""

    id: int
    name: str
    checked_at: str


@dataclass(frozen=True)
class CheckinResult:
    """Resultado de registrarse: el registro, y si es nuevo o ya existía (spec 001 · CA-07)."""

    checkin: Checkin
    created: bool


@dataclass(frozen=True)
class TeacherView:
    """Lo que ve el profesor de una clase; sin código si está cerrada (spec 001 · CA-10, CA-13)."""

    session: Session
    checkins: tuple[Checkin, ...]
    code: str | None
    seconds_left: int | None


@dataclass(frozen=True)
class ExportFile:
    """Un archivo para descargar (spec 001 · CA-14)."""

    filename: str
    content: str


def to_iso(t: float) -> str:
    """Instante t (segundos Unix) en ISO 8601 UTC, con milisegundos (D6)."""
    return datetime.fromtimestamp(t, UTC).isoformat(timespec="milliseconds")


def clean_title(raw: str) -> str:
    """El título sin los espacios de los extremos; vacío si no hay título (spec 005 · CA-08).

    Raises:
        TitleTooLongError: pasa de MAX_TITLE_LENGTH caracteres.
    """
    title = raw.strip()
    if len(title) > MAX_TITLE_LENGTH:
        raise TitleTooLongError
    return title


def default_title(t: float, tz: tzinfo | None) -> str:
    """Título de una clase sin título: su fecha y hora local (spec 001 · CA-02).

    Args:
        t: instante de apertura, en segundos Unix.
        tz: zona horaria en la que se muestra; None usa la del sistema.
    """
    return datetime.fromtimestamp(t, tz).strftime("%d/%m/%Y %H:%M")
