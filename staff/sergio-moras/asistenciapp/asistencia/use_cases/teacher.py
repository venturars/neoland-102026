"""Lo que hace el profesor: preparar la app, abrir, ver, cerrar, corregir y exportar clases.

Cada función abre su propia conexión, pide las decisiones a ``domain`` y los
datos a ``infra``. Recibe el instante ``t`` en segundos Unix en vez de leer el reloj.

Usage::

  >>> token = prepare(db_path)
  >>> session = open_session(db_path, "Clase 1", time.time())
  >>> view = session_detail(db_path, session["id"], time.time())
"""

from datetime import datetime, timezone
from pathlib import Path

from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.rules import is_open, require_session
from asistencia.infra import sqlite_store
from asistencia.infra.csv_export import to_csv


def iso_utc(t: float) -> str:
    """Convierte un instante en el texto con el que se guardan las horas.

    :param t: instante en segundos Unix.
    :return: fecha y hora ISO en UTC, con milisegundos.
    :rtype: str

    Usage::

      >>> iso_utc(1_800_000_000)
      '2027-01-15T08:00:00.000+00:00'
    """
    return datetime.fromtimestamp(t, timezone.utc).isoformat(timespec="milliseconds")


def prepare(db_path: str | Path) -> str:
    """Deja la base lista y devuelve el token del profesor.

    :param db_path: ruta del archivo SQLite.
    :return: token secreto del panel del profesor.
    :rtype: str

    Usage::

      >>> token = prepare("data/asistencia.db")
    """
    with sqlite_store.open_db(db_path) as conn:
        sqlite_store.init_schema(conn)
        return sqlite_store.get_or_create_teacher_token(conn)


def open_session(db_path: str | Path, title: str | None, t: float) -> dict:
    """Abre una clase nueva. Sin título, usa la fecha y hora locales.

    :param db_path: ruta del archivo SQLite.
    :param title: título que escribió el profesor (puede venir vacío).
    :param t: instante en segundos Unix.
    :return: la clase abierta, con ``id`` y ``title``.
    :rtype: dict

    Usage::

      >>> open_session(db_path, "", time.time())["title"]
      '01/11/2026 10:00'
    """
    title = str(title or "").strip() or datetime.fromtimestamp(t).strftime("%d/%m/%Y %H:%M")
    with sqlite_store.open_db(db_path) as conn:
        return sqlite_store.create_session(conn, title, iso_utc(t))


def list_sessions(db_path: str | Path) -> list[dict]:
    """Lista las clases del profesor, de la más reciente a la más antigua.

    :param db_path: ruta del archivo SQLite.
    :return: clases con ``id``, ``title``, ``opened_at``, ``closed_at`` y ``total``.
    :rtype: list[dict]

    Usage::

      >>> list_sessions(db_path)
    """
    with sqlite_store.open_db(db_path) as conn:
        return sqlite_store.list_sessions(conn)


def session_detail(db_path: str | Path, session_id: str, t: float) -> dict:
    """Devuelve lo que ve el profesor de una clase: estado, registros y, si está abierta, el código.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :param t: instante en segundos Unix.
    :return: la clase con ``open``, ``checkins`` y, si está abierta, ``code`` y ``seconds_left``.
    :rtype: dict
    :raises SessionNotFound: si la clase no existe.

    Usage::

      >>> session_detail(db_path, "aB3dE5fG", time.time())["code"]
      '0427'
    """
    with sqlite_store.open_db(db_path) as conn:
        session = require_session(sqlite_store.get_session(conn, session_id))
        checkins = sqlite_store.list_checkins(conn, session_id)
    detail = {
        "id": session["id"],
        "title": session["title"],
        "open": is_open(session),
        "opened_at": session["opened_at"],
        "closed_at": session["closed_at"],
        "checkins": checkins,
    }
    if detail["open"]:
        detail["code"] = code_for(session["secret"], t)
        detail["seconds_left"] = seconds_left(t)
    return detail


def close_session(db_path: str | Path, session_id: str, t: float) -> None:
    """Cierra la asistencia de una clase. Si ya estaba cerrada, no cambia nada.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :param t: instante en segundos Unix.
    :raises SessionNotFound: si la clase no existe.

    Usage::

      >>> close_session(db_path, "aB3dE5fG", time.time())
    """
    with sqlite_store.open_db(db_path) as conn:
        require_session(sqlite_store.get_session(conn, session_id))
        sqlite_store.close_session(conn, session_id, iso_utc(t))


def remove_checkin(db_path: str | Path, session_id: str, checkin_id: int) -> bool:
    """Quita un registro de una clase.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :param checkin_id: id del registro.
    :return: ``True`` si se quitó; ``False`` si no pertenece a esa clase.
    :rtype: bool
    :raises SessionNotFound: si la clase no existe.

    Usage::

      >>> remove_checkin(db_path, "aB3dE5fG", 3)
      True
    """
    with sqlite_store.open_db(db_path) as conn:
        require_session(sqlite_store.get_session(conn, session_id))
        return sqlite_store.remove_checkin(conn, session_id, checkin_id)


def export_csv(db_path: str | Path, session_id: str) -> tuple[str, str]:
    """Prepara la lista de una clase en CSV.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :return: el CSV y el nombre de fichero sugerido.
    :rtype: tuple[str, str]
    :raises SessionNotFound: si la clase no existe.

    Usage::

      >>> text, filename = export_csv(db_path, "aB3dE5fG")
      >>> filename
      'asistencia-2026-11-01-aB3dE5fG.csv'
    """
    with sqlite_store.open_db(db_path) as conn:
        session = require_session(sqlite_store.get_session(conn, session_id))
        checkins = sqlite_store.list_checkins(conn, session_id)
    day = session["opened_at"][:10]
    return to_csv(checkins), f"asistencia-{day}-{session_id}.csv"
