"""Túnel público con cloudflared para que los alumnos entren desde casa (spec 001 · plan §2.10, CA-19 a CA-21).

Es el único módulo que lanza cloudflared (ARCHITECTURE.md · F4): espera un tiempo máximo, avisa en
cuanto cloudflared termina sin dar la URL, y lo para si algo va mal. Sus errores tienen nombre y
mensaje propios (E3; spec 005 · plan §2.7).
"""

import queue
import re
import shutil
import subprocess
import threading
from typing import IO, cast

from attendance.domain.errors import AppError

TIMEOUT_SECONDS = 30
# Excluye api.trycloudflare.com: cloudflared la nombra en sus mensajes de error.
TUNNEL_URL = re.compile(r"https://(?!api\.)[a-z0-9-]+\.trycloudflare\.com")


class TunnelError(AppError):
    """No se ha podido abrir el túnel público."""


class CloudflaredMissingError(TunnelError):
    """cloudflared no está instalado (spec 001 · CA-20)."""

    MESSAGE = "No se encontró cloudflared. Instálalo con: brew install cloudflared"


class TunnelTimeoutError(TunnelError):
    """cloudflared no ha dado su URL en el tiempo máximo."""

    MESSAGE = f"cloudflared no dio una URL en {TIMEOUT_SECONDS} s. Revisa tu conexión a internet e inténtalo de nuevo."


class TunnelExitedError(TunnelError):
    """cloudflared ha terminado sin dar su URL."""

    MESSAGE = "cloudflared se cerró sin dar una URL. Revisa tu conexión a internet e inténtalo de nuevo."


def find_tunnel_url(line: str) -> str | None:
    """Devuelve la URL pública si la línea de cloudflared la contiene."""
    match = TUNNEL_URL.search(line)
    return match.group(0) if match else None


def start_tunnel(port: int, timeout: float = TIMEOUT_SECONDS) -> tuple[subprocess.Popen[str], str]:
    """Lanza cloudflared y espera a que anuncie su URL. Devuelve (proceso, url).

    Args:
        port: puerto local de la app.
        timeout: segundos máximos de espera; los tests usan menos.

    Raises:
        CloudflaredMissingError: cloudflared no está instalado.
        TunnelTimeoutError: no ha dado su URL a tiempo.
        TunnelExitedError: ha terminado sin dar su URL.
    """
    executable = shutil.which("cloudflared")
    if executable is None:
        raise CloudflaredMissingError

    # 127.0.0.1 y no "localhost": Flask solo escucha en IPv4.
    # S603: se lanza el ejecutable que encuentra shutil.which, con argumentos fijos y sin shell.
    process = subprocess.Popen(  # noqa: S603
        [executable, "tunnel", "--url", f"http://127.0.0.1:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    found: queue.Queue[str | None] = queue.Queue()
    # Con stdout=PIPE, process.stdout nunca es None.
    threading.Thread(target=_read_output, args=(cast(IO[str], process.stdout), found), daemon=True).start()

    try:
        url = found.get(timeout=timeout)
    except queue.Empty:
        process.terminate()
        raise TunnelTimeoutError from None  # la espera agotada no aporta nada más
    if url is None:
        process.terminate()
        raise TunnelExitedError
    return process, url


def _read_output(stream: IO[str], found: "queue.Queue[str | None]") -> None:
    # Hay que seguir leyendo siempre: si nadie vacía la tubería, cloudflared se bloquea.
    for line in stream:
        url = find_tunnel_url(line)
        if url:
            found.put(url)
    found.put(None)  # cloudflared terminó: no hace falta esperar al tiempo máximo
