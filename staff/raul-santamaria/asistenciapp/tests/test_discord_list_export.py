"""Lista en vivo, quitar y CSV con registro Discord. CA-07 a CA-09."""

from asistencia.usecases import attendance
from tests.test_api import open_session


def test_discord_checkin_appears_in_teacher_view_and_csv(client, teacher, clock):
    sid = open_session(client, teacher)
    assert client.post(f"/api/sessions/{sid}/discord", headers=teacher).status_code == 200

    path = client.application.config["DB_PATH"]
    loaded = attendance.teacher_view(path, sid, clock)
    row, created = attendance.check_in_discord(
        path, "Luis Discord", loaded["code"], clock
    )
    assert created is True
    assert row["name"] == "Luis Discord"

    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["total"] == 1
    assert detail["checkins"][0]["name"] == "Luis Discord"

    csv = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "Nombre" in csv and "Hora" in csv
    assert "Luis Discord" in csv

    checkin_id = detail["checkins"][0]["id"]
    assert (
        client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=teacher).status_code
        == 200
    )
    after = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert after["total"] == 0
