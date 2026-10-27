"""Acciones de la app: crear, consultar, registrar, cerrar y borrar asistencias.

Cada acción recibe la ruta de la base de datos (``db_path``) y, si hace falta,
el reloj (``now``); toma las decisiones con el dominio, guarda y lee con el
almacenamiento y devuelve diccionarios. Son las únicas que usan el almacenamiento.
"""

import os
from datetime import datetime, timezone
from typing import Callable

from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.names import clean_name, name_key
from asistencia.domain.rate_limit import BAN_MESSAGE, IpBanned, ensure_not_blocked, is_over_limit
from asistencia.domain.session import (
    CHECKIN_NOT_FOUND,
    CheckinNotFound,
    ensure_exists,
    ensure_open,
    ensure_valid_code,
)
from asistencia.storage import sqlite as storage

Clock = Callable[[], float]
DbPath = str | os.PathLike[str]


def prepare(db_path: DbPath) -> str:
    """Prepara la base de datos al arrancar (CA-16).

    :param db_path: ruta de la base de datos.
    :return: el token del profesor, creado la primera vez.
    :rtype: str

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> prepare(path) == prepare(path)
        True
    """
    storage.init_schema(db_path)
    return storage.get_or_create_teacher_token(db_path)


def _now_iso(now: Clock) -> str:
    return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")


def _session(db_path: DbPath, session_id: str) -> dict:
    return ensure_exists(storage.get_session(db_path, session_id))


def public_session(db_path: DbPath, session_id: str) -> dict:
    """Datos que ve el alumno de una clase.

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: ``title`` y ``open``.
    :rtype: dict
    :raises SessionNotFound: si la sesión no existe.

    Usage::

        >>> public_session(db_path, "abc")  # doctest: +SKIP
        {'title': 'Clase', 'open': True}
    """
    session = _session(db_path, session_id)
    return {"title": session["title"], "open": session["closed_at"] is None}


def _enforce_ip_limit(db_path: DbPath, ip: str, now: Clock) -> None:
    """Rechaza la IP bloqueada y bloquea la que se pasa de los límites (CA-02, CA-04, CA-06)."""
    ensure_not_blocked(storage.is_ip_blocked(db_path, ip))
    in_second, in_minute = storage.record_ip_attempt(db_path, ip, now())
    if is_over_limit(in_second, in_minute):
        storage.block_ip(db_path, ip, _now_iso(now))
        raise IpBanned(BAN_MESSAGE)


def check_in(
    db_path: DbPath, session_id: str, name: str | None, code: str, ip: str, now: Clock
) -> tuple[dict, bool]:
    """Registra a un alumno (CA-04, CA-06, CA-07, CA-08, CA-09).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param name: nombre que escribió el alumno.
    :param code: código que escribió el alumno.
    :param ip: IP de la conexión; solo sirve para limitar los intentos, no se guarda con el nombre.
    :param now: reloj que devuelve segundos Unix.
    :return: el registro (``name``, ``checkedAt``) y si se ha creado ahora.
    :rtype: tuple[dict, bool]
    :raises IpBanned: si la IP está bloqueada o se pasa de los límites.
    :raises SessionNotFound: si la sesión no existe.
    :raises SessionClosed: si la sesión está cerrada.
    :raises ValueError: si el nombre no es válido.
    :raises InvalidCode: si el código no vale.

    Usage::

        >>> check_in(db_path, "abc", "Ana", "1234", "203.0.113.7", time.time)  # doctest: +SKIP
        ({'name': 'Ana', 'checkedAt': '2026-10-26T10:00:00.000+00:00'}, True)
    """
    _enforce_ip_limit(db_path, ip, now)
    session = _session(db_path, session_id)
    ensure_open(session)
    clean = clean_name(name)
    ensure_valid_code(session, code, now())
    row, created = storage.add_checkin(db_path, session_id, clean, name_key(clean), _now_iso(now))
    return {"name": row["name"], "checkedAt": row["checked_at"]}, created


def list_sessions(db_path: DbPath) -> list[dict]:
    """Sesiones del profesor, de la más reciente a la más antigua (CA-16).

    :param db_path: ruta de la base de datos.
    :return: una entrada por sesión, con su total de asistentes.
    :rtype: list[dict]

    Usage::

        >>> list_sessions(db_path)  # doctest: +SKIP
        [{'id': 'abc', 'title': 'Clase', 'openedAt': '...', 'closedAt': None, 'total': 3}]
    """
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "openedAt": s["opened_at"],
            "closedAt": s["closed_at"],
            "total": s["total"],
        }
        for s in storage.list_sessions(db_path)
    ]


def create_session(db_path: DbPath, title: str | None, now: Clock) -> dict:
    """Abre una sesión; sin título usa la fecha y hora (CA-01, CA-02).

    :param db_path: ruta de la base de datos.
    :param title: título opcional.
    :param now: reloj que devuelve segundos Unix.
    :return: ``id`` y ``title`` de la sesión creada.
    :rtype: dict

    Usage::

        >>> create_session(db_path, "", time.time)  # doctest: +SKIP
        {'id': 'abc', 'title': '26/10/2026 10:00'}
    """
    title = str(title or "").strip()
    if not title:
        title = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")
    session = storage.create_session(db_path, title, _now_iso(now))
    return {"id": session["id"], "title": session["title"]}


def teacher_view(db_path: DbPath, session_id: str, now: Clock) -> dict:
    """Detalle de una sesión para el profesor; el código solo si está abierta (CA-11, CA-13).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param now: reloj que devuelve segundos Unix.
    :return: datos de la sesión y sus registros.
    :rtype: dict
    :raises SessionNotFound: si la sesión no existe.

    Usage::

        >>> teacher_view(db_path, "abc", time.time)["total"]  # doctest: +SKIP
        3
    """
    session = _session(db_path, session_id)
    checkins = storage.list_checkins(db_path, session_id)
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
        data["code"] = code_for(session["secret"], now())
        data["secondsLeft"] = seconds_left(now())
    return data


def close_session(db_path: DbPath, session_id: str, now: Clock) -> None:
    """Cierra la sesión (CA-13).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param now: reloj que devuelve segundos Unix.
    :return: nada.
    :rtype: None
    :raises SessionNotFound: si la sesión no existe.

    Usage::

        >>> close_session(db_path, "abc", time.time)  # doctest: +SKIP
    """
    _session(db_path, session_id)
    storage.close_session(db_path, session_id, _now_iso(now))


def remove_checkin(db_path: DbPath, session_id: str, checkin_id: int) -> None:
    """Borra un registro de la sesión (CA-24).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :return: nada.
    :rtype: None
    :raises SessionNotFound: si la sesión no existe.
    :raises CheckinNotFound: si el registro no está en esa sesión.

    Usage::

        >>> remove_checkin(db_path, "abc", 7)  # doctest: +SKIP
    """
    _session(db_path, session_id)
    if not storage.remove_checkin(db_path, session_id, checkin_id):
        raise CheckinNotFound(CHECKIN_NOT_FOUND)


def checkins_for_export(db_path: DbPath, session_id: str) -> tuple[dict, list[dict]]:
    """Sesión y registros para descargar la lista (CA-14).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: la sesión y sus registros.
    :rtype: tuple[dict, list[dict]]
    :raises SessionNotFound: si la sesión no existe.

    Usage::

        >>> session, rows = checkins_for_export(db_path, "abc")  # doctest: +SKIP
    """
    session = _session(db_path, session_id)
    return session, storage.list_checkins(db_path, session_id)
