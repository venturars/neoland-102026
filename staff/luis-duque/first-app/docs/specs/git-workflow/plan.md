# Plan — el flujo de git de la app

Cumple `docs/specs/git-workflow/spec.md`.

No hay función nueva, ni SQL, ni cliente. Las operaciones de los usuarios siguen igual. No se añade ningún paquete. Socket no aplica.

## Ficheros

Se copian, tal cual, los 32 ficheros de `exercises/git-workflow-agent-template` a `staff/luis-duque/first-app`, con la misma ruta relativa.

`agents/`:

- `git-workflow-agent.md`
- `help-me-to-think.md`
- `create-issue.md`
- `create-branch.md`
- `create-commit.md`
- `create-pr.md`
- `launch-push.md`

`skills/`, cada una con `SKILL.md`:

- `assign-author`
- `assign-reviewers`
- `check-status`
- `commit-changes`
- `create-branch`
- `create-branch-from-staging`
- `create-draft`
- `create-empty-commit`
- `create-issue`
- `create-pr-base-staging`
- `grill-me`
- `grill-with-docs`
- `launch-push`
- `link-pr-to-issue`
- `pull-changes`

`tools/`:

- `check-status.sh`
- `commit-changes.sh`
- `create-branch.sh`
- `create-branch-from-staging.sh`
- `create-empty-commit.sh`
- `launch-push.sh`
- `pull-changes.sh`

`templates/`:

- `issues/basic_issue.md`
- `pull-request/basic-pull-request.md`

`MCPS/`:

- `github-mcp-server/mcp.txt`

Se toca `agents/git-workflow-agent.md` después de la copia. Se añade que no se salta la parada de la spec, la del plan ni la de las tareas. Sigue sin pasar el trabajo a staging. El resto del fichero se queda.

Se toca `AGENTS.MD`. Al principio, el flujo de trabajo de git de esta app es `agents/git-workflow-agent.md`, entero: pensar una tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión. «Desarrollos» se queda. Una frase dice que ese flujo no quita esas paradas.

Se toca `docs/TREE.md`. El árbol incluye `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.

No se toca `docs/CONSTITUTIONS.MD`. No se toca `package.json`, `pnpm-lock.yaml`, `logic`, `queries`, `db` ni `clients`. No se toca el `AGENTS.md` de la raíz del repositorio.
