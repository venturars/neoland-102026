"""La documentación de uso no nombra a una persona ni su carpeta."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC_004 = ROOT / "specs" / "004-quitar-referencias-personales"
SPEC_006 = ROOT / "specs" / "006-flujo-de-git"
SPEC_007 = ROOT / "specs" / "007-plantillas-por-tipo"
GIT_WORKFLOW_TOP = {"agents", "skills", "tools", "templates", "MCPS"}
GENERIC_PATH = "staff/<usuario>/asistenciapp"


def test_readme_uses_generic_user_path():
    text = (ROOT / "README.md").read_text(encoding="utf-8")
    assert GENERIC_PATH in text
    assert "staff/jose-miguel/asistenciapp" not in text.lower()


def test_markdown_has_no_personal_name_outside_spec_004():
    leftovers = []
    for path in ROOT.rglob("*.md"):
        relative = path.relative_to(ROOT)
        if SPEC_004 in path.parents or path.parent == SPEC_004:
            continue
        if SPEC_006 in path.parents or path.parent == SPEC_006:
            continue
        if SPEC_007 in path.parents or path.parent == SPEC_007:
            continue
        if relative.parts and relative.parts[0] in GIT_WORKFLOW_TOP:
            continue
        if ".venv" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        if "jose-miguel" in text.lower():
            leftovers.append(str(relative))
    assert leftovers == []
