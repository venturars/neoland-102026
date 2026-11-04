# Plan — actualizar el flujo de git

Issue: #860.

No es una funcionalidad nueva. No toca `src/`. No hay firma. No hay SQL. No hay paquete de Node. No entra Socket.

## Ficheros

Se crean, copiados de la plantilla del curso:

- `templates/issues/feat_issue.md`, `fix_issue.md`, `docs_issue.md`, `refactor_issue.md`, `test_issue.md`, `chore_issue.md`
- `templates/pull-request/feat-pull-request.md`, `fix-pull-request.md`, `docs-pull-request.md`, `refactor-pull-request.md`, `test-pull-request.md`, `chore-pull-request.md`

Se quitan:

- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`

Se sustituyen por el texto de la plantilla:

- `agents/git-workflow-agent.md`, `agents/create-issue.md`, `agents/create-branch.md`, `agents/create-pr.md`
- `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/link-pr-to-issue/SKILL.md`, `skills/assign-reviewers/SKILL.md`, `skills/grill-me/SKILL.md`
- `skills/create-branch/SKILL.md`, `skills/create-branch-from-staging/SKILL.md` (con la ruta de abajo)
- `tools/create-branch.sh`, `tools/create-branch-from-staging.sh`
- `MCPS/github-mcp-server/mcp.txt`

No se toca `src/`, `package.json`, `AGENTS.md` ni `MCPS/socket-mcp/`. Las skills cuya única diferencia con la plantilla es la ruta del script (`check-status`, `commit-changes`, `create-empty-commit`, `launch-push`, `pull-changes`) no cambian.

## Rutas

En `skills/create-branch/SKILL.md` y en `skills/create-branch-from-staging/SKILL.md`, el comando sigue siendo `staff/diego-torres/first-app/tools/`. No pasa a `./tools/`.

## Árbol

`docs/TREE.md` ya lista `templates/` y no lista los ficheros de dentro. El árbol no se modifica.

## Arquitectura

`docs/ARCHITECTURE.md` no nombra las plantillas básicas ni el enlace de la issue. No se modifica.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Se sigue esta spec. El cuerpo lleva `Closes #N`. Quien enlaza no llama a la API para cerrar la tarea. La constitución, el código actual y la spec no se contradicen.
