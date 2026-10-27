"""CA-07: existencia y cierre se comprueban antes de leer campos del cuerpo."""

import pytest


@pytest.mark.parametrize("state,status,message", [
    ("missing", 404, "Esta clase no existe. Revisa el enlace."),
    ("closed", 409, "La asistencia de esta clase ya está cerrada."),
])
@pytest.mark.parametrize("payload", [[1], "texto", 1, True])
def test_session_errors_precede_payload_fields(client, teacher, state, status, message, payload):
    sid = "missing"
    if state == "closed":
        sid = client.post("/api/sessions", json={}, headers=teacher).get_json()["id"]
        client.post(f"/api/sessions/{sid}/close", headers=teacher)
    response = client.post(f"/api/s/{sid}/checkin", json=payload)
    assert response.status_code == status
    assert response.get_json() == {"error": message}
