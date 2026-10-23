"""Acceso a la base de datos SQLite (plan §3).

Cada operación pública abre y cierra su propia conexión.
"""

import secrets
from pathlib import Path
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

CREATE TABLE IF NOT EXISTS registration_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  attempted_at REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS blocked_ips (
  ip TEXT PRIMARY KEY,
  blocked_at TEXT NOT NULL
);
"""


def _connect(path: str | Path) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)


def _get_or_create_teacher_token(conn: sqlite3.Connection) -> str:
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


def _create_session(conn: sqlite3.Connection, title: str, opened_at: str) -> dict:
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    with conn:
        conn.execute(
            "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
            (session_id, title, secret.hex(), opened_at),
        )
    return _get_session(conn, session_id)


def _get_session(conn: sqlite3.Connection, session_id: str) -> dict | None:
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def _list_sessions(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute(
        """
        SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
        FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
        GROUP BY s.id
        ORDER BY s.opened_at DESC
        """
    ).fetchall()
    return [dict(r) for r in rows]


def _close_session(conn: sqlite3.Connection, session_id: str, closed_at: str) -> None:
    with conn:
        conn.execute(
            "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
            (closed_at, session_id),
        )


def _add_checkin(conn, session_id: str, name: str, key: str, checked_at: str) -> tuple[dict, bool]:
    """Registra al alumno. Devuelve (registro, creado); si ya existía, creado=False (CA-07)."""
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


def _list_checkins(conn: sqlite3.Connection, session_id: str) -> list[dict]:
    rows = conn.execute(
        "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
        (session_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def _remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Borra el registro si pertenece a esa sesión. Devuelve True si borró algo (CA-24)."""
    with conn:
        cursor = conn.execute(
            "DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id)
        )
    return cursor.rowcount == 1


def prepare(path: str | Path, token: str | None = None) -> str:
    """Prepara tablas y obtiene el token persistente.

    :param path: archivo SQLite.
    :param token: token opcional para pruebas.
    :return: token de profesor.
    :rtype: str

    Usage::

      token = prepare(path)
    """
    conn = _connect(path)
    try:
        _init_schema(conn)
        return token or _get_or_create_teacher_token(conn)
    finally:
        conn.close()


def create_session(path: str | Path, title: str, opened_at: str) -> dict:
    """Ejecuta create_session en el archivo local.

    :param path: archivo SQLite.
    :param title: dato de la operación.
    :param opened_at: dato de la operación.
    :return: resultado de la consulta.
    :rtype: dict

    Usage::

      result = create_session(path ,title, opened_at)
    """
    conn = _connect(path)
    try:
        return _create_session(conn, title, opened_at)
    finally:
        conn.close()


def get_session(path: str | Path, session_id: str) -> dict | None:
    """Ejecuta get_session en el archivo local.

    :param path: archivo SQLite.
    :param session_id: dato de la operación.
    :return: resultado de la consulta.
    :rtype: dict | None

    Usage::

      result = get_session(path ,session_id)
    """
    conn = _connect(path)
    try:
        return _get_session(conn, session_id)
    finally:
        conn.close()


def list_sessions(path: str | Path) -> list[dict]:
    """Ejecuta list_sessions en el archivo local.

    :param path: archivo SQLite.
    :return: resultado de la consulta.
    :rtype: list[dict]

    Usage::

      result = list_sessions(path)
    """
    conn = _connect(path)
    try:
        return _list_sessions(conn)
    finally:
        conn.close()


def close_session(path: str | Path, session_id: str, closed_at: str) -> None:
    """Ejecuta close_session en el archivo local.

    :param path: archivo SQLite.
    :param session_id: dato de la operación.
    :param closed_at: dato de la operación.
    :return: resultado de la consulta.
    :rtype: None

    Usage::

      result = close_session(path ,session_id, closed_at)
    """
    conn = _connect(path)
    try:
        return _close_session(conn, session_id, closed_at)
    finally:
        conn.close()


def add_checkin(path: str | Path, session_id: str, name: str, key: str, checked_at: str) -> tuple[dict, bool]:
    """Ejecuta add_checkin en el archivo local.

    :param path: archivo SQLite.
    :param session_id: dato de la operación.
    :param name: dato de la operación.
    :param key: dato de la operación.
    :param checked_at: dato de la operación.
    :return: resultado de la consulta.
    :rtype: tuple[dict, bool]

    Usage::

      result = add_checkin(path ,session_id, name, key, checked_at)
    """
    conn = _connect(path)
    try:
        return _add_checkin(conn, session_id, name, key, checked_at)
    finally:
        conn.close()


def list_checkins(path: str | Path, session_id: str) -> list[dict]:
    """Ejecuta list_checkins en el archivo local.

    :param path: archivo SQLite.
    :param session_id: dato de la operación.
    :return: resultado de la consulta.
    :rtype: list[dict]

    Usage::

      result = list_checkins(path ,session_id)
    """
    conn = _connect(path)
    try:
        return _list_checkins(conn, session_id)
    finally:
        conn.close()


def add_registration_attempt(path: str | Path, ip: str, instant: float) -> None:
    """Conserva un intento sin datos de asistencia.

    :param path: archivo SQLite preparado.
    :param ip: dirección recibida por el servidor.
    :param instant: instante Unix del intento.
    :return: None.
    :rtype: None

    Usage::

      add_registration_attempt(path, ip, instant)
    """
    conn = _connect(path)
    try:
        with conn:
            conn.execute("INSERT INTO registration_attempts (ip, attempted_at) VALUES (?, ?)", (ip, instant))
    finally:
        conn.close()


def count_registration_attempts(path: str | Path, ip: str, since: float) -> int:
    """Consulta el recuento de una dirección incluyendo el instante inicial.

    :param path: archivo SQLite preparado.
    :param ip: dirección que se cuenta.
    :param since: límite inferior Unix incluido.
    :return: cantidad de intentos desde ese límite.
    :rtype: int

    Usage::

      count = count_registration_attempts(path, ip, instant - 1)
    """
    conn = _connect(path)
    try:
        row = conn.execute(
            "SELECT COUNT(*) FROM registration_attempts WHERE ip = ? AND attempted_at >= ?", (ip, since)
        ).fetchone()
        return int(row[0])
    finally:
        conn.close()


def prune_registration_attempts(path: str | Path, before: float) -> None:
    """Elimina intentos estrictamente anteriores al límite, conservando bloqueos.

    :param path: archivo SQLite preparado.
    :param before: instante Unix excluido de la eliminación.
    :return: None.
    :rtype: None

    Usage::

      prune_registration_attempts(path, instant - 60)
    """
    conn = _connect(path)
    try:
        with conn:
            conn.execute("DELETE FROM registration_attempts WHERE attempted_at < ?", (before,))
    finally:
        conn.close()


def is_ip_blocked(path: str | Path, ip: str) -> bool:
    """Consulta la lista permanente por dirección.

    :param path: archivo SQLite preparado.
    :param ip: dirección que se consulta.
    :return: si existe un bloqueo guardado.
    :rtype: bool

    Usage::

      blocked = is_ip_blocked(path, ip)
    """
    conn = _connect(path)
    try:
        return conn.execute("SELECT ip FROM blocked_ips WHERE ip = ?", (ip,)).fetchone() is not None
    finally:
        conn.close()


def block_ip(path: str | Path, ip: str, blocked_at: str) -> None:
    """Añade un bloqueo sin reemplazar la fecha de uno existente.

    :param path: archivo SQLite preparado.
    :param ip: dirección que se bloquea.
    :param blocked_at: instante ISO UTC del primer bloqueo.
    :return: None.
    :rtype: None

    Usage::

      block_ip(path, ip, blocked_at)
    """
    conn = _connect(path)
    try:
        with conn:
            conn.execute(
                "INSERT INTO blocked_ips (ip, blocked_at) VALUES (?, ?) ON CONFLICT(ip) DO NOTHING",
                (ip, blocked_at),
            )
    finally:
        conn.close()


def remove_checkin(path: str | Path, session_id: str, checkin_id: int) -> bool:
    """Ejecuta remove_checkin en el archivo local.

    :param path: archivo SQLite.
    :param session_id: dato de la operación.
    :param checkin_id: dato de la operación.
    :return: resultado de la consulta.
    :rtype: bool

    Usage::

      result = remove_checkin(path ,session_id, checkin_id)
    """
    conn = _connect(path)
    try:
        return _remove_checkin(conn, session_id, checkin_id)
    finally:
        conn.close()
