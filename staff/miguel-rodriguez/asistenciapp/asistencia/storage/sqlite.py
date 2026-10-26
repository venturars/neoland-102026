"""Acceso a la base de datos SQLite (plan §3).

Las funciones reciben una conexión abierta. Cada caso de uso la abre y
la cierra; las escrituras conservan sus transacciones.
"""

from pathlib import Path

import secrets
import sqlite3

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


def connect(path: str | Path) -> sqlite3.Connection:
    """Abre una conexión local con integridad referencial.

    :param path: archivo de base de datos.
    :return: conexión abierta, que debe cerrar quien llama.
    :rtype: sqlite3.Connection

    Usage::

        connect(path)
    """
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    """Inicializa las tablas existentes sin sustituirlas.

    :param conn: conexión abierta.
    :return: None.
    :rtype: None

    Usage::

        init_schema(conn)
    """
    conn.executescript(SCHEMA)


def get_or_create_teacher_token(conn: sqlite3.Connection) -> str:
    """Recupera el token guardado o crea el primero.

    :param conn: conexión abierta.
    :return: token persistente del profesor.
    :rtype: str

    Usage::

        get_or_create_teacher_token(conn)
    """
    row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
    if row:
        return row["value"]
    token = secrets.token_urlsafe(24)
    with conn:
        conn.execute("INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,))
    return token


def _session(row: sqlite3.Row | None) -> dict | None:
    """Convierte una fila de sesión y decodifica su secreto.

    :param row: fila SQLite o None.
    :return: sesión ordinaria o None.
    :rtype: dict | None

    Usage::

        _session(row)
    """
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


def create_session(conn: sqlite3.Connection, title: str, opened_at: str) -> dict:
    """Guarda una sesión con identificador y secreto aleatorios.

    :param conn: conexión abierta.
    :param title: título ya preparado.
    :param opened_at: hora de apertura en formato ISO.
    :return: sesión recién guardada.
    :rtype: dict

    Usage::

        create_session(conn, "Clase", opened_at)
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
    """Consulta una sesión por su identificador.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: sesión o None si no existe.
    :rtype: dict | None

    Usage::

        get_session(conn, session_id)
    """
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def list_sessions(conn: sqlite3.Connection) -> list[dict]:
    """Consulta las sesiones y sus totales en el orden existente.

    :param conn: conexión abierta.
    :return: lista de sesiones, de más reciente a más antigua.
    :rtype: list[dict]

    Usage::

        list_sessions(conn)
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
    """Guarda el primer cierre de una sesión.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param closed_at: hora de cierre ISO.
    :return: None; un cierre previo permanece intacto.
    :rtype: None

    Usage::

        close_session(conn, session_id, closed_at)
    """
    with conn:
        conn.execute(
            "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
            (closed_at, session_id),
        )


def add_checkin(conn: sqlite3.Connection, session_id: str, name: str, key: str, checked_at: str) -> tuple[dict, bool]:
    """Inserta un registro si no existe su clave en esa clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param name: nombre ya validado.
    :param key: clave normalizada del nombre.
    :param checked_at: hora de registro ISO.
    :return: registro y si la inserción creó una fila.
    :rtype: tuple[dict, bool]

    Usage::

        add_checkin(conn, session_id, "Ana", "ana", checked_at)
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
    """Consulta los registros de una clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: registros ordenados por hora e ID.
    :rtype: list[dict]

    Usage::

        list_checkins(conn, session_id)
    """
    rows = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
        (session_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Elimina un registro únicamente si pertenece a la clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param checkin_id: identificador del registro.
    :return: si se eliminó una fila.
    :rtype: bool

    Usage::

        remove_checkin(conn, session_id, checkin_id)
    """
    with conn:
        cursor = conn.execute(
            "DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id)
        )
    return cursor.rowcount == 1
