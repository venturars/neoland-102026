# Plan — adaptar el flujo de git

Issue: #572.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma. No hay SQL. No hay paquete de Node.

## Ficheros

Se crean:

- `docs/specs/adapt-git-workflow/spec.md`
- `docs/specs/adapt-git-workflow/plan.md`
- `docs/specs/adapt-git-workflow/tasks.md`
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

Se tocan:

- `AGENTS.md`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

No se toca `logic/`, `queries/`, `db/`, `clients/` ni `package.json`.

## Rutas

Los scripts se lanzan desde la raíz del repositorio. En las skills, cada
`./tools/` pasa a `staff/ventura-rodriguez/first-app/tools/`.

## AGENTS.md

Al principio, el trabajo de git sigue `agents/git-workflow-agent.md` de
esta carpeta. Ese flujo no quita las paradas de esta app. Antes de
crear las tareas, una persona revisa la spec y el plan. Al crear las
tareas, se para otra vez. No se implementa en esa parada.

## Árbol

En `docs/TREE.md`, dentro de `first-app/` y antes de `docs/`, entran
`agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`. No se listan
los ficheros de dentro. El resto del árbol sigue igual.

## Arquitectura

Se añaden estos puntos. El resto sigue igual.

- `agents/git-workflow-agent.md` reconoce el momento y llama al
  subagente o a la skill que toca.
- `agents/help-me-to-think.md` hace una pregunta cada vez hasta que la
  tarea se puede dejar escrita.
- `agents/create-issue.md` crea la issue con título en inglés y
  descripción en español, asignada a quien está autenticado.
- `agents/create-branch.md` crea la rama `número-tipo-descripcion`.
- `agents/create-commit.md` hace un commit pequeño con ficheros
  nombrados.
- `agents/create-pr.md` abre la pull request contra `staging` y la deja
  en draft, sin enlazar la issue.
- `agents/launch-push.md` publica `HEAD` en `origin` y deja el upstream
  puesto.
- `skills/grill-with-docs/SKILL.md` entrevista cuando el cambio vive en
  este proyecto.
- `skills/grill-me/SKILL.md` entrevista cuando el repositorio no
  responde.
- `skills/create-issue/SKILL.md` deja la tarea escrita en GitHub.
- `skills/assign-author/SKILL.md` asigna la issue o la pull request al
  usuario autenticado.
- `skills/check-status/SKILL.md` dice la rama, los cambios sin commit y
  el remoto.
- `skills/pull-changes/SKILL.md` adelanta `staging` en fast-forward.
- `skills/create-branch-from-staging/SKILL.md` abre la rama desde
  `staging`.
- `skills/create-branch/SKILL.md` abre la rama desde una base que no es
  `staging`.
- `skills/create-empty-commit/SKILL.md` hace el commit vacío
  `chore: open #N`.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros
  nombrados.
- `skills/launch-push/SKILL.md` sube la rama actual y fija el upstream.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request con base
  `staging`.
- `skills/create-draft/SKILL.md` deja la pull request en draft.
- `skills/link-pr-to-issue/SKILL.md` deja `Related to #N` sin cerrar la
  issue.
- `skills/assign-reviewers/SKILL.md` asigna a quienes miran la pull
  request y la saca de draft.
- `tools/check-status.sh` escribe la rama, el remoto y los cambios.
- `tools/pull-changes.sh` adelanta `staging` en fast-forward.
- `tools/create-branch-from-staging.sh` crea la rama desde `staging`.
- `tools/create-branch.sh` crea la rama desde otra base.
- `tools/create-empty-commit.sh` crea el commit vacío de apertura.
- `tools/commit-changes.sh` guarda los ficheros nombrados.
- `tools/launch-push.sh` sube la rama y fija el upstream.
- `templates/issues/basic_issue.md` es el cuerpo de la issue: qué hay
  que hacer y cómo probarlo.
- `templates/pull-request/basic-pull-request.md` es el cuerpo de la
  pull request.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Se mantiene el orden de esta app. Aunque el flujo de git no pare, aquí
se para antes de crear las tareas para revisar la spec y el plan. Al
crear las tareas hay otra parada. No se implementa en esa parada.

El cambio del árbol y de la arquitectura entra en las tareas. Esas
guías no se modifican antes.
