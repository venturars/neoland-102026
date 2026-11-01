"""Ayudas compartidas por los tests de la entrada web (test_web_*.py)."""


def open_session(client, teacher, title="Clase de prueba"):
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 201
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def check_in(client, sid, name, code):
    return client.post(f"/api/s/{sid}/checkin", json={"name": name, "code": code})


def total_of(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"]
