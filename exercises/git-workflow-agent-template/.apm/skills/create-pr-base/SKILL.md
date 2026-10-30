---
name: create-pr-base
description: "Abre la pull request de la rama de trabajo contra la rama base, con cuerpo en español según la plantilla. Úsala desde el subagente create-pr."
---

### Herramienta: CREATE_PR_BASE

- **Descripción**: Úsala desde el subagente `create-pr` para abrir la pull request contra la rama base. No la uses para enlazar la issue: eso es `link-pr-to-issue`. No la uses para dejarla en draft: eso es `create-draft`.
- **MCP**: El servidor MCP `github`, declarado en `apm.yml`.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a este paquete. La descripción va en español.

#### Especificación de Argumentos

1. **Base** _(Obligatorio)_: La rama base que dio `check-status`, o la base con la que se creó la rama.
2. **Cabeza** _(Obligatorio)_: La rama que acaba de subirse.
3. **Título** _(Obligatorio)_: El título de la issue, en inglés.
4. **Cuerpo** _(Obligatorio)_: Español, con la plantilla `<carpeta de esta skill>/assets/basic-pull-request.md` (en Claude Code, `${CLAUDE_SKILL_DIR}`; en Cursor y Codex, `.agents/skills/create-pr-base`). La sección Issue se deja con `Closes #` sin número: lo completa `link-pr-to-issue`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si ya hay una pull request de esa rama hacia esa base, actualiza esa. No abras otra. Devuelve la URL. Si el MCP falla, comunica el error y no inventes el enlace.
