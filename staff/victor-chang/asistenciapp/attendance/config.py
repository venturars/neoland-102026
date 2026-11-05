"""Configuración de la app, leída del entorno al arrancar (spec 005 · plan §2.4; ARCHITECTURE.md · C4, F5).

Variables (todas opcionales; vacía cuenta como no puesta):
- `ASISTENCIA_DB`: archivo de la base de datos. Por defecto, `data/asistencia.db`.
- `PORT`: puerto local en el que escucha la app. Por defecto, 8000.
- `ASISTENCIA_TZ`: zona horaria para mostrar y exportar horas (p. ej. `Europe/Madrid`).
  Por defecto, la del sistema.
- `ASISTENCIA_GOOGLE_CLIENT`: la llave de la app en Google Cloud (spec 004 · plan §2.4).
  Por defecto, `data/google-client.json`.
- `ASISTENCIA_GOOGLE_TOKEN`: dónde se guarda el permiso de Google. Por defecto, `data/google-token.json`.
- `ASISTENCIA_LOCK_PORT`: puerto local con el que la app de escritorio sabe si ya está abierta
  (spec 007 · plan §2.5). Por defecto, 47913.

En la app de escritorio (spec 007 · plan §2.3), los valores por defecto cambian: la base de datos y el
permiso van a la carpeta de datos del usuario de cada sistema; la llave de Google es la propia del
profesor si la ha dejado allí, o la que va dentro de la app; y `cloudflared` es el que va dentro de la app.
"""

import re
import sys
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import tzinfo
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from attendance.domain.errors import AppError

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DEFAULT_DB = DATA_DIR / "asistencia.db"
DEFAULT_GOOGLE_CLIENT = DATA_DIR / "google-client.json"
DEFAULT_GOOGLE_TOKEN = DATA_DIR / "google-token.json"
DEFAULT_PORT = 8000
DEFAULT_LOCK_PORT = 47913  # alto y poco común (spec 007 · plan §2.5)
APP_FOLDER = "AsistenciApp"  # nombre de la carpeta de datos del usuario (spec 007 · plan §2.3)
GOOGLE_CLIENT_FILE = "google-client.json"
# [0-9] y no \d, que acepta cifras de otros alfabetos (ARCHITECTURE.md · E1).
PORT_FORMAT = re.compile(r"[0-9]{1,5}")


class ConfigError(AppError):
    """Una variable de entorno tiene un valor no válido."""


class InvalidPortError(ConfigError):
    """`PORT` no es un puerto válido."""

    MESSAGE = (
        "PORT debe ser un número de puerto entre 1 y 65535 (p. ej. PORT=8001). Corrígelo, o quítalo para usar el 8000."
    )


class InvalidLockPortError(ConfigError):
    """`ASISTENCIA_LOCK_PORT` no es un puerto válido (spec 007 · plan §2.5)."""

    MESSAGE = (
        "ASISTENCIA_LOCK_PORT debe ser un número de puerto entre 1 y 65535. Corrígelo, o quítalo para usar el 47913."
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
    google_client_path: Path = DEFAULT_GOOGLE_CLIENT
    google_token_path: Path = DEFAULT_GOOGLE_TOKEN
    cloudflared_path: Path | None = None  # None: se busca en el PATH (spec 007 · plan §2.3)
    lock_port: int = DEFAULT_LOCK_PORT  # una sola instancia de la app de escritorio (spec 007 · plan §2.5)


@dataclass(frozen=True)
class _Defaults:
    """Los valores por defecto de las rutas, según se ejecute desde el código o como app de escritorio."""

    db: Path
    google_client: Path
    google_token: Path
    cloudflared: Path | None


def load_config(
    environ: Mapping[str, str],
    desktop: bool = False,
    platform: str = sys.platform,
    home: Path | None = None,
    bundle: Path | None = None,
) -> Config:
    """Lee la configuración de las variables de entorno, con sus valores por defecto.

    Args:
        environ: las variables de entorno; en la app, `os.environ`.
        desktop: si es la app de escritorio (spec 007 · plan §2.2); cambia dónde van los datos.
        platform: el sistema (`sys.platform`); los tests prueban macOS y Windows desde cualquiera.
        home: la carpeta del usuario; por defecto, `Path.home()`.
        bundle: la carpeta con lo que va dentro de la app empaquetada (`sys._MEIPASS`), o None.

    Raises:
        InvalidPortError: `PORT` no es un número entre 1 y 65535.
        InvalidLockPortError: `ASISTENCIA_LOCK_PORT` no es un número entre 1 y 65535.
        InvalidTimezoneError: `ASISTENCIA_TZ` no es una zona horaria conocida.
    """
    defaults = _desktop_defaults(environ, platform, home or Path.home(), bundle) if desktop else _source_defaults()
    return Config(
        db_path=_path(environ.get("ASISTENCIA_DB", ""), defaults.db),
        port=_port(environ.get("PORT", ""), DEFAULT_PORT, InvalidPortError),
        timezone=_timezone(environ.get("ASISTENCIA_TZ", "")),
        google_client_path=_path(environ.get("ASISTENCIA_GOOGLE_CLIENT", ""), defaults.google_client),
        google_token_path=_path(environ.get("ASISTENCIA_GOOGLE_TOKEN", ""), defaults.google_token),
        cloudflared_path=defaults.cloudflared,
        lock_port=_port(environ.get("ASISTENCIA_LOCK_PORT", ""), DEFAULT_LOCK_PORT, InvalidLockPortError),
    )


def user_data_dir(environ: Mapping[str, str], platform: str, home: Path) -> Path:
    r"""La carpeta de datos del usuario de cada sistema (spec 007 · CA-05).

    macOS: `~/Library/Application Support/AsistenciApp`; Windows: `%APPDATA%\AsistenciApp`.
    Sin dependencia nueva: son dos rutas fijas (plan §2.3, P3).
    """
    if platform == "win32":
        appdata = environ.get("APPDATA", "")
        return (Path(appdata) if appdata else home / "AppData" / "Roaming") / APP_FOLDER
    if platform == "darwin":
        return home / "Library" / "Application Support" / APP_FOLDER
    return home / ".local" / "share" / APP_FOLDER  # otros sistemas: fuera de la spec 007, pero sin fallar


def _source_defaults() -> _Defaults:
    return _Defaults(DEFAULT_DB, DEFAULT_GOOGLE_CLIENT, DEFAULT_GOOGLE_TOKEN, cloudflared=None)


def _desktop_defaults(environ: Mapping[str, str], platform: str, home: Path, bundle: Path | None) -> _Defaults:
    folder = user_data_dir(environ, platform, home)
    own_key = folder / GOOGLE_CLIENT_FILE
    # La llave propia del profesor gana a la de la app (CA-16); desde el código, la del proyecto.
    bundled_key = bundle / GOOGLE_CLIENT_FILE if bundle else DEFAULT_GOOGLE_CLIENT
    cloudflared = bundle / ("cloudflared.exe" if platform == "win32" else "cloudflared") if bundle else None
    return _Defaults(
        db=folder / "asistencia.db",
        google_client=own_key if own_key.exists() else bundled_key,
        google_token=folder / "google-token.json",
        cloudflared=cloudflared,
    )


def _path(value: str, default: Path) -> Path:
    return Path(value) if value else default


def _port(value: str, default: int, error: type[ConfigError]) -> int:
    if not value:
        return default
    if not PORT_FORMAT.fullmatch(value) or not 1 <= int(value) <= 65535:
        raise error
    return int(value)


def _timezone(value: str) -> tzinfo | None:
    if not value:
        return None
    try:
        return ZoneInfo(value)
    except (ZoneInfoNotFoundError, ValueError) as exc:
        raise InvalidTimezoneError from exc
