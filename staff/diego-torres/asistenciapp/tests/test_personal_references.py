"""Documentación sin referencias personales. CA-01, CA-02, CA-03."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
GENERIC_CD = "cd staff/<usuario>/asistenciapp"

PRESERVED = {
    "specs/001-checkin-codigo/spec.md": [
        "Todas resueltas el 2026-10-19: las propuestas quedaron aceptadas.",
        "se detecta que un alumno puede registrar a compañeros ausentes con otros nombres",
    ],
    "specs/001-checkin-codigo/plan.md": [
        "## 8. Decisiones tomadas",
    ],
    "specs/001-checkin-codigo/tasks.md": [
        "2026-10-20: registro correcto desde un móvil con datos móviles.",
        "2026-10-20: el panel se abre directamente.",
        "2026-10-20: dos columnas y tildes correctas.",
        "Prueba en un móvil: registrarse dos veces con nombres distintos queda bloqueado, y se quita un registro desde el panel. *(2026-10-20: pasos 1–5 correctos.)*",
    ],
}


def _markdown_files():
    for path in APP_ROOT.rglob("*.md"):
        relative = path.relative_to(APP_ROOT)
        if relative.parts[0] == ".venv":
            continue
        if relative.parts[:2] == ("specs", "004-quitar-referencias-personales"):
            continue
        yield relative, path


def test_readme_cd_lines_use_a_generic_user():  # CA-01
    readme = (APP_ROOT / "README.md").read_text(encoding="utf-8")
    cd_lines = [
        line.strip()
        for line in readme.splitlines()
        if line.strip().startswith("cd staff/")
    ]
    assert cd_lines == [GENERIC_CD, GENERIC_CD]


def test_docs_do_not_name_victor():  # CA-02
    hits = []
    for relative, path in _markdown_files():
        if "victor" in path.read_text(encoding="utf-8").lower():
            hits.append(str(relative))
    assert hits == []


def test_notes_keep_the_date_and_the_result():  # CA-03
    for relative, phrases in PRESERVED.items():
        text = (APP_ROOT / relative).read_text(encoding="utf-8")
        lines = text.splitlines()
        for phrase in phrases:
            if phrase.startswith("#"):
                assert phrase in lines
            else:
                assert phrase in text
