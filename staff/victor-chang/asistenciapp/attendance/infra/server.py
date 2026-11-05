"""El servidor de la app en un hilo, en un puerto libre y que se puede parar (spec 007 · plan §2.4, CA-12).

Lo usa la app de escritorio: la ventana ocupa el hilo principal, así que el servidor va en otro. El
puerto lo elige el sistema al abrir el socket (puerto 0), sin carrera y sin el "puerto en uso" del 8000.
Escucha solo en 127.0.0.1 (ARCHITECTURE.md · X6).
"""

import threading
from types import TracebackType
from typing import Self

from flask import Flask
from werkzeug.serving import BaseWSGIServer, make_server

HOST = "127.0.0.1"
STOP_TIMEOUT_SECONDS = 5


class RunningServer:
    """Un servidor en marcha en su hilo (M3: guarda el servidor y el hilo hasta pararlo)."""

    def __init__(self, server: BaseWSGIServer, thread: threading.Thread) -> None:
        """Lo crea `start`; no se usa directamente."""
        self._server = server
        self._thread = thread

    @property
    def host(self) -> str:
        """La dirección en la que escucha: siempre la local."""
        return HOST

    @property
    def port(self) -> int:
        """El puerto que eligió el sistema."""
        return self._server.server_port

    @property
    def running(self) -> bool:
        """True mientras el hilo del servidor sigue vivo."""
        return self._thread.is_alive()

    def stop(self) -> None:
        """Para el servidor, espera a su hilo y libera el puerto. Se puede llamar más de una vez."""
        if self._thread.is_alive():
            self._server.shutdown()
            self._thread.join(timeout=STOP_TIMEOUT_SECONDS)
        self._server.server_close()

    def __enter__(self) -> Self:
        """Para usarlo con `with` (S7)."""
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        """Lo para al salir del `with`, haya ido bien o no."""
        self.stop()


def start(app: Flask) -> RunningServer:
    """Arranca la app en un hilo, en un puerto libre de 127.0.0.1, y vuelve en cuanto escucha.

    Args:
        app: la app ya montada (`create_app`).
    """
    server = make_server(HOST, 0, app, threaded=True)
    # daemon: si algo falla antes del finally de app.py, el hilo no impide que el proceso termine.
    thread = threading.Thread(target=server.serve_forever, name="asistenciapp-server", daemon=True)
    thread.start()
    return RunningServer(server, thread)
