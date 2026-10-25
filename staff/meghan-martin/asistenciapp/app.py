"""AsistenciApp: servidor Flask (plan §1, §4).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
La página pide una acción. No abre la base.
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

# Banned means a computer tried to check in too many times.
from asistencia.domain.attempts import Banned
from asistencia.domain.session import InvalidCode, SessionClosed, SessionNotFound
from asistencia.tunnel import TunnelError, start_tunnel
from asistencia.usecases import attendance

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Behind the public link, keep the public https address in the student link.
    # x_for=0 means: do not trust an address sent in a header.
    # The computer we count is the one that actually connected.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=0, x_proto=1, x_host=1)

    stored = attendance.prepare(db_path)
    app.config["TEACHER_TOKEN"] = token or stored

    def error(status: int, message: str):
        return jsonify(error=message), status

    def call(action):
        try:
            return action()
        except SessionNotFound as exc:
            return error(404, str(exc))
        except SessionClosed as exc:
            return error(409, str(exc))
        except InvalidCode as exc:
            return error(422, str(exc))
        except Banned as exc:
            # 429 means "too many tries". The text is the Spanish block sentence.
            return error(429, str(exc))
        except ValueError as exc:
            return error(400, str(exc))

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

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/api/s/<session_id>")
    def public_session(session_id):
        def action():
            return jsonify(attendance.public_session(db_path, session_id))

        return call(action)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}

        def action():
            row, created = attendance.check_in(
                db_path,  # the attendance file on this computer
                session_id,  # which class
                body.get("name"),  # the name they typed
                body.get("code", ""),  # the code they typed, or blank
                now(),  # the time of this try
                # The computer that connected. A typed address is not used.
                # A missing address becomes blank, so those tries share one count.
                request.remote_addr or "",
            )
            if not created:
                return jsonify(already=True, name=row["name"], checkedAt=row["checked_at"])
            return jsonify(name=row["name"], checkedAt=row["checked_at"]), 201

        return call(action)

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify([
            {
                "id": s["id"],
                "title": s["title"],
                "openedAt": s["opened_at"],
                "closedAt": s["closed_at"],
                "total": s["total"],
            }
            for s in attendance.list_sessions(db_path)
        ])

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        session = attendance.create_session(db_path, body.get("title"), now())
        return jsonify(id=session["id"], title=session["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        def action():
            data = attendance.teacher_view(db_path, session_id, now())
            data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
            data["checkins"] = [
                {"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]}
                for c in data["checkins"]
            ]
            return jsonify(data)

        return call(action)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        def action():
            attendance.close_session(db_path, session_id, now())
            return jsonify(ok=True)

        return call(action)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        def action():
            if not attendance.remove_checkin(db_path, session_id, checkin_id):
                return error(404, "Ese registro no existe en esta clase.")
            return jsonify(ok=True)

        return call(action)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        def action():
            csv_text, day = attendance.export_csv(db_path, session_id)
            return Response(
                csv_text,
                mimetype="text/csv",
                headers={
                    "Content-Disposition": (
                        f'attachment; filename="asistencia-{day}-{session_id}.csv"'
                    )
                },
            )

        return call(action)

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
