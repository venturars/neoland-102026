"""Tests de attendance/entrypoints/desktop.py · spec 007 CA-03, CA-10, CA-11, CA-17; plan v1.1 §2.7, §2.9.

No se abre ninguna ventana: pywebview (externo) se sustituye por un módulo falso (ARCHITECTURE.md · T4).
La clase online es el `Tunnel` de verdad con el cloudflared falso de conftest.py.
"""

import sys
import types

import pytest
from conftest import TUNNEL_URL, TUNNEL_URL_LINE

from attendance.entrypoints import desktop
from attendance.entrypoints.desktop import CLOSE_TEXTS, DesktopApi, run_window, show_already_open, watch_close
from attendance.infra.tunnel import Tunnel

SAVE = 10  # el valor de webview.FileDialog.SAVE no importa: el diálogo falso lo devuelve tal cual


class FakeWindow:
    """La ventana de pywebview: guarda lo que se le pide y contesta el diálogo como diga el test."""

    def __init__(self, chosen=None):
        self.confirm_close = False
        self.chosen = chosen
        self.dialogs = []

    def create_file_dialog(self, dialog_type, save_filename=""):
        self.dialogs.append((dialog_type, save_filename))
        return self.chosen


@pytest.fixture
def fake_webview(monkeypatch):
    """Un módulo `webview` falso que guarda las ventanas creadas y si se llamó a `start`."""
    module = types.ModuleType("webview")
    module.FileDialog = types.SimpleNamespace(SAVE=SAVE)
    module.created = []
    module.started = 0

    def create_window(title, url=None, html=None, **kwargs):
        window = FakeWindow()
        module.created.append({"title": title, "url": url, "html": html, "window": window, **kwargs})
        return window

    def start(**_kwargs):
        module.started += 1

    module.create_window = create_window
    module.start = start
    monkeypatch.setitem(sys.modules, "webview", module)
    return module


# ---------- confirmación al cerrar (CA-10, CA-11; plan v1.1 §2.7) ----------


def test_close_texts_are_in_spanish():  # P6
    assert CLOSE_TEXTS == {
        "global.quitConfirmation": "Los alumnos no podrán registrarse. ¿Cerrar igualmente?",
        "global.quit": "Cerrar",
        "global.cancel": "Cancelar",
    }


def test_without_online_class_closing_does_not_ask():  # CA-11
    window = FakeWindow()
    watch_close(window, Tunnel(executable=None, port=8000))
    assert window.confirm_close is False


def test_opening_the_online_class_makes_closing_ask(fake_cloudflared):  # CA-10
    fake_cloudflared(TUNNEL_URL_LINE + "\n")
    tunnel = Tunnel(executable=None, port=8000, timeout=5)
    window = FakeWindow()
    watch_close(window, tunnel)
    tunnel.open()
    assert window.confirm_close is True
    tunnel.close()
    assert window.confirm_close is False


def test_an_online_class_already_open_asks_from_the_start(fake_cloudflared):  # --tunel: abierta antes de la ventana
    fake_cloudflared(TUNNEL_URL_LINE + "\n")
    tunnel = Tunnel(executable=None, port=8000, timeout=5)
    tunnel.open()
    window = FakeWindow()
    watch_close(window, tunnel)
    assert window.confirm_close is True


# ---------- guardar el CSV (CA-17; plan §2.9) ----------


def test_save_file_writes_with_the_bom(tmp_path):  # CA-17: Excel lee bien las tildes
    target = tmp_path / "Clase 05-11.csv"
    window = FakeWindow(chosen=str(target))
    api = DesktopApi(save_dialog=SAVE)
    api.attach(window)
    assert api.save_file("asistencia-clase.csv", "Nombre,Hora\nÁlvaro Núñez,11:07\n") is True
    assert target.read_bytes() == "﻿Nombre,Hora\nÁlvaro Núñez,11:07\n".encode()
    assert window.dialogs == [(SAVE, "asistencia-clase.csv")]  # sugiere el nombre que da el servidor


def test_save_file_accepts_a_list_from_the_dialog(tmp_path):  # pywebview puede devolver una tupla
    target = tmp_path / "lista.csv"
    api = DesktopApi(save_dialog=SAVE)
    api.attach(FakeWindow(chosen=(str(target),)))
    assert api.save_file("lista.csv", "Nombre,Hora\n") is True
    assert target.exists()


@pytest.mark.parametrize("chosen", [None, (), ""])
def test_cancelling_the_dialog_writes_nothing(tmp_path, chosen):
    api = DesktopApi(save_dialog=SAVE)
    api.attach(FakeWindow(chosen=chosen))
    assert api.save_file("lista.csv", "Nombre,Hora\n") is False
    assert list(tmp_path.iterdir()) == []


def test_save_file_without_a_window_does_nothing():
    assert DesktopApi(save_dialog=SAVE).save_file("lista.csv", "x") is False


@pytest.mark.parametrize(("filename", "content"), [(None, "x"), ("lista.csv", None), (3, "x"), ("lista.csv", 3)])
def test_save_file_checks_what_the_page_sends(tmp_path, filename, content):  # E1: llega de JavaScript
    window = FakeWindow(chosen=str(tmp_path / "lista.csv"))
    api = DesktopApi(save_dialog=SAVE)
    api.attach(window)
    assert api.save_file(filename, content) is False
    assert window.dialogs == []


# ---------- la ventana (plan v1.1 §2.2) ----------


def test_run_window_opens_the_panel(fake_webview):
    tunnel = Tunnel(executable=None, port=8000)
    run_window("http://127.0.0.1:5000/profesor.html#t=abc", tunnel)
    [created] = fake_webview.created
    assert created["title"] == "AsistenciApp"
    assert created["url"] == "http://127.0.0.1:5000/profesor.html#t=abc"
    assert created["text_select"] is True  # el enlace de alumnos se puede seleccionar (spike §0 #5)
    assert created["localization"] == CLOSE_TEXTS
    assert isinstance(created["js_api"], DesktopApi)
    assert fake_webview.started == 1


def test_run_window_connects_the_close_confirmation(fake_webview, fake_cloudflared):  # CA-10
    fake_cloudflared(TUNNEL_URL_LINE + "\n")
    tunnel = Tunnel(executable=None, port=8000, timeout=5)
    run_window("http://127.0.0.1:5000/profesor.html#t=abc", tunnel)
    window = fake_webview.created[0]["window"]
    assert tunnel.open() == TUNNEL_URL
    assert window.confirm_close is True


def test_the_api_can_use_the_window(fake_webview, tmp_path):  # CA-17: save_file abre el diálogo de esa ventana
    run_window("http://127.0.0.1:5000/", Tunnel(executable=None, port=8000))
    created = fake_webview.created[0]
    created["window"].chosen = str(tmp_path / "x.csv")
    assert created["js_api"].save_file("x.csv", "Nombre\n") is True


def test_already_open_shows_the_message(fake_webview):  # CA-03
    show_already_open("AsistenciApp ya está abierta. Búscala en el Dock o en la barra de tareas.")
    [created] = fake_webview.created
    assert "AsistenciApp ya está abierta." in created["html"]
    assert fake_webview.started == 1


def test_already_open_escapes_the_message(fake_webview):  # X4: se pinta como texto
    show_already_open("<b>hola</b>")
    assert "<b>" not in fake_webview.created[0]["html"]
    assert "&lt;b&gt;hola&lt;/b&gt;" in fake_webview.created[0]["html"]


def test_importing_desktop_does_not_import_webview():  # el resto de la app y los tests no necesitan ventana
    assert "webview" not in vars(desktop)
