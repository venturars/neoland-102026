"""012 conserva carreras anteriores sin reinterpretar plazas ni intentos."""
from contextlib import closing
import json
from pathlib import Path
import sqlite3

import pytest
from app import create_app
from asistencia.domain.race import RaceError
from asistencia.usecases import races


@pytest.fixture
def previous(tmp_path):
    sql = (Path(__file__).parent / 'fixtures/012-previous-state.sql').read_text()
    meta = json.loads(sql.split('-- metadata: ',1)[1].splitlines()[0])
    db = tmp_path / 'previous.sqlite'
    with closing(sqlite3.connect(db)) as connection: connection.executescript(sql)
    return db, meta


def snapshot(db):
    with closing(sqlite3.connect(db)) as connection:
        names = [r[0] for r in connection.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'") if r[0]!='students']
        return {name:connection.execute(f'SELECT * FROM "{name}" ORDER BY rowid').fetchall() for name in names}


def test_previous_rows_remain_unchanged_after_catalog_preparation(previous):
    db, meta = previous
    before = snapshot(db)
    clock = lambda: meta['now']
    states = {label:races.teacher_state(db, case['id'], clock) for label,case in meta['races'].items()}
    create_app(db, now=clock)
    new = races.prepare(db, 'Nueva', clock)['id']
    after = snapshot(db)
    for table in ('checkins','race_access','race_operations','registration_attempts','blocked_addresses'):
        assert after[table] == before[table]
    assert [r for r in after['config'] if r[0]!='student_catalog_version'] == before['config']
    for table in ('sessions','races','race_slots'):
        assert [r for r in after[table] if r[0]!=new] == before[table]
    assert {label:races.teacher_state(db, case['id'], clock) for label,case in meta['races'].items()} == states


@pytest.mark.parametrize('catalog', ['changed','empty','unavailable'])
def test_old_lobby_resolves_its_own_names(previous, catalog):
    db, meta = previous
    clock = lambda:meta['now']
    races.prepare(db, 'Inicia catálogo', clock)
    with closing(sqlite3.connect(db)) as connection:
        connection.execute('DELETE FROM students')
        if catalog=='changed': connection.execute("INSERT INTO students VALUES ('different','Otra persona','yomi',0)")
        if catalog=='unavailable': connection.execute("UPDATE config SET value='unknown' WHERE key='student_catalog_version'")
        connection.commit()
    case=meta['races']['lobby']; sid=case['id']
    assert len(races.lobby(db,sid,case['entry'],clock)['roster'])==15
    assert races.join(db,sid,case['entry'],'anything',case['tokens']['jimena-duran'],clock)[1] is None
    races.release(db,sid,' JIMENA DURÁN ',clock)
    own,token=races.join(db,sid,case['entry'],'Jimena Duran',None,clock)
    assert own['character']=='ajolote' and token and own['remaining']==3
    with pytest.raises(RaceError): races.me(db,sid,case['tokens']['jimena-duran'],clock)
    races.start(db,sid,clock)
    with pytest.raises(RaceError): races.release(db,sid,'jimena-duran',clock)


def test_previous_attempts_replay_without_evaluation_and_expire(previous, monkeypatch):
    db,meta=previous; now=[meta['now']];clock=lambda:now[0]
    races.prepare(db,'Nueva',clock)
    with closing(sqlite3.connect(db)) as connection:
        connection.execute('DELETE FROM students');connection.commit()
    case=meta['races']['open'];sid=case['id']
    before=snapshot(db)
    def no_evaluation(*args): pytest.fail('Un envío anterior no se evalúa otra vez')
    monkeypatch.setattr(races,'is_valid_code',no_evaluation)
    for key,field,expected in [('jimena-duran','success','already_registered'),('miguel-rodriguez','invalid','invalid_code'),('diego-torres','reserved','unconfirmed')]:
        data,kind=races.attempt(db,sid,case['tokens'][key],case[field],'127.0.0.1',clock)
        assert kind==expected and data['remaining']==2
    assert snapshot(db)==before
    now[0]+=7200
    with pytest.raises(RaceError) as exc:races.me(db,sid,case['tokens']['jimena-duran'],clock)
    assert exc.value.reason=='access_expired'
    after=snapshot(db)
    assert after['checkins']==before['checkins']
    assert after['blocked_addresses']==before['blocked_addresses']
    assert not after['race_access'] and not after['race_operations']
