"""Quién falta cuando la clase pasa lista."""

from pathlib import Path

NOTICE = "Elige tu nombre de la lista."
CLASS = [
    "Ella Deyavorsky",
    "Meghan Martin",
    "Esther Patino",
    "Miguel Rodriguez",
    "Sergio Cortes",
    "Sergio Moras",
    "Luis Duque",
    "Diego Molero",
    "Diego Torres",
    "Manuel Diaz",
    "Jimena Duran",
    "Jose Miguel",
    "Maria Osipuk",
    "Raul Santamaria",
    "Victor Chang",
]


def open_session(client, teacher):
    res = client.post("/api/sessions", json={"title": "Clase de prueba"}, headers=teacher)
    assert res.status_code == 201
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def test_before_anyone_checks_in_everyone_is_missing(client, teacher):
    sid = open_session(client, teacher)
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["missing"] == CLASS
    assert data["checkins"] == []


def test_choosing_a_name_removes_that_person_from_the_missing_list(client, teacher):
    sid = open_session(client, teacher)
    res = client.post(
        f"/api/s/{sid}/checkin",
        json={"name": "Meghan Martin", "code": current_code(client, teacher, sid)},
    )
    assert res.status_code == 201
    assert res.get_json()["name"] == "Meghan Martin"
    assert "checkedAt" in res.get_json()
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert "Meghan Martin" not in data["missing"]
    assert [c["name"] for c in data["checkins"]] == ["Meghan Martin"]
    assert len(data["missing"]) == len(CLASS) - 1


def test_a_name_outside_the_class_is_not_saved(client, teacher):
    sid = open_session(client, teacher)
    res = client.post(
        f"/api/s/{sid}/checkin",
        json={"name": "Otra Persona", "code": current_code(client, teacher, sid)},
    )
    assert res.status_code == 400
    assert res.get_json()["error"] == NOTICE
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["checkins"] == []
    assert data["missing"] == CLASS


def test_the_student_page_gets_the_names_and_no_photo(client, teacher):
    sid = open_session(client, teacher)
    data = client.get(f"/api/s/{sid}").get_json()
    assert data["names"] == CLASS
    assert "photo" not in data
    assert "checkins" not in data
    page = Path(__file__).resolve().parents[1].joinpath("static", "alumno.html").read_text(encoding="utf-8")
    assert "<img" not in page
