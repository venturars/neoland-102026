"""Contrato de acciones antes de implementarlo: plazas, fases y caducidad."""
from contextlib import closing
from uuid import uuid4
import pytest
from asistencia.usecases import attendance, races
from asistencia.storage import races as store
from asistencia.domain.race import RaceError
from asistencia.domain.codes import code_for


@pytest.fixture
def race_env(tmp_path,clock):
    db=tmp_path/"race.sqlite"
    attendance.prepare(db,"teacher")
    prepared=races.prepare(db,"Carrera",clock)
    sid=prepared["id"]
    entry=races.teacher_state(db,sid,clock)["entrySecret"]
    return db,sid,entry,clock


def join(env,key="jimena-duran"):
    db,sid,entry,clock=env
    return races.join(db,sid,entry,key,None,clock)[1]


def opened(env):
    token=join(env)
    races.start(env[0],env[1],env[3]); env[3].advance(3)
    return token


def code(env):
    return races.teacher_state(env[0],env[1],env[3])["code"]


def test_lobby_exclusive_release_and_shared_start(race_env):
    db,sid,entry,clock=race_env
    assert len(races.lobby(db,sid,entry,clock)["roster"])==15
    assert "code" not in races.teacher_state(db,sid,clock)
    with pytest.raises(RaceError): races.start(db,sid,clock)
    token=join(race_env)
    with pytest.raises(RaceError) as e: join(race_env)
    assert e.value.reason == 'state_conflict'
    races.release(db,sid,"jimena-duran",clock)
    with pytest.raises(RaceError): races.me(db,sid,token,clock)
    token=join(race_env)
    start=races.start(db,sid,clock)["startsAt"]
    assert races.start(db,sid,clock)["startsAt"]==start
    with pytest.raises(RaceError): races.join(db,sid,entry,"meghan-martin",None,clock)
    assert "code" not in races.teacher_state(db,sid,clock)
    clock.advance(3)
    assert races.me(db,sid,token,clock)["phase"]=="open"


def test_third_attempt_can_win_and_last_success_replays(race_env):
    db,sid,entry,clock=race_env; token=opened(race_env)
    for raw in (None, []):
        result=races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":raw},"127.0.0.1",clock)
        assert result[1] == 'invalid_code'
    oid=str(uuid4()); fields={"operation_id":oid,"code":code(race_env)}
    result=races.attempt(db,sid,token,fields,"127.0.0.1",clock)
    assert result[1] == 'registered' and result[0]["remaining"]==0
    assert races.teacher_state(db,sid,clock)["phase"]=="closed"
    replay=races.attempt(db,sid,token,fields,"127.0.0.1",clock)
    assert replay[1] == 'already_registered' and replay[0]["result"]==result[0]["result"]
    with pytest.raises(RaceError) as e: races.attempt(db,sid,token,{**fields,"code":"different"},"127.0.0.1",clock)
    assert e.value.reason == 'state_conflict'


def test_budget_exhausted_never_checks_fourth(race_env,monkeypatch):
    db,sid,entry,clock=race_env; token=opened(race_env)
    calls=[]
    monkeypatch.setattr(races,"is_valid_code",lambda *args: calls.append(1) or False)
    for _ in range(3):
        assert races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock)[1] == 'invalid_code'
    with pytest.raises(RaceError) as e: races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock)
    assert e.value.reason == 'attempts_exhausted' and len(calls)==3


def test_durable_reservation_survives_result_rollback_and_restart(race_env,monkeypatch):
    db,sid,entry,clock=race_env; token=opened(race_env)
    calls=[]; original=store.complete_operation
    monkeypatch.setattr(races,"is_valid_code",lambda *args: calls.append(1) or True)
    def fail(*args,**kwargs): raise RuntimeError("injected")
    monkeypatch.setattr(store,"complete_operation",fail)
    for _ in range(3):
        fields={"operation_id":str(uuid4()),"code":"1234"}
        with pytest.raises(RuntimeError): races.attempt(db,sid,token,fields,"127.0.0.1",clock)
        attendance.prepare(db,"teacher")
        assert races.attempt(db,sid,token,fields,"127.0.0.1",clock)[1] == 'unconfirmed'
    monkeypatch.setattr(store,"complete_operation",original)
    with pytest.raises(RaceError) as e: races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock)
    assert e.value.reason == 'attempts_exhausted' and len(calls)==3
    with closing(store.connect(db)) as c: assert store.ranking(c,sid)==[]


def test_expiry_before_saved_success_and_removal(race_env):
    db,sid,entry,clock=race_env; token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    result=races.attempt(db,sid,token,fields,"127.0.0.1",clock)
    clock.advance(7196)
    assert races.me(db,sid,token,clock)["result"]==result[0]["result"]
    clock.advance(1)
    with pytest.raises(RaceError) as e: races.me(db,sid,token,clock)
    assert e.value.reason == 'access_expired'
    with closing(store.connect(db)) as c:
        assert store.operations(c,sid,"jimena-duran")==[]
        assert len(store.ranking(c,sid))==1
    assert races.remove_checkin(db,sid,result[0]["result"]["id"],clock)
    assert races.teacher_state(db,sid,clock)["checkins"]==[]


def test_unknown_origin_and_wrong_access_do_not_spend(race_env):
    db,sid,entry,clock=race_env; token=opened(race_env)
    for access,address in (("fake","127.0.0.1"),(token,None)):
        with pytest.raises(RaceError): races.attempt(db,sid,access,{"operation_id":str(uuid4()),"code":"1234"},address,clock)
    assert races.me(db,sid,token,clock)["remaining"]==3


@pytest.mark.parametrize("stage,after,expected_calls,expected_status",[("A",False,0,None),("A",True,0,"unconfirmed"),("B",False,1,"unconfirmed"),("B",True,1,"already_registered")])
def test_commit_uncertainty_is_not_execution_permission(race_env,monkeypatch,stage,after,expected_calls,expected_status):
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    original_commit=races._commit; original_validator=races.is_valid_code;calls=[]
    def validating(*args): calls.append(1);return original_validator(*args)
    def committing(c,tag):
        if tag==stage:
            if after: original_commit(c,tag)
            raise RuntimeError("commit response lost")
        original_commit(c,tag)
    monkeypatch.setattr(races,"is_valid_code",validating)
    monkeypatch.setattr(races,"_commit",committing)
    with pytest.raises(RuntimeError): races.attempt(db,sid,token,fields,"127.0.0.1",clock)
    assert len(calls)==expected_calls
    monkeypatch.setattr(races,"_commit",original_commit)
    if expected_status is None:
        assert races.me(db,sid,token,clock)["remaining"]==3
        assert races.attempt(db,sid,token,fields,"127.0.0.1",clock)[1] == 'registered'
    else:
        assert races.attempt(db,sid,token,fields,"127.0.0.1",clock)[1]==expected_status
        assert len(calls)==expected_calls


def test_process_dies_after_a_does_not_resume_on_retry(race_env,monkeypatch):
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    original=races._finalize;calls=[]
    def crash(*args):raise RuntimeError("process interrupted after A")
    monkeypatch.setattr(races,"_finalize",crash)
    with pytest.raises(RuntimeError):races.attempt(db,sid,token,fields,"127.0.0.1",clock)
    monkeypatch.setattr(races,"_finalize",original)
    monkeypatch.setattr(races,"is_valid_code",lambda *args:calls.append(1) or True)
    attendance.prepare(db,"teacher")
    assert races.attempt(db,sid,token,fields,"127.0.0.1",clock)[1] == 'unconfirmed'
    assert calls==[] and races.me(db,sid,token,clock)["remaining"]==2
    with pytest.raises(RaceError) as e:races.attempt(db,sid,token,{**fields,"code":"9999"},"127.0.0.1",clock)
    assert e.value.reason == 'state_conflict' and calls==[]


def test_third_reserved_attempt_still_has_its_one_evaluation(race_env):
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields=[{"operation_id":str(uuid4()),"code":code(race_env)} for _ in range(3)]
    tickets=[races._reserve(db,sid,token,f,clock) for f in fields]
    result=tickets[2]()
    assert result[1] == 'registered' and result[0]["remaining"]==0
    with pytest.raises(RuntimeError):tickets[2]()


def test_close_between_a_and_b_does_not_evaluate(race_env,monkeypatch):
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    ticket=races._reserve(db,sid,token,fields,clock)
    before=races.close(db,sid,clock)["closedAt"]
    calls=[];monkeypatch.setattr(races,"is_valid_code",lambda *args:calls.append(1) or True)
    assert ticket()[1] == 'not_processed'
    clock.advance(1)
    assert races.close(db,sid,clock)["closedAt"]==before
    assert calls==[] and races.me(db,sid,token,clock)["remaining"]==2


def test_expiry_while_waiting_for_b_uses_clock_after_lock(race_env,monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from threading import Event
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    ticket=races._reserve(db,sid,token,fields,clock)
    blocker=store.connect(db);blocker.execute("BEGIN IMMEDIATE")
    waiting=Event();original=store.connect;calls=[]
    class ConnectionProxy:
        def __init__(self,c):self.c=c
        def __getattr__(self,name):return getattr(self.c,name)
        def execute(self,sql,*args):
            if sql=="BEGIN IMMEDIATE":waiting.set()
            return self.c.execute(sql,*args)
    monkeypatch.setattr(store,"connect",lambda path:ConnectionProxy(original(path)))
    monkeypatch.setattr(races,"is_valid_code",lambda *args:calls.append(1) or True)
    try:
        with ThreadPoolExecutor(1) as pool:
            future=pool.submit(ticket)
            assert waiting.wait(2)
            clock.advance(7200)
            blocker.rollback()
            with pytest.raises(RaceError) as e:future.result(timeout=2)
            assert e.value.reason == 'access_expired'
    finally:blocker.close()
    assert calls==[]


def test_lock_before_a_and_after_a_have_different_consumption(race_env,monkeypatch):
    db,sid,entry,clock=race_env;token=opened(race_env)
    fields={"operation_id":str(uuid4()),"code":code(race_env)}
    with closing(store.connect(db)) as blocker:
        blocker.execute("BEGIN IMMEDIATE")
        with pytest.raises(RaceError) as e:races.attempt(db,sid,token,fields,"127.0.0.1",clock)
        assert e.value.reason == 'storage_busy'
        blocker.rollback()
    assert races.me(db,sid,token,clock)["remaining"]==3
    ticket=races._reserve(db,sid,token,fields,clock)
    calls=[];monkeypatch.setattr(races,"is_valid_code",lambda *args:calls.append(1) or True)
    with closing(store.connect(db)) as blocker:
        blocker.execute("BEGIN IMMEDIATE")
        assert ticket()[1] == 'unconfirmed'
        blocker.rollback()
    assert races.attempt(db,sid,token,fields,"127.0.0.1",clock)[1] == 'unconfirmed'
    assert calls==[] and races.me(db,sid,token,clock)["remaining"]==2


def test_confirmation_order_is_not_reservation_order_or_timestamp(race_env):
    db, sid, entry, clock = race_env
    first = join(race_env)
    second = join(race_env, "meghan-martin")
    races.start(db, sid, clock)
    clock.advance(3)
    fields = [{"operation_id": str(uuid4()), "code": code(race_env)} for _ in range(2)]
    one = races._reserve(db, sid, first, fields[0], clock)
    two = races._reserve(db, sid, second, fields[1], clock)
    two()
    one()
    ranking = races.teacher_state(db, sid, clock)["checkins"]
    assert [row["name"] for row in ranking] == ["Meghan Martin", "Jimena Duran"]
    assert ranking[0]["checkedAt"] == ranking[1]["checkedAt"]
    assert [row["position"] for row in ranking] == [1, 2]
    session, exported = attendance.export_session(db, sid)
    assert [row["name"] for row in exported] == ["Meghan Martin", "Jimena Duran"]
    assert races.remove_checkin(db, sid, ranking[0]["id"], clock)
    assert races.me(db, sid, second, clock)["state"] == "retirado"
    assert races.me(db, sid, first, clock)["result"]["position"] == 1


def test_rotation_restart_address_and_missing_cookie_do_not_reset_budget(race_env):
    from app import create_app
    db, sid, entry, clock = race_env
    token = opened(race_env)
    for _ in range(2):
        assert races.attempt(db, sid, token, {"operation_id": str(uuid4()), "code": []}, "127.0.0.1", clock)[1] == 'invalid_code'
    clock.advance(60)
    create_app(db, token="teacher", now=clock)
    assert races.me(db, sid, token, clock)["remaining"] == 1
    with pytest.raises(RaceError):
        races.me(db, sid, None, clock)
    with pytest.raises(RaceError):
        races.join(db, sid, entry, "JIMENA DURÁN", None, clock)
    result = races.attempt(db, sid, token, {"operation_id": str(uuid4()), "code": code(race_env)}, "127.0.0.2", clock)
    assert result[1] == 'registered' and result[0]["remaining"] == 0


@pytest.mark.parametrize("phase_name", ["lobby", "countdown", "open", "closed"])
def test_application_restart_preserves_phase_group_and_original_deadline(race_env, phase_name):
    from app import create_app
    db, sid, entry, clock = race_env
    token = join(race_env)
    if phase_name != "lobby":
        races.start(db, sid, clock)
    if phase_name in ("open", "closed"):
        clock.advance(3)
    if phase_name == "closed":
        races.close(db, sid, clock)
    before = races.teacher_state(db, sid, clock)
    create_app(db, token="teacher", now=clock)
    assert races.teacher_state(db, sid, clock) == before
    assert races.me(db, sid, token, clock)["phase"] == phase_name


def test_other_race_credentials_and_entry_cannot_control_a_slot(race_env):
    db, sid, entry, clock = race_env
    token = opened(race_env)
    other = races.prepare(db, "Otra", clock)["id"]
    with pytest.raises(RaceError):
        races.me(db, other, token, clock)
    with pytest.raises(RaceError):
        races.lobby(db, other, entry, clock)
    assert races.me(db, sid, token, clock)["remaining"] == 3
