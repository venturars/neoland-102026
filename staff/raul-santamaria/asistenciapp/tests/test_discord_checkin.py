"""Acciones enable_discord y check_in_discord. CA-02 a CA-05."""

import pytest

from asistencia.domain.codes import code_for
from asistencia.domain.session import InvalidCode, SessionClosed
from asistencia.storage import sqlite as storage
from asistencia.usecases import attendance


class Clock:
    def __init__(self, t: float = 1_800_000_000.0):
        self.t = t

    def __call__(self) -> float:
        return self.t


def _open(path, clock, title="Clase"):
    storage.init_schema(path)
    return attendance.create_session(path, title, clock)


def test_enable_discord_marks_open_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)

    attendance.enable_discord(path, loaded["id"], clock)
    again = storage.get_session(path, loaded["id"])

    assert again["discord_enabled"] == 1


def test_enable_discord_rejects_closed_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)
    attendance.close_session(path, loaded["id"], clock)

    with pytest.raises(SessionClosed):
        attendance.enable_discord(path, loaded["id"], clock)


def test_check_in_discord_without_enabled_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    _open(path, clock)

    with pytest.raises(attendance.DiscordNotEnabled) as exc:
        attendance.check_in_discord(path, "Ana#0001", "1234", clock)

    assert "discord" in str(exc.value).lower() or "asistencia" in str(exc.value).lower()


def test_check_in_discord_with_valid_code(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)
    attendance.enable_discord(path, loaded["id"], clock)
    code = code_for(loaded["secret"], clock())

    row, created = attendance.check_in_discord(path, "Ana Discord", code, clock)

    assert created is True
    assert row["name"] == "Ana Discord"
    assert "checked_at" in row


def test_check_in_discord_rejects_bad_code(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)
    attendance.enable_discord(path, loaded["id"], clock)
    wrong = "0000" if code_for(loaded["secret"], clock()) != "0000" else "1111"

    with pytest.raises(InvalidCode):
        attendance.check_in_discord(path, "Ana Discord", wrong, clock)


def test_check_in_discord_same_name_does_not_duplicate(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)
    attendance.enable_discord(path, loaded["id"], clock)
    code = code_for(loaded["secret"], clock())

    first, created1 = attendance.check_in_discord(path, "Ana Discord", code, clock)
    second, created2 = attendance.check_in_discord(path, "Ana Discord", code, clock)

    assert created1 is True
    assert created2 is False
    assert first["name"] == second["name"]
    assert len(storage.list_checkins(path, loaded["id"])) == 1
