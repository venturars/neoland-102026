"""Fixtures compartidas: app con BD temporal, token fijo, reloj falso y cloudflared falso."""

import io
import os
import subprocess

import pytest

from attendance.config import Config
from attendance.entrypoints.web import create_app
from attendance.infra import tunnel

TOKEN = "token-de-prueba"
TUNNEL_URL = "https://actual-academics-century-ratio.trycloudflare.com"
# Copia real de la salida de cloudflared 2026.10.1.
TUNNEL_URL_LINE = f"2026-10-20T08:33:25Z INF |  {TUNNEL_URL}                                  |"


class FakeClock:
    """Reloj controlable: los tests deciden qué hora es."""

    def __init__(self, t: float = 1_800_000_000.0):
        self.t = t

    def __call__(self) -> float:
        return self.t

    def advance(self, seconds: float) -> None:
        self.t += seconds


@pytest.fixture
def clock():
    return FakeClock()


@pytest.fixture
def app(tmp_path, clock):
    # timezone=None: la zona del sistema, como hasta ahora (spec 005 · plan §2.4).
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    return create_app(config, clock=clock, teacher_token=TOKEN)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def teacher():
    """Cabeceras del profesor."""
    return {"X-Teacher-Token": TOKEN}


class FakeProcess:
    """Sustituye a cloudflared: su salida es un texto fijo (ARCHITECTURE.md · T4: solo se simula lo externo)."""

    def __init__(self, output: str | None, stubborn: bool = False):
        if output is None:  # un cloudflared que no dice nada ni termina
            read_end, self._write_end = os.pipe()
            self.stdout = os.fdopen(read_end)
        else:
            self._write_end = None
            self.stdout = io.StringIO(output)
        self.terminated = False
        self.killed = False
        self.exit_code: int | None = None
        self._stubborn = stubborn  # no sale con terminate(): hay que matarlo

    def terminate(self) -> None:
        self.terminated = True
        if self._write_end is not None:  # como al morir cloudflared: su salida se acaba
            os.close(self._write_end)
            self._write_end = None
        if not self._stubborn:
            self.exit_code = 0

    def wait(self, timeout: float | None = None) -> int:
        if self.exit_code is None:
            raise subprocess.TimeoutExpired("cloudflared", timeout or 0)
        return self.exit_code

    def kill(self) -> None:
        self.killed = True
        self.exit_code = -9

    def poll(self) -> int | None:
        return self.exit_code


@pytest.fixture
def fake_cloudflared(monkeypatch):
    """Instala un cloudflared falso y guarda cómo se lanzó cada vez (`install.calls`)."""

    def install(output: str | None, stubborn: bool = False) -> FakeProcess:
        process = FakeProcess(output, stubborn)

        def popen(args, **kwargs):
            install.calls.append((args, kwargs))
            return process

        monkeypatch.setattr(tunnel.shutil, "which", lambda _name: "/usr/bin/cloudflared")
        monkeypatch.setattr(tunnel.subprocess, "Popen", popen)
        return process

    install.calls = []
    return install
