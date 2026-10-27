"""Tests de asistencia/domain/passes.py · spec 007 · CA-11, CA-14, CA-16."""

from asistencia.domain.passes import (
    PASS_EXPIRED,
    PASS_USED,
    PASS_SECONDS,
    issue_pass,
    pass_is_valid,
    receipt_for,
    receipt_is_valid,
)

SECRET = b"secreto-de-la-sesion"
OTHER = b"otro-secreto"
NOW = 1_800_000_000.0


def test_fresh_pass_is_valid():  # CA-11
    assert pass_is_valid(SECRET, issue_pass(SECRET, NOW), NOW)


def test_pass_lasts_two_minutes():  # CA-11, CA-16
    token = issue_pass(SECRET, NOW)
    assert PASS_SECONDS == 120
    assert pass_is_valid(SECRET, token, NOW + 119)
    assert not pass_is_valid(SECRET, token, NOW + 121)


def test_tampered_or_foreign_pass_is_not_valid():
    token = issue_pass(SECRET, NOW)
    issued, signature = token.split(".")
    assert not pass_is_valid(SECRET, f"{int(issued) + 60}.{signature}", NOW + 100)
    assert not pass_is_valid(OTHER, token, NOW)
    assert not pass_is_valid(SECRET, "basura", NOW)
    assert not pass_is_valid(SECRET, None, NOW)


def test_receipt_is_valid_only_for_its_checkin_and_session():  # CA-14
    receipt = receipt_for(SECRET, 7)
    assert receipt_is_valid(SECRET, 7, receipt)
    assert not receipt_is_valid(SECRET, 8, receipt)
    assert not receipt_is_valid(OTHER, 7, receipt)
    assert not receipt_is_valid(SECRET, 7, "")


def test_pass_expired_message():  # CA-16
    assert PASS_EXPIRED == "Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor."


def test_pass_used_message():  # CA-21
    assert PASS_USED == "Este pase ya se ha usado: escribe el código otra vez."
