"""Almacén en SQLite. Cada función abre el fichero, guarda y lo cierra.

Ejemplo: create_session(ruta, "Clase", "2026-10-23T09:00:00")
devuelve la clase recién creada.
"""

import secrets
import sqlite3
from contextlib import contextmanager

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
def _open(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def _session(row) -> dict | None:
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


def prepare(path) -> str:
    """Crea las tablas si faltan y devuelve la clave del profesor.

    Recibe la ruta del fichero. Devuelve la clave, la misma si ya existía.
    Ejemplo: prepare(ruta).
    """
    with _open(path) as conn:
        conn.executescript(SCHEMA)
        row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
        if row:
            return row["value"]
        token = secrets.token_urlsafe(24)
        with conn:
            conn.execute(
                "INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,)
            )
        return token


def create_session(path, title: str, opened_at: str) -> dict:
    """Guarda una clase nueva y la devuelve.

    Recibe la ruta, el título y la hora de apertura. Devuelve la clase.
    Ejemplo: create_session(ruta, "Clase", "2026-10-23T09:00:00").
    """
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    with _open(path) as conn:
        with conn:
            conn.execute(
                "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
                (session_id, title, secret.hex(), opened_at),
            )
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        return _session(row)


def get_session(path, session_id: str) -> dict | None:
    """Lee una clase por su id, o None si no está.

    Recibe la ruta y el id. Devuelve la clase con el secreto en bytes.
    Ejemplo: get_session(ruta, id_clase).
    """
    with _open(path) as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        return _session(row)


def list_sessions(path) -> list[dict]:
    """Lista las clases, las más nuevas primero, con el número de presentes.

    Recibe la ruta. Devuelve una lista de clases.
    Ejemplo: list_sessions(ruta).
    """
    with _open(path) as conn:
        rows = conn.execute(
            """
            SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
            FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
            GROUP BY s.id
            ORDER BY s.opened_at DESC
            """
        ).fetchall()
        return [dict(r) for r in rows]


def close_session(path, session_id: str, closed_at: str) -> None:
    """Cierra la clase si aún estaba abierta.

    Recibe la ruta, el id y la hora de cierre. No devuelve nada.
    Ejemplo: close_session(ruta, id_clase, "2026-10-23T10:00:00").
    """
    with _open(path) as conn:
        with conn:
            conn.execute(
                "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
                (closed_at, session_id),
            )


def add_checkin(path, session_id: str, name: str, key: str, checked_at: str) -> tuple[dict, bool]:
    """Anota el nombre. Si ya estaba, no crea otro.

    Recibe la ruta, el id, el nombre, la clave y la hora.
    Devuelve el registro y True si es nuevo.
    Ejemplo: add_checkin(ruta, id_clase, "Ana", "ana", "2026-10-23T09:05:00").
    """
    with _open(path) as conn:
        with conn:
            cursor = conn.execute(
                """
                INSERT INTO checkins (session_id, name, name_key, checked_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (session_id, name_key) DO NOTHING
                """,
                (session_id, name, key, checked_at),
            )
        row = conn.execute(
            "SELECT name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
            (session_id, key),
        ).fetchone()
        return dict(row), cursor.rowcount == 1


def list_checkins(path, session_id: str) -> list[dict]:
    """Lista los presentes de una clase, en orden de llegada.

    Recibe la ruta y el id. Devuelve la lista de registros.
    Ejemplo: list_checkins(ruta, id_clase).
    """
    with _open(path) as conn:
        rows = conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
            (session_id,),
        ).fetchall()
        return [dict(r) for r in rows]


def remove_checkin(path, session_id: str, checkin_id: int) -> bool:
    """Borra un registro si pertenece a esa clase.

    Recibe la ruta, el id de la clase y el id del registro.
    Devuelve True si borró algo.
    Ejemplo: remove_checkin(ruta, id_clase, 3).
    """
    with _open(path) as conn:
        with conn:
            cursor = conn.execute(
                "DELETE FROM checkins WHERE id = ? AND session_id = ?",
                (checkin_id, session_id),
            )
        return cursor.rowcount == 1
