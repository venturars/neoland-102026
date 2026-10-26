"""Entrada HTTP y arranque de AsistenciApp.

Crea la aplicación, lee las peticiones, llama a las acciones y traduce
sus resultados y sus errores. No abre la base ni repite las reglas.

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
"""

import argparse
import hmac
import os
import socket
import sys
import time
from collections.abc import Callable
from pathlib import Path

from flask import Flask, Response, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.domain.session import InvalidCode, SessionClosed, SessionNotFound
from asistencia.tunnel import TunnelError, start_tunnel
from asistencia.usecases.attendance import CheckinNotFound
from asistencia.usecases import attendance

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
MISSING_CHECKIN = "Ese registro no existe en esta clase."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def _json_error(status: int, message: str):
    """Respuesta de error que ya conocen el panel y el alumno.

    :param status: Código HTTP.
    :param message: Texto en español.
    :return: Cuerpo JSON y el código.
    :rtype: tuple
    """
    return jsonify(error=message), status


def _from_action(exc: Exception):
    """Traduce un error de las acciones a la respuesta de siempre.

    :param exc: Error lanzado por una acción.
    :return: Respuesta HTTP, o None si este módulo no lo traduce.
    :rtype: tuple | None
    """
    if isinstance(exc, SessionNotFound):
        return _json_error(404, NOT_FOUND)
    if isinstance(exc, SessionClosed):
        return _json_error(409, CLOSED)
    if isinstance(exc, InvalidCode):
        return _json_error(422, INVALID_CODE)
    if isinstance(exc, CheckinNotFound):
        return _json_error(404, MISSING_CHECKIN)
    if isinstance(exc, ValueError):
        return _json_error(400, str(exc))
    return None


def _browser_detail(detail: dict, student_url: str) -> dict:
    """Pasa el detalle interno a los nombres que ya usa el navegador.

    :param detail: Datos devueltos por la acción.
    :param student_url: Dirección pública de la clase.
    :return: Cuerpo JSON del panel.
    :rtype: dict
    """
    body = {
        "id": detail["id"],
        "title": detail["title"],
        "open": detail["open"],
        "openedAt": detail["opened_at"],
        "closedAt": detail["closed_at"],
        "studentUrl": student_url,
        "total": detail["total"],
        "checkins": [
            {"id": row["id"], "name": row["name"], "checkedAt": row["checked_at"]}
            for row in detail["checkins"]
        ],
    }
    if detail["open"]:
        body["code"] = detail["code"]
        body["secondsLeft"] = detail["seconds_left"]
    return body


def create_app(
    db_path: Path | str = DEFAULT_DB,
    token: str | None = None,
    now: Callable[[], float] = time.time,
) -> Flask:
    """Crea la aplicación con las rutas de pasar lista.

    :param db_path: Ruta del archivo, Path o str. Por defecto, data/asistencia.db junto a este módulo.
    :param token: Token del profesor. None usa el guardado.
    :param now: Reloj invocable que devuelve segundos Unix. Los tests lo sustituyen.
    :return: Aplicación Flask.
    :rtype: Flask

    Usage::

        create_app(ruta_temporal, token="token-de-prueba", now=reloj)
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    stored = attendance.prepare(db_path)
    app.config["TEACHER_TOKEN"] = token or stored

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            if exc.description == NOT_FOUND:
                return _json_error(404, NOT_FOUND)
            return _json_error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        if request.path == "/api/sessions" or request.path.startswith("/api/sessions/"):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return _json_error(401, UNAUTHORIZED)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/api/s/<session_id>")
    def public_session(session_id):
        try:
            return jsonify(attendance.public_info(db_path, session_id))
        except SessionNotFound as exc:
            return _from_action(exc)

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        try:
            record, created = attendance.check_in(
                db_path, session_id, body.get("name"), body.get("code", ""), now
            )
        except (SessionNotFound, SessionClosed, InvalidCode, ValueError) as exc:
            return _from_action(exc)
        if not created:
            return jsonify(already=True, name=record["name"], checkedAt=record["checked_at"])
        return jsonify(name=record["name"], checkedAt=record["checked_at"]), 201

    @app.get("/api/sessions")
    def list_sessions():
        rows = attendance.list_classes(db_path)
        return jsonify([
            {
                "id": row["id"],
                "title": row["title"],
                "openedAt": row["opened_at"],
                "closedAt": row["closed_at"],
                "total": row["total"],
            }
            for row in rows
        ])

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        opened = attendance.open_class(db_path, body.get("title"), now)
        return jsonify(id=opened["id"], title=opened["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        try:
            detail = attendance.teacher_detail(db_path, session_id, now)
        except SessionNotFound as exc:
            return _from_action(exc)
        return jsonify(_browser_detail(detail, f"{request.host_url}alumno.html?s={session_id}"))

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        try:
            attendance.close_class(db_path, session_id, now)
        except SessionNotFound as exc:
            return _from_action(exc)
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        try:
            attendance.remove_checkin(db_path, session_id, checkin_id)
        except (SessionNotFound, CheckinNotFound) as exc:
            return _from_action(exc)
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        try:
            text, opened_at = attendance.export_csv(db_path, session_id)
        except SessionNotFound as exc:
            return _from_action(exc)
        day = opened_at[:10]
        return Response(
            text,
            mimetype="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'
            },
        )

    return app


def port_in_use(port: int) -> bool:
    """Dice si ya hay algo escuchando en este ordenador y ese puerto.

    :param port: Puerto TCP.
    :return: True si el puerto está ocupado.
    :rtype: bool
    """
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
        app.run(host="127.0.0.1", port=port)
    finally:
        if tunnel:
            tunnel.terminate()


if __name__ == "__main__":
    main()
