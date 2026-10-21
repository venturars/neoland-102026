## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita tu copia instalada, no este fichero, salvo que el cambio sea una convención para todo el repositorio.

La skill sigue el estándar Agent Skills: un directorio con el nombre de la skill y, dentro, un `SKILL.md`. El `name` del frontmatter tiene que coincidir con el nombre de esa carpeta: `git-commit`.

Qué significa cada campo del frontmatter:

| Campo           | Quién lo usa | Qué hacer al adaptar                                                                                                                                             |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`          | Todos        | Déjalo en `git-commit`. La carpeta de instalación tiene que llamarse igual.                                                                                      |
| `description`   | Todos        | El agente decide con este texto cuándo cargar la skill. Si la acortas, conserva cuándo usarla: el usuario pide un commit, crear un commit, o menciona `/commit`. |
| `license`       | Metadato     | Se puede dejar. Si tu herramienta rechaza campos que no conoce, quítalo solo en tu copia.                                                                        |
| `allowed-tools` | Claude Code  | `Bash` permite ejecutar git. Cursor no usa este campo y lo ignora. En otra herramienta, quítalo solo si el frontmatter deja de ser válido.                       |

## Skill

La copia que instales empieza aquí. Desde la primera línea `---` hasta el final es un `SKILL.md` válido. Los pasos están en el `README.md` de la raíz.

Fuente: [github/awesome-copilot — git-commit](https://github.com/github/awesome-copilot/blob/main/skills/git-commit/SKILL.md) (MIT). Ficha: https://www.skills.sh/github/awesome-copilot/git-commit

---

name: git-commit
description: >-
Execute git commit with conventional commit message analysis, intelligent
staging, and message generation. Use when user asks to commit changes,
create a git commit, or mentions "/commit". Supports: (1) Auto-detecting
type and scope from changes, (2) Generating conventional commit messages
from diff, (3) Interactive commit with optional type/scope/description
overrides, (4) Intelligent file staging for logical grouping
license: MIT
allowed-tools: Bash

---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (.env, credentials.json, private keys).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

### 4. Execute Commit

```bash
# Single line
git commit -m "<type>[scope]: <description>"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body>

<optional footer>
EOF
)"
```

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)

## github-issues

## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita tu copia instalada, no este fichero, salvo que el cambio sea una convención para todo el repositorio.

La skill sigue el estándar Agent Skills: un directorio con el nombre de la skill y, dentro, un `SKILL.md`. El `name` del frontmatter tiene que coincidir con el nombre de esa carpeta: `github-issues`.

Qué significa cada campo del frontmatter:

| Campo         | Quién lo usa | Qué hacer al adaptar                                                                                                                                                          |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Todos        | Déjalo en `github-issues`. La carpeta de instalación tiene que llamarse igual.                                                                                                |
| `description` | Todos        | El agente decide con este texto cuándo cargar la skill. Conserva los disparadores en inglés y también «crear una issue» y «crea la issue».                                  |

La carpeta `references/` de la skill de origen no se copia. La sección «Convención de este repositorio», dentro de la copia instalable, dice el cuerpo que se usa aquí.

## Skill

La copia que instales empieza aquí. Desde la primera línea `---` hasta el final de esta skill es un `SKILL.md` válido. Los pasos están en el `README.md` de la raíz.

Fuente: [github/awesome-copilot — github-issues](https://github.com/github/awesome-copilot/blob/main/skills/github-issues/SKILL.md) (MIT). Ficha: https://www.skills.sh/github/awesome-copilot/github-issues

---

name: github-issues
description: 'Create, update, and manage GitHub issues using MCP tools. Use this skill when users want to create bug reports, feature requests, or task issues, update existing issues, add labels/assignees/milestones, manage repository labels, set issue fields (dates, priority, custom fields), set issue types, manage issue workflows, link issues, add dependencies, or track blocked-by/blocking relationships. Triggers on requests like "create an issue", "file a bug", "request a feature", "update issue X", "set the priority", "set the start date", "create a label", "rename a label", "list repo labels", "link issues", "add dependency", "blocked by", "blocking", or any GitHub issue management task. Also use when the user says "crear una issue" or "crea la issue".'

---

# GitHub Issues

Manage GitHub issues using the `@modelcontextprotocol/server-github` MCP server.

## Available Tools

### MCP Tools (read operations)

| Tool | Purpose |
|------|---------|
| `mcp__github__issue_read` | Read issue details, sub-issues, comments, labels (methods: get, get_comments, get_sub_issues, get_labels) |
| `mcp__github__list_issues` | List and filter repository issues by state, labels, date |
| `mcp__github__search_issues` | Search issues across repos using GitHub search syntax |
| `mcp__github__projects_list` | List projects, project fields, project items, status updates |
| `mcp__github__projects_get` | Get details of a project, field, item, or status update |
| `mcp__github__projects_write` | Add/update/delete project items, create status updates |

### MCP Tools (write operations)

| Tool | Purpose |
|------|---------|
| `mcp__github__issue_write` | Create or update an issue (methods: create, update). Supports title, body, type, labels, assignees, milestone, and issue fields |
| `mcp__github__add_issue_comment` | Add a comment or a reaction to an issue |
| `mcp__github__sub_issue_write` | Add, remove, or reprioritize a sub-issue |

### CLI / REST API (write operations)

`gh api` performs the same writes and is the form used in the examples below. Reach for it when the MCP server is not connected, or when you need a REST field the MCP tools do not expose.

| Operation | Command |
|-----------|---------|
| Create issue | `gh api repos/{owner}/{repo}/issues -X POST -f title=... -f body=...` |
| Update issue | `gh api repos/{owner}/{repo}/issues/{number} -X PATCH -f title=... -f state=...` |
| Add comment | `gh api repos/{owner}/{repo}/issues/{number}/comments -X POST -f body=...` |
| Close issue | `gh api repos/{owner}/{repo}/issues/{number} -X PATCH -f state=closed` |
| Set issue type | Include `-f type=Bug` in the create call (REST API only, not supported by `gh issue create` CLI) |

**Note:** `gh issue create` works for basic issue creation but does **not** support the `--type` flag. Use `gh api` when you need to set issue types.

## Workflow

1. **Determine action**: Create, update, or query?
2. **Gather context**: Get repo info, existing labels, milestones if needed
3. **Structure content**: Use appropriate template from [references/templates.md](references/templates.md)
4. **Execute**: Use MCP tools for reads, `gh api` for writes
5. **Confirm**: Report the issue URL to user

## Creating Issues

Use `gh api` to create issues. This supports all parameters including issue types.

```bash
gh api repos/{owner}/{repo}/issues \
  -X POST \
  -f title="Issue title" \
  -f body="Issue body in markdown" \
  -f type="Bug" \
  --jq '{number, html_url}'
```

### Optional Parameters

Add any of these flags to the `gh api` call:

```
-f type="Bug"                    # Issue type (Bug, Feature, Task, Epic, etc.)
-f 'labels[]=bug'                # Labels (repeat for multiple)
-f 'assignees[]=username'        # Assignees (repeat for multiple)
-f milestone=1                   # Milestone number
```

**Quote the whole `name[]=value` pair.** `[]` is a glob pattern in zsh, the default shell
on macOS, so an unquoted `-f labels[]=bug` never reaches `gh`:

```
zsh: no matches found: labels[]=bug
```

**Issue types** are organization-level metadata. To discover available types, use:
```bash
gh api graphql -f query='{ organization(login: "ORG") { issueTypes(first: 10) { nodes { name } } } }' --jq '.data.organization.issueTypes.nodes[].name'
```

**Prefer issue types over labels for categorization.** When issue types are available (e.g., Bug, Feature, Task), use the `type` parameter instead of applying equivalent labels like `bug` or `enhancement`. Issue types are the canonical way to categorize issues on GitHub. Only fall back to labels when the org has no issue types configured.

### Title Guidelines

- Be specific and actionable
- Keep under 72 characters
- When issue types are set, don't add redundant prefixes like `[Bug]`
- Examples:
  - `Login fails with SSO enabled` (with type=Bug)
  - `Add dark mode support` (with type=Feature)
  - `Add unit tests for auth module` (with type=Task)

### Body Structure

Always use the templates in [references/templates.md](references/templates.md). Choose based on issue type:

| User Request | Template |
|--------------|----------|
| Bug, error, broken, not working | Bug Report |
| Feature, enhancement, add, new | Feature Request |
| Task, chore, refactor, update | Task |

## Updating Issues

Use `gh api` with PATCH:

```bash
gh api repos/{owner}/{repo}/issues/{number} \
  -X PATCH \
  -f state=closed \
  -f title="Updated title" \
  --jq '{number, html_url}'
```

Only include fields you want to change. Available fields: `title`, `body`, `state` (open/closed), `labels`, `assignees`, `milestone`.

## Examples

### Example 1: Bug Report

**User**: "Create a bug issue - the login page crashes when using SSO"

**Action**:
```bash
gh api repos/github/awesome-copilot/issues \
  -X POST \
  -f title="Login page crashes when using SSO" \
  -f type="Bug" \
  -f body="## Description
The login page crashes when users attempt to authenticate using SSO.

## Steps to Reproduce
1. Navigate to login page
2. Click 'Sign in with SSO'
3. Page crashes

## Expected Behavior
SSO authentication should complete and redirect to dashboard.

## Actual Behavior
Page becomes unresponsive and displays error." \
  --jq '{number, html_url}'
```

### Example 2: Feature Request

**User**: "Create a feature request for dark mode with high priority"

**Action**:
```bash
gh api repos/github/awesome-copilot/issues \
  -X POST \
  -f title="Add dark mode support" \
  -f type="Feature" \
  -f 'labels[]=high-priority' \
  -f body="## Summary
Add dark mode theme option for improved user experience and accessibility.

## Motivation
- Reduces eye strain in low-light environments
- Increasingly expected by users

## Proposed Solution
Implement theme toggle with system preference detection.

## Acceptance Criteria
- [ ] Toggle switch in settings
- [ ] Persists user preference
- [ ] Respects system preference by default" \
  --jq '{number, html_url}'
```

## Common Labels

Use these standard labels when applicable:

| Label | Use For |
|-------|---------|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Documentation updates |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `question` | Further information requested |
| `wontfix` | Will not be addressed |
| `duplicate` | Already exists |
| `high-priority` | Urgent issues |

## Tips

- Always confirm the repository context before creating issues
- Ask for missing critical information rather than guessing
- Link related issues when known: `Related to #123`
- For updates, fetch current issue first to preserve unchanged fields

## Extended Capabilities

The following features require REST or GraphQL APIs beyond the basic MCP tools. Each is documented in its own reference file so the agent only loads the knowledge it needs.

| Capability | When to use | Reference |
|------------|-------------|-----------|
| Advanced search | Complex queries with boolean logic, date ranges, cross-repo search, issue field filters (`field.name:value`) | [references/search.md](references/search.md) |
| Sub-issues & parent issues | Breaking work into hierarchical tasks | [references/sub-issues.md](references/sub-issues.md) |
| Milestones | Create, read, update, close, reopen, delete milestones and manage milestone issues | [references/milestones.md](references/milestones.md) |
| Labels | Discover, create, rename, recolor, and delete repository labels; add or replace labels on an issue | [references/labels.md](references/labels.md) |
| Issue dependencies | Tracking blocked-by / blocking relationships | [references/dependencies.md](references/dependencies.md) |
| Issue types (advanced) | GraphQL operations beyond MCP `list_issue_types` / `type` param | [references/issue-types.md](references/issue-types.md) |
| Projects V2 | Project boards, progress reports, field management | [references/projects.md](references/projects.md) |
| Issue fields | Custom metadata: dates, priority, text, numbers (private preview) | [references/issue-fields.md](references/issue-fields.md) |
| Images in issues | Embedding images in issue bodies and comments via CLI | [references/images.md](references/images.md) |

## Convención de este repositorio

Esta sección gana cuando choca con lo de arriba. El flujo completo está en `docs/GIT-WORKFLOW.md`.

- El alumno explica la tarea. El agente redacta la issue con eso.
- Antes de crearla, enseña el título, el autor, la persona asignada y el cuerpo, y espera el sí.
- El alta se hace con `gh api` y la cuenta del alumno, para que el autor sea el alumno. El nombre de usuario sale de `gh api user --jq .login`. El MCP de GitHub descrito en `MCP.md` sirve para leer.
- El tipo es `Task`. Si la API rechaza el tipo, se crea la issue sin tipo y se sigue.
- El título va en inglés, es concreto y tiene menos de 72 caracteres.
- La issue queda asignada al alumno. Va sin etiquetas, sin hito y sin project.
- El cuerpo va en inglés y tiene estas dos partes:

```markdown
## What to do

## How to test
```

`How to test` son los pasos para que un compañero pruebe la tarea en su ordenador.

- Esta skill no cierra la issue. La cierra GitHub cuando se mergea la pull request que lleva `Closes #<número>`.
- La carpeta `references/` no está en este repositorio. El cuerpo es el de esta sección.

## create-github-pull-request-from-specification

## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita tu copia instalada, no este fichero, salvo que el cambio sea una convención para todo el repositorio.

La skill sigue el estándar Agent Skills: un directorio con el nombre de la skill y, dentro, un `SKILL.md`. El `name` del frontmatter tiene que coincidir con el nombre de esa carpeta: `create-github-pull-request-from-specification`.

Qué significa cada campo del frontmatter:

| Campo         | Quién lo usa | Qué hacer al adaptar                                                                                                                                                                       |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | Todos        | Déjalo en `create-github-pull-request-from-specification`. La carpeta de instalación tiene que llamarse igual.                                                                            |
| `description` | Todos        | El agente decide con este texto cuándo cargar la skill. Conserva cuándo usarla: el usuario pide crear una pull request, abrir una PR, o dice «crear una PR» o «crea la PR».              |

La ficha publica el cuerpo de la skill. El frontmatter de la copia instalable es el de este repositorio, para que el agente sepa cuándo cargarla. La sección «Convención de este repositorio» deja la pull request en draft: el paso 5 de origen, pasarla a lista, espera a que el alumno pida revisión.

## Skill

La copia que instales empieza aquí. Desde la primera línea `---` hasta el final de esta skill es un `SKILL.md` válido. Los pasos están en el `README.md` de la raíz.

Fuente: [create-github-pull-request-from-specification](https://www.skills.sh/github/awesome-copilot/create-github-pull-request-from-specification) (texto publicado en la ficha; la carpeta no está en `main` de awesome-copilot).

---

name: create-github-pull-request-from-specification
description: >-
  Create a GitHub pull request from .github/pull_request_template.md.
  Use when the user asks to create a pull request, open a PR, or says
  "crear una PR" or "crea la PR". Check for an existing pull request on
  the current branch before creating one.

---

# Create GitHub Pull Request from Specification

Create GitHub Pull Request for the specification at `${workspaceFolder}/.github/pull_request_template.md` .

## Process

1. Analyze specification file template from '${workspaceFolder}/.github/pull_request_template.md' to extract requirements by 'search' tool.
2. Create pull request draft template by using 'create_pull_request' tool on to `${input:targetBranch}`. and make sure don't have any pull request of current branch was exist `get_pull_request`. If has continue to step 4, and skip step 3.
3. Get changes in pull request by using 'get_pull_request_diff' tool to analyze information that was changed in pull Request.
4. Update the pull request body and title created in the previous step using the 'update_pull_request' tool. Incorporate the information from the template obtained in the first step to update the body and title as needed.
5. Switch from draft to ready for review by using 'update_pull_request' tool. To update state of pull request.
6. Using 'get_me' to get username of person was created pull request and assign to `update_issue` tool. To assign pull request
7. Response URL Pull request was create to user.

## Requirements

- Single pull request for the complete specification
- Clear title/pull_request_template.md identifying the specification
- Fill enough information into pull_request_template.md
- Verify against existing pull requests before creation

## Convención de este repositorio

Esta sección gana cuando choca con el proceso de arriba. El paso 5 no se ejecuta al crear la pull request. El flujo completo está en `docs/GIT-WORKFLOW.md`.

- La base es `staging`.
- Se crea en draft. Pasarla a lista es la acción «pedir revisión».
- El título es el de la issue, en inglés.
- El cuerpo rellena `.github/pull_request_template.md` e incluye `Closes #<número>`.
- La persona asignada es el alumno. El nombre sale de `gh api user --jq .login`.
- Si la rama ya tiene una pull request, se actualiza esa y no se abre otra.
- Antes de crearla o actualizarla, enseña el título, la rama, el destino, el `Closes` y la persona asignada, y espera el sí.
- La orden, después del sí, es `gh pr create --draft --base staging`, con el título, el cuerpo y `--assignee`. Para actualizar una pull request que ya existe, `gh pr edit`.
- Al terminar, responde con la URL.

## grill-me

## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita tu copia instalada, no este fichero, salvo que el cambio sea una convención para todo el repositorio.

La skill sigue el estándar Agent Skills: un directorio con el nombre de la skill y, dentro, un `SKILL.md`. El `name` del frontmatter tiene que coincidir con el nombre de esa carpeta: `grill-me`.

Qué significa cada campo del frontmatter:

| Campo                      | Quién lo usa | Qué hacer al adaptar                                                                                                      |
| -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `name`                     | Todos        | Déjalo en `grill-me`. La carpeta de instalación tiene que llamarse igual.                                                |
| `description`              | Todos        | El agente decide con este texto cuándo cargar la skill. Conserva que es una entrevista para afilar un plan o un diseño. |
| `disable-model-invocation` | Todos        | Déjalo en `true`. El alumno tiene que pedirla.                                                                            |

Hace falta instalar también `grilling`. Esta skill solo la llama. No se copia `agents/openai.yaml`: es metadato de presentación de Codex.

## Skill

La copia que instales empieza aquí. Desde la primera línea `---` hasta el final de esta skill es un `SKILL.md` válido. Los pasos están en el `README.md` de la raíz.

Fuente: [mattpocock/skills — grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) (MIT). Ficha: https://www.skills.sh/mattpocock/skills/grill-me

---

name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true

---

Call the Skill tool with "grilling".

## Convención de este repositorio

Esta sección gana cuando choca con lo de arriba.

- El alumno tiene que pedirla. Sirve para afilar la tarea antes de crear la issue.
- Durante la entrevista no se crea la issue, ni la rama, ni la pull request.
- Las preguntas van en el idioma del alumno. La issue que pida después va en inglés, como dice `docs/GIT-WORKFLOW.md`.
- La entrevista la hace la skill `grilling`.

## grilling

## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita tu copia instalada, no este fichero, salvo que el cambio sea una convención para todo el repositorio.

La skill sigue el estándar Agent Skills: un directorio con el nombre de la skill y, dentro, un `SKILL.md`. El `name` del frontmatter tiene que coincidir con el nombre de esa carpeta: `grilling`.

Qué significa cada campo del frontmatter:

| Campo         | Quién lo usa | Qué hacer al adaptar                                                                                                                                                          |
| ------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Todos        | Déjalo en `grilling`. La carpeta de instalación tiene que llamarse igual.                                                                                                    |
| `description` | Todos        | El agente decide con este texto cuándo cargar la skill. Conserva los disparadores: el usuario quiere poner a prueba una idea, o dice «grill». `grill-me` llama a esta skill. |

No se copia `agents/openai.yaml`: es metadato de presentación de Codex.

## Skill

La copia que instales empieza aquí. Desde la primera línea `---` hasta el final de esta skill es un `SKILL.md` válido. Los pasos están en el `README.md` de la raíz.

Fuente: [mattpocock/skills — grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) (MIT).

---

name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.

---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

