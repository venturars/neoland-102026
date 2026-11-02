"""Tests de attendance/domain/codes.py · CA-03, CA-05, CA-06."""

from attendance.domain.codes import WINDOW_SECONDS, code_for, is_valid_code, seconds_left

SECRET = b"secreto-de-prueba"
T0 = 1_000_000 * WINDOW_SECONDS  # inicio exacto de una ventana


def test_code_has_four_digits():
    for i in range(200):
        code = code_for(SECRET, T0 + i * WINDOW_SECONDS)
        assert len(code) == 4 and code.isdigit()


def test_same_secret_and_window_give_same_code():
    assert code_for(SECRET, T0) == code_for(SECRET, T0 + WINDOW_SECONDS - 1)


def test_code_changes_with_next_window():  # CA-03
    assert code_for(SECRET, T0) != code_for(SECRET, T0 + WINDOW_SECONDS)


def test_different_secrets_give_different_codes():
    assert code_for(SECRET, T0) != code_for(b"otro-secreto", T0)


def test_current_code_is_valid():  # CA-04
    assert is_valid_code(SECRET, code_for(SECRET, T0), T0 + 5)


def test_previous_code_is_valid():  # CA-05
    previous = code_for(SECRET, T0)
    assert is_valid_code(SECRET, previous, T0 + WINDOW_SECONDS + 5)


def test_code_from_two_windows_ago_is_rejected():  # CA-06
    old = code_for(SECRET, T0)
    assert not is_valid_code(SECRET, old, T0 + 2 * WINDOW_SECONDS)


def test_wrong_code_is_rejected():  # CA-06
    wrong = "0000" if code_for(SECRET, T0) != "0000" else "1111"
    assert not is_valid_code(SECRET, wrong, T0)


def test_code_with_spaces_is_accepted():
    assert is_valid_code(SECRET, f" {code_for(SECRET, T0)} ", T0)


def test_non_ascii_digits_are_rejected():
    # compare_digest lanza TypeError con texto no ASCII: no debe llegar hasta ahí.
    assert not is_valid_code(SECRET, "١٢٣٤", T0)
    assert not is_valid_code(SECRET, "12é4", T0)


def test_seconds_left():
    assert seconds_left(T0) == WINDOW_SECONDS
    assert seconds_left(T0 + 10) == WINDOW_SECONDS - 10
    assert seconds_left(T0 + WINDOW_SECONDS - 0.5) == 1
