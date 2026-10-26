"""Tests del almacenamiento de contadores y lista negra por IP · spec 006 · CA-08, CA-09, CA-15."""

import sqlite3

import pytest

from asistencia.storage import sqlite as storage

NOW = 1_800_000_000.0


@pytest.fixture
def db(tmp_path):
    path = tmp_path / "ips.db"
    storage.init_schema(path)
    return path


def test_first_attempt_counts_once(db):
    assert storage.record_ip_attempt(db, "1.1.1.1", NOW) == (1, 1)


def test_counts_by_window(db):
    storage.record_ip_attempt(db, "1.1.1.1", NOW - 30)
    storage.record_ip_attempt(db, "1.1.1.1", NOW)
    assert storage.record_ip_attempt(db, "1.1.1.1", NOW + 0.5) == (2, 3)


def test_attempt_a_second_old_is_outside_the_second_window(db):
    storage.record_ip_attempt(db, "1.1.1.1", NOW)
    assert storage.record_ip_attempt(db, "1.1.1.1", NOW + 1) == (1, 2)


def test_old_attempts_are_deleted_only_for_that_ip(db):
    storage.record_ip_attempt(db, "1.1.1.1", NOW)
    storage.record_ip_attempt(db, "2.2.2.2", NOW)
    assert storage.record_ip_attempt(db, "1.1.1.1", NOW + 60) == (1, 1)
    with sqlite3.connect(db) as conn:
        rows = conn.execute("SELECT ip, attempted_at FROM ip_attempts ORDER BY ip, attempted_at").fetchall()
    assert rows == [("1.1.1.1", NOW + 60), ("2.2.2.2", NOW)]


def test_ips_are_counted_separately(db):
    storage.record_ip_attempt(db, "1.1.1.1", NOW)
    assert storage.record_ip_attempt(db, "2.2.2.2", NOW) == (1, 1)


def test_block_ip(db):
    assert storage.is_ip_blocked(db, "1.1.1.1") is False
    storage.block_ip(db, "1.1.1.1", "2026-10-26T10:00:00.000+00:00")
    assert storage.is_ip_blocked(db, "1.1.1.1") is True
    assert storage.is_ip_blocked(db, "2.2.2.2") is False


def test_blocking_twice_does_not_fail(db):  # CA-08
    storage.block_ip(db, "1.1.1.1", "2026-10-26T10:00:00.000+00:00")
    storage.block_ip(db, "1.1.1.1", "2026-10-26T11:00:00.000+00:00")
    assert storage.is_ip_blocked(db, "1.1.1.1") is True


def test_block_survives_reopening_the_database(db):  # CA-08
    storage.block_ip(db, "1.1.1.1", "2026-10-26T10:00:00.000+00:00")
    storage.init_schema(db)  # lo que hace prepare al arrancar
    assert storage.is_ip_blocked(db, "1.1.1.1") is True


def test_deleting_the_ip_from_both_tables_frees_it(db):  # CA-09
    storage.block_ip(db, "1.1.1.1", "2026-10-26T10:00:00.000+00:00")
    storage.record_ip_attempt(db, "1.1.1.1", NOW)
    with sqlite3.connect(db) as conn:
        conn.execute("DELETE FROM blocked_ips WHERE ip = '1.1.1.1'")
        conn.execute("DELETE FROM ip_attempts WHERE ip = '1.1.1.1'")
    assert storage.is_ip_blocked(db, "1.1.1.1") is False
    assert storage.record_ip_attempt(db, "1.1.1.1", NOW + 1) == (1, 1)


@pytest.mark.parametrize("table", ["ip_attempts", "blocked_ips"])
def test_ip_tables_are_not_linked_to_names(db, table):  # CA-15
    with sqlite3.connect(db) as conn:
        assert conn.execute(f"PRAGMA foreign_key_list({table})").fetchall() == []
        columns = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
    assert columns.isdisjoint({"session_id", "name", "name_key", "checkin_id"})


def test_attendance_tables_have_no_ip_column(db):  # CA-15
    with sqlite3.connect(db) as conn:
        for table in ("sessions", "checkins"):
            columns = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
            assert "ip" not in columns
