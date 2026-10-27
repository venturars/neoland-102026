"""Tests de las pantallas (static/) · spec 006: letras propias y nada que se pida fuera de la app.

Lo visual (colores en pantalla, 400 px, teclado) se revisa a mano en T08 (plan §5).
"""

import re

import pytest

from attendance.entrypoints.web import STATIC_DIR

STYLES = (STATIC_DIR / "styles.css").read_text(encoding="utf-8")
PAGES = sorted(STATIC_DIR.glob("*.html"))
SCRIPTS = sorted(STATIC_DIR.glob("*.js"))
FONTS = (
    ("Montserrat", "700", "montserrat-latin-700-normal.woff2"),
    ("Montserrat", "800", "montserrat-latin-800-normal.woff2"),
    ("Roboto", "400", "roboto-latin-400-normal.woff2"),
    ("Roboto", "700", "roboto-latin-700-normal.woff2"),
)
MAX_FONTS_BYTES = 300 * 1024
EXTERNAL = re.compile(r"^\s*['\"]?\s*(?:[a-z][a-z0-9+.-]*:|//)", re.IGNORECASE)
# Escritos antes que las letras (T02); deben fallar hasta T04, que quita esta marca.
FONTS_PENDING = pytest.mark.xfail(reason="las letras llegan en T03 y T04", strict=True)


def font_faces():
    """Cada `@font-face` de styles.css como {familia, peso, url}."""
    faces = []
    for block in re.findall(r"@font-face\s*{([^}]*)}", STYLES):
        family = re.search(r"font-family:\s*['\"]?([^'\";]+)", block)
        weight = re.search(r"font-weight:\s*(\d+)", block)
        url = re.search(r"url\(\s*['\"]?([^'\")]+)", block)
        faces.append(
            {
                "family": family.group(1).strip() if family else None,
                "weight": weight.group(1) if weight else None,
                "url": url.group(1) if url else None,
            }
        )
    return faces


# ---------- CA-02: las letras de Neoland, servidas por la app ----------


@FONTS_PENDING
@pytest.mark.parametrize(("family", "weight", "file"), FONTS)
def test_each_font_is_declared(family, weight, file):
    assert {"family": family, "weight": weight, "url": f"fonts/{file}"} in font_faces()


@FONTS_PENDING
def test_font_faces_swap_to_the_system_font_while_loading():
    blocks = re.findall(r"@font-face\s*{([^}]*)}", STYLES)
    assert blocks
    assert all(re.search(r"font-display:\s*swap", b) for b in blocks)


@FONTS_PENDING
@pytest.mark.parametrize(("family", "weight", "file"), FONTS)
def test_the_app_serves_each_font(client, family, weight, file):
    res = client.get(f"/fonts/{file}")
    assert res.status_code == 200
    assert res.mimetype == "font/woff2"
    assert res.data[:4] == b"wOF2"


@FONTS_PENDING
@pytest.mark.parametrize("family", ["Montserrat", "Roboto"])
def test_each_font_comes_with_its_licence(family):
    licence = STATIC_DIR / "fonts" / f"OFL-{family}.txt"
    assert "SIL OPEN FONT LICENSE" in licence.read_text(encoding="utf-8").upper()


@FONTS_PENDING
def test_fonts_are_small():  # spec §5: menos de 300 KB en total
    sizes = [f.stat().st_size for f in (STATIC_DIR / "fonts").glob("*.woff2")]
    assert len(sizes) == len(FONTS)
    assert sum(sizes) < MAX_FONTS_BYTES


# ---------- CA-08: nada sale de la app ----------


@pytest.mark.parametrize("page", PAGES, ids=lambda p: p.name)
def test_pages_load_nothing_from_outside(page):
    html = page.read_text(encoding="utf-8")
    refs = re.findall(r"<(?:link|script|img|iframe|source)\b[^>]*\b(?:src|href)\s*=\s*['\"]([^'\"]+)", html)
    assert refs  # la expresión encuentra los recursos de verdad
    assert [r for r in refs if EXTERNAL.match(r)] == []


def test_styles_load_nothing_from_outside():
    refs = re.findall(r"url\(([^)]*)\)", STYLES) + re.findall(r"@import\s+([^;]+)", STYLES)
    assert [r for r in refs if EXTERNAL.match(r)] == []


@pytest.mark.parametrize("script", SCRIPTS, ids=lambda p: p.name)
def test_scripts_call_only_the_app(script):
    assert re.findall(r"['\"`](?:https?:)?//", script.read_text(encoding="utf-8")) == []
