"""QR SVG local: permisos, fase y enlace real de la carrera."""
from xml.etree import ElementTree as ET
import pytest
from app import create_app
from asistencia.qr import generate_qr

@pytest.fixture
def qr_env(tmp_path, clock):
    app=create_app(tmp_path/"qr.sqlite",token="teacher",now=clock,race_origin="http://localhost",race_local_http=True)
    c=app.test_client();headers={"X-Teacher-Token":"teacher"}
    sid=c.post("/api/sessions/races",headers=headers,json={}).json["id"]
    return c,headers,sid,clock

def test_generator_produces_local_black_white_svg():
    root=ET.fromstring(generate_qr("https://example.test/race.html?r=sample#join=sample"))
    assert root.tag=="{http://www.w3.org/2000/svg}svg"
    assert root.find("{http://www.w3.org/2000/svg}path") is not None
    assert not any(el.tag.endswith("script") or any(k.lower().startswith("on") or k.endswith("href") for k in el.attrib) for el in root.iter())

@pytest.mark.parametrize("headers",[{}, {"X-Teacher-Token":"wrong"}])
def test_qr_requires_teacher(qr_env,headers):
    c,_,sid,_=qr_env
    result=c.get(f"/api/sessions/{sid}/race/qr.svg",headers=headers)
    assert result.status_code==401 and result.headers["Cache-Control"]=="no-store"

def test_qr_encodes_only_authorized_lobby_link(qr_env,monkeypatch):
    import asistencia.race_http as http
    c,headers,sid,_=qr_env
    expected=c.get(f"/api/sessions/{sid}/race",headers=headers).json["joinUrl"]
    seen=[];original=http.generate_qr
    def generating(link):seen.append(link);return original(link)
    monkeypatch.setattr(http,"generate_qr",generating)
    result=c.get(f"/api/sessions/{sid}/race/qr.svg",headers=headers)
    assert result.status_code==200 and result.mimetype=="image/svg+xml"
    assert result.headers["Cache-Control"]=="no-store"
    ET.fromstring(result.data)
    assert seen==[expected] and "teacher" not in expected

@pytest.mark.parametrize("phase",["start","close","expired"])
def test_qr_revoked_after_lobby(qr_env,phase):
    c,headers,sid,clock=qr_env
    if phase=="start":
        entry=c.get(f"/api/sessions/{sid}/race",headers=headers).json["joinUrl"].split("#join=")[1]
        c.post(f"/api/races/{sid}/join",headers={"X-Race-Request":"1"},json={"join_secret":entry,"roster_key":"jimena-duran"})
        c.post(f"/api/sessions/{sid}/race/start",headers=headers,json={})
    elif phase=="close":c.post(f"/api/sessions/{sid}/race/close",headers=headers,json={})
    else:clock.advance(7200)
    result=c.get(f"/api/sessions/{sid}/race/qr.svg",headers=headers)
    assert result.status_code==410 and result.headers["Cache-Control"]=="no-store"

def test_qr_does_not_convert_normal_or_missing_class(qr_env):
    c,headers,_,_=qr_env
    normal=c.post("/api/sessions",headers=headers,json={}).json["id"]
    for sid in (normal,"missing"):
        assert c.get(f"/api/sessions/{sid}/race/qr.svg",headers=headers).status_code==404
