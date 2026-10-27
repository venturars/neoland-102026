"""Documentación sin referencias personales. CA-01, CA-02, CA-03."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
GENERIC_CD = "cd staff/<usuario>/asistenciapp"

PRESERVED = {
    "AGENTS.md": [
        "Ejecutar desde `staff/<usuario>/asistenciapp/`:",
        "**Solo se edita dentro de `staff/<usuario>/asistenciapp/`.**",
    ],
    "docs/CONSTITUTION.md": [
        "El proyecto vive entero en `staff/<usuario>/asistenciapp/`. No se tocan archivos fuera de esta carpeta.",
        "§7–§8: carpeta `staff/<usuario>/asistenciapp/` y aprueba la persona que trabaja en esta carpeta",
    ],
    "specs/002-spec-antes-del-cambio/spec.md": [
        "**CA-06**: **Dado** la constitución y el manual del agente, **entonces** nombran `staff/<usuario>/asistenciapp/` y dicen que quien aprueba cada fase es la persona que trabaja en esa carpeta.",
    ],
    "specs/002-spec-antes-del-cambio/plan.md": [
        "Constitución §7–§8; `AGENT.md` §4–§6 y rutas `staff/<usuario>/asistenciapp/`",
        "Solo dentro de `staff/<usuario>/asistenciapp/`",
    ],
    "specs/002-spec-antes-del-cambio/tasks.md": [
        "esos apartados siguen nombrando la puerta, el orden, la carpeta `staff/<usuario>/asistenciapp/` y quién aprueba.",
    ],
    "specs/003-activar-el-entorno/tasks.md": [
        "lanzar `pytest` una vez desde `staff/<usuario>/asistenciapp/`.",
    ],
    "specs/001-checkin-codigo/tasks.md": [
        "Rutas `staff/<usuario>/asistenciapp/`.",
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


def test_docs_do_not_name_raul():  # CA-02
    hits = []
    for relative, path in _markdown_files():
        text = path.read_text(encoding="utf-8").lower()
        if "raul" in text or "raúl" in text:
            hits.append(str(relative))
    assert hits == []


def test_rules_keep_generic_paths():  # CA-03
    for relative, phrases in PRESERVED.items():
        text = (APP_ROOT / relative).read_text(encoding="utf-8")
        for phrase in phrases:
            assert phrase in text
