"""Dependencias reales de la estructura · CA-01, CA-06, CA-08, CA-27."""

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REMOVED = (
    "asistencia/rules.py",
    "asistencia/teacher.py",
    "asistencia/student.py",
    "asistencia/db.py",
    "asistencia/http.py",
    "asistencia/codes.py",
    "asistencia/names.py",
)

REQUIRED = (
    "docs/CONSTITUTION.md",
    "docs/ARCHITECTURE.md",
    "asistencia/domain/__init__.py",
    "asistencia/domain/codes.py",
    "asistencia/domain/names.py",
    "asistencia/domain/session.py",
    "asistencia/domain/attempts.py",
    "asistencia/usecases/__init__.py",
    "asistencia/usecases/attendance.py",
    "asistencia/storage/__init__.py",
    "asistencia/storage/sqlite.py",
    "asistencia/export.py",
    "asistencia/tunnel.py",
    "app.py",
)

ACTIONS = {
    "prepare",
    "public_info",
    "check_in",
    "list_classes",
    "open_class",
    "teacher_detail",
    "close_class",
    "remove_checkin",
    "export_csv",
}


def package_of(path: Path) -> str:
    parents = path.relative_to(ROOT).parent.parts
    return ".".join(parents)


def module_base(package: str, level: int, module: str | None) -> str:
    """Resuelve el módulo de un import, incluido el relativo."""
    if level == 0:
        return module or ""
    parts = package.split(".") if package else []
    climb = level - 1
    if climb > len(parts):
        base: list[str] = []
    else:
        base = parts[: len(parts) - climb]
    if module:
        base.extend(module.split("."))
    return ".".join(base)


def modules_in(source: str, package: str) -> set[str]:
    """Nombres importados: directos, from, alias y relativos.

    El alias no sustituye al módulo. `from asistencia import storage`
    cuenta como `asistencia.storage`.
    """
    found: set[str] = set()
    for node in ast.walk(ast.parse(source)):
        if isinstance(node, ast.Import):
            found.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            base = module_base(package, node.level, node.module)
            if base:
                found.add(base)
            for alias in node.names:
                if alias.name == "*":
                    continue
                found.add(f"{base}.{alias.name}" if base else alias.name)
    return found


def imported_modules(path: Path) -> set[str]:
    return modules_in(path.read_text(encoding="utf-8"), package_of(path))


def imports_any(path: Path, banned: set[str]) -> str | None:
    for name in imported_modules(path):
        for item in banned:
            if name == item or name.startswith(item + "."):
                return name
    return None


def test_final_tree_and_removed_modules():
    for relative in REQUIRED:
        assert (ROOT / relative).is_file(), relative
    for relative in REMOVED:
        assert not (ROOT / relative).exists(), relative


def test_domain_does_not_depend_on_flask_or_storage():
    banned = {"flask", "sqlite3", "werkzeug", "asistencia.storage", "asistencia.usecases"}
    for path in (ROOT / "asistencia" / "domain").glob("*.py"):
        assert imports_any(path, banned) is None


def test_use_cases_do_not_import_flask_or_sqlite():
    path = ROOT / "asistencia" / "usecases" / "attendance.py"
    assert imports_any(path, {"flask", "sqlite3", "werkzeug"}) is None
    defined = {
        node.name
        for node in ast.parse(path.read_text(encoding="utf-8")).body
        if isinstance(node, ast.FunctionDef)
    }
    assert ACTIONS <= defined


def test_storage_does_not_import_rules_or_flask():
    path = ROOT / "asistencia" / "storage" / "sqlite.py"
    banned = {"flask", "werkzeug", "asistencia.domain", "asistencia.usecases"}
    assert imports_any(path, banned) is None


def test_app_does_not_open_sqlite():
    app = ROOT / "app.py"
    assert imports_any(app, {"sqlite3", "asistencia.storage"}) is None
    source = app.read_text(encoding="utf-8")
    assert "def create_app(" in source
    assert "db_path" in source and "token" in source and "now" in source
    assert 'data" / "asistencia.db"' in source or "data/asistencia.db" in source


def test_docs_match_the_structure_and_name_the_deferred_errors():
    agents = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    architecture = (ROOT / "docs" / "ARCHITECTURE.md").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for piece in ("domain/", "usecases/", "attendance.py", "storage/", "sqlite.py"):
        assert piece in agents
    for piece in (":param", ":raises", "Usage::"):
        assert piece in agents
    assert "staff/maria-osipuk/asistenciapp/specs/" in agents
    for piece in ("Dominio", "acciones", "Almacenamiento", "navegador"):
        assert piece in architecture
    assert "１２３４" in architecture
    assert "lista" in architecture
    assert "número" in architecture
    assert "docs/CONSTITUTION.md" in readme
    assert "docs/ARCHITECTURE.md" in readme
    for spec in (
        "001-checkin-codigo",
        "002-spec-antes-del-cambio",
        "003-aclarar-instrucciones-arranque",
        "004-quitar-referencias-personales",
        "005-reorganizar-documentos-y-arquitectura",
        "006-limitar-intentos-por-ip",
    ):
        assert spec in agents


def test_detector_sees_import_forms():
    assert "sqlite3" in modules_in("import sqlite3 as db", "")
    assert "asistencia.storage" in modules_in("from asistencia import storage", "")
    assert "asistencia.storage.sqlite" in modules_in(
        "from asistencia.storage import sqlite as db", ""
    )
    assert "asistencia.storage" in modules_in(
        "from ..storage import sqlite as db", "asistencia.usecases"
    )
    assert "asistencia.domain.codes" in modules_in(
        "from .codes import is_valid_code", "asistencia.domain"
    )
