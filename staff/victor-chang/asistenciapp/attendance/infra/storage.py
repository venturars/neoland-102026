"""Acceso a la base de datos SQLite (spec 001 · plan §3; spec 005 · plan §2.5).

Todo el SQL del proyecto vive aquí (ARCHITECTURE.md · D1) y sale convertido en tipos del
dominio, nunca en filas (D7, M4). Las funciones reciben una conexión abierta y **no confirman**:
quien llama abre la transacción con `with conn:` (D3, D4).
"""

import secrets
import sqlite3
from pathlib import Path

from attendance.domain.sessions import Checkin, CheckinResult, Session, SessionSummary

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
    """Abre la base de datos con filas por nombre y claves ajenas activadas."""
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema(conn: sqlite3.Connection) -> None:
    """Crea las tablas que falten. `executescript` confirma por su cuenta: solo se usa al arrancar."""
    conn.executescript(SCHEMA)


def get_or_create_teacher_token(conn: sqlite3.Connection) -> str:
    """Devuelve el token del profesor, y lo crea la primera vez (spec 001 · CA-15)."""
    row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
    if row:
        return str(row["value"])
    token = secrets.token_urlsafe(24)
    conn.execute("INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,))
    return token


def _session(row: sqlite3.Row) -> Session:
    return Session(
        id=row["id"],
        title=row["title"],
        secret=bytes.fromhex(row["secret"]),
        opened_at=row["opened_at"],
        closed_at=row["closed_at"],
    )


def _checkin(row: sqlite3.Row) -> Checkin:
    return Checkin(id=row["id"], name=row["name"], checked_at=row["checked_at"])


def create_session(conn: sqlite3.Connection, title: str, opened_at: str) -> Session:
    """Crea una clase abierta, con su id y su secreto."""
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    conn.execute(
        "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
        (session_id, title, secret.hex(), opened_at),
    )
    return Session(id=session_id, title=title, secret=secret, opened_at=opened_at, closed_at=None)


def get_session(conn: sqlite3.Connection, session_id: str) -> Session | None:
    """La clase con ese id, o None si no existe."""
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return None if row is None else _session(row)


def list_sessions(conn: sqlite3.Connection) -> list[SessionSummary]:
    """Todas las clases, de la más nueva a la más antigua, con su total (spec 001 · CA-16)."""
    rows = conn.execute(
        """
        SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
        FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
        GROUP BY s.id
        ORDER BY s.opened_at DESC
        """
    ).fetchall()
    return [
        SessionSummary(
            id=r["id"],
            title=r["title"],
            opened_at=r["opened_at"],
            closed_at=r["closed_at"],
            total=r["total"],
        )
        for r in rows
    ]


def close_session(conn: sqlite3.Connection, session_id: str, closed_at: str) -> None:
    """Cierra la clase; si ya estaba cerrada, conserva su hora de cierre (spec 001 · CA-13)."""
    conn.execute(
        "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
        (closed_at, session_id),
    )


def add_checkin(conn: sqlite3.Connection, session_id: str, name: str, key: str, checked_at: str) -> CheckinResult:
    """Registra al alumno; si ya existía uno con la misma clave, devuelve ese (spec 001 · CA-07)."""
    cursor = conn.execute(
        """
        INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)
        ON CONFLICT (session_id, name_key) DO NOTHING
        """,
        (session_id, name, key, checked_at),
    )
    row = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
        (session_id, key),
    ).fetchone()
    return CheckinResult(checkin=_checkin(row), created=cursor.rowcount == 1)


def list_checkins(conn: sqlite3.Connection, session_id: str) -> list[Checkin]:
    """Los registros de una clase, por orden de llegada."""
    rows = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
        (session_id,),
    ).fetchall()
    return [_checkin(r) for r in rows]


def remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Borra el registro si pertenece a esa clase. Devuelve True si borró algo (spec 001 · CA-24)."""
    cursor = conn.execute("DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id))
    return cursor.rowcount == 1
