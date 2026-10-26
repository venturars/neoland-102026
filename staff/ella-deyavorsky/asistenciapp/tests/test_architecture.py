"""Tests de la arquitectura y de los documentos · spec 005 · CA-09, CA-13."""

import ast
import sys
from pathlib import Path

import pytest

APP_DIR = Path(__file__).resolve().parents[1]
PACKAGE = "asistencia"
STDLIB = set(sys.stdlib_module_names)

# Qué paquetes propios puede importar cada parte (además de la biblioteca estándar).
ALLOWED = {
    "domain": set(),
    "usecases": {"domain", "storage"},
    "storage": set(),
}


def imported_modules(path: Path) -> set[str]:
    """Devuelve los nombres completos de los módulos que importa un fichero."""
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            modules.add(node.module)
    return modules


def forbidden_imports(layer: str, path: Path) -> list[str]:
    """Devuelve los imports de ``path`` que la parte ``layer`` no puede hacer."""
    bad = []
    for module in imported_modules(path):
        root = module.split(".")[0]
        if root in STDLIB:
            continue
        parts = module.split(".")
        own_layer = parts[1] if root == PACKAGE and len(parts) > 1 else None
        if own_layer in ALLOWED[layer] or own_layer == layer:
            continue
        bad.append(module)
    return sorted(bad)


@pytest.mark.parametrize("layer", ALLOWED)
def test_layer_exists(layer):  # CA-09
    assert (APP_DIR / PACKAGE / layer).is_dir(), f"falta {PACKAGE}/{layer}/"


@pytest.mark.parametrize("layer", ALLOWED)
def test_layer_imports_only_what_it_may(layer):  # CA-09
    folder = APP_DIR / PACKAGE / layer
    assert folder.is_dir(), f"falta {PACKAGE}/{layer}/"
    errors = {}
    for path in sorted(folder.rglob("*.py")):
        bad = forbidden_imports(layer, path)
        if bad:
            errors[str(path.relative_to(APP_DIR))] = bad
    assert not errors, f"imports no permitidos: {errors}"


@pytest.mark.parametrize("forbidden", ["asistencia.storage", "sqlite3"])
def test_app_does_not_import_storage(forbidden):  # CA-16
    bad = [m for m in imported_modules(APP_DIR / "app.py") if m == forbidden or m.startswith(forbidden + ".")]
    assert not bad, f"app.py no debe importar {forbidden}: {sorted(bad)}"


@pytest.mark.parametrize("name", ["docs/CONSTITUTION.md", "docs/ARCHITECTURE.md", "AGENTS.md"])
def test_document_exists(name):  # CA-13
    assert (APP_DIR / name).is_file(), f"falta {name}"


@pytest.mark.parametrize("name", ["CONSTITUTION.md", "AGENT.md"])
def test_old_document_is_gone_from_root(name):  # CA-13
    assert not (APP_DIR / name).exists(), f"{name} no debe estar en la raíz"


@pytest.mark.parametrize("marker", [":param", ":return", "Usage"])
def test_agents_has_writing_norms(marker):  # CA-13
    path = APP_DIR / "AGENTS.md"
    assert path.is_file(), "falta AGENTS.md"
    assert marker in path.read_text(encoding="utf-8")
