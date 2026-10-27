"""Tests del registro del alumno en una sesión con grupo y de los recibos · spec 007."""

import sqlite3

import pytest

PASS_EXPIRED = "Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor."
PASS_USED = "Este pase ya se ha usado: escribe el código otra vez."


@pytest.fixture
def group_session(client, teacher):
    """Sesión abierta con el grupo «SDD» (Ana García, Ella García, Luis Pérez)."""
    group = client.post(
        "/api/groups",
        json={"name": "SDD", "students": ["Ana García", "Ella García", "Luis Pérez"]},
        headers=teacher,
    ).get_json()
    return client.post("/api/sessions", json={"title": "Clase", "groupId": group["id"]}, headers=teacher).get_json()["id"]


def code_of(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def unlock(client, sid, code):
    return client.post(f"/api/s/{sid}/unlock", json={"code": code})


def register(client, sid, pass_, name, is_new=False, confirm=False):
    return client.post(
        f"/api/s/{sid}/checkin",
        json={"pass": pass_, "name": name, "isNew": is_new, "confirmSimilar": confirm},
    )


def pass_for(client, teacher, sid):
    return unlock(client, sid, code_of(client, teacher, sid)).get_json()["pass"]


def attempts(tmp_path):
    with sqlite3.connect(tmp_path / "test.db") as conn:
        return conn.execute("SELECT COUNT(*) FROM ip_attempts").fetchone()[0]


# ---------- la lista no sale sin código (CA-03) ----------

def test_public_info_says_group_without_names(client, group_session):  # CA-03
    assert client.get(f"/api/s/{group_session}").get_json() == {"title": "Clase", "open": True, "hasGroup": True}


def test_unlock_with_wrong_code_reveals_nothing(client, group_session):  # CA-03
    res = unlock(client, group_session, "0000x")
    assert res.status_code == 422
    assert set(res.get_json()) == {"error"}


def test_unlock_with_code_returns_pass_and_list(client, teacher, group_session):  # RF-11, RF-12
    data = unlock(client, group_session, code_of(client, teacher, group_session)).get_json()
    assert data["pass"]
    assert data["roster"] == [
        {"name": "Ana García", "registered": False},
        {"name": "Ella García", "registered": False},
        {"name": "Luis Pérez", "registered": False},
    ]


def test_unlock_in_quick_session_is_rejected(client, teacher):
    sid = client.post("/api/sessions", json={"title": "Rápida"}, headers=teacher).get_json()["id"]
    assert unlock(client, sid, code_of(client, teacher, sid)).status_code == 409


# ---------- elegir el nombre (CA-04) ----------

def test_register_from_list_marks_the_name(client, teacher, group_session, clock):  # CA-04
    p = pass_for(client, teacher, group_session)
    res = register(client, group_session, p, "Ana García")
    assert res.status_code == 201
    assert res.get_json()["name"] == "Ana García"
    roster = client.post(f"/api/s/{group_session}/roster", json={"pass": p}).get_json()["roster"]
    assert {"name": "Ana García", "registered": True} in roster
    again = register(client, group_session, pass_for(client, teacher, group_session), "ana garcia")
    assert again.status_code == 409
    assert again.get_json()["error"].startswith("Este nombre ya está registrado")


def test_name_not_in_list_is_rejected(client, teacher, group_session):
    res = register(client, group_session, pass_for(client, teacher, group_session), "Pedro")
    assert res.status_code == 422


def test_register_without_pass_in_group_session_is_rejected(client, teacher, group_session):
    res = client.post(
        f"/api/s/{group_session}/checkin", json={"name": "Ana García", "code": code_of(client, teacher, group_session)}
    )
    assert res.status_code == 401


# ---------- nuevos (CA-05, CA-15) ----------

def test_similar_new_name_asks_and_then_registers(client, teacher, group_session):  # CA-05
    p = pass_for(client, teacher, group_session)
    res = register(client, group_session, p, "Ella G.", is_new=True)
    assert res.status_code == 409
    assert res.get_json() == {"error": "¿Quisiste decir Ella García?", "suggestion": "Ella García"}
    res = register(client, group_session, p, "Ella G.", is_new=True, confirm=True)
    assert res.status_code == 201
    view = client.get(f"/api/sessions/{group_session}", headers=teacher).get_json()
    assert [n["name"] for n in view["newcomers"]] == ["Ella G."]


def test_new_name_equal_to_list_is_rejected(client, teacher, group_session):
    res = register(client, group_session, pass_for(client, teacher, group_session), "luis perez", is_new=True)
    assert res.status_code == 409
    assert "suggestion" not in res.get_json()


def test_second_identical_new_name_is_rejected(client, teacher, group_session, clock):  # CA-15
    register(client, group_session, pass_for(client, teacher, group_session), "Ella G.", is_new=True, confirm=True)
    clock.advance(1)
    res = register(client, group_session, pass_for(client, teacher, group_session), "ella g.", is_new=True, confirm=True)
    assert res.status_code == 409
    assert "suggestion" not in res.get_json()


# ---------- el pase de 2 minutos (CA-11, CA-16) ----------

def test_register_a_minute_later_counts_one_attempt(client, teacher, group_session, clock, tmp_path):  # CA-11
    p = pass_for(client, teacher, group_session)
    clock.advance(60)
    assert register(client, group_session, p, "Luis Pérez").status_code == 201
    assert attempts(tmp_path) == 1


def test_expired_pass_is_rejected_with_message(client, teacher, group_session, clock):  # CA-16
    p = pass_for(client, teacher, group_session)
    clock.advance(121)
    res = register(client, group_session, p, "Luis Pérez")
    assert res.status_code == 401
    assert res.get_json()["error"] == PASS_EXPIRED


def test_roster_with_pass_does_not_count_attempts(client, teacher, group_session, tmp_path):
    p = pass_for(client, teacher, group_session)
    for _ in range(3):
        assert client.post(f"/api/s/{group_session}/roster", json={"pass": p}).status_code == 200
    assert attempts(tmp_path) == 1


# ---------- recibos: liberar el navegador (CA-14) ----------

def registration(client, sid, cid, receipt):
    return client.get(f"/api/s/{sid}/checkins/{cid}?r={receipt}")


def test_quick_checkin_returns_receipt_only_when_created(client, teacher, clock):  # CA-14
    sid = client.post("/api/sessions", json={"title": "Rápida"}, headers=teacher).get_json()["id"]
    first = client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": code_of(client, teacher, sid)})
    assert first.status_code == 201
    assert {"id", "receipt", "name", "checkedAt"} <= first.get_json().keys()
    clock.advance(10)
    again = client.post(f"/api/s/{sid}/checkin", json={"name": "ana", "code": code_of(client, teacher, sid)})
    assert again.status_code == 200
    assert set(again.get_json()) == {"already", "name", "checkedAt"}


def test_receipt_tells_when_quick_registration_is_removed(client, teacher):  # CA-14, RF-22
    sid = client.post("/api/sessions", json={"title": "Rápida"}, headers=teacher).get_json()["id"]
    data = client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": code_of(client, teacher, sid)}).get_json()
    assert registration(client, sid, data["id"], data["receipt"]).get_json() == {"exists": True}
    client.delete(f"/api/sessions/{sid}/checkins/{data['id']}", headers=teacher)
    assert registration(client, sid, data["id"], data["receipt"]).get_json() == {"exists": False}


def test_released_name_frees_the_browser(client, teacher, group_session, clock):  # CA-14, RF-19
    p = pass_for(client, teacher, group_session)
    data = register(client, group_session, p, "Ana García").get_json()
    assert registration(client, group_session, data["id"], data["receipt"]).get_json() == {"exists": True}
    client.delete(f"/api/sessions/{group_session}/checkins/{data['id']}", headers=teacher)
    assert registration(client, group_session, data["id"], data["receipt"]).get_json() == {"exists": False}
    clock.advance(5)
    # El pase anterior ya está usado: el alumno escribe el código otra vez (spec v1.2, CA-21).
    assert register(client, group_session, p, "Ana García").status_code == 409
    assert register(client, group_session, pass_for(client, teacher, group_session), "Ana García").status_code == 201


def test_fake_receipt_is_404(client, teacher, group_session):  # CA-14
    data = register(client, group_session, pass_for(client, teacher, group_session), "Ana García").get_json()
    assert registration(client, group_session, data["id"], "falso").status_code == 404


# ---------- un pase, un registro (spec v1.2, CA-21) ----------

def listed_names(client, teacher, sid):
    view = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    return [c["name"] for c in view["checkins"]]


def test_used_pass_is_rejected_for_another_name(client, teacher, group_session, clock):  # CA-21
    p = pass_for(client, teacher, group_session)
    assert register(client, group_session, p, "Ana García").status_code == 201
    clock.advance(5)
    res = register(client, group_session, p, "Luis Pérez")
    assert res.status_code == 409
    assert res.get_json()["error"] == PASS_USED
    assert res.get_json()["needCode"] is True
    assert listed_names(client, teacher, group_session) == ["Ana García"]


def test_used_pass_is_rejected_for_a_new_name(client, teacher, group_session):  # CA-21
    p = pass_for(client, teacher, group_session)
    assert register(client, group_session, p, "Ana García").status_code == 201
    res = register(client, group_session, p, "Persona Nueva", is_new=True, confirm=True)
    assert res.status_code == 409 and res.get_json()["error"] == PASS_USED
    assert listed_names(client, teacher, group_session) == ["Ana García"]


def test_thirty_names_with_one_pass_register_only_one(client, teacher, clock):  # CA-21
    names = [f"Alumno {i:02d}" for i in range(30)]
    group = client.post("/api/groups", json={"name": "Grande", "students": names}, headers=teacher).get_json()
    sid = client.post("/api/sessions", json={"groupId": group["id"]}, headers=teacher).get_json()["id"]
    p = pass_for(client, teacher, sid)
    statuses = [register(client, sid, p, n).status_code for n in names]
    assert statuses.count(201) == 1
    assert len(listed_names(client, teacher, sid)) == 1


def test_failed_check_in_does_not_use_the_pass(client, teacher, group_session, clock):  # CA-21, RF-11
    register(client, group_session, pass_for(client, teacher, group_session), "Ana García")
    clock.advance(1)
    p = pass_for(client, teacher, group_session)
    assert register(client, group_session, p, "Ana García").status_code == 409  # ya registrado
    assert register(client, group_session, p, "Ella G.", is_new=True).status_code == 409  # parecido
    assert register(client, group_session, p, "Pedro").status_code == 422  # no está en la lista
    assert register(client, group_session, p, "Luis Pérez").status_code == 201


def test_roster_still_works_with_a_used_pass(client, teacher, group_session):
    p = pass_for(client, teacher, group_session)
    register(client, group_session, p, "Ana García")
    assert client.post(f"/api/s/{group_session}/roster", json={"pass": p}).status_code == 200
