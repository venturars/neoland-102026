"""Conexiones independientes, grupo fijo y presupuesto compartido."""
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from uuid import uuid4
import pytest
from asistencia.usecases import attendance,races
from asistencia.domain.race import RaceError


def test_join_collision_and_parallel_attempts(tmp_path,clock,monkeypatch):
    db=tmp_path/"parallel.sqlite"; attendance.prepare(db,"teacher")
    sid=races.prepare(db,"Paralelo",clock)["id"]
    entry=races.teacher_state(db,sid,clock)["entrySecret"]
    barrier=Barrier(2)
    def joining(_):
        barrier.wait()
        try: return races.join(db,sid,entry,"jimena-duran",None,clock)[1]
        except RaceError as e: return e.status
    with ThreadPoolExecutor(2) as pool: results=list(pool.map(joining,range(2)))
    assert results.count(409)==1
    token=next(r for r in results if isinstance(r,str))
    races.start(db,sid,clock);clock.advance(3)
    calls=[]; monkeypatch.setattr(races,"is_valid_code",lambda *args: calls.append(1) or False)
    def sending(_):
        try: return races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock).status
        except RaceError as e: return e.status
    with ThreadPoolExecutor(8) as pool: statuses=list(pool.map(sending,range(50)))
    assert len(calls)==3 and statuses.count(422)==3 and statuses.count(429)==47


def test_fifteen_clients_share_a_blocked_ip_without_losing_normal_policy(tmp_path,clock):
    from contextlib import closing
    from app import create_app
    from asistencia.domain.roster import ROSTER
    from asistencia.storage import races as store
    app=create_app(tmp_path/"shared.sqlite",token="teacher",now=clock,race_origin="http://localhost",race_local_http=True)
    db=tmp_path/"shared.sqlite"; teacher=app.test_client();head={"X-Teacher-Token":"teacher"}
    sid=teacher.post("/api/sessions/races",headers=head,json={}).json["id"]
    entry=teacher.get(f"/api/sessions/{sid}/race",headers=head).json["joinUrl"].split("#join=")[1]
    with closing(store.connect(db)) as c:c.execute("INSERT INTO blocked_addresses VALUES ('127.0.0.1')")
    clients=[]
    for ref in ROSTER:
        client=app.test_client()
        assert client.post(f"/api/races/{sid}/join",headers={"X-Race-Request":"1"},json={"join_secret":entry,"roster_key":ref["key"]}).status_code==200
        clients.append((client,client.get(f"/api/races/{sid}/me").json["csrfToken"]))
    teacher.post(f"/api/sessions/{sid}/race/start",headers=head,json={});clock.advance(3)
    code=teacher.get(f"/api/sessions/{sid}/race",headers=head).json["code"]
    def sending(pair):
        c,csrf=pair
        return c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json={"operation_id":str(uuid4()),"code":code}).status_code
    with ThreadPoolExecutor(5) as pool:assert list(pool.map(sending,clients))==[201]*15
    state=teacher.get(f"/api/sessions/{sid}/race",headers=head).json
    assert state["phase"]=="closed" and state["total"]==15
    with closing(store.connect(db)) as c:
        assert c.execute("SELECT COUNT(*) FROM blocked_addresses").fetchone()[0]==1
        assert c.execute("SELECT COUNT(*) FROM registration_attempts").fetchone()[0]==0
    normal=teacher.post("/api/sessions",headers=head,json={}).json["id"]
    assert teacher.post(f"/api/s/{normal}/checkin",json={"name":"Ana","code":"0000"}).status_code==429


def test_owned_slot_attack_does_not_spend_other_fourteen_budgets(tmp_path,clock,monkeypatch):
    from contextlib import closing
    from asistencia.domain.roster import ROSTER
    from asistencia.storage import races as store
    from asistencia.domain.codes import is_valid_code,code_for
    db=tmp_path/"attack.sqlite";attendance.prepare(db,"teacher")
    sid=races.prepare(db,"Convivencia",clock)["id"];entry=races.teacher_state(db,sid,clock)["entrySecret"]
    tokens=[races.join(db,sid,entry,ref["key"],None,clock)[1] for ref in ROSTER]
    races.start(db,sid,clock);clock.advance(3)
    with closing(store.connect(db)) as c:secret=store.get_race(c,sid)["secret"]
    bad=next(f"{i:04d}" for i in range(10) if not is_valid_code(secret,f"{i:04d}",clock()))
    good=code_for(secret,clock());calls=[]
    def checking(*args):calls.append(1);return is_valid_code(*args)
    monkeypatch.setattr(races,"is_valid_code",checking)
    jobs=[]
    for token in tokens[1:]:jobs.extend([(token,good,False),(tokens[0],bad,True)])
    jobs.extend([(tokens[0],bad,True)]*(50-14))
    def sending(job):
        token,value,hostile=job
        try:status=races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":value},"127.0.0.1",clock).status
        except RaceError as e:status=e.status
        return hostile,status
    with ThreadPoolExecutor(5) as pool:results=list(pool.map(sending,jobs))
    assert [status for hostile,status in results if not hostile]==[201]*14
    assert sum(status==422 for hostile,status in results if hostile)==3
    assert sum(status==429 for hostile,status in results if hostile)==47
    assert len(calls)==17
    assert races.teacher_state(db,sid,clock)["total"]==14


def test_all_fifteen_claimed_slots_still_have_only_forty_five_evaluations(tmp_path,clock,monkeypatch):
    from asistencia.domain.roster import ROSTER
    db=tmp_path/"allclaimed.sqlite";attendance.prepare(db,"teacher")
    sid=races.prepare(db,"Todos",clock)["id"];entry=races.teacher_state(db,sid,clock)["entrySecret"]
    tokens=[races.join(db,sid,entry,ref["key"],None,clock)[1] for ref in ROSTER]
    races.start(db,sid,clock);clock.advance(3);calls=[]
    monkeypatch.setattr(races,"is_valid_code",lambda *args:calls.append(1) or False)
    for token in tokens:
        for _ in range(3):assert races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock).status==422
        with pytest.raises(RaceError) as e:races.attempt(db,sid,token,{"operation_id":str(uuid4()),"code":"1234"},"127.0.0.1",clock)
        assert e.value.status==429
    assert len(calls)==45 and races.teacher_state(db,sid,clock)["total"]==0


def test_same_operation_concurrent_retries_evaluate_only_once(tmp_path, clock, monkeypatch):
    from contextlib import closing
    from asistencia.storage import races as store
    db = tmp_path / "retry.sqlite"
    attendance.prepare(db, "teacher")
    sid = races.prepare(db, "Repetición", clock)["id"]
    entry = races.teacher_state(db, sid, clock)["entrySecret"]
    token = races.join(db, sid, entry, "jimena-duran", None, clock)[1]
    races.start(db, sid, clock)
    clock.advance(3)
    calls = []
    monkeypatch.setattr(races, "is_valid_code", lambda *args: calls.append(1) or True)
    fields = {"operation_id": str(uuid4()), "code": "1234"}
    barrier = Barrier(2)
    def sending(_):
        barrier.wait()
        return races.attempt(db, sid, token, fields, "127.0.0.1", clock).status
    with ThreadPoolExecutor(2) as pool:
        statuses = list(pool.map(sending, range(2)))
    assert statuses.count(201) == 1
    assert all(status in (200, 201, 202) for status in statuses)
    assert len(calls) == 1
    replay = races.attempt(db, sid, token, fields, "127.0.0.1", clock)
    assert replay.status == 200 and replay.body["remaining"] == 2
    with closing(store.connect(db)) as conn:
        assert store.count_operations(conn, sid, "jimena-duran") == 1
        assert len(store.ranking(conn, sid)) == 1


def test_join_racing_start_is_included_or_rejected_without_late_arrival(tmp_path, clock):
    db = tmp_path / "start-join.sqlite"
    attendance.prepare(db, "teacher")
    sid = races.prepare(db, "Salida", clock)["id"]
    entry = races.teacher_state(db, sid, clock)["entrySecret"]
    races.join(db, sid, entry, "jimena-duran", None, clock)
    barrier = Barrier(2)
    def joining():
        barrier.wait()
        try:
            return races.join(db, sid, entry, "meghan-martin", None, clock)[1]
        except RaceError as exc:
            assert exc.status == 410
            return None
    def starting():
        barrier.wait()
        return races.start(db, sid, clock)
    with ThreadPoolExecutor(2) as pool:
        joined = pool.submit(joining)
        started = pool.submit(starting)
        token = joined.result(timeout=2)
        started.result(timeout=2)
    roster = races.teacher_state(db, sid, clock)["roster"]
    second = next(row for row in roster if row["key"] == "meghan-martin")
    assert second["included"] == (token is not None)
    with pytest.raises(RaceError):
        races.join(db, sid, entry, "miguel-rodriguez", None, clock)
