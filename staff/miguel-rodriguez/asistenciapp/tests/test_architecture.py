"""Límites y documentos de la reorganización 005."""

import ast
import importlib.util
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def imports(path):
    package = ".".join(path.relative_to(ROOT).with_suffix("").parts[:-1])
    modules = []
    for node in ast.walk(ast.parse(path.read_text(encoding="utf-8"))):
        if isinstance(node, ast.Import):
            modules.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            module = node.module or ""
            if node.level:
                module = importlib.util.resolve_name("." * node.level + module, package)
            modules.append(module)
            modules.extend(f"{module}.{alias.name}" for alias in node.names)
    return modules


@pytest.mark.parametrize("name", ["codes", "names", "session"])
def test_domain_has_no_outer_dependencies(name):
    modules = imports(ROOT / f"asistencia/domain/{name}.py")
    assert not any(m.startswith(("flask", "sqlite3", "asistencia.storage", "asistencia.usecases")) for m in modules)


def test_storage_has_no_business_or_http_dependencies():
    assert not any(m.startswith(("flask", "asistencia.domain", "asistencia.usecases")) for m in imports(ROOT / "asistencia/storage/sqlite.py"))


def test_usecases_have_no_http_dependency():
    assert not any(m.startswith("flask") for m in imports(ROOT / "asistencia/usecases/attendance.py"))


def test_http_does_not_access_storage_or_rules_directly():
    modules = imports(ROOT / "app.py")
    assert not any(m.startswith(("sqlite3", "asistencia.storage", "asistencia.domain")) for m in modules)
    assert "asistencia.db" not in modules
    assert any(m.startswith("asistencia.usecases") for m in modules)


def test_document_locations_and_current_links():
    assert not (ROOT / "CONSTITUTION.md").exists()
    assert not (ROOT / "AGENT.md").exists()
    for name in ["AGENTS.md", "docs/CONSTITUTION.md", "docs/ARCHITECTURE.md"]:
        assert (ROOT / name).is_file()
    for name in ["README.md", "AGENTS.md", "docs/ARCHITECTURE.md", "docs/CONSTITUTION.md"]:
        path = ROOT / name
        for target in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            if "://" not in target and not target.startswith("#"):
                assert (path.parent / target.split("#")[0]).is_file(), (name, target)


def test_architecture_explains_layers_and_guide_explains_functions():
    text = (ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
    for name in ["domain/", "usecases/", "storage/", "app.py"]:
        assert name in text
    guide = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    for term in [":param", ":return", "Usage::"]:
        assert term in guide
    assert "Versión 3.0" in (ROOT / "docs/CONSTITUTION.md").read_text(encoding="utf-8")
