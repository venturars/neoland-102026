"""Privacidad, límites y conservación de la base anterior a la spec 006."""

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_security_privacy_amendment():
    text = (ROOT / "docs/CONSTITUTION.md").read_text(encoding="utf-8")
    assert text.splitlines()[2].startswith("> Versión 3.0 ·")
    privacy = text.split("### P4 · Privacidad mínima", 1)[1].split("### P5", 1)[0]
    assert "solo para contar intentos de registro y conservar la lista de bloqueo" in privacy
    assert "separada del nombre y de la hora de asistencia" in privacy
    assert "| 3.0 | 2026-10-23 |" in text


def test_security_readme_and_architecture():
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for fragment in ["5 intentos por segundo", "20 por minuto", "permanente", "sin desbloqueo",
                     "Cloudflare Tunnel", "127.0.0.1", "toda la clase", "429"]:
        assert fragment in readme
    assert "Nada de emails ni IPs." not in readme
    architecture = (ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
    assert "asistencia/domain/attempts.py" in architecture
    assert "registration_attempts" in architecture and "blocked_ips" in architecture


def test_closed_specs_static_and_codes_match_pre_006_baseline():
    manifest = json.loads((ROOT / "specs/006-limite-por-ip-publica/integrity.json").read_text(encoding="utf-8"))
    expected = {p.relative_to(ROOT).as_posix() for p in (ROOT / "static").rglob("*") if p.is_file()}
    for folder in (ROOT / "specs").glob("00[1-5]-*"):
        expected.update(p.relative_to(ROOT).as_posix() for p in folder.rglob("*") if p.is_file())
    expected.add("asistencia/domain/codes.py")
    assert set(manifest) == expected
    for name, digest in manifest.items():
        content = (ROOT / name).read_bytes().replace(b"\r\n", b"\n")
        assert hashlib.sha256(content).hexdigest() == digest, name
