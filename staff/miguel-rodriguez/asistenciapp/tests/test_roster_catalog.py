"""Catálogo 012: preparación única, datos explícitos y confirmación atómica."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
import json
from pathlib import Path
import re
import sqlite3
from threading import Barrier

import pytest
from app import create_app
from asistencia.domain.race import RaceError
from asistencia.domain.roster import resolve_slot, validate_roster
from asistencia.storage import roster as storage
from asistencia.usecases import attendance, races

FIXTURES = Path(__file__).parent / 'fixtures'


def sample():
    return [{'key': 'ada', 'name': 'Ada García', 'character': 'yomi', 'display_order': 4}]


def rows(db, query, params=()):
    with closing(sqlite3.connect(db)) as connection:
        return connection.execute(query, params).fetchall()


def edit(db, query, params=()):
    with closing(sqlite3.connect(db)) as connection:
        connection.execute(query, params)
        connection.commit()


@pytest.fixture
def database(tmp_path):
    db = tmp_path / 'catalog.sqlite'
    attendance.prepare(db, 'test-teacher')
    return db


def test_pure_resolution_and_validation():
    data = sample()
    validate_roster(data, {'yomi'})
    assert resolve_slot('ada', data) == data[0]
    assert resolve_slot('  ADA   GARCÍA ', data) == data[0]
    assert resolve_slot('missing', data) is None
    assert resolve_slot(None, data) is None
    validate_roster([], set())
    validate_roster(data + [{**data[0], 'key': 'bea', 'name': 'Bea', 'display_order': 99}], {'yomi'})


@pytest.mark.parametrize('field,value', [
    ('key', ''), ('key', None), ('key', 4), ('name', ' '), ('name', None),
    ('character', ''), ('character', 'unknown'), ('character', '../yomi'),
    ('display_order', -1), ('display_order', 1.5), ('display_order', '1'), ('display_order', True),
])
def test_invalid_record_is_rejected(field, value):
    with pytest.raises(ValueError):
        validate_roster([{**sample()[0], field: value}], {'yomi'})


@pytest.mark.parametrize('changes', [
    {'key': 'ada'}, {'name': '  ADA GARCIA '}, {'display_order': 4}, {'name': 'ada'},
])
def test_ambiguous_records_are_rejected(changes):
    other = {**sample()[0], 'key': 'bea', 'name': 'Bea', 'display_order': 8, **changes}
    with pytest.raises(ValueError):
        validate_roster(sample() + [other], {'yomi'})


def test_domain_has_no_storage_or_production_roster():
    source = (Path(__file__).parents[1] / 'asistencia/domain/roster.py').read_text()
    assert 'ROSTER' not in source and 'jimena-duran' not in source
    assert 'sqlite' not in source and 'read_text(' not in source and 'open(' not in source


def test_original_roster_and_repeated_preparation(database, clock, monkeypatch):
    expected = json.loads((FIXTURES / '012-original-roster.json').read_text())
    sid = races.prepare(database, 'Original', clock)['id']
    actual = races.teacher_state(database, sid, clock)['roster']
    assert [{k: r[k] for k in ('key', 'name', 'character')} for r in actual] == [
        {k: r[k] for k in ('key', 'name', 'character')} for r in expected]
    assert all(r['state'] == 'pendiente' for r in actual)
    assert rows(database, 'SELECT COUNT(*) FROM checkins') == [(0,)]
    before = rows(database, 'SELECT * FROM students ORDER BY display_order')
    def no_csv():
        pytest.fail('El catálogo preparado no vuelve a leer el archivo inicial')
    monkeypatch.setattr(storage, 'read_initial_students', no_csv)
    create_app(database, token='test-teacher', now=clock)
    races.prepare(database, 'Repetida', clock)
    assert rows(database, 'SELECT * FROM students ORDER BY display_order') == before
    assert rows(database, "SELECT value FROM config WHERE key='student_catalog_version'") == [('1',)]


def test_stored_catalog_drives_new_races(database, clock):
    old = races.prepare(database, 'Antes', clock)['id']
    edit(database, 'DELETE FROM students')
    edit(database, 'INSERT INTO students VALUES (?,?,?,?)', ('ada', 'Ada Nueva', 'yomi', 7))
    edit(database, 'INSERT INTO students VALUES (?,?,?,?)', ('bea', 'Bea', 'ajolote', 2))
    create_app(database, token='test-teacher', now=clock)
    new = races.prepare(database, 'Después', clock)['id']
    roster = races.teacher_state(database, new, clock)['roster']
    assert [(r['key'], r['name'], r['character']) for r in roster] == [('bea', 'Bea', 'ajolote'), ('ada', 'Ada Nueva', 'yomi')]
    assert len(races.teacher_state(database, old, clock)['roster']) == 15


def test_prepared_empty_does_not_reseed(database, clock):
    races.prepare(database, 'Antes', clock)
    edit(database, 'DELETE FROM students')
    count = rows(database, 'SELECT COUNT(*) FROM sessions')
    with pytest.raises(RaceError) as exc:
        races.prepare(database, 'Vacío', clock)
    assert exc.value.reason == 'catalog_empty'
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(0,)]
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == count


@pytest.mark.parametrize('state', ['table_only', 'marker_only', 'unknown', 'schema', 'character', 'order', 'query', 'missing_csv', 'bad_csv'])
def test_catalog_failures_do_not_repair_or_create_races(database, clock, monkeypatch, state):
    if state in ('table_only', 'unknown', 'schema', 'character', 'order'):
        races.prepare(database, 'Existente', clock)
    if state == 'table_only': edit(database, "DELETE FROM config WHERE key='student_catalog_version'")
    if state == 'marker_only': edit(database, "INSERT INTO config VALUES ('student_catalog_version','1')")
    if state == 'unknown': edit(database, "UPDATE config SET value='999' WHERE key='student_catalog_version'")
    if state == 'schema':
        edit(database, 'DROP TABLE students')
        edit(database, 'CREATE TABLE students (unexpected TEXT)')
    if state == 'character': edit(database, "UPDATE students SET character_slug='missing' WHERE roster_key='jimena-duran'")
    if state == 'order':
        edit(database, 'PRAGMA ignore_check_constraints=ON')
        # Un esquema alterado permite el dato inválido para comprobar también la lectura.
        edit(database, 'ALTER TABLE students RENAME TO students_valid')
        edit(database, 'CREATE TABLE students AS SELECT * FROM students_valid')
        edit(database, 'UPDATE students SET display_order=-1')
    def fail(): raise OSError('Fallo sintético de lectura')
    if state == 'query':
        monkeypatch.setattr(storage, 'read_state', lambda connection: (_ for _ in ()).throw(sqlite3.OperationalError('synthetic')))
    if state == 'missing_csv': monkeypatch.setattr(storage, 'read_initial_students', fail)
    if state == 'bad_csv': monkeypatch.setattr(storage, 'read_initial_students', lambda: [{'invalid': 'row'}])
    with closing(sqlite3.connect(database)) as connection: before = list(connection.iterdump())
    with pytest.raises(RaceError) as exc: races.prepare(database, 'No crear', clock)
    assert exc.value.reason == 'catalog_unavailable'
    with closing(sqlite3.connect(database)) as connection: assert list(connection.iterdump()) == before


@pytest.mark.parametrize('function', ['create_catalog', 'insert_students', 'mark_prepared'])
def test_partial_preparation_rolls_back(database, clock, monkeypatch, function):
    original = getattr(storage, function)
    def fail_after(*args):
        original(*args)
        raise sqlite3.OperationalError('Fallo tras escribir')
    monkeypatch.setattr(storage, function, fail_after)
    with pytest.raises(RaceError): races.prepare(database, 'Fallo', clock)
    assert rows(database, "SELECT name FROM sqlite_master WHERE name='students'") == []
    assert rows(database, "SELECT value FROM config WHERE key='student_catalog_version'") == []
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == [(0,)]
    monkeypatch.setattr(storage, function, original)
    races.prepare(database, 'Correcta', clock)
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(15,)]


@pytest.mark.parametrize('committed', [False, True])
def test_commit_failure_is_not_assumed_to_be_rollback(database, clock, monkeypatch, committed):
    original = races._commit
    def failing_commit(connection, stage):
        if committed: original(connection, stage)
        raise sqlite3.OperationalError('Confirmación incierta simulada')
    monkeypatch.setattr(races, '_commit', failing_commit)
    with pytest.raises(sqlite3.OperationalError): races.prepare(database, 'Fallo', clock)
    tables = rows(database, "SELECT name FROM sqlite_master WHERE name='students'")
    assert bool(tables) == committed
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == [(int(committed),)]
    monkeypatch.setattr(races, '_commit', original)
    if committed:
        def no_csv(): pytest.fail('No reponer después de confirmar')
        monkeypatch.setattr(storage, 'read_initial_students', no_csv)
    races.prepare(database, 'Siguiente', clock)
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(15,)]
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == [(1 + int(committed),)]


def test_concurrent_initial_preparation(database, clock):
    ready = Barrier(2)
    def prepare(_):
        ready.wait()
        try: return races.prepare(database, 'Paralelo', clock)['id']
        except RaceError as exc:
            assert exc.reason == 'storage_busy'
            return None
    with ThreadPoolExecutor(2) as pool: ids = list(pool.map(prepare, range(2)))
    assert any(ids)
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(15,)]
    for sid in filter(None, ids): assert len(races.teacher_state(database, sid, clock)['roster']) == 15
    races.prepare(database, 'Posterior', clock)
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(15,)]


def test_assets_match_existing_renderer():
    source = (Path(__file__).parents[1] / 'static/race-renderer.js').read_text()
    declared = set(re.findall(r"'([^']+)'", source.split('new Set([')[1].split(']);')[0]))
    assert storage.available_characters() == declared


@pytest.mark.parametrize('empty,status,message', [
    (True, 409, 'No hay alumnos disponibles'), (False, 503, 'No se pudo cargar el catálogo'),
])
def test_catalog_http_errors_use_real_app(database, clock, empty, status, message):
    races.prepare(database, 'Antes', clock)
    edit(database, 'DELETE FROM students' if empty else "UPDATE students SET character_slug='missing'")
    count = rows(database, 'SELECT COUNT(*) FROM sessions')
    app = create_app(database, token='test-teacher', now=clock, race_origin='http://localhost', race_local_http=True)
    response = app.test_client().post('/api/sessions/races', json={}, headers={'X-Teacher-Token':'test-teacher'})
    assert response.status_code == status and message in response.json['error']
    assert response.headers['Cache-Control'] == 'no-store'
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == count


@pytest.mark.parametrize('contents', [
    'wrong,columns\na,b\n',
    'display_order,key,name,character\n0,ada,Ada,yomi\n',
    'display_order,key,name,character\n' + '\n'.join(f'{i},ada{i},Ada {i},yomi,extra' for i in range(15)),
    'display_order,key,name,character\n' + '\n'.join(f'1.5,ada{i},Ada {i},yomi' for i in range(15)),
])
def test_initial_reader_rejects_malformed_csv(tmp_path, monkeypatch, contents):
    source = tmp_path / 'initial.csv'
    source.write_text(contents)
    monkeypatch.setattr(storage, 'INITIAL_STUDENTS', source)
    with pytest.raises(ValueError): storage.read_initial_students()


def test_prepared_catalog_does_not_need_initial_file(database, clock, monkeypatch, tmp_path):
    races.prepare(database, 'Primera', clock)
    monkeypatch.setattr(storage, 'INITIAL_STUDENTS', tmp_path / 'does-not-exist.csv')
    races.prepare(database, 'Segunda', clock)
    assert rows(database, 'SELECT COUNT(*) FROM students') == [(15,)]


@pytest.mark.parametrize('value', [-1, 1.5, 'invalid'])
def test_invalid_saved_order_is_rejected(database, clock, value):
    races.prepare(database, 'Primera', clock)
    edit(database, 'ALTER TABLE students RENAME TO old_catalog')
    edit(database, 'CREATE TABLE students AS SELECT * FROM old_catalog')
    edit(database, "UPDATE students SET display_order=? WHERE roster_key='jimena-duran'", (value,))
    with pytest.raises(RaceError) as exc: races.prepare(database, 'No crear', clock)
    assert exc.value.reason == 'catalog_unavailable'
    assert rows(database, 'SELECT COUNT(*) FROM sessions') == [(1,)]


def test_duplicate_saved_order_is_rejected(database, clock):
    races.prepare(database, 'Primera', clock)
    edit(database, 'ALTER TABLE students RENAME TO old_catalog')
    edit(database, 'CREATE TABLE students AS SELECT * FROM old_catalog')
    edit(database, 'UPDATE students SET display_order=0')
    with pytest.raises(RaceError) as exc: races.prepare(database, 'No crear', clock)
    assert exc.value.reason == 'catalog_unavailable'


def test_catalog_reading_works_from_another_directory(database, clock, monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    sid = races.prepare(database, 'Otro directorio', clock)['id']
    assert len(races.teacher_state(database, sid, clock)['roster']) == 15
