# Plan — sincronizar el flujo de git con la plantilla

Issue: #963.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma. No hay SQL. No hay paquete de Node. No entra Socket.

## Ficheros

Se crea:

- `tools/create-pr-base-staging.sh` (mismo contenido que en
  `exercises/git-workflow-agent-template/tools/create-pr-base-staging.sh`)

Se sustituye el contenido por el de la plantilla en `staging`, adaptando
solo las rutas de terminal donde la plantilla usa `./tools/` o
`exercises/git-workflow-agent-template/tools/`:

- `agents/create-pr.md`
- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `skills/check-status/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/launch-push/SKILL.md`
- `skills/pull-changes/SKILL.md`

En esas skills, el comando queda bajo
`staff/raul-santamaria/mi-primer-proyecto/tools/...` y el texto habla de
«esta app» donde la plantilla dice «esta plantilla».

Se toca:

- `docs/ARCHITECTURE.md` — bullets de `agents/create-pr.md`,
  `agents/git-workflow-agent.md`, `agents/help-me-to-think.md`,
  `skills/create-pr-base-staging/SKILL.md` y
  `tools/create-pr-base-staging.sh` para reflejar la creación de PR con
  GitHub CLI, el paso Empezar tras issue escrita y la entrevista con
  varias preguntas.

No se toca `logic/`, `queries/`, `db/`, `clients/`, `package.json`,
`AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`,
`MCPS/github-mcp-server/mcp.txt`, `MCPS/socket-mcp/`, `templates/` ni
las skills que ya coinciden con la plantilla (`create-issue`,
`link-pr-to-issue`, `assign-reviewers`, `assign-author`, etc.).

## Rutas

Patrón único en skills que lanzan script:

`staff/raul-santamaria/mi-primer-proyecto/tools/<script>.sh`

Incluye la skill nueva `create-pr-base-staging`, que en la plantilla
apunta a `exercises/git-workflow-agent-template/tools/`.

## Orquestador

`agents/git-workflow-agent.md` coincide con la plantilla y conserva las
menciones a las paradas de «Orden» en `AGENTS.md`. En el paso Empezar,
el punto 5 solo llama a `create-pr` con `create-pr-base-staging`, sin
`assign-author` ni `create-draft` en el orquestador.

## create-pr

`agents/create-pr.md` y `skills/create-pr-base-staging/SKILL.md` describen
una sola invocación al script con `gh pr create` (draft y `--assignee
"@me"`). Las skills `assign-author` y `create-draft` siguen en la app
para actualizar una PR que ya exista.

## Firma / SQL / Errores

No hay. No hay fallo de la lista «Errores».

## Decisión

Manda esta spec sobre el texto antiguo de `docs/specs/latest-git-workflow/`
donde la PR se abría con MCP en tres pasos. Tras esta tarea, la apertura
de PR sigue la plantilla actual en `staging`.
