"""Tests de la documentación · spec 004 · CA-01, CA-02."""

from pathlib import Path

APP_DIR = Path(__file__).resolve().parents[1]
APP_PATH = "staff/ella-deyavorsky/asistenciapp"
OTHER_NAME = "victor"  # el nombre que ya no debe aparecer
SKIPPED_FOLDERS = {".venv", "__pycache__"}


def test_readme_cd_lines_are_this_folder():  # CA-01
    lines = (APP_DIR / "README.md").read_text(encoding="utf-8").splitlines()
    cd_lines = [line.strip() for line in lines if line.startswith("cd ")]
    assert cd_lines, "el README no tiene ninguna línea cd"
    for line in cd_lines:
        assert line == f"cd {APP_PATH}"


def test_no_markdown_file_names_the_other_user():  # CA-02
    found = []
    for path in APP_DIR.rglob("*.md"):
        if SKIPPED_FOLDERS & set(path.relative_to(APP_DIR).parts):
            continue
        if OTHER_NAME in path.read_text(encoding="utf-8").lower():
            found.append(str(path.relative_to(APP_DIR)))
    assert not found, f"ficheros con el nombre: {sorted(found)}"
