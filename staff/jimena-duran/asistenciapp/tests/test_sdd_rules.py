"""Comprueba las puertas SDD escritas y la integridad de la spec heredada."""

import hashlib
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

RULES = {'CA-01': 'Todo cambio de código, tests, README u otra documentación de uso requiere una spec aprobada que lo cubra.', 'CA-02': 'Sin esa aprobación, solo se prepara la spec y se espera el ok de Jimena Durán; no se escriben plan, tasks ni implementación.', 'CA-03': 'El orden es spec → plan → tasks → implementación, con aprobación explícita de Jimena Durán al terminar cada fase de preparación.', 'CA-04': 'Si la spec activa no cubre el pedido, se abre una spec nueva.', 'CA-05': 'Una issue, una rama o una pull request no sustituyen la spec aprobada.'}


@pytest.mark.parametrize("document", ["CONSTITUTION.md", "AGENT.md"])
@pytest.mark.parametrize("criterion,rule", RULES.items())
def test_sdd_gates(document, criterion, rule):
    text = (ROOT / document).read_text(encoding="utf-8-sig")
    assert rule in text, f"{criterion}: falta la regla en {document}"


@pytest.mark.parametrize("document", ["CONSTITUTION.md", "AGENT.md"])
def test_personal_scope(document):
    text = (ROOT / document).read_text(encoding="utf-8-sig")
    assert "staff/jimena-duran/asistenciapp/" in text
    assert "Jimena Durán" in text
    assert "staff/victor-chang/" not in text
    assert "Victor" not in text


def test_constitution_amendment():
    text = (ROOT / "CONSTITUTION.md").read_text(encoding="utf-8-sig")
    assert "Versión 2.2" in text
    assert "| 2.2 | 2026-10-22 |" in text
    assert "solo Jimena Durán lo **aprueba**" in text


@pytest.mark.parametrize("filename,expected", [
    ("plan.md", "642B318B580BF3781D80AA224B95ED09D0434B46532D9AA330A583392F3887F3"),
    ("spec.md", "F149E4998A47B1E1882A31128C64C0644E37456814843118546A0A5405F6471F"),
    ("tasks.md", "0D7537F990018843048942D815ECF7F391ADD0A7E6E024593117FE870B4C26BA"),
])
def test_inherited_spec_unchanged(filename, expected):
    content = (ROOT / "specs" / "001-checkin-codigo" / filename).read_bytes()
    assert hashlib.sha256(content).hexdigest().upper() == expected
