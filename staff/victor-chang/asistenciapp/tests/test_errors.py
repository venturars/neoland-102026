"""Tests de attendance/domain/errors.py · spec 005 CA-05."""

import pytest

from attendance.domain import errors
from attendance.domain.names import MAX_LENGTH

USER_ERRORS = [
    errors.EmptyNameError,
    errors.NameTooLongError,
    errors.InvalidCodeError,
    errors.SessionClosedError,
    errors.SessionNotFoundError,
    errors.CheckinNotFoundError,
]


@pytest.mark.parametrize("error", USER_ERRORS)
def test_user_errors_share_the_base(error):
    assert issubclass(error, errors.AppError)


@pytest.mark.parametrize("error", USER_ERRORS)
def test_each_error_has_its_own_message(error):  # CA-05
    assert error.MESSAGE
    assert error.MESSAGE != errors.AppError.MESSAGE
    assert str(error()) == error.MESSAGE


@pytest.mark.parametrize(
    "error",
    [errors.NameTooLongError, errors.SessionClosedError, errors.CheckinNotFoundError],
)
def test_messages_say_what_to_do(error):  # CA-05: el mensaje tiene dos frases, qué pasa y qué hacer
    assert error.MESSAGE.count(". ") >= 1


def test_name_too_long_message_uses_the_real_limit():
    assert f"{MAX_LENGTH} caracteres" in errors.NameTooLongError.MESSAGE
