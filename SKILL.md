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
