"""Tests de la spec 007 · el flujo de git copiado de la plantilla del curso."""

import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent.parent.parent
TEMPLATE = REPO / "exercises" / "git-workflow-agent-template"
FOLDERS = ("agents", "skills", "tools", "templates", "MCPS")
LOCAL_TOOLS = "staff/sergio-moras/asistenciapp/tools/"


def files_under(base: Path) -> set[str]:
    return {
        p.relative_to(base).as_posix()
        for folder in FOLDERS
        for p in (base / folder).rglob("*")
        if p.is_file()
    }


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def test_copy_has_exactly_the_template_files():  # CA-01
    template_files = files_under(TEMPLATE)
    assert template_files
    assert files_under(ROOT) == template_files


@pytest.mark.parametrize("relative", sorted(files_under(TEMPLATE)))
def test_copy_only_changes_tool_paths(relative):  # CA-02
    expected = read(TEMPLATE / relative).replace("./tools/", LOCAL_TOOLS)
    assert read(ROOT / relative) == expected


def test_skill_commands_point_to_existing_scripts():  # CA-02
    commands = []
    for skill in (ROOT / "skills").rglob("SKILL.md"):
        text = read(skill)
        assert "./tools/" not in text, skill.parent.name
        for word in text.split("`"):
            if word.startswith(LOCAL_TOOLS):
                commands.append(word.split()[0])
    assert len(commands) == 7
    for script in commands:
        assert (REPO / script).is_file(), script


def test_scripts_are_executable_in_git():  # CA-03
    listing = subprocess.run(
        ["git", "ls-files", "-s", "--", "tools"],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.splitlines()
    modes = {line.split("\t")[1]: line.split()[0] for line in listing}
    scripts = sorted(p.name for p in (ROOT / "tools").glob("*.sh"))
    assert len(scripts) == 7
    for name in scripts:
        assert modes.get(f"tools/{name}") == "100755", name
