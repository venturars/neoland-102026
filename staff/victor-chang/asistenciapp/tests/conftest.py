"""Fixtures compartidas: app con BD temporal, token fijo y reloj falso."""

import pytest

from attendance.config import Config
from attendance.entrypoints.web import create_app

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
    # timezone=None: la zona del sistema, como hasta ahora (spec 005 · plan §2.4).
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    return create_app(config, clock=clock, teacher_token=TOKEN)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def teacher():
    """Cabeceras del profesor."""
    return {"X-Teacher-Token": TOKEN}
