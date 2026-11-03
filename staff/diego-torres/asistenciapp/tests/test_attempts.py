"""Regla del máximo de intentos. CA-01."""

import pytest

from asistencia.domain.attempts import Banned, over_limit


def test_five_per_second_and_twenty_per_minute_are_allowed():
    assert over_limit(5, 20) is False


def test_sixth_in_a_second_is_over_the_limit():
    assert over_limit(6, 6) is True


def test_twenty_first_in_a_minute_is_over_the_limit():
    assert over_limit(1, 21) is True


def test_banned_says_the_address_is_blocked():
    with pytest.raises(Banned) as caught:
        raise Banned()
    assert (
        str(caught.value)
        == "Esta dirección queda bloqueada por haber superado los intentos permitidos."
    )
