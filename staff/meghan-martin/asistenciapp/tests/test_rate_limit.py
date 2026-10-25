"""Límite de intentos de pasar lista por ordenador. CA-01 a CA-07."""

# These tests pretend to be a student using the page.
# Each test gets a fresh app, so one test cannot block the next one.
# 422 means "wrong code." 429 means "this computer is blocked."
# 201 means "checked in." 200 means "the page opened fine."

import sqlite3

from app import create_app
from tests.conftest import TOKEN

NOTICE = "Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista."
BAD_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."


def open_session(client, teacher, title="Clase de prueba"):
    # The teacher starts a class. The answer includes the class id.
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 201
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    # Read the 4-digit code the teacher can see for this class.
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def attempt(client, sid, name, code, address, body=None, headers=None):
    # Send one check-in as if it came from that computer.
    # address is the computer we count. Extra typed fields do not replace it.
    payload = {"name": name, "code": code}
    if body:
        payload.update(body)
    return client.post(
        f"/api/s/{sid}/checkin",
        json=payload,
        headers=headers,
        environ_base={"REMOTE_ADDR": address},
    )


def test_five_bad_codes_in_one_second_are_not_a_block_and_the_sixth_is(client, teacher):
    # Five wrong codes at the same moment are still just a wrong code.
    # The sixth blocks the computer and does not mark anyone present.
    sid = open_session(client, teacher)
    address = "203.0.113.5"
    for _ in range(5):
        res = attempt(client, sid, "Ana", "abcd", address)
        assert res.status_code == 422
        assert res.get_json()["error"] == BAD_CODE
    res = attempt(client, sid, "Ana", "abcd", address)
    assert res.status_code == 429
    assert res.get_json()["error"] == NOTICE
    # The teacher list is still empty.
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 0


def test_the_twenty_first_attempt_in_a_minute_blocks(client, teacher, clock):
    # Twenty wrong tries, spaced out so they are not 6 in one second, are allowed.
    # The 21st try in that minute blocks the computer.
    sid = open_session(client, teacher)
    address = "203.0.113.20"
    for _ in range(20):
        res = attempt(client, sid, "Ana", "abcd", address)
        assert res.status_code == 422
        clock.advance(0.3)  # move the clock forward by 0.3 seconds
    res = attempt(client, sid, "Ana", "abcd", address)
    assert res.status_code == 429
    assert res.get_json()["error"] == NOTICE


def test_one_valid_check_in_under_the_limit_is_saved(client, teacher):
    # One try with the real code checks the student in, as before.
    sid = open_session(client, teacher)
    res = attempt(
        client, sid, "Meghan Martin", current_code(client, teacher, sid), "203.0.113.2"
    )
    assert res.status_code == 201
    assert res.get_json()["name"] == "Meghan Martin"
    assert "checkedAt" in res.get_json()  # the answer includes the time


def test_reading_the_list_does_not_count(client, teacher):
    # Opening the student page and the teacher list 30 times does not count.
    # A real check-in after that still works.
    sid = open_session(client, teacher)
    address = "203.0.113.30"
    for _ in range(30):
        assert (
            client.get(f"/api/s/{sid}", environ_base={"REMOTE_ADDR": address}).status_code
            == 200
        )
        assert (
            client.get(
                f"/api/sessions/{sid}",
                headers=teacher,
                environ_base={"REMOTE_ADDR": address},
            ).status_code
            == 200
        )
    res = attempt(client, sid, "Meghan Martin", current_code(client, teacher, sid), address)
    assert res.status_code == 201


def test_a_blocked_computer_cannot_check_in_with_the_current_code(client, teacher):
    # After the computer is blocked, even the real code does not check anyone in.
    sid = open_session(client, teacher)
    address = "203.0.113.40"
    for _ in range(6):
        attempt(client, sid, "Ana", "abcd", address)  # the 6th try causes the block
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), address)
    assert res.status_code == 429
    assert res.get_json()["error"] == NOTICE
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 0


def test_the_block_survives_opening_the_app_again(tmp_path, clock, teacher):
    # Close the app and open it again on the same file. The computer stays blocked.
    path = tmp_path / "asistencia.db"
    address = "203.0.113.50"
    first = create_app(path, token=TOKEN, now=clock)
    client = first.test_client()
    sid = open_session(client, teacher)
    for _ in range(6):
        attempt(client, sid, "Ana", "abcd", address)

    # A second app, same file, is the "I closed it and opened it again" step.
    again = create_app(path, token=TOKEN, now=clock).test_client()
    res = attempt(again, sid, "Ana", current_code(again, teacher, sid), address)
    assert res.status_code == 429
    assert res.get_json()["error"] == NOTICE


def test_a_typed_address_does_not_change_the_block(tmp_path, clock, teacher):
    # Sending a different address in the form or in a header does not move the block.
    # The computer that actually connected is the one that gets blocked.
    path = tmp_path / "asistencia.db"
    app = create_app(path, token=TOKEN, now=clock)
    client = app.test_client()
    sid = open_session(client, teacher)
    real = "203.0.113.8"  # the computer that really connected
    other = "198.51.100.9"  # a different computer
    headers = {"X-Forwarded-For": other, "CF-Connecting-IP": "198.51.100.10"}
    for _ in range(6):
        res = attempt(
            client,
            sid,
            "Ana",
            "abcd",
            real,
            body={"address": "198.51.100.11"},  # a fake address typed into the form
            headers=headers,  # more fake addresses sent beside the form
        )
    assert res.status_code == 429  # the real computer is blocked

    # The other computer can still check in with the real code.
    saved = attempt(client, sid, "Meghan Martin", current_code(client, teacher, sid), other)
    assert saved.status_code == 201

    # The real computer is still blocked, even if it types the other address.
    still = attempt(
        client,
        sid,
        "Luis",
        current_code(client, teacher, sid),
        real,
        body={"address": other},
        headers=headers,
    )
    assert still.status_code == 429
    assert still.get_json()["error"] == NOTICE

    # The saved block list contains only the real computer.
    conn = sqlite3.connect(path)
    try:
        blocked = [row[0] for row in conn.execute("SELECT address FROM blocked_computers")]
    finally:
        conn.close()
    assert blocked == [real]
