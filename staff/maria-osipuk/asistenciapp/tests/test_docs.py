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
    assert "Busca specs únicamente en `specs/` de esta app." in agents
    assert "Una spec de otra aplicación no autoriza cambios aquí." in agents


def section(text, start, end):
    return text.split(start, 1)[1].split(end, 1)[0]


def test_constitution_keeps_concrete_rules():  # spec 009 · CA-09
    constitution = (ROOT / "docs" / "CONSTITUTION.md").read_text(encoding="utf-8")
    mobile = section(constitution, "### P5", "### P6")
    assert "400 px" in mobile
    assert "<label>" in mobile
    security = section(constitution, "## 6.", "## 7.")
    assert "dos veces en la misma sesión" in security
    scope = section(constitution, "## 7.", "## 8.")
    assert "fuera de esta carpeta" in scope


def test_workflow_requires_spec_before_editing():  # spec 009 · CA-06, CA-07
    workflow = (ROOT / "agents" / "git-workflow-agent.md").read_text(encoding="utf-8")
    assert "sin parar el avance" not in workflow
    assert "7. Las specs" in workflow
