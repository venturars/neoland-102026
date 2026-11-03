"""Tests de asistencia/domain/rules.py · spec 005 CA-05: las reglas se prueban sin app ni base de datos."""

import pytest

from asistencia.domain.codes import WINDOW_SECONDS, code_for
from asistencia.domain.rules import (
    InvalidCode,
    SessionClosed,
    SessionNotFound,
    is_open,
    require_open,
    require_session,
    require_valid_code,
)

T = 1_000_000 * WINDOW_SECONDS
OPEN = {"secret": b"secreto", "closed_at": None}
CLOSED = {"secret": b"secreto", "closed_at": "2026-11-01T10:00:00+00:00"}


def test_missing_session_raises_not_found():
    with pytest.raises(SessionNotFound, match="Esta clase no existe"):
        require_session(None)


def test_existing_session_is_returned():
    assert require_session(OPEN) is OPEN


def test_open_and_closed_sessions():
    assert is_open(OPEN)
    assert not is_open(CLOSED)
    require_open(OPEN)
    with pytest.raises(SessionClosed, match="ya está cerrada"):
        require_open(CLOSED)


def test_current_code_is_accepted():
    require_valid_code(OPEN, code_for(OPEN["secret"], T), T)


def test_wrong_or_expired_code_is_rejected():
    old = code_for(OPEN["secret"], T - 2 * WINDOW_SECONDS)
    for code in ("", "abcd", old):
        with pytest.raises(InvalidCode, match="no es válido o ha caducado"):
            require_valid_code(OPEN, code, T)
