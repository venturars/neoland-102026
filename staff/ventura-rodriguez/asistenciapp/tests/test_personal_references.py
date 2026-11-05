"""Documentación sin referencias personales."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
GENERIC_CD = "cd staff/<usuario>/asistenciapp"


def _markdown_files():
    for path in APP_ROOT.rglob("*.md"):
        relative = path.relative_to(APP_ROOT)
        if relative.parts[0] == ".venv":
            continue
        yield relative, path


def test_readme_cd_lines_use_a_generic_user():
    readme = (APP_ROOT / "README.md").read_text(encoding="utf-8")
    cd_lines = [
        line.strip()
        for line in readme.splitlines()
        if line.strip().startswith("cd staff/")
    ]
    assert cd_lines == [GENERIC_CD, GENERIC_CD]


def test_docs_do_not_name_victor():
    hits = []
    for relative, path in _markdown_files():
        if "victor" in path.read_text(encoding="utf-8").lower():
            hits.append(str(relative))
    assert hits == []
