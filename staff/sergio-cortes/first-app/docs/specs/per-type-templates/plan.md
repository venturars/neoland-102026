# Plan — alinear el flujo de git

Issue: #737.

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. No hay
firma. No hay SQL. No hay paquete de Node.

## Decisión

El flujo de git de `exercises/git-workflow-agent-template` es la fuente
de verdad. first-app se adapta a ese flujo, tal como está ahora.

Lo único que sigue mandando en first-app es su proceso SDD: la issue,
después `spec.md` y `plan.md`, una persona revisa, después `tasks.md`,
otra parada, y la implementación cuando esa persona lo pide. Las
paradas de «Orden» en `AGENTS.md` no se quitan. `AGENTS.md` no se
reescribe.

El enlace queda `Closes #N`, como en el ejercicio. El agente no cierra
la issue por API. GitHub la cierra al fusionar la pull request en la
rama por defecto. Si esa rama sigue siendo `main`, fusionar en
`staging` no la cierra.

La única adaptación local es la ruta del script. El comando se lanza
desde la raíz del repositorio, y first-app no es esa raíz. Donde el
ejercicio dice `./tools/`, aquí queda
`staff/sergio-cortes/first-app/tools/`. El resto del texto es el del
ejercicio.

`docs/specs/adapt-git-workflow/` no se reescribe. Donde choque con este
flujo, manda esta spec.

## Ficheros

Se crean en la implementación:

- `templates/issues/feat_issue.md`
- `templates/issues/fix_issue.md`
- `templates/issues/docs_issue.md`
- `templates/issues/chore_issue.md`
- `templates/issues/refactor_issue.md`
- `templates/issues/test_issue.md`
- `templates/pull-request/feat-pull-request.md`
- `templates/pull-request/fix-pull-request.md`
- `templates/pull-request/docs-pull-request.md`
- `templates/pull-request/chore-pull-request.md`
- `templates/pull-request/refactor-pull-request.md`
- `templates/pull-request/test-pull-request.md`

Se borran:

- `templates/issues/basic_issue.md`
- `templates/pull-request/basic-pull-request.md`

Esas doce plantillas quedan byte a byte como en el ejercicio, incluida
la línea `Closes #`.

Se sustituyen por el fichero del ejercicio, sin otro cambio:

- `agents/git-workflow-agent.md`
- `agents/create-issue.md`
- `agents/create-pr.md`
- `agents/create-branch.md`
- `skills/create-issue/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/link-pr-to-issue/SKILL.md`
- `skills/assign-reviewers/SKILL.md`
- `tools/create-branch.sh`
- `tools/create-branch-from-staging.sh`
- `MCPS/github-mcp-server/mcp.txt`

Se sustituyen por el fichero del ejercicio y, después, la ruta del
script vuelve a `staff/sergio-cortes/first-app/tools/`:

- `skills/create-branch/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`

Se toca `docs/ARCHITECTURE.md`, con el texto de «Arquitectura».

No se tocan, porque ya coinciden con el ejercicio o solo cambia la
ruta del script, que ya es la de first-app:

- `agents/help-me-to-think.md`
- `agents/create-commit.md`
- `agents/launch-push.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/grill-me/SKILL.md`
- `skills/assign-author/SKILL.md`
- `skills/create-draft/SKILL.md`
- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`
- el resto de `tools/`

No se toca `AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`,
`docs/specs/adapt-git-workflow/`, `MCPS/socket-mcp/`, `logic/`,
`queries/`, `db/`, `clients/` ni `package.json`.

`docs/TREE.md` no cambia: `templates/` ya está y no lista cada
plantilla.

## Arquitectura

Sustituir estas líneas:

- `agents/git-workflow-agent.md` reconoce el momento y llama al
  subagente o a la skill que toca.
- `agents/create-issue.md` crea la issue asignada a quien está
  autenticado; el cuerpo sale de la plantilla del tipo en
  `templates/issues/`.
- `agents/create-branch.md` crea la rama de trabajo; el tipo y el
  nombre de rama siguen la plantilla del tipo.
- `agents/create-pr.md` abre la pull request contra `staging` con la
  plantilla del tipo; la deja en draft, sin enlazar la issue.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` en el cuerpo. No
  cierra la issue por API. GitHub la cierra al fusionar en la rama por
  defecto.
- `templates/issues/` lleva seis plantillas (`feat`, `fix`, `docs`,
  `refactor`, `test`, `chore`). En el comentario HTML van la regla del
  título, el tipo y el nombre de rama.
- `templates/pull-request/` lleva seis plantillas del mismo tipo. El
  cuerpo comparte secciones; la lista de comprobación cambia por tipo.
  La sección Issue es `Closes #`.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub y
  el header para que la escritura no abra un formulario.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».
