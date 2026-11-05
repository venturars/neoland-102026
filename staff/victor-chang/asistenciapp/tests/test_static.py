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


@pytest.mark.parametrize(("family", "weight", "file"), FONTS)
def test_each_font_is_declared(family, weight, file):
    assert {"family": family, "weight": weight, "url": f"fonts/{file}"} in font_faces()


def test_font_faces_swap_to_the_system_font_while_loading():
    blocks = re.findall(r"@font-face\s*{([^}]*)}", STYLES)
    assert blocks
    assert all(re.search(r"font-display:\s*swap", b) for b in blocks)


@pytest.mark.parametrize(("family", "weight", "file"), FONTS)
def test_the_app_serves_each_font(client, family, weight, file):
    res = client.get(f"/fonts/{file}")
    assert res.status_code == 200
    assert res.mimetype == "font/woff2"
    assert res.data[:4] == b"wOF2"


@pytest.mark.parametrize("family", ["Montserrat", "Roboto"])
def test_each_font_comes_with_its_licence(family):
    licence = STATIC_DIR / "fonts" / f"OFL-{family}.txt"
    assert "SIL OPEN FONT LICENSE" in licence.read_text(encoding="utf-8").upper()


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


# ---------- CA-06: contraste suficiente en claro y en oscuro ----------

TEXT, NON_TEXT = 4.5, 3.0
# (primer plano, fondo, mínimo) · plan §2.1
PAIRS = (
    ("text", "bg", TEXT),
    ("text", "surface", TEXT),
    ("muted", "bg", TEXT),
    ("muted", "surface", TEXT),
    ("accent", "bg", TEXT),  # enlaces y botones secundarios
    ("accent", "surface", TEXT),
    ("accent-text", "accent", TEXT),  # botón principal
    ("accent", "accent-soft", TEXT),  # botón secundario al pasar el ratón
    ("muted", "border", TEXT),  # etiqueta "cerrada"
    ("header-text", "header-bg", TEXT),
    ("danger", "bg", TEXT),
    ("danger", "surface", TEXT),
    ("danger-text", "danger", TEXT),  # "Sí, cerrar"
    ("ok-text", "ok-bg", TEXT),  # mensajes de éxito y etiqueta "abierta"
    ("error-text", "error-bg", TEXT),
    ("warn-text", "warn-bg", TEXT),
    ("control-border", "surface", NON_TEXT),  # borde de los campos
    ("control-border", "bg", NON_TEXT),
)


def color_tokens(css):
    """Las variables `--nombre: #rrggbb` de un bloque `:root`."""
    return {name: value.lower() for name, value in re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})\b", css)}


def themes():
    light = re.search(r"^:root\s*{([^}]*)}", STYLES, re.MULTILINE)
    # spec 007 · CA-19: el bloque oscuro se salta con data-tema="claro" (la ventana de escritorio).
    dark = re.search(
        r"@media\s*\(prefers-color-scheme:\s*dark\)\s*{\s*:root(?::not\(\[data-tema=\"claro\"\]\))?\s*{([^}]*)}",
        STYLES,
    )
    assert light and dark
    light_tokens = color_tokens(light.group(1))
    return {"claro": light_tokens, "oscuro": {**light_tokens, **color_tokens(dark.group(1))}}


def luminance(hex_color):
    channels = [int(hex_color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
    r, g, b = (c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    high, low = sorted((luminance(a), luminance(b)), reverse=True)
    return (high + 0.05) / (low + 0.05)


def test_contrast_formula():  # valores de referencia de WCAG
    assert round(contrast("#ffffff", "#000000"), 1) == 21.0
    assert round(contrast("#ffffff", "#e6284e"), 1) == 4.4


@pytest.mark.parametrize("theme", ["claro", "oscuro"])
@pytest.mark.parametrize(("fg", "bg", "minimum"), PAIRS, ids=lambda v: str(v))
def test_contrast(theme, fg, bg, minimum):
    tokens = themes()[theme]
    assert contrast(tokens[fg], tokens[bg]) >= minimum


def test_neoland_red_for_buttons_and_links():  # spec P1
    assert themes()["claro"]["accent"] == "#d01f45"


def test_open_badge_stays_green():  # plan §2.5 v1.1
    rule = re.search(r"^\.badge\s*{([^}]*)}", STYLES, re.MULTILINE)
    assert rule
    assert re.search(r"background:\s*var\(--ok-bg\)", rule.group(1))
    assert re.search(r"(?<![-\w])color:\s*var\(--ok-text\)", rule.group(1))


# ---------- CA-01: cabecera oscura con el nombre de la app ----------


@pytest.mark.parametrize("page", ["index.html", "profesor.html", "alumno.html"])
def test_every_page_has_the_brand_header(page):
    html = (STATIC_DIR / page).read_text(encoding="utf-8").split("<body", 1)[1]  # sin el <title>
    header = re.search(r'<header class="brand">(.*?)</header>', html, re.DOTALL)
    assert header
    assert re.search(r'class="wordmark">AsistenciApp<', header.group(1))
    assert html.count("AsistenciApp<") == 1  # el nombre no se repite (plan §2.3)


# ---------- spec 007 · T10: clase online, versión y guardar en la ventana ----------

PANEL = (STATIC_DIR / "profesor.html").read_text(encoding="utf-8")
PANEL_JS = (STATIC_DIR / "profesor.js").read_text(encoding="utf-8")


def test_panel_has_the_online_class_switch():  # CA-07, P5: un botón con su estado, no un div
    button = re.search(r"<button\b[^>]*\bid=\"online-toggle\"[^>]*>", PANEL)
    assert button
    assert 'type="button"' in button.group(0)
    assert 'aria-pressed="false"' in button.group(0)


def test_online_state_is_announced():  # CA-08, CA-09, U4: el estado y los errores se anuncian
    status = re.search(r"<[a-z]+\b[^>]*\bid=\"online-status\"[^>]*>", PANEL)
    assert status
    assert 'role="status"' in status.group(0) and 'aria-live="polite"' in status.group(0)


def test_the_first_heading_is_still_the_h1():  # U4: la tarjeta va antes de cada vista y no lleva un h2
    body = PANEL.split("<body", 1)[1]
    assert re.search(r"<h[1-6]\b", body).group(0) == "<h1"


def test_the_old_local_warning_is_gone():  # el interruptor lo sustituye (plan §2.6)
    assert "local-warning" not in PANEL and "local-warning" not in PANEL_JS
    assert "python app.py --tunel" not in PANEL


def test_panel_shows_the_version():  # CA-04
    assert re.search(r"<footer\b[^>]*>.*\bid=\"app-version\"", PANEL, re.DOTALL)


@pytest.mark.parametrize("path", ["/api/app", "/api/online"])
def test_panel_uses_its_single_api_function(path):  # U3
    assert re.search(rf"\bapi\(\s*[\"'`]{path}[\"'`]", PANEL_JS)


def test_there_is_only_one_fetch():  # U3: toda llamada pasa por api()
    assert PANEL_JS.count("fetch(") == 1


def test_dark_mode_is_skipped_when_the_page_asks_for_light():  # spec 007 · CA-19
    assert re.search(
        r"@media\s*\(prefers-color-scheme:\s*dark\)\s*{\s*:root:not\(\[data-tema=\"claro\"\]\)\s*{", STYLES
    )
    assert STYLES.count("prefers-color-scheme") == 1  # no hay otras reglas oscuras que se salten la marca


def test_the_panel_sets_the_theme_before_painting():  # CA-19: sin parpadeo en oscuro
    head = PANEL.split("</head>", 1)[0]
    script = re.search(r"<script\b[^>]*\bsrc=\"tema\.js\"[^>]*>", head)
    assert script and "defer" not in script.group(0) and "async" not in script.group(0)


def test_light_theme_comes_from_the_address():  # CA-19: ?tema=claro, solo en la ventana (app.py)
    theme_js = (STATIC_DIR / "tema.js").read_text(encoding="utf-8")
    assert "location.search" in theme_js and '"tema"' in theme_js and '"claro"' in theme_js
    assert "dataset.tema" in theme_js


@pytest.mark.parametrize("page", ["alumno.html", "index.html"])
def test_student_pages_still_follow_the_system(page):  # spec 006 · CA-06: los alumnos, como su móvil
    assert "tema.js" not in (STATIC_DIR / page).read_text(encoding="utf-8")


def test_csv_uses_the_window_save_dialog_only_when_it_exists():  # CA-17 · plan §2.9
    assert re.search(r"window\.pywebview\?\.api\?\.save_file", PANEL_JS)
    assert "a.download = filename" in PANEL_JS  # en un navegador, la descarga de siempre
