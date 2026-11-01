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

-- Grupos y sus alumnos (spec 007). Del alumno solo se guarda el nombre (P4).
CREATE TABLE IF NOT EXISTS groups (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS group_students (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id  TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  name_key  TEXT NOT NULL,
  UNIQUE (group_id, name_key)
);

-- Pases ya usados: un pase, un registro (spec 007, RF-11, CA-21). Sin datos del alumno (P4).
CREATE TABLE IF NOT EXISTS used_passes (
  session_id TEXT NOT NULL REFERENCES sessions(id),
  pass       TEXT NOT NULL,
  UNIQUE (session_id, pass)
);

-- Copia fija de la lista al abrir una sesión con grupo (spec 007, RF-9, RF-23).
CREATE TABLE IF NOT EXISTS session_roster (
  session_id TEXT NOT NULL REFERENCES sessions(id),
  name       TEXT NOT NULL,
  name_key   TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
"""

# Columnas de la spec 007 que se añaden a tablas que ya existían. CREATE TABLE IF NOT
# EXISTS no las añade a una base ya creada, así que init_schema las añade si faltan.
NEW_COLUMNS = {
    "sessions": {"group_id": "TEXT", "group_name": "TEXT"},
    "checkins": {"kind": "TEXT", "decided": "INTEGER NOT NULL DEFAULT 0"},
}


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
        for table, wanted in NEW_COLUMNS.items():
            existing = {row["name"] for row in conn.execute(f"PRAGMA table_info({table})")}
            for column, definition in wanted.items():
                if column not in existing:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
        conn.commit()


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


def create_session(
    db_path: str | os.PathLike[str],
    title: str,
    opened_at: str,
    group: dict | None = None,
    roster: list[tuple[str, str]] = (),
) -> dict:
    """Crea una sesión con identificador y secreto aleatorios (CA-01).

    Con grupo, guarda también la copia fija de su lista en la misma transacción (spec 007, RF-9).

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param title: título de la sesión.
    :param opened_at: hora de apertura, en ISO 8601 UTC.
    :param group: el grupo (``id`` y ``name``), o ``None`` para una sesión rápida.
    :param roster: copia de la lista: pares ``(nombre, clave)``.
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
                "INSERT INTO sessions (id, title, secret, opened_at, group_id, group_name)"
                " VALUES (?, ?, ?, ?, ?, ?)",
                (
                    session_id, title, secret.hex(), opened_at,
                    group["id"] if group else None, group["name"] if group else None,
                ),
            )
            conn.executemany(
                "INSERT INTO session_roster (session_id, name, name_key) VALUES (?, ?, ?)",
                [(session_id, name, key) for name, key in roster],
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
    :return: una entrada por sesión, con ``id``, ``title``, ``opened_at``, ``closed_at``, ``group_name`` y ``total``.
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
            SELECT s.id, s.title, s.opened_at, s.closed_at, s.group_name, COUNT(c.id) AS total
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
    db_path: str | os.PathLike[str],
    session_id: str,
    name: str,
    key: str,
    checked_at: str,
    kind: str | None = None,
) -> tuple[dict, bool]:
    """Registra al alumno; si ya estaba, devuelve su registro anterior (CA-07).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param name: nombre tal como lo escribió el alumno.
    :param key: clave de comparación del nombre, sin tildes ni mayúsculas.
    :param checked_at: hora del registro, en ISO 8601 UTC.
    :param kind: ``None`` en sesiones rápidas; ``'listed'`` o ``'new'`` con grupo (spec 007).
    :return: el registro (``id``, ``name``, ``checked_at``) y si se ha creado ahora.
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
                INSERT INTO checkins (session_id, name, name_key, checked_at, kind)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (session_id, name_key) DO NOTHING
                """,
                (session_id, name, key, checked_at, kind),
            )
        row = conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
            (session_id, key),
        ).fetchone()
    return dict(row), cursor.rowcount == 1


def list_checkins(db_path: str | os.PathLike[str], session_id: str) -> list[dict]:
    """Lista los registros de una sesión por hora de llegada.

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: registros con ``id``, ``name``, ``name_key``, ``checked_at``, ``kind`` y ``decided``.
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
            "SELECT id, name, name_key, checked_at, kind, decided FROM checkins"
            " WHERE session_id = ? ORDER BY checked_at, id",
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


# ---------- spec 007 · registros con grupo ----------


def get_checkin(db_path: str | os.PathLike[str], session_id: str, checkin_id: int) -> dict | None:
    """Busca un registro de una sesión.

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :return: el registro, o ``None`` si no está en esa sesión.
    :rtype: dict | None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> get_checkin(path, "no-existe", 1) is None
        True
    """
    with _connection(db_path) as conn:
        row = conn.execute(
            "SELECT id, name, name_key, checked_at, kind, decided FROM checkins"
            " WHERE id = ? AND session_id = ?",
            (checkin_id, session_id),
        ).fetchone()
    return dict(row) if row else None


def set_checkin_kind(
    db_path: str | os.PathLike[str], session_id: str, checkin_id: int, kind: str, name: str, key: str
) -> None:
    """Une un nuevo a un alumno del grupo: cambia tipo y nombre y lo da por decidido (CA-17).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :param kind: tipo nuevo del registro.
    :param name: nombre del alumno del grupo.
    :param key: clave de ese nombre.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> set_checkin_kind(path, "no-existe", 1, "listed", "Ana", "ana")
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "UPDATE checkins SET kind = ?, name = ?, name_key = ?, decided = 1"
                " WHERE id = ? AND session_id = ?",
                (kind, name, key, checkin_id, session_id),
            )


def set_checkin_decided(db_path: str | os.PathLike[str], session_id: str, checkin_id: int) -> None:
    """Marca que el profesor ya decidió sobre un nuevo (RF-20).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param checkin_id: identificador del registro.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> set_checkin_decided(path, "no-existe", 1)
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "UPDATE checkins SET decided = 1 WHERE id = ? AND session_id = ?",
                (checkin_id, session_id),
            )


# ---------- spec 007 · copia de la lista de una sesión ----------


def list_session_roster(db_path: str | os.PathLike[str], session_id: str) -> list[dict]:
    """Copia fija de la lista de una sesión, por orden alfabético (RF-9).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :return: entradas con ``name`` y ``name_key``; vacía en sesiones rápidas.
    :rtype: list[dict]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> list_session_roster(path, "no-existe")
        []
    """
    with _connection(db_path) as conn:
        rows = conn.execute(
            "SELECT name, name_key FROM session_roster WHERE session_id = ? ORDER BY name_key",
            (session_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def add_to_session_roster(db_path: str | os.PathLike[str], session_id: str, name: str, key: str) -> None:
    """Añade un alumno a la copia de una sesión; si ya estaba, no hace nada.

    Solo se usa al unir un nuevo con un alumno del grupo (la única excepción de RF-9).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param name: nombre del alumno.
    :param key: clave del nombre.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> s = create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")
        >>> add_to_session_roster(path, s["id"], "Ana", "ana")
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "INSERT OR IGNORE INTO session_roster (session_id, name, name_key) VALUES (?, ?, ?)",
                (session_id, name, key),
            )


# ---------- spec 007 · grupos y sus alumnos ----------

_GROUP_SELECT = """
    SELECT g.id, g.name, g.created_at, g.archived_at, COUNT(st.id) AS student_count
    FROM groups g LEFT JOIN group_students st ON st.group_id = g.id
"""


def create_group(db_path: str | os.PathLike[str], name: str, created_at: str) -> dict:
    """Crea un grupo vacío con un identificador aleatorio (RF-1).

    :param db_path: ruta de la base de datos, con el esquema creado.
    :param name: nombre del grupo.
    :param created_at: hora de creación, en ISO 8601 UTC.
    :return: el grupo creado.
    :rtype: dict

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> create_group(path, "SDD", "2026-10-27T10:00:00.000+00:00")["student_count"]
        0
    """
    group_id = secrets.token_urlsafe(6)
    with _connection(db_path) as conn:
        with conn:
            conn.execute(
                "INSERT INTO groups (id, name, created_at) VALUES (?, ?, ?)",
                (group_id, name, created_at),
            )
    return get_group(db_path, group_id)


def get_group(db_path: str | os.PathLike[str], group_id: str) -> dict | None:
    """Busca un grupo con su número de alumnos.

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: el grupo, o ``None`` si no existe.
    :rtype: dict | None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> get_group(path, "no-existe") is None
        True
    """
    with _connection(db_path) as conn:
        row = conn.execute(_GROUP_SELECT + " WHERE g.id = ? GROUP BY g.id", (group_id,)).fetchone()
    return dict(row) if row else None


def list_groups(db_path: str | os.PathLike[str], archived: bool) -> list[dict]:
    """Lista los grupos activos o los archivados, por nombre (RF-4, RF-5).

    :param db_path: ruta de la base de datos.
    :param archived: ``True`` para los archivados.
    :return: los grupos con su número de alumnos.
    :rtype: list[dict]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> list_groups(path, archived=False)
        []
    """
    condition = "IS NOT NULL" if archived else "IS NULL"
    with _connection(db_path) as conn:
        rows = conn.execute(
            _GROUP_SELECT + f" WHERE g.archived_at {condition} GROUP BY g.id ORDER BY g.name COLLATE NOCASE"
        ).fetchall()
    return [dict(r) for r in rows]


def rename_group(db_path: str | os.PathLike[str], group_id: str, name: str) -> None:
    """Cambia el nombre de un grupo (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param name: nombre nuevo.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> rename_group(path, "no-existe", "Otro")
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute("UPDATE groups SET name = ? WHERE id = ?", (name, group_id))


def set_group_archived(db_path: str | os.PathLike[str], group_id: str, archived_at: str | None) -> None:
    """Archiva un grupo con la hora dada, o lo restaura con ``None`` (RF-5).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param archived_at: hora de archivo en ISO 8601 UTC, o ``None`` para restaurar.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> set_group_archived(path, "no-existe", None)
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute("UPDATE groups SET archived_at = ? WHERE id = ?", (archived_at, group_id))


def delete_group(db_path: str | os.PathLike[str], group_id: str) -> None:
    """Borra un grupo y sus alumnos; sus sesiones conservan nombre y copia (RF-6, RF-23).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> delete_group(path, "no-existe")
    """
    with _connection(db_path) as conn:
        with conn:
            conn.execute("UPDATE sessions SET group_id = NULL WHERE group_id = ?", (group_id,))
            conn.execute("DELETE FROM groups WHERE id = ?", (group_id,))


def count_open_sessions_of_group(db_path: str | os.PathLike[str], group_id: str) -> int:
    """Cuenta las sesiones abiertas de un grupo (RF-6).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: número de sesiones sin cerrar.
    :rtype: int

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> count_open_sessions_of_group(path, "no-existe")
        0
    """
    with _connection(db_path) as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM sessions WHERE group_id = ? AND closed_at IS NULL", (group_id,)
        ).fetchone()
    return row[0]


def list_group_students(db_path: str | os.PathLike[str], group_id: str) -> list[dict]:
    """Alumnos de un grupo, por orden alfabético (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: alumnos con ``id``, ``name`` y ``name_key``.
    :rtype: list[dict]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> list_group_students(path, "no-existe")
        []
    """
    with _connection(db_path) as conn:
        rows = conn.execute(
            "SELECT id, name, name_key FROM group_students WHERE group_id = ? ORDER BY name_key",
            (group_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def add_group_students(
    db_path: str | os.PathLike[str], group_id: str, students: list[tuple[str, str]]
) -> None:
    """Añade alumnos a un grupo, ya revisados (RF-1, RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param students: pares ``(nombre, clave)``.
    :return: nada.
    :rtype: None

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> g = create_group(path, "SDD", "2026-10-27T10:00:00.000+00:00")
        >>> add_group_students(path, g["id"], [("Ana", "ana")])
    """
    with _connection(db_path) as conn:
        with conn:
            conn.executemany(
                "INSERT INTO group_students (group_id, name, name_key) VALUES (?, ?, ?)",
                [(group_id, name, key) for name, key in students],
            )


def rename_group_student(
    db_path: str | os.PathLike[str], group_id: str, student_id: int, name: str, key: str
) -> bool:
    """Cambia el nombre de un alumno del grupo (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param student_id: identificador del alumno.
    :param name: nombre nuevo.
    :param key: clave del nombre nuevo.
    :return: ``True`` si el alumno estaba en ese grupo.
    :rtype: bool

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> rename_group_student(path, "no-existe", 1, "Ana", "ana")
        False
    """
    with _connection(db_path) as conn:
        with conn:
            cursor = conn.execute(
                "UPDATE group_students SET name = ?, name_key = ? WHERE id = ? AND group_id = ?",
                (name, key, student_id, group_id),
            )
    return cursor.rowcount == 1


def remove_group_student(db_path: str | os.PathLike[str], group_id: str, student_id: int) -> bool:
    """Quita a un alumno del grupo (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param student_id: identificador del alumno.
    :return: ``True`` si lo quitó.
    :rtype: bool

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> remove_group_student(path, "no-existe", 1)
        False
    """
    with _connection(db_path) as conn:
        with conn:
            cursor = conn.execute(
                "DELETE FROM group_students WHERE id = ? AND group_id = ?", (student_id, group_id)
            )
    return cursor.rowcount == 1


class _NameTaken(Exception):
    """Interno: deshace la transacción cuando el nombre ya estaba registrado."""


def add_checkin_with_pass(
    db_path: str | os.PathLike[str],
    session_id: str,
    name: str,
    key: str,
    checked_at: str,
    kind: str,
    pass_: str,
) -> tuple[str, dict | None]:
    """Apunta el pase usado y guarda el registro en una sola transacción (spec 007, CA-21).

    La restricción ``UNIQUE (session_id, pass)`` decide si el pase ya se usó, también
    con dos peticiones a la vez. Si el nombre ya estaba registrado, se deshace todo
    y el pase sigue sin usar (RF-11).

    :param db_path: ruta de la base de datos.
    :param session_id: identificador de la sesión.
    :param name: nombre que se registra.
    :param key: clave del nombre.
    :param checked_at: hora del registro, en ISO 8601 UTC.
    :param kind: ``'listed'`` o ``'new'``.
    :param pass_: el pase con el que se registra.
    :return: ``("created", registro)``, ``("pass_used", None)`` o ``("name_taken", None)``.
    :rtype: tuple[str, dict | None]

    Usage::

        >>> import os, tempfile
        >>> path = os.path.join(tempfile.mkdtemp(), "ejemplo.db")
        >>> init_schema(path)
        >>> s = create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")
        >>> add_checkin_with_pass(path, s["id"], "Ana", "ana", "2026-10-27T10:01:00.000+00:00", "new", "p")[0]
        'created'
        >>> add_checkin_with_pass(path, s["id"], "Luis", "luis", "2026-10-27T10:01:00.000+00:00", "new", "p")[0]
        'pass_used'
    """
    with _connection(db_path) as conn:
        try:
            with conn:
                try:
                    conn.execute(
                        "INSERT INTO used_passes (session_id, pass) VALUES (?, ?)", (session_id, pass_)
                    )
                except sqlite3.IntegrityError:
                    return "pass_used", None
                cursor = conn.execute(
                    """
                    INSERT INTO checkins (session_id, name, name_key, checked_at, kind)
                    VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT (session_id, name_key) DO NOTHING
                    """,
                    (session_id, name, key, checked_at, kind),
                )
                if cursor.rowcount != 1:
                    raise _NameTaken
        except _NameTaken:
            return "name_taken", None
        row = conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
            (session_id, key),
        ).fetchone()
    return "created", dict(row)
