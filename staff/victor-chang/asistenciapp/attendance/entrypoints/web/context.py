"""Lo que comparten las rutas de una app: configuración, reloj, token y conexión (ARCHITECTURE.md · C4, D4)."""

import sqlite3
from collections.abc import Callable
from dataclasses import dataclass
from typing import cast

from flask import Flask, current_app, g

from attendance.config import Config
from attendance.infra import storage

_KEY = "attendance"


@dataclass(frozen=True)
class WebContext:
    """Las piezas que `create_app` monta una vez y usan todas las peticiones."""

    config: Config
    clock: Callable[[], float]
    teacher_token: str


def init_app(app: Flask, web_context: WebContext) -> None:
    """Guarda las piezas en la app y cierra la conexión de cada petición al terminar."""
    app.extensions[_KEY] = web_context
    app.teardown_appcontext(_close_db)


def of(app: Flask) -> WebContext:
    """Las piezas de una app concreta (p. ej. para imprimir el enlace del profesor al arrancar)."""
    return cast(WebContext, app.extensions[_KEY])


def current() -> WebContext:
    """Las piezas de la app que atiende la petición en curso."""
    return of(current_app)


def db() -> sqlite3.Connection:
    """La conexión de esta petición; se abre al pedirla por primera vez (spec 001 · plan §2.9)."""
    if "db" not in g:
        g.db = storage.connect(current().config.db_path)
    return cast(sqlite3.Connection, g.db)


def now() -> float:
    """La hora actual según el reloj de la app."""
    return current().clock()


def _close_db(_exc: BaseException | None) -> None:
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()
