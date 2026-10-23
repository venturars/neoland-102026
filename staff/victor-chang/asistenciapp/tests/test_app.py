"""Tests del arranque (app.py) · spec 005 CA-03, CA-07; spec 001 CA-19 a CA-21.

Se prueba `main()` sin levantar el servidor: `Flask.run` se sustituye y la BD es temporal.
"""

import logging

import pytest
from flask import Flask

import app
from attendance.config import InvalidPortError
from attendance.infra.tunnel import CloudflaredMissingError


@pytest.fixture
def started(tmp_path, monkeypatch):
    """Arranca main() con una BD temporal y apunta con qué argumentos se llamó a Flask.run."""
    runs = []
    monkeypatch.setenv("ASISTENCIA_DB", str(tmp_path / "datos" / "clases.db"))
    monkeypatch.delenv("PORT", raising=False)
    monkeypatch.setattr(app, "port_in_use", lambda _port: False)
    monkeypatch.setattr(Flask, "run", lambda _self, **kwargs: runs.append(kwargs))
    monkeypatch.setattr("sys.argv", ["app.py"])
    return runs


def test_starts_on_localhost_only(started, tmp_path, capsys):  # spec 001 · X6
    app.main()
    assert started == [{"host": "127.0.0.1", "port": 8000}]
    assert (tmp_path / "datos" / "clases.db").exists()  # crea la carpeta de datos
    assert "http://localhost:8000/profesor.html#t=" in capsys.readouterr().out


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
    monkeypatch.setattr(app, "port_in_use", lambda _port: True)
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert "PORT=8001 python app.py" in str(exc.value.code)
    assert started == []


def test_tunnel_error_stops_with_its_message(started, monkeypatch):  # spec 001 CA-20
    def no_tunnel(_port):
        raise CloudflaredMissingError

    monkeypatch.setattr(app, "start_tunnel", no_tunnel)
    monkeypatch.setattr("sys.argv", ["app.py", "--tunel"])
    with pytest.raises(SystemExit) as exc:
        app.main()
    assert CloudflaredMissingError.MESSAGE in str(exc.value.code)
    assert started == []


def test_tunnel_link_and_cleanup(started, monkeypatch, capsys):  # spec 001 CA-19, CA-21
    class FakeProcess:
        terminated = False

        def terminate(self):
            self.terminated = True

    process = FakeProcess()
    monkeypatch.setattr(app, "start_tunnel", lambda _port: (process, "https://abc.trycloudflare.com"))
    monkeypatch.setattr("sys.argv", ["app.py", "--tunel"])
    app.main()
    assert "https://abc.trycloudflare.com/profesor.html#t=" in capsys.readouterr().out
    assert process.terminated  # al parar la app, se cierra también el túnel
