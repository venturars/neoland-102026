"""Regresiones de revisión 008: caducidad tras lecturas y bloqueo SQL por fase."""
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
import sqlite3
from threading import Event
from uuid import uuid4

import pytest

from app import create_app
from asistencia.usecases import races
from asistencia.storage import races as store
from asistencia.domain.race import RaceError


class Clock:
    def __init__(self):
        self.value = 1800000000.0
    def __call__(self):
        return self.value


@pytest.fixture
def race(tmp_path):
    clock = Clock()
    db = tmp_path / "review.sqlite"
    client = create_app(db, token="test-teacher", now=clock, race_origin="http://localhost", race_local_http=True).test_client()
    teacher = {"X-Teacher-Token": "test-teacher"}
    sid = client.post("/api/sessions/races", headers=teacher, json={}).json["id"]
    entry = client.get(f"/api/sessions/{sid}/race", headers=teacher).json["joinUrl"].split("#join=")[1]
    own = client.post(f"/api/races/{sid}/join", headers={"X-Race-Request": "1"}, json={"join_secret": entry, "roster_key": "jimena-duran"}).json
    credential = client.get_cookie(f"race_{sid}", path=f"/api/races/{sid}").value
    client.post(f"/api/sessions/{sid}/race/start", headers=teacher, json={})
    clock.value += 3
    code = client.get(f"/api/sessions/{sid}/race", headers=teacher).json["code"]
    return db, clock, client, sid, own["csrfToken"], credential, code


def test_private_result_rechecks_expiry_after_waiting_for_read(race, monkeypatch):
    db, clock, client, sid, csrf, credential, code = race
    success = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json={"operation_id": str(uuid4()), "code": code})
    assert success.status_code == 201
    clock.value = 1800007199.0
    ready, proceed, entering_select = Event(), Event(), Event()
    original = store.get_race

    class ReadProxy:
        def __init__(self, conn):
            self.conn = conn
        def execute(self, sql, *args):
            entering_select.set()
            return self.conn.execute(sql, *args)

    def gated_read(conn, session_id):
        ready.set()
        assert proceed.wait(2)
        return original(ReadProxy(conn), session_id)

    monkeypatch.setattr(store, "get_race", gated_read)
    with closing(sqlite3.connect(db, isolation_level=None)) as blocker:
        with ThreadPoolExecutor(1) as pool:
            future = pool.submit(races.me, db, sid, credential, clock)
            try:
                assert ready.wait(2)
                blocker.execute("BEGIN EXCLUSIVE")
                proceed.set()
                assert entering_select.wait(2)
                clock.value = 1800007201.0
            finally:
                proceed.set()
                blocker.rollback()
            with pytest.raises(RaceError) as rejected:
                future.result(timeout=3)
            assert rejected.value.reason == 'access_expired'


def test_exclusive_lock_before_reservation_is_retryable_503(race):
    db, clock, client, sid, csrf, credential, code = race
    with closing(sqlite3.connect(db, isolation_level=None)) as blocker:
        blocker.execute("BEGIN EXCLUSIVE")
        try:
            response = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json={"operation_id": str(uuid4()), "code": code})
        finally:
            blocker.rollback()
    assert races.me(db, sid, credential, clock)["remaining"] == 3
    assert response.status_code == 503
    assert response.headers["Retry-After"] == "1"


@pytest.mark.parametrize("kind", ["me", "lobby"])
@pytest.mark.parametrize("overrun", [0, 1])
def test_private_read_rechecks_expiry_after_loading_payload(race, monkeypatch, kind, overrun):
    db, clock, client, sid, csrf, credential, code = race
    if kind == "lobby":
        sid = races.prepare(db, "Lobby", clock)["id"]
        entry = races.teacher_state(db, sid, clock)["entrySecret"]
    expires = races.teacher_state(db, sid, clock)["expiresAt"]
    clock.value = expires - 1
    name = "operations" if kind == "me" else "slots"
    original = getattr(store, name)
    def loading(*args):
        result = original(*args)
        clock.value = expires + overrun
        return result
    monkeypatch.setattr(store, name, loading)
    with pytest.raises(RaceError) as rejected:
        if kind == "me":
            races.me(db, sid, credential, clock)
        else:
            races.lobby(db, sid, entry, clock)
    assert rejected.value.reason == 'access_expired'
    with closing(store.connect(db)) as conn:
        assert store.get_race(conn, sid)["closed_at"] is not None
        assert not conn.execute("SELECT 1 FROM race_access WHERE session_id=?", (sid,)).fetchall()


def test_exclusive_lock_during_b_connection_keeps_reservation_unconfirmed(race, monkeypatch):
    db, clock, client, sid, csrf, credential, code = race
    fields = {"operation_id": str(uuid4()), "code": code}
    execution = races._reserve(db, sid, credential, fields, clock)
    calls = []
    monkeypatch.setattr(races, "is_valid_code", lambda *args: calls.append(1) or True)
    with closing(sqlite3.connect(db, isolation_level=None)) as blocker:
        blocker.execute("BEGIN EXCLUSIVE")
        try:
            result = execution()
        finally:
            blocker.rollback()
    assert result[1] == 'unconfirmed'
    assert result[0]["operationState"] == "unconfirmed"
    assert races.me(db, sid, credential, clock)["remaining"] == 2
    assert races.attempt(db, sid, credential, fields, "127.0.0.1", clock)[1] == 'unconfirmed'
    assert calls == []


def test_commit_lock_after_evaluation_is_not_an_unspent_retry(race, monkeypatch):
    db, clock, client, sid, csrf, credential, code = race
    fields = {"operation_id": str(uuid4()), "code": code}
    calls = []
    with closing(sqlite3.connect(db, isolation_level=None)) as reader:
        def evaluating(*args):
            calls.append(1)
            reader.execute("BEGIN")
            reader.execute("SELECT id FROM sessions WHERE id=?", (sid,)).fetchall()
            return True
        monkeypatch.setattr(races, "is_valid_code", evaluating)
        try:
            with pytest.raises(sqlite3.OperationalError) as failed:
                races.attempt(db, sid, credential, fields, "127.0.0.1", clock)
            assert failed.value.sqlite_errorcode & 255 == sqlite3.SQLITE_BUSY
        finally:
            reader.rollback()
    assert races.me(db, sid, credential, clock)["remaining"] == 2
    assert races.attempt(db, sid, credential, fields, "127.0.0.1", clock)[1] == 'unconfirmed'
    assert calls == [1]
    assert races.teacher_state(db, sid, clock)["total"] == 0


@pytest.mark.parametrize("operation", ["cleanup", "me"])
def test_busy_during_read_query_is_retryable_without_spending(race, monkeypatch, operation):
    db, clock, client, sid, csrf, credential, code = race
    failure = sqlite3.OperationalError("database is locked")
    failure.sqlite_errorcode = sqlite3.SQLITE_BUSY
    name = "expired" if operation == "cleanup" else "get_race"
    def failing(*args):
        raise failure
    with monkeypatch.context() as scoped:
        scoped.setattr(store, name, failing)
        with pytest.raises(RaceError) as rejected:
            if operation == "cleanup":
                races.cleanup(db, clock)
            else:
                races.me(db, sid, credential, clock)
        assert rejected.value.reason == 'storage_busy'
    assert races.me(db, sid, credential, clock)["remaining"] == 3


def test_non_contention_sql_error_is_not_mislabeled_as_retryable(race, monkeypatch):
    db, clock, client, sid, csrf, credential, code = race
    failure = sqlite3.OperationalError("review failure")
    failure.sqlite_errorcode = sqlite3.SQLITE_IOERR
    def failing(*args):
        raise failure
    with monkeypatch.context() as scoped:
        scoped.setattr(store, "expired", failing)
        response = client.post(f"/api/races/{sid}/attempt", headers={"X-Race-CSRF": csrf}, json={"operation_id": str(uuid4()), "code": code})
    assert response.status_code == 500
    assert "Retry-After" not in response.headers
    assert races.me(db, sid, credential, clock)["remaining"] == 3


def test_connection_is_closed_if_pragma_initialization_fails(tmp_path, monkeypatch):
    real_connect = sqlite3.connect
    connections = []
    class FailingInitialization(sqlite3.Connection):
        def execute(self, sql, *args):
            if sql == "PRAGMA synchronous=FULL":
                raise sqlite3.OperationalError("initialization failed")
            return super().execute(sql, *args)
    def connecting(*args, **kwargs):
        conn = real_connect(*args, **kwargs, factory=FailingInitialization)
        connections.append(conn)
        return conn
    monkeypatch.setattr(store.sqlite3, "connect", connecting)
    with pytest.raises(sqlite3.OperationalError):
        store.connect(tmp_path / "connection.sqlite")
    with pytest.raises(sqlite3.ProgrammingError, match="closed"):
        connections[0].execute("SELECT 1")
