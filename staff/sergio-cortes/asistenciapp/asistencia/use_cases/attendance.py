"""Casos de uso de asistencia (spec 001, misma semántica que antes del refactor)."""

from collections.abc import Callable
from datetime import datetime

from asistencia.domain import codes
from asistencia.domain.errors import (
    CheckinNotFound,
    InvalidCode,
    InvalidName,
    SessionClosed,
    SessionNotFound,
)
from asistencia.domain.names import clean_name, name_key
from asistencia.ports.repository import AttendanceRepository


def _require_session(repo: AttendanceRepository, session_id: str) -> dict:
    session = repo.get_session(session_id)
    if session is None:
        raise SessionNotFound()
    return session


def create_session(
    repo: AttendanceRepository,
    title: str,
    now: Callable[[], float],
    now_iso: Callable[[], str],
) -> dict:
    title = (title or "").strip()
    if not title:
        title = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")
    session = repo.create_session(title, now_iso())
    return {"id": session["id"], "title": session["title"]}


def list_sessions(repo: AttendanceRepository) -> list[dict]:
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "openedAt": s["opened_at"],
            "closedAt": s["closed_at"],
            "total": s["total"],
        }
        for s in repo.list_sessions()
    ]


def get_public_session(repo: AttendanceRepository, session_id: str) -> dict:
    session = _require_session(repo, session_id)
    return {"title": session["title"], "open": session["closed_at"] is None}


def teacher_session_view(
    repo: AttendanceRepository, session_id: str, now: Callable[[], float]
) -> dict:
    session = _require_session(repo, session_id)
    checkins = repo.list_checkins(session_id)
    data = {
        "id": session["id"],
        "title": session["title"],
        "open": session["closed_at"] is None,
        "openedAt": session["opened_at"],
        "closedAt": session["closed_at"],
        "total": len(checkins),
        "checkins": [
            {"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]} for c in checkins
        ],
    }
    if data["open"]:
        data["code"] = codes.code_for(session["secret"], now())
        data["secondsLeft"] = codes.seconds_left(now())
    return data


def check_in(
    repo: AttendanceRepository,
    session_id: str,
    raw_name,
    code: str,
    now: Callable[[], float],
    now_iso: Callable[[], str],
) -> dict:
    session = _require_session(repo, session_id)
    if session["closed_at"] is not None:
        raise SessionClosed()
    try:
        name = clean_name(raw_name)
    except ValueError as exc:
        raise InvalidName(str(exc)) from exc
    if not codes.is_valid_code(session["secret"], code, now()):
        raise InvalidCode()
    row, created = repo.add_checkin(session_id, name, name_key(name), now_iso())
    return {
        "created": created,
        "name": row["name"],
        "checkedAt": row["checked_at"],
    }


def close_session(
    repo: AttendanceRepository, session_id: str, now_iso: Callable[[], str]
) -> None:
    _require_session(repo, session_id)
    repo.close_session(session_id, now_iso())


def remove_checkin(repo: AttendanceRepository, session_id: str, checkin_id: int) -> None:
    _require_session(repo, session_id)
    if not repo.remove_checkin(session_id, checkin_id):
        raise CheckinNotFound()


def export_checkins(repo: AttendanceRepository, session_id: str) -> tuple[dict, list[dict]]:
    session = _require_session(repo, session_id)
    return session, repo.list_checkins(session_id)
