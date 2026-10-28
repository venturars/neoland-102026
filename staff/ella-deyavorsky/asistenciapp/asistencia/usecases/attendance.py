"""Acciones de la app: crear, consultar, registrar, cerrar y borrar asistencias.

Cada acción recibe la ruta de la base de datos (``db_path``) y, si hace falta,
el reloj (``now``); toma las decisiones con el dominio, guarda y lee con el
almacenamiento y devuelve diccionarios. Son las únicas que usan el almacenamiento.
"""

import os
from datetime import datetime, timezone
from typing import Callable

from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.names import clean_name, find_similar, name_key
from asistencia.domain.passes import (
    PASS_EXPIRED,
    PASS_USED,
    PassExpired,
    PassUsed,
    issue_pass,
    pass_is_valid,
    receipt_for,
    receipt_is_valid,
)
from asistencia.domain.rate_limit import BAN_MESSAGE, IpBanned, ensure_not_blocked, is_over_limit
from asistencia.domain.roster import (
    DUPLICATE,
    GROUP_GONE,
    GROUP_NOT_FOUND,
    NAME_TAKEN,
    NO_GROUP,
    NOT_IN_ROSTER,
    DuplicateName,
    GroupGone,
    GroupNotFound,
    NameTaken,
    NoGroup,
    NotInRoster,
    SimilarName,
    ensure_room,
)
from asistencia.domain.session import (
    CHECKIN_NOT_FOUND,
    CheckinNotFound,
    ensure_can_open,
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
    :return: ``title`` y ``open``; con grupo, también ``hasGroup``, nunca los nombres (spec 007, CA-03).
    :rtype: dict
    :raises SessionNotFound: si la sesión no existe.

    Usage::

        >>> public_session(db_path, "abc")  # doctest: +SKIP
        {'title': 'Clase', 'open': True}
    """
    session = _session(db_path, session_id)
    data = {"title": session["title"], "open": session["closed_at"] is None}
    if session["group_name"] is not None:
        data["hasGroup"] = True
    return data


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
    :return: el registro (``name``, ``checkedAt``) y si se ha creado ahora; si se ha creado,
        también ``id`` y ``receipt`` para liberar el navegador (spec 007, RF-17).
    :rtype: tuple[dict, bool]
    :raises IpBanned: si la IP está bloqueada o se pasa de los límites.
    :raises SessionNotFound: si la sesión no existe.
    :raises PassExpired: si la sesión tiene grupo: ahí se entra con el pase (spec 007, RF-11).
    :raises SessionClosed: si la sesión está cerrada.
    :raises ValueError: si el nombre no es válido.
    :raises InvalidCode: si el código no vale.

    Usage::

        >>> check_in(db_path, "abc", "Ana", "1234", "203.0.113.7", time.time)  # doctest: +SKIP
        ({'name': 'Ana', 'checkedAt': '2026-10-26T10:00:00.000+00:00'}, True)
    """
    _enforce_ip_limit(db_path, ip, now)
    session = _session(db_path, session_id)
    if session["group_name"] is not None:
        raise PassExpired(PASS_EXPIRED)
    ensure_open(session)
    clean = clean_name(name)
    ensure_valid_code(session, code, now())
    row, created = storage.add_checkin(db_path, session_id, clean, name_key(clean), _now_iso(now))
    result = {"name": row["name"], "checkedAt": row["checked_at"]}
    if created:
        # La respuesta «ya estabas registrado» no cambia (tests/test_api.py, CA-07).
        result.update(id=row["id"], receipt=receipt_for(session["secret"], row["id"]))
    return result, created


# ---------- spec 007 · registro en una sesión con grupo ----------


def _group_session(db_path: DbPath, session_id: str) -> dict:
    session = _session(db_path, session_id)
    if session["group_name"] is None:
        raise NoGroup(NO_GROUP)
    return session


def _ensure_pass(session: dict, pass_: str | None, now: Clock) -> None:
    if not pass_is_valid(session["secret"], pass_, now()):
        raise PassExpired(PASS_EXPIRED)


def _roster_view(db_path: DbPath, session_id: str) -> list[dict]:
    taken = {c["name_key"] for c in storage.list_checkins(db_path, session_id) if c["kind"] == "listed"}
    return [
        {"name": r["name"], "registered": r["name_key"] in taken}
        for r in storage.list_session_roster(db_path, session_id)
    ]


def unlock(db_path: DbPath, session_id: str, code: str, ip: str, now: Clock) -> dict:
    """Valida el código y da la lista con un pase de 2 minutos (spec 007, RF-11, RF-12, RF-13).

    Cuenta como un intento para el límite por IP (spec 006).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param code: código que escribió el alumno.
    :param ip: IP de la conexión; solo sirve para limitar los intentos.
    :param now: reloj que devuelve segundos Unix.
    :return: ``pass`` y ``roster`` (``name`` y ``registered`` de cada alumno de la copia).
    :rtype: dict
    :raises IpBanned: si la IP está bloqueada o se pasa de los límites.
    :raises SessionNotFound: si la sesión no existe.
    :raises NoGroup: si la sesión no tiene grupo.
    :raises SessionClosed: si la sesión está cerrada.
    :raises InvalidCode: si el código no vale.

    Usage::

        >>> unlock(db_path, "abc", "1234", "203.0.113.7", time.time)["roster"]  # doctest: +SKIP
        [{'name': 'Ana García', 'registered': False}]
    """
    _enforce_ip_limit(db_path, ip, now)
    session = _group_session(db_path, session_id)
    ensure_open(session)
    ensure_valid_code(session, code, now())
    return {"pass": issue_pass(session["secret"], now()), "roster": _roster_view(db_path, session_id)}


def roster_for_pass(db_path: DbPath, session_id: str, pass_: str | None, ip: str, now: Clock) -> dict:
    """Lista actualizada con un pase vigente, sin contar intento (spec 007, RF-13).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param pass_: el pase que dio :func:`unlock`.
    :param ip: IP de la conexión; una IP bloqueada se sigue rechazando.
    :param now: reloj que devuelve segundos Unix.
    :return: ``roster``, como en :func:`unlock`.
    :rtype: dict
    :raises IpBanned: si la IP está bloqueada.
    :raises PassExpired: si el pase falta o caducó.

    Usage::

        >>> roster_for_pass(db_path, "abc", pase, "203.0.113.7", time.time)  # doctest: +SKIP
        {'roster': [...]}
    """
    ensure_not_blocked(storage.is_ip_blocked(db_path, ip))
    session = _group_session(db_path, session_id)
    ensure_open(session)
    _ensure_pass(session, pass_, now)
    return {"roster": _roster_view(db_path, session_id)}


def check_in_group(
    db_path: DbPath,
    session_id: str,
    pass_: str | None,
    name: str | None,
    is_new: bool,
    confirm_similar: bool,
    ip: str,
    now: Clock,
) -> dict:
    """Registra a un alumno de la lista o a un nuevo con un pase vigente (spec 007, RF-13 a RF-15).

    No cuenta intento: ya se contó al validar el código (CA-11). Un pase sirve para un
    solo registro; si el registro falla, el pase sigue valiendo (spec v1.2, CA-21).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param pass_: el pase que dio :func:`unlock`.
    :param name: nombre elegido en la lista, o escrito si es nuevo.
    :param is_new: ``True`` si el alumno no está en la lista y se añade él mismo.
    :param confirm_similar: ``True`` si ya respondió «No, seguir como nuevo».
    :param ip: IP de la conexión; una IP bloqueada se sigue rechazando.
    :param now: reloj que devuelve segundos Unix.
    :return: ``id``, ``name``, ``checkedAt`` y ``receipt``.
    :rtype: dict
    :raises IpBanned: si la IP está bloqueada.
    :raises PassExpired: si el pase falta o caducó.
    :raises PassUsed: si el pase ya sirvió para otro registro.
    :raises NotInRoster: si el nombre elegido no está en la lista.
    :raises NameTaken: si ese nombre de la lista ya está registrado.
    :raises DuplicateName: si el nombre nuevo es igual a uno de la lista o a otro nuevo.
    :raises SimilarName: si el nombre nuevo se parece a otro y no se ha confirmado.
    :raises ValueError: si el nombre no es válido.

    Usage::

        >>> check_in_group(db_path, "abc", pase, "Ana García", False, False, ip, time.time)  # doctest: +SKIP
        {'id': 7, 'name': 'Ana García', 'checkedAt': '...', 'receipt': '...'}
    """
    ensure_not_blocked(storage.is_ip_blocked(db_path, ip))
    session = _group_session(db_path, session_id)
    ensure_open(session)
    _ensure_pass(session, pass_, now)
    clean = clean_name(name)
    key = name_key(clean)
    roster = {r["name_key"]: r["name"] for r in storage.list_session_roster(db_path, session_id)}
    checkins = storage.list_checkins(db_path, session_id)
    if not is_new:
        if key not in roster:
            raise NotInRoster(NOT_IN_ROSTER)
        if any(c["name_key"] == key for c in checkins):
            raise NameTaken(NAME_TAKEN)
        clean, kind = roster[key], "listed"
    else:
        newcomers = [c["name"] for c in checkins if c["kind"] == "new"]
        if key in roster or any(name_key(n) == key for n in newcomers):
            raise DuplicateName(DUPLICATE)  # CA-15
        like = find_similar(key, list(roster.values()) + newcomers)
        if like and not confirm_similar:
            raise SimilarName(like)  # CA-05
        kind = "new"
    status, row = storage.add_checkin_with_pass(db_path, session_id, clean, key, _now_iso(now), kind, pass_)
    if status == "pass_used":
        raise PassUsed(PASS_USED)  # CA-21
    if status == "name_taken":
        raise NameTaken(NAME_TAKEN)  # otro alumno se adelantó con el mismo nombre
    return {
        "id": row["id"],
        "name": row["name"],
        "checkedAt": row["checked_at"],
        "receipt": receipt_for(session["secret"], row["id"]),
    }


def registration_exists(db_path: DbPath, session_id: str, checkin_id: int, receipt: str | None) -> dict:
    """Dice al navegador si su registro sigue ahí, para liberarlo (spec 007, RF-17, RF-22, CA-14).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :param receipt: recibo que guardó el navegador al registrarse.
    :return: ``exists``.
    :rtype: dict
    :raises SessionNotFound: si la sesión no existe.
    :raises CheckinNotFound: si el recibo no es de ese registro.

    Usage::

        >>> registration_exists(db_path, "abc", 7, recibo)  # doctest: +SKIP
        {'exists': True}
    """
    session = _session(db_path, session_id)
    if not receipt_is_valid(session["secret"], checkin_id, receipt):
        raise CheckinNotFound(CHECKIN_NOT_FOUND)
    return {"exists": storage.get_checkin(db_path, session_id, checkin_id) is not None}


def list_sessions(db_path: DbPath) -> list[dict]:
    """Sesiones del profesor, de la más reciente a la más antigua (CA-16).

    :param db_path: ruta de la base de datos.
    :return: una entrada por sesión, con su total de asistentes.
    :rtype: list[dict]

    Usage::

        >>> list_sessions(db_path)  # doctest: +SKIP
        [{'id': 'abc', 'title': 'Clase', 'openedAt': '...', 'closedAt': None, 'total': 3, 'group': None}]
    """
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "openedAt": s["opened_at"],
            "closedAt": s["closed_at"],
            "total": s["total"],
            "group": s["group_name"],
        }
        for s in storage.list_sessions(db_path)
    ]


def create_session(db_path: DbPath, title: str | None, now: Clock, group_id: str | None = None) -> dict:
    """Abre una sesión; sin título usa la fecha y hora (CA-01, CA-02).

    Con grupo, guarda una copia fija de su lista (spec 007, RF-8, RF-8b, RF-9).

    :param db_path: ruta de la base de datos.
    :param title: título opcional.
    :param now: reloj que devuelve segundos Unix.
    :param group_id: grupo de la sesión, o ``None`` para una sesión rápida.
    :return: ``id`` y ``title`` de la sesión creada.
    :rtype: dict
    :raises GroupNotFound: si el grupo no existe.
    :raises GroupArchived: si el grupo está archivado.
    :raises EmptyGroup: si el grupo no tiene alumnos.

    Usage::

        >>> create_session(db_path, "", time.time)  # doctest: +SKIP
        {'id': 'abc', 'title': '26/10/2026 10:00'}
    """
    title = str(title or "").strip()
    if not title:
        title = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")
    group, roster = None, []
    if group_id:
        group = storage.get_group(db_path, group_id)
        if group is None:
            raise GroupNotFound(GROUP_NOT_FOUND)
        students = storage.list_group_students(db_path, group_id)
        ensure_can_open(group, len(students))
        roster = [(s["name"], s["name_key"]) for s in students]
    session = storage.create_session(db_path, title, _now_iso(now), group=group, roster=roster)
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
    if session["group_name"] is not None:
        data.update(_group_view(db_path, session, checkins))
    return data


def _group_view(db_path: DbPath, session: dict, checkins: list[dict]) -> dict:
    """Presentes, nuevos y ausentes de una sesión con grupo (spec 007, RF-18)."""
    roster = storage.list_session_roster(db_path, session["id"])
    present = [c for c in checkins if c["kind"] == "listed"]
    present_keys = {c["name_key"] for c in present}
    return {
        "group": {
            "id": session["group_id"],
            "name": session["group_name"],
            "deleted": session["group_id"] is None,
        },
        "rosterSize": len(roster),
        "presentCount": len(present),
        "present": [{"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"]} for c in present],
        "newcomers": [
            {"id": c["id"], "name": c["name"], "checkedAt": c["checked_at"], "decided": bool(c["decided"])}
            for c in checkins
            if c["kind"] == "new"
        ],
        "absent": [r["name"] for r in roster if r["name_key"] not in present_keys],
    }


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


def roster_for_export(db_path: DbPath, session_id: str) -> list[dict]:
    """Copia de la lista de la sesión para la descarga con «Estado» (spec 007, RF-21).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: la copia, con ``name``; vacía en sesiones rápidas.
    :rtype: list[dict]

    Usage::

        >>> roster_for_export(db_path, "abc")  # doctest: +SKIP
        [{'name': 'Ana García', 'name_key': 'ana garcia'}]
    """
    return storage.list_session_roster(db_path, session_id)


def decide_new(db_path: DbPath, session_id: str, checkin_id: int, action: str) -> dict:
    """Decide sobre un nuevo, al cerrar o después (spec 007, RF-20, CA-06, CA-12, CA-17, CA-20).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro del nuevo.
    :param action: ``"add"`` (añadir al grupo), ``"keep"`` (dejar solo en esta sesión) o
        ``"discard"`` (quitar el registro).
    :return: ``result``: ``added``, ``linked``, ``kept`` o ``discarded``.
    :rtype: dict
    :raises SessionNotFound: si la sesión no existe.
    :raises NoGroup: si la sesión no tiene grupo.
    :raises CheckinNotFound: si el registro no es un nuevo de esa sesión.
    :raises GroupGone: si el grupo se borró y se pide añadir.
    :raises GroupFull: si el grupo ya tiene 200 alumnos y se pide añadir.
    :raises ValueError: si la acción no es una de las tres.

    Usage::

        >>> decide_new(db_path, "abc", 7, "add")  # doctest: +SKIP
        {'result': 'added'}
    """
    session = _group_session(db_path, session_id)
    checkin = storage.get_checkin(db_path, session_id, checkin_id)
    if checkin is None or checkin["kind"] != "new":
        raise CheckinNotFound(CHECKIN_NOT_FOUND)
    if action == "discard":
        storage.remove_checkin(db_path, session_id, checkin_id)  # también libera el navegador (RF-17)
        return {"result": "discarded"}
    if action == "keep":
        storage.set_checkin_decided(db_path, session_id, checkin_id)
        return {"result": "kept"}
    if action != "add":
        raise ValueError("Elige añadir al grupo, dejar solo en esta sesión o descartar.")
    group_id = session["group_id"]
    if group_id is None:
        raise GroupGone(GROUP_GONE)
    students = storage.list_group_students(db_path, group_id)
    match = next((s for s in students if s["name_key"] == checkin["name_key"]), None)
    if match:
        # «Ya está en el grupo»: se une a ese alumno. Única excepción a la copia fija (RF-9).
        storage.set_checkin_kind(db_path, session_id, checkin_id, "listed", match["name"], match["name_key"])
        storage.add_to_session_roster(db_path, session_id, match["name"], match["name_key"])
        return {"result": "linked"}
    ensure_room(len(students))
    storage.add_group_students(db_path, group_id, [(checkin["name"], checkin["name_key"])])
    storage.set_checkin_decided(db_path, session_id, checkin_id)
    return {"result": "added"}
