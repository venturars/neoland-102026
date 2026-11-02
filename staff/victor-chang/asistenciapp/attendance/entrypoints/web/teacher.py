"""Rutas del profesor; todas exigen su token (spec 001 · plan §4 "Privada"; spec 004 · plan §4).

Cada ruta lee lo que llega, llama a un caso de uso (o a una lectura sin reglas, C5) y responde
(ARCHITECTURE.md · C2). Los errores los convierte `errors.py` (E4).
"""

from flask import Blueprint, Response, jsonify, request
from flask.typing import ResponseReturnValue

from attendance.domain.errors import MeetNotConfiguredError
from attendance.domain.participants import Who
from attendance.domain.sessions import Mode
from attendance.entrypoints.web import context
from attendance.entrypoints.web.serializers import (
    created_session_json,
    session_summary_json,
    sync_result_json,
    teacher_view_json,
)
from attendance.entrypoints.web.validation import choice, json_object, optional_str
from attendance.infra import storage
from attendance.usecases import attendance, checkins, sessions

blueprint = Blueprint("teacher", __name__, url_prefix="/api/sessions")


@blueprint.get("")
def list_sessions() -> ResponseReturnValue:
    """Todas las clases con su total, de la más nueva a la más antigua (spec 001 · CA-16)."""
    summaries = storage.list_sessions(context.db())  # lectura sin reglas (C5)
    return jsonify([session_summary_json(s) for s in summaries])


@blueprint.post("")
def create_session() -> ResponseReturnValue:
    """Abre una clase de código o automática (spec 001 · CA-01, CA-02; spec 004 · CA-01, CA-14; spec 005 · CA-08).

    Sin título, se titula con la fecha; sin modo, es de código. Un modo desconocido es un 400 (E1).
    """
    body = json_object()
    title, meeting = optional_str(body, "title"), optional_str(body, "meeting")
    mode = choice(body, "mode", Mode, default=Mode.CODE)
    timezone = context.current().config.timezone
    session = sessions.create_session(context.db(), title, context.now(), timezone, mode, meeting)
    return jsonify(created_session_json(session)), 201


@blueprint.get("/<session_id>")
def teacher_view(session_id: str) -> ResponseReturnValue:
    """La clase, sus registros y, si está abierta, el código y su cuenta atrás (spec 001 · CA-10 a CA-13)."""
    view = sessions.teacher_view(context.db(), session_id, context.now())
    return jsonify(teacher_view_json(view, f"{request.host_url}alumno.html?s={session_id}"))


@blueprint.post("/<session_id>/meet-sync")
def meet_sync(session_id: str) -> ResponseReturnValue:
    """Toma la asistencia de una clase automática desde su reunión (spec 004 · CA-05 a CA-07, CA-18, CA-20).

    `who` es obligatorio: "now" (quién está ahora) o "everyone" (todos los que han estado).
    """
    who = choice(json_object(), "who", Who)
    fetch_participants = context.current().fetch_participants
    if fetch_participants is None:
        raise MeetNotConfiguredError
    result = attendance.sync_from_meeting(context.db(), fetch_participants, session_id, who, context.now())
    return jsonify(sync_result_json(result))


@blueprint.post("/<session_id>/close")
def close_session(session_id: str) -> ResponseReturnValue:
    """Cierra la clase (spec 001 · CA-13)."""
    sessions.close_session(context.db(), session_id, context.now())
    return jsonify(ok=True)


@blueprint.delete("/<session_id>/checkins/<int:checkin_id>")
def remove_checkin(session_id: str, checkin_id: int) -> ResponseReturnValue:
    """Quita un registro de la clase (spec 001 · CA-24)."""
    checkins.remove_checkin(context.db(), session_id, checkin_id)
    return jsonify(ok=True)


@blueprint.get("/<session_id>/export")
def export(session_id: str) -> ResponseReturnValue:
    """Descarga la lista en CSV (spec 001 · CA-14)."""
    export_file = sessions.export_attendance(context.db(), session_id, context.current().config.timezone)
    return Response(
        export_file.content,
        mimetype="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{export_file.filename}"'},
    )
