# Plan — add typed templates

Issue: #766.

This is not a new feature. It does not touch `logic/`. There is no new
signature, no new SQL and no Node package, so there is no Socket check.

The source is `exercises/git-workflow-agent-template/templates`.

## Files

Created, copied from the source (six per folder, same names):

- `templates/issues/{feat,fix,refactor,docs,chore,test}_issue.md`
- `templates/pull-request/{feat,fix,refactor,docs,chore,test}-pull-request.md`

Removed:

- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`

Changed:

- `skills/create-issue/SKILL.md` and `agents/create-issue.md`: the body
  fills the template of the type in `templates/issues/`. Without one,
  the closest is used.
- `skills/create-pr-base-staging/SKILL.md` and `agents/create-pr.md`:
  the body fills the template of the type in `templates/pull-request/`.
  The "Issue" section is left empty when the draft opens.
- `skills/link-pr-to-issue/SKILL.md`: it named `basic-pull-request.md`;
  it now names the templates of `templates/pull-request/`.
- `docs/ARCHITECTURE.md`: "templates/" names the typed templates.
- `docs/TREE.md`: "templates/" lists the twelve files.

Created, for this spec:

- `docs/specs/add-typed-templates/spec.md`
- `docs/specs/add-typed-templates/plan.md`
- `docs/specs/add-typed-templates/tasks.md`

`logic/`, `queries/`, `db/`, `clients/` and `package.json` do not change.

## Contract

No `logic/` function, no public signature and no SQL. No new message in
"Errors".

## Decision

Open question for the reviewer: the change was already applied to the
working tree before this issue existed (it was asked in a prompt without
an issue). The order of `AGENTS.md` says the issue and the spec come
first. The changes stay uncommitted and go in the branch of #766, after
the spec and the plan are reviewed. There is no `tasks.md` until then.
