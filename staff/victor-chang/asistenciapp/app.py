"""AsistenciApp: arranque (spec 001 · plan §1; spec 005 · plan §2.4).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola. T15 lo deja solo como
punto de montaje (ARCHITECTURE.md · C4).
"""

import argparse
import os
import sys

from attendance.config import ConfigError, load_config
from attendance.entrypoints.web import context, create_app
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import TunnelError, start_tunnel


def main() -> None:
    """Arranca la app en local y, con --tunel, también el túnel público (spec 001 · CA-19 a CA-21)."""
    parser = argparse.ArgumentParser(description="AsistenciApp: pasar lista en clases online.")
    parser.add_argument(
        "--tunel", action="store_true",
        help="abre un túnel público con cloudflared para que los alumnos entren desde casa",
    )
    args = parser.parse_args()

    try:
        config = load_config(os.environ)
    except ConfigError as exc:
        sys.exit(f"  Error: {exc}")
    port = config.port
    if port_in_use(port):
        sys.exit(
            f"  Error: el puerto {port} ya está en uso. ¿Tienes AsistenciApp abierta en otra terminal?\n"
            f"  Ciérrala con Ctrl+C, o arranca en otro puerto: PORT={port + 1} python app.py"
        )
    config.db_path.parent.mkdir(parents=True, exist_ok=True)
    app = create_app(config)

    tunnel, base_url = None, f"http://localhost:{port}"
    if args.tunel:
        print("  Abriendo el túnel público (puede tardar unos segundos)...")
        try:
            tunnel, base_url = start_tunnel(port)
        except TunnelError as exc:
            sys.exit(f"  Error: {exc}")

    print(f"\n  Panel del profesor: {base_url}/profesor.html#t={context.of(app).teacher_token}\n")
    if args.tunel:
        print("  (Si el enlace no carga, espera unos 20 segundos: el túnel tarda en estar accesible.)\n")
    else:
        print("  (Solo funciona en este ordenador. Para una clase online: python app.py --tunel)\n")
    try:
        # Solo en 127.0.0.1: desde fuera se entra únicamente por el túnel (plan §2.10).
        app.run(host="127.0.0.1", port=port)
    finally:
        if tunnel:
            tunnel.terminate()


if __name__ == "__main__":
    main()
