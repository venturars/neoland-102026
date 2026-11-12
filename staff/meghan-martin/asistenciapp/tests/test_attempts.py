"""Regla del tope de intentos. CA-01."""

# These tests only ask the "too many?" question. They do not start the app.
# assert means "this must be true, or the test fails."

import pytest

from asistencia.domain.attempts import Banned, over_limit

# The sentence a blocked person sees.
NOTICE = "Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista."


def test_five_per_second_and_twenty_per_minute_are_allowed():
    # 5 tries in one second, and 20 in one minute, are still allowed.
    # False means "not over the limit."
    assert over_limit(5, 20) is False


def test_sixth_in_a_second_is_over_the_limit():
    # 6 tries in one second is too many, even if the minute count is only 6.
    # True means "over the limit."
    assert over_limit(6, 6) is True


def test_twenty_first_in_a_minute_is_over_the_limit():
    # 21 tries in one minute is too many, even if they were not 6 in one second.
    assert over_limit(1, 21) is True


def test_banned_says_the_computer_is_blocked():
    # Creating a Banned signal must carry the Spanish sentence, word for word.
    with pytest.raises(Banned) as caught:
        raise Banned()
    assert str(caught.value) == NOTICE
