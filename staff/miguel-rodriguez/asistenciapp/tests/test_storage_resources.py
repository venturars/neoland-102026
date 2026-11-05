"""Consultas externas y equivalencia de los pasos aclarados en 015."""

import ast
from contextlib import closing
from pathlib import Path
import re

import pytest

from asistencia.domain import codes
from asistencia.domain.names import name_key
from asistencia.domain.roster import resolve_slot
from asistencia.storage import races as race_storage
from asistencia.storage import sqlite as storage
from asistencia.usecases import attendance, races

ROOT = Path(__file__).resolve().parents[1]


def test_storage_keeps_sql_in_resources():
    for path in (ROOT / 'asistencia/storage').glob('*.py'):
        source = ast.parse(path.read_text(encoding='utf-8'))
        for node in ast.walk(source):
            if isinstance(node, ast.Constant) and isinstance(node.value, str):
                assert not re.match(r'^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|PRAGMA)\s', node.value, re.I), path.name


def test_all_storage_resources_work_from_another_directory(tmp_path, monkeypatch, clock):
    database = tmp_path / 'elsewhere.sqlite'
    elsewhere = tmp_path / 'working-directory'
    elsewhere.mkdir()
    monkeypatch.chdir(elsewhere)
    attendance.prepare(database, 'teacher')
    normal = attendance.create_session(database, 'Normal', clock())
    race = races.prepare(database, 'Carrera', clock)
    with closing(storage.connect(database)) as connection:
        assert not storage.is_race(connection, normal['id'])
        assert storage.is_race(connection, race['id'])
        assert len(storage.list_sessions(connection)) == 2
    assert len(races.teacher_state(database, race['id'], clock)['roster']) == 15


def test_insert_result_survives_reading_the_saved_checkin(tmp_path):
    with closing(storage.connect(tmp_path / 'checkins.sqlite')) as connection:
        storage.init_schema(connection)
        session = storage.create_session(connection, 'Clase', 'opened')
        first, created = storage.add_checkin(connection, session['id'], 'Ada', 'ada', 'first')
        assert created is True
        repeated, created_again = storage.add_checkin(connection, session['id'], 'ADA', 'ada', 'later')
        assert created_again is False
        assert repeated == first == {'name': 'Ada', 'checked_at': 'first'}
        assert len(storage.list_checkins(connection, session['id'])) == 1


def test_query_file_failure_does_not_commit_pending_race(tmp_path, monkeypatch):
    database = tmp_path / 'rollback.sqlite'
    with closing(storage.connect(database)) as connection:
        storage.init_schema(connection)
    with closing(race_storage.connect(database)) as connection:
        connection.execute('BEGIN IMMEDIATE')
        race_storage.create(connection, 'race', 'Clase', 'opened', b'a' * 16, 0, 7200, 'entry', [])
        original_directory = race_storage.QUERY_DIR
        monkeypatch.setattr(race_storage, 'QUERY_DIR', tmp_path / 'missing-resources')
        with pytest.raises(FileNotFoundError):
            race_storage.count_operations(connection, 'race', 'ada')
        assert connection.in_transaction
        connection.rollback()
        monkeypatch.setattr(race_storage, 'QUERY_DIR', original_directory)
        assert race_storage.get_race(connection, 'race') is None


def test_current_code_does_not_evaluate_a_second_window(monkeypatch):
    compared = []
    original = codes.hmac.compare_digest
    def compare(left, right):
        compared.append(right)
        return original(left, right)
    monkeypatch.setattr(codes.hmac, 'compare_digest', compare)
    secret = b'local-fixture'
    instant = 1_800_000_000.0
    current = codes.code_for(secret, instant)
    assert codes.is_valid_code(secret, current, instant)
    assert compared == [current]


@pytest.mark.parametrize('value, expected', [
    ('  ÁDA  García ', 'ada garcia'),
    ('Straße', 'strasse'),
    ('A\u0301da\tGarcía', 'ada garcia'),
])
def test_name_normalization_keeps_unicode_rules(value, expected):
    assert name_key(value) == expected


def test_slot_resolution_keeps_first_match_and_returned_object():
    first = {'key': 'first', 'name': 'Ada'}
    later = {'key': 'Ada', 'name': 'Other'}
    assert resolve_slot('Ada', [first, later]) is first
    assert resolve_slot('first', [first, later]) is first
    assert resolve_slot(None, [first]) is None
