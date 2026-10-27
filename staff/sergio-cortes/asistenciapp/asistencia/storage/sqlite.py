"""Acceso al archivo SQLite de la asistencia.

Cada función abre la conexión, hace su trabajo y la cierra.
El DDL vive en ``asistencia.infra.sqlite.schema``; ``connect`` en ``connection``.

Usage::

  init_schema(path)
  token = get_or_create_teacher_token(path)
"""

import secrets
import sqlite3
from os import PathLike

from asistencia.infra.sqlite.connection import connect, init_schema as _init_schema

PathArg = str | PathLike[str]


def _row_to_session(row) -> dict | None:
    if row is None:
        return None
    loaded = dict(row)
    loaded["secret"] = bytes.fromhex(loaded["secret"])
    return loaded


def init_schema(path: PathArg) -> None:
    """Crea las tablas si todavía no existen.

    :param path: ruta del archivo.
    :return: None.
    :rtype: None

    Usage::

      init_schema(path)
    """
    conn = connect(path)
    try:
        _init_schema(conn)
        conn.commit()
    finally:
        conn.close()


def get_or_create_teacher_token(path: PathArg) -> str:
    """Devuelve el token del profesor y lo crea la primera vez.

    :param path: ruta del archivo.
    :return: token del profesor.
    :rtype: str

    Usage::

      token = get_or_create_teacher_token(path)
    """
    conn = connect(path)
    try:
        row = conn.execute("SELECT value FROM config WHERE key = 'teacher_token'").fetchone()
        if row:
            return row["value"]
        token = secrets.token_urlsafe(24)
        with conn:
            conn.execute(
                "INSERT INTO config (key, value) VALUES ('teacher_token', ?)",
                (token,),
            )
        return token
    finally:
        conn.close()


def create_session(path: PathArg, title: str, opened_at: str) -> dict:
    """Guarda una clase nueva y la devuelve.

    :param path: ruta del archivo.
    :param title: título de la clase.
    :param opened_at: hora de apertura, en ISO UTC.
    :return: la clase guardada, con el secreto en bytes.
    :rtype: dict

    Usage::

      loaded = create_session(path, title, opened_at)
    """
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    conn = connect(path)
    try:
        with conn:
            conn.execute(
                "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
                (session_id, title, secret.hex(), opened_at),
            )
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        return _row_to_session(row)
    finally:
        conn.close()


def get_session(path: PathArg, session_id: str) -> dict | None:
    """Carga una clase por su id.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :return: la clase, o None si no está. El secreto viene en bytes.
    :rtype: dict | None

    Usage::

      loaded = get_session(path, session_id)
    """
    conn = connect(path)
    try:
        row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        return _row_to_session(row)
    finally:
        conn.close()


def list_sessions(path: PathArg) -> list[dict]:
    """Lista las clases, las más recientes primero, con el total de registros.

    :param path: ruta del archivo.
    :return: clases, sin el secreto.
    :rtype: list[dict]

    Usage::

      rows = list_sessions(path)
    """
    conn = connect(path)
    try:
        rows = conn.execute(
            """
            SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
            FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
            GROUP BY s.id
            ORDER BY s.opened_at DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def close_session(path: PathArg, session_id: str, closed_at: str) -> None:
    """Cierra una clase que todavía estaba abierta.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param closed_at: hora de cierre, en ISO UTC.
    :return: None.
    :rtype: None

    Usage::

      close_session(path, session_id, closed_at)
    """
    conn = connect(path)
    try:
        with conn:
            conn.execute(
                "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
                (closed_at, session_id),
            )
    finally:
        conn.close()


def add_checkin(
    path: PathArg, session_id: str, name: str, key: str, checked_at: str
) -> tuple[dict, bool]:
    """Guarda un registro. Si esa clave ya estaba, no crea otro.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param name: nombre tal como se guarda.
    :param key: clave para detectar duplicados.
    :param checked_at: hora del registro, en ISO UTC.
    :return: el registro y True si se acaba de crear.
    :rtype: tuple[dict, bool]

    Usage::

      row, created = add_checkin(path, session_id, name, key, checked_at)
    """
    conn = connect(path)
    try:
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
    finally:
        conn.close()


def list_checkins(path: PathArg, session_id: str) -> list[dict]:
    """Lista los registros de una clase, por orden de llegada.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :return: registros con id, nombre y hora.
    :rtype: list[dict]

    Usage::

      rows = list_checkins(path, session_id)
    """
    conn = connect(path)
    try:
        rows = conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
            (session_id,),
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def remove_checkin(path: PathArg, session_id: str, checkin_id: int) -> bool:
    """Borra un registro si pertenece a esa clase.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param checkin_id: id del registro.
    :return: True si borró algo.
    :rtype: bool

    Usage::

      removed = remove_checkin(path, session_id, checkin_id)
    """
    conn = connect(path)
    try:
        with conn:
            cursor = conn.execute(
                "DELETE FROM checkins WHERE id = ? AND session_id = ?",
                (checkin_id, session_id),
            )
        return cursor.rowcount == 1
    finally:
        conn.close()


def record_invalid_code_attempt(path: PathArg, ip: str, attempted_at_iso: str) -> None:
    """Anota un intento con código inválido desde esa IP (spec 006).

    :param path: ruta del archivo.
    :param ip: IP del intento.
    :param attempted_at_iso: hora en ISO UTC.
    :return: None.
    :rtype: None

    Usage::

      record_invalid_code_attempt(path, ip, now_iso)
    """
    conn = connect(path)
    try:
        with conn:
            conn.execute(
                "INSERT INTO invalid_code_attempts (ip, attempted_at) VALUES (?, ?)",
                (ip, attempted_at_iso),
            )
    finally:
        conn.close()


def count_invalid_code_attempts(path: PathArg, ip: str, since_iso: str) -> int:
    """Cuenta intentos inválidos de esa IP desde una hora ISO inclusive.

    :param path: ruta del archivo.
    :param ip: IP del intento.
    :param since_iso: límite inferior en ISO UTC.
    :return: cuántos intentos hay.
    :rtype: int

    Usage::

      total = count_invalid_code_attempts(path, ip, since_iso)
    """
    conn = connect(path)
    try:
        row = conn.execute(
            """
            SELECT COUNT(*) AS n FROM invalid_code_attempts
            WHERE ip = ? AND attempted_at >= ?
            """,
            (ip, since_iso),
        ).fetchone()
        return int(row["n"])
    finally:
        conn.close()


def purge_invalid_code_attempts_older_than(path: PathArg, cutoff_iso: str) -> None:
    """Borra intentos inválidos anteriores al corte. No toca la lista de bloqueo.

    :param path: ruta del archivo.
    :param cutoff_iso: se borran filas con ``attempted_at`` estrictamente menor.
    :return: None.
    :rtype: None

    Usage::

      purge_invalid_code_attempts_older_than(path, cutoff_iso)
    """
    conn = connect(path)
    try:
        with conn:
            conn.execute(
                "DELETE FROM invalid_code_attempts WHERE attempted_at < ?",
                (cutoff_iso,),
            )
    finally:
        conn.close()


def is_ip_blocked(path: PathArg, ip: str) -> bool:
    """Dice si esa IP está en la lista de bloqueo.

    :param path: ruta del archivo.
    :param ip: IP del intento.
    :return: True si está bloqueada.
    :rtype: bool

    Usage::

      if is_ip_blocked(path, ip):
          ...
    """
    conn = connect(path)
    try:
        row = conn.execute("SELECT 1 FROM blocked_ips WHERE ip = ?", (ip,)).fetchone()
        return row is not None
    finally:
        conn.close()


def block_ip(path: PathArg, ip: str, blocked_at: str) -> None:
    """Deja esa IP en la lista de bloqueo.

    :param path: ruta del archivo.
    :param ip: IP del intento.
    :param blocked_at: hora del bloqueo, en ISO UTC.
    :return: None.
    :rtype: None

    Usage::

      block_ip(path, ip, blocked_at)
    """
    conn = connect(path)
    try:
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO blocked_ips (ip, blocked_at) VALUES (?, ?)",
                (ip, blocked_at),
            )
    finally:
        conn.close()


def list_blocked_ips(path: PathArg) -> list[dict]:
    """Lista las IP bloqueadas, las más recientes primero.

    :param path: ruta del archivo.
    :return: filas con ``ip`` y ``blocked_at``.
    :rtype: list[dict]

    Usage::

      rows = list_blocked_ips(path)
    """
    conn = connect(path)
    try:
        rows = conn.execute(
            "SELECT ip, blocked_at FROM blocked_ips ORDER BY blocked_at DESC"
        ).fetchall()
        return [{"ip": r["ip"], "blocked_at": r["blocked_at"]} for r in rows]
    finally:
        conn.close()


def unblock_ip(path: PathArg, ip: str) -> bool:
    """Quita una IP de la lista de bloqueo.

    :param path: ruta del archivo.
    :param ip: IP a desbloquear.
    :return: True si estaba bloqueada.
    :rtype: bool

    Usage::

      ok = unblock_ip(path, ip)
    """
    conn = connect(path)
    try:
        with conn:
            cur = conn.execute("DELETE FROM blocked_ips WHERE ip = ?", (ip,))
            return cur.rowcount > 0
    finally:
        conn.close()


def unblock_all_ips(path: PathArg) -> int:
    """Vacía la lista de bloqueo.

    :param path: ruta del archivo.
    :return: cuántas filas se borraron.
    :rtype: int

    Usage::

      n = unblock_all_ips(path)
    """
    conn = connect(path)
    try:
        with conn:
            cur = conn.execute("DELETE FROM blocked_ips")
            return cur.rowcount
    finally:
        conn.close()
