"""AsistenciApp: traduce la petición del navegador a una acción y devuelve la respuesta.

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

from flask import Flask, Response, g, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.actions.attendance import (
    BANNED,
    CLOSED,
    INVALID_CODE,
    MISSING_CHECKIN,
    NOT_FOUND,
    ActionError,
    close_session,
    export_csv,
    list_sessions,
    open_session,
    public_session,
    register,
    remove_checkin,
    screen_caller,
    teacher_view,
)
from asistencia.infra import db
from asistencia.infra.tunnel import TunnelError, start_tunnel

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}
STATUS = {CLOSED: 409, INVALID_CODE: 422, NOT_FOUND: 404, MISSING_CHECKIN: 404, BANNED: 403}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    """Construye la aplicación web.

    :param db_path: ruta del archivo de la base.
    :param token: token del profesor. None lo lee o lo crea en la base.
    :param now: función que devuelve el instante actual, en segundos Unix.
    :return: la aplicación lista para servir.
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar el protocolo y el host públicos.
    # x_for queda en 0: la IP de la conexión no se toma de una cabecera.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=0, x_proto=1, x_host=1)

    conn = db.connect(db_path)
    db.init_schema(conn)
    app.config["TEACHER_TOKEN"] = token or db.get_or_create_teacher_token(conn)
    app.config["DB_PATH"] = db_path
    app.config["CALLS"] = {}
    conn.close()

    def get_db():
        # Una conexión por petición.
        if "db" not in g:
            g.db = db.connect(db_path)
        return g.db

    @app.teardown_appcontext
    def close_db(_exc):
        stored = g.pop("db", None)
        if stored is not None:
            stored.close()

    def now_iso() -> str:
        return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")

    def error(status: int, message: str):
        return jsonify(error=message), status

    def fail(exc: ActionError):
        return error(STATUS.get(exc.message, 400), exc.message)

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            if exc.description == NOT_FOUND:
                return error(404, NOT_FOUND)
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        # Todo lo que cuelga de /api/sessions es solo para el profesor.
        if request.path == "/api/sessions" or request.path.startswith("/api/sessions/"):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return error(401, UNAUTHORIZED)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/api/s/<session_id>")
    def public_session_route(session_id):
        try:
            return jsonify(public_session(get_db(), session_id))
        except ActionError as exc:
            return fail(exc)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        try:
            screen_caller(
                get_db(),
                app.config["CALLS"],
                request.remote_addr or "",
                now(),
                now_iso(),
            )
            result = register(
                get_db(), session_id, body.get("name"), body.get("code", ""), now(), now_iso()
            )
        except ActionError as exc:
            return fail(exc)
        payload = {"name": result["name"], "checkedAt": result["checked_at"]}
        if not result["created"]:
            payload["already"] = True
            return jsonify(payload)
        return jsonify(payload), 201

    @app.get("/api/sessions")
    def list_sessions_route():
        return jsonify([
            {
                "id": item["id"],
                "title": item["title"],
                "openedAt": item["opened_at"],
                "closedAt": item["closed_at"],
                "total": item["total"],
            }
            for item in list_sessions(get_db())
        ])

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        session = open_session(get_db(), body.get("title"), now(), now_iso())
        return jsonify(id=session["id"], title=session["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view_route(session_id):
        try:
            data = teacher_view(get_db(), session_id, now())
        except ActionError as exc:
            return fail(exc)
        payload = {
            "id": data["id"],
            "title": data["title"],
            "open": data["open"],
            "openedAt": data["opened_at"],
            "closedAt": data["closed_at"],
            "studentUrl": f"{request.host_url}alumno.html?s={session_id}",
            "total": data["total"],
            "checkins": [
                {"id": item["id"], "name": item["name"], "checkedAt": item["checked_at"]}
                for item in data["checkins"]
            ],
        }
        if data["open"]:
            payload["code"] = data["code"]
            payload["secondsLeft"] = data["seconds_left"]
        return jsonify(payload)

    @app.post("/api/sessions/<session_id>/close")
    def close_session_route(session_id):
        try:
            close_session(get_db(), session_id, now_iso())
        except ActionError as exc:
            return fail(exc)
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin_route(session_id, checkin_id):
        try:
            remove_checkin(get_db(), session_id, checkin_id)
        except ActionError as exc:
            return fail(exc)
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export_route(session_id):
        try:
            exported = export_csv(get_db(), session_id)
        except ActionError as exc:
            return fail(exc)
        day = exported["opened_at"][:10]
        return Response(
            exported["csv"],
            mimetype="text/csv",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="asistencia-{day}-{exported["session_id"]}.csv"'
                )
            },
        )

    return app


def port_in_use(port: int) -> bool:
    """Comprueba si ya hay algo escuchando en este ordenador.

    :param port: puerto a probar.
    :return: True si 127.0.0.1 ya acepta conexiones en ese puerto.
    """
    with socket.socket() as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0


def main():
    """Arranca la aplicación y, si se pide, el túnel público.

    :return: None.
    """
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
        # Solo en 127.0.0.1: desde fuera se entra únicamente por el túnel.
        app.run(host="127.0.0.1", port=port)
    finally:
        if tunnel:
            tunnel.terminate()


if __name__ == "__main__":
    main()
