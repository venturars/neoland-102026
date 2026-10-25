"""Tests de attendance/domain/participants.py · spec 004 CA-08, CA-18; plan §2.2, §2.8."""

import dataclasses

import pytest

from attendance.domain.names import MAX_LENGTH, clean_name
from attendance.domain.participants import GUEST_NAME, MeetingAttendance, Who, names_from_platform


def test_who_has_two_options():  # CA-18
    assert [w.value for w in Who] == ["now", "everyone"]


def test_meeting_attendance_is_immutable():
    attendance = MeetingAttendance(names=("Ana",), started_at="2026-10-23T06:56:28Z", ended=False)
    with pytest.raises(dataclasses.FrozenInstanceError):
        attendance.ended = True  # type: ignore[misc]


def test_names_keep_their_order_and_lose_outer_spaces():
    assert names_from_platform(["  Ana García ", "Luis", "Анна Иванова", "李雷"]) == [
        "Ana García",
        "Luis",
        "Анна Иванова",
        "李雷",
    ]


@pytest.mark.parametrize("empty", ["", "   ", "\t"])
def test_a_nameless_participant_is_a_guest(empty):  # CA-08
    assert names_from_platform([empty]) == [GUEST_NAME]
    assert GUEST_NAME == "Invitado sin nombre"


def test_several_guests_are_numbered():  # CA-08
    assert names_from_platform(["", "Ana", "  ", ""]) == [
        "Invitado sin nombre",
        "Ana",
        "Invitado sin nombre 2",
        "Invitado sin nombre 3",
    ]


def test_long_names_are_cut_not_rejected():  # CA-08: el alumno no puede corregirlo
    assert names_from_platform(["a" * 80]) == ["a" * MAX_LENGTH]
    assert names_from_platform(["b" * MAX_LENGTH]) == ["b" * MAX_LENGTH]
    # Si el corte deja un espacio al final, se quita.
    assert names_from_platform(["c" * (MAX_LENGTH - 1) + " resto"]) == ["c" * (MAX_LENGTH - 1)]


def test_every_result_is_a_valid_list_name():  # se guardan con las reglas de la spec 001
    for name in names_from_platform(["", " x ", "y" * 200, "Zoë"]):
        assert clean_name(name) == name


def test_no_participants():  # CA-10
    assert names_from_platform([]) == []
