"""Acciones de pasar lista.

Cada función hace una acción. Recibe la conexión y los datos ya leídos.
No conoce el navegador.
"""

from datetime import datetime

from asistencia.domain.access import MINUTE, is_attack
from asistencia.domain.codes import code_for, is_valid_code, seconds_left
from asistencia.domain.names import clean_name, name_key
from asistencia.infra import db
from asistencia.infra.export import to_csv

CLOSED = "La asistencia de esta clase ya está cerrada."
INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
NOT_FOUND = "Esta clase no existe. Revisa el enlace."
MISSING_CHECKIN = "Ese registro no existe en esta clase."
BANNED = "No puedes pasar lista: tu acceso está bloqueado."


class ActionError(Exception):
    """La acción no puede completarse."""

    def __init__(self, message: str) -> None:
        """Guarda el mensaje que verá quien usa la app.

        :param message: texto del error.
        :return: None.
        """
        super().__init__(message)
        self.message = message


def _require_session(conn, session_id: str) -> dict:
    session = db.get_session(conn, session_id)
    if session is None:
        raise ActionError(NOT_FOUND)
    return session


def public_session(conn, session_id: str) -> dict:
    """Devuelve el título de una clase y si sigue abierta.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: title y open.
    :raises ActionError: si la clase no existe.
    """
    session = _require_session(conn, session_id)
    return {"title": session["title"], "open": session["closed_at"] is None}


def screen_caller(conn, calls: dict, ip: str, now: float, banned_at: str) -> None:
    """Cuenta la llamada y bloquea si la IP ataca o ya está en la blacklist.

    :param conn: conexión abierta.
    :param calls: horas de llamada en memoria, por IP.
    :param ip: IP pública estática de la conexión.
    :param now: instante actual, en segundos.
    :param banned_at: hora del bloqueo, en ISO UTC.
    :return: None.
    :raises ActionError: si la IP está bloqueada o esta llamada supera el límite.
    """
    if db.is_banned(conn, ip):
        raise ActionError(BANNED)
    recent = [stamp for stamp in calls.get(ip, []) if now - stamp < MINUTE]
    recent.append(now)
    calls[ip] = recent
    if is_attack(recent, now):
        db.ban(conn, ip, banned_at)
        raise ActionError(BANNED)


def register(conn, session_id: str, raw_name, code, now: float, checked_at: str) -> dict:
    """Registra a un alumno en una clase abierta.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param raw_name: nombre tal como llegó.
    :param code: código que escribió el alumno.
    :param now: instante actual, en segundos Unix.
    :param checked_at: hora del registro, en ISO UTC.
    :return: name, checked_at y created. created es False si ya estaba.
    :raises ActionError: si la clase no existe, está cerrada, el nombre no vale o el código no vale.
    """
    session = _require_session(conn, session_id)
    if session["closed_at"] is not None:
        raise ActionError(CLOSED)
    try:
        name = clean_name(raw_name)
    except ValueError as exc:
        raise ActionError(str(exc)) from exc
    if not is_valid_code(session["secret"], code, now):
        raise ActionError(INVALID_CODE)
    row, created = db.add_checkin(conn, session_id, name, name_key(name), checked_at)
    return {"name": row["name"], "checked_at": row["checked_at"], "created": created}


def list_sessions(conn) -> list[dict]:
    """Lista las clases de la más reciente a la más antigua.

    :param conn: conexión abierta.
    :return: las clases, con id, title, opened_at, closed_at y total.
    """
    return db.list_sessions(conn)


def open_session(conn, title, now: float, opened_at: str) -> dict:
    """Abre una clase. Si no llega título, usa la fecha y la hora.

    :param conn: conexión abierta.
    :param title: título pedido, o un valor vacío.
    :param now: instante actual, en segundos Unix.
    :param opened_at: hora de apertura, en ISO UTC.
    :return: id y title de la clase creada.
    """
    clean_title = str(title or "").strip()
    if not clean_title:
        clean_title = datetime.fromtimestamp(now).strftime("%d/%m/%Y %H:%M")
    session = db.create_session(conn, clean_title, opened_at)
    return {"id": session["id"], "title": session["title"]}


def teacher_view(conn, session_id: str, now: float) -> dict:
    """Prepara la vista del profesor. El código solo va si la clase sigue abierta.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param now: instante actual, en segundos Unix.
    :return: los datos de la clase, sus registros y, si está abierta, code y seconds_left.
    :raises ActionError: si la clase no existe.
    """
    session = _require_session(conn, session_id)
    checkins = db.list_checkins(conn, session_id)
    data = {
        "id": session["id"],
        "title": session["title"],
        "open": session["closed_at"] is None,
        "opened_at": session["opened_at"],
        "closed_at": session["closed_at"],
        "total": len(checkins),
        "checkins": checkins,
    }
    if data["open"]:
        data["code"] = code_for(session["secret"], now)
        data["seconds_left"] = seconds_left(now)
    return data


def close_session(conn, session_id: str, closed_at: str) -> dict:
    """Cierra una clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param closed_at: hora de cierre, en ISO UTC.
    :return: ok en True.
    :raises ActionError: si la clase no existe.
    """
    _require_session(conn, session_id)
    db.close_session(conn, session_id, closed_at)
    return {"ok": True}


def remove_checkin(conn, session_id: str, checkin_id: int) -> dict:
    """Quita un registro de una clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param checkin_id: identificador del registro.
    :return: ok en True.
    :raises ActionError: si la clase o el registro no existen.
    """
    _require_session(conn, session_id)
    if not db.remove_checkin(conn, session_id, checkin_id):
        raise ActionError(MISSING_CHECKIN)
    return {"ok": True}


def export_csv(conn, session_id: str) -> dict:
    """Prepara el CSV de una clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: opened_at, session_id y csv.
    :raises ActionError: si la clase no existe.
    """
    session = _require_session(conn, session_id)
    return {
        "opened_at": session["opened_at"],
        "session_id": session["id"],
        "csv": to_csv(db.list_checkins(conn, session_id)),
    }
