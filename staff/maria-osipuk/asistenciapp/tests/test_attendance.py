"""Acciones de asistencia sin Flask · CA-05, CA-09, CA-10, CA-19, CA-30 a CA-32."""

import sqlite3
from datetime import datetime, timezone

import pytest

from asistencia.domain.codes import code_for, is_valid_code
from asistencia.domain.session import InvalidCode, SessionClosed, SessionNotFound
from asistencia.usecases.attendance import (
    CheckinNotFound,
    check_in,
    close_class,
    export_csv,
    open_class,
    prepare,
    public_info,
    remove_checkin,
    teacher_detail,
)


SECRET = b"secreto-fijo-de-la-prueba"
NOT_A_CODE = "no-es-un-codigo"


def opened_at_of(clock: "Clock") -> str:
    """Mismo formato que la acción: ISO UTC con milisegundos."""
    return datetime.fromtimestamp(clock(), timezone.utc).isoformat(timespec="milliseconds")


def moment_whose_code_expires() -> tuple[float, str]:
    """Un instante en el que el código de SECRET ya no vale 60 s después."""
    instant = 1_800_000_000.0
    for _ in range(200):
        current = code_for(SECRET, instant)
        if not is_valid_code(SECRET, current, instant + 60):
            return instant, current
        instant += 30
    raise AssertionError("No hubo una ventana distinguible para este secreto.")


def store_secret(db_path, session_id: str) -> None:
    with sqlite3.connect(db_path) as connection:
        connection.execute(
            "UPDATE sessions SET secret = ? WHERE id = ?",
            (SECRET.hex(), session_id),
        )


class Clock:
    """Reloj fijo: la caducidad se prueba avanzándolo, sin esperar de verdad."""

    def __init__(self) -> None:
        self.t = 1_800_000_000.0

    def __call__(self) -> float:
        return self.t

    def advance(self, seconds: float) -> None:
        self.t += seconds


def test_check_in_duplicate_close_remove_and_export(tmp_path):
    db_path = tmp_path / "asistencia.db"
    clock = Clock()
    token = prepare(db_path)
    assert isinstance(token, str) and token

    expected_opened_at = opened_at_of(clock)
    opened = open_class(db_path, "Clase de prueba", clock)
    assert public_info(db_path, opened["id"]) == {"title": "Clase de prueba", "open": True}

    code = teacher_detail(db_path, opened["id"], clock)["code"]
    first, created = check_in(db_path, opened["id"], "Ana García", code, clock)
    assert created is True
    assert first["name"] == "Ana García"

    again, created_again = check_in(db_path, opened["id"], "  ana   GARCIA ", code, clock)
    assert created_again is False
    assert again == first
    assert teacher_detail(db_path, opened["id"], clock)["total"] == 1

    with pytest.raises(InvalidCode):
        check_in(db_path, opened["id"], "Luis", NOT_A_CODE, clock)
    with pytest.raises(SessionNotFound):
        check_in(db_path, "no-existe", "Luis", code, clock)

    close_class(db_path, opened["id"], clock)
    assert public_info(db_path, opened["id"])["open"] is False
    assert "code" not in teacher_detail(db_path, opened["id"], clock)
    with pytest.raises(SessionClosed):
        check_in(db_path, opened["id"], "Luis", code, clock)

    checkin_id = teacher_detail(db_path, opened["id"], clock)["checkins"][0]["id"]
    remove_checkin(db_path, opened["id"], checkin_id)
    assert teacher_detail(db_path, opened["id"], clock)["checkins"] == []
    with pytest.raises(CheckinNotFound):
        remove_checkin(db_path, opened["id"], checkin_id)

    text, opened_at = export_csv(db_path, opened["id"])
    assert opened_at == expected_opened_at
    assert "Nombre;Hora" in text
    assert "Ana" not in text


def test_prepare_does_not_wipe_an_existing_database(tmp_path):
    db_path = tmp_path / "asistencia.db"
    clock = Clock()
    prepare(db_path)
    opened = open_class(db_path, "Conservada", clock)
    code = teacher_detail(db_path, opened["id"], clock)["code"]
    check_in(db_path, opened["id"], "Ana", code, clock)

    prepare(db_path)

    assert public_info(db_path, opened["id"])["title"] == "Conservada"
    assert teacher_detail(db_path, opened["id"], clock)["total"] == 1


def test_expired_code_is_rejected_without_waiting(tmp_path):
    db_path = tmp_path / "asistencia.db"
    instant, code = moment_whose_code_expires()
    clock = Clock()
    clock.t = instant
    prepare(db_path)
    opened = open_class(db_path, "Caduca", clock)
    store_secret(db_path, opened["id"])
    assert teacher_detail(db_path, opened["id"], clock)["code"] == code
    clock.advance(60)
    with pytest.raises(InvalidCode):
        check_in(db_path, opened["id"], "Ana", code, clock)
