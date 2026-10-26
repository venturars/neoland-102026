"""Implementación SQLite de `AttendanceRepository`."""

import secrets
import sqlite3


def _session_row(row) -> dict | None:
    if row is None:
        return None
    session = dict(row)
    session["secret"] = bytes.fromhex(session["secret"])
    return session


class SqliteAttendanceRepository:
    def __init__(self, conn: sqlite3.Connection):
        self._conn = conn

    def get_or_create_teacher_token(self) -> str:
        row = self._conn.execute(
            "SELECT value FROM config WHERE key = 'teacher_token'"
        ).fetchone()
        if row:
            return row["value"]
        token = secrets.token_urlsafe(24)
        with self._conn:
            self._conn.execute(
                "INSERT INTO config (key, value) VALUES ('teacher_token', ?)", (token,)
            )
        return token

    def create_session(self, title: str, opened_at: str) -> dict:
        session_id = secrets.token_urlsafe(6)
        secret = secrets.token_bytes(16)
        with self._conn:
            self._conn.execute(
                "INSERT INTO sessions (id, title, secret, opened_at) VALUES (?, ?, ?, ?)",
                (session_id, title, secret.hex(), opened_at),
            )
        return self.get_session(session_id)

    def get_session(self, session_id: str) -> dict | None:
        row = self._conn.execute(
            "SELECT * FROM sessions WHERE id = ?", (session_id,)
        ).fetchone()
        return _session_row(row)

    def list_sessions(self) -> list[dict]:
        rows = self._conn.execute(
            """
            SELECT s.id, s.title, s.opened_at, s.closed_at, COUNT(c.id) AS total
            FROM sessions s LEFT JOIN checkins c ON c.session_id = s.id
            GROUP BY s.id
            ORDER BY s.opened_at DESC
            """
        ).fetchall()
        return [dict(r) for r in rows]

    def close_session(self, session_id: str, closed_at: str) -> None:
        with self._conn:
            self._conn.execute(
                "UPDATE sessions SET closed_at = ? WHERE id = ? AND closed_at IS NULL",
                (closed_at, session_id),
            )

    def add_checkin(
        self, session_id: str, name: str, key: str, checked_at: str
    ) -> tuple[dict, bool]:
        with self._conn:
            cursor = self._conn.execute(
                """
                INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)
                ON CONFLICT (session_id, name_key) DO NOTHING
                """,
                (session_id, name, key, checked_at),
            )
        row = self._conn.execute(
            "SELECT name, checked_at FROM checkins WHERE session_id = ? AND name_key = ?",
            (session_id, key),
        ).fetchone()
        return dict(row), cursor.rowcount == 1

    def list_checkins(self, session_id: str) -> list[dict]:
        rows = self._conn.execute(
            "SELECT id, name, checked_at FROM checkins WHERE session_id = ? ORDER BY checked_at, id",
            (session_id,),
        ).fetchall()
        return [dict(r) for r in rows]

    def remove_checkin(self, session_id: str, checkin_id: int) -> bool:
        with self._conn:
            cursor = self._conn.execute(
                "DELETE FROM checkins WHERE id = ? AND session_id = ?",
                (checkin_id, session_id),
            )
        return cursor.rowcount == 1
