"""Tests de attendance/infra/google_auth.py · spec 004 CA-11, CA-12; plan §2.4.

Solo se simulan las credenciales de Google y su flujo OAuth (ARCHITECTURE.md · T4).
"""

import stat

import pytest
from google.auth.exceptions import RefreshError
from google_auth_oauthlib.flow import WSGITimeoutError
from google_fakes import FakeCredentials
from oauthlib.oauth2.rfc6749.errors import AccessDeniedError

from attendance.domain.errors import MeetLoginNotCompletedError, MeetNotConfiguredError, MeetPermissionMissingError
from attendance.infra import google_auth
from attendance.infra.google_auth import MEET_SCOPE, SCOPES, GooglePermission


@pytest.fixture
def client_file(tmp_path):
    path = tmp_path / "google-client.json"
    path.write_text("{}")
    return path


@pytest.fixture
def make_permission(tmp_path, client_file):
    """Crea un GooglePermission con un inicio de sesión falso; apunta cuántas veces se abre."""
    logins = []

    def make(credentials=None):
        def login(_client_path):
            logins.append(1)
            return credentials or FakeCredentials()

        return GooglePermission(client_file, tmp_path / "google-token.json", login=login), logins

    return make


def test_missing_client_file(tmp_path):  # plan §2.7
    permission = GooglePermission(tmp_path / "no-existe.json", tmp_path / "token.json")
    with pytest.raises(MeetNotConfiguredError):
        permission.credentials()


def test_permission_without_meet_is_refused_and_not_saved(make_permission, tmp_path):  # plan §2.4
    permission, _ = make_permission(credentials=FakeCredentials(scopes=["openid"]))
    with pytest.raises(MeetPermissionMissingError):
        permission.credentials()
    assert not (tmp_path / "google-token.json").exists()


def test_the_permission_is_saved_only_for_the_user(make_permission, tmp_path):  # CA-12, X
    permission, logins = make_permission()
    permission.credentials()
    token = tmp_path / "google-token.json"
    assert stat.S_IMODE(token.stat().st_mode) == 0o600
    permission.credentials()
    assert len(logins) == 1  # la segunda toma no vuelve a pedir permiso


def test_a_saved_permission_is_reused(make_permission, tmp_path, monkeypatch):  # CA-12
    (tmp_path / "google-token.json").write_text("{}")
    saved = FakeCredentials(valid=False)  # caducado el acceso, pero se puede renovar
    monkeypatch.setattr(google_auth.Credentials, "from_authorized_user_file", lambda *_a: saved)
    permission, logins = make_permission()
    assert permission.credentials() is saved
    assert saved.refreshed and logins == []


def test_an_expired_permission_asks_again(make_permission, tmp_path, monkeypatch):  # CA-12, spec P7 (permiso semanal)
    token = tmp_path / "google-token.json"
    token.write_text("{}")
    expired = FakeCredentials(valid=False, refresh_error=RefreshError("invalid_grant"))
    monkeypatch.setattr(google_auth.Credentials, "from_authorized_user_file", lambda *_a: expired)
    permission, logins = make_permission()
    permission.credentials()
    assert logins == [1]  # se vuelve a pedir, como la primera vez
    assert token.exists()  # y se guarda el permiso nuevo


def test_a_damaged_permission_file_asks_again(make_permission, tmp_path, monkeypatch):
    token = tmp_path / "google-token.json"
    token.write_text("no es json")

    def damaged(*_args):
        raise ValueError("archivo dañado")

    monkeypatch.setattr(google_auth.Credentials, "from_authorized_user_file", damaged)
    permission, logins = make_permission()
    permission.credentials()
    assert logins == [1]


def test_forget_removes_the_saved_permission(make_permission, tmp_path):
    permission, logins = make_permission()
    permission.credentials()
    permission.forget()
    assert not (tmp_path / "google-token.json").exists()
    permission.credentials()
    assert len(logins) == 2


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
    monkeypatch.setattr(google_auth.InstalledAppFlow, "from_client_secrets_file", lambda *_a, **_k: flow)
    with pytest.raises(expected):
        google_auth.run_browser_login(client_file)


def test_browser_login_waits_two_minutes_on_a_free_port(monkeypatch, client_file):  # F4
    flow = FakeFlow(credentials=FakeCredentials())
    monkeypatch.setattr(google_auth.InstalledAppFlow, "from_client_secrets_file", lambda *_a, **_k: flow)
    google_auth.run_browser_login(client_file)
    assert flow.kwargs["port"] == 0 and flow.kwargs["timeout_seconds"] == 120


def test_scopes():
    assert MEET_SCOPE == "https://www.googleapis.com/auth/meetings.space.readonly"
    assert SCOPES == [MEET_SCOPE, "openid"]  # sin email (P4)
