"""Tests del arranque (app.py) · spec 005 CA-03, CA-07; spec 001 CA-19 a CA-21; spec 004 HU-01 (T13).

Se prueba `main()` sin levantar el servidor. Solo se sustituye lo que está fuera del sistema
(ARCHITECTURE.md · T4): `Flask.run`, el programa cloudflared y Google Meet. El puerto ocupado es un socket real.
"""

import io
import logging
import re
import socket

import pytest
from flask import Flask

import app
from attendance.config import InvalidPortError
from attendance.domain.errors import MeetingLinkInvalidError, MeetServiceError
from attendance.domain.participants import MeetingAttendance, Who
from attendance.infra import tunnel
from attendance.infra.google_meet import GoogleMeet
from attendance.infra.tunnel import CloudflaredMissingError

TUNNEL_LINE = "2026-10-20T08:33:25Z INF |  https://abc-def.trycloudflare.com  |\n"


def free_port():
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))  # 0 = un puerto libre elegido por el sistema
        return probe.getsockname()[1]


class FakeCloudflared:
    """Sustituye al programa cloudflared: anuncia su URL y apunta si lo han parado."""

    def __init__(self):
        self.stdout = io.StringIO(TUNNEL_LINE)
        self.terminated = False

    def terminate(self):
        self.terminated = True


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
def cloudflared(monkeypatch):
    process = FakeCloudflared()
    monkeypatch.setattr(tunnel.shutil, "which", lambda _name: "/usr/bin/cloudflared")
    monkeypatch.setattr(tunnel.subprocess, "Popen", lambda *_a, **_k: process)
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
