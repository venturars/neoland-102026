"""AsistenciApp: entrada HTTP (plan §1, §4).

Recibe la petición, llama a una acción y devuelve la respuesta.
No abre el archivo donde se guarda la asistencia: usa ``usecases`` y ``storage``.
"""

import hmac
import time
from pathlib import Path

from flask import Flask, Response, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.domain.attempts import Banned
from asistencia.domain.session import InvalidCode, SessionClosed, SessionNotFound
from asistencia.usecases.attendance import (
    check_in,
    close_session,
    create_session,
    export_csv,
    list_blocked,
    list_sessions,
    prepare,
    public_session,
    remove_checkin,
    teacher_view,
    unblock_all,
    unblock_one,
)
from asistencia.web.client_ip import client_ip

APP_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = APP_ROOT / "data" / "asistencia.db"

NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
MISSING_CHECKIN = "Ese registro no existe en esta clase."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path=DEFAULT_DB, token=None, now=time.time):
    """Construye la aplicación web.

    :param db_path: ruta del archivo de asistencia.
    :param token: token del profesor. Si no viene, se pide al preparar la app.
    :param now: función que devuelve el instante Unix actual.
    :return: aplicación lista para servir.
    :rtype: Flask

    Usage::

      app = create_app()
    """
    app = Flask(
        __name__,
        static_folder=str(APP_ROOT / "static"),
        static_url_path="",
    )
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica (plan §2.10, CA-19).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    app.config["DB_PATH"] = db_path
    app.config["NOW"] = now
    teacher_token = prepare(db_path)
    app.config["TEACHER_TOKEN"] = token if token is not None else teacher_token

    def error(status: int, message: str):
        return jsonify(error=message), status

    def run(action):
        try:
            return action()
        except SessionNotFound as exc:
            return error(404, str(exc))
        except SessionClosed as exc:
            return error(409, str(exc))
        except InvalidCode as exc:
            return error(422, str(exc))
        except Banned as exc:
            return error(429, str(exc))
        except ValueError as exc:
            return error(400, str(exc))

    def _teacher_api(path: str) -> bool:
        return (
            path == "/api/sessions"
            or path.startswith("/api/sessions/")
            or path == "/api/blocked-ips"
            or path.startswith("/api/blocked-ips/")
        )

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
        if _teacher_api(request.path):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return error(401, UNAUTHORIZED)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    # ---------- API pública (alumno) ----------

    @app.get("/api/s/<session_id>")
    def public_session_route(session_id):
        def action():
            info = public_session(db_path, session_id)
            return jsonify(title=info["title"], open=info["open"])

        return run(action)

    @app.post("/api/s/<session_id>/checkin")
    def check_in_route(session_id):
        body = request.get_json(silent=True) or {}

        def action():
            row, created = check_in(
                db_path,
                session_id,
                body.get("name"),
                body.get("code", ""),
                now,
                client_ip(request),
            )
            payload = {"name": row["name"], "checkedAt": row["checked_at"]}
            if not created:
                return jsonify(already=True, **payload)
            return jsonify(payload), 201

        return run(action)

    @app.get("/api/blocked-ips")
    def list_blocked_ips_route():
        return jsonify(list_blocked(db_path))

    @app.delete("/api/blocked-ips")
    def unblock_all_ips_route():
        removed = unblock_all(db_path)
        return jsonify(ok=True, removed=removed)

    @app.delete("/api/blocked-ips/<path:ip>")
    def unblock_ip_route(ip):
        if not unblock_one(db_path, ip):
            return error(404, "Esa dirección no está bloqueada.")
        return jsonify(ok=True)

    # ---------- API del profesor ----------

    @app.get("/api/sessions")
    def list_sessions_route():
        return jsonify([
            {
                "id": row["id"],
                "title": row["title"],
                "openedAt": row["opened_at"],
                "closedAt": row["closed_at"],
                "total": row["total"],
            }
            for row in list_sessions(db_path)
        ])  # CA-16

    @app.post("/api/sessions")
    def create_session_route():
        body = request.get_json(silent=True) or {}
        loaded = create_session(db_path, body.get("title"), now)
        return jsonify(id=loaded["id"], title=loaded["title"]), 201  # CA-01

    @app.get("/api/sessions/<session_id>")
    def teacher_view_route(session_id):
        def action():
            detail = teacher_view(db_path, session_id, now)
            data = {
                "id": detail["id"],
                "title": detail["title"],
                "open": detail["open"],
                "openedAt": detail["opened_at"],
                "closedAt": detail["closed_at"],
                "studentUrl": f"{request.host_url}alumno.html?s={session_id}",
                "total": detail["total"],
                "checkins": [
                    {"id": row["id"], "name": row["name"], "checkedAt": row["checked_at"]}
                    for row in detail["checkins"]
                ],
            }
            if detail["open"]:
                data["code"] = detail["code"]
                data["secondsLeft"] = detail["seconds_left"]
            return jsonify(data)

        return run(action)

    @app.post("/api/sessions/<session_id>/close")
    def close_session_route(session_id):
        def action():
            close_session(db_path, session_id, now)
            return jsonify(ok=True)

        return run(action)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin_route(session_id, checkin_id):
        def action():
            if not remove_checkin(db_path, session_id, checkin_id):
                return error(404, MISSING_CHECKIN)
            return jsonify(ok=True)

        return run(action)

    @app.get("/api/sessions/<session_id>/export")
    def export_route(session_id):
        def action():
            text, day = export_csv(db_path, session_id)
            return Response(
                text,
                mimetype="text/csv",
                headers={
                    "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
                },
            )

        return run(action)

    return app
