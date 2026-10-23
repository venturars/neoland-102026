"""De excepción a respuesta HTTP, en una sola tabla (spec 005 · plan §2.7 · CA-05; ARCHITECTURE.md · E4, F3).

Toda respuesta de error de la API es JSON con la forma {"error": "<mensaje>"}, también ante un
fallo inesperado. Las páginas que no son de la API conservan los errores HTML de Flask.
"""

import logging

from flask import Flask, jsonify, request
from flask.typing import ResponseReturnValue
from werkzeug.exceptions import HTTPException, InternalServerError

from attendance.domain.errors import (
    AppError,
    CheckinNotFoundError,
    EmptyNameError,
    InvalidCodeError,
    NameTooLongError,
    SessionClosedError,
    SessionNotFoundError,
)

logger = logging.getLogger(__name__)

NOT_FOUND = "Esta dirección no existe. Revisa el enlace."
METHOD_NOT_ALLOWED = "Esta acción no está permitida aquí. Recarga la página e inténtalo de nuevo."
HTTP_MESSAGES = {404: NOT_FOUND, 405: METHOD_NOT_ALLOWED}


class MalformedRequestError(AppError):
    """Lo que llega no tiene la forma o el tipo esperados (ARCHITECTURE.md · E1)."""

    MESSAGE = "No se ha entendido lo que se ha enviado. Recarga la página e inténtalo de nuevo."


class TeacherUnauthorizedError(AppError):
    """Falta el token del profesor o no es el bueno (spec 001 · CA-15, CA-17)."""

    MESSAGE = "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor."


STATUS: dict[type[AppError], int] = {
    EmptyNameError: 400,
    NameTooLongError: 400,
    MalformedRequestError: 400,
    TeacherUnauthorizedError: 401,
    SessionNotFoundError: 404,
    CheckinNotFoundError: 404,
    SessionClosedError: 409,
    InvalidCodeError: 422,
}


def init_app(app: Flask) -> None:
    """Registra los manejadores de errores de la app."""
    app.register_error_handler(AppError, handle_app_error)
    app.register_error_handler(HTTPException, handle_http_error)
    app.register_error_handler(Exception, handle_unexpected_error)


def handle_app_error(exc: AppError) -> ResponseReturnValue:
    """Un error de usuario: su código de la tabla y su mensaje."""
    status = STATUS.get(type(exc))
    if status is None:  # un error sin código en la tabla es un fallo nuestro
        return handle_unexpected_error(exc)
    return jsonify(error=exc.MESSAGE), status


def handle_http_error(exc: HTTPException) -> ResponseReturnValue:
    """Ruta inexistente, método no permitido…: JSON en la API, la página de Flask fuera de ella."""
    if not request.path.startswith("/api/"):
        return exc
    return jsonify(error=HTTP_MESSAGES.get(exc.code or 500, AppError.MESSAGE)), exc.code or 500


def handle_unexpected_error(exc: Exception) -> ResponseReturnValue:
    """Cualquier otro fallo: se registra con su traza y se responde con un mensaje genérico (E6)."""
    # Sin el cuerpo de la petición ni nada personal en el registro (E7).
    logger.exception("Error inesperado en %s %s", request.method, request.path, exc_info=exc)
    if not request.path.startswith("/api/"):
        return InternalServerError()
    return jsonify(error=AppError.MESSAGE), 500
