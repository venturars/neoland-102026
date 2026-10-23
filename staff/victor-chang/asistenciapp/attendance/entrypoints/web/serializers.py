"""De tipos del dominio a JSON de la API, en camelCase (spec 005 · plan §2.2; ARCHITECTURE.md · D7, F2).

Cada respuesta elige sus campos: nunca sale el secreto de una clase. T12 completa este módulo.
"""

from typing import Any

from attendance.domain.sessions import Checkin, Session, SessionSummary


def checkin_json(checkin: Checkin, with_id: bool = True) -> dict[str, Any]:
    """Un registro. El alumno no necesita el id de su registro; solo el panel del profesor (spec 001 · CA-24)."""
    data: dict[str, Any] = {"name": checkin.name, "checkedAt": checkin.checked_at}
    if with_id:
        data["id"] = checkin.id
    return data


def session_json(session: Session | SessionSummary) -> dict[str, Any]:
    """Los campos públicos de una clase."""
    return {
        "id": session.id,
        "title": session.title,
        "openedAt": session.opened_at,
        "closedAt": session.closed_at,
    }
