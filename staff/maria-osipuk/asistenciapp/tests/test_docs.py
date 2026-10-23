"""Tests de la documentación · CA-01, CA-02, CA-03."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC_004 = ROOT / "specs" / "004-quitar-referencias-personales"
FORBIDDEN = ("Victor", "Víctor", "victor-chang")


def markdown_files():
    for path in ROOT.rglob("*.md"):
        if ".venv" in path.parts:
            continue
        try:
            path.relative_to(SPEC_004)
        except ValueError:
            yield path


def test_docs_have_no_personal_references():  # CA-02
    hits = []
    for path in markdown_files():
        text = path.read_text(encoding="utf-8")
        for word in FORBIDDEN:
            if word in text:
                hits.append(f"{path.relative_to(ROOT)}: {word}")
    assert hits == []


def test_readme_cd_uses_a_generic_user():  # CA-01
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    cds = [line.strip() for line in readme.splitlines() if line.strip().startswith("cd ")]
    assert cds == [
        "cd staff/<usuario>/asistenciapp",
        "cd staff/<usuario>/asistenciapp",
    ]


def test_agent_rules_limit_spec_search_to_this_app():  # CA-03
    agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    assert "staff/maria-osipuk/asistenciapp/" in agents
    assert "únicamente" in agents
    assert "staff/maria-osipuk/asistenciapp/specs/" in agents
