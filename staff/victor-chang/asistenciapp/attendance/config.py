"""Configuración de la app, leída del entorno al arrancar (spec 005 · plan §2.4; ARCHITECTURE.md · C4, F5).

Variables (todas opcionales; vacía cuenta como no puesta):
- `ASISTENCIA_DB`: archivo de la base de datos. Por defecto, `data/asistencia.db`.
- `PORT`: puerto local en el que escucha la app. Por defecto, 8000.
- `ASISTENCIA_TZ`: zona horaria para mostrar y exportar horas (p. ej. `Europe/Madrid`).
  Por defecto, la del sistema.
"""

import re
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import tzinfo
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from attendance.domain.errors import AppError

DEFAULT_DB = Path(__file__).resolve().parent.parent / "data" / "asistencia.db"
DEFAULT_PORT = 8000
# [0-9] y no \d, que acepta cifras de otros alfabetos (ARCHITECTURE.md · E1).
PORT_FORMAT = re.compile(r"[0-9]{1,5}")


class ConfigError(AppError):
    """Una variable de entorno tiene un valor no válido."""


class InvalidPortError(ConfigError):
    """`PORT` no es un puerto válido."""

    MESSAGE = (
        "PORT debe ser un número de puerto entre 1 y 65535 (p. ej. PORT=8001). Corrígelo, o quítalo para usar el 8000."
    )


class InvalidTimezoneError(ConfigError):
    """`ASISTENCIA_TZ` no es una zona horaria conocida."""

    MESSAGE = (
        "ASISTENCIA_TZ no es una zona horaria válida. "
        "Usa un nombre como Europe/Madrid, o quítala para usar la del sistema."
    )


@dataclass(frozen=True)
class Config:
    """Lo que cambia según dónde se ejecuta la app."""

    db_path: Path
    port: int
    timezone: tzinfo | None


def load_config(environ: Mapping[str, str]) -> Config:
    """Lee la configuración de las variables de entorno, con sus valores por defecto.

    Args:
        environ: las variables de entorno; en la app, `os.environ`.

    Raises:
        InvalidPortError: `PORT` no es un número entre 1 y 65535.
        InvalidTimezoneError: `ASISTENCIA_TZ` no es una zona horaria conocida.
    """
    db = environ.get("ASISTENCIA_DB", "")
    return Config(
        db_path=Path(db) if db else DEFAULT_DB,
        port=_port(environ.get("PORT", "")),
        timezone=_timezone(environ.get("ASISTENCIA_TZ", "")),
    )


def _port(value: str) -> int:
    if not value:
        return DEFAULT_PORT
    if not PORT_FORMAT.fullmatch(value) or not 1 <= int(value) <= 65535:
        raise InvalidPortError
    return int(value)


def _timezone(value: str) -> tzinfo | None:
    if not value:
        return None
    try:
        return ZoneInfo(value)
    except (ZoneInfoNotFoundError, ValueError) as exc:
        raise InvalidTimezoneError from exc
