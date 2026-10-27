"""Almacén: Discord activado en la sesión. CA-01, CA-02, CA-10."""

import sqlite3

from asistencia.storage import sqlite as storage


def test_new_session_has_discord_disabled(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    loaded = storage.create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")

    assert loaded["discord_enabled"] in (0, False)


def test_enable_discord_on_open_session(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    loaded = storage.create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")

    storage.enable_discord(path, loaded["id"])
    again = storage.get_session(path, loaded["id"])

    assert again["discord_enabled"] in (1, True)


def test_open_discord_session_is_the_enabled_open_one(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    first = storage.create_session(path, "Una", "2026-10-27T09:00:00.000+00:00")
    second = storage.create_session(path, "Dos", "2026-10-27T10:00:00.000+00:00")
    storage.enable_discord(path, second["id"])

    found = storage.get_open_discord_session(path)

    assert found is not None
    assert found["id"] == second["id"]
    assert found["id"] != first["id"]


def test_no_open_discord_session_when_none_enabled(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    storage.create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")

    assert storage.get_open_discord_session(path) is None


def test_closed_session_is_not_an_open_discord_session(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    loaded = storage.create_session(path, "Clase", "2026-10-27T10:00:00.000+00:00")
    storage.enable_discord(path, loaded["id"])
    storage.close_session(path, loaded["id"], "2026-10-27T11:00:00.000+00:00")

    assert storage.get_open_discord_session(path) is None


def test_schema_migration_adds_discord_enabled_to_old_file(tmp_path):
    path = tmp_path / "asistencia.db"
    conn = sqlite3.connect(path)
    conn.executescript(
        """
        CREATE TABLE sessions (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          secret TEXT NOT NULL,
          opened_at TEXT NOT NULL,
          closed_at TEXT
        );
        """
    )
    conn.commit()
    conn.close()

    storage.init_schema(path)
    conn = sqlite3.connect(path)
    cols = {row[1] for row in conn.execute("PRAGMA table_info(sessions)")}
    conn.close()

    assert "discord_enabled" in cols


def test_checkins_have_no_discord_columns(tmp_path):
    path = tmp_path / "asistencia.db"
    storage.init_schema(path)
    conn = sqlite3.connect(path)
    cols = {row[1] for row in conn.execute("PRAGMA table_info(checkins)")}
    conn.close()

    assert "discord_id" not in cols
    assert "discord_user" not in cols
    assert cols == {"id", "session_id", "name", "name_key", "checked_at"}
