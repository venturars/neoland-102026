"""SQLite: bloqueos e intentos inválidos por IP (spec 006)."""

import sqlite3


class SqliteRateLimitRepository:
    def __init__(self, conn: sqlite3.Connection):
        self._conn = conn

    def is_blocked(self, ip: str) -> bool:
        row = self._conn.execute(
            "SELECT 1 FROM blocked_ips WHERE ip = ?", (ip,)
        ).fetchone()
        return row is not None

    def block_ip(self, ip: str, blocked_at_iso: str) -> None:
        with self._conn:
            self._conn.execute(
                "INSERT OR REPLACE INTO blocked_ips (ip, blocked_at) VALUES (?, ?)",
                (ip, blocked_at_iso),
            )

    def record_invalid_attempt(self, ip: str, attempted_at_iso: str) -> None:
        with self._conn:
            self._conn.execute(
                "INSERT INTO invalid_code_attempts (ip, attempted_at) VALUES (?, ?)",
                (ip, attempted_at_iso),
            )

    def count_invalid_attempts(self, ip: str, since_iso: str) -> int:
        row = self._conn.execute(
            "SELECT COUNT(*) AS n FROM invalid_code_attempts WHERE ip = ? AND attempted_at >= ?",
            (ip, since_iso),
        ).fetchone()
        return int(row["n"])

    def purge_attempts_older_than(self, cutoff_iso: str) -> None:
        with self._conn:
            self._conn.execute(
                "DELETE FROM invalid_code_attempts WHERE attempted_at < ?",
                (cutoff_iso,),
            )

    def list_blocked(self) -> list[dict]:
        rows = self._conn.execute(
            "SELECT ip, blocked_at FROM blocked_ips ORDER BY blocked_at DESC"
        ).fetchall()
        return [{"ip": r["ip"], "blocked_at": r["blocked_at"]} for r in rows]

    def unblock_ip(self, ip: str) -> bool:
        with self._conn:
            cur = self._conn.execute("DELETE FROM blocked_ips WHERE ip = ?", (ip,))
            return cur.rowcount > 0

    def unblock_all(self) -> int:
        with self._conn:
            cur = self._conn.execute("DELETE FROM blocked_ips")
            return cur.rowcount
