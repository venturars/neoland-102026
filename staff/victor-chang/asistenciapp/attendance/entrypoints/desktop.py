"""Entrada de escritorio: la ventana con el panel del profesor (spec 007 · plan v1.1 §2.2, §2.7, §2.9).

Es otra entrada (ARCHITECTURE.md · C3): muestra el mismo panel web en una ventana nativa de pywebview.
pywebview se importa dentro de las funciones, para que el resto de la app y los tests no necesiten una
interfaz gráfica.

- Al cerrar, la ventana pide confirmación solo con la clase online abierta (CA-10, CA-11). Se usa la
  confirmación nativa de pywebview (`confirm_close`): un diálogo propio desde el evento `closing`
  congela la app (spike de T01).
- "Descargar lista" guarda con el diálogo nativo (`DesktopApi.save_file`, CA-17).
"""

import html
from pathlib import Path
from typing import TYPE_CHECKING

from attendance.infra.tunnel import Tunnel

if TYPE_CHECKING:  # solo para los tipos: en marcha, pywebview se importa al abrir la ventana
    from webview import Window

WINDOW_TITLE = "AsistenciApp"
WINDOW_SIZE = (1000, 760)
MIN_SIZE = (400, 560)  # el panel funciona a 400 px (P5)
# Textos de la confirmación nativa al cerrar (P6).
CLOSE_TEXTS = {
    "global.quitConfirmation": "Los alumnos no podrán registrarse. ¿Cerrar igualmente?",
    "global.quit": "Cerrar",
    "global.cancel": "Cancelar",
}
CSV_ENCODING = "utf-8-sig"  # con BOM, como la descarga del navegador (infra/export.py)


class DesktopApi:
    """Lo que la página puede llamar en Python desde la ventana (`window.pywebview.api`).

    M3: guarda la ventana, que solo existe después de crear la API.
    """

    def __init__(self, save_dialog: int) -> None:
        """Prepara la API sin ventana todavía.

        Args:
            save_dialog: el tipo de diálogo de guardar de pywebview (`webview.FileDialog.SAVE`).
        """
        self._save_dialog = save_dialog
        self._window: Window | None = None

    def attach(self, window: "Window") -> None:
        """Le da la ventana en la que abrir los diálogos."""
        self._window = window

    def save_file(self, filename: object, content: object) -> bool:
        """Guarda `content` con BOM donde elija el profesor (CA-17).

        Args:
            filename: el nombre que se sugiere en el diálogo (el que da el servidor).
            content: el texto del CSV.

        Returns:
            True si se guardó; False si se canceló o lo que llega de la página no es texto (E1).
        """
        if self._window is None or not isinstance(filename, str) or not isinstance(content, str):
            return False
        chosen = self._window.create_file_dialog(self._save_dialog, save_filename=filename)
        path = _first_path(chosen)
        if path is None:
            return False
        path.write_text(content, encoding=CSV_ENCODING)
        return True


def watch_close(window: "Window", tunnel: Tunnel) -> None:
    """Hace que cerrar la ventana pida confirmación mientras la clase online esté abierta (CA-10, CA-11)."""

    def update(url: str | None) -> None:
        window.confirm_close = url is not None

    tunnel.on_change.append(update)
    update(tunnel.url)  # con --tunel, la clase online ya está abierta al abrir la ventana


def run_window(url: str, tunnel: Tunnel) -> None:
    """Abre la ventana con el panel y vuelve cuando el profesor la cierra.

    Args:
        url: la dirección local del panel, con el token (`http://127.0.0.1:<puerto>/profesor.html#t=…`).
        tunnel: la clase online, para pedir confirmación al cerrar si está abierta.
    """
    import webview  # noqa: PLC0415 — solo cuando hay ventana (ver el docstring del módulo)

    api = DesktopApi(save_dialog=webview.FileDialog.SAVE)
    window = webview.create_window(
        WINDOW_TITLE,
        url,
        js_api=api,
        width=WINDOW_SIZE[0],
        height=WINDOW_SIZE[1],
        min_size=MIN_SIZE,
        text_select=True,  # el enlace de alumnos se puede seleccionar (spike de T01)
        localization=CLOSE_TEXTS,
    )
    if window is None:
        raise RuntimeError("pywebview no creó la ventana")
    api.attach(window)
    watch_close(window, tunnel)
    webview.start()


def show_already_open(message: str) -> None:
    """Enseña en una ventana pequeña que ya hay otra copia abierta (CA-03) y vuelve al cerrarla."""
    import webview  # noqa: PLC0415

    body = (
        '<!doctype html><html lang="es"><meta charset="utf-8">'
        '<body style="font-family:system-ui,sans-serif;margin:24px;line-height:1.5">'
        f"<p>{html.escape(message)}</p></body></html>"
    )
    webview.create_window(WINDOW_TITLE, html=body, width=420, height=180, resizable=False)
    webview.start()


def _first_path(chosen: object) -> Path | None:
    # pywebview devuelve la ruta como texto o como tupla de una ruta, según el sistema; None si se cancela.
    if isinstance(chosen, (list, tuple)):
        chosen = chosen[0] if chosen else None
    return Path(chosen) if isinstance(chosen, str) and chosen else None
