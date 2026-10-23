"""De tipos del dominio a JSON de la API, una función por respuesta (spec 005 · plan §2.2; ARCHITECTURE.md · D7, F2).

Los campos van en camelCase y cada función elige los suyos uno a uno: así nunca sale el secreto
de una clase, ni nada que no se haya pedido.
"""

from typing import Any

from attendance.domain.sessions import Checkin, CheckinResult, Session, SessionSummary, TeacherView


def checkin_json(checkin: Checkin) -> dict[str, Any]:
    """Un registro en el panel del profesor, con su id para poder quitarlo (spec 001 · CA-24)."""
    return {"id": checkin.id, "name": checkin.name, "checkedAt": checkin.checked_at}


def check_in_result_json(result: CheckinResult) -> dict[str, Any]:
    """La respuesta al alumno: su nombre y hora, sin id; `already` si ya estaba (spec 001 · CA-04, CA-07)."""
    data: dict[str, Any] = {"name": result.checkin.name, "checkedAt": result.checkin.checked_at}
    if not result.created:
        data = {"already": True, **data}
    return data


def public_session_json(session: Session) -> dict[str, Any]:
    """Lo que ve el alumno de una clase: título y si está abierta, sin la lista (spec 001 · CA-04, CA-09)."""
    return {"title": session.title, "open": session.is_open}


def created_session_json(session: Session) -> dict[str, Any]:
    """La clase recién abierta (spec 001 · CA-01)."""
    return {"id": session.id, "title": session.title}


def session_summary_json(summary: SessionSummary) -> dict[str, Any]:
    """Una clase en la lista del profesor (spec 001 · CA-16)."""
    return {
        "id": summary.id,
        "title": summary.title,
        "openedAt": summary.opened_at,
        "closedAt": summary.closed_at,
        "total": summary.total,
    }


def teacher_view_json(view: TeacherView, student_url: str) -> dict[str, Any]:
    """Lo que ve el profesor de una clase; código y cuenta atrás solo si está abierta (spec 001 · CA-10 a CA-13)."""
    data: dict[str, Any] = {
        "id": view.session.id,
        "title": view.session.title,
        "openedAt": view.session.opened_at,
        "closedAt": view.session.closed_at,
        "open": view.session.is_open,
        "studentUrl": student_url,
        "total": len(view.checkins),
        "checkins": [checkin_json(c) for c in view.checkins],
    }
    if view.code is not None:
        data["code"] = view.code
        data["secondsLeft"] = view.seconds_left
    return data
