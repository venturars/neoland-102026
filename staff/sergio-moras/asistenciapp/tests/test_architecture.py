"""Tests de la spec 005 · documentos en su sitio y límites entre piezas del código.

Los límites se comprueban leyendo los ``import`` reales de cada fichero con ``ast``.
"""

import ast
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
PACKAGE = ROOT / "asistencia"


def imported_modules(path: Path) -> set[str]:
    """Devuelve los módulos que importa un fichero Python.

    :param path: fichero ``.py``.
    :return: nombres completos importados (``flask``, ``asistencia.domain.codes``…).
    :rtype: set[str]
    """
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            modules.add(node.module)
            modules.update(f"{node.module}.{alias.name}" for alias in node.names)
    return modules


def python_files(folder: str) -> list[Path]:
    files = sorted((PACKAGE / folder).glob("*.py"))
    assert files, f"asistencia/{folder}/ no tiene ficheros .py"
    return files


def uses(modules: set[str], forbidden: str) -> bool:
    return any(m == forbidden or m.startswith(forbidden + ".") for m in modules)


# ---------- Código (CA-05, CA-06, CA-07) ----------

@pytest.mark.parametrize("forbidden", ["flask", "sqlite3", "asistencia.use_cases", "asistencia.infra"])
def test_domain_only_uses_standard_library(forbidden):  # CA-05
    for path in python_files("domain"):
        assert not uses(imported_modules(path), forbidden), f"{path.name} importa {forbidden}"


@pytest.mark.parametrize("forbidden", ["flask", "asistencia.domain", "asistencia.use_cases"])
def test_infra_does_not_know_rules_or_http(forbidden):  # CA-06
    for path in python_files("infra"):
        assert not uses(imported_modules(path), forbidden), f"{path.name} importa {forbidden}"


def test_use_cases_do_not_know_http():  # CA-07
    for path in python_files("use_cases"):
        assert not uses(imported_modules(path), "flask"), f"{path.name} importa flask"


@pytest.mark.parametrize("forbidden", ["sqlite3", "asistencia.infra.sqlite_store"])
def test_app_does_not_open_the_database(forbidden):  # CA-07
    assert not uses(imported_modules(ROOT / "app.py"), forbidden)


def test_old_flat_modules_are_gone():  # CA-05, CA-06
    for name in ("codes.py", "names.py", "db.py", "export.py", "tunnel.py"):
        assert not (PACKAGE / name).exists(), f"asistencia/{name} sigue en la raíz del paquete"


# ---------- Documentos (CA-01 a CA-04, CA-10) ----------

def test_constitution_lives_in_docs():  # CA-01
    assert (ROOT / "docs" / "CONSTITUTION.md").is_file()
    assert not (ROOT / "CONSTITUTION.md").exists()


def test_architecture_explains_pieces_and_exclusions():  # CA-02
    text = (ROOT / "docs" / "ARCHITECTURE.md").read_text(encoding="utf-8")
    for piece in ("asistencia/domain/", "asistencia/use_cases/", "asistencia/infra/", "app.py"):
        assert piece in text
    for excluded in ("PostgreSQL", "SQLAlchemy", "Alembic"):
        assert excluded in text


def test_agents_manual_explains_how_to_write_code():  # CA-03
    assert not (ROOT / "AGENT.md").exists()
    text = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    for marker in (":param", ":return", ":rtype", "Usage::"):
        assert marker in text


@pytest.mark.parametrize("doc", ["README.md", "AGENTS.md"])
def test_links_point_to_new_locations(doc):  # CA-04
    text = (ROOT / doc).read_text(encoding="utf-8")
    assert "(docs/CONSTITUTION.md)" in text
    assert "(CONSTITUTION.md)" not in text
    assert "(AGENT.md)" not in text


def test_constitution_names_new_folders():  # CA-10
    text = (ROOT / "docs" / "CONSTITUTION.md").read_text(encoding="utf-8")
    assert "Versión 3.0" in text
    for folder in ("asistencia/domain/", "asistencia/use_cases/", "asistencia/infra/", "docs/"):
        assert folder in text
