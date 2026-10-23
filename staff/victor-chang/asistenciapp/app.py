"""AsistenciApp: arranque, el único punto de montaje (spec 001 · plan §1; spec 005 · plan §2.4, §2.8).

Lee la configuración del entorno, prepara las piezas y lanza el servidor (ARCHITECTURE.md · C4).
Uso: `python app.py` (solo en este ordenador) o `python app.py --tunel` (clase online).
"""

import argparse
import logging
import os
import subprocess
import sys

from attendance.config import Config, ConfigError, load_config
from attendance.entrypoints.web import context, create_app
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import TunnelError, start_tunnel


def main() -> None:
    """Arranca la app en local y, con --tunel, también el túnel público (spec 001 · CA-19 a CA-21)."""
    args = _parse_args()
    configure_logging()
    config = _load_config()
    _check_port(config.port)
    config.db_path.parent.mkdir(parents=True, exist_ok=True)
    app = create_app(config)

    tunnel, base_url = None, f"http://localhost:{config.port}"
    if args.tunel:
        tunnel, base_url = _open_tunnel(config.port)
    _print_links(base_url, context.of(app).teacher_token, args.tunel)
    try:
        # Solo en 127.0.0.1: desde fuera se entra únicamente por el túnel (spec 001 · plan §2.10; X6).
        app.run(host="127.0.0.1", port=config.port)
    finally:
        if tunnel:
            tunnel.terminate()


def configure_logging() -> None:
    """Registros de la app por consola, sin el registro de accesos (spec 005 · CA-07; E7).

    El servidor de desarrollo de Flask (werkzeug) escribe la IP de cada petición; se deja solo
    con sus avisos y errores. Lo que necesita ver quien arranca la app lo imprime `main()`.
    """
    logging.basicConfig(level=logging.INFO, format="  %(levelname)s %(name)s: %(message)s")
    logging.getLogger("werkzeug").setLevel(logging.WARNING)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AsistenciApp: pasar lista en clases online.")
    parser.add_argument(
        "--tunel",
        action="store_true",
        help="abre un túnel público con cloudflared para que los alumnos entren desde casa",
    )
    return parser.parse_args()


def _load_config() -> Config:
    try:
        return load_config(os.environ)
    except ConfigError as exc:
        sys.exit(f"  Error: {exc}")


def _check_port(port: int) -> None:
    if port_in_use(port):
        sys.exit(
            f"  Error: el puerto {port} ya está en uso. ¿Tienes AsistenciApp abierta en otra terminal?\n"
            f"  Ciérrala con Ctrl+C, o arranca en otro puerto: PORT={port + 1} python app.py"
        )


def _open_tunnel(port: int) -> tuple[subprocess.Popen[str], str]:
    print("  Abriendo el túnel público (puede tardar unos segundos)...")
    try:
        return start_tunnel(port)
    except TunnelError as exc:
        sys.exit(f"  Error: {exc}")


def _print_links(base_url: str, teacher_token: str, with_tunnel: bool) -> None:
    print(f"\n  Panel del profesor: {base_url}/profesor.html#t={teacher_token}\n")
    if with_tunnel:
        print("  (Si el enlace no carga, espera unos 20 segundos: el túnel tarda en estar accesible.)\n")
    else:
        print("  (Solo funciona en este ordenador. Para una clase online: python app.py --tunel)\n")


if __name__ == "__main__":
    main()
