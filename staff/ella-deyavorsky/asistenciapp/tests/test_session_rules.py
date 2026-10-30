"""Tests de las reglas de grupo en asistencia/domain/session.py · spec 007 · CA-09, CA-19."""

import pytest

from asistencia.domain.roster import EmptyGroup, GroupArchived, GroupHasOpenSession
from asistencia.domain.session import ensure_can_delete, ensure_can_open

ACTIVE = {"id": "g1", "name": "SDD", "archived_at": None}
ARCHIVED = {"id": "g1", "name": "SDD", "archived_at": "2026-10-27T10:00:00.000+00:00"}


def test_active_group_with_students_can_open():  # CA-19
    ensure_can_open(ACTIVE, 3)


def test_empty_group_cannot_open():  # CA-19
    with pytest.raises(EmptyGroup, match="Este grupo todavía no tiene alumnos"):
        ensure_can_open(ACTIVE, 0)


def test_archived_group_cannot_open():
    with pytest.raises(GroupArchived):
        ensure_can_open(ARCHIVED, 3)


def test_group_with_open_session_cannot_be_deleted():  # CA-09
    with pytest.raises(GroupHasOpenSession):
        ensure_can_delete(1)


def test_group_without_open_sessions_can_be_deleted():  # CA-09
    ensure_can_delete(0)
