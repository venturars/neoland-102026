"""Rutas de la app y de la clase online; todas exigen el token del profesor (spec 007 · plan §4).

Excepción a C2 justificada en el plan 007 §7.2: abrir o cerrar el túnel no aplica ninguna regla del
negocio, así que las rutas llaman a `Tunnel` (infraestructura) sin caso de uso intermedio. Los errores
los convierte `errors.py` (E4).
"""

from flask import Blueprint, jsonify
from flask.typing import ResponseReturnValue

from attendance import __version__
from attendance.entrypoints.web import context
from attendance.entrypoints.web.errors import OnlineNotAvailableError
from attendance.entrypoints.web.serializers import app_info_json, online_json

blueprint = Blueprint("online", __name__, url_prefix="/api")


@blueprint.get("/app")
def app_info() -> ResponseReturnValue:
    """Versión, si es la app de escritorio y estado de la clase online (CA-04, CA-09)."""
    pieces = context.current()
    url = pieces.tunnel.url if pieces.tunnel else None
    return jsonify(app_info_json(__version__, pieces.desktop, url))


@blueprint.post("/online")
def open_online() -> ResponseReturnValue:
    """Abre la clase online, o devuelve la que ya estaba abierta (CA-07, CA-08)."""
    tunnel = context.current().tunnel
    if tunnel is None:
        raise OnlineNotAvailableError
    return jsonify(online_json(tunnel.open()))


@blueprint.delete("/online")
def close_online() -> ResponseReturnValue:
    """Cierra la clase online; si no estaba abierta, no hace nada (CA-09, CA-12)."""
    tunnel = context.current().tunnel
    if tunnel is not None:
        tunnel.close()
    return jsonify(online_json(None))
