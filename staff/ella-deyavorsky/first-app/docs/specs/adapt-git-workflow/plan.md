# Plan — adapt the git workflow

Issue: #607.

This is not a new feature. It does not replace any file in `logic/`.
There is no new signature, no new SQL and no Node package, so there is
no Socket check.

The source is `exercises/git-workflow-agent-template` as it is on
`staging` after commit `30149d61`. That commit makes the pull request
carry `Closes #N` and explains the GitHub MCP header. The copy in
`staff/ventura-rodriguez/first-app` still has the older text, so it is
not the source.

## Files

Created, copied from the template:

- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `agents/create-issue.md`
- `agents/create-branch.md`
- `agents/create-commit.md`
- `agents/create-pr.md`
- `agents/launch-push.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/create-issue/SKILL.md`
- `skills/assign-author/SKILL.md`
- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `skills/link-pr-to-issue/SKILL.md`
- `skills/assign-reviewers/SKILL.md`
- `tools/check-status.sh`
- `tools/pull-changes.sh`
- `tools/create-branch-from-staging.sh`
- `tools/create-branch.sh`
- `tools/create-empty-commit.sh`
- `tools/commit-changes.sh`
- `tools/launch-push.sh`
- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`
- `MCPS/github-mcp-server/mcp.txt`

Created, for this spec:

- `docs/specs/adapt-git-workflow/spec.md`
- `docs/specs/adapt-git-workflow/plan.md`
- `docs/specs/adapt-git-workflow/tasks.md`

Changed:

- `AGENTS.md` of first-app
- `docs/CONSTITUTIONS.md`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

The root `AGENTS.md` does not change. `logic/`, `queries/`, `db/`,
`clients/` and `package.json` do not change. The specs already written
do not change: none of them names `AGENTS.MD`.

The copied files stay in Spanish, as in the template. The scripts in
`tools/` stay executable. `MCPS/socket-mcp/` is not added.

## Paths

The scripts run from the root of the repository. In the seven skills
that run a script, each `./tools/` becomes
`staff/ella-deyavorsky/first-app/tools/`. The rest of each skill stays
the same.

## Outside tools

This change installs nothing. To use the workflow, the machine already
has:

- `git` and `bash`. The seven scripts in `tools/` use only them.
- `gh`, signed in to GitHub. `skills/link-pr-to-issue/SKILL.md` uses
  `gh api graphql` to link the issue in Development.
- The GitHub MCP, set up as `MCPS/github-mcp-server/mcp.txt` says. Six
  skills write through it: `create-issue`, `assign-author`,
  `create-pr-base-staging`, `create-draft`, `link-pr-to-issue` and
  `assign-reviewers`. In Cursor, its `github` entry carries the
  `X-MCP-Features` header, so it writes directly instead of opening a
  form.

The last check of the tasks only needs `git` and `bash`.

## AGENTS.md

After the first line, "This file tells a coding assistant how to work in
this app.", a new paragraph:

```
Git work follows `agents/git-workflow-agent.md` in this folder. The stops are the ones in "Order". That flow does not remove them.
```

A new section between "Project" and "Rules":

```
## Order

The orchestrator comes first. It picks one moment and calls that subagent as a separate agent. The parent does not interview, does not create the issue and does not run the git or the MCP of that moment.

No `docs/specs/<name>/` folder is created before the issue number exists. `<name>` is kebab-case.

With the issue written, the next process writes `spec.md` and `plan.md`. The spec opens with `Issue: #N`. It touches no other file. It stops there. A person reviews the spec and the plan.

If the constitution, the current code and the spec do not say the same thing, the question goes at the end of the plan and there is no `tasks.md`.

If they say the same thing and the person has reviewed, the next process writes `tasks.md`. It stops there. Nothing is implemented.

Implementation starts when that person asks. It runs `tasks.md` and does not invent steps.
```

In "Rules", this line:

```
- A request for a new behavior is a new feature. The first work is a folder in `docs/specs/`, with a kebab-case name.
```

becomes:

```
- A request for a new behavior is a new feature. It starts with the orchestrator and follows "Order". Its folder in `docs/specs/` has a kebab-case name and comes after the issue.
```

The other rules stay the same.

## Constitution

In "Specs" of `docs/CONSTITUTIONS.md`, a new first paragraph:

```
Before the folder there is the issue, written by its subagent, `agents/create-issue.md`. The folder is not created before the issue number exists.
```

After "If the folder or a file is missing, write the missing file.", in
the same paragraph:

```
A person reviews `spec.md` and `plan.md` before `tasks.md` is written. The steps and the stops are in "Order" in `AGENTS.md`.
```

In "spec.md", after the line on what the file says:

```
It opens with `Issue: #N`, the number of its issue.
```

The last paragraph starts "This environment is one pass: issue, spec,
plan, tasks, code." instead of "spec, plan, tasks, code". The rest of
the constitution stays the same.

## Tree

`docs/TREE.md` adds five folders inside `first-app/`, after `scripts/`
and before `docs/`, with their files:

```text
  agents/
    create-branch.md
    create-commit.md
    create-issue.md
    create-pr.md
    git-workflow-agent.md
    help-me-to-think.md
    launch-push.md
  skills/
    assign-author/
      SKILL.md
    assign-reviewers/
      SKILL.md
    check-status/
      SKILL.md
    commit-changes/
      SKILL.md
    create-branch/
      SKILL.md
    create-branch-from-staging/
      SKILL.md
    create-draft/
      SKILL.md
    create-empty-commit/
      SKILL.md
    create-issue/
      SKILL.md
    create-pr-base-staging/
      SKILL.md
    grill-me/
      SKILL.md
    grill-with-docs/
      SKILL.md
    launch-push/
      SKILL.md
    link-pr-to-issue/
      SKILL.md
    pull-changes/
      SKILL.md
  tools/
    check-status.sh
    commit-changes.sh
    create-branch.sh
    create-branch-from-staging.sh
    create-empty-commit.sh
    launch-push.sh
    pull-changes.sh
  templates/
    issues/
      basic_issue.md
    pull-request/
      basic-pull-request.md
  MCPS/
    github-mcp-server/
      mcp.txt
```

The rest of the tree stays the same.

## Architecture

In "Layers" of `docs/ARCHITECTURE.md`, after the `scripts/` line:

```
- `agents/` holds the git workflow: an orchestrator and one subagent per moment. It has no rules of the app.
- `skills/` holds one skill per git or GitHub step. The subagents call them.
- `tools/` holds the shell scripts that the skills run from the root of the repository.
- `templates/` holds the body of the issue and the body of the pull request.
- `MCPS/` holds the address of the GitHub MCP server that the skills use.
```

In "Files", after "scripts/" and before "docs/":

```
### agents/

- `git-workflow-agent.md` recognizes the moment and calls the subagent or the skill for it.
- `help-me-to-think.md` asks one question at a time until the task can be written down.
- `create-issue.md` creates the issue, with the title in English and the body in Spanish, assigned to the signed-in user.
- `create-branch.md` creates the branch `number-type-description`.
- `create-commit.md` makes a small commit with named files.
- `create-pr.md` opens the pull request against `staging` and leaves it in draft, without linking the issue.
- `launch-push.md` publishes `HEAD` to `origin` and sets the upstream.

### skills/

One folder per skill, each with a `SKILL.md`. A skill that runs a script names it from the root of the repository: `staff/ella-deyavorsky/first-app/tools/<script>.sh`.

- `grill-with-docs/` interviews when the change lives in this project.
- `grill-me/` interviews when the repository has no answer.
- `create-issue/` writes the task down on GitHub.
- `assign-author/` assigns the issue or the pull request to the signed-in user.
- `check-status/` says the branch, the uncommitted changes and the remote.
- `pull-changes/` moves `staging` forward with a fast-forward.
- `create-branch-from-staging/` opens the branch from `staging`.
- `create-branch/` opens the branch from a base that is not `staging`.
- `create-empty-commit/` makes the empty commit `chore: open #N`.
- `commit-changes/` saves a piece with named files.
- `launch-push/` pushes the current branch and sets the upstream.
- `create-pr-base-staging/` opens the pull request with base `staging`.
- `create-draft/` leaves the pull request in draft.
- `link-pr-to-issue/` leaves `Closes #N` in the body and links the issue in Development. The issue closes when the pull request reaches the default branch, not when it is merged into `staging`.
- `assign-reviewers/` assigns the people who review the pull request and takes it out of draft.

### tools/

- `check-status.sh` prints the branch, the remote and the changes.
- `pull-changes.sh` moves `staging` forward with a fast-forward.
- `create-branch-from-staging.sh` creates the branch from `staging`.
- `create-branch.sh` creates the branch from another base.
- `create-empty-commit.sh` creates the empty opening commit.
- `commit-changes.sh` saves the named files.
- `launch-push.sh` pushes the branch and sets the upstream.

### templates/

- `issues/basic_issue.md` is the body of the issue: what has to be done and how to test it.
- `pull-request/basic-pull-request.md` is the body of the pull request. Its "Issue" section ends with `Closes #`.

### MCPS/

- `github-mcp-server/mcp.txt` is the address of the GitHub MCP and the header that lets it write directly.
```

In "docs/", the `specs/` line becomes:

```
- `specs/` holds one folder per feature, with `spec.md`, `plan.md` and `tasks.md`. A new `spec.md` opens with `Issue: #N`.
```

The other points stay the same. The tree is not repeated.

## Contract

No `logic/` function, no public signature and no SQL.

No new message in "Errors".

## Decision

The order of this app stays. From now on, the git workflow does not
remove the two stops: one after the spec and the plan, one after the
tasks.

For this change only, the person asked on 2026-10-30 to run the whole
pass in one session: issue, spec, plan, tasks, code and a draft pull
request. The new stops in "Order" apply to the next change.

The changes to the tree, the architecture, the constitution and
`AGENTS.md` go in the tasks. Those guides are not changed before.
