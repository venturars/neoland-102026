"""Comprueba la separación entre activación y arranque sin otros cambios."""

import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_SHA256 = "af7400a1c0349b55266b1292ae6ce64e7589229eacf94244cd66e2e6733f981b"


def readme():
    return (ROOT / "README.md").read_text(encoding="utf-8")


def test_activation_heading():
    text = readme()
    section = text.split("## 2. Activar el entorno\n", 1)[1]
    activation = section.split("### Arrancar la app\n", 1)[0]
    assert "En cada terminal nueva, primero activa el entorno:" in activation
    assert "cd staff/victor-chang/asistenciapp" in activation
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
    assert data.count(b"### Arrancar la app") == 1
    original = data.replace(b"## 2. Activar el entorno", b"## 2. Arrancar la app", 1)
    original = original.replace(b"### Arrancar la app\r\n\r\n", b"", 1) if b"\r\n" in original else original.replace(b"### Arrancar la app\n\n", b"", 1)
    assert hashlib.sha256(original).hexdigest() == BASE_SHA256
