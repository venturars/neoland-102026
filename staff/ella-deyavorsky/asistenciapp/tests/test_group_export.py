"""Tests de la descarga de una sesión con grupo · spec 007 · CA-07, CA-10, CA-18."""

from datetime import timezone

from asistencia.export import to_group_csv

ROSTER = [{"name": "Ana García"}, {"name": "Luis Pérez"}, {"name": "=SUMA(1)"}]
CHECKINS = [
    {"name": "Luis Pérez", "kind": "listed", "checked_at": "2026-10-27T10:05:00.000+00:00"},
    {"name": "+Marta", "kind": "new", "checked_at": "2026-10-27T10:07:00.000+00:00"},
]


def lines(text):
    return text.lstrip("﻿").split("\r\n")[:-1]


def test_group_csv_has_state_and_time():  # CA-07
    text = to_group_csv("SDD 2º A", "2026-10-27T10:00:00.000+00:00", ROSTER, CHECKINS, tz=timezone.utc)
    assert text.startswith("﻿")
    assert lines(text) == [
        "Grupo;Fecha;Nombre;Estado;Hora",
        "SDD 2º A;27/10/2026 10:00;Ana García;ausente;",
        "SDD 2º A;27/10/2026 10:00;Luis Pérez;presente;27/10/2026 10:05:00",
        "SDD 2º A;27/10/2026 10:00;'=SUMA(1);ausente;",
        "SDD 2º A;27/10/2026 10:00;'+Marta;nuevo;27/10/2026 10:07:00",
    ]


def test_group_name_is_also_protected():  # CA-18
    text = to_group_csv("=GRUPO", "2026-10-27T10:00:00.000+00:00", [{"name": "Ana"}], [], tz=timezone.utc)
    assert lines(text)[1].startswith("'=GRUPO;")


def test_group_download_through_the_api(client, teacher):  # CA-07, CA-10
    group = client.post("/api/groups", json={"name": "SDD", "students": ["Ana", "Luis"]}, headers=teacher).get_json()
    sid = client.post("/api/sessions", json={"title": "Clase", "groupId": group["id"]}, headers=teacher).get_json()["id"]
    res = client.get(f"/api/sessions/{sid}/export", headers=teacher)
    rows = lines(res.get_data(as_text=True))
    assert rows[0] == "Grupo;Fecha;Nombre;Estado;Hora"
    assert [r.split(";")[2:4] for r in rows[1:]] == [["Ana", "ausente"], ["Luis", "ausente"]]
