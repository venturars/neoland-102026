"""Tests de la spec 004 · documentación sin referencias personales."""

from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
SPEC_004 = ROOT / "specs" / "004-quitar-referencias-personales"

REWRITTEN_NOTES = [
    ("specs/001-checkin-codigo/spec.md", "Todas resueltas el 2026-10-19 aceptando las propuestas."),
    ("specs/001-checkin-codigo/spec.md", "se descubre que un alumno puede registrar a compañeros ausentes"),
    ("specs/001-checkin-codigo/plan.md", "## 8. Decisiones aprobadas"),
    ("specs/001-checkin-codigo/tasks.md", "*(Probado el 2026-10-20: registro correcto desde un móvil con datos móviles.)*"),
    ("specs/001-checkin-codigo/tasks.md", "*(Probado el 2026-10-20: el panel se abre directamente.)*"),
    ("specs/001-checkin-codigo/tasks.md", "*(Probado el 2026-10-20: dos columnas y tildes correctas.)*"),
    ("specs/001-checkin-codigo/tasks.md", "*(Probado el 2026-10-20: pasos 1–5 correctos.)*"),
]


def docs():
    for path in ROOT.rglob("*.md"):
        if ".venv" in path.parts or SPEC_004 in path.parents:
            continue
        yield path


def test_readme_uses_generic_user_folder():  # CA-01
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    cd_lines = [line.strip() for line in readme.splitlines() if line.strip().startswith("cd staff/")]
    assert cd_lines
    assert all(line == "cd staff/<usuario>/asistenciapp" for line in cd_lines)


def test_docs_have_no_personal_name():  # CA-02
    offenders = [str(p.relative_to(ROOT)) for p in docs() if "victor" in p.read_text(encoding="utf-8").lower()]
    assert offenders == []


@pytest.mark.parametrize("relative, note", REWRITTEN_NOTES)
def test_spec_001_notes_keep_date_and_result(relative, note):  # CA-03
    assert note in (ROOT / relative).read_text(encoding="utf-8")
