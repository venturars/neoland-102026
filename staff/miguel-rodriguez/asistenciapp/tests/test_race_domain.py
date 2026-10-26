"""Reglas de carrera antes de su implementación (008 CA-01–09, 16, 19)."""
import pytest
from asistencia.domain.race import phase, valid_operation_id, MAX_ATTEMPTS
from asistencia.domain.roster import ROSTER, resolve_slot
from asistencia.domain.names import name_key


def test_unique_roster_and_normalization():
    assert len(ROSTER) == 15
    assert len({name_key(r["name"]) for r in ROSTER}) == 15
    assert len({r["key"] for r in ROSTER}) == 15
    assert resolve_slot("  JIMENA   DURÁN ")["character"] == "ajolote"
    assert resolve_slot("inventado") is None


@pytest.mark.parametrize("start,closed,now,expected", [(None,None,0,"lobby"),(3,None,2.9,"countdown"),(3,None,3,"open"),(3,"closed",4,"closed"),(None,None,7200,"expired")])
def test_server_phase(start,closed,now,expected):
    assert phase(start,closed,7200,now) == expected


def test_attempt_and_operation_format():
    assert MAX_ATTEMPTS == 3
    assert valid_operation_id("d8620a89-9c8f-4cc7-8057-1f0913ca59b0")
    assert not valid_operation_id(None)
    assert not valid_operation_id("anything")
