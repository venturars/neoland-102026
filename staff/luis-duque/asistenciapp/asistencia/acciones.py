"""Acciones de pasar lista.

Reciben una conexión ya abierta y no conocen la web.
"""

from asistencia import db
from asistencia.export import to_csv
from asistencia.reglas.codes import code_for, is_valid_code, seconds_left
from asistencia.reglas.names import clean_name, name_key


class SessionNotFound(Exception):
    pass


class SessionClosed(Exception):
    pass


class InvalidCode(Exception):
    pass


class CheckinNotFound(Exception):
    pass


def _session(conn, session_id):
    session = db.get_session(conn, session_id)
    if session is None:
        raise SessionNotFound()
    return session


def open_session(conn, title, now, opened_at):
    title = str(title or "").strip()
    if not title:
        title = now.strftime("%d/%m/%Y %H:%M")
    session = db.create_session(conn, title, opened_at)
    return {"id": session["id"], "title": session["title"]}


def list_sessions(conn):
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "openedAt": row["opened_at"],
            "closedAt": row["closed_at"],
            "total": row["total"],
        }
        for row in db.list_sessions(conn)
    ]


def public_session(conn, session_id):
    session = _session(conn, session_id)
    return {"title": session["title"], "open": session["closed_at"] is None}


def register(conn, session_id, raw_name, code, now, checked_at):
    session = _session(conn, session_id)
    if session["closed_at"] is not None:
        raise SessionClosed()
    name = clean_name(raw_name)
    if not is_valid_code(session["secret"], code or "", now):
        raise InvalidCode()
    row, created = db.add_checkin(conn, session_id, name, name_key(name), checked_at)
    return {
        "name": row["name"],
        "checkedAt": row["checked_at"],
        "already": not created,
    }


def teacher_view(conn, session_id, now):
    session = _session(conn, session_id)
    checkins = db.list_checkins(conn, session_id)
    data = {
        "id": session["id"],
        "title": session["title"],
        "open": session["closed_at"] is None,
        "openedAt": session["opened_at"],
        "closedAt": session["closed_at"],
        "total": len(checkins),
        "checkins": [
            {"id": row["id"], "name": row["name"], "checkedAt": row["checked_at"]}
            for row in checkins
        ],
    }
    if data["open"]:
        data["code"] = code_for(session["secret"], now)
        data["secondsLeft"] = seconds_left(now)
    return data


def close_session(conn, session_id, closed_at):
    _session(conn, session_id)
    db.close_session(conn, session_id, closed_at)


def remove_checkin(conn, session_id, checkin_id):
    _session(conn, session_id)
    if not db.remove_checkin(conn, session_id, checkin_id):
        raise CheckinNotFound()


def download_list(conn, session_id):
    session = _session(conn, session_id)
    return session, to_csv(db.list_checkins(conn, session_id))
