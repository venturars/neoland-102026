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

from asistencia.domain.passes import PassExpired
from asistencia.domain.rate_limit import IpBanned
from asistencia.domain.roster import (
    DuplicateName,
    EmptyGroup,
    GroupArchived,
    GroupFull,
    GroupGone,
    GroupHasOpenSession,
    GroupNotFound,
    NameTaken,
    NoGroup,
    NotInRoster,
    SimilarName,
    StudentNotFound,
)
from asistencia.domain.session import (
    CheckinNotFound,
    InvalidCode,
    SessionClosed,
    SessionNotFound,
)
from asistencia.export import to_csv, to_group_csv
from asistencia.tunnel import TunnelError, start_tunnel
from asistencia.usecases import attendance, groups

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
    GroupNotFound: 404,
    StudentNotFound: 404,
    DuplicateName: 409,
    GroupFull: 409,
    GroupHasOpenSession: 409,
    GroupArchived: 409,
    EmptyGroup: 409,
    NameTaken: 409,
    NoGroup: 409,
    NotInRoster: 422,
    PassExpired: 401,
    GroupGone: 410,
}

# Rutas solo para el profesor: necesitan su token (CA-15, CA-17; spec 007).
TEACHER_PREFIXES = ("/api/sessions", "/api/groups")


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

    @app.errorhandler(SimilarName)
    def similar_name(exc):
        # «¿Quisiste decir…?»: el alumno elige el nombre sugerido o sigue como nuevo (spec 007, CA-05).
        return jsonify(error=str(exc), suggestion=exc.suggestion), 409

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        # Todo lo que cuelga de /api/sessions y /api/groups es solo para el profesor (CA-15, CA-17).
        if any(request.path == p or request.path.startswith(p + "/") for p in TEACHER_PREFIXES):
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

    @app.post("/api/s/<session_id>/unlock")
    def unlock(session_id):
        body = request.get_json(silent=True) or {}
        return jsonify(
            attendance.unlock(db_path, session_id, body.get("code", ""), request.remote_addr, now)
        )  # spec 007, RF-11

    @app.post("/api/s/<session_id>/roster")
    def roster(session_id):
        body = request.get_json(silent=True) or {}
        return jsonify(
            attendance.roster_for_pass(db_path, session_id, body.get("pass"), request.remote_addr, now)
        )

    @app.get("/api/s/<session_id>/checkins/<int:checkin_id>")
    def registration(session_id, checkin_id):
        return jsonify(
            attendance.registration_exists(db_path, session_id, checkin_id, request.args.get("r"))
        )  # spec 007, CA-14

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        if "pass" in body:  # sesión con grupo (spec 007)
            try:
                result = attendance.check_in_group(
                    db_path, session_id, body.get("pass"), body.get("name"),
                    bool(body.get("isNew")), bool(body.get("confirmSimilar")), request.remote_addr, now,
                )
            except ValueError as exc:
                return error(400, str(exc))
            return jsonify(result), 201
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
        session = attendance.create_session(db_path, body.get("title"), now, body.get("groupId"))
        return jsonify(session), 201  # CA-01; spec 007, RF-8

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
        if session["group_name"] is None:
            content = to_csv(checkins)  # CA-14
        else:
            roster = attendance.roster_for_export(db_path, session_id)
            content = to_group_csv(session["group_name"], session["opened_at"], roster, checkins)  # spec 007, RF-21
        return Response(
            content,
            mimetype="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
            },
        )

    @app.post("/api/sessions/<session_id>/checkins/<int:checkin_id>/decision")
    def decide_new(session_id, checkin_id):
        body = request.get_json(silent=True) or {}
        try:
            return jsonify(attendance.decide_new(db_path, session_id, checkin_id, body.get("action")))
        except ValueError as exc:
            return error(400, str(exc))  # spec 007, RF-20

    # ---------- API del profesor: grupos (spec 007) ----------

    @app.get("/api/groups")
    def list_groups():
        return jsonify(groups.list_groups(db_path, request.args.get("archived") == "1"))  # RF-4, RF-5

    @app.post("/api/groups")
    def create_group():
        body = request.get_json(silent=True) or {}
        try:
            group = groups.create_group(db_path, body.get("name"), body.get("students") or [], now)
        except ValueError as exc:
            return error(400, str(exc))
        return jsonify(group), 201  # CA-01

    @app.post("/api/groups/preview")
    def preview_group():
        body = request.get_json(silent=True) or {}
        return jsonify(
            groups.preview_roster(db_path, body.get("text") or "", body.get("source"), body.get("groupId"))
        )  # CA-01, CA-02

    @app.get("/api/groups/<group_id>")
    def group_detail(group_id):
        return jsonify(groups.group_detail(db_path, group_id))

    @app.patch("/api/groups/<group_id>")
    def update_group(group_id):
        body = request.get_json(silent=True) or {}
        try:
            if "name" in body:
                groups.rename_group(db_path, group_id, body["name"])  # RF-3
            if "archived" in body:
                groups.set_archived(db_path, group_id, bool(body["archived"]), now)  # RF-5
        except ValueError as exc:
            return error(400, str(exc))
        return jsonify(groups.group_detail(db_path, group_id))

    @app.delete("/api/groups/<group_id>")
    def delete_group(group_id):
        groups.delete_group(db_path, group_id)  # RF-6
        return jsonify(ok=True)

    @app.post("/api/groups/<group_id>/students")
    def add_students(group_id):
        body = request.get_json(silent=True) or {}
        try:
            return jsonify(groups.add_students(db_path, group_id, body.get("names") or [])), 201
        except ValueError as exc:
            return error(400, str(exc))

    @app.patch("/api/groups/<group_id>/students/<int:student_id>")
    def rename_student(group_id, student_id):
        body = request.get_json(silent=True) or {}
        try:
            return jsonify(groups.rename_student(db_path, group_id, student_id, body.get("name")))
        except ValueError as exc:
            return error(400, str(exc))

    @app.delete("/api/groups/<group_id>/students/<int:student_id>")
    def remove_student(group_id, student_id):
        groups.remove_student(db_path, group_id, student_id)
        return jsonify(ok=True)

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
