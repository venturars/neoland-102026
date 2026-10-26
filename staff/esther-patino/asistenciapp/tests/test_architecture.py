"""Sitio de los documentos y límite entre capas. CA-01 a CA-05."""

import ast
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]


def _text(relative: str) -> str:
    return (APP_ROOT / relative).read_text(encoding="utf-8")


def _imports(relative: str) -> list[str]:
    root = APP_ROOT / relative
    files = sorted(root.rglob("*.py")) if root.is_dir() else []
    assert files, relative
    found = []
    for path in files:
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                found.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                found.append(node.module)
    return found


def test_constitution_lives_in_docs():  # CA-01
    text = _text("docs/CONSTITUTION.md")
    assert "Versión 3.0" in text
    assert not (APP_ROOT / "CONSTITUTION.md").exists()


def test_architecture_document_names_the_layers():  # CA-02
    text = _text("docs/ARCHITECTURE.md")
    assert "domain" in text
    assert "actions" in text
    assert "infra" in text
    assert "no se trae" in text


def test_agent_manual_was_renamed_and_shows_how_to_write():  # CA-03
    assert (APP_ROOT / "AGENTS.md").is_file()
    assert not (APP_ROOT / "AGENT.md").exists()
    text = _text("AGENTS.md")
    assert ":param" in text
    assert ":return" in text


def test_rules_do_not_import_the_browser_or_the_database():  # CA-04
    domain = _imports("asistencia/domain")
    assert domain
    for name in domain:
        assert "flask" not in name.lower()
        assert "sqlite3" not in name
    actions = _imports("asistencia/actions")
    for name in actions:
        assert "flask" not in name.lower()


def test_living_docs_link_the_new_places():  # CA-05
    for relative in ("README.md", "AGENTS.md"):
        text = _text(relative)
        assert "docs/CONSTITUTION.md" in text
        assert "AGENTS.md" in text
