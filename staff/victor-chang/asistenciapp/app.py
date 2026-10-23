"""AsistenciApp: servidor Flask (plan §1, §4).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
"""

import argparse
import hmac
import os
import sys
import time
from collections.abc import Callable
from contextlib import closing
from pathlib import Path

from flask import Flask, Response, g, jsonify, request
from werkzeug.exceptions import HTTPException, InternalServerError
from werkzeug.middleware.proxy_fix import ProxyFix

from attendance.domain.errors import (
    CheckinNotFoundError,
    EmptyNameError,
    InvalidCodeError,
    NameTooLongError,
    SessionClosedError,
    SessionNotFoundError,
)
from attendance.domain.sessions import Checkin, Session, SessionSummary
from attendance.infra import storage
from attendance.infra.ports import port_in_use
from attendance.infra.tunnel import TunnelError, start_tunnel
from attendance.usecases import checkins, sessions

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


# ---------- de filas de la BD (snake_case) a JSON de la API (camelCase) ----------

def checkin_json(checkin: Checkin, with_id: bool = True) -> dict:
    # El alumno no necesita el id de su registro; solo el panel del profesor (spec 001 · CA-24).
    data: dict[str, str | int] = {"name": checkin.name, "checkedAt": checkin.checked_at}
    if with_id:
        data["id"] = checkin.id
    return data


def session_json(session: Session | SessionSummary) -> dict:
    return {
        "id": session.id,
        "title": session.title,
        "openedAt": session.opened_at,
        "closedAt": session.closed_at,
    }


def create_app(
    db_path: str | Path = DEFAULT_DB,
    token: str | None = None,
    now: Callable[[], float] = time.time,
) -> Flask:
    """Crea la aplicación Flask con su base de datos ya preparada.

    Args:
        db_path: archivo SQLite; los tests usan uno temporal.
        token: token del profesor. Si es None se lee de la BD (o se crea);
            los tests pasan uno fijo.
        now: reloj en segundos Unix; los tests pasan un reloj falso.
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica (plan §2.10, CA-19).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # closing() y no solo `with conn`: el `with` de sqlite3 confirma, pero no cierra (D4).
    with closing(storage.connect(db_path)) as conn:
        storage.init_schema(conn)
        with conn:
            app.config["TEACHER_TOKEN"] = token or storage.get_or_create_teacher_token(conn)

    # ---------- utilidades ----------

    def get_db():
        # Una conexión por petición (plan §2.9).
        if "db" not in g:
            g.db = storage.connect(db_path)
        return g.db

    @app.teardown_appcontext
    def close_db(_exc):
        conn = g.pop("db", None)
        if conn is not None:
            conn.close()

    def error(status: int, message: str):
        return jsonify(error=message), status

    def json_body() -> dict:
        # Solo nos sirve un objeto JSON; cualquier otra cosa ([1], "x", 5...) cuenta como vacío.
        body = request.get_json(silent=True)
        return body if isinstance(body, dict) else {}

    @app.errorhandler(SessionNotFoundError)
    def session_not_found(exc):
        return error(404, exc.MESSAGE)

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.errorhandler(Exception)
    def unexpected_error(_exc):
        # Para que el frontend reciba siempre JSON, también ante un fallo imprevisto.
        app.logger.exception("Error inesperado")
        if request.path.startswith("/api/"):
            return error(500, "Error inesperado. Inténtalo de nuevo.")
        return InternalServerError()

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
        session = sessions.find_session(get_db(), session_id)
        return jsonify(title=session.title, open=session.is_open)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = json_body()
        try:
            result = checkins.check_in(get_db(), session_id, body.get("name"), body.get("code"), now())
        # Temporal hasta spec 005 · T11, cuando la tabla de errores sustituya estos except.
        except SessionClosedError as exc:
            return error(409, exc.MESSAGE)  # CA-09
        except InvalidCodeError as exc:
            return error(422, exc.MESSAGE)  # CA-06
        except (EmptyNameError, NameTooLongError) as exc:
            return error(400, exc.MESSAGE)  # CA-08
        if not result.created:
            return jsonify(already=True, **checkin_json(result.checkin, with_id=False))  # CA-07
        return jsonify(checkin_json(result.checkin, with_id=False)), 201  # CA-04

    # ---------- API del profesor ----------

    @app.get("/api/sessions")
    def list_sessions():
        return jsonify([
            {**session_json(s), "total": s.total} for s in storage.list_sessions(get_db())
        ])  # CA-16

    @app.post("/api/sessions")
    def create_session():
        title = json_body().get("title")
        # Temporal hasta spec 005 · T14: un título que no es texto se sigue tratando como vacío.
        title = title if isinstance(title, str) else ""
        # Zona del sistema hasta que create_app reciba la Config (spec 005 · T11).
        session = sessions.create_session(get_db(), title, now(), None)  # CA-01, CA-02
        return jsonify(id=session.id, title=session.title), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        view = sessions.teacher_view(get_db(), session_id, now())
        data = {
            **session_json(view.session),
            "open": view.session.is_open,
            "studentUrl": f"{request.host_url}alumno.html?s={session_id}",
            "total": len(view.checkins),  # CA-11
            "checkins": [checkin_json(c) for c in view.checkins],
        }
        if view.code is not None:  # sin código si está cerrada (CA-13)
            data["code"] = view.code
            data["secondsLeft"] = view.seconds_left
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        sessions.close_session(get_db(), session_id, now())  # CA-13
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        try:
            checkins.remove_checkin(get_db(), session_id, checkin_id)  # CA-24
        # Temporal hasta spec 005 · T11, cuando la tabla de errores sustituya este except.
        except CheckinNotFoundError as exc:
            return error(404, exc.MESSAGE)
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        # Zona del sistema hasta que create_app reciba la Config (spec 005 · T11).
        export_file = sessions.export_attendance(get_db(), session_id, None)  # CA-14
        return Response(
            export_file.content,
            mimetype="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{export_file.filename}"'},
        )

    return app


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
