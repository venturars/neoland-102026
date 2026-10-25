"""AsistenciApp: arranque, el único punto de montaje (spec 001 · plan §1; spec 004 · plan §1; spec 005 · plan §2.4).

Lee la configuración del entorno, prepara las piezas y lanza el servidor (ARCHITECTURE.md · C4).
Uso: `python app.py` (solo en este ordenador), `python app.py --tunel` (clase online) y
`python app.py --meet <enlace>` (clase automática de Meet; con `--meet-todos`, todos los que han estado).
"""

import argparse
import logging
import os
import subprocess
import sys
import time
from contextlib import closing

from attendance.config import Config, ConfigError, load_config
from attendance.domain.errors import MeetingLinkInvalidError
from attendance.domain.participants import Who
from attendance.entrypoints import cli
from attendance.entrypoints.web import context, create_app
from attendance.infra import storage
from attendance.infra.google_meet import GoogleMeet, parse_meeting_code
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import TunnelError, start_tunnel


def main() -> None:
    """Arranca la app en local y, con --tunel, también el túnel público (spec 001 · CA-19 a CA-21).

    Con --meet, antes abre la clase automática y toma la asistencia una vez (spec 004 · HU-01).
    """
    args = _parse_args()
    configure_logging()
    config = _load_config()
    _check_port(config.port)
    config.db_path.parent.mkdir(parents=True, exist_ok=True)
    meet = GoogleMeet(config.google_client_path, config.google_token_path)
    app = create_app(config, fetch_participants=meet.participants)
    session_id = _start_meet_session(config, meet, args.meet, args.meet_todos) if args.meet else None

    tunnel, base_url = None, f"http://localhost:{config.port}"
    if args.tunel:
        tunnel, base_url = _open_tunnel(config.port)
    _print_links(base_url, context.of(app).teacher_token, args.tunel, session_id)
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
    parser.add_argument(
        "--meet",
        metavar="ENLACE",
        help="abre una clase automática para esa reunión de Meet y toma la asistencia (quién está ahora)",
    )
    parser.add_argument(
        "--meet-todos",
        action="store_true",
        help="con --meet, registra a todos los que han estado en la reunión, no solo a quien está ahora",
    )
    args = parser.parse_args()
    if args.meet_todos and not args.meet:
        parser.error("--meet-todos solo funciona junto con --meet <enlace>")
    return args


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


def _start_meet_session(config: Config, meet: GoogleMeet, meeting: str, everyone: bool) -> str:
    """Abre la clase y toma la asistencia; un enlace mal escrito para el arranque (spec 004 · CA-14)."""
    try:
        parse_meeting_code(meeting)  # antes de anunciar la toma ni abrir el navegador
    except MeetingLinkInvalidError as exc:
        sys.exit(f"  Error: {exc.MESSAGE}")
    print("  Tomando la asistencia de Meet (la primera vez se abre el navegador para dar permiso)...")
    who = Who.EVERYONE if everyone else Who.NOW
    with closing(storage.connect(config.db_path)) as conn:
        session_id, message = cli.start_meet_session(
            conn, meet.participants, meeting, who, time.time(), config.timezone
        )
    print(f"  {message}")
    return session_id


def _open_tunnel(port: int) -> tuple[subprocess.Popen[str], str]:
    print("  Abriendo el túnel público (puede tardar unos segundos)...")
    try:
        return start_tunnel(port)
    except TunnelError as exc:
        sys.exit(f"  Error: {exc}")


def _print_links(base_url: str, teacher_token: str, with_tunnel: bool, session_id: str | None = None) -> None:
    session = f"&s={session_id}" if session_id else ""  # con --meet, el panel abre esa clase
    print(f"\n  Panel del profesor: {base_url}/profesor.html#t={teacher_token}{session}\n")
    if with_tunnel:
        print("  (Si el enlace no carga, espera unos 20 segundos: el túnel tarda en estar accesible.)\n")
    else:
        print("  (Solo funciona en este ordenador. Para una clase online: python app.py --tunel)\n")


if __name__ == "__main__":
    main()
