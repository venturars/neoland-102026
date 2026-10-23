"""Las instrucciones no guardan un nombre personal. CA-01, CA-02, CA-03."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
GENERIC_CD = "cd staff/<usuario>/asistenciapp"

KEPT = {
    "specs/001-checkin-codigo/spec.md": [
        "Todas resueltas el 2026-10-19: las propuestas se aceptaron.",
        "se comprueba que un alumno puede anotar a compañeros que no están, con otros nombres",
    ],
    "specs/001-checkin-codigo/plan.md": [
        "## 8. Decisiones tomadas",
    ],
    "specs/001-checkin-codigo/tasks.md": [
        "2026-10-20: desde un móvil con datos móviles, el registro fue correcto.",
        "2026-10-20: el panel se abre con el enlace tal cual.",
        "2026-10-20: el CSV tiene dos columnas y las tildes se ven bien.",
        "En un móvil, registrarse dos veces con nombres distintos queda bloqueado, y un registro se quita desde el panel. *(2026-10-20: los pasos 1 a 5 salieron bien.)*",
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


def test_readme_uses_a_generic_folder():
    readme = (APP_ROOT / "README.md").read_text(encoding="utf-8")
    cd_lines = [
        line.strip()
        for line in readme.splitlines()
        if line.strip().startswith("cd staff/")
    ]
    assert cd_lines == [GENERIC_CD, GENERIC_CD]


def test_no_markdown_outside_this_spec_names_victor():
    found = []
    for relative, path in _markdown_files():
        if "victor" in path.read_text(encoding="utf-8").lower():
            found.append(str(relative))
    assert found == []


def test_old_notes_keep_their_date_and_what_was_checked():
    for relative, phrases in KEPT.items():
        text = (APP_ROOT / relative).read_text(encoding="utf-8")
        lines = text.splitlines()
        for phrase in phrases:
            if phrase.startswith("#"):
                assert phrase in lines
            else:
                assert phrase in text
