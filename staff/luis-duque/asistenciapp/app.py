"""AsistenciApp: servidor Flask (plan §1, §4).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
"""

import argparse
import hmac
import os
import socket
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, Response, abort, g, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia import acciones, db
from asistencia.comprobar_nombre import clasificar, remember
from asistencia.tunnel import TunnelError, start_tunnel

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time, comprobar=None):
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica (plan §2.10, CA-19).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    conn = db.connect(db_path)
    db.init_schema(conn)
    app.config["TEACHER_TOKEN"] = token or db.get_or_create_teacher_token(conn)
    conn.close()
    check_name = remember(comprobar if comprobar is not None else clasificar)

    # ---------- utilidades ----------

    def get_db():
        # Una conexión por petición (plan §2.9).
        if "db" not in g:
            g.db = db.connect(db_path)
        return g.db

    @app.teardown_appcontext
    def close_db(_exc):
        conn = g.pop("db", None)
        if conn is not None:
            conn.close()

    def now_iso() -> str:
        return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")

    def error(status: int, message: str):
        return jsonify(error=message), status

    def session_or_404(session_id: str):
        try:
            return acciones.public_session(get_db(), session_id)
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)

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
        return jsonify(session_or_404(session_id))

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        try:
            result = acciones.register(
                get_db(),
                session_id,
                body.get("name"),
                body.get("code", ""),
                now(),
                now_iso(),
                check_name,
            )
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)
        except acciones.SessionClosed:
            return error(409, CLOSED)  # CA-09
        except acciones.InvalidName as exc:
            return error(400, str(exc))
        except ValueError as exc:
            return error(400, str(exc))  # CA-08
        except acciones.InvalidCode:
            return error(422, INVALID_CODE)  # CA-06
        if result["already"]:
            return jsonify(already=True, name=result["name"], checkedAt=result["checkedAt"])  # CA-07
        return jsonify(name=result["name"], checkedAt=result["checkedAt"]), 201  # CA-04

    # ---------- API del profesor ----------

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify(acciones.list_sessions(get_db()))  # CA-16

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        session = acciones.open_session(
            get_db(),
            body.get("title"),
            datetime.fromtimestamp(now()),
            now_iso(),
        )
        return jsonify(session), 201  # CA-01

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        try:
            data = acciones.teacher_view(get_db(), session_id, now())
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)
        data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        try:
            acciones.close_session(get_db(), session_id, now_iso())  # CA-13
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        try:
            acciones.remove_checkin(get_db(), session_id, checkin_id)  # CA-24
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)
        except acciones.CheckinNotFound:
            return error(404, "Ese registro no existe en esta clase.")
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        try:
            session, csv_text = acciones.download_list(get_db(), session_id)  # CA-14
        except acciones.SessionNotFound:
            abort(404, NOT_FOUND)
        day = session["opened_at"][:10]
        return Response(
            csv_text,
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
