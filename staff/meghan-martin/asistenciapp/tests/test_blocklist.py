"""Lista de bloqueo y recuento de intentos en el fichero. CA-04, CA-06, CA-09."""

# These tests use a throwaway attendance file. Nothing here touches a real class.
# tmp_path is an empty folder that disappears after the test.

import sqlite3

from asistencia.storage import sqlite as storage


def test_an_attempt_counts_inside_the_last_second_and_minute(tmp_path):
    # One try at second 1000 must count in the last second and in the last minute.
    path = tmp_path / "asistencia.db"  # a temporary attendance file
    storage.prepare(path)  # create the empty lists inside that file
    storage.add_checkin_attempt(path, "203.0.113.10", 1_000.0)

    # Count from 1 second ago, from 60 seconds ago, and from the exact moment.
    # All three should find that one try.
    assert storage.count_checkin_attempts(path, "203.0.113.10", 1_000.0 - 1) == 1
    assert storage.count_checkin_attempts(path, "203.0.113.10", 1_000.0 - 60) == 1
    assert storage.count_checkin_attempts(path, "203.0.113.10", 1_000.0) == 1


def test_an_attempt_older_than_a_minute_is_dropped(tmp_path):
    # A try from 61 seconds ago is forgotten. A try from exactly 60 seconds ago stays.
    path = tmp_path / "asistencia.db"
    storage.prepare(path)
    now = 1_000.0
    storage.add_checkin_attempt(path, "203.0.113.10", now - 61)  # too old
    storage.add_checkin_attempt(path, "203.0.113.10", now - 60)  # still kept

    storage.prune_checkin_attempts(path, now - 60)  # delete anything older than 60 seconds

    # Only one try remains, and it is the one from exactly 60 seconds ago.
    assert storage.count_checkin_attempts(path, "203.0.113.10", 0) == 1
    assert storage.count_checkin_attempts(path, "203.0.113.10", now - 60) == 1


def test_a_blocked_computer_stays_blocked_after_reopening_the_file(tmp_path):
    # The block is written in the file, so opening the file again still finds it.
    # A different computer is not blocked.
    path = tmp_path / "asistencia.db"
    storage.prepare(path)
    storage.block_computer(path, "203.0.113.10", "2026-10-25T09:00:00.000+00:00")

    assert storage.is_computer_blocked(path, "203.0.113.10") is True
    assert storage.is_computer_blocked(path, "203.0.113.11") is False


def test_checkins_have_no_address_column(tmp_path):
    # The list of names and times must not store the computer address.
    path = tmp_path / "asistencia.db"
    storage.prepare(path)
    conn = sqlite3.connect(path)
    try:
        # Read the column names of the attendance list.
        columns = [row[1] for row in conn.execute("PRAGMA table_info(checkins)")]
    finally:
        conn.close()
    assert "address" not in columns
    assert "ip" not in columns
