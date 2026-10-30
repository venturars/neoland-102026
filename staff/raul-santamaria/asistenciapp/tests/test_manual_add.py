"""Acción add_checkin_manual. CA-01, CA-02, CA-03, CA-05, CA-09."""

import pytest

from asistencia.domain.names import MAX_LENGTH
from asistencia.domain.session import SessionNotFound
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


def test_add_manual_open_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)

    row, created = attendance.add_checkin_manual(path, loaded["id"], "Ana García", clock)

    assert created is True
    assert row["name"] == "Ana García"
    assert "checked_at" in row
    assert len(storage.list_checkins(path, loaded["id"])) == 1


def test_add_manual_closed_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)
    attendance.close_session(path, loaded["id"], clock)

    row, created = attendance.add_checkin_manual(path, loaded["id"], "Luis", clock)

    assert created is True
    assert row["name"] == "Luis"
    assert len(storage.list_checkins(path, loaded["id"])) == 1


def test_add_manual_rejects_empty_name(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)

    with pytest.raises(ValueError) as exc:
        attendance.add_checkin_manual(path, loaded["id"], "   ", clock)

    assert "nombre" in str(exc.value).lower()
    assert storage.list_checkins(path, loaded["id"]) == []


def test_add_manual_rejects_long_name(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)

    with pytest.raises(ValueError) as exc:
        attendance.add_checkin_manual(
            path, loaded["id"], "a" * (MAX_LENGTH + 1), clock
        )

    assert str(MAX_LENGTH) in str(exc.value)
    assert storage.list_checkins(path, loaded["id"]) == []


def test_add_manual_duplicate_name_key(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    loaded = _open(path, clock)

    first, created1 = attendance.add_checkin_manual(path, loaded["id"], "Ana García", clock)
    second, created2 = attendance.add_checkin_manual(path, loaded["id"], "ana garcia", clock)

    assert created1 is True
    assert created2 is False
    assert first["name"] == "Ana García"
    assert second["name"] == "Ana García"
    assert len(storage.list_checkins(path, loaded["id"])) == 1


def test_add_manual_missing_session(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    storage.init_schema(path)

    with pytest.raises(SessionNotFound):
        attendance.add_checkin_manual(path, "no-existe", "Ana", clock)
