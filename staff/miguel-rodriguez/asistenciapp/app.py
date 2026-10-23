"""Entrada HTTP y arranque de AsistenciApp; las acciones coordinan la asistencia."""

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

from asistencia.usecases import attendance
from asistencia.export import to_csv
from asistencia.tunnel import TunnelError, start_tunnel

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"

NOT_FOUND = "Esta clase no existe. Revisa el enlace."
UNAUTHORIZED = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."
GENERIC_ERRORS = {404: "No encontrado.", 405: "Método no permitido."}


def create_app(db_path: str | Path = DEFAULT_DB, token: str | None = None, now: Callable[[], float] = time.time) -> Flask:
    """Construye la entrada HTTP con archivo, token y reloj configurables.

    :param db_path: archivo local de asistencia.
    :param token: token explícito opcional del profesor.
    :param now: reloj que devuelve segundos Unix.
    :return: aplicación configurada, sin iniciar un servidor.
    :rtype: Flask

    Usage::

        app = create_app(path, token="prueba", now=clock)
    """
    app = Flask(__name__, static_folder="static", static_url_path="")
    app.json.ensure_ascii = False
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    app.config["TEACHER_TOKEN"] = attendance.prepare(db_path, token)

    def error(status: int, message: str) -> tuple[Response, int]:
        """Construye un error JSON.

        :param status: estado HTTP.
        :param message: mensaje visible.
        :return: respuesta y estado.
        :rtype: tuple[Response, int]

        Usage::

            error(404, NOT_FOUND)
        """
        return jsonify(error=message), status

    @app.errorhandler(attendance.SessionNotFound)
    def missing_session(exc: attendance.SessionNotFound) -> tuple[Response, int]:
        """Traduce una clase ausente.

        :param exc: error de la acción.
        :return: error 404 existente.
        :rtype: tuple[Response, int]

        Usage::

            missing_session(exc)
        """
        return error(404, str(exc))

    @app.errorhandler(HTTPException)
    def http_error(exc: HTTPException) -> HTTPException | tuple[Response, int]:
        """Conserva el formato de los errores HTTP.

        :param exc: excepción HTTP recibida.
        :return: error JSON para API o excepción para otras rutas.
        :rtype: HTTPException | tuple[Response, int]

        Usage::

            http_error(exc)
        """
        if request.path.startswith("/api/"):
            if exc.description == NOT_FOUND:
                return error(404, NOT_FOUND)
            return error(exc.code, GENERIC_ERRORS.get(exc.code, "Error inesperado."))
        return exc

    @app.before_request
    def require_teacher() -> tuple[Response, int] | None:
        """Comprueba el token en las rutas privadas.

        :return: error 401 si falta permiso, o None.
        :rtype: tuple[Response, int] | None

        Usage::

            require_teacher()
        """
        if request.path == "/api/sessions" or request.path.startswith("/api/sessions/"):
            given = request.headers.get("X-Teacher-Token", "").encode()
            if not hmac.compare_digest(given, app.config["TEACHER_TOKEN"].encode()):
                return error(401, UNAUTHORIZED)

    @app.get("/")
    def index() -> Response:
        """Sirve la página inicial.

        :return: archivo inicial de static/.
        :rtype: Response

        Usage::

            index()
        """
        return app.send_static_file("index.html")

    @app.get("/api/s/<session_id>")
    def public_session(session_id: str) -> Response:
        """Muestra los datos públicos de una clase.

        :param session_id: identificador de la clase.
        :return: JSON público.
        :rtype: Response

        Usage::

            public_session(session_id)
        """
        return jsonify(attendance.public_session(db_path, session_id))

    @app.post("/api/s/<session_id>/checkin")
    def check_in(session_id: str) -> Response | tuple[Response, int]:
        """Traduce el intento de registro al contrato HTTP existente.

        :param session_id: identificador de la clase.
        :return: registro nuevo, duplicado o error de validación.
        :rtype: Response | tuple[Response, int]

        Usage::

            check_in(session_id)
        """
        body = request.get_json(silent=True) or {}
        try:
            row, created = attendance.check_in(db_path, session_id, body, now())
        except attendance.SessionClosed as exc:
            return error(409, str(exc))
        except attendance.InvalidCode as exc:
            return error(422, str(exc))
        except ValueError as exc:
            return error(400, str(exc))
        if not created:
            return jsonify(already=True, name=row["name"], checkedAt=row["checked_at"])
        return jsonify(name=row["name"], checkedAt=row["checked_at"]), 201

    @app.get("/api/sessions")
    def list_sessions() -> Response:
        """Presenta la lista privada de sesiones.

        :return: JSON de sesiones y totales.
        :rtype: Response

        Usage::

            list_sessions()
        """
        return jsonify(attendance.list_sessions(db_path))

    @app.post("/api/sessions")
    def create_session() -> tuple[Response, int]:
        """Solicita abrir una clase.

        :return: identificador y título con estado 201.
        :rtype: tuple[Response, int]

        Usage::

            create_session()
        """
        body = request.get_json(silent=True) or {}
        session = attendance.create_session(db_path, body.get("title"), now())
        return jsonify(id=session["id"], title=session["title"]), 201

    @app.get("/api/sessions/<session_id>")
    def teacher_view(session_id: str) -> Response:
        """Añade la dirección pública a los datos de la acción.

        :param session_id: identificador de la clase.
        :return: JSON privado de la sesión.
        :rtype: Response

        Usage::

            teacher_view(session_id)
        """
        data = attendance.teacher_view(db_path, session_id, now())
        data["studentUrl"] = f"{request.host_url}alumno.html?s={session_id}"
        return jsonify(data)

    @app.post("/api/sessions/<session_id>/close")
    def close_session(session_id: str) -> Response:
        """Solicita cerrar una clase.

        :param session_id: identificador de la clase.
        :return: confirmación JSON.
        :rtype: Response

        Usage::

            close_session(session_id)
        """
        attendance.close_session(db_path, session_id, now())
        return jsonify(ok=True)

    @app.delete("/api/sessions/<session_id>/checkins/<int:checkin_id>")
    def remove_checkin(session_id: str, checkin_id: int) -> Response | tuple[Response, int]:
        """Solicita eliminar el registro de una clase.

        :param session_id: identificador de la clase.
        :param checkin_id: identificador del registro.
        :return: confirmación o error 404 existente.
        :rtype: Response | tuple[Response, int]

        Usage::

            remove_checkin(session_id, checkin_id)
        """
        if not attendance.remove_checkin(db_path, session_id, checkin_id):
            return error(404, "Ese registro no existe en esta clase.")
        return jsonify(ok=True)

    @app.get("/api/sessions/<session_id>/export")
    def export(session_id: str) -> Response:
        """Presenta la exportación CSV existente.

        :param session_id: identificador de la clase.
        :return: descarga CSV con su nombre de archivo original.
        :rtype: Response

        Usage::

            export(session_id)
        """
        session, checkins = attendance.export_session(db_path, session_id)
        day = session["opened_at"][:10]
        return Response(
            to_csv(checkins),
            mimetype="text/csv",
            headers={"Content-Disposition": f'attachment; filename="asistencia-{day}-{session_id}.csv"'},
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
