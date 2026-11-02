"""Estructura estable de la identidad visual y sus reglas educativas.

Estas pruebas no intentan decidir si un diseño es bonito. Comprueban las
piezas que el navegador y la documentación necesitan para ofrecer la
experiencia aprobada en la spec 007.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(relative_path: str) -> str:
    """Lee un archivo de la aplicación como texto UTF-8."""
    return (ROOT / relative_path).read_text(encoding="utf-8")


def test_every_page_uses_the_single_dark_theme():
    for filename in ("index.html", "profesor.html", "alumno.html"):
        source = read(f"static/{filename}")
        assert 'href="styles.css?v=013"' in source, filename
        assert 'src="theme.js"' not in source, filename
        assert "data-theme-choice" not in source, filename


def test_styles_define_dark_as_the_only_theme():
    source = read("static/styles.css")
    assert "color-scheme: dark" in source
    assert "color-scheme: light" not in source
    assert '[data-theme="' not in source


def test_teacher_page_has_dashboard_and_live_classroom_regions():
    source = read("static/profesor.html")
    for element_id in (
        "teacher-navigation",
        "dashboard-stats",
        "stat-sessions",
        "stat-average",
        "stat-open",
        "enter-live",
        "live-classroom",
        "exit-live",
        "live-code",
        "live-countdown",
        "live-students",
        "arrival-toast",
    ):
        assert f'id="{element_id}"' in source, element_id

    script = read("static/profesor.js")
    for piece in ("attendance-student-card", "classroom-avatar", "Llegó a las"):
        assert piece in script
    assert '"Quitar"' not in script
    assert 'src="profesor.js?v=014"' in source


def test_live_classroom_does_not_contain_private_controls():
    source = read("static/profesor.html")
    start = source.index('id="live-classroom"')
    end = source.index("</section>", start)
    live_classroom = source[start:end]
    for private_id in ("s-link", "copy", "download", "close", "s-list"):
        assert f'id="{private_id}"' not in live_classroom


def test_student_page_has_three_steps_and_one_code_input():
    source = read("static/alumno.html")
    for step in ("name", "code", "done"):
        assert f'data-step="{step}"' in source
    assert source.count('id="code"') == 1
    assert source.count("data-code-digit") == 4
    assert 'id="student-steps"' in source
    assert 'src="alumno.js?v=014"' in source


def test_styles_include_mobile_focus_and_reduced_motion_rules():
    source = read("static/styles.css")
    assert ":focus-visible" in source
    assert re.search(r"@media\s*\([^)]*max-width", source)
    assert "prefers-reduced-motion" in source


def test_agent_rules_are_concrete_and_junior_friendly():
    source = read("AGENTS.md")
    normalized = source.lower()
    for piece in (
        "desarrolladora junior",
        "sencillo",
        "explícito",
        "declarativo",
        "lineal",
        "nombres descriptivos",
        "solución más larga",
        "abstracciones prematuras",
        "inglés sencillo",
        "código nuevo",
        "partes modificadas",
    ):
        assert piece in normalized

    for reason in ("decisión", "límite", "regla", "entrada", "salida", "error"):
        assert reason in normalized


def test_readme_explains_the_visual_style_and_live_classroom():
    source = read("README.md")
    for piece in ("Aula en directo", "tema oscuro"):
        assert piece in source


def test_pages_do_not_load_external_presentation_assets():
    references: list[str] = []
    pattern = re.compile(r'(?:src|href)="([^"]+)"')
    for filename in ("index.html", "profesor.html", "alumno.html"):
        references.extend(pattern.findall(read(f"static/{filename}")))
    assert not [value for value in references if value.startswith(("http://", "https://"))]

