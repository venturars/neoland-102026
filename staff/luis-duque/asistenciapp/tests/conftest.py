"""Fixtures compartidas: app con BD temporal, token fijo y reloj falso."""

import pytest

from app import create_app
from asistencia.comprobar_nombre import REAL

TOKEN = "token-de-prueba"


class FakeClock:
    """Reloj controlable: los tests deciden qué hora es."""

    def __init__(self, t: float = 1_800_000_000.0):
        self.t = t

    def __call__(self) -> float:
        return self.t

    def advance(self, seconds: float) -> None:
        self.t += seconds


@pytest.fixture
def clock():
    return FakeClock()


@pytest.fixture
def app(tmp_path, clock):
    return create_app(tmp_path / "test.db", token=TOKEN, now=clock, comprobar=lambda name: REAL)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def teacher():
    """Cabeceras del profesor."""
    return {"X-Teacher-Token": TOKEN}
