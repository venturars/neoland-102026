"""AsistenciApp: servidor Flask (plan §1, §4).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
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

from asistencia.usecases import attendance
from asistencia.domain.session import SessionNotFound, SessionClosed, InvalidCode
from asistencia.domain.attempts import Banned
from asistencia.tunnel import TunnelError, start_tunnel

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path: str | Path = DEFAULT_DB, token: str | None = None, now=time.time) -> Flask:
    """Construye la entrada HTTP con almacenamiento y reloj inyectados.

    :param db_path: archivo SQLite local.
    :param token: token de profesor opcional.
    :param now: función que devuelve el instante Unix.
    :return: aplicación HTTP configurada.
    :rtype: Flask

    Usage::

      app = create_app(path, token, clock)
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # El túnel aporta esquema y host; la identidad conserva la IP de conexión.
    # Puede ser la del proxy, compartida por toda la clase (spec 006).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=0, x_proto=1, x_host=1)

    app.config["TEACHER_TOKEN"] = attendance.prepare(db_path, token)

    def error(status: int, message: str):
        return jsonify(error=message), status

    @app.errorhandler(SessionNotFound)
    def missing_session(exc):
        return error(404, str(exc))

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            if exc.description == NOT_FOUND:
                return error(404, NOT_FOUND)
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
            row, created = attendance.check_in(
                db_path, session_id, body.get("name"), body.get("code", ""), now(), request.remote_addr or ""
            )
        except Banned as exc:
            return error(429, str(exc))
        except SessionClosed as exc:
            return error(409, str(exc))
        except InvalidCode as exc:
            return error(422, str(exc))
        except SessionNotFound:
            raise
        except ValueError as exc:
            return error(400, str(exc))
        if not created:
            return jsonify(already=True, name=row["name"], checkedAt=row["checked_at"])
        return jsonify(name=row["name"], checkedAt=row["checked_at"]), 201

    # ---------- API del profesor ----------

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify(attendance.list_sessions(db_path))

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        session = attendance.create_session(db_path, body.get("title"), now())
        return jsonify(id=session["id"], title=session["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        data = attendance.teacher_view(db_path, session_id, now())
        data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        attendance.close_session(db_path, session_id, now())
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        if not attendance.remove_checkin(db_path, session_id, checkin_id):
            return error(404, "Ese registro no existe en esta clase.")
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        content, day = attendance.export_session(db_path, session_id)
        return Response(content, mimetype="text/csv", headers={
            "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
        })

    return app


def port_in_use(port: int) -> bool:
    """True si ya hay algo escuchando en 127.0.0.1:port (p. ej. otra AsistenciApp)."""
    with socket.socket() as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0


def main() -> None:
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
