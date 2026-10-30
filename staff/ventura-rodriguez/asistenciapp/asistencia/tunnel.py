"""Túnel público con cloudflared para que los alumnos entren desde casa (plan §2.10)."""

import queue
import re
import shutil
import subprocess
import sys
import threading

TUNNEL_URL = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com")


class TunnelError(Exception):
    pass


def install_hint(platform: str = sys.platform) -> str:
    """Cómo instalar cloudflared en ese sistema.

    :param platform: valor de ``sys.platform`` (``darwin``, ``win32``, ``linux``…).
    :return: el comando o la página para instalarlo.
    :rtype: str

    Usage::

      print(install_hint())
    """
    if platform == "darwin":
        return "brew install cloudflared"
    if platform == "win32":
        return "winget install --id Cloudflare.cloudflared"
    return "descárgalo de https://github.com/cloudflare/cloudflared/releases o del gestor de paquetes de tu sistema"


def find_tunnel_url(line: str) -> str | None:
    """Devuelve la URL pública si la línea de cloudflared la contiene."""
    match = TUNNEL_URL.search(line)
    return match.group(0) if match else None


def start_tunnel(port: int, timeout: float = 30) -> tuple[subprocess.Popen, str]:
    """Lanza cloudflared y espera a que anuncie su URL. Devuelve (proceso, url)."""
    executable = shutil.which("cloudflared")
    if executable is None:
        raise TunnelError(f"No se encontró cloudflared. Para instalarlo: {install_hint()}")

    # 127.0.0.1 y no "localhost": Flask solo escucha en IPv4.
    process = subprocess.Popen(
        [executable, "tunnel", "--url", f"http://127.0.0.1:{port}"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    found: queue.Queue[str] = queue.Queue()

    def read_output():
        # Hay que seguir leyendo siempre: si nadie vacía la tubería, cloudflared se bloquea.
        for line in process.stdout:
            url = find_tunnel_url(line)
            if url:
                found.put(url)

    threading.Thread(target=read_output, daemon=True).start()

    try:
        return process, found.get(timeout=timeout)
    except queue.Empty:
        process.terminate()
        raise TunnelError(
            f"cloudflared no dio una URL en {timeout:.0f} s. Revisa tu conexión a internet e inténtalo de nuevo."
        ) from None
