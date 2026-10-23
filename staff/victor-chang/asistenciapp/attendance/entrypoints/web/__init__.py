"""Entrada web: la fábrica de la aplicación Flask (spec 005 · plan §2.4; ARCHITECTURE.md · C4).

`create_app` recibe todo lo que necesita por parámetro, para que los tests puedan montarla con
una base de datos temporal, un reloj falso y un token fijo.
"""

import time
from collections.abc import Callable
from contextlib import closing
from pathlib import Path

from flask import Flask
from flask.json.provider import DefaultJSONProvider
from werkzeug.middleware.proxy_fix import ProxyFix

from attendance.config import Config
from attendance.entrypoints.web import auth, context, errors, public, teacher
from attendance.infra import storage

STATIC_DIR = Path(__file__).resolve().parents[3] / "static"


def create_app(
    config: Config,
    clock: Callable[[], float] = time.time,
    teacher_token: str | None = None,
) -> Flask:
    """Crea la aplicación con su base de datos ya preparada.

    Args:
        config: configuración leída del entorno (o la de un test).
        clock: reloj en segundos Unix; los tests pasan uno falso.
        teacher_token: token del profesor. Si es None se lee de la BD (o se crea la primera vez).
    """
    app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")
    json_provider = DefaultJSONProvider(app)
    json_provider.ensure_ascii = False
    app.json = json_provider
    # Detrás del túnel, usar la dirección pública que nos indica (spec 001 · plan §2.10, CA-19).
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # type: ignore[method-assign]

    # closing() y no solo `with conn`: el `with` de sqlite3 confirma, pero no cierra (D4).
    with closing(storage.connect(config.db_path)) as conn:
        storage.init_schema(conn)
        with conn:
            token = teacher_token or storage.get_or_create_teacher_token(conn)

    context.init_app(app, context.WebContext(config=config, clock=clock, teacher_token=token))
    auth.init_app(app)
    errors.init_app(app)
    app.register_blueprint(public.blueprint)
    app.register_blueprint(teacher.blueprint)
    app.add_url_rule("/", "index", lambda: app.send_static_file("index.html"))
    return app
