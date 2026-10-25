"""Tests de attendance/infra/google_meet.py · spec 004 CA-14; plan §2.3."""

import copy
import json
import logging
import stat
from pathlib import Path

import pytest
import requests
from google.auth.exceptions import RefreshError
from google_auth_oauthlib.flow import WSGITimeoutError
from oauthlib.oauth2.rfc6749.errors import AccessDeniedError

from attendance.domain.errors import (
    MeetingEndedError,
    MeetingLinkInvalidError,
    MeetingNotVisibleError,
    MeetLoginNotCompletedError,
    MeetNotConfiguredError,
    MeetPermissionMissingError,
    MeetServiceError,
)
from attendance.domain.participants import Who
from attendance.infra import google_meet
from attendance.infra.google_meet import MEET_SCOPE, SCOPES, GoogleMeet, parse_meeting_code

# ---------- Enlace o código de la reunión (T08) ----------


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


# ---------- Cliente de la API (T09) ----------
# Solo se simula lo externo (ARCHITECTURE.md · T4): la sesión HTTP, las credenciales de Google y su flujo OAuth.
# Las respuestas salen de tests/fixtures/meet/ (spike, con nombres e identificadores cambiados).

FIXTURES = Path(__file__).parent / "fixtures" / "meet"
RECORDS = json.loads((FIXTURES / "conference_records_by_code.json").read_text())
PARTICIPANTS = json.loads((FIXTURES / "participants_ended.json").read_text())
SELF_SUB = "1002"  # en el ejemplo, "Persona 2" (users/1002) es quien ha iniciado sesión


def in_progress(records):
    """El ejemplo de reuniones, con la primera todavía en curso (sin endTime)."""
    data = copy.deepcopy(records)
    del data["conferenceRecords"][0]["endTime"]
    return data


class FakeResponse:
    def __init__(self, status=200, body=None):
        self.status_code = status
        self.ok = status < 400
        self._body = {} if body is None else body

    def json(self):
        if isinstance(self._body, Exception):
            raise self._body
        return self._body


class FakeHttp:
    """Sustituye a requests.Session: responde según la URL y apunta cada llamada."""

    def __init__(self, records=RECORDS, participants=(PARTICIPANTS,), userinfo=None, fail=None):
        self.records = records
        self.participants = list(participants)
        self.userinfo = {"sub": SELF_SUB} if userinfo is None else userinfo
        self.fail = fail  # (trozo de URL, respuesta o excepción)
        self.calls = []

    def get(self, url, params=None, headers=None, timeout=None):
        self.calls.append({"url": url, "params": dict(params or {}), "headers": headers, "timeout": timeout})
        if self.fail and self.fail[0] in url:
            if isinstance(self.fail[1], Exception):
                raise self.fail[1]
            return self.fail[1]
        if url.endswith("/userinfo"):
            return FakeResponse(body=self.userinfo)
        if url.endswith("/conferenceRecords"):
            return FakeResponse(body=self.records)
        if url.endswith("/participants"):
            page = len([c for c in self.calls if c["url"].endswith("/participants")]) - 1
            return FakeResponse(body=self.participants[min(page, len(self.participants) - 1)])
        raise AssertionError(f"URL inesperada: {url}")

    def urls(self, ending):
        return [c for c in self.calls if c["url"].endswith(ending)]


class FakeCredentials:
    def __init__(self, scopes=SCOPES, valid=True, refresh_error=None):
        self.token = "token-falso"
        self.valid = valid
        self.granted_scopes = list(scopes)
        self.scopes = list(scopes)
        self.refresh_error = refresh_error
        self.refreshed = False

    def refresh(self, _request):
        if self.refresh_error:
            raise self.refresh_error
        self.refreshed, self.valid = True, True

    def to_json(self):
        return json.dumps({"falso": True})


@pytest.fixture
def client_file(tmp_path):
    path = tmp_path / "google-client.json"
    path.write_text("{}")
    return path


@pytest.fixture
def make_meet(tmp_path, client_file):
    """Crea un GoogleMeet con HTTP falso; apunta cuántas veces se abre el inicio de sesión."""
    logins = []

    def make(http=None, credentials=None):
        def login(_client_path):
            logins.append(1)
            return credentials or FakeCredentials()

        meet = GoogleMeet(client_file, tmp_path / "google-token.json", http=http or FakeHttp(), login=login)
        return meet, logins

    return make


def test_everyone_in_an_ended_meeting(make_meet):  # CA-18, CA-19, CA-20
    http = FakeHttp()
    meet, _ = make_meet(http)
    attendance = meet.participants("abc-defg-hij", Who.EVERYONE)
    assert attendance.names == ("Persona 1",)  # sin el profesor (CA-09)
    assert attendance.ended is True
    assert attendance.started_at == RECORDS["conferenceRecords"][0]["startTime"]
    assert http.urls("/conferenceRecords")[0]["params"]["filter"] == 'space.meeting_code = "abc-defg-hij"'
    assert "filter" not in http.urls("/participants")[0]["params"]  # todos los que estuvieron


def test_now_in_an_ended_meeting_is_refused(make_meet):  # CA-21
    http = FakeHttp()
    meet, _ = make_meet(http)
    with pytest.raises(MeetingEndedError):
        meet.participants("abc-defg-hij", Who.NOW)
    assert http.urls("/participants") == []  # ni siquiera se piden


def test_now_in_a_meeting_in_progress(make_meet):  # CA-05
    http = FakeHttp(records=in_progress(RECORDS))
    meet, _ = make_meet(http)
    attendance = meet.participants("abc-defg-hij", Who.NOW)
    assert attendance.ended is False
    assert http.urls("/participants")[0]["params"]["filter"] == "latest_end_time IS NULL"


def record(name, start, end=None):
    data = {"name": f"conferenceRecords/{name}", "startTime": start, "space": "spaces/ejemplo"}
    if end:
        data["endTime"] = end
    return data


def test_the_meeting_in_progress_is_chosen_first(make_meet):  # CA-20: la misma sala cada día
    records = {
        "conferenceRecords": [
            record("ayer", "2026-10-22T07:00:00Z", "2026-10-22T15:00:00Z"),
            record("hoy", "2026-10-23T07:00:00Z"),
            record("anteayer", "2026-10-21T07:00:00Z", "2026-10-21T15:00:00Z"),
        ]
    }
    http = FakeHttp(records=records)
    meet, _ = make_meet(http)
    attendance = meet.participants("abc-defg-hij", Who.NOW)
    assert http.urls("/participants")[0]["url"].endswith("conferenceRecords/hoy/participants")
    assert attendance.started_at == "2026-10-23T07:00:00Z"


def test_otherwise_the_latest_ended_meeting(make_meet):  # CA-20
    records = {
        "conferenceRecords": [
            record("anteayer", "2026-10-21T07:00:00Z", "2026-10-21T15:00:00Z"),
            record("ayer", "2026-10-22T07:00:00Z", "2026-10-22T15:00:00Z"),
        ]
    }
    http = FakeHttp(records=records)
    meet, _ = make_meet(http)
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert http.urls("/participants")[0]["url"].endswith("conferenceRecords/ayer/participants")


@pytest.mark.parametrize("records", [{}, {"conferenceRecords": []}])
def test_no_meeting_this_account_can_see(make_meet, records):  # CA-13, CA-14
    meet, _ = make_meet(FakeHttp(records=records))
    with pytest.raises(MeetingNotVisibleError):
        meet.participants("abc-defg-hij", Who.EVERYONE)


def test_only_display_names_leave_the_module(make_meet):  # CA-17
    page = copy.deepcopy(PARTICIPANTS)
    page["participants"].append({"name": "x/3", "phoneUser": {"displayName": "Persona 3"}})
    page["participants"].append({"name": "x/4", "signedinUser": {"user": "users/1004", "displayName": " "}})
    meet, _ = make_meet(FakeHttp(participants=[page]))
    names = meet.participants("abc-defg-hij", Who.EVERYONE).names
    assert names == ("Persona 1", "Persona 3", " ")  # tal cual; los limpia names_from_platform
    assert all(isinstance(n, str) for n in names)


def test_pages_are_followed(make_meet):
    first = {"participants": [{"anonymousUser": {"displayName": "Persona A"}}], "nextPageToken": "p2"}
    second = {"participants": [{"anonymousUser": {"displayName": "Persona B"}}]}
    http = FakeHttp(participants=[first, second])
    meet, _ = make_meet(http)
    assert meet.participants("abc-defg-hij", Who.EVERYONE).names == ("Persona A", "Persona B")
    assert http.urls("/participants")[1]["params"]["pageToken"] == "p2"


def test_at_most_ten_pages(make_meet):  # F4: un límite también para las páginas
    endless = {"participants": [{"anonymousUser": {"displayName": "Persona"}}], "nextPageToken": "otra"}
    http = FakeHttp(participants=[endless])
    meet, _ = make_meet(http)
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert len(http.urls("/participants")) == 10


def test_every_call_has_a_timeout(make_meet):  # F4
    http = FakeHttp()
    meet, _ = make_meet(http)
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert http.calls and all(c["timeout"] == 10 for c in http.calls)
    assert all(c["headers"] == {"Authorization": "Bearer token-falso"} for c in http.calls)


def google_error(status, reason=None):
    error = {"code": status, "status": "PERMISSION_DENIED", "message": "texto de Google con datos"}
    if reason:
        error["details"] = [{"@type": "type.googleapis.com/google.rpc.ErrorInfo", "reason": reason}]
    return FakeResponse(status, {"error": error})


@pytest.mark.parametrize(
    "failure, error",
    [
        (google_error(403, "SERVICE_DISABLED"), MeetNotConfiguredError),  # API desactivada (spike)
        (google_error(403, "ACCESS_TOKEN_SCOPE_INSUFFICIENT"), MeetPermissionMissingError),
        (google_error(403), MeetingNotVisibleError),
        (google_error(404), MeetingNotVisibleError),
        (FakeResponse(500, {"error": {}}), MeetServiceError),
        (FakeResponse(200, ValueError("no es JSON")), MeetServiceError),
        (requests.Timeout(), MeetServiceError),
        (requests.ConnectionError(), MeetServiceError),
    ],
)
def test_google_failures_become_named_errors(make_meet, failure, error):  # plan §2.7
    meet, _ = make_meet(FakeHttp(fail=("/conferenceRecords", failure)))
    with pytest.raises(error):
        meet.participants("abc-defg-hij", Who.EVERYONE)


def test_nothing_from_google_reaches_the_logs(make_meet, caplog):  # E7
    meet, _ = make_meet(FakeHttp(fail=("/participants", google_error(500))))
    with caplog.at_level(logging.DEBUG), pytest.raises(MeetServiceError):
        meet.participants("abc-defg-hij", Who.EVERYONE)
    assert "500" in caplog.text  # el código sí, para poder diagnosticar
    assert "texto de Google" not in caplog.text and "Persona" not in caplog.text


def test_missing_client_file(tmp_path):  # plan §2.7
    meet = GoogleMeet(tmp_path / "no-existe.json", tmp_path / "token.json", http=FakeHttp(), login=None)
    with pytest.raises(MeetNotConfiguredError):
        meet.participants("abc-defg-hij", Who.EVERYONE)


def test_permission_without_meet_is_refused_and_not_saved(make_meet, tmp_path):  # plan §2.4
    meet, _ = make_meet(credentials=FakeCredentials(scopes=["openid"]))
    with pytest.raises(MeetPermissionMissingError):
        meet.participants("abc-defg-hij", Who.EVERYONE)
    assert not (tmp_path / "google-token.json").exists()


def test_the_permission_is_saved_only_for_the_user(make_meet, tmp_path):  # CA-12, X
    meet, logins = make_meet()
    meet.participants("abc-defg-hij", Who.EVERYONE)
    token = tmp_path / "google-token.json"
    assert stat.S_IMODE(token.stat().st_mode) == 0o600
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert len(logins) == 1  # la segunda toma no vuelve a pedir permiso


def test_a_saved_permission_is_reused(make_meet, tmp_path, monkeypatch):  # CA-12
    (tmp_path / "google-token.json").write_text("{}")
    saved = FakeCredentials(valid=False)  # caducado el acceso, pero se puede renovar
    monkeypatch.setattr(google_meet.Credentials, "from_authorized_user_file", lambda *_a: saved)
    meet, logins = make_meet()
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert saved.refreshed and logins == []


def test_an_expired_permission_asks_again(make_meet, tmp_path, monkeypatch):  # CA-12, spec P7 (permiso semanal)
    token = tmp_path / "google-token.json"
    token.write_text("{}")
    expired = FakeCredentials(valid=False, refresh_error=RefreshError("invalid_grant"))
    monkeypatch.setattr(google_meet.Credentials, "from_authorized_user_file", lambda *_a: expired)
    meet, logins = make_meet()
    meet.participants("abc-defg-hij", Who.EVERYONE)
    assert logins == [1]  # se vuelve a pedir, como la primera vez
    assert token.exists()  # y se guarda el permiso nuevo


def test_a_rejected_token_is_forgotten(make_meet, tmp_path):
    meet, _ = make_meet(FakeHttp(fail=("/userinfo", FakeResponse(401, {"error": {}}))))
    with pytest.raises(MeetLoginNotCompletedError):
        meet.participants("abc-defg-hij", Who.EVERYONE)
    assert not (tmp_path / "google-token.json").exists()


class FakeFlow:
    def __init__(self, error=None, credentials=None):
        self.error = error
        self.credentials = credentials
        self.kwargs = {}

    def run_local_server(self, **kwargs):
        self.kwargs = kwargs
        if self.error:
            raise self.error
        return self.credentials


def scope_warning(granted):
    warning = Warning("Scope has changed")
    warning.new_scope = granted
    return warning


@pytest.mark.parametrize(
    "error, expected",
    [
        (WSGITimeoutError("sin respuesta"), MeetLoginNotCompletedError),  # 2 minutos sin aceptar
        (AccessDeniedError(), MeetLoginNotCompletedError),  # pulsó "Cancelar"
        (scope_warning(["openid"]), MeetPermissionMissingError),  # sin la casilla de Meet
    ],
)
def test_browser_login_failures(monkeypatch, client_file, error, expected):  # CA-11, plan §2.4
    flow = FakeFlow(error=error)
    monkeypatch.setattr(google_meet.InstalledAppFlow, "from_client_secrets_file", lambda *_a, **_k: flow)
    with pytest.raises(expected):
        google_meet.run_browser_login(client_file)


def test_browser_login_waits_two_minutes_on_a_free_port(monkeypatch, client_file):  # F4
    flow = FakeFlow(credentials=FakeCredentials())
    monkeypatch.setattr(google_meet.InstalledAppFlow, "from_client_secrets_file", lambda *_a, **_k: flow)
    google_meet.run_browser_login(client_file)
    assert flow.kwargs["port"] == 0 and flow.kwargs["timeout_seconds"] == 120


def test_scopes():
    assert MEET_SCOPE == "https://www.googleapis.com/auth/meetings.space.readonly"
    assert SCOPES == [MEET_SCOPE, "openid"]  # sin email (P4)
