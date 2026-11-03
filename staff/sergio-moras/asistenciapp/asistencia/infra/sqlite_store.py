"""Guardado de clases y registros en un archivo SQLite.

Este módulo guarda y lee: no decide si un registro vale. Cada función recibe
una conexión abierta con ``open_db``, que la cierra al terminar.

Usage::

  >>> with open_db(db_path) as conn:
  ...     session = create_session(conn, "Clase de prueba", "2026-11-01T10:00:00+00:00")
"""

import secrets
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

SCHEMA = """
CREATE TABLE IF NOT EXISTS config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,
  opened_at  TEXT NOT NULL,
  closed_at  TEXT
);

CREATE TABLE IF NOT EXISTS checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
"""


@contextmanager
def open_db(path: str | Path) -> Iterator[sqlite3.Connection]:
    """Abre la base de datos y la cierra al salir del ``with``.

    :param path: ruta del archivo SQLite.
    :return: conexión que devuelve las filas como diccionarios.
    :rtype: Iterator[sqlite3.Connection]

    Usage::

      >>> with open_db("data/asistencia.db") as conn:
      ...     list_sessions(conn)
    """
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def init_schema(conn: sqlite3.Connection) -> None:
    """Crea las tablas si todavía no existen.

    :param conn: conexión abierta.

    Usage::

      >>> init_schema(conn)
    """
    conn.executescript(SCHEMA)


def get_or_create_teacher_token(conn: sqlite3.Connection) -> str:
    """Devuelve el token secreto del profesor, creándolo la primera vez.

    :param conn: conexión abierta.
    :return: token que va en el enlace del panel.
    :rtype: str

    Usage::

      >>> token = get_or_create_teacher_token(conn)
    """
    row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
    if row:
        return row["value"]
    token = secrets.token_urlsafe(24)
    with conn:
        conn.execute("INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,))
    return token


def _session(row) -> dict | None:
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


def create_session(conn: sqlite3.Connection, title: str, opened_at: str) -> dict:
    """Guarda una clase nueva con su id público y su secreto.

    :param conn: conexión abierta.
    :param title: título de la clase.
    :param opened_at: hora de apertura en ISO UTC.
    :return: la clase guardada.
    :rtype: dict

    Usage::

      >>> session = create_session(conn, "Clase 1", "2026-11-01T10:00:00+00:00")
    """
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    with conn:
        conn.execute(
            "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
            (session_id, title, secret.hex(), opened_at),
        )
    return get_session(conn, session_id)


def get_session(conn: sqlite3.Connection, session_id: str) -> dict | None:
    """Lee una clase por su id.

    :param conn: conexión abierta.
    :param session_id: id público de la clase.
    :return: la clase con su secreto en bytes, o ``None`` si no existe.
    :rtype: dict | None

    Usage::

      >>> session = get_session(conn, "aB3dE5fG")
    """
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def list_sessions(conn: sqlite3.Connection) -> list[dict]:
    """Lista todas las clases, de la más reciente a la más antigua, con su total de registros.

    :param conn: conexión abierta.
    :return: clases con ``id``, ``title``, ``opened_at``, ``closed_at`` y ``total``.
    :rtype: list[dict]

    Usage::

      >>> list_sessions(conn)
    """
    rows = conn.execute(
        """
        SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
        FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
        GROUP BY s.id
        ORDER BY s.opened_at DESC
        """
    ).fetchall()
    return [dict(r) for r in rows]


def close_session(conn: sqlite3.Connection, session_id: str, closed_at: str) -> None:
    """Marca la clase como cerrada si aún no lo estaba.

    :param conn: conexión abierta.
    :param session_id: id público de la clase.
    :param closed_at: hora de cierre en ISO UTC.

    Usage::

      >>> close_session(conn, "aB3dE5fG", "2026-11-01T11:00:00+00:00")
    """
    with conn:
        conn.execute(
            "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
            (closed_at, session_id),
        )


def add_checkin(
    conn: sqlite3.Connection, session_id: str, name: str, key: str, checked_at: str
) -> tuple[dict, bool]:
    """Guarda el registro de un alumno, salvo que ya exista uno con la misma clave.

    :param conn: conexión abierta.
    :param session_id: id público de la clase.
    :param name: nombre tal como lo escribió el alumno.
    :param key: clave para detectar repetidos.
    :param checked_at: hora del registro en ISO UTC.
    :return: el registro (nuevo o el que ya había) y si se acaba de crear.
    :rtype: tuple[dict, bool]

    Usage::

      >>> row, created = add_checkin(conn, session_id, "Ana", "ana", now_iso)
    """
    with conn:
        cursor = conn.execute(
            """
            INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)
            ON CONFLICT (session_id, name_key) DO NOTHING
            """,
            (session_id, name, key, checked_at),
        )
    row = conn.execute(
        "SELECT name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
        (session_id, key),
    ).fetchone()
    return dict(row), cursor.rowcount == 1


def list_checkins(conn: sqlite3.Connection, session_id: str) -> list[dict]:
    """Lista los registros de una clase por orden de llegada.

    :param conn: conexión abierta.
    :param session_id: id público de la clase.
    :return: registros con ``id``, ``name`` y ``checked_at``.
    :rtype: list[dict]

    Usage::

      >>> list_checkins(conn, "aB3dE5fG")
    """
    rows = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
        (session_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Borra un registro si pertenece a esa clase.

    :param conn: conexión abierta.
    :param session_id: id público de la clase.
    :param checkin_id: id del registro.
    :return: ``True`` si se borró algo.
    :rtype: bool

    Usage::

      >>> remove_checkin(conn, "aB3dE5fG", 3)
      True
    """
    with conn:
        cursor = conn.execute(
            "DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id)
        )
    return cursor.rowcount == 1
