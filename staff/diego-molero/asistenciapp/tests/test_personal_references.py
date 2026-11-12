"""Comprueba rutas reutilizables y la conservación de las notas históricas."""

from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]


def test_readme_uses_generic_user():
    """Los dos ejemplos de entrada sirven para cualquier copia del proyecto."""
    lines = (APP_ROOT / "README.md").read_text(encoding="utf-8").splitlines()
    assert [line for line in lines if line.startswith("cd staff/")] == [
        "cd staff/<usuario>/asistenciapp",
        "cd staff/<usuario>/asistenciapp",
    ]


def test_markdown_has_no_inherited_personal_references():
    """Revisa la documentación del proyecto, excluyendo la spec de limpieza."""
    documents = list(APP_ROOT.glob("*.md"))
    for directory in ("specs", "docs"):
        documents.extend((APP_ROOT / directory).rglob("*.md"))
    for document in documents:
        # La spec 004 necesita describir la referencia que elimina.
        if "004-quitar-referencias-personales" in document.relative_to(APP_ROOT).parts:
            continue
        assert "victor" not in document.read_text(encoding="utf-8").casefold(), str(document)


def test_historical_dates_and_results_are_preserved():
    """Las notas conservan el hecho y la fecha aunque se quite la atribución."""
    expected = {
        "spec.md": (
            "Todas resueltas el 2026-10-19: las propuestas quedaron aceptadas.",
            "se detecta que un alumno puede registrar a compañeros ausentes con otros nombres",
        ),
        "plan.md": ("## 8. Decisiones tomadas",),
        "tasks.md": (
            "2026-10-20: registro correcto desde un móvil con datos móviles.",
            "2026-10-20: el panel se abre directamente.",
            "2026-10-20: dos columnas y tildes correctas.",
            "Prueba en un móvil: registrarse dos veces con nombres distintos queda bloqueado, y se quita un registro desde el panel. *(2026-10-20: pasos 1–5 correctos.)*",
        ),
    }
    for name, phrases in expected.items():
        text = (APP_ROOT / "specs/001-checkin-codigo" / name).read_text(encoding="utf-8")
        for phrase in phrases:
            assert phrase in text, f"{name}: falta la nota histórica {phrase}"
