"""AsistenciApp: arranque, el único punto de montaje (spec 001 · plan §1; spec 004 · plan §1; spec 005 · plan §2.4).

Lee la configuración del entorno, prepara las piezas y lanza el servidor (ARCHITECTURE.md · C4).
Uso desde el código: `python app.py` (solo en este ordenador), `python app.py --tunel` (clase online),
`python app.py --meet <enlace>` (clase automática de Meet; con `--meet-todos`, todos los que han estado)
y `python app.py --ventana` (la app de escritorio, como al abrirla empaquetada; spec 007 · plan §2.2).
"""

import argparse
import logging
import os
import sys
import time
from contextlib import closing
from pathlib import Path

from attendance.config import Config, ConfigError, load_config
from attendance.domain.errors import MeetingLinkInvalidError
from attendance.domain.meetings import parse_meeting_code
from attendance.domain.participants import Who
from attendance.entrypoints import cli, desktop
from attendance.entrypoints.web import context, create_app
from attendance.infra import instance, server, storage
from attendance.infra.google_meet import GoogleMeet
from attendance.infra.instance import AlreadyRunningError
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import Tunnel, TunnelError


def main() -> None:
    """Arranca la app de escritorio (empaquetada o con --ventana) o, si no, la de la terminal."""
    args = _parse_args()
    configure_logging()
    if args.ventana or getattr(sys, "frozen", False):  # PyInstaller pone sys.frozen (spec 007 · plan §2.2)
        _run_desktop()
    else:
        _run_terminal(args)


def configure_logging() -> None:
    """Registros de la app por consola, sin el registro de accesos (spec 005 · CA-07; E7).

    El servidor de desarrollo de Flask (werkzeug) escribe la IP de cada petición; se deja solo
    con sus avisos y errores. Lo que necesita ver quien arranca la app lo imprime `main()`.
    """
    logging.basicConfig(level=logging.INFO, format="  %(levelname)s %(name)s: %(message)s")
    logging.getLogger("werkzeug").setLevel(logging.WARNING)


# ---------- desde la terminal (specs 001 y 004) ----------


def _run_terminal(args: argparse.Namespace) -> None:
    """Arranca en local y, con --tunel, también el túnel público (spec 001 · CA-19 a CA-21).

    Con --meet, antes abre la clase automática y toma la asistencia una vez (spec 004 · HU-01). La
    clase online también se puede abrir después desde el panel (spec 007 · plan §2.6).
    """
    config = _load_config()
    _check_port(config.port)
    config.db_path.parent.mkdir(parents=True, exist_ok=True)
    meet = GoogleMeet(config.google_client_path, config.google_token_path)
    tunnel = Tunnel(config.cloudflared_path, config.port)
    app = create_app(config, fetch_participants=meet.participants, tunnel=tunnel)
    session_id = _start_meet_session(config, meet, args.meet, args.meet_todos) if args.meet else None
    try:
        base_url = _open_tunnel(tunnel) if args.tunel else f"http://localhost:{config.port}"
        _print_links(base_url, context.of(app).teacher_token, args.tunel, session_id)
        # Solo en 127.0.0.1: desde fuera se entra únicamente por el túnel (spec 001 · plan §2.10; X6).
        app.run(host="127.0.0.1", port=config.port)
    finally:
        tunnel.close()


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
    parser.add_argument(
        "--ventana",
        action="store_true",
        help="abre la app de escritorio, como al abrirla empaquetada (la clase online y Meet, desde el panel)",
    )
    args = parser.parse_args()
    if args.meet_todos and not args.meet:
        parser.error("--meet-todos solo funciona junto con --meet <enlace>")
    if args.ventana and (args.tunel or args.meet):
        parser.error("--ventana no se combina con --tunel ni --meet: en la ventana se hacen desde el panel")
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
        started = cli.start_meet_session(conn, meet.participants, meeting, who, time.time(), config.timezone)
    print(f"  {started.message}")
    return started.session_id


def _open_tunnel(tunnel: Tunnel) -> str:
    print("  Abriendo el túnel público (puede tardar unos segundos)...")
    try:
        return tunnel.open()
    except TunnelError as exc:
        sys.exit(f"  Error: {exc}")


def _print_links(base_url: str, teacher_token: str, with_tunnel: bool, session_id: str | None = None) -> None:
    session = f"&s={session_id}" if session_id else ""  # con --meet, el panel abre esa clase
    print(f"\n  Panel del profesor: {base_url}/profesor.html#t={teacher_token}{session}\n")
    if with_tunnel:
        print("  (Si el enlace no carga, espera unos 20 segundos: el túnel tarda en estar accesible.)\n")
    else:
        print("  (Solo funciona en este ordenador. Para una clase online: python app.py --tunel)\n")


# ---------- app de escritorio (spec 007 · plan v1.1 §2.2) ----------


def _run_desktop() -> None:
    """Una sola copia (CA-03), datos en la carpeta del usuario (CA-05) y el panel en una ventana.

    Sin terminal, los errores de arranque se enseñan en una ventana pequeña (`desktop.show_message`).
    """
    meipass = getattr(sys, "_MEIPASS", None)  # la carpeta con lo que va dentro de la app empaquetada
    try:
        config = load_config(os.environ, desktop=True, bundle=Path(meipass) if meipass else None)
        lock = instance.acquire(config.lock_port)
    except (ConfigError, AlreadyRunningError) as exc:
        desktop.show_message(exc.MESSAGE)
        return
    try:
        _open_desktop(config)
    finally:
        lock.release()


def _open_desktop(config: Config) -> None:
    """Monta las piezas, arranca el servidor en un hilo y abre la ventana; al cerrarla, para todo (CA-12)."""
    config.db_path.parent.mkdir(parents=True, exist_ok=True)
    meet = GoogleMeet(config.google_client_path, config.google_token_path)
    tunnel = Tunnel(config.cloudflared_path, port=0)  # el puerto lo elige el sistema al arrancar el servidor
    app = create_app(config, fetch_participants=meet.participants, tunnel=tunnel, desktop=True)
    with server.start(app) as running:
        tunnel.port = running.port
        try:
            panel = f"http://127.0.0.1:{running.port}/profesor.html#t={context.of(app).teacher_token}"
            desktop.run_window(panel, tunnel)
        finally:
            tunnel.close()


if __name__ == "__main__":
    main()
