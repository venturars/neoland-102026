"""Lista de bloqueo y recuento de intentos en el archivo. CA-04, CA-06, CA-09."""

import sqlite3

from asistencia.storage import sqlite as storage


def test_an_attempt_counts_inside_the_last_second_and_minute(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    storage.add_registration_attempt(path, "203.0.113.10", 1_000.0)

    assert storage.count_registration_attempts(path, "203.0.113.10", 1_000.0 - 1) == 1
    assert storage.count_registration_attempts(path, "203.0.113.10", 1_000.0 - 60) == 1
    assert storage.count_registration_attempts(path, "203.0.113.10", 1_000.0) == 1


def test_an_attempt_older_than_a_minute_is_pruned(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    now = 1_000.0
    storage.add_registration_attempt(path, "203.0.113.10", now - 61)
    storage.add_registration_attempt(path, "203.0.113.10", now - 60)

    storage.prune_registration_attempts(path, now - 60)

    assert storage.count_registration_attempts(path, "203.0.113.10", 0) == 1
    assert storage.count_registration_attempts(path, "203.0.113.10", now - 60) == 1


def test_a_blocked_ip_stays_blocked_after_reopening_the_file(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    storage.block_ip(path, "203.0.113.10", "2026-10-26T09:00:00.000+00:00")

    assert storage.is_ip_blocked(path, "203.0.113.10") is True
    assert storage.is_ip_blocked(path, "203.0.113.11") is False


def test_checkins_have_no_ip_column(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    conn = sqlite3.connect(path)
    try:
        columns = [row[1] for row in conn.execute("PRAGMA table_info(checkins)")]
    finally:
        conn.close()
    assert "ip" not in columns
