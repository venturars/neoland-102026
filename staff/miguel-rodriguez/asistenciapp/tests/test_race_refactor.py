"""Equivalencia 011: permisos de un uso, traducción HTTP y datos de 010."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
import json
from pathlib import Path
import sqlite3
from threading import Barrier, Event
from uuid import uuid4

import pytest

from app import create_app
from asistencia.domain.race import RaceError
from asistencia.usecases import attendance, races


@pytest.fixture
def reserved(tmp_path, clock):
    db = tmp_path / 'refactor.sqlite'
    attendance.prepare(db, 'teacher')
    session_id = races.prepare(db, 'Un uso', clock)['id']
    entry = races.teacher_state(db, session_id, clock)['entrySecret']
    token = races.join(db, session_id, entry, 'jimena-duran', None, clock)[1]
    races.start(db, session_id, clock)
    clock.advance(3)
    code = races.teacher_state(db, session_id, clock)['code']
    fields = {'operation_id': str(uuid4()), 'code': code}
    execute = races._reserve(db, session_id, token, fields, clock)
    return db, session_id, token, fields, execute, clock


def test_reserved_function_captures_code_and_rejects_second_use(reserved, monkeypatch):
    db, session_id, token, fields, execute, clock = reserved
    original_code = fields['code']
    fields['code'] = 'changed after A'
    evaluated = []
    monkeypatch.setattr(races, 'is_valid_code', lambda secret, code, instant: evaluated.append(code) or True)
    data, kind = execute()
    assert kind == 'registered' and data['remaining'] == 2
    with pytest.raises(RuntimeError, match='ya se utilizó'):
        execute()
    assert evaluated == [original_code]


def test_same_reserved_function_cannot_evaluate_concurrently(reserved, monkeypatch):
    db, session_id, token, fields, execute, clock = reserved
    ready = Barrier(2)
    evaluating, release = Event(), Event()
    evaluated = []
    def validate(*args):
        evaluated.append(1)
        evaluating.set()
        assert release.wait(2)
        return True
    monkeypatch.setattr(races, 'is_valid_code', validate)
    def send():
        ready.wait()
        try:
            return execute()[1]
        except RuntimeError:
            return 'already_used'
    with ThreadPoolExecutor(2) as pool:
        first, second = pool.submit(send), pool.submit(send)
        try:
            assert evaluating.wait(2)
        finally:
            release.set()
        results = [first.result(timeout=3), second.result(timeout=3)]
    assert sorted(results) == ['already_used', 'registered']
    assert evaluated == [1]


def test_failed_execution_does_not_restore_the_local_permission(reserved, monkeypatch):
    db, session_id, token, fields, execute, clock = reserved
    def fail(*args):
        raise RuntimeError('failure after A')
    monkeypatch.setattr(races, '_finalize', fail)
    with pytest.raises(RuntimeError, match='failure after A'):
        execute()
    with pytest.raises(RuntimeError, match='ya se utilizó'):
        execute()
    assert races.me(db, session_id, token, clock)['remaining'] == 2
    assert races.attempt(db, session_id, token, fields, '127.0.0.1', clock)[1] == 'unconfirmed'


@pytest.mark.parametrize('reason,status', [
    ('invalid_input', 400), ('access_denied', 403), ('origin_unavailable', 403),
    ('race_missing', 404), ('state_conflict', 409), ('entry_closed', 410),
    ('access_expired', 410), ('payload_too_large', 413), ('unsupported_content', 415),
    ('attempts_exhausted', 429), ('storage_busy', 503), ('origin_not_configured', 503),
])
def test_semantic_reason_keeps_the_http_contract(tmp_path, clock, reason, status):
    app = create_app(tmp_path / 'errors.sqlite', token='teacher', now=clock)
    @app.get('/api/races/probe')
    def probe():
        raise RaceError(reason, 'Mensaje de ejemplo.')
    response = app.test_client().get('/api/races/probe')
    assert response.status_code == status
    assert response.json == {'error': 'Mensaje de ejemplo.'}
    assert response.headers['Cache-Control'] == 'no-store'
    assert response.headers.get('Retry-After') == ('1' if status == 503 else None)


def test_unknown_internal_reason_does_not_turn_into_success(tmp_path, clock, caplog):
    app = create_app(tmp_path / 'unknown.sqlite', token='teacher', now=clock)
    @app.get('/api/races/probe')
    def probe():
        raise RaceError('unknown_reason', 'No publicar como resultado.')
    response = app.test_client().get('/api/races/probe')
    assert response.status_code == 500
    assert 'No publicar' not in response.get_data(as_text=True)
    assert 'No publicar' not in caplog.text
    assert 'unknown_reason' not in caplog.text


@pytest.fixture
def previous_database(tmp_path):
    fixtures = Path(__file__).parent / 'fixtures'
    metadata = json.loads((fixtures / '011-previous-race.json').read_text())
    db = tmp_path / 'previous.sqlite'
    with closing(sqlite3.connect(db)) as connection:
        connection.executescript((fixtures / '011-previous-race.sql').read_text())
    return db, metadata


def test_saved_010_results_replay_without_evaluation_or_data_changes(previous_database, monkeypatch):
    db, previous = previous_database
    with closing(sqlite3.connect(db)) as connection:
        before = list(connection.iterdump())
    app = create_app(db, token='fixture-teacher', now=lambda: previous['now'],
                     race_origin='http://localhost', race_local_http=True)
    def no_evaluation(*args):
        pytest.fail('Una operación de 010 no puede evaluarse otra vez')
    monkeypatch.setattr(races, 'is_valid_code', no_evaluation)
    session_id = previous['session_id']
    for case in previous['cases']:
        client = app.test_client()
        client.set_cookie(f'race_{session_id}', case['token'], path=f'/api/races/{session_id}')
        csrf = client.get(f'/api/races/{session_id}/me').json['csrfToken']
        response = client.post(f'/api/races/{session_id}/attempt',
                               headers={'X-Race-CSRF': csrf}, json=case['fields'])
        assert response.status_code == case['status']
        assert response.json == case['body']
        assert response.json['remaining'] == 2
    with closing(sqlite3.connect(db)) as connection:
        assert list(connection.iterdump()) == before


def test_expired_010_success_is_not_recovered(previous_database, monkeypatch):
    db, previous = previous_database
    app = create_app(db, token='fixture-teacher', now=lambda: 1800007200.0,
                     race_origin='http://localhost', race_local_http=True)
    monkeypatch.setattr(races, 'is_valid_code', lambda *args: pytest.fail('No evaluar tras caducidad'))
    session_id = previous['session_id']
    for case in previous['cases']:
        client = app.test_client()
        client.set_cookie(f'race_{session_id}', case['token'], path=f'/api/races/{session_id}')
        assert client.get(f'/api/races/{session_id}/me').status_code == 410
        response = client.post(f'/api/races/{session_id}/attempt',
                               headers={'X-Race-CSRF': case['body']['csrfToken']}, json=case['fields'])
        assert response.status_code == 410
    with closing(sqlite3.connect(db)) as connection:
        assert connection.execute('SELECT COUNT(*) FROM checkins').fetchone()[0] == 1
        assert connection.execute('SELECT COUNT(*) FROM race_operations').fetchone()[0] == 0


def test_unknown_internal_result_does_not_turn_into_success(tmp_path, clock, monkeypatch):
    app = create_app(tmp_path / 'unknown-result.sqlite', token='teacher', now=clock,
                     race_origin='http://localhost', race_local_http=True)
    monkeypatch.setattr(races, 'teacher_state', lambda *args: ({'result': 'not confirmed'}, 'unknown_result'))
    response = app.test_client().get('/api/sessions/example/race', headers={'X-Teacher-Token': 'teacher'})
    assert response.status_code == 500
    assert 'not confirmed' not in response.get_data(as_text=True)


@pytest.mark.parametrize('kind,legacy_status', [
    ('success', 201), ('already', 200), ('invalid_operation', 400),
    ('invalid_code', 422), ('not_processed', 409),
])
def test_new_results_keep_the_previous_storage_format(previous_database, kind, legacy_status):
    from asistencia.storage import races as store
    db, previous = previous_database
    pending = previous['cases'][2]
    with closing(store.connect(db)) as connection:
        store.complete_operation(connection, previous['session_id'], pending['key'],
                                 pending['fields']['operation_id'], kind)
        operation = store.operation(connection, previous['session_id'], pending['key'],
                                    pending['fields']['operation_id'])
        assert operation['result_kind'] == kind
        assert operation['result_status'] == legacy_status
