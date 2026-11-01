"""Verifica límites de arquitectura y documentos de la spec 005."""
import ast
import json
import hashlib
from pathlib import Path
import pytest
ROOT=Path(__file__).resolve().parents[1]

def imports(path):
    tree=ast.parse(path.read_text(encoding="utf-8"))
    return [node.module or "" for node in ast.walk(tree) if isinstance(node,ast.ImportFrom)] + [alias.name for node in ast.walk(tree) if isinstance(node,ast.Import) for alias in node.names]

@pytest.mark.parametrize("name",["codes","names","session","attempts"])
def test_domain_dependencies(name):
    modules=imports(ROOT/f"asistencia/domain/{name}.py")
    assert all(not m.startswith(("flask","sqlite3","asistencia.storage","asistencia.usecases")) for m in modules)

def test_storage_dependencies():
    modules=imports(ROOT/"asistencia/storage/sqlite.py")
    assert all(not m.startswith(("flask","asistencia.domain","asistencia.usecases")) for m in modules)

def test_http_dependencies():
    modules=imports(ROOT/"app.py")
    assert all(not m.startswith(("sqlite3","asistencia.storage")) for m in modules)

def test_document_locations_and_links():
    for old in ["AGENT.md","CONSTITUTION.md"]: assert not (ROOT/old).exists()
    for new in ["AGENTS.md","docs/CONSTITUTION.md","docs/ARCHITECTURE.md"]: assert (ROOT/new).is_file()
    for name in ["README.md","AGENTS.md"]:
        assert "docs/CONSTITUTION.md" in (ROOT/name).read_text(encoding="utf-8")
    assert "AGENTS.md" in (ROOT/"README.md").read_text(encoding="utf-8")

def test_writing_and_architecture():
    guide=(ROOT/"AGENTS.md").read_text(encoding="utf-8")
    for term in [":param",":return",":rtype","Usage::"]: assert term in guide
    architecture=(ROOT/"docs/ARCHITECTURE.md").read_text(encoding="utf-8")
    for term in ["domain/","usecases/","storage/","PostgreSQL","SQLAlchemy","Alembic"]: assert term in architecture
    constitution=(ROOT/"docs/CONSTITUTION.md").read_text(encoding="utf-8")
    assert constitution.splitlines()[2].startswith("> Versión 3.0 ·")

def test_static_and_closed_specs_unchanged():
    # Referencia: bytes LF publicados en la base 180cd52 de la PR #246.
    manifest=json.loads((ROOT/"specs/005-reorganizar-arquitectura/integrity.json").read_text(encoding="utf-8"))
    expected = {path.relative_to(ROOT).as_posix() for path in (ROOT/"static").rglob("*") if path.is_file()}
    for folder in sorted((ROOT/"specs").glob("00[1-4]-*")):
        expected.update(path.relative_to(ROOT).as_posix() for path in folder.rglob("*") if path.is_file())
    assert set(manifest) == expected
    for name,digest in manifest.items():
        assert content_digest((ROOT/name).read_bytes()) == digest, name


def content_digest(data: bytes) -> str:
    """Calcula SHA256 normalizando solo los saltos CRLF del checkout a LF."""
    return hashlib.sha256(data.replace(b"\r\n", b"\n")).hexdigest()


@pytest.mark.parametrize("data", [b"uno\ndos\n", b"uno\r\ndos\r\n", b"uno\r\ndos\n"])
def test_integrity_accepts_checkout_line_endings(data):
    assert content_digest(data) == hashlib.sha256(b"uno\ndos\n").hexdigest()


@pytest.mark.parametrize("data", [b"Uno\ndos\n", b"uno \ndos\n", b"uno\ndos", b"uno\rdos\n"])
def test_integrity_detects_content_changes(data):
    assert content_digest(data) != content_digest(b"uno\ndos\n")
