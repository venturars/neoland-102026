"""Almacenamiento de clases y registros en un archivo SQLite.

Cada función pública recibe la ruta, abre la conexión y la cierra aunque
haya un fallo. No valida nombres ni códigos y no responde al navegador.
"""

import secrets
import sqlite3
from pathlib import Path

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


def _using(path: Path | str, work):
    connection = sqlite3.connect(path)
    try:
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return work(connection)
    finally:
        connection.close()


def _session(row) -> dict | None:
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


def _read_session(connection: sqlite3.Connection, session_id: str) -> dict | None:
    row = connection.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def prepare(path: Path | str) -> str:
    """Crea las tablas si faltan y devuelve el token del profesor.

    No borra filas que ya existan.

    :param path: Ruta del archivo.
    :return: Token guardado, o uno nuevo si no había.
    :rtype: str

    Usage::

        prepare("data/asistencia.db")
    """

    def work(connection: sqlite3.Connection) -> str:
        connection.executescript(SCHEMA)
        row = connection.execute(
            "SELECT value FROM config WHERE key = 'teacher_token'"
        ).fetchone()
        if row:
            return row["value"]
        token = secrets.token_urlsafe(24)
        with connection:
            connection.execute(
                "INSERT INTO config (key, value) VALUES ('teacher_token', ?)",
                (token,),
            )
        return token

    return _using(path, work)


def get_session(path: Path | str, session_id: str) -> dict | None:
    """Lee una clase.

    :param path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :return: La clase, con el secreto en bytes, o None.
    :rtype: dict | None
    """
    return _using(path, lambda connection: _read_session(connection, session_id))


def list_sessions(path: Path | str) -> list[dict]:
    """Clases de la más reciente a la más antigua, con su número de registros.

    :param path: Ruta del archivo.
    :return: Filas con id, title, opened_at, closed_at y total.
    :rtype: list[dict]
    """

    def work(connection: sqlite3.Connection) -> list[dict]:
        rows = connection.execute(
            """
            SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
            FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
            GROUP BY s.id
            ORDER BY s.opened_at DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]

    return _using(path, work)


def create_session(path: Path | str, title: str, opened_at: str) -> dict:
    """Abre una clase nueva.

    :param path: Ruta del archivo.
    :param title: Título ya decidido.
    :param opened_at: Hora de apertura en ISO UTC.
    :return: La clase creada.
    :rtype: dict
    """

    def work(connection: sqlite3.Connection) -> dict:
        session_id = secrets.token_urlsafe(6)
        secret = secrets.token_bytes(16)
        with connection:
            connection.execute(
                "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
                (session_id, title, secret.hex(), opened_at),
            )
        found = _read_session(connection, session_id)
        if found is None:
            raise LookupError(session_id)
        return found

    return _using(path, work)


def close_session(path: Path | str, session_id: str, closed_at: str) -> None:
    """Cierra la clase si todavía estaba abierta.

    :param path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param closed_at: Hora de cierre en ISO UTC.
    :return: Nada.
    :rtype: None
    """

    def work(connection: sqlite3.Connection) -> None:
        with connection:
            connection.execute(
                "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
                (closed_at, session_id),
            )

    _using(path, work)


def add_checkin(
    path: Path | str, session_id: str, name: str, key: str, checked_at: str
) -> tuple[dict, bool]:
    """Guarda un registro. Si el nombre ya estaba, no crea otro.

    :param path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param name: Nombre tal como se aceptó.
    :param key: Clave normalizada.
    :param checked_at: Hora del registro en ISO UTC.
    :return: El registro guardado y si se acaba de crear.
    :rtype: tuple[dict, bool]
    """

    def work(connection: sqlite3.Connection) -> tuple[dict, bool]:
        with connection:
            cursor = connection.execute(
                """
                INSERT INTO checkins (session_id, name, name_key, checked_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT (session_id, name_key) DO NOTHING
                """,
                (session_id, name, key, checked_at),
            )
        row = connection.execute(
            "SELECT name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
            (session_id, key),
        ).fetchone()
        return dict(row), cursor.rowcount == 1

    return _using(path, work)


def list_checkins(path: Path | str, session_id: str) -> list[dict]:
    """Registros de una clase, del más antiguo al más reciente.

    :param path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :return: Filas con id, name y checked_at.
    :rtype: list[dict]
    """

    def work(connection: sqlite3.Connection) -> list[dict]:
        rows = connection.execute(
            """
            SELECT id, name, checked_at FROM checkins
            WHERE session_id = ? ORDER BY checked_at, id
            """,
            (session_id,),
        ).fetchall()
        return [dict(row) for row in rows]

    return _using(path, work)


def remove_checkin(path: Path | str, session_id: str, checkin_id: int) -> bool:
    """Borra un registro si pertenece a esa clase.

    :param path: Ruta del archivo.
    :param session_id: Identificador de la clase.
    :param checkin_id: Identificador del registro.
    :return: True si borró una fila.
    :rtype: bool
    """

    def work(connection: sqlite3.Connection) -> bool:
        with connection:
            cursor = connection.execute(
                "DELETE FROM checkins WHERE id = ? AND session_id = ?",
                (checkin_id, session_id),
            )
        return cursor.rowcount == 1

    return _using(path, work)
