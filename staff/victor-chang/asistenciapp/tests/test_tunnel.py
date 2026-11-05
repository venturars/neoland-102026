"""Tests de attendance/infra/tunnel.py · spec 001 CA-20; spec 005 · plan §2.7; spec 007 CA-07, CA-12.

Las líneas son copias reales de la salida de cloudflared 2026.10.1.
"""

import threading
import time

import pytest

from attendance.domain.errors import AppError
from attendance.infra import tunnel
from attendance.infra.tunnel import (
    CloudflaredMissingError,
    Tunnel,
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


# El cloudflared falso (`fake_cloudflared`) está en conftest.py: lo comparten test_web_online.py y test_app.py.


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


# ---------- cloudflared dentro de la app y clase Tunnel (spec 007 · plan §2.6) ----------

URL = "https://actual-academics-century-ratio.trycloudflare.com"


@pytest.fixture
def bundled(tmp_path):
    """Un cloudflared "dentro de la app": un archivo que existe."""
    path = tmp_path / "cloudflared"
    path.write_text("")
    return path


def test_start_tunnel_uses_the_given_executable(fake_cloudflared, monkeypatch, bundled):  # CA-07
    fake_cloudflared(URL_LINE + "\n")
    monkeypatch.setattr(tunnel.shutil, "which", lambda _name: pytest.fail("no debe buscar en el PATH"))
    start_tunnel(8000, timeout=5, executable=bundled)
    args, _kwargs = fake_cloudflared.calls[0]
    assert args == [str(bundled), "tunnel", "--url", "http://127.0.0.1:8000"]


def test_start_tunnel_with_a_missing_executable(fake_cloudflared, tmp_path):
    fake_cloudflared(URL_LINE + "\n")
    with pytest.raises(CloudflaredMissingError):
        start_tunnel(8000, timeout=5, executable=tmp_path / "no-existe")
    assert fake_cloudflared.calls == []


def test_on_windows_cloudflared_opens_no_console(fake_cloudflared, monkeypatch):  # plan §2.6
    fake_cloudflared(URL_LINE + "\n")
    monkeypatch.setattr(tunnel.sys, "platform", "win32")
    start_tunnel(8000, timeout=5)
    _args, kwargs = fake_cloudflared.calls[0]
    assert kwargs["creationflags"] == tunnel.CREATE_NO_WINDOW == 0x08000000


def test_on_macos_there_are_no_windows_flags(fake_cloudflared, monkeypatch):
    fake_cloudflared(URL_LINE + "\n")
    monkeypatch.setattr(tunnel.sys, "platform", "darwin")
    start_tunnel(8000, timeout=5)
    _args, kwargs = fake_cloudflared.calls[0]
    assert kwargs.get("creationflags", 0) == 0


def test_tunnel_starts_closed():
    assert Tunnel(executable=None, port=8000).url is None


def test_open_twice_starts_one_cloudflared(fake_cloudflared):  # CA-07: dos clics, un túnel
    fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    assert online.open() == URL
    assert online.open() == URL
    assert online.url == URL
    assert len(fake_cloudflared.calls) == 1


def test_open_from_two_threads_starts_one_cloudflared(fake_cloudflared):  # dos peticiones a la vez
    fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    urls = []
    threads = [threading.Thread(target=lambda: urls.append(online.open())) for _ in range(2)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    assert urls == [URL, URL]
    assert len(fake_cloudflared.calls) == 1


def test_close_ends_cloudflared(fake_cloudflared):  # CA-12
    process = fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    online.open()
    online.close()
    assert process.terminated and not process.killed
    assert online.url is None


def test_close_kills_a_cloudflared_that_does_not_stop(fake_cloudflared):  # F4: libera lo que abrió
    process = fake_cloudflared(URL_LINE + "\n", stubborn=True)
    online = Tunnel(executable=None, port=8000, timeout=5)
    online.open()
    online.close()
    assert process.terminated and process.killed
    assert online.url is None


def test_close_without_opening_does_not_fail():  # lo llama el finally de app.py
    online = Tunnel(executable=None, port=8000)
    online.close()
    online.close()
    assert online.url is None


def test_reopen_after_closing_starts_a_new_cloudflared(fake_cloudflared):
    fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    online.open()
    online.close()
    fake_cloudflared(URL_LINE + "\n")
    assert online.open() == URL
    assert len(fake_cloudflared.calls) == 2


def test_listeners_hear_each_change(fake_cloudflared):  # plan v1.1 §2.7: la ventana pide confirmar al cerrar
    fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    heard = []
    online.on_change.append(heard.append)
    online.open()
    online.open()  # ya abierto: no cambia nada
    online.close()
    assert heard == [URL, None]


def test_url_is_none_if_cloudflared_died_on_its_own(fake_cloudflared):  # el panel no dice "Activa" sin túnel
    process = fake_cloudflared(URL_LINE + "\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    online.open()
    process.exit_code = 1
    assert online.url is None


def test_open_passes_on_the_errors(fake_cloudflared):  # CA-08: el error llega al panel
    fake_cloudflared("2026-10-20T08:33:16Z ERR failed to request quick Tunnel\n")
    online = Tunnel(executable=None, port=8000, timeout=5)
    with pytest.raises(TunnelExitedError):
        online.open()
    assert online.url is None
