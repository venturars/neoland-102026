"""AsistenciApp: borde HTTP de la aplicación (rutas, token del profesor y arranque).

Usage::

    python app.py            # solo en local
    python app.py --tunel    # con enlace público para clases online
"""

import argparse
import hmac
import os
import socket
import sys
import time
from pathlib import Path

from flask import Flask, Response, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.domain.rate_limit import IpBanned
from asistencia.domain.session import (
    CheckinNotFound,
    InvalidCode,
    SessionClosed,
    SessionNotFound,
)
from asistencia.export import to_csv
from asistencia.tunnel import TunnelError, start_tunnel
from asistencia.usecases import attendance

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}

# Cada error del dominio se traduce a su estado HTTP.
DOMAIN_ERRORS = {
    SessionNotFound: 404,
    CheckinNotFound: 404,
    SessionClosed: 409,
    InvalidCode: 422,
    IpBanned: 429,
}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    """Crea la aplicación Flask: rutas, token del profesor y errores HTTP.

    :param db_path: ruta de la base de datos.
    :param token: token del profesor; si falta, se usa el guardado o se crea.
    :param now: reloj que devuelve segundos Unix (los tests lo sustituyen).
    :return: la aplicación lista para ejecutar.
    :rtype: Flask

    Usage::

        >>> app = create_app(token="secreto")  # doctest: +SKIP
        >>> app.run(host="127.0.0.1", port=8000)  # doctest: +SKIP
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica (plan §2.10, CA-19).
    # x_for=0: la IP que se cuenta es la de la conexión, no una cabecera que escribe el usuario (spec 006, CA-11).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=0, x_proto=1, x_host=1)

    teacher_token = attendance.prepare(db_path)
    app.config["TEACHER_TOKEN"] = token or teacher_token

    # ---------- utilidades ----------

    def error(status: int, message: str):
        return jsonify(error=message), status

    for error_class, status in DOMAIN_ERRORS.items():
        app.register_error_handler(error_class, lambda exc, status=status: error(status, str(exc)))

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        # Todo lo que cuelga de /api/sessions es solo para el profesor (CA-15, CA-17).
        if request.path == "/api/sessions" or request.path.startswith("/api/sessions/"):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return error(401, UNAUTHORIZED)

    # ---------- páginas ----------

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    # ---------- API pública (alumno) ----------

    @app.get("/api/s/<session_id>")
    def public_session(session_id):
        return jsonify(attendance.public_session(db_path, session_id))

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        try:
            result, created = attendance.check_in(
                db_path, session_id, body.get("name"), body.get("code", ""), request.remote_addr, now
            )
        except ValueError as exc:
            return error(400, str(exc))  # CA-08
        if not created:
            return jsonify(already=True, **result)  # CA-07
        return jsonify(result), 201  # CA-04

    # ---------- API del profesor ----------

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify(attendance.list_sessions(db_path))  # CA-16

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        return jsonify(attendance.create_session(db_path, body.get("title"), now)), 201  # CA-01

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        data = attendance.teacher_view(db_path, session_id, now)
        data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        attendance.close_session(db_path, session_id, now)  # CA-13
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        attendance.remove_checkin(db_path, session_id, checkin_id)  # CA-24
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        session, checkins = attendance.checkins_for_export(db_path, session_id)
        day = session["opened_at"][:10]
        return Response(
            to_csv(checkins),  # CA-14
            mimetype="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
            },
        )

    return app


def port_in_use(port: int) -> bool:
    """True si ya hay algo escuchando en 127.0.0.1:port (p. ej. otra AsistenciApp)."""
    with socket.socket() as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0


def main():
    parser = argparse.ArgumentParser(description="AsistenciApp: pasar lista en clases online.")
    parser.add_argument(
        "--tunel", action="store_true",
        help="abre un túnel público con cloudflared para que los alumnos entren desde casa",
    )
    args = parser.parse_args()

    port = int(os.environ.get("PORT", 8000))
    if port_in_use(port):
        sys.exit(
            f"  Error: el puerto {port} ya está en uso. ¿Tienes AsistenciApp abierta en otra terminal?\n"
            f"  Ciérrala con Ctrl+C, o arranca en otro puerto: PORT={port + 1} python app.py"
        )
    DEFAULT_DB.parent.mkdir(exist_ok=True)
    app = create_app()

    tunnel, base_url = None, f"http://localhost:{port}"
    if args.tunel:
        print("  Abriendo el túnel público (puede tardar unos segundos)...")
        try:
            tunnel, base_url = start_tunnel(port)
        except TunnelError as exc:
            sys.exit(f"  Error: {exc}")

    print(f"\n  Panel del profesor: {base_url}/profesor.html#t={app.config['TEACHER_TOKEN']}\n")
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
