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

from asistencia import db
from asistencia.codes import code_for, is_valid_code, seconds_left
from asistencia.export import to_csv
from asistencia.names import clean_name, name_key
from asistencia.tunnel import TunnelError, start_tunnel

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica (plan §2.10, CA-19).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    conn = db.connect(db_path)
    db.init_schema(conn)
    app.config["TEACHER_TOKEN"] = token or db.get_or_create_teacher_token(conn)
    conn.close()

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

    def session_or_404(session_id: str) -> dict:
        session = db.get_session(get_db(), session_id)
        if session is None:
            abort(404, NOT_FOUND)
        return session

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
        session = session_or_404(session_id)
        return jsonify(title=session["title"], open=session["closed_at"] is None)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        session = session_or_404(session_id)
        if session["closed_at"] is not None:
            return error(409, CLOSED)  # CA-09

        body = request.get_json(silent=True) or {}
        try:
            name = clean_name(body.get("name"))
        except ValueError as exc:
            return error(400, str(exc))  # CA-08

        if not is_valid_code(session["secret"], body.get("code", ""), now()):
            return error(422, INVALID_CODE)  # CA-06

        row, created = db.add_checkin(get_db(), session_id, name, name_key(name), now_iso())
        if not created:
            return jsonify(already=True, name=row["name"], checkedAt=row["checked_at"])  # CA-07
        return jsonify(name=row["name"], checkedAt=row["checked_at"]), 201  # CA-04

    # ---------- API del profesor ----------

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
            for s in db.list_sessions(get_db())
        ])  # CA-16

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        title = str(body.get("title") or "").strip()
        if not title:
            title = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")  # CA-02
        session = db.create_session(get_db(), title, now_iso())
        return jsonify(id=session["id"], title=session["title"]), 201  # CA-01

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        session = session_or_404(session_id)
        checkins = db.list_checkins(get_db(), session_id)
        data = {
            "id": session["id"],
            "title": session["title"],
            "open": session["closed_at"] is None,
            "openedAt": session["opened_at"],
            "closedAt": session["closed_at"],
            "studentUrl": f"{request.host_url}alumno.html?s={session_id}",
            "total": len(checkins),  # CA-11
            "checkins": [
                {"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]} for c in checkins
            ],
        }
        if data["open"]:  # sin código si está cerrada (CA-13)
            data["code"] = code_for(session["secret"], now())
            data["secondsLeft"] = seconds_left(now())
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        session_or_404(session_id)
        db.close_session(get_db(), session_id, now_iso())  # CA-13
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        session_or_404(session_id)
        if not db.remove_checkin(get_db(), session_id, checkin_id):  # CA-24
            return error(404, "Ese registro no existe en esta clase.")
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        session = session_or_404(session_id)
        day = session["opened_at"][:10]
        return Response(
            to_csv(db.list_checkins(get_db(), session_id)),  # CA-14
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
