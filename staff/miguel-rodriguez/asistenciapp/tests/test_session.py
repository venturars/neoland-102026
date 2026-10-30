"""Reglas extraídas: precedencia y validación sin almacenamiento."""

import pytest

from asistencia.domain.codes import code_for

NOW = 1_800_000_000.0
SESSION = {"secret": b"secreto-de-prueba", "closed_at": None}


def test_unknown_session_is_a_domain_error():
    from asistencia.domain.session import SessionNotFound, require_session
    with pytest.raises(SessionNotFound, match="Esta clase no existe"):
        require_session(None)


def test_existing_session_is_returned_without_mutation():
    from asistencia.domain.session import require_session
    original = dict(SESSION)
    assert require_session(SESSION) is SESSION
    assert SESSION == original


def test_missing_session_precedes_name_and_code_validation():
    from asistencia.domain.session import SessionNotFound, validate_check_in
    with pytest.raises(SessionNotFound):
        validate_check_in(None, {"name": "", "code": "bad"}, NOW)


def test_closed_session_precedes_name_and_code_validation():
    from asistencia.domain.session import SessionClosed, validate_check_in
    with pytest.raises(SessionClosed, match="ya está cerrada"):
        validate_check_in({**SESSION, "closed_at": "2026-10-23"}, {"name": "", "code": "bad"}, NOW)


def test_invalid_name_precedes_invalid_code():
    from asistencia.domain.session import validate_check_in
    with pytest.raises(ValueError, match="Escribe tu nombre"):
        validate_check_in(SESSION, {"name": " ", "code": "bad"}, NOW)


def test_invalid_code_has_its_domain_error():
    from asistencia.domain.session import InvalidCode, validate_check_in
    with pytest.raises(InvalidCode, match="El código no es válido"):
        validate_check_in(SESSION, {"name": "Ana", "code": "bad"}, NOW)


def test_valid_registration_returns_clean_name():
    from asistencia.domain.session import validate_check_in
    assert validate_check_in(SESSION, {"name": "  Ana García  ", "code": code_for(SESSION["secret"], NOW)}, NOW) == "Ana García"
