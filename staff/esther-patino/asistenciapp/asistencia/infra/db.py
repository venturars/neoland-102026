"""Acceso a la base de datos SQLite.

Las funciones reciben una conexión abierta: quien llama decide cuándo
abrirla y cerrarla. En la app, hay una conexión por petición.
"""

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


def connect(path) -> sqlite3.Connection:
    """Abre la base y activa las claves foráneas.

    :param path: ruta del archivo de la base.
    :return: la conexión abierta.
    """
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    """Crea las tablas si todavía no existen.

    :param conn: conexión abierta.
    :return: None.
    """
    conn.executescript(SCHEMA)


def get_or_create_teacher_token(conn: sqlite3.Connection) -> str:
    """Devuelve el token del profesor y lo crea la primera vez.

    :param conn: conexión abierta.
    :return: el token secreto del profesor.
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
    """Guarda una clase nueva.

    :param conn: conexión abierta.
    :param title: título de la clase.
    :param opened_at: hora de apertura, en ISO UTC.
    :return: la clase guardada, con el secreto en bytes.
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
    """Lee una clase por su identificador.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: la clase, o None si no existe.
    """
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def list_sessions(conn: sqlite3.Connection) -> list[dict]:
    """Lista las clases de la más reciente a la más antigua, con su total.

    :param conn: conexión abierta.
    :return: las clases, cada una con id, title, opened_at, closed_at y total.
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
    """Cierra una clase que todavía está abierta.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param closed_at: hora de cierre, en ISO UTC.
    :return: None.
    """
    with conn:
        conn.execute(
            "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
            (closed_at, session_id),
        )


def add_checkin(conn, session_id: str, name: str, key: str, checked_at: str) -> tuple[dict, bool]:
    """Registra al alumno. Si ya estaba, no crea otra fila.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param name: nombre que se guarda.
    :param key: clave que detecta el mismo nombre.
    :param checked_at: hora del registro, en ISO UTC.
    :return: el registro y True si se acaba de crear.
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
    """Lista los registros de una clase por hora de llegada.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :return: los registros, con id, name y checked_at.
    """
    rows = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
        (session_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Borra un registro si pertenece a esa clase.

    :param conn: conexión abierta.
    :param session_id: identificador de la clase.
    :param checkin_id: identificador del registro.
    :return: True si borró una fila.
    """
    with conn:
        cursor = conn.execute(
            "DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id)
        )
    return cursor.rowcount == 1
