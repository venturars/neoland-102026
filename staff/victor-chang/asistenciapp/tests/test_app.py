"""Tests del arranque (app.py) · spec 005 CA-03, CA-07; spec 001 CA-19 a CA-21; spec 004 HU-01 (T13).

Se prueba `main()` sin levantar el servidor. Solo se sustituye lo que está fuera del sistema
(ARCHITECTURE.md · T4): `Flask.run`, el programa cloudflared y Google Meet. El puerto ocupado es un socket real.
"""

import html
import logging
import os
import re
import socket
import sys
import urllib.error
import urllib.request
from pathlib import Path

import pytest
from flask import Flask

import app
from attendance.config import InvalidLockPortError, InvalidPortError, user_data_dir
from attendance.domain.errors import MeetingLinkInvalidError, MeetServiceError
from attendance.domain.participants import MeetingAttendance, Who
from attendance.infra import instance, tunnel
from attendance.infra.google_meet import GoogleMeet
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import CloudflaredMissingError, Tunnel

TUNNEL_LINE = "2026-10-20T08:33:25Z INF |  https://abc-def.trycloudflare.com  |\n"


def free_port():
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))  # 0 = un puerto libre elegido por el sistema
        return probe.getsockname()[1]


@pytest.fixture
def started(tmp_path, monkeypatch):
    """Prepara main() con una BD temporal y un puerto libre; apunta con qué se llamó a Flask.run."""
    runs = []
    monkeypatch.setenv("ASISTENCIA_DB", str(tmp_path / "datos" / "clases.db"))
    monkeypatch.setenv("PORT", str(free_port()))
    monkeypatch.setattr(Flask, "run", lambda _self, **kwargs: runs.append(kwargs))
    monkeypatch.setattr("sys.argv", ["app.py"])
    return runs


@pytest.fixture
def cloudflared(fake_cloudflared, monkeypatch):
    """`--tunel` con el cloudflared falso de conftest.py (el que necesita `Tunnel`, spec 007)."""
    process = fake_cloudflared(TUNNEL_LINE)
    monkeypatch.setattr("sys.argv", ["app.py", "--tunel"])
    return process


def test_starts_on_localhost_only(started, tmp_path, capsys, monkeypatch):  # spec 001 · X6
    monkeypatch.setenv("PORT", port := str(free_port()))
    app.main()
    assert started == [{"host": "127.0.0.1", "port": int(port)}]
    assert (tmp_path / "datos" / "clases.db").exists()  # crea la carpeta de datos
    assert f"http://localhost:{port}/profesor.html#t=" in capsys.readouterr().out


def test_access_log_is_silenced(started, monkeypatch):  # CA-07: el registro de accesos escribe la IP de cada petición
    werkzeug = logging.getLogger("werkzeug")
    # werkzeug sube su registro a INFO al arrancar, pero solo si nadie le ha puesto nivel.
    monkeypatch.setattr(werkzeug, "level", logging.NOTSET)
    app.main()
    assert werkzeug.level == logging.WARNING


def test_bad_config_stops_with_its_message(started, monkeypatch):  # CA-03
    monkeypatch.setenv("PORT", "abc")
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert InvalidPortError.MESSAGE in str(exc.value.code)
    assert started == []


def test_busy_port_stops_with_advice(started, monkeypatch):
    with socket.socket() as busy:
        busy.bind(("127.0.0.1", 0))
        busy.listen()
        port = busy.getsockname()[1]
        monkeypatch.setenv("PORT", str(port))
        with pytest.raises(SystemExit) as exc:
            app.main()
    assert f"PORT={port + 1} python app.py" in str(exc.value.code)
    assert started == []


def test_missing_cloudflared_stops_with_its_message(started, monkeypatch):  # spec 001 CA-20
    monkeypatch.setattr(tunnel.shutil, "which", lambda _name: None)
    monkeypatch.setattr("sys.argv", ["app.py", "--tunel"])
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert CloudflaredMissingError.MESSAGE in str(exc.value.code)
    assert started == []


def test_tunnel_link_and_cleanup(started, cloudflared, capsys):  # spec 001 CA-19, CA-21
    app.main()
    assert "https://abc-def.trycloudflare.com/profesor.html#t=" in capsys.readouterr().out
    assert cloudflared.terminated  # al parar la app, se cierra también el túnel


# ---------- Atajo --meet (spec 004 · T13; decisión §8.2) ----------


@pytest.fixture
def google(monkeypatch):
    """Sustituye a Google Meet: apunta cada toma y da dos participantes (o lanza `error`)."""
    calls = []

    class Fake:
        error = None

    def participants(_self, meeting_code, who):
        calls.append((meeting_code, who))
        if Fake.error is not None:
            raise Fake.error
        return MeetingAttendance(names=("Ana", "Luis"), started_at="2026-10-23T06:56:00Z", ended=False)

    monkeypatch.setattr(GoogleMeet, "participants", participants)
    Fake.calls = calls
    return Fake


def test_the_web_app_gets_google_meet(started, monkeypatch):  # C4: app.py monta GoogleMeet
    built = []
    real_create_app = app.create_app

    def spy(config, **kwargs):
        built.append(kwargs)
        return real_create_app(config, **kwargs)

    monkeypatch.setattr(app, "create_app", spy)
    app.main()
    assert isinstance(built[0]["fetch_participants"].__self__, GoogleMeet)


def test_meet_creates_the_session_and_links_to_it(started, google, capsys, monkeypatch):  # HU-01
    monkeypatch.setattr("sys.argv", ["app.py", "--meet", "abc-defg-hij"])
    app.main()
    out = capsys.readouterr().out
    assert google.calls == [("abc-defg-hij", Who.NOW)]
    assert "Añadidas 2 personas nuevas · 2 en la llamada ahora" in out
    assert re.search(r"/profesor\.html#t=[^&\s]+&s=[\w-]+", out)  # el panel abre esa clase
    assert len(started) == 1


def test_meet_everyone(started, google, monkeypatch):
    monkeypatch.setattr("sys.argv", ["app.py", "--meet", "abc-defg-hij", "--meet-todos"])
    app.main()
    assert google.calls == [("abc-defg-hij", Who.EVERYONE)]


def test_meet_with_tunnel(started, google, cloudflared, capsys, monkeypatch):
    monkeypatch.setattr("sys.argv", ["app.py", "--meet", "abc-defg-hij", "--tunel"])
    app.main()
    assert "https://abc-def.trycloudflare.com/profesor.html#t=" in capsys.readouterr().out
    assert cloudflared.terminated


def test_meet_with_a_wrong_link_does_not_start(started, google, monkeypatch):  # CA-14
    monkeypatch.setattr("sys.argv", ["app.py", "--meet", "zoom.us/j/123"])
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert MeetingLinkInvalidError.MESSAGE in str(exc.value.code)
    assert google.calls == []
    assert started == []


def test_a_failed_sync_still_starts(started, google, capsys, monkeypatch):
    google.error = MeetServiceError()
    monkeypatch.setattr("sys.argv", ["app.py", "--meet", "abc-defg-hij"])
    app.main()
    assert MeetServiceError.MESSAGE in capsys.readouterr().out
    assert len(started) == 1  # se puede reintentar desde el panel


def test_meet_everyone_needs_meet(started, monkeypatch):
    monkeypatch.setattr("sys.argv", ["app.py", "--meet-todos"])
    with pytest.raises(SystemExit):
        app.main()
    assert started == []


# ---------- spec 007 · T12: modo escritorio (plan v1.1 §2.2) ----------


def spy_create_app(monkeypatch):
    """Apunta con qué se montó la app web, sin cambiar nada."""
    built = []
    real_create_app = app.create_app

    def spy(config, **kwargs):
        built.append((config, kwargs))
        return real_create_app(config, **kwargs)

    monkeypatch.setattr(app, "create_app", spy)
    return built


def get(url, token=None, method="GET"):
    """Una petición de verdad al servidor que arranca app.py; devuelve (código, cuerpo)."""
    headers = {"X-Teacher-Token": token} if token else {}
    request = urllib.request.Request(url, method=method, headers=headers)  # noqa: S310 — solo http://127.0.0.1
    try:
        with urllib.request.urlopen(request, timeout=5) as response:  # noqa: S310
            return response.status, response.read().decode()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode()


def panel_parts(url):
    """De `http://127.0.0.1:<puerto>/profesor.html#t=<token>` saca (base, puerto, token)."""
    match = re.fullmatch(r"(http://127\.0\.0\.1:(\d+))/profesor\.html#t=(\S+)", url)
    assert match, url
    return match.group(1), int(match.group(2)), match.group(3)


@pytest.fixture
def desktop_env(tmp_path, monkeypatch, fake_webview):
    """`--ventana` con la carpeta del usuario en tmp_path y un puerto de bloqueo libre."""
    monkeypatch.setenv("HOME", str(tmp_path))
    monkeypatch.setenv("APPDATA", str(tmp_path / "AppData" / "Roaming"))
    for name in ("ASISTENCIA_DB", "ASISTENCIA_GOOGLE_CLIENT", "ASISTENCIA_GOOGLE_TOKEN", "PORT"):
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setenv("ASISTENCIA_LOCK_PORT", str(free_port()))
    monkeypatch.setattr("sys.argv", ["app.py", "--ventana"])
    monkeypatch.setattr(Flask, "run", lambda *_a, **_k: pytest.fail("en escritorio no se usa Flask.run"))
    return fake_webview


def test_ventana_opens_the_panel_in_a_window(desktop_env):  # CA-01, plan §2.2
    answers = []
    desktop_env.on_start = lambda webview: answers.append(get(webview.created[0]["url"].split("#")[0]))
    app.main()
    [window] = desktop_env.created
    panel_parts(window["url"])  # http://127.0.0.1:<puerto libre>/profesor.html#t=<token>
    assert answers[0][0] == 200  # mientras la ventana está abierta, el servidor responde
    assert desktop_env.started == 1


def test_desktop_keeps_the_data_in_the_user_folder(desktop_env):  # CA-05, CA-06
    app.main()
    folder = user_data_dir(os.environ, sys.platform, Path.home())
    assert (folder / "asistencia.db").exists()


def test_closing_the_window_stops_everything(desktop_env):  # CA-12
    app.main()
    _base, port, _token = panel_parts(desktop_env.created[0]["url"])
    assert not port_in_use(port)  # el servidor se ha parado
    instance.acquire(int(os.environ["ASISTENCIA_LOCK_PORT"])).release()  # y el bloqueo se ha soltado


def test_the_online_class_closes_with_the_window(desktop_env, fake_cloudflared):  # CA-10, CA-12
    process = fake_cloudflared(TUNNEL_LINE)
    seen = {}

    def during(webview):
        base, _port, token = panel_parts(webview.created[0]["url"])
        seen["open"] = get(f"{base}/api/online", token, method="POST")
        seen["asks_to_close"] = webview.created[0]["window"].confirm_close

    desktop_env.on_start = during
    app.main()
    assert seen["open"][0] == 200 and "abc-def.trycloudflare.com" in seen["open"][1]
    assert seen["asks_to_close"] is True
    assert process.terminated


def test_a_failing_window_still_cleans_up(desktop_env):  # F4, S7: el finally
    desktop_env.on_start = RuntimeError("la ventana falla")
    with pytest.raises(RuntimeError):
        app.main()
    _base, port, _token = panel_parts(desktop_env.created[0]["url"])
    assert not port_in_use(port)
    instance.acquire(int(os.environ["ASISTENCIA_LOCK_PORT"])).release()


def test_a_second_copy_shows_a_message(desktop_env, monkeypatch):  # CA-03
    built = spy_create_app(monkeypatch)
    with instance.acquire(int(os.environ["ASISTENCIA_LOCK_PORT"])):
        app.main()
    [window] = desktop_env.created
    assert "AsistenciApp ya está abierta." in window["html"]
    assert built == []  # no se monta nada más


def test_bad_config_in_the_desktop_shows_a_message(desktop_env, monkeypatch):  # sin terminal, el error en una ventana
    monkeypatch.setenv("ASISTENCIA_LOCK_PORT", "abc")
    app.main()
    [window] = desktop_env.created
    assert html.escape(InvalidLockPortError.MESSAGE) in window["html"]


def test_the_packaged_app_is_the_desktop_without_options(desktop_env, tmp_path, monkeypatch):  # CA-01
    bundle = tmp_path / "AsistenciApp.app" / "Contents" / "Frameworks"
    monkeypatch.setattr("sys.argv", ["AsistenciApp"])
    monkeypatch.setattr(sys, "frozen", True, raising=False)
    monkeypatch.setattr(sys, "_MEIPASS", str(bundle), raising=False)
    built = spy_create_app(monkeypatch)
    app.main()
    config, kwargs = built[0]
    assert kwargs["desktop"] is True
    assert config.cloudflared_path is not None and config.cloudflared_path.parent == bundle
    assert config.google_client_path == bundle / "google-client.json"  # la llave incluida (plan §2.8)


@pytest.mark.parametrize("extra", [["--tunel"], ["--meet", "abc-defg-hij"]])
def test_ventana_does_not_combine_with_terminal_options(desktop_env, monkeypatch, extra):
    monkeypatch.setattr("sys.argv", ["app.py", "--ventana", *extra])
    with pytest.raises(SystemExit):
        app.main()
    assert desktop_env.created == []


def test_from_the_terminal_the_panel_can_open_the_online_class(started, monkeypatch):  # CA-18 + spec 007 · plan §2.6
    built = spy_create_app(monkeypatch)
    app.main()
    _config, kwargs = built[0]
    assert isinstance(kwargs["tunnel"], Tunnel)
    assert kwargs.get("desktop", False) is False
