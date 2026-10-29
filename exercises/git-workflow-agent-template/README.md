# git-workflow-agent

Paquete [APM](https://github.com/microsoft/apm) con el flujo de git del bootcamp Neoland AI (10/2026) para Claude Code. Acompaña al alumno en cinco momentos: pensar la tarea, dejarla escrita como issue, empezar (rama, commit vacío y pull request en draft enlazada a la issue), guardar un trozo y pedir revisión.

Sirve para cualquier proyecto en GitHub, no solo para el repositorio del curso. Los cambios respecto a la plantilla original están en [CAMBIOS.md](CAMBIOS.md).

## Requisitos

- Un proyecto con git y un remoto `origin` en GitHub.
- [Claude Code](https://claude.com/claude-code).
- APM: `brew install apm` (o `curl -sSL https://aka.ms/apm-unix | sh`).
- Un token de GitHub en la variable `GITHUB_TOKEN` cuando arrancas Claude Code. Con la CLI de GitHub:

  ```bash
  export GITHUB_TOKEN=$(gh auth token)
  ```

  Sin `gh`, crea un token fine-grained con permiso de lectura y escritura en Issues y Pull requests. Añade el `export` a tu `~/.zshrc` para que esté en cada sesión. El paquete escribe en `.mcp.json` la cabecera `Authorization: Bearer ${GITHUB_TOKEN}`: una referencia a la variable, nunca el token, así que `.mcp.json` se puede subir al repositorio. Si la variable falta, `check-status` lo avisa y las issues y pull requests fallan hasta que la definas y reinicies Claude Code.

## Instalación

Desde la raíz de tu proyecto:

```bash
apm install venturars/neoland-102026/exercises/git-workflow-agent-template#git-workflow-agent--v1.0.0 --target claude
```

Esto añade el paquete a tu `apm.yml`, fija la versión en `apm.lock.yaml` y deja:

- las skills en `.claude/skills/`,
- los subagentes en `.claude/agents/`,
- el servidor MCP `github` (`https://api.githubcopilot.com/mcp/`) en `.mcp.json`.

Haz commit de `apm.yml` y `apm.lock.yaml`. Quien clone el proyecto solo tiene que lanzar `apm install`.

Mientras no exista la etiqueta `git-workflow-agent--v1.0.0`, usa `#main`.

## Uso

En Claude Code, escribe `/git-workflow` o pide directamente un momento:

| Momento | Ejemplo | Qué pasa |
|---|---|---|
| Pensar la tarea | «Ayúdame a pensar cómo contar usuarios por género» | Una entrevista de una pregunta cada vez y un resumen. |
| Dejarla escrita | «Crea la issue» | Issue con título en inglés y cuerpo en español. |
| Empezar | «Empieza la issue 184» | Rama `184-feat-…` desde la rama base, commit `chore: open #184`, push y pull request en draft con `Related to #184`. |
| Guardar un trozo | «Guarda `src/users.js` con feat: count users by gender» | Commit solo con esos ficheros y push. |
| Que la revisen | «Que la revisen @ana y @luis» | Revisores asignados y pull request fuera de draft. |

## Rama base

Las ramas de trabajo salen de la rama base y las pull requests van contra ella. Se detecta sola, en este orden:

1. La variable `GIT_WORKFLOW_BASE`, si está definida.
2. `staging`, si existe `origin/staging`.
3. La rama por defecto del remoto (`origin/HEAD`), y si no, `main` o `master`.

Para fijarla: `export GIT_WORKFLOW_BASE=develop`.

## Convenciones

Son reglas del paquete, no opciones:

- Ramas `número-tipo-descripcion`, con tipo `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
- Commits en conventional commits, en inglés.
- Títulos de issue y de pull request en inglés. Cuerpos en español.
- Sin force push y sin `git add -A`.

## Contenido

| Pieza | Tipo | Qué hace |
|---|---|---|
| `git-workflow` | skill | Orquestador: reconoce el momento y llama a quien toca. |
| `help-me-to-think` | skill | Elige la entrevista y cierra con un resumen. |
| `entrevista-con-repo`, `entrevista-libre` | skills | Las dos entrevistas. |
| `create-issue`, `create-branch`, `create-commit`, `launch-push`, `create-pr` | subagentes | Un paso cada uno. |
| `check-status`, `pull-changes`, `create-branch`, `create-empty-commit`, `commit-changes`, `launch-push` | skills con script | Los pasos de git. |
| `create-issue`, `create-pr-base`, `assign-author`, `assign-reviewers`, `create-draft`, `link-pr-to-issue` | skills con MCP | Los pasos de GitHub. |

Las decisiones de diseño están en [docs/adr/](docs/adr/) y el vocabulario en [GLOSSARY.md](GLOSSARY.md).

## Publicar una versión

Para quien mantiene el paquete: sube `version` en `apm.yml`, haz merge en `main` y etiqueta ese commit con `git-workflow-agent--v<versión>`:

```bash
git tag git-workflow-agent--v1.0.0
git push origin git-workflow-agent--v1.0.0
```

El prefijo hace falta porque las etiquetas son de todo el repositorio del curso ([ADR 0003](docs/adr/0003-paquete-dentro-del-repositorio-del-curso.md)).
