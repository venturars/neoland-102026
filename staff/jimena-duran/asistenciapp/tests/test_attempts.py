"""Límites de intentos y aviso de bloqueo de la spec 006."""

import pytest

from asistencia.domain.attempts import Banned, over_limit


@pytest.mark.parametrize("second,minute,blocked", [
    (0, 0, False), (5, 20, False), (6, 6, True), (1, 21, True), (6, 21, True),
])
def test_attempt_limits(second, minute, blocked):
    assert over_limit(second, minute) is blocked


def test_ban_message():
    assert str(Banned()) == "Esta dirección queda bloqueada por haber superado los intentos permitidos."
