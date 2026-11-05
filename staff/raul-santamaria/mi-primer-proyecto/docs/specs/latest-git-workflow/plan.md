# Plan — actualizar el flujo de git

Issue: #853.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma. No hay SQL. No hay paquete de Node. No entra Socket.

## Ficheros

Se crean:

- `templates/issues/feat_issue.md`
- `templates/issues/fix_issue.md`
- `templates/issues/docs_issue.md`
- `templates/issues/refactor_issue.md`
- `templates/issues/test_issue.md`
- `templates/issues/chore_issue.md`
- `templates/pull-request/feat-pull-request.md`
- `templates/pull-request/fix-pull-request.md`
- `templates/pull-request/docs-pull-request.md`
- `templates/pull-request/refactor-pull-request.md`
- `templates/pull-request/test-pull-request.md`
- `templates/pull-request/chore-pull-request.md`

Se quitan:

- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`

Se tocan:

- `agents/git-workflow-agent.md`
- `agents/create-issue.md`
- `agents/create-branch.md`
- `agents/create-pr.md`
- `skills/create-issue/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/link-pr-to-issue/SKILL.md`
- `skills/assign-reviewers/SKILL.md`
- `skills/grill-me/SKILL.md`
- `tools/create-branch.sh`
- `tools/create-branch-from-staging.sh`
- `MCPS/github-mcp-server/mcp.txt`
- `docs/ARCHITECTURE.md`
- `docs/specs/adapt-git-workflow/spec.md`

No se toca `logic/`, `queries/`, `db/`, `clients/`, `package.json`,
`AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md` ni
`MCPS/socket-mcp/`. Las skills cuya única diferencia con la plantilla es
la ruta del script no cambian.

## Rutas

En `skills/create-branch/SKILL.md` y en
`skills/create-branch-from-staging/SKILL.md`, el comando sigue siendo
`staff/raul-santamaria/mi-primer-proyecto/tools/`.

## Orquestador

`agents/git-workflow-agent.md` coincide con la plantilla del ejercicio y
conserva las menciones a las paradas de «Orden» en `AGENTS.md`.

## Arquitectura

Se sustituyen los bullets de plantillas, `link-pr-to-issue`, `mcp.txt`
y los agentes que eligen plantilla por tipo. Sale `Related to #N` y las
plantillas `basic_*`.

## adapt-git-workflow

En `docs/specs/adapt-git-workflow/spec.md`, el enlace pasa a `Closes #N`
con la misma regla de rama por defecto que esta spec.

## Firma / SQL / Errores

No hay. No hay fallo de la lista «Errores».

## Decisión

Manda esta spec sobre el texto antiguo de «enlazar no cierra» en
adapt-git-workflow. El cuerpo lleva `Closes #N`; quien enlaza no llama
a la API para cerrar la tarea.
