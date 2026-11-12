"""Tests de attendance/infra/tunnel.py · spec 001 CA-20; spec 005 · plan §2.7 (errores con nombre).

Las líneas son copias reales de la salida de cloudflared 2026.10.1.
"""

import io
import os
import time

import pytest

from attendance.domain.errors import AppError
from attendance.infra import tunnel
from attendance.infra.tunnel import (
    CloudflaredMissingError,
    TunnelError,
    TunnelExitedError,
    TunnelTimeoutError,
    find_tunnel_url,
    start_tunnel,
)

URL_LINE = (
    "2026-10-20T08:33:25Z INF |  https://actual-academics-century-ratio.trycloudflare.com"
    "                                  |"
)


def test_finds_url_in_real_line():
    assert find_tunnel_url(URL_LINE) == "https://actual-academics-century-ratio.trycloudflare.com"


@pytest.mark.parametrize(
    "line",
    [
        # Contiene otras URLs de Cloudflare que NO son la del túnel.
        "2026-10-20T08:33:15Z INF Thank you for trying Cloudflare Tunnel. ... "
        "(https://www.cloudflare.com/website-terms/) ... "
        "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps",
        # Menciona trycloudflare.com pero aún no hay URL.
        "2026-10-20T08:33:15Z INF Requesting new quick Tunnel on trycloudflare.com...",
        # Error al pedir el túnel (línea de ejemplo, no copiada): nombra la API, no la URL pública.
        "2026-10-20T08:33:16Z ERR Error unmarshaling QuickTunnel response: "
        "error code: 1015 url=https://api.trycloudflare.com/tunnel",
        "2026-10-20T08:33:25Z INF Starting metrics server on 127.0.0.1:20241/metrics",
        "",
    ],
)
def test_ignores_other_lines(line):
    assert find_tunnel_url(line) is None


class FakeProcess:
    """Sustituye a cloudflared: su salida es un texto fijo."""

    def __init__(self, output: str | None):
        if output is None:  # un cloudflared que no dice nada ni termina
            read_end, self._write_end = os.pipe()
            self.stdout = os.fdopen(read_end)
        else:
            self._write_end = None
            self.stdout = io.StringIO(output)
        self.terminated = False

    def terminate(self) -> None:
        self.terminated = True
        if self._write_end is not None:  # como al morir cloudflared: su salida se acaba
            os.close(self._write_end)
            self._write_end = None


@pytest.fixture
def fake_cloudflared(monkeypatch):
    def install(output: str | None) -> FakeProcess:
        process = FakeProcess(output)
        monkeypatch.setattr(tunnel.shutil, "which", lambda _name: "/usr/bin/cloudflared")
        monkeypatch.setattr(tunnel.subprocess, "Popen", lambda *_a, **_k: process)
        return process

    return install


def test_start_tunnel_returns_url(fake_cloudflared):
    process = fake_cloudflared(URL_LINE + "\n")
    assert start_tunnel(8000, timeout=5) == (
        process,
        "https://actual-academics-century-ratio.trycloudflare.com",
    )


def test_start_tunnel_fails_fast_when_cloudflared_exits(fake_cloudflared):
    process = fake_cloudflared("2026-10-20T08:33:16Z ERR failed to request quick Tunnel\n")
    started = time.monotonic()
    with pytest.raises(TunnelExitedError):
        start_tunnel(8000, timeout=5)
    assert time.monotonic() - started < 1
    assert process.terminated


def test_start_tunnel_gives_up_after_the_timeout(fake_cloudflared):  # ARCHITECTURE F4
    process = fake_cloudflared(None)
    with pytest.raises(TunnelTimeoutError):
        start_tunnel(8000, timeout=0.2)
    assert process.terminated


def test_missing_cloudflared(monkeypatch):
    monkeypatch.setattr(tunnel.shutil, "which", lambda _name: None)
    with pytest.raises(CloudflaredMissingError):
        start_tunnel(8000)


@pytest.mark.parametrize("error", [CloudflaredMissingError, TunnelTimeoutError, TunnelExitedError])
def test_tunnel_errors_say_what_to_do(error):  # E3, E5
    assert issubclass(error, TunnelError) and issubclass(TunnelError, AppError)
    assert error.MESSAGE.count(". ") >= 1 or ": " in error.MESSAGE
