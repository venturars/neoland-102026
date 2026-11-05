"""Túnel público con cloudflared para que los alumnos entren desde casa (spec 001 · plan §2.10, CA-19 a CA-21).

Es el único módulo que lanza cloudflared (ARCHITECTURE.md · F4): espera un tiempo máximo, avisa en
cuanto cloudflared termina sin dar la URL, y lo para si algo va mal. Sus errores tienen nombre y
mensaje propios (E3; spec 005 · plan §2.7).

`Tunnel` guarda el túnel abierto entre peticiones, para abrir y cerrar la clase online desde el panel
(spec 007 · plan §2.6). En la app de escritorio, cloudflared va dentro de la app (`executable`).
"""

import queue
import re
import shutil
import subprocess
import sys
import threading
from collections.abc import Callable
from pathlib import Path
from typing import IO, cast

from attendance.domain.errors import AppError

TIMEOUT_SECONDS = 30
STOP_TIMEOUT_SECONDS = 5  # al cerrar: si cloudflared no sale en este tiempo, se mata (F4)
# En Windows, sin consola para cloudflared (spec 007 · plan §2.6). La constante solo existe allí.
CREATE_NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
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


def start_tunnel(
    port: int,
    timeout: float = TIMEOUT_SECONDS,
    executable: Path | None = None,
) -> tuple[subprocess.Popen[str], str]:
    """Lanza cloudflared y espera a que anuncie su URL. Devuelve (proceso, url).

    Args:
        port: puerto local de la app.
        timeout: segundos máximos de espera; los tests usan menos.
        executable: el cloudflared que va dentro de la app (`Config.cloudflared_path`); si es None,
            se busca en el PATH, como al arrancar desde el código.

    Raises:
        CloudflaredMissingError: cloudflared no está instalado (o falta dentro de la app).
        TunnelTimeoutError: no ha dado su URL a tiempo.
        TunnelExitedError: ha terminado sin dar su URL.
    """
    program = _find_cloudflared(executable)

    # 127.0.0.1 y no "localhost": Flask solo escucha en IPv4.
    # S603: se lanza el ejecutable que encuentra shutil.which, con argumentos fijos y sin shell.
    process = subprocess.Popen(  # noqa: S603
        [program, "tunnel", "--url", f"http://127.0.0.1:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        creationflags=CREATE_NO_WINDOW if sys.platform == "win32" else 0,
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


def close_process(process: subprocess.Popen[str]) -> None:
    """Para cloudflared y espera a que salga; si no sale en `STOP_TIMEOUT_SECONDS`, lo mata (F4)."""
    process.terminate()
    try:
        process.wait(timeout=STOP_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        process.kill()


class Tunnel:
    """La clase online: el túnel abierto, si lo hay (M3: guarda el proceso entre peticiones).

    `on_change` son funciones a las que se avisa con la URL nueva (o None) cada vez que se abre o se
    cierra; la ventana de escritorio la usa para pedir confirmación al cerrar (spec 007 · plan §2.7).
    """

    def __init__(self, executable: Path | None, port: int, timeout: float = TIMEOUT_SECONDS) -> None:
        """Prepara el túnel sin abrirlo.

        Args:
            executable: el cloudflared que va dentro de la app, o None para buscarlo en el PATH.
            port: puerto local de la app.
            timeout: segundos máximos de espera al abrir; los tests usan menos.
        """
        self._executable = executable
        self._port = port
        self._timeout = timeout
        self._process: subprocess.Popen[str] | None = None
        self._url: str | None = None
        self._lock = threading.Lock()  # dos clics seguidos no lanzan dos cloudflared
        self.on_change: list[Callable[[str | None], None]] = []

    @property
    def url(self) -> str | None:
        """La URL pública, o None si no hay clase online (o cloudflared se cerró solo)."""
        if self._process is None or self._process.poll() is not None:
            return None
        return self._url

    def open(self) -> str:
        """Abre la clase online y devuelve su URL; si ya estaba abierta, devuelve la misma.

        Raises:
            CloudflaredMissingError: falta cloudflared.
            TunnelTimeoutError: no ha dado su URL a tiempo.
            TunnelExitedError: ha terminado sin dar su URL.
        """
        with self._lock:
            if self.url is not None:
                return self.url
            self._close_dead()
            self._process, self._url = start_tunnel(self._port, self._timeout, self._executable)
            url = self._url
        self._notify(url)
        return url

    def close(self) -> None:
        """Cierra la clase online. Si no estaba abierta, no hace nada."""
        with self._lock:
            if self._process is None:
                return
            close_process(self._process)
            self._process, self._url = None, None
        self._notify(None)

    def _close_dead(self) -> None:
        # Un cloudflared que se cerró solo: se recoge antes de abrir otro.
        if self._process is not None:
            close_process(self._process)
            self._process, self._url = None, None

    def _notify(self, url: str | None) -> None:
        for listener in self.on_change:
            listener(url)


def _find_cloudflared(executable: Path | None) -> str:
    if executable is None:
        found = shutil.which("cloudflared")
        if found is None:
            raise CloudflaredMissingError
        return found
    if not executable.exists():
        raise CloudflaredMissingError  # la app está incompleta: falta el que va dentro
    return str(executable)


def _read_output(stream: IO[str], found: "queue.Queue[str | None]") -> None:
    # Hay que seguir leyendo siempre: si nadie vacía la tubería, cloudflared se bloquea.
    for line in stream:
        url = find_tunnel_url(line)
        if url:
            found.put(url)
    found.put(None)  # cloudflared terminó: no hace falta esperar al tiempo máximo
