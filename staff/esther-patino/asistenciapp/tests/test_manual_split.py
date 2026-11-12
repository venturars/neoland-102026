"""Reparto del manual del agente. CA-01 a CA-08 de la spec 008."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]


def _text(relative: str) -> str:
    return (APP_ROOT / relative).read_text(encoding="utf-8")


def _section(text: str, heading: str, next_heading: str) -> str:
    start = text.index(heading)
    end = text.index(next_heading, start + len(heading))
    return text[start:end]


def test_manual_drops_the_intro():  # CA-01
    text = _text("AGENTS.md")
    assert text.startswith("# AGENTS.md — Manual de trabajo para agentes de IA\n")
    assert "Este archivo explica" not in text
    assert "cómo debe trabajar un agente" not in text


def test_stop_and_ask_when_docs_disagree():  # CA-02
    text = _text("AGENTS.md")
    assert "contradice la documentación" in text
    assert "para y pregunta" in text


def test_dependency_names_only_the_constitution():  # CA-03
    text = _text("AGENTS.md")
    dependency = next(line for line in text.splitlines() if "dependencia externa" in line)
    assert "docs/CONSTITUTION.md" in dependency
    assert "P3" not in dependency
    assert "P1–P6" in text


def test_tree_document_holds_the_folder_map():  # CA-04
    text = _text("docs/TREE.md")
    assert "CONSTITUTION.md" in text
    assert "ARCHITECTURE.md" in text
    assert "TREE.md" in text
    assert "STYLE.md" in text
    assert "kebab-case" in text
    assert "005-docs-and-architecture" in text
    assert "requirements.txt" in text
    assert "pytest.ini" in text
    assert "app.py" in text
    assert "asistencia/" in text
    assert "static/" in text
    assert "tests/" in text
    assert ".venv/" in text
    assert "data/" in text


def test_style_document_holds_how_to_write():  # CA-05
    style = _text("docs/STYLE.md")
    manual = _text("AGENTS.md")
    assert ":param" in style
    assert ":return" in style
    assert ":param" not in manual
    assert ":return" not in manual


def test_readme_keeps_commands_and_names_dependencies():  # CA-06
    readme = _text("README.md")
    manual = _text("AGENTS.md")
    assert "python3 -m venv .venv" in readme
    assert "source .venv/bin/activate" in readme
    assert "brew install cloudflared" in readme
    assert "python app.py --tunel" in readme
    assert "pytest" in readme
    one_line = (
        "python3 -m venv .venv && source .venv/bin/activate "
        "&& pip install -r requirements.txt"
    )
    assert one_line not in readme
    sentence = next(
        line for line in readme.splitlines() if "Las únicas dependencias son Flask y pytest" in line
    )
    assert "docs/CONSTITUTION.md" in sentence
    assert "P3" not in sentence
    assert "## 4. Comandos" not in manual
    assert one_line not in manual


def test_behavior_rules_live_once_in_the_first_section():  # CA-07
    text = _text("AGENTS.md")
    section = _section(text, "## 1. Antes de hacer nada", "## 2. Flujo SDD")
    for rule in (
        "Solo se edita dentro de la carpeta de este proyecto",
        "Pregunta antes de suponer",
        "Explica lo que haces",
        "Cambios pequeños",
        "Nada de commits ni pushes",
        "Para todo lo que arranques",
        "No toques la constitución",
    ):
        assert rule in section
    assert "Ningún fichero de la app sin spec aprobado" not in section
    assert text.count("Ningún fichero de la app sin spec aprobado") == 1


def test_reading_list_points_at_the_new_documents():  # CA-08
    text = _text("AGENTS.md")
    section = _section(text, "## 1. Antes de hacer nada", "## 2. Flujo SDD")
    assert "docs/TREE.md" in section
    assert "docs/STYLE.md" in section
    assert 'ver §4 "Estado actual"' in text
    assert '## 3. Definición de "terminado"' in text
    assert "## 4. Estado actual" in text
