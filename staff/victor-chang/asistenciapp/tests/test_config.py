"""Tests de attendance/config.py · spec 005 CA-03; spec 004 CA-11, CA-12; spec 007 CA-05, CA-06, CA-16, CA-18; F5."""

from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from attendance.config import (
    DEFAULT_DB,
    DEFAULT_GOOGLE_CLIENT,
    DEFAULT_GOOGLE_TOKEN,
    DEFAULT_LOCK_PORT,
    DEFAULT_PORT,
    Config,
    ConfigError,
    InvalidLockPortError,
    InvalidPortError,
    InvalidTimezoneError,
    load_config,
)
from attendance.domain.errors import AppError


def test_defaults_when_nothing_is_set():
    assert load_config({}) == Config(db_path=DEFAULT_DB, port=DEFAULT_PORT, timezone=None)
    assert DEFAULT_DB.name == "asistencia.db" and DEFAULT_DB.parent.name == "data"
    assert DEFAULT_PORT == 8000


def test_google_files_default_to_the_data_folder():  # spec 004 · plan §2.4
    config = load_config({})
    assert (config.google_client_path, config.google_token_path) == (DEFAULT_GOOGLE_CLIENT, DEFAULT_GOOGLE_TOKEN)
    assert DEFAULT_GOOGLE_CLIENT == DEFAULT_DB.parent / "google-client.json"
    assert DEFAULT_GOOGLE_TOKEN == DEFAULT_DB.parent / "google-token.json"


def test_google_files_from_the_environment():  # spec 004 · plan §2.4
    config = load_config(
        {"ASISTENCIA_GOOGLE_CLIENT": "llaves/cliente.json", "ASISTENCIA_GOOGLE_TOKEN": "llaves/permiso.json"}
    )
    assert config.google_client_path == Path("llaves/cliente.json")
    assert config.google_token_path == Path("llaves/permiso.json")


def test_empty_values_count_as_not_set():
    empty = {
        "ASISTENCIA_DB": "",
        "PORT": "",
        "ASISTENCIA_TZ": "",
        "ASISTENCIA_GOOGLE_CLIENT": "",
        "ASISTENCIA_GOOGLE_TOKEN": "",
    }
    assert load_config(empty) == load_config({})


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


# ---------- app de escritorio (spec 007 · plan §2.3) ----------

MAC_DATA = Path("Library") / "Application Support" / "AsistenciApp"


def test_from_source_the_data_stays_in_the_project():  # CA-18
    config = load_config({}, desktop=False, platform="darwin", home=Path("/Users/ana"))
    assert config == load_config({})
    assert config.cloudflared_path is None  # se busca en el PATH, como hoy


def test_desktop_on_macos_uses_application_support(tmp_path):  # CA-05, CA-06
    config = load_config({}, desktop=True, platform="darwin", home=tmp_path)
    folder = tmp_path / MAC_DATA
    assert config.db_path == folder / "asistencia.db"
    assert config.google_token_path == folder / "google-token.json"


def test_desktop_on_windows_uses_appdata(tmp_path):  # CA-05, CA-06
    appdata = tmp_path / "AppData" / "Roaming"
    config = load_config({"APPDATA": str(appdata)}, desktop=True, platform="win32", home=tmp_path / "otra")
    assert config.db_path == appdata / "AsistenciApp" / "asistencia.db"
    assert config.google_token_path == appdata / "AsistenciApp" / "google-token.json"


@pytest.mark.parametrize("environ", [{}, {"APPDATA": ""}])
def test_desktop_on_windows_without_appdata_uses_the_usual_folder(tmp_path, environ):  # CA-05
    config = load_config(environ, desktop=True, platform="win32", home=tmp_path)
    assert config.db_path == tmp_path / "AppData" / "Roaming" / "AsistenciApp" / "asistencia.db"


def test_desktop_keeps_the_user_data_out_of_the_app(tmp_path):  # CA-05, CA-06: actualizar no toca los datos
    bundle = tmp_path / "AsistenciApp.app" / "Contents" / "Frameworks"
    config = load_config({}, desktop=True, platform="darwin", home=tmp_path / "ana", bundle=bundle)
    for path in (config.db_path, config.google_token_path):
        assert path.is_relative_to(tmp_path / "ana" / MAC_DATA)
        assert not path.is_relative_to(bundle.parent.parent)


def test_desktop_variables_still_win(tmp_path):  # F5: el entorno manda
    environ = {
        "ASISTENCIA_DB": "copia.db",
        "ASISTENCIA_GOOGLE_CLIENT": "llave.json",
        "ASISTENCIA_GOOGLE_TOKEN": "permiso.json",
    }
    config = load_config(environ, desktop=True, platform="darwin", home=tmp_path, bundle=tmp_path / "app")
    assert (config.db_path, config.google_client_path, config.google_token_path) == (
        Path("copia.db"),
        Path("llave.json"),
        Path("permiso.json"),
    )


def test_desktop_uses_the_key_inside_the_app(tmp_path):  # CA-14 · plan §2.8
    bundle = tmp_path / "app"
    config = load_config({}, desktop=True, platform="darwin", home=tmp_path, bundle=bundle)
    assert config.google_client_path == bundle / "google-client.json"


def test_desktop_prefers_the_profesors_own_key(tmp_path):  # CA-16
    own_key = tmp_path / MAC_DATA / "google-client.json"
    own_key.parent.mkdir(parents=True)
    own_key.write_text("{}")
    config = load_config({}, desktop=True, platform="darwin", home=tmp_path, bundle=tmp_path / "app")
    assert config.google_client_path == own_key


def test_desktop_from_source_without_a_bundle_uses_the_projects_key(tmp_path):  # --ventana desde el código
    config = load_config({}, desktop=True, platform="darwin", home=tmp_path)
    assert config.google_client_path == DEFAULT_GOOGLE_CLIENT
    assert config.cloudflared_path is None


def test_lock_port_defaults_and_can_be_changed():  # CA-03 · plan §2.5
    assert load_config({}).lock_port == DEFAULT_LOCK_PORT == 47913
    assert load_config({"ASISTENCIA_LOCK_PORT": "50123"}).lock_port == 50123
    assert load_config({"ASISTENCIA_LOCK_PORT": ""}).lock_port == DEFAULT_LOCK_PORT


@pytest.mark.parametrize("port", ["abc", "0", "65536", "٤٧٩١٣"])
def test_invalid_lock_port_is_rejected(port):
    with pytest.raises(InvalidLockPortError) as exc:
        load_config({"ASISTENCIA_LOCK_PORT": port})
    assert "ASISTENCIA_LOCK_PORT" in str(exc.value)
    assert issubclass(InvalidLockPortError, ConfigError)


@pytest.mark.parametrize(("platform", "name"), [("darwin", "cloudflared"), ("win32", "cloudflared.exe")])
def test_desktop_uses_the_cloudflared_inside_the_app(tmp_path, platform, name):  # CA-07 · plan §2.3
    bundle = tmp_path / "app"
    config = load_config({"APPDATA": str(tmp_path)}, desktop=True, platform=platform, home=tmp_path, bundle=bundle)
    assert config.cloudflared_path == bundle / name
