"""Rutas del alumno (spec 001 · plan §4 "Pública"; CA-04 a CA-09).

Cada ruta lee lo que llega, llama a un caso de uso y responde (ARCHITECTURE.md · C2). Los errores
los convierte `errors.py` (E4).
"""

from flask import Blueprint, jsonify
from flask.typing import ResponseReturnValue

from attendance.entrypoints.web import context
from attendance.entrypoints.web.serializers import check_in_result_json, public_session_json
from attendance.entrypoints.web.validation import json_object, optional_str
from attendance.usecases import checkins, sessions

blueprint = Blueprint("public", __name__, url_prefix="/api/s")


@blueprint.get("/<session_id>")
def public_session(session_id: str) -> ResponseReturnValue:
    """Título de la clase y si está abierta, sin la lista (spec 001 · CA-04, CA-09)."""
    session = sessions.find_session(context.db(), session_id)
    return jsonify(public_session_json(session))


@blueprint.post("/<session_id>/checkin")
def check_in(session_id: str) -> ResponseReturnValue:
    """Registra al alumno: 201 si es nuevo, 200 con already=True si ya estaba (spec 001 · CA-04, CA-07).

    La forma y el tipo se comprueban aquí, antes que nada (spec 005 · CA-06; E1).
    """
    body = json_object()
    name, code = optional_str(body, "name"), optional_str(body, "code")
    result = checkins.check_in(context.db(), session_id, name, code, context.now())
    return jsonify(check_in_result_json(result)), 201 if result.created else 200
