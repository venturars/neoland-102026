"""Acceso a la base de datos SQLite (plan §3).

Cada función recibe la ruta de la base de datos y abre y cierra su propia
conexión (CA-14). Solo guarda y lee: no decide nada de negocio (CA-15).
"""

import os
import secrets
import sqlite3
from contextlib import contextmanager
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

-- Contadores y lista negra por IP (spec 006). Sin relación con nombres ni sesiones.
CREATE TABLE IF NOT EXISTS ip_attempts (
  ip           TEXT NOT NULL,
  attempted_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ip_attempts_ip ON ip_attempts (ip, attempted_at);

CREATE TABLE IF NOT EXISTS blocked_ips (
  ip         TEXT PRIMARY KEY,
  blocked_at TEXT NOT NULL
);
"""


@contextmanager
def _connection(db_path: str | os.PathLike[str]) -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def init_schema(db_path: str | os.PathLike[str]) -> None:
    """Crea las tablas si no existen.

    :param db_path: ruta de la base de datos.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> init_schema(os.path.join(tempfile.mkdtemp(), "ejemplo.db"))
    """
    with _connection(db_path) as conn:
        conn.executescript(SCHEMA)


def get_or_create_teacher_token(db_path: str | os.PathLike[str]) -> str:
    """Devuelve el token del profesor; lo crea y lo guarda la primera vez.

    :param db_path: ruta de la base de datos, con el esquema creado.
    :return: el token.
    :rtype: str

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> get_or_create_teacher_token(path) == get_or_create_teacher_token(path)
        True
    """
    with _connection(db_path) as conn:
        row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
        if row:
            return row["value"]
        token = secrets.token_urlsafe(24)
        with conn:
            conn.execute("INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,))
        return token


def _session(row: sqlite3.Row | None) -> dict | None:
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


def create_session(db_path: str | os.PathLike[str], title: str, opened_at: str) -> dict:
    """Crea una sesión con identificador y secreto aleatorios (CA-01).

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param title: título de la sesión.
    :param opened_at: hora de apertura, en ISO 8601 UTC.
    :return: la sesión creada.
    :rtype: dict

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> create_session(path, "Clase", "2026-10-26T10:00:00.000+00:00")["title"]
        'Clase'
    """
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
                (session_id, title, secret.hex(), opened_at),
            )
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def get_session(db_path: str | os.PathLike[str], session_id: str) -> dict | None:
    """Busca una sesión por su identificador.

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: la sesión, con su secreto en ``bytes``, o ``None`` si no existe.
    :rtype: dict | None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> get_session(path, "no-existe") is None
        True
    """
    with _connection(db_path) as conn:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    return _session(row)


def list_sessions(db_path: str | os.PathLike[str]) -> list[dict]:
    """Lista las sesiones con su total de asistentes, de la más reciente a la más antigua (CA-16).

    :param db_path: ruta de la base de datos.
    :return: una entrada por sesión, con ``id``, ``title``, ``opened_at``, ``closed_at`` y ``total``.
    :rtype: list[dict]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> list_sessions(path)
        []
    """
    with _connection(db_path) as conn:
        rows = conn.execute(
            """
            SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
            FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
            GROUP BY s.id
            ORDER BY s.opened_at DESC
            """
        ).fetchall()
    return [dict(r) for r in rows]


def close_session(db_path: str | os.PathLike[str], session_id: str, closed_at: str) -> None:
    """Cierra la sesión; si ya estaba cerrada, no cambia la hora (CA-13).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param closed_at: hora de cierre, en ISO 8601 UTC.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> close_session(path, "no-existe", "2026-10-26T11:00:00.000+00:00")
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
                (closed_at, session_id),
            )


def add_checkin(
    db_path: str | os.PathLike[str], session_id: str, name: str, key: str, checked_at: str
) -> tuple[dict, bool]:
    """Registra al alumno; si ya estaba, devuelve su registro anterior (CA-07).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param name: nombre tal como lo escribió el alumno.
    :param key: clave de comparación del nombre, sin tildes ni mayúsculas.
    :param checked_at: hora del registro, en ISO 8601 UTC.
    :return: el registro (``name``, ``checked_at``) y si se ha creado ahora.
    :rtype: tuple[dict, bool]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> session = create_session(path, "Clase", "2026-10-26T10:00:00.000+00:00")
        >>> add_checkin(path, session["id"], "Ana", "ana", "2026-10-26T10:01:00.000+00:00")[1]
        True
        >>> add_checkin(path, session["id"], "ANA", "ana", "2026-10-26T10:02:00.000+00:00")[1]
        False
    """
    with _connection(db_path) as conn:
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


def list_checkins(db_path: str | os.PathLike[str], session_id: str) -> list[dict]:
    """Lista los registros de una sesión por hora de llegada.

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: registros con ``id``, ``name`` y ``checked_at``.
    :rtype: list[dict]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> list_checkins(path, "no-existe")
        []
    """
    with _connection(db_path) as conn:
        rows = conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
            (session_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def remove_checkin(db_path: str | os.PathLike[str], session_id: str, checkin_id: int) -> bool:
    """Borra el registro si pertenece a esa sesión (CA-24).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :return: ``True`` si borró algo.
    :rtype: bool

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> remove_checkin(path, "no-existe", 1)
        False
    """
    with _connection(db_path) as conn:
        with conn:
            cursor = conn.execute(
                "DELETE FROM checkins WHERE id = ? AND session_id = ?", (checkin_id, session_id)
            )
    return cursor.rowcount == 1


def record_ip_attempt(db_path: str | os.PathLike[str], ip: str, at: float) -> tuple[int, int]:
    """Apunta un intento de registro de una IP y cuenta los recientes (CA-02, CA-04).

    Borra antes los intentos de esa IP de hace 60 s o más, para que la tabla no crezca.

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param ip: IP que intenta registrarse.
    :param at: instante del intento, en segundos Unix.
    :return: intentos de la IP en el último segundo y en el último minuto, contando este.
    :rtype: tuple[int, int]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> record_ip_attempt(path, "203.0.113.7", 1_800_000_000.0)
        (1, 1)
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute("DELETE FROM ip_attempts WHERE ip = ? AND attempted_at <= ?", (ip, at - 60))
            conn.execute("INSERT INTO ip_attempts (ip, attempted_at) VALUES (?, ?)", (ip, at))
        row = conn.execute(
            "SELECT COALESCE(SUM(attempted_at > ?), 0), COUNT(*) FROM ip_attempts WHERE ip = ?",
            (at - 1, ip),
        ).fetchone()
    return row[0], row[1]


def is_ip_blocked(db_path: str | os.PathLike[str], ip: str) -> bool:
    """Dice si una IP está en la lista negra (CA-06).

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param ip: IP que se consulta.
    :return: ``True`` si está bloqueada.
    :rtype: bool

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> is_ip_blocked(path, "203.0.113.7")
        False
    """
    with _connection(db_path) as conn:
        row = conn.execute("SELECT 1 FROM blocked_ips WHERE ip = ?", (ip,)).fetchone()
    return row is not None


def block_ip(db_path: str | os.PathLike[str], ip: str, blocked_at: str) -> None:
    """Mete una IP en la lista negra para siempre; si ya estaba, no hace nada (CA-08).

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param ip: IP que se bloquea.
    :param blocked_at: hora del bloqueo, en ISO 8601 UTC.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> block_ip(path, "203.0.113.7", "2026-10-26T10:00:00.000+00:00")
        >>> is_ip_blocked(path, "203.0.113.7")
        True
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute("INSERT OR IGNORE INTO blocked_ips (ip, blocked_at) VALUES (?, ?)", (ip, blocked_at))
