"""Contrato HTTP con factoría real, permisos y protección de vías antiguas."""
from contextlib import closing
import json
from uuid import uuid4
import pytest
from app import create_app
from asistencia.usecases import races,attendance
from asistencia.storage import races as store
from asistencia.domain.race import RaceError

TOKEN="teacher"
HEAD={"X-Teacher-Token":TOKEN}
ENTRY_HEAD={"X-Race-Request":"1"}


@pytest.fixture
def race_api(tmp_path,clock):
    db=tmp_path/"http.sqlite"
    app=create_app(db,token=TOKEN,now=clock,race_origin="http://localhost",race_local_http=True)
    client=app.test_client()
    response=client.post("/api/sessions/races",headers=HEAD,json={"title":"Prueba"})
    assert response.status_code==201
    sid=response.json["id"]
    state=client.get(f"/api/sessions/{sid}/race",headers=HEAD).json
    entry=state["joinUrl"].split("#join=")[1]
    return app,client,db,sid,entry,clock


def enter(env,key="jimena-duran"):
    app,client,db,sid,entry,clock=env
    response=client.post(f"/api/races/{sid}/join",headers=ENTRY_HEAD,json={"join_secret":entry,"roster_key":key})
    assert response.status_code==200
    return client.get(f"/api/races/{sid}/me").json["csrfToken"]


def go(env):
    app,client,db,sid,entry,clock=env
    csrf=enter(env)
    assert client.post(f"/api/sessions/{sid}/race/start",headers=HEAD,json={}).status_code==200
    clock.advance(3)
    code=client.get(f"/api/sessions/{sid}/race",headers=HEAD).json["code"]
    return csrf,code


def test_full_flow_cookie_no_cache_and_recovery(race_api):
    app,c,db,sid,entry,clock=race_api
    r=c.post(f"/api/races/{sid}/join",headers=ENTRY_HEAD,json={"join_secret":entry,"roster_key":"jimena-duran"})
    cookie=r.headers["Set-Cookie"]
    assert "HttpOnly" in cookie and "SameSite=Strict" in cookie and f"Path=/api/races/{sid}" in cookie
    assert "Domain=" not in cookie
    csrf=c.get(f"/api/races/{sid}/me").json["csrfToken"]
    assert "code" not in c.get(f"/api/sessions/{sid}",headers=HEAD).json
    assert c.post(f"/api/sessions/{sid}/race/start",headers=HEAD,json={}).status_code==200
    clock.advance(3)
    code=c.get(f"/api/sessions/{sid}/race",headers=HEAD).json["code"]
    fields={"code":code,"operation_id":str(uuid4()),"mode":"normal","name":"Otro"}
    r=c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json=fields)
    assert r.status_code==201 and r.json["result"]["name"]=="Jimena Duran"
    assert r.headers["Cache-Control"]=="no-store"
    replay=c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json=fields)
    assert replay.status_code==200 and replay.json["result"]==r.json["result"]
    assert c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json={**fields,"code":"xxxx"}).status_code==409
    assert c.delete(f"/api/sessions/{sid}/checkins/{r.json['result']['id']}",headers=HEAD).status_code==200
    assert c.get(f"/api/races/{sid}/me").json["state"]=="retirado"


@pytest.mark.parametrize("headers", [{},{"X-Race-CSRF":"fake"},{"Origin":"https://evil.example"},{"Sec-Fetch-Site":"cross-site"}])
def test_unauthorized_request_does_not_consume(race_api,headers):
    app,c,db,sid,entry,clock=race_api; csrf,code=go(race_api)
    if "Origin" in headers or "Sec-Fetch-Site" in headers: headers={**headers,"X-Race-CSRF":csrf}
    assert c.post(f"/api/races/{sid}/attempt",headers=headers,json={"code":code,"operation_id":str(uuid4())}).status_code==403
    assert c.get(f"/api/races/{sid}/me").json["remaining"]==3


def test_body_limits_and_malformed_authorized_request(race_api):
    app,c,db,sid,entry,clock=race_api;csrf,code=go(race_api)
    headers={"X-Race-CSRF":csrf}
    assert c.post(f"/api/races/{sid}/attempt",headers=headers,data='x'*2049,content_type='application/json').status_code==413
    assert c.post(f"/api/races/{sid}/attempt",headers=headers,data='x',content_type='text/plain').status_code==415
    assert c.get(f"/api/races/{sid}/me").json["remaining"]==3
    assert c.post(f"/api/races/{sid}/attempt",headers=headers,data='{',content_type='application/json').status_code==400
    assert c.get(f"/api/races/{sid}/me").json["remaining"]==2


def test_old_paths_cannot_bypass_or_ban(race_api):
    app,c,db,sid,entry,clock=race_api;csrf,code=go(race_api)
    for _ in range(10): assert c.post(f"/api/s/{sid}/checkin",json={"name":"Inventado","code":code}).status_code==403
    with pytest.raises(RaceError): attendance.check_in(db,sid,{"name":"Inventado","code":code},clock())
    with closing(store.connect(db)) as conn:
        assert conn.execute("SELECT COUNT(*) FROM blocked_addresses").fetchone()[0]==0
        assert conn.execute("SELECT COUNT(*) FROM registration_attempts").fetchone()[0]==0
    assert c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json={"code":code,"operation_id":str(uuid4())}).status_code==201


def test_expiry_even_with_existing_cookie_and_success(race_api):
    app,c,db,sid,entry,clock=race_api;csrf,code=go(race_api)
    fields={"code":code,"operation_id":str(uuid4())}
    assert c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json=fields).status_code==201
    clock.advance(7197)
    assert c.get(f"/api/races/{sid}/me").status_code==410
    assert c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":csrf},json=fields).status_code==410
    assert c.get(f"/api/sessions/{sid}/race",headers=HEAD).json["total"]==1


def test_teacher_is_required_and_host_cannot_poison_entry(race_api):
    app,c,db,sid,entry,clock=race_api
    for method,path in (("post","/api/sessions/races"),("get",f"/api/sessions/{sid}/race"),("post",f"/api/sessions/{sid}/race/start"),("post",f"/api/sessions/{sid}/race/release"),("post",f"/api/sessions/{sid}/race/close")):
        response=getattr(c,method)(path,json={})
        assert response.status_code==401 and response.headers["Cache-Control"]=="no-store"
    state=c.get(f"/api/sessions/{sid}/race",headers={**HEAD,"X-Forwarded-Host":"evil.example"}).json
    assert state["joinUrl"].startswith("http://localhost/")
    assert "entrySecret" not in state and TOKEN not in state["joinUrl"]


def test_https_cookie_does_not_follow_forged_proto(tmp_path,clock):
    app=create_app(tmp_path/"https.sqlite",token=TOKEN,now=clock,trust_cloudflare=True,race_origin="https://school.example")
    c=app.test_client()
    created=c.post("/api/sessions/races",headers=HEAD,json={},base_url="https://school.example").json
    sid=created["id"]
    entry=c.get(f"/api/sessions/{sid}/race",headers=HEAD,base_url="https://school.example").json["joinUrl"].split("#join=")[1]
    joined=c.post(f"/api/races/{sid}/join",headers={**ENTRY_HEAD,"X-Forwarded-Proto":"http"},json={"join_secret":entry,"roster_key":"jimena-duran"},base_url="https://school.example")
    assert "Secure" in joined.headers["Set-Cookie"]


def test_cleanup_runs_even_on_unauthorized_teacher_request(race_api):
    app,c,db,sid,entry,clock=race_api;enter(race_api)
    clock.advance(7200)
    assert c.get(f"/api/sessions/{sid}/race").status_code==401
    with closing(store.connect(db)) as conn:
        assert conn.execute("SELECT COUNT(*) FROM race_access").fetchone()[0]==0
        assert store.get_race(conn,sid)["closed_at"] is not None


def test_chunked_body_and_unicode_false_credentials_are_rejected(race_api):
    from io import BytesIO
    app,c,db,sid,entry,clock=race_api;csrf,code=go(race_api)
    payload=b"x"*2049
    response=c.open(f"/api/races/{sid}/attempt",method="POST",headers={"X-Race-CSRF":csrf},environ_overrides={"CONTENT_TYPE":"application/json","CONTENT_LENGTH":"","wsgi.input":BytesIO(payload),"wsgi.input_terminated":True})
    assert response.status_code==413
    assert c.post(f"/api/races/{sid}/attempt",headers={"X-Race-CSRF":"ñ"},json={"code":code}).status_code==403
    assert c.get(f"/api/races/{sid}/me").json["remaining"]==3


def test_missing_origin_configuration_does_not_create_a_class(tmp_path, clock):
    db = tmp_path / "no-origin.sqlite"
    client = create_app(db, token=TOKEN, now=clock).test_client()
    assert client.post("/api/sessions/races", headers=HEAD, json={}).status_code == 503
    with closing(store.connect(db)) as conn:
        assert conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0] == 0


def test_technical_error_logs_no_secret_and_replay_keeps_reservation(race_api, monkeypatch, caplog):
    app, client, db, sid, entry, clock = race_api
    csrf, code = go(race_api)
    def fail(*args):
        raise RuntimeError("secret-body-" + code + "-" + entry)
    monkeypatch.setattr(races, "is_valid_code", fail)
    fields = {"operation_id": str(uuid4()), "code": code}
    response = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json=fields)
    assert response.status_code == 500
    assert "RuntimeError" in caplog.text
    assert code not in caplog.text and entry not in caplog.text
    assert code not in response.get_data(as_text=True)
    replay = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json=fields)
    assert replay.status_code == 202 and replay.json["remaining"] == 2


def test_startup_cleans_all_expired_races_but_preserves_live_race(race_api):
    app, client, db, sid, entry, clock = race_api
    csrf, code = go(race_api)
    fields = {"operation_id": str(uuid4()), "code": code}
    assert client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json=fields).status_code == 201
    second = races.prepare(db, "Otra vencida", clock)["id"]
    second_entry = races.teacher_state(db, second, clock)["entrySecret"]
    second_token = races.join(db, second, second_entry, "jimena-duran", None, clock)[1]
    races.start(db, second, clock)
    clock.advance(3)
    races._reserve(db, second, second_token, {"operation_id": str(uuid4()), "code": "1234"}, clock)
    clock.advance(7197)
    active = races.prepare(db, "Vigente", clock)["id"]
    active_entry = races.teacher_state(db, active, clock)["entrySecret"]
    active_token = races.join(db, active, active_entry, "jimena-duran", None, clock)[1]
    create_app(db, token=TOKEN, now=clock, race_origin="http://localhost", race_local_http=True)
    with closing(store.connect(db)) as conn:
        for expired in (sid, second):
            assert store.get_race(conn, expired)["closed_at"] is not None
            assert conn.execute("SELECT COUNT(*) FROM race_access WHERE session_id=?", (expired,)).fetchone()[0] == 0
            assert conn.execute("SELECT COUNT(*) FROM race_operations WHERE session_id=?", (expired,)).fetchone()[0] == 0
        assert len(store.ranking(conn, sid)) == 1
    assert races.me(db, active, active_token, clock)["remaining"] == 3


def test_malformed_unicode_code_spends_attempt_without_evaluation(race_api, monkeypatch):
    app, client, db, sid, entry, clock = race_api
    csrf, code = go(race_api)
    calls = []
    monkeypatch.setattr(races, "is_valid_code", lambda *args: calls.append(1) or True)
    response = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, data=json.dumps({"operation_id": str(uuid4()), "code": "\ud800"}), content_type="application/json")
    assert response.status_code == 422
    assert calls == []
    assert client.get(f"/api/races/{sid}/me").json["remaining"] == 2
