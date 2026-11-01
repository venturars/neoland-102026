"""Plantillas del flujo git: CA-01 a CA-06 de specs/007-plantillas-por-tipo."""

from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = APP_ROOT.parents[2]
EXERCISE_TEMPLATES = (
    REPO_ROOT / "exercises" / "git-workflow-agent-template" / "templates"
)
TEMPLATES = APP_ROOT / "templates"

GIT_TYPES = ("feat", "fix", "docs", "refactor", "test", "chore")

FORBIDDEN_OUTSIDE_TEMPLATES = (
    "menos de 72",
    "feat, fix, docs, refactor, test, chore",
    "número-tipo-descripcion",
)

ISSUE_EXTRA_SECTIONS = {
    "feat": ("## Fuera de esto",),
    "fix": ("## Cómo se reproduce",),
    "docs": ("## Dónde queda escrito",),
    "refactor": ("## Qué sigue igual",),
    "chore": ("## Qué sigue igual",),
    "test": (),
}

PR_SECTIONS = (
    "## Por qué",
    "## Qué ha cambiado",
    "## Cómo probarlo",
    "## Lista de comprobación",
    "## Issue",
)


def _workflow_text_dirs():
    for name in ("agents", "skills", "tools"):
        root = APP_ROOT / name
        for path in root.rglob("*"):
            if path.is_file() and path.suffix in {".md", ".sh"}:
                yield path


def test_per_type_issue_and_pr_files_exist():  # CA-01
    issue_dir = TEMPLATES / "issues"
    pr_dir = TEMPLATES / "pull-request"
    for kind in GIT_TYPES:
        assert (issue_dir / f"{kind}_issue.md").is_file()
        assert (pr_dir / f"{kind}-pull-request.md").is_file()
    issue_files = {p.name for p in issue_dir.glob("*.md")}
    pr_files = {p.name for p in pr_dir.glob("*.md")}
    assert issue_files == {f"{k}_issue.md" for k in GIT_TYPES}
    assert pr_files == {f"{k}-pull-request.md" for k in GIT_TYPES}


def test_templates_carry_html_rules_and_sections():  # CA-02
    for kind in GIT_TYPES:
        issue_text = (TEMPLATES / "issues" / f"{kind}_issue.md").read_text(
            encoding="utf-8"
        )
        assert "<!--" in issue_text
        assert "menos de 72" in issue_text
        assert f"Tipo {kind}" in issue_text
        assert f"número-{kind}-" in issue_text
        assert "## Qué hay que hacer" in issue_text
        assert "## Cómo probarlo" in issue_text
        for heading in ISSUE_EXTRA_SECTIONS[kind]:
            assert heading in issue_text

        pr_text = (
            TEMPLATES / "pull-request" / f"{kind}-pull-request.md"
        ).read_text(encoding="utf-8")
        assert f"Tipo {kind}" in pr_text
        for heading in PR_SECTIONS:
            assert heading in pr_text
        assert "Closes #" in pr_text


def test_basic_templates_are_absent():  # CA-03
    assert not (TEMPLATES / "issues" / "basic_issue.md").exists()
    assert not (TEMPLATES / "pull-request" / "basic-pull-request.md").exists()


def test_agents_skills_tools_do_not_duplicate_template_rules():  # CA-04
    hits = []
    for path in _workflow_text_dirs():
        text = path.read_text(encoding="utf-8")
        for needle in FORBIDDEN_OUTSIDE_TEMPLATES:
            if needle in text:
                hits.append(f"{path.relative_to(APP_ROOT)}: {needle}")
    assert hits == []


def test_templates_match_exercise_copy():  # CA-05
    assert EXERCISE_TEMPLATES.is_dir(), "missing exercise templates in repo"
    for path in EXERCISE_TEMPLATES.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(EXERCISE_TEMPLATES)
        local = TEMPLATES / rel
        assert local.is_file(), f"missing {rel}"
        assert path.read_bytes() == local.read_bytes(), f"drift in {rel}"


def test_issue_and_pr_agents_reference_per_type_templates():  # CA-06
    create_issue_agent = (APP_ROOT / "agents" / "create-issue.md").read_text(
        encoding="utf-8"
    )
    create_issue_skill = (
        APP_ROOT / "skills" / "create-issue" / "SKILL.md"
    ).read_text(encoding="utf-8")
    create_pr_skill = (
        APP_ROOT / "skills" / "create-pr-base-staging" / "SKILL.md"
    ).read_text(encoding="utf-8")
    link_skill = (
        APP_ROOT / "skills" / "link-pr-to-issue" / "SKILL.md"
    ).read_text(encoding="utf-8")

    for text in (create_issue_agent, create_issue_skill, create_pr_skill):
        lowered = text.lower()
        assert "plantilla del tipo" in lowered
        assert "más cercana" in text
        assert "basic-pull-request" not in text
        assert "basic_issue" not in text

    assert "basic-pull-request" not in link_skill
    assert "plantilla" in link_skill.lower()
