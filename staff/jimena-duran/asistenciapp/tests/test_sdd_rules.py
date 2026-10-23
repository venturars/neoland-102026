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
    assert text.splitlines()[2].startswith("> Versión 3.0 ·")
    assert "| 2.2 | 2026-10-22 |" in text
    assert "solo Jimena Durán lo **aprueba**" in text


SPEC_BASELINES = [
    ("plan.md", "2A34371026BA29BD8573E0A595095AEA4DA576914E222E4250849F33032124C9"),
    ("spec.md", "A98973E10B5AE5AF3A242F63D970D7501B5E310BF01F1F62FF1263E93930F49E"),
    ("tasks.md", "BDB761AF609BAF66BF475BEFC380F53B877BB2D70C60BD8E3F0DECBC85C46EE3"),
]


@pytest.mark.parametrize("filename,expected", SPEC_BASELINES)
def test_inherited_spec_anonymized_baseline(filename, expected):
    content = (ROOT / "specs" / "001-checkin-codigo" / filename).read_bytes()
    # Misma base publicada, con CRLF normalizado a LF solo en memoria.
    content = content.replace(b"\r\n", b"\n")
    assert hashlib.sha256(content).hexdigest().upper() == expected


@pytest.mark.parametrize("filename,expected", SPEC_BASELINES)
@pytest.mark.parametrize("newline", [b"\n", b"\r\n"])
@pytest.mark.parametrize("change", ["none", "text", "space", "final_newline"])
def test_spec_integrity_line_endings_and_changes(tmp_path, monkeypatch, filename, expected, newline, change):
    content = (ROOT / "specs/001-checkin-codigo" / filename).read_bytes().replace(b"\r\n", b"\n")
    if change == "text":
        content += b"Cambio real.\n"
    elif change == "space":
        content += b" "
    elif change == "final_newline":
        assert content.endswith(b"\n")
        content = content[:-1]
    target = tmp_path / "specs/001-checkin-codigo" / filename
    target.parent.mkdir(parents=True)
    target.write_bytes(content.replace(b"\n", newline))
    monkeypatch.setitem(globals(), "ROOT", tmp_path)
    if change == "none":
        test_inherited_spec_anonymized_baseline(filename, expected)
    else:
        with pytest.raises(AssertionError):
            test_inherited_spec_anonymized_baseline(filename, expected)
