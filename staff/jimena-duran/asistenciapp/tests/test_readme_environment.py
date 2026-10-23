"""Comprueba la separación entre activación y arranque sin otros cambios."""

import hashlib
from pathlib import Path
import pytest

ROOT = Path(__file__).resolve().parents[1]
BASE_SHA256 = "38e7d41655369de32d93de72beac7cc5a8dd4999c553f41a5c57343622657590"


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
@pytest.mark.parametrize("change", ["none", "text", "space", "final_newline"])
def test_readme_integrity_line_endings_and_changes(tmp_path, monkeypatch, newline, change):
    content = (ROOT / "README.md").read_bytes().replace(b"\r\n", b"\n")
    if change == "text":
        content += b"Cambio real.\n"
    elif change == "space":
        content += b" "
    elif change == "final_newline":
        assert content.endswith(b"\n")
        content = content[:-1]
    (tmp_path / "README.md").write_bytes(content.replace(b"\n", newline))
    monkeypatch.setitem(globals(), "ROOT", tmp_path)
    if change == "none":
        test_only_planned_changes()
    else:
        with pytest.raises(AssertionError):
            test_only_planned_changes()
