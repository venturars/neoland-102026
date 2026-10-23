"""Factory Flask: rutas delgadas sobre casos de uso."""

import hmac
import time
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, Response, abort, g, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.domain.errors import (
    CheckinNotFound,
    InvalidCode,
    InvalidName,
    SessionClosed,
    SessionNotFound,
)
from asistencia.domain.export import to_csv
from asistencia.infra.sqlite import SqliteAttendanceRepository, connect, init_schema
from asistencia.use_cases import attendance as uc

APP_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = APP_ROOT / "data" / "asistencia.db"

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    app = Flask(
        __name__,
        static_folder=str(APP_ROOT / "static"),
        static_url_path="",
    )
    app.json.ensure_ascii = False
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    conn = connect(db_path)
    init_schema(conn)
    repo = SqliteAttendanceRepository(conn)
    app.config["TEACHER_TOKEN"] = token or repo.get_or_create_teacher_token()
    conn.close()

    def get_repo() -> SqliteAttendanceRepository:
        if "repo" not in g:
            g.repo = SqliteAttendanceRepository(g.db)
        return g.repo

    @app.before_request
    def open_db():
        if "db" not in g:
            g.db = connect(db_path)

    @app.teardown_appcontext
    def close_db(_exc):
        conn = g.pop("db", None)
        if conn is not None:
            conn.close()
        g.pop("repo", None)

    def now_iso() -> str:
        return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")

    def error(status: int, message: str):
        return jsonify(error=message), status

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            if exc.description == NOT_FOUND:
                return error(404, NOT_FOUND)
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        if request.path == "/api/sessions" or request.path.startswith("/api/sessions/"):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return error(401, UNAUTHORIZED)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/api/s/<session_id>")
    def public_session(session_id):
        try:
            data = uc.get_public_session(get_repo(), session_id)
        except SessionNotFound:
            abort(404, NOT_FOUND)
        return jsonify(data)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        try:
            result = uc.check_in(
                get_repo(),
                session_id,
                body.get("name"),
                body.get("code", ""),
                now,
                now_iso,
            )
        except SessionNotFound:
            abort(404, NOT_FOUND)
        except SessionClosed:
            return error(409, CLOSED)
        except InvalidName as exc:
            return error(400, exc.message)
        except InvalidCode:
            return error(422, INVALID_CODE)
        if not result["created"]:
            return jsonify(
                already=True, name=result["name"], checkedAt=result["checkedAt"]
            )
        return jsonify(name=result["name"], checkedAt=result["checkedAt"]), 201

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify(uc.list_sessions(get_repo()))

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        title = str(body.get("title") or "")
        data = uc.create_session(get_repo(), title, now, now_iso)
        return jsonify(data), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        try:
            data = uc.teacher_session_view(get_repo(), session_id, now)
        except SessionNotFound:
            abort(404, NOT_FOUND)
        data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        try:
            uc.close_session(get_repo(), session_id, now_iso)
        except SessionNotFound:
            abort(404, NOT_FOUND)
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        try:
            uc.remove_checkin(get_repo(), session_id, checkin_id)
        except SessionNotFound:
            abort(404, NOT_FOUND)
        except CheckinNotFound:
            return error(404, "Ese registro no existe en esta clase.")
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        try:
            session, rows = uc.export_checkins(get_repo(), session_id)
        except SessionNotFound:
            abort(404, NOT_FOUND)
        day = session["opened_at"][:10]
        return Response(
            to_csv(rows),
            mimetype="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
            },
        )

    return app
