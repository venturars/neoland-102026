# Plan — actualizar el flujo de git

Issue: #831.

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

No se toca `logic/`, `queries/`, `db/`, `clients/`, `package.json` ni
`MCPS/socket-mcp/`. Las skills cuya única diferencia con la plantilla es
la ruta del script no cambian.

## Rutas

En `skills/create-branch/SKILL.md` y en
`skills/create-branch-from-staging/SKILL.md`, el comando sigue siendo
`staff/ventura-rodriguez/first-app/tools/`. No pasa a `./tools/`.

## Árbol

`docs/TREE.md` ya lista `templates/` y no lista los ficheros de dentro.
La carpeta sigue. El árbol no se modifica.

## Arquitectura

Se sustituyen estos puntos. El resto sigue igual.

- `agents/create-issue.md` crea la issue asignada a quien está
  autenticado. El cuerpo sale de la plantilla del tipo.
- `agents/create-branch.md` crea la rama de trabajo. El tipo es el de
  la plantilla.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` en el cuerpo y
  enlaza la issue en Development. No llama a la API para cerrarla.
- `templates/issues/` tiene una plantilla por tipo: feat, fix, docs,
  refactor, test y chore. El cuerpo dice qué hay que hacer y cómo
  probarlo.
- `templates/pull-request/` tiene una plantilla por tipo. La sección
  Issue lleva `Closes #`.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub y
  el header para que la escritura vaya directa.

Salen los puntos de `templates/issues/basic_issue.md` y de
`templates/pull-request/basic-pull-request.md`.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Se sigue esta spec. El cuerpo lleva `Closes #N`. Quien enlaza no llama
a la API para cerrar la tarea. La spec de la issue #572 se actualiza
antes de las tareas para que no diga que el enlace no cierra.
