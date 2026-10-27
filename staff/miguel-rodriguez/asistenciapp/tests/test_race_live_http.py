"""Ensayo HTTP local acotado con quince clientes y cincuenta envíos adversarios."""
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager, closing
from http.client import HTTPConnection
from http.cookies import SimpleCookie
import json
import socket
from threading import Thread
from uuid import uuid4

from werkzeug.serving import make_server, WSGIRequestHandler

from app import create_app
from asistencia.domain.codes import is_valid_code
from asistencia.domain.roster import ROSTER
from asistencia.usecases import races


class QuietHandler(WSGIRequestHandler):
    def log(self, *args, **kwargs):
        pass


@contextmanager
def serving(app):
    server = make_server("127.0.0.1", 0, app, threaded=True, request_handler=QuietHandler)
    port = server.server_port
    app.config["RACE_ORIGIN"] = f"http://127.0.0.1:{port}"
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield port
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        assert not thread.is_alive()
        with socket.socket() as probe:
            assert probe.connect_ex(("127.0.0.1", port)) != 0


def call(port, method, path, fields=None, headers=None, cookie=None):
    conn = HTTPConnection("127.0.0.1", port, timeout=5)
    request_headers = {"Origin": f"http://127.0.0.1:{port}", **(headers or {})}
    if cookie:
        request_headers["Cookie"] = cookie
    payload = None
    if fields is not None:
        request_headers["Content-Type"] = "application/json"
        payload = json.dumps(fields)
    try:
        conn.request(method, path, body=payload, headers=request_headers)
        response = conn.getresponse()
        data = json.loads(response.read())
        return response.status, data, dict(response.getheaders())
    finally:
        conn.close()


def test_real_http_shared_wifi_attack_and_complete_race(tmp_path, clock, monkeypatch):
    app = create_app(tmp_path / "live.sqlite", token="teacher", now=clock, race_local_http=True)
    teacher = {"X-Teacher-Token": "teacher"}
    evaluations = []
    validator = races.is_valid_code
    def counted(*args):
        evaluations.append(1)
        return validator(*args)
    monkeypatch.setattr(races, "is_valid_code", counted)
    with serving(app) as port:
        for attack in (True, False):
            status, prepared, _ = call(port, "POST", "/api/sessions/races", {}, teacher)
            assert status == 201
            sid = prepared["id"]
            teacher_path = f"/api/sessions/{sid}/race"
            _, state, _ = call(port, "GET", teacher_path, headers=teacher)
            entry = state["joinUrl"].split("#join=")[1]
            clients = []
            for ref in ROSTER:
                status, own, headers = call(port, "POST", f"/api/races/{sid}/join", {"join_secret": entry, "roster_key": ref["key"]}, {"X-Race-Request": "1"})
                assert status == 200 and headers["Cache-Control"] == "no-store"
                parsed = SimpleCookie(headers["Set-Cookie"])
                morsel = next(iter(parsed.values()))
                assert morsel["httponly"] and morsel["samesite"] == "Strict"
                assert morsel["path"] == f"/api/races/{sid}" and not morsel["domain"]
                clients.append((f"{morsel.key}={morsel.value}", own["csrfToken"]))
            assert call(port, "POST", teacher_path + "/start", {}, teacher)[0] == 200
            clock.advance(3)
            _, state, _ = call(port, "GET", teacher_path, headers=teacher)
            good = state["code"]
            with closing(races.store.connect(tmp_path / "live.sqlite")) as conn:
                secret = races.store.get_race(conn, sid)["secret"]
            bad = next(f"{n:04d}" for n in range(10) if not is_valid_code(secret, f"{n:04d}", clock()))
            cookie, csrf = clients[0]
            assert call(port, "POST", f"/api/races/{sid}/attempt", {"operation_id": str(uuid4()), "code": good}, {"X-Race-CSRF": csrf, "Origin": "https://evil.example"}, cookie)[0] == 403
            assert call(port, "GET", f"/api/races/{sid}/me", cookie=cookie)[1]["remaining"] == 3
            jobs = [(client, good, False) for client in clients[1 if attack else 0:]]
            if attack:
                jobs += [(clients[0], bad, True)] * 50
            before = len(evaluations)
            def sending(job):
                (cookie, csrf), value, hostile = job
                status, _, headers = call(port, "POST", f"/api/races/{sid}/attempt", {"operation_id": str(uuid4()), "code": value}, {"X-Race-CSRF": csrf}, cookie)
                assert headers["Cache-Control"] == "no-store"
                return hostile, status
            with ThreadPoolExecutor(5) as pool:
                outcomes = list(pool.map(sending, jobs))
            assert all(status == 201 for hostile, status in outcomes if not hostile)
            if attack:
                assert Counter(status for hostile, status in outcomes if hostile) == {422: 3, 429: 47}
                assert len(evaluations) - before == 17
                assert call(port, "POST", teacher_path + "/close", {}, teacher)[0] == 200
            else:
                assert len(evaluations) - before == 15
            _, final, _ = call(port, "GET", teacher_path, headers=teacher)
            assert final["phase"] == "closed" and final["total"] == (14 if attack else 15)
            assert [row["position"] for row in final["checkins"]] == list(range(1, final["total"] + 1))
