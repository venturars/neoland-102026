"""Mensajes y token del bot Discord. CA-02 a CA-05, CA-11."""

import pytest

from asistencia.domain.codes import code_for
from asistencia.usecases import attendance
from bot_discord import (
    MSG_ALREADY,
    MSG_NO_TOKEN,
    MSG_REGISTERED,
    load_token,
    reply_for_check_in,
)


class Clock:
    def __init__(self, t: float = 1_800_000_000.0):
        self.t = t

    def __call__(self) -> float:
        return self.t


def test_load_token_missing_file(tmp_path):
    with pytest.raises(SystemExit) as exc:
        load_token(tmp_path / "no-existe.txt")
    assert "discord_token" in str(exc.value)


def test_load_token_empty_file(tmp_path):
    path = tmp_path / "discord_token.txt"
    path.write_text("  \n", encoding="utf-8")
    with pytest.raises(SystemExit) as exc:
        load_token(path)
    assert MSG_NO_TOKEN.split(".")[0] in str(exc.value) or "token" in str(exc.value).lower()


def test_load_token_reads_line(tmp_path):
    path = tmp_path / "discord_token.txt"
    path.write_text(" mi-token-secreto \n", encoding="utf-8")
    assert load_token(path) == "mi-token-secreto"


def test_reply_without_discord_enabled(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    attendance.prepare(path)
    attendance.create_session(path, "Clase", clock)
    text = reply_for_check_in(path, "Ana", "1234", clock)
    assert "Discord" in text or "asistencia" in text.lower()


def test_reply_registered_and_already(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    attendance.prepare(path)
    loaded = attendance.create_session(path, "Clase", clock)
    attendance.enable_discord(path, loaded["id"], clock)
    code = code_for(loaded["secret"], clock())

    first = reply_for_check_in(path, "Ana Discord", code, clock)
    second = reply_for_check_in(path, "Ana Discord", code, clock)

    assert "Ana Discord" in first
    assert first.startswith(MSG_REGISTERED.split("{")[0])
    assert second.startswith(MSG_ALREADY.split("{")[0])


def test_reply_bad_code(tmp_path):
    path = tmp_path / "a.db"
    clock = Clock()
    attendance.prepare(path)
    loaded = attendance.create_session(path, "Clase", clock)
    attendance.enable_discord(path, loaded["id"], clock)
    text = reply_for_check_in(path, "Ana", "0000", clock)
    assert "código" in text.lower() or "caducado" in text.lower()
