"""La página no abre la base, y cada parte se queda en su sitio."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]


def _text(relative: str) -> str:
    return (APP_ROOT / relative).read_text(encoding="utf-8")


def test_constitution_lives_in_docs():
    assert (APP_ROOT / "docs" / "CONSTITUTION.md").is_file()
    assert not (APP_ROOT / "CONSTITUTION.md").exists()


def test_manual_was_renamed():
    assert (APP_ROOT / "AGENTS.md").is_file()
    assert not (APP_ROOT / "AGENT.md").exists()
    text = _text("AGENTS.md")
    assert "Recibe" in text
    assert "Devuelve" in text
    assert "Ejemplo" in text


def test_domain_does_not_open_the_database_or_draw_the_page():
    files = list((APP_ROOT / "asistencia" / "domain").glob("*.py"))
    assert files
    for path in files:
        text = path.read_text(encoding="utf-8")
        assert "sqlite3" not in text
        assert "flask" not in text


def test_storage_does_not_decide_rules_or_draw_the_page():
    text = _text("asistencia/storage/sqlite.py")
    assert "flask" not in text
    assert "clean_name" not in text
    assert "is_valid_code" not in text


def test_app_does_not_open_the_database():
    text = _text("app.py")
    assert "sqlite3" not in text
    assert "asistencia.storage" not in text
