"""Tests de attendance/domain/errors.py · spec 005 CA-05; spec 004 · plan §2.7."""

import pytest

from attendance.domain import errors
from attendance.domain.names import MAX_LENGTH
from attendance.domain.sessions import MAX_TITLE_LENGTH

USER_ERRORS = [
    errors.EmptyNameError,
    errors.NameTooLongError,
    errors.TitleTooLongError,
    errors.InvalidCodeError,
    errors.SessionClosedError,
    errors.SessionNotFoundError,
    errors.CheckinNotFoundError,
    errors.NotCodeSessionError,
    errors.NotAutomaticSessionError,
    errors.MeetingLinkInvalidError,
    errors.MeetingNotVisibleError,
    errors.MeetingEndedError,
    errors.MeetPermissionMissingError,
    errors.MeetLoginNotCompletedError,
    errors.MeetNotConfiguredError,
    errors.MeetServiceError,
]

# Mensajes de la spec 004 (plan §2.7, v2.1), tal cual: los ve el profesor.
MEET_MESSAGES = {
    errors.NotCodeSessionError: "Esta clase no usa código: la asistencia se toma automáticamente desde Meet.",
    errors.NotAutomaticSessionError: "Esta clase usa código: los alumnos se registran con el enlace y el código.",
    errors.MeetingLinkInvalidError: "Pega el enlace o el código de la reunión de Meet (p. ej. abc-defg-hij).",
    errors.MeetingNotVisibleError: (
        "No hay ninguna reunión con ese enlace que esta cuenta pueda ver. Revisa el enlace, "
        "entra en la reunión con esta cuenta o pide al organizador que tome la asistencia."
    ),
    errors.MeetingEndedError: (
        "Esta reunión ya terminó. Usa «Todos los que han estado» para registrar a quienes estuvieron."
    ),
    errors.MeetPermissionMissingError: (
        "Falta el permiso de Google Meet. Vuelve a tomar la asistencia y marca la casilla "
        "«Ver información sobre tus reuniones de Google Meet»."
    ),
    errors.MeetLoginNotCompletedError: (
        "No se completó el permiso de Google. Vuelve a tomar la asistencia y acepta en la ventana de Google."
    ),
    errors.MeetNotConfiguredError: (
        "Falta preparar la app en Google Cloud. Sigue los pasos de «Modo automático» en el README."
    ),
    errors.MeetServiceError: "Google Meet no responde ahora mismo. Inténtalo de nuevo en unos segundos.",
}


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
    [
        errors.NameTooLongError,
        errors.TitleTooLongError,
        errors.SessionClosedError,
        errors.CheckinNotFoundError,
        errors.MeetingNotVisibleError,
        errors.MeetingEndedError,
        errors.MeetPermissionMissingError,
        errors.MeetLoginNotCompletedError,
        errors.MeetNotConfiguredError,
        errors.MeetServiceError,
    ],
)
def test_messages_say_what_to_do(error):  # CA-05: el mensaje tiene dos frases, qué pasa y qué hacer
    assert error.MESSAGE.count(". ") >= 1


def test_name_too_long_message_uses_the_real_limit():
    assert f"{MAX_LENGTH} caracteres" in errors.NameTooLongError.MESSAGE


def test_title_too_long_message_uses_the_real_limit():
    assert f"{MAX_TITLE_LENGTH} caracteres" in errors.TitleTooLongError.MESSAGE


@pytest.mark.parametrize("error, message", MEET_MESSAGES.items(), ids=lambda v: getattr(v, "__name__", "msg"))
def test_meet_messages_are_the_ones_in_the_plan(error, message):  # spec 004 · plan §2.7
    assert error.MESSAGE == message
