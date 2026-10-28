"""Contraste AA de los colores de static/styles.css, en modo claro y oscuro · spec 008, CA-04."""

import re
from pathlib import Path

import pytest

CSS = (Path(__file__).resolve().parent.parent / "static" / "styles.css").read_text(encoding="utf-8")
DARK_MEDIA = "@media (prefers-color-scheme: dark)"

AA = 4.5  # texto normal
LARGE = 3.0  # texto grande: 18 px en negrita o más

# (texto, fondo, contraste mínimo). Un valor que empieza por «#» es un color fijo.
PAIRS = [
    ("--text", "--bg", AA),
    ("--text", "--surface", AA),
    ("--muted", "--bg", AA),
    ("--muted", "--surface", AA),
    ("--heading", "--bg", AA),
    ("--heading", "--surface", AA),
    ("--accent-ink", "--bg", AA),  # enlaces, texto carmesí y botones de peligro
    ("--accent-ink", "--surface", AA),
    ("--accent-text", "--accent-strong", AA),  # botones pequeños rellenos y confirmaciones
    ("--accent-text", "--accent", LARGE),  # botones principales: 18 px en negrita
    ("#ffffff", "--charcoal", AA),  # números y texto de la banda del código
    ("--accent-on-dark", "--charcoal", AA),  # etiqueta carmesí sobre la banda
    ("--on-dark-muted", "--charcoal", AA),  # cuenta atrás y etiqueta del enlace en la banda
    ("--ok-text", "--ok-bg", AA),
    ("--warn-text", "--warn-bg", AA),
    ("--error-text", "--error-bg", AA),
]


def _variables(block: str) -> dict:
    return {name: value.lower() for name, value in re.findall(r"(--[\w-]+):\s*(#[0-9a-fA-F]{6})\b", block)}


def _first_root(css: str) -> str:
    return re.search(r":root\s*\{([^}]*)\}", css).group(1)


def _modes() -> dict:
    light_css, dark_css = CSS.split(DARK_MEDIA, 1)
    light = _variables(_first_root(light_css))
    return {"claro": light, "oscuro": {**light, **_variables(_first_root(dark_css))}}


def _luminance(hex_color: str) -> float:
    channels = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    r, g, b = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _contrast(a: str, b: str) -> float:
    high, low = sorted((_luminance(a), _luminance(b)), reverse=True)
    return (high + 0.05) / (low + 0.05)


MODES = _modes()


@pytest.mark.parametrize("mode", MODES)
@pytest.mark.parametrize("fg, bg, minimum", PAIRS, ids=[f"{fg} sobre {bg}" for fg, bg, _ in PAIRS])
def test_pair_meets_aa(mode, fg, bg, minimum):  # CA-04
    colors = MODES[mode]
    for name in (fg, bg):
        assert name.startswith("#") or name in colors, f"Falta la variable {name} en el modo {mode}"
    fg_hex = fg if fg.startswith("#") else colors[fg]
    bg_hex = bg if bg.startswith("#") else colors[bg]
    ratio = _contrast(fg_hex, bg_hex)
    assert ratio >= minimum, f"{fg} ({fg_hex}) sobre {bg} ({bg_hex}) en modo {mode}: {ratio:.2f}:1, mínimo {minimum}:1"
