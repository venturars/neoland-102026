"""Rutas del alumno (spec 001 · plan §4 "Pública"; CA-04 a CA-09).

Cada ruta lee lo que llega, llama a un caso de uso y responde (ARCHITECTURE.md · C2). Los errores
los convierte `errors.py` (E4).
"""

from flask import Blueprint, jsonify
from flask.typing import ResponseReturnValue

from attendance.entrypoints.web import context
from attendance.entrypoints.web.serializers import checkin_json
from attendance.entrypoints.web.validation import json_body
from attendance.usecases import checkins, sessions

blueprint = Blueprint("public", __name__, url_prefix="/api/s")


@blueprint.get("/<session_id>")
def public_session(session_id: str) -> ResponseReturnValue:
    """Título de la clase y si está abierta, sin la lista (spec 001 · CA-04, CA-09)."""
    session = sessions.find_session(context.db(), session_id)
    return jsonify(title=session.title, open=session.is_open)


@blueprint.post("/<session_id>/checkin")
def check_in(session_id: str) -> ResponseReturnValue:
    """Registra al alumno: 201 si es nuevo, 200 con already=True si ya estaba (spec 001 · CA-04, CA-07)."""
    body = json_body()
    result = checkins.check_in(context.db(), session_id, body.get("name"), body.get("code"), context.now())
    if not result.created:
        return jsonify(already=True, **checkin_json(result.checkin, with_id=False))
    return jsonify(checkin_json(result.checkin, with_id=False)), 201
