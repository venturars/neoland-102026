"""Tests de attendance/config.py · spec 005 CA-03; ARCHITECTURE F5."""

from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from attendance.config import (
    DEFAULT_DB,
    DEFAULT_PORT,
    Config,
    ConfigError,
    InvalidPortError,
    InvalidTimezoneError,
    load_config,
)
from attendance.domain.errors import AppError


def test_defaults_when_nothing_is_set():
    assert load_config({}) == Config(db_path=DEFAULT_DB, port=DEFAULT_PORT, timezone=None)
    assert DEFAULT_DB.name == "asistencia.db" and DEFAULT_DB.parent.name == "data"
    assert DEFAULT_PORT == 8000


def test_empty_values_count_as_not_set():
    assert load_config({"ASISTENCIA_DB": "", "PORT": "", "ASISTENCIA_TZ": ""}) == load_config({})


def test_values_from_the_environment():
    config = load_config({"ASISTENCIA_DB": "otra/carpeta/clases.db", "PORT": "9000", "ASISTENCIA_TZ": "Europe/Madrid"})
    assert config == Config(db_path=Path("otra/carpeta/clases.db"), port=9000, timezone=ZoneInfo("Europe/Madrid"))


@pytest.mark.parametrize("port", ["abc", "0", "65536", "-1", "80.5", " 8000", "٨٠٠٠"])
def test_invalid_port_is_rejected(port):
    with pytest.raises(InvalidPortError) as exc:
        load_config({"PORT": port})
    assert "PORT" in str(exc.value)


@pytest.mark.parametrize("tz", ["Marte/Olympus", "../etc/passwd", "Europe/"])
def test_invalid_timezone_is_rejected(tz):
    with pytest.raises(InvalidTimezoneError) as exc:
        load_config({"ASISTENCIA_TZ": tz})
    assert "ASISTENCIA_TZ" in str(exc.value)


def test_config_errors_are_app_errors():  # E3: una base común con su mensaje
    assert issubclass(ConfigError, AppError)
    assert issubclass(InvalidPortError, ConfigError) and issubclass(InvalidTimezoneError, ConfigError)
