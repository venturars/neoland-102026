"""Comprueba la separación entre activación y arranque sin otros cambios."""

import hashlib
from pathlib import Path
import pytest

ROOT = Path(__file__).resolve().parents[1]
BASE_SHA256 = "38e7d41655369de32d93de72beac7cc5a8dd4999c553f41a5c57343622657590"
CSV_DOWNLOAD = """7. Pulsa **Descargar lista** para obtener el CSV (columnas *Nombre* y *Hora*),
   ordenado por nombre sin distinguir mayúsculas de minúsculas. La última fila
   muestra `Total de registros;N`, incluido `Total de registros;0` si no hay asistentes.
""".encode("utf-8")
PREVIOUS_DOWNLOAD = "7. Pulsa **Descargar lista** para obtener el CSV (columnas *Nombre* y *Hora*).\n".encode("utf-8")
SECURITY_SECTION = """### Límite de intentos de registro

Una misma dirección puede realizar **5 intentos por segundo** y **20 por minuto**, contando también los fallidos y compartiendo los máximos entre clases. Abrir páginas y consultar el panel no cuenta.

Superar cualquiera de los límites devuelve HTTP **429** con el aviso «Esta dirección queda bloqueada por haber superado los intentos permitidos.». El bloqueo es **permanente**, persiste al reiniciar y esta versión está **sin desbloqueo**. El intento que supera el límite no registra asistencia. El código de cuatro cifras conserva su funcionamiento.

La dirección es la de la conexión recibida por el servidor (`request.remote_addr`); no se acepta otra IP del formulario ni de cabeceras enviadas por el cliente. Detrás de **Cloudflare Tunnel** puede ser la del proxy, normalmente `127.0.0.1`, en lugar de la IP pública individual. En ese caso los límites son compartidos y el bloqueo puede afectar a **toda la clase**. Mejorar esta identificación queda para otra especificación.

""".encode("utf-8")
SECURITY_PRIVACY = """- Del alumno solo se guarda **el nombre que escribe** y **la hora**. Nada de emails.
- La IP se guarda solo para contar intentos de registro y conservar la lista de bloqueo, en el mismo archivo local y separada de la asistencia. Los intentos anteriores al último minuto se eliminan al procesar nuevos intentos de direcciones no bloqueadas; la blacklist no caduca.
""".encode("utf-8")
PREVIOUS_PRIVACY = "- Del alumno solo se guarda **el nombre que escribe** y **la hora**. Nada de emails ni IPs.\n".encode("utf-8")


def readme():
    return (ROOT / "README.md").read_text(encoding="utf-8")


def test_activation_heading():
    text = readme()
    section = text.split("## 2. Activar el entorno\n", 1)[1]
    activation = section.split("### Arrancar la app\n", 1)[0]
    assert "En cada terminal nueva, primero activa el entorno:" in activation
    assert "cd staff/<usuario>/asistenciapp" in activation
    assert "source .venv/bin/activate" in activation


def test_start_options():
    section = readme().split("### Arrancar la app\n", 1)[1].split("## 3.", 1)[0]
    assert "**Una clase online** (alumnos en sus casas)" in section
    assert "`python app.py --tunel`" in section
    assert "Probar solo en tu ordenador | `python app.py`" in section


def test_activation_before_start():
    text = readme()
    assert text.index("source .venv/bin/activate", text.index("## 2.")) < text.index("### Arrancar la app\n")
    section = text.split("### Arrancar la app\n", 1)[1].split("## 3.", 1)[0]
    assert "source .venv/bin/activate" not in section
    assert "cd staff/" not in section


def test_only_planned_changes():
    data = (ROOT / "README.md").read_bytes()
    # Conservar todo el contenido salvo la representación CRLF del checkout.
    data = data.replace(b"\r\n", b"\n")
    # Revertir solo el texto exacto de descarga aprobado por la spec 007.
    assert data.count(CSV_DOWNLOAD) == 1
    data = data.replace(CSV_DOWNLOAD, PREVIOUS_DOWNLOAD, 1)
    # Revertir exclusivamente los dos textos aprobados por la 006, exigiendo
    # su presencia exacta. El hash histórico se conserva, no se recalcula.
    assert data.count(SECURITY_SECTION) == 1
    assert data.count(SECURITY_PRIVACY) == 1
    data = data.replace(SECURITY_SECTION, b"", 1)
    data = data.replace(SECURITY_PRIVACY, PREVIOUS_PRIVACY, 1)
    # La spec 005 autoriza los dos enlaces a documentos reubicados.
    data = data.replace(b"[CONSTITUTION.md](docs/CONSTITUTION.md)", b"[CONSTITUTION.md](CONSTITUTION.md)")
    data = data.replace(b"[AGENTS.md](AGENTS.md)", b"[AGENT.md](AGENT.md)")
    # La spec 004 autoriza únicamente anonimizar las dos rutas del README.
    data = data.replace(b"staff/<usuario>/asistenciapp", b"staff/victor-chang/asistenciapp")
    assert data.count(b"### Arrancar la app") == 1
    original = data.replace(b"## 2. Activar el entorno", b"## 2. Arrancar la app", 1)
    original = original.replace(b"### Arrancar la app\n\n", b"", 1)
    assert hashlib.sha256(original).hexdigest() == BASE_SHA256


@pytest.mark.parametrize("newline", [b"\n", b"\r\n"])
@pytest.mark.parametrize("change", [
    "none", "text", "space", "final_newline", "limit", "tunnel", "privacy",
    "csv_total", "csv_missing", "csv_duplicate",
])
def test_readme_integrity_line_endings_and_changes(tmp_path, monkeypatch, newline, change):
    content = (ROOT / "README.md").read_bytes().replace(b"\r\n", b"\n")
    if change == "text":
        content += b"Cambio real.\n"
    elif change == "space":
        content += b" "
    elif change == "final_newline":
        assert content.endswith(b"\n")
        content = content[:-1]
    elif change == "limit":
        content = content.replace(b"**5 intentos por segundo**", b"**6 intentos por segundo**")
    elif change == "tunnel":
        content = content.replace(b"127.0.0.1", b"127.0.0.2")
    elif change == "privacy":
        content = content.replace(b"la blacklist no caduca", b"la blacklist caduca")
    elif change == "csv_total":
        content = content.replace(b"Total de registros;0", b"Total de registros;1")
    elif change == "csv_missing":
        content = content.replace(CSV_DOWNLOAD, b"")
    elif change == "csv_duplicate":
        content += CSV_DOWNLOAD
    (tmp_path / "README.md").write_bytes(content.replace(b"\n", newline))
    monkeypatch.setitem(globals(), "ROOT", tmp_path)
    if change == "none":
        test_only_planned_changes()
    else:
        with pytest.raises(AssertionError):
            test_only_planned_changes()
