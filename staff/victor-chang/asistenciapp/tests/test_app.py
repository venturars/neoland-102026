"""Tests del arranque (app.py) · spec 005 CA-03, CA-07; spec 001 CA-19 a CA-21.

Se prueba `main()` sin levantar el servidor. Solo se sustituye lo que está fuera del sistema
(ARCHITECTURE.md · T4): `Flask.run` y el programa cloudflared. El puerto ocupado es un socket real.
"""

import io
import logging
import socket

import pytest
from flask import Flask

import app
from attendance.config import InvalidPortError
from attendance.infra import tunnel
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
