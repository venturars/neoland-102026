"""Acciones de asistencia independientes de HTTP, con conexión por operación."""

from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
import time
from . import races
from ..domain.race import RaceError

from ..domain.codes import code_for, seconds_left
from ..domain.names import name_key
from ..domain.registration import AddressBlocked, OriginUnavailable, exceeds_limits, normalize_address
from ..domain.session import (
    InvalidCode, SessionClosed, SessionNotFound, require_session, validate_check_in,
)
from ..storage import sqlite as storage


def prepare(db_path: str | Path, token: str | None = None) -> str:
    """Prepara el esquema y obtiene el token del profesor.

    :param db_path: archivo local de asistencia.
    :param token: token explícito opcional.
    :return: token explícito o persistente.
    :rtype: str

    Usage::

        prepare(path, token)
    """
    with closing(storage.connect(db_path)) as conn:
        storage.init_schema(conn)
        return token or storage.get_or_create_teacher_token(conn)


def public_session(db_path: str | Path, session_id: str, now: float | None = None) -> dict:
    """Obtiene únicamente los datos públicos de una clase.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :param now: reloj Unix opcional; None usa el reloj del servidor.
    :return: título y estado abierto, sin datos privados.
    :rtype: dict

    Usage::

        public_session(path, session_id)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            data=races.teacher_state(db_path,session_id,lambda: time.time() if now is None else now)
            return {"title":data["title"],"open":data["open"]}
        session = require_session(storage.get_session(conn, session_id))
        return {"title": session["title"], "open": session["closed_at"] is None}


def list_sessions(db_path: str | Path) -> list[dict]:
    """Consulta sesiones con el contrato público del profesor.

    :param db_path: archivo local de asistencia.
    :return: sesiones y totales en el orden del almacén.
    :rtype: list[dict]

    Usage::

        list_sessions(path)
    """
    with closing(storage.connect(db_path)) as conn:
        return [
            {"id": s["id"], "title": s["title"], "openedAt": s["opened_at"],
             "closedAt": s["closed_at"], "total": s["total"]}
            for s in storage.list_sessions(conn)
        ]


def teacher_view(db_path: str | Path, session_id: str, now: float) -> dict:
    """Prepara la vista privada sin construir direcciones HTTP.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :param now: instante Unix de consulta.
    :return: sesión, registros y código solo si está abierta.
    :rtype: dict

    Usage::

        teacher_view(path, session_id, 1800000000.0)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            return races.teacher_state(db_path,session_id,lambda:now)
        session = require_session(storage.get_session(conn, session_id))
        checkins = storage.list_checkins(conn, session_id)
        data = {
            "id": session["id"], "title": session["title"],
            "open": session["closed_at"] is None,
            "openedAt": session["opened_at"], "closedAt": session["closed_at"],
            "total": len(checkins),
            "checkins": [{"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]} for c in checkins],
        }
        if data["open"]:
            data["code"] = code_for(session["secret"], now)
            data["secondsLeft"] = seconds_left(now)
        return data


def create_session(db_path: str | Path, title: str | None, now: float) -> dict:
    """Abre una clase con el título recibido o la fecha local.

    :param db_path: archivo local de asistencia.
    :param title: título recibido, opcional.
    :param now: instante Unix de creación.
    :return: sesión guardada con su secreto interno.
    :rtype: dict

    Usage::

        create_session(path, "Clase", 1800000000.0)
    """
    title = str(title or "").strip()
    if not title:
        title = datetime.fromtimestamp(now).strftime("%d/%m/%Y %H:%M")
    opened_at = datetime.fromtimestamp(now, timezone.utc).isoformat(timespec="milliseconds")
    with closing(storage.connect(db_path)) as conn:
        return storage.create_session(conn, title, opened_at)


def check_in(db_path: str | Path, session_id: str, fields: dict, now: float) -> tuple[dict, bool]:
    """Valida y registra, conservando los datos de un duplicado.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :param fields: datos recibidos con nombre y código.
    :param now: instante Unix del intento.
    :return: registro y si se creó una fila nueva.
    :rtype: tuple[dict, bool]

    Usage::

        check_in(path, session_id, {"name": "Ana", "code": code}, 1800000000.0)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            raise RaceError("access_denied","Esta clase usa carrera. Abre tu acceso de carrera.")
        session = storage.get_session(conn, session_id)
        name = validate_check_in(session, fields, now)
        checked_at = datetime.fromtimestamp(now, timezone.utc).isoformat(timespec="milliseconds")
        return storage.add_checkin(conn, session_id, name, name_key(name), checked_at)


def close_session(db_path: str | Path, session_id: str, now: float) -> None:
    """Cierra una clase existente sin sobrescribir un cierre previo.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :param now: instante Unix del cierre.
    :return: None.
    :rtype: None

    Usage::

        close_session(path, session_id, 1800000000.0)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            races.close(db_path,session_id,lambda:now)
            return
        require_session(storage.get_session(conn, session_id))
        closed_at = datetime.fromtimestamp(now, timezone.utc).isoformat(timespec="milliseconds")
        storage.close_session(conn, session_id, closed_at)


def remove_checkin(db_path: str | Path, session_id: str, checkin_id: int, now: float | None = None) -> bool:
    """Elimina un registro de una clase existente.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :param checkin_id: identificador del registro.
    :param now: reloj Unix opcional para la caducidad de carrera.
    :return: si existía y se eliminó ese registro en la clase.
    :rtype: bool

    Usage::

        remove_checkin(path, session_id, 1)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            return races.remove_checkin(db_path,session_id,checkin_id,lambda:time.time() if now is None else now)
        require_session(storage.get_session(conn, session_id))
        return storage.remove_checkin(conn, session_id, checkin_id)


def export_session(db_path: str | Path, session_id: str) -> tuple[dict, list[dict]]:
    """Obtiene la sesión y sus registros para el formato existente.

    :param db_path: archivo local de asistencia.
    :param session_id: identificador de la clase.
    :return: sesión y registros ordenados.
    :rtype: tuple[dict, list[dict]]

    Usage::

        export_session(path, session_id)
    """
    with closing(storage.connect(db_path)) as conn:
        if storage.is_race(conn,session_id):
            return races.export_checkins(db_path,session_id)
        session = require_session(storage.get_session(conn, session_id))
        return session, storage.list_checkins(conn, session_id)


def guard_registration(db_path: str | Path, address: str | None, now: float) -> None:
    """Cuenta un intento o confirma el bloqueo antes de validar la asistencia.

    :param db_path: archivo local de asistencia.
    :param address: origen normalizado o ausencia de origen fiable.
    :param now: instante Unix del intento.
    :return: None si puede continuar; lanza el error después de confirmar cambios.
    :rtype: None

    Usage::

        guard_registration(path, address, now)
    """
    address = normalize_address(address)
    denied = False
    with closing(storage.connect(db_path)) as conn:
        with conn:
            conn.execute("BEGIN IMMEDIATE")
            storage.purge_registration_attempts(conn, now - 60)
            if address is not None:
                denied = storage.address_is_blocked(conn, address)
                if not denied:
                    previous = storage.registration_attempt_times(conn, address)
                    denied = exceeds_limits(previous, now)
                    if denied:
                        storage.insert_blocked_address(conn, address)
                    else:
                        storage.insert_registration_attempt(conn, address, now)
    if address is None:
        raise OriginUnavailable("No se ha podido identificar el origen de conexión. No se registró la asistencia; contacta con el profesor.")
    if denied:
        raise AddressBlocked("Esta dirección está bloqueada permanentemente para registrar asistencia por superar los límites de intentos. Contacta con el profesor.")


def is_race(db_path: str | Path, session_id: str) -> bool:
    """Consulta el modo real sin aceptar un modo elegido por el cliente.

    :param db_path: archivo local de asistencia.
    :param session_id: clase consultada.
    :return: si la clase guardada tiene modo carrera.
    :rtype: bool

    Usage::

        is_race(path, session_id)
    """
    with closing(storage.connect(db_path)) as conn:
        return storage.is_race(conn,session_id)
