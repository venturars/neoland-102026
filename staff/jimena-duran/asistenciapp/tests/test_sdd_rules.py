"""Comprueba puertas SDD y base histórica anonimizada por la spec 004."""

import hashlib
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

RULES = {'CA-01': 'Todo cambio de código, tests, README u otra documentación de uso requiere una spec aprobada que lo cubra.', 'CA-02': 'Sin esa aprobación, solo se prepara la spec y se espera el ok de Jimena Durán; no se escriben plan, tasks ni implementación.', 'CA-03': 'El orden es spec → plan → tasks → implementación, con aprobación explícita de Jimena Durán al terminar cada fase de preparación.', 'CA-04': 'Si la spec activa no cubre el pedido, se abre una spec nueva.', 'CA-05': 'Una issue, una rama o una pull request no sustituyen la spec aprobada.'}


@pytest.mark.parametrize("document", ["docs/CONSTITUTION.md", "AGENTS.md"])
@pytest.mark.parametrize("criterion,rule", RULES.items())
def test_sdd_gates(document, criterion, rule):
    text = (ROOT / document).read_text(encoding="utf-8-sig")
    assert rule in text, f"{criterion}: falta la regla en {document}"


@pytest.mark.parametrize("document", ["docs/CONSTITUTION.md", "AGENTS.md"])
def test_personal_scope(document):
    text = (ROOT / document).read_text(encoding="utf-8-sig")
    assert "staff/jimena-duran/asistenciapp/" in text
    assert "Jimena Durán" in text
    assert "staff/victor-chang/" not in text
    assert "Victor" not in text


def test_constitution_amendment():
    text = (ROOT / "docs/CONSTITUTION.md").read_text(encoding="utf-8-sig")
    assert "Versión 2.3" in text
    assert "| 2.2 | 2026-10-22 |" in text
    assert "solo Jimena Durán lo **aprueba**" in text


@pytest.mark.parametrize("filename,expected", [
    ("plan.md", "40FD09DE5E88DB0F29DD3BF00E69BDF07D039C59B85D1BD3CD144C9FFE7DC186"),
    ("spec.md", "FF35CC0FFBC9AB2049DFF64D2D104C3F24092E4DC098428E4F71B64933435C93"),
    ("tasks.md", "CB15465A2BB7C957FF387338F9A1DF996DD8DD9153F1A96530A9E68D0F946FF8"),
])
def test_inherited_spec_anonymized_baseline(filename, expected):
    content = (ROOT / "specs" / "001-checkin-codigo" / filename).read_bytes()
    assert hashlib.sha256(content).hexdigest().upper() == expected
