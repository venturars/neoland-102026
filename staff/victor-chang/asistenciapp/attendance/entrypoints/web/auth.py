"""La credencial del profesor, comprobada en un único sitio (spec 001 CA-15, CA-17; ARCHITECTURE.md · X2, X3).

Protege las clases (`/api/sessions`) y, desde la spec 007 (plan §4), la clase online y la app.
"""

import hmac

from flask import Flask, request

from attendance.entrypoints.web import context
from attendance.entrypoints.web.errors import TeacherUnauthorizedError

TOKEN_HEADER = "X-Teacher-Token"  # noqa: S105 — es el nombre de la cabecera, no un secreto
PRIVATE_PREFIXES = ("/api/sessions", "/api/online", "/api/app")


def init_app(app: Flask) -> None:
    """Exige el token del profesor en todo lo que cuelga de `PRIVATE_PREFIXES`."""
    app.before_request(require_teacher)


def require_teacher() -> None:
    """Lanza TeacherUnauthorizedError si la petición privada no trae el token correcto.

    Raises:
        TeacherUnauthorizedError: falta el token o no coincide.
    """
    if not _is_private(request.path):
        return
    given = request.headers.get(TOKEN_HEADER, "").encode()
    if not hmac.compare_digest(given, context.current().teacher_token.encode()):
        raise TeacherUnauthorizedError


def _is_private(path: str) -> bool:
    # La ruta exacta o lo que cuelga de ella: "/api/app" no protege "/api/apps".
    return any(path == prefix or path.startswith(prefix + "/") for prefix in PRIVATE_PREFIXES)
