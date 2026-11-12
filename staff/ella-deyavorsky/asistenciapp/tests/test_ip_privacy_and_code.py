"""El código no se complica y la IP no se mezcla con los nombres · spec 006 · CA-13, CA-15, CA-16."""

import sqlite3

from asistencia.domain.codes import WINDOW_SECONDS, code_for


def block_the_ip(client, teacher):
    """Abre una clase y hace 6 registros seguidos: el 6.º bloquea la IP."""
    sid = client.post("/api/sessions", json={"title": "Clase"}, headers=teacher).get_json()["id"]
    code = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]
    for i in range(6):
        client.post(f"/api/s/{sid}/checkin", json={"name": f"Alumno {i}", "code": code})
    return sid


def test_code_is_still_four_digits_rotating_every_thirty_seconds():  # CA-13
    assert WINDOW_SECONDS == 30
    start = (1_800_000_000 // WINDOW_SECONDS) * WINDOW_SECONDS
    code = code_for(b"secreto", start)
    assert len(code) == 4 and code.isdigit()
    assert code_for(b"secreto", start + WINDOW_SECONDS - 0.001) == code


def test_ip_is_only_in_the_two_ip_tables(client, teacher, tmp_path):  # CA-15
    block_the_ip(client, teacher)
    with sqlite3.connect(tmp_path / "test.db") as conn:
        for table in ("sessions", "checkins", "config"):
            rows = conn.execute(f"SELECT * FROM {table}").fetchall()
            assert "127.0.0.1" not in str(rows), table
        assert conn.execute("SELECT ip FROM blocked_ips").fetchall() == [("127.0.0.1",)]


def test_export_does_not_contain_the_ip(client, teacher):  # CA-16
    sid = block_the_ip(client, teacher)
    csv = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "Alumno 0" in csv and "127.0.0.1" not in csv
