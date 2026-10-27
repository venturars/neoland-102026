"""Tests de asistencia/tunnel.py · CA-20.

Las líneas son copias reales de la salida de cloudflared 2026.10.1.
"""

import io
import time

import pytest

from asistencia import tunnel
from asistencia.tunnel import TunnelError, find_tunnel_url, start_tunnel

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

    def __init__(self, output: str):
        self.stdout = io.StringIO(output)
        self.terminated = False

    def terminate(self) -> None:
        self.terminated = True


@pytest.fixture
def fake_cloudflared(monkeypatch):
    def install(output: str) -> FakeProcess:
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
    with pytest.raises(TunnelError, match="se cerró"):
        start_tunnel(8000, timeout=5)
    assert time.monotonic() - started < 1
    assert process.terminated
