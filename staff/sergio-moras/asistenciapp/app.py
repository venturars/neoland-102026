"""AsistenciApp: entrada HTTP.

Recibe cada petición, llama a un caso de uso y convierte el resultado o el
error en la respuesta. No abre la base de datos ni decide reglas
(ver docs/ARCHITECTURE.md).

Uso: `python app.py` y abrir la URL del panel que se imprime en consola.
"""

import argparse
import hmac
import os
import socket
import sys
import time
from pathlib import Path
from typing import Callable

from flask import Flask, Response, jsonify, request
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from asistencia.domain.names import InvalidName
from asistencia.domain.rules import InvalidCode, SessionClosed, SessionNotFound
from asistencia.infra.tunnel import TunnelError, start_tunnel
from asistencia.use_cases import student, teacher

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
MISSING_CHECKIN = "Ese registro no existe en esta clase."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}

# Cada error de las reglas, con el estado HTTP que recibe la pantalla.
ERROR_STATUS = {
    SessionNotFound: 404,
    SessionClosed: 409,
    InvalidCode: 422,
    InvalidName: 400,
}


def create_app(
    db_path: str | Path = DEFAULT_DB, token: str | None = None, now: Callable[[], float] = time.time
) -> Flask:
    """Construye la aplicación web.

    :param db_path: ruta del archivo SQLite.
    :param token: token del profesor; si no se da, se usa el guardado (o se crea).
    :param now: reloj que devuelve el instante en segundos Unix.
    :return: la aplicación Flask lista para servir.
    :rtype: Flask

    Usage::

      >>> app = create_app()
      >>> app.run(port=8000)
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    # Detrás del túnel, usar la dirección pública que nos indica.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    stored_token = teacher.prepare(db_path)
    app.config["TEACHER_TOKEN"] = token or stored_token

    def error(status: int, message: str):
        return jsonify(error=message), status

    for exc_type, status in ERROR_STATUS.items():
        app.register_error_handler(exc_type, lambda exc, status=status: error(status, str(exc)))

    @app.errorhandler(HTTPException)
    def http_error(exc):
        if request.path.startswith("/api/"):
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher():
        # Todo lo que cuelga de /api/sessions es solo para el profesor.
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
        return jsonify(student.public_info(db_path, session_id))

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id):
        body = request.get_json(silent=True) or {}
        row, created = student.check_in(
            db_path, session_id, body.get("name"), body.get("code", ""), now()
        )
        if not created:
            return jsonify(already=True, name=row["name"], checkedAt=row["checked_at"])
        return jsonify(name=row["name"], checkedAt=row["checked_at"]), 201

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
            for s in teacher.list_sessions(db_path)
        ])

    @app.post("/api/sessions")
    def create_session():
        body = request.get_json(silent=True) or {}
        session = teacher.open_session(db_path, body.get("title"), now())
        return jsonify(id=session["id"], title=session["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id):
        detail = teacher.session_detail(db_path, session_id, now())
        data = {
            "id": detail["id"],
            "title": detail["title"],
            "open": detail["open"],
            "openedAt": detail["opened_at"],
            "closedAt": detail["closed_at"],
            "studentUrl": f"{request.host_url}alumno.html?s={session_id}",
            "total": len(detail["checkins"]),
            "checkins": [
                {"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]}
                for c in detail["checkins"]
            ],
        }
        if detail["open"]:
            data["code"] = detail["code"]
            data["secondsLeft"] = detail["seconds_left"]
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id):
        teacher.close_session(db_path, session_id, now())
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id, checkin_id):
        if not teacher.remove_checkin(db_path, session_id, checkin_id):
            return error(404, MISSING_CHECKIN)
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id):
        text, filename = teacher.export_csv(db_path, session_id)
        return Response(
            text,
            mimetype="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    return app


def port_in_use(port: int) -> bool:
    """Dice si ya hay algo escuchando en ese puerto local (por ejemplo, otra AsistenciApp).

    :param port: puerto de 127.0.0.1.
    :return: ``True`` si está ocupado.
    :rtype: bool

    Usage::

      >>> port_in_use(8000)
      False
    """
    with socket.socket() as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0


def main() -> None:
    """Arranca la app en local o, con ``--tunel``, también con enlace público."""
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
