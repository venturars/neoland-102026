"""Spike de la spec 007 (tarea T01, plan §0): desechable, se borra en T18.

Una app mínima empaquetable con PyInstaller: Flask en un hilo con puerto libre, una ventana de
pywebview y botones para cada comprobación del plan §0. Escribe lo que pasa en spike.log, en
la carpeta de datos del usuario (macOS: ~/Library/Application Support/AsistenciAppSpike/).

- SPIKE_AUTO=1: al cargar la ventana abre el túnel, comprueba la URL pública, guarda un CSV de
  prueba sin diálogo y cierra la ventana (comprobaciones #4 y #6 sin nadie delante).
- SPIKE_T0=<segundos Unix>: hora de lanzamiento, para medir el tiempo hasta ver la ventana.
- La llave de Google se busca en la app (google-client.json) o en SPIKE_GOOGLE_CLIENT.
"""

import json
import os
import shutil
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path

import webview
from flask import Flask, jsonify
from flask.typing import ResponseReturnValue
from werkzeug.serving import make_server

T_MAIN = time.time()
BUNDLE = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
DATA_DIR = Path.home() / "Library" / "Application Support" / "AsistenciAppSpike"
LOG = DATA_DIR / "spike.log"
MEET_SCOPE = "https://www.googleapis.com/auth/meetings.space.readonly"
CSV_TEXT = "Nombre,Hora\nÁlvaro Núñez,11:07\nZoë Çelik,11:08\n"

PAGE = """<!doctype html><html lang="es"><meta charset="utf-8"><title>Spike 007</title>
<body style="font-family:system-ui;margin:24px">
<h1>Spike 007</h1>
<p><button id="tunnel">#4 Abrir túnel</button> <span id="tunnel-out"></span></p>
<p><button id="save">#1 Guardar CSV (diálogo nativo)</button> <span id="save-out"></span></p>
<p><button id="blob">#1b Descarga del navegador (blob)</button></p>
<p><button id="google">#2/#3 Iniciar sesión con Google</button> <span id="google-out"></span></p>
<p>Cerrar la ventana con el túnel abierto debe pedir confirmación.</p>
<script>
const out = (id, v) => document.getElementById(id).textContent = v;
document.getElementById("tunnel").onclick = async () => {
  out("tunnel-out", "Abriendo…");
  const r = await fetch("/tunnel", {method: "POST"}); out("tunnel-out", JSON.stringify(await r.json()));
};
document.getElementById("save").onclick = async () => {
  const ok = await window.pywebview.api.save_file("asistencia-prueba.csv", %CSV%);
  out("save-out", ok ? "Guardado" : "Cancelado");
};
document.getElementById("blob").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\\ufeff" + %CSV%], {type: "text/csv"}));
  a.download = "asistencia-blob.csv"; document.body.append(a); a.click(); a.remove();
};
document.getElementById("google").onclick = async () => {
  out("google-out", "Esperando a Google en el navegador…");
  const r = await fetch("/google", {method: "POST"}); out("google-out", JSON.stringify(await r.json()));
};
</script></body></html>""".replace("%CSV%", json.dumps(CSV_TEXT))


def log(message: str) -> None:
    """Añade una línea con la hora a spike.log."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as file:
        file.write(f"{time.strftime('%H:%M:%S')} {message}\n")


class Tunnel:
    """El proceso de cloudflared y su URL pública."""

    def __init__(self) -> None:
        """Sin abrir todavía."""
        self.process: subprocess.Popen[str] | None = None
        self.url: str | None = None
        self.lock = threading.Lock()

    def open(self, port: int) -> str:
        """Abre el túnel (o devuelve la URL si ya está abierto)."""
        with self.lock:
            if self.url:
                return self.url
            bundled = BUNDLE / "cloudflared"
            executable = str(bundled) if bundled.exists() else shutil.which("cloudflared")
            log(f"tunnel: executable={executable} bundled={bundled.exists()}")
            if executable is None:
                raise RuntimeError("cloudflared no encontrado")
            self.process = subprocess.Popen(  # noqa: S603
                [executable, "tunnel", "--url", f"http://127.0.0.1:{port}"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
            deadline = time.time() + 30
            for line in self.process.stdout or []:
                if "trycloudflare.com" in line and "https://" in line and "api." not in line:
                    start = line.index("https://")
                    self.url = line[start:].split()[0].rstrip("|").strip()
                    break
                if time.time() > deadline:
                    break
            if not self.url:
                self.close()
                raise RuntimeError("cloudflared no dio una URL en 30 s")
            threading.Thread(target=self._drain, daemon=True).start()
            return self.url

    def _drain(self) -> None:
        if self.process and self.process.stdout:
            for _ in self.process.stdout:
                pass

    def close(self) -> None:
        """Para cloudflared, matándolo si no sale en 5 s."""
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
        self.process, self.url = None, None


def google_login() -> dict[str, object]:
    """Pide el permiso de Meet en el navegador y lo prueba con una llamada a la API."""
    from google.auth.transport.requests import AuthorizedSession
    from google_auth_oauthlib.flow import InstalledAppFlow

    client = Path(os.environ.get("SPIKE_GOOGLE_CLIENT", BUNDLE / "google-client.json"))
    if not client.exists():
        return {"ok": False, "error": f"sin llave en {client}"}
    flow = InstalledAppFlow.from_client_secrets_file(str(client), [MEET_SCOPE, "openid"])
    credentials = flow.run_local_server(port=0, timeout_seconds=180, prompt="consent")
    granted = sorted(getattr(credentials, "granted_scopes", None) or credentials.scopes or [])
    response = AuthorizedSession(credentials).get(
        "https://meet.googleapis.com/v2/conferenceRecords", params={"pageSize": 1}, timeout=10
    )
    expiry = credentials.expiry.isoformat() if credentials.expiry else None
    result = {
        "ok": response.status_code == 200,
        "meet_status": response.status_code,
        "granted": granted,
        "has_refresh_token": bool(credentials.refresh_token),
        "access_expiry": expiry,
    }
    log(f"google: {json.dumps(result)}")
    return result


def build_app(tunnel: Tunnel, port_box: list[int]) -> Flask:
    """La app de Flask del spike: la página y las rutas de túnel y Google."""
    app = Flask(__name__)
    app.add_url_rule("/", "index", lambda: PAGE)

    @app.post("/tunnel")
    def open_tunnel() -> ResponseReturnValue:
        try:
            return jsonify(url=tunnel.open(port_box[0]))
        except Exception as exc:  # noqa: BLE001 — spike: se informa de cualquier fallo
            log(f"tunnel: error {exc!r}")
            return jsonify(error=str(exc)), 502

    @app.post("/google")
    def google() -> ResponseReturnValue:
        try:
            return jsonify(google_login())
        except Exception as exc:  # noqa: BLE001
            log(f"google: error {exc!r}")
            return jsonify(ok=False, error=repr(exc)), 502

    return app


class Api:
    """Lo que la página puede llamar en Python (js_api)."""

    def __init__(self) -> None:
        """Sin ventana hasta que se crea."""
        self.window: webview.Window | None = None

    def save_file(self, filename: str, content: str) -> bool:
        """Guarda el texto con BOM donde elija el profesor; False si cancela."""
        if self.window is None:
            return False
        chosen = self.window.create_file_dialog(webview.FileDialog.SAVE, save_filename=filename)
        if not chosen:
            log("save_file: cancelado")
            return False
        path = Path(chosen if isinstance(chosen, str) else chosen[0])
        path.write_text(content, encoding="utf-8-sig")
        log(f"save_file: {path} {path.stat().st_size} bytes, bom={path.read_bytes()[:3] == b'\xef\xbb\xbf'}")
        return True


def check_public_url(url: str) -> None:
    """Espera hasta 60 s a que la URL pública responda."""
    last = ""
    for attempt in range(1, 31):
        try:
            with urllib.request.urlopen(url, timeout=5) as response:  # noqa: S310
                log(f"tunnel: public {url} -> {response.status} (intento {attempt})")
                return
        except Exception as exc:  # noqa: BLE001
            last = repr(exc)
        time.sleep(2)
    log(f"tunnel: public {url} no responde: {last}")


def auto_run(window: webview.Window, tunnel: Tunnel, port: int) -> None:
    """Modo SPIKE_AUTO: túnel, comprobación, CSV y cierre."""
    try:
        url = tunnel.open(port)
        log(f"auto: tunnel url {url}")
        hold = int(os.environ.get("SPIKE_HOLD", "0"))
        if hold:
            # Deja el túnel abierto para comprobarlo desde fuera (dig/curl) sin la caché DNS de la app.
            (DATA_DIR / "url.txt").write_text(url, encoding="utf-8")
            time.sleep(hold)
        else:
            check_public_url(url)
        test_csv = DATA_DIR / "auto.csv"
        test_csv.write_text(CSV_TEXT, encoding="utf-8-sig")
        log(f"auto: csv bom={test_csv.read_bytes()[:3] == b'\xef\xbb\xbf'}")
    finally:
        window.destroy()


def main() -> None:
    """Servidor en un hilo, ventana y limpieza al cerrar."""
    log(f"--- start frozen={getattr(sys, 'frozen', False)} bundle={BUNDLE}")
    t0 = float(os.environ.get("SPIKE_T0", T_MAIN))
    tunnel = Tunnel()
    port_box = [0]
    server = make_server("127.0.0.1", 0, build_app(tunnel, port_box), threaded=True)
    port_box[0] = server.server_port
    threading.Thread(target=server.serve_forever, daemon=True).start()
    log(f"server: port {server.server_port}")

    api = Api()
    window = webview.create_window("Spike 007", f"http://127.0.0.1:{server.server_port}/", js_api=api)
    if window is None:
        raise SystemExit("pywebview no creó la ventana")
    api.window = window

    def on_loaded() -> None:
        log(f"window: loaded {time.time() - t0:.2f} s desde el lanzamiento ({time.time() - T_MAIN:.2f} s desde main)")
        if os.environ.get("SPIKE_AUTO") == "1":
            threading.Thread(target=auto_run, args=(window, tunnel, server.server_port), daemon=True).start()

    def on_closing() -> bool:
        if tunnel.url and os.environ.get("SPIKE_AUTO") != "1":
            confirmed = window.create_confirmation_dialog(
                "Cerrar Spike", "Los alumnos no podrán registrarse. ¿Cerrar igualmente?"
            )
            log(f"closing: confirmación={confirmed}")
            return bool(confirmed)
        return True

    window.events.loaded += on_loaded
    window.events.closing += on_closing
    webview.settings["ALLOW_DOWNLOADS"] = True
    try:
        webview.start()
    finally:
        tunnel.close()
        server.shutdown()
        log("--- end: túnel cerrado y servidor parado")


if __name__ == "__main__":
    main()
