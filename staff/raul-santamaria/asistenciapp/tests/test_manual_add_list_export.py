"""Lista, quitar y CSV tras alta manual. CA-04, CA-06."""

from tests.test_api import open_session


def test_manual_add_appears_in_csv_and_can_be_removed(client, teacher):
    sid = open_session(client, teacher)
    res = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "María Manual"},
        headers=teacher,
    )
    assert res.status_code == 201

    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["total"] == 1
    assert detail["checkins"][0]["name"] == "María Manual"

    csv = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "Nombre" in csv and "Hora" in csv
    assert "María Manual" in csv

    checkin_id = detail["checkins"][0]["id"]
    assert (
        client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=teacher).status_code
        == 200
    )
    after = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert after["total"] == 0
    csv_after = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "María Manual" not in csv_after
