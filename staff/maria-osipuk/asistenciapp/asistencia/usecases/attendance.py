"""Acciones de pasar lista.

Coordinan las reglas y el almacenamiento. Reciben la ruta del archivo y
un reloj. No hablan con el navegador ni reciben una conexión abierta.
"""

from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path

from asistencia.domain.attempts import RegistrationBlocked, exceeds
from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.names import clean_name, name_key
from asistencia.domain.session import require_code, require_open, require_session
from asistencia.export import to_csv
from asistencia.storage import sqlite as storage


class CheckinNotFound(Exception):
    """Ese registro no está en esa clase."""


def _checked_at(now: Callable[[], float]) -> str:
    return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")


def prepare(db_path: Path | str) -> str:
    """Prepara el archivo y devuelve el token del profesor.

    :param db_path: Ruta del archivo, Path o str.
    :return: Token guardado.
    :rtype: str

    Usage::

        prepare("data/asistencia.db")
    """
    return storage.prepare(db_path)


def public_info(db_path: Path | str, session_id: str) -> dict[str, str | bool]:
    """Información pública de una clase: título y si sigue abierta.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :return: title y open.
    :rtype: dict[str, str | bool]
    :raises SessionNotFound: Si la clase no existe.
    """
    session = require_session(storage.get_session(db_path, session_id))
    return {"title": session["title"], "open": session["closed_at"] is None}


def check_in(
    db_path: Path | str,
    session_id: str,
    raw_name: object,
    raw_code: object,
    now: Callable[[], float],
    address: str,
) -> tuple[dict[str, str], bool]:
    """Registra a un alumno si la dirección puede y la clase acepta el código.

    El intento se anota antes de validar. Si la dirección está bloqueada o
    este intento supera el tope, no se guarda la asistencia.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param raw_name: Nombre recibido.
    :param raw_code: Código recibido.
    :param now: Reloj invocable. Devuelve segundos Unix.
    :param address: Dirección de la conexión, ya elegida por la entrada.
    :return: El registro (name, checked_at) y si se acaba de crear.
    :rtype: tuple[dict[str, str], bool]
    :raises RegistrationBlocked: Si la dirección está bloqueada o este intento supera el tope.
    :raises SessionNotFound: Si la clase no existe.
    :raises SessionClosed: Si la clase ya está cerrada.
    :raises ValueError: Si el nombre no sirve.
    :raises InvalidCode: Si el código no vale.

    Usage::

        registro, creado = check_in(ruta, clase, "Ana", "1234", reloj, "203.0.113.5")
    """
    blocked, in_second, in_minute = storage.note_attempt(db_path, address, now())
    if blocked or exceeds(in_second, in_minute):
        if not blocked:
            storage.block_address(db_path, address, now())
        raise RegistrationBlocked()
    session = require_session(storage.get_session(db_path, session_id))
    require_open(session)
    name = clean_name(raw_name)
    require_code(session, raw_code, now())
    row, created = storage.add_checkin(
        db_path, session_id, name, name_key(name), _checked_at(now)
    )
    return {"name": row["name"], "checked_at": row["checked_at"]}, created


def list_classes(db_path: Path | str) -> list[dict[str, object]]:
    """Lista las clases de la más reciente a la más antigua.

    :param db_path: Ruta del archivo.
    :return: Filas con opened_at, closed_at y total.
    :rtype: list[dict[str, object]]
    """
    return storage.list_sessions(db_path)


def open_class(db_path: Path | str, raw_title: object, now: Callable[[], float]) -> dict[str, str]:
    """Abre una clase. Sin título, usa la fecha y la hora locales.

    :param db_path: Ruta del archivo.
    :param raw_title: Título recibido, o vacío.
    :param now: Reloj invocable. Devuelve segundos Unix.
    :return: id y title.
    :rtype: dict[str, str]

    Usage::

        open_class(ruta, "Clase de SDD", reloj)
    """
    title = str(raw_title or "").strip()
    if not title:
        title = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")
    session = storage.create_session(db_path, title, _checked_at(now))
    return {"id": session["id"], "title": session["title"]}


def teacher_detail(db_path: Path | str, session_id: str, now: Callable[[], float]) -> dict[str, object]:
    """Detalle de la clase para el profesor, sin la dirección pública.

    El código solo va incluido si la clase sigue abierta.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param now: Reloj invocable. Devuelve segundos Unix.
    :return: Datos internos, con checked_at y seconds_left.
    :rtype: dict[str, object]
    :raises SessionNotFound: Si la clase no existe.
    """
    session = require_session(storage.get_session(db_path, session_id))
    checkins = storage.list_checkins(db_path, session_id)
    is_open = session["closed_at"] is None
    detail = {
        "id": session["id"],
        "title": session["title"],
        "open": is_open,
        "opened_at": session["opened_at"],
        "closed_at": session["closed_at"],
        "total": len(checkins),
        "checkins": [
            {"id": row["id"], "name": row["name"], "checked_at": row["checked_at"]}
            for row in checkins
        ],
    }
    if is_open:
        detail["code"] = code_for(session["secret"], now())
        detail["seconds_left"] = seconds_left(now())
    return detail


def close_class(db_path: Path | str, session_id: str, now: Callable[[], float]) -> None:
    """Cierra una clase.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param now: Reloj invocable.
    :return: Nada.
    :rtype: None
    :raises SessionNotFound: Si la clase no existe.
    """
    require_session(storage.get_session(db_path, session_id))
    storage.close_session(db_path, session_id, _checked_at(now))


def remove_checkin(db_path: Path | str, session_id: str, checkin_id: int) -> None:
    """Quita un registro de esa clase.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param checkin_id: Identificador del registro.
    :return: Nada.
    :rtype: None
    :raises SessionNotFound: Si la clase no existe.
    :raises CheckinNotFound: Si el registro no está en esa clase.
    """
    require_session(storage.get_session(db_path, session_id))
    if not storage.remove_checkin(db_path, session_id, checkin_id):
        raise CheckinNotFound("Ese registro no existe en esta clase.")


def export_csv(db_path: Path | str, session_id: str) -> tuple[str, str]:
    """Prepara el CSV con las filas ya cargadas.

    :param db_path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :return: El texto CSV y la hora de apertura.
    :rtype: tuple[str, str]
    :raises SessionNotFound: Si la clase no existe.

    Usage::

        texto, abierta = export_csv(ruta, clase)
    """
    session = require_session(storage.get_session(db_path, session_id))
    return to_csv(storage.list_checkins(db_path, session_id)), session["opened_at"]
