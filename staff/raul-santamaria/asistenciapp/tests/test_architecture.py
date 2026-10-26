"""Límites de documentos y de arquitectura. CA-01 a CA-06 y CA-09.

El almacén puede nombrar la tabla ``sessions``: eso es el dato guardado.
Lo que no puede hacer es importar las reglas de ``domain.session``.
"""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]


def _text(relative: str) -> str:
    return (APP_ROOT / relative).read_text(encoding="utf-8")


def _python_files(relative: str):
    root = APP_ROOT / relative
    return sorted(root.rglob("*.py"))


def test_constitution_lives_in_docs():  # CA-01
    assert (APP_ROOT / "docs" / "CONSTITUTION.md").is_file()
    assert not (APP_ROOT / "CONSTITUTION.md").exists()


def test_architecture_document_keeps_only_what_this_app_needs():  # CA-02
    text = _text("docs/ARCHITECTURE.md")
    assert "reglas" in text.lower()
    assert "almacén" in text.lower()
    assert "pantalla" in text.lower()
    for tool in ("PostgreSQL", "SQLAlchemy", "Alembic"):
        assert tool in text


def test_agent_manual_was_renamed_and_explains_how_to_write():  # CA-03
    assert not (APP_ROOT / "AGENT.md").exists()
    text = _text("AGENTS.md")
    assert ":param" in text
    assert ":return" in text
    assert "Usage" in text


def test_domain_does_not_open_the_database_or_draw_screens():  # CA-04
    files = _python_files("asistencia/domain")
    assert files
    for path in files:
        text = path.read_text(encoding="utf-8")
        assert "sqlite3" not in text
        assert "flask" not in text


def test_storage_does_not_decide_rules_or_draw_screens():  # CA-05
    text = _text("asistencia/storage/sqlite.py")
    assert "flask" not in text
    assert "clean_name" not in text
    assert "is_valid_code" not in text
    assert "domain.session" not in text
    assert "import session" not in text


def test_app_does_not_open_the_database():  # CA-06
    text = _text("app.py")
    assert "sqlite3" not in text
    assert "asistencia.storage" not in text


def test_constitution_names_the_new_folders():  # CA-09
    text = _text("docs/CONSTITUTION.md")
    assert "Versión 3.0" in text
    assert "IP pública estática" in text
    assert "intentos de registrarse" in text
    for folder in (
        "docs/",
        "asistencia/domain/",
        "asistencia/usecases/",
        "asistencia/storage/",
    ):
        assert folder in text
