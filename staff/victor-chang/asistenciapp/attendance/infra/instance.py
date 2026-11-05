"""Una sola copia de la app de escritorio abierta a la vez (spec 007 · CA-03; plan §2.5).

El bloqueo es un socket en un puerto local fijo (`Config.lock_port`): si otra copia ya lo tiene, el
sistema no deja abrirlo otra vez. Por qué un socket y no un archivo de bloqueo: el sistema lo suelta
solo si la app se cuelga o se mata, y es el mismo código en macOS y Windows.
"""

import socket
from types import TracebackType
from typing import Self

from attendance.domain.errors import AppError

HOST = "127.0.0.1"


class AlreadyRunningError(AppError):
    """Ya hay otra copia de la app abierta (CA-03)."""

    MESSAGE = "AsistenciApp ya está abierta. Búscala en el Dock o en la barra de tareas."


class InstanceLock:
    """El bloqueo tomado por esta copia de la app (M3: guarda el socket hasta soltarlo)."""

    def __init__(self, sock: socket.socket) -> None:
        """Lo crea `acquire`; no se usa directamente."""
        self._sock = sock

    def release(self) -> None:
        """Suelta el bloqueo. Se puede llamar más de una vez."""
        self._sock.close()

    def __enter__(self) -> Self:
        """Para usarlo con `with` (S7)."""
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        """Lo suelta al salir del `with`, haya ido bien o no."""
        self.release()


def acquire(port: int) -> InstanceLock:
    """Toma el bloqueo de la app en `127.0.0.1:<port>`.

    Args:
        port: el puerto del bloqueo (`Config.lock_port`).

    Raises:
        AlreadyRunningError: otra copia de la app ya lo tiene.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Sin SO_REUSEADDR. En Windows, además, uso exclusivo: si no, otro programa podría compartir el puerto.
    if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
    try:
        sock.bind((HOST, port))
    except OSError as exc:
        sock.close()
        raise AlreadyRunningError from exc
    return InstanceLock(sock)
