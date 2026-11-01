"""Comprueba fronteras de imports, documentación y bases ya existentes."""

import ast
from pathlib import Path
import sqlite3

import pytest

from app import create_app


APP_ROOT = Path(__file__).resolve().parents[1]


def imported_modules(path: Path) -> set[str]:
    """Lee imports sin ejecutar los módulos que se están comprobando."""
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            modules.add(node.module)
    return modules


def test_documents_and_active_links():
    """Los documentos activos están en su ubicación y enlazan entre sí."""
    assert (APP_ROOT / "docs/CONSTITUTION.md").is_file()
    assert (APP_ROOT / "docs/ARCHITECTURE.md").is_file()
    assert (APP_ROOT / "docs/TREE.md").is_file()
    assert (APP_ROOT / "docs/STYLE.md").is_file()
    assert (APP_ROOT / "AGENTS.md").is_file()
    assert not (APP_ROOT / "CONSTITUTION.md").exists()
    assert not (APP_ROOT / "AGENT.md").exists()
    readme = (APP_ROOT / "README.md").read_text(encoding="utf-8")
    manual = (APP_ROOT / "AGENTS.md").read_text(encoding="utf-8")
    for text in (readme, manual):
        assert "docs/CONSTITUTION.md" in text
        assert "docs/ARCHITECTURE.md" in text
        assert "docs/TREE.md" in text
        assert "docs/STYLE.md" in text
    architecture = (APP_ROOT / "docs/ARCHITECTURE.md").read_text(encoding="utf-8")
    assert "TREE.md" in architecture
    assert "STYLE.md" in architecture
    constitution = (APP_ROOT / "docs/CONSTITUTION.md").read_text(encoding="utf-8")
    assert "Versión 2.3" in constitution
    for folder in ("domain/", "usecases/", "storage/"):
        assert folder in constitution
    # STYLE es la fuente de las normas; el manual solo enlaza esa guía.
    style = (APP_ROOT / "docs/STYLE.md").read_text(encoding="utf-8")
    for marker in (":param", ":return", ":rtype", "Usage::"):
        assert marker in style


@pytest.mark.parametrize("module", ["codes.py", "names.py", "session.py"])
def test_domain_is_independent(module):
    """Las decisiones no dependen de HTTP, del almacén ni de las acciones."""
    imports = imported_modules(APP_ROOT / "asistencia/domain" / module)
    forbidden = ("flask", "sqlite3", "asistencia.storage", "asistencia.usecases")
    assert not any(name.startswith(forbidden) for name in imports)


def test_storage_only_handles_persistence():
    """El almacén no importa decisiones de asistencia ni el servidor HTTP."""
    imports = imported_modules(APP_ROOT / "asistencia/storage/sqlite.py")
    forbidden = ("flask", "asistencia.domain", "asistencia.usecases")
    assert not any(name.startswith(forbidden) for name in imports)


def test_http_entrypoint_does_not_open_storage():
    """La entrada HTTP llama a acciones, sin abrir conexiones de datos."""
    imports = imported_modules(APP_ROOT / "app.py")
    forbidden = ("sqlite3", "asistencia.storage", "asistencia.db")
    assert not any(name.startswith(forbidden) for name in imports)
    assert any(name.startswith("asistencia.usecases") for name in imports)


@pytest.mark.parametrize("module", [
    "app.py", "asistencia/domain/codes.py", "asistencia/domain/names.py",
    "asistencia/domain/session.py", "asistencia/storage/sqlite.py",
    "asistencia/usecases/attendance.py",
])
def test_public_functions_have_types_and_usage(module):
    """Las funciones públicas modificadas describen su contrato y un ejemplo."""
    tree = ast.parse((APP_ROOT / module).read_text(encoding="utf-8"))
    assert ast.get_docstring(tree)
    for node in tree.body:
        if not isinstance(node, ast.FunctionDef) or node.name.startswith("_"):
            continue
        doc = ast.get_docstring(node) or ""
        assert ":return:" in doc and ":rtype:" in doc and "Usage::" in doc, node.name
        assert node.returns is not None, node.name
        for arg in node.args.args + node.args.kwonlyargs:
            assert arg.annotation is not None, f"{node.name}: {arg.arg}"
            assert f":param {arg.arg}:" in doc, f"{node.name}: {arg.arg}"


def test_existing_database_retains_data_and_workflow(tmp_path):
    """Una base del formato anterior conserva token, sesiones y registros."""
    path = tmp_path / "existing.db"
    # Esquema anterior: la reorganización debe abrirlo sin migraciones.
    with sqlite3.connect(path) as conn:
        conn.executescript("""
            CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE sessions (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, secret TEXT NOT NULL,
                opened_at TEXT NOT NULL, closed_at TEXT);
            CREATE TABLE checkins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL REFERENCES sessions(id),
                name TEXT NOT NULL, name_key TEXT NOT NULL, checked_at TEXT NOT NULL,
                UNIQUE (session_id, name_key));
        """)
        conn.execute("INSERT INTO config VALUES ('teacher_token', 'existing-token')")
        conn.execute("INSERT INTO sessions VALUES (?, ?, ?, ?, NULL)",
                     ("existing", "Clase anterior", "ab" * 16, "2026-10-20T10:00:00.000+00:00"))
        conn.execute("INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)",
                     ("existing", "Ana", "ana", "2026-10-20T10:01:00.000+00:00"))
    app = create_app(path, token="", now=lambda: 1_800_000_000.0)
    client = app.test_client()
    headers = {"X-Teacher-Token": "existing-token"}
    detail = client.get("/api/sessions/existing", headers=headers).get_json()
    assert detail["total"] == 1 and detail["checkins"][0]["name"] == "Ana"
    assert client.post("/api/s/existing/checkin", json={"name": "Luis", "code": detail["code"]}).status_code == 201
    assert "Luis" in client.get("/api/sessions/existing/export", headers=headers).get_data(as_text=True)
    assert client.post("/api/sessions/existing/close", headers=headers).status_code == 200
    assert client.post("/api/s/existing/checkin", json={"name": "Eva", "code": detail["code"]}).status_code == 409
    assert client.delete("/api/sessions/existing/checkins/1", headers=headers).status_code == 200
    reopened = create_app(path).test_client()
    detail = reopened.get("/api/sessions/existing", headers=headers).get_json()
    assert detail["total"] == 1 and detail["open"] is False
    assert [row["name"] for row in detail["checkins"]] == ["Luis"]
    with sqlite3.connect(path) as conn:
        tables = {row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}
    assert tables == {"config", "sessions", "checkins"}
