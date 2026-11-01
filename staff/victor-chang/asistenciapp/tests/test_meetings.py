"""Tests de attendance/domain/meetings.py · spec 004 CA-14 (enlace mal escrito); plan §2.3, §2.12."""

import pytest

from attendance.domain.errors import MeetingLinkInvalidError
from attendance.domain.meetings import parse_meeting_code


@pytest.mark.parametrize(
    "text",
    [
        "abc-defg-hij",
        "  abc-defg-hij  ",
        "ABC-DEFG-HIJ",
        "https://meet.google.com/abc-defg-hij",
        "https://meet.google.com/abc-defg-hij?authuser=1",
        "https://meet.google.com/abc-defg-hij?pli=1&authuser=0",
        "http://meet.google.com/abc-defg-hij",
        "meet.google.com/abc-defg-hij",
        "https://meet.google.com/abc-defg-hij/",
        "  HTTPS://MEET.GOOGLE.COM/ABC-DEFG-HIJ  ",
    ],
)
def test_valid_links_and_codes(text):
    assert parse_meeting_code(text) == "abc-defg-hij"


@pytest.mark.parametrize(
    "text",
    [
        "",
        "   ",
        "abc-defg-hi",  # le falta una letra
        "abcd-efg-hij",
        "abc_defg_hij",
        "abcdefghij",
        "123-4567-890",
        "abc-defg-hij extra",
        "https://meet.google.com/",
        "https://meet.google.com/lookup/abc",
        "https://zoom.us/j/abc-defg-hij",  # otra plataforma
        "https://meet.google.com.evil.com/abc-defg-hij",  # dominio que se parece
        "https://evil.com/meet.google.com/abc-defg-hij",
        "https://meet.google.com/abc-defg-hij#x",
        "аbc-defg-hij",  # la primera "а" es cirílica
        "Kbc-defg-hij",  # signo Kelvin: .lower() lo convertiría en una "k" ASCII
    ],
)
def test_invalid_links_and_codes(text):  # CA-14 (enlace mal escrito)
    with pytest.raises(MeetingLinkInvalidError):
        parse_meeting_code(text)
