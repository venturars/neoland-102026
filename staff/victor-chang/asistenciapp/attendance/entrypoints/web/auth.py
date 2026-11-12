"""La credencial del profesor, comprobada en un único sitio (spec 001 CA-15, CA-17; ARCHITECTURE.md · X2, X3)."""

import hmac

from flask import Flask, request

from attendance.entrypoints.web import context
from attendance.entrypoints.web.errors import TeacherUnauthorizedError

TOKEN_HEADER = "X-Teacher-Token"  # noqa: S105 — es el nombre de la cabecera, no un secreto
PRIVATE_PREFIX = "/api/sessions"


def init_app(app: Flask) -> None:
    """Exige el token del profesor en todo lo que cuelga de /api/sessions."""
    app.before_request(require_teacher)


def require_teacher() -> None:
    """Lanza TeacherUnauthorizedError si la petición privada no trae el token correcto.

    Raises:
        TeacherUnauthorizedError: falta el token o no coincide.
    """
    if request.path != PRIVATE_PREFIX and not request.path.startswith(PRIVATE_PREFIX + "/"):
        return
    given = request.headers.get(TOKEN_HEADER, "").encode()
    if not hmac.compare_digest(given, context.current().teacher_token.encode()):
        raise TeacherUnauthorizedError
