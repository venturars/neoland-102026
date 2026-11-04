# Plan — alinear la apertura de pull request

Issue: #913.

No es una funcionalidad nueva. No hay fichero en `src/logic/`. No hay
firma. No hay SQL. No hay paquete de Node.

## Decisión

La fuente de verdad es el ejercicio
`exercises/git-workflow-agent-template`, tal como está ahora. first-app
se adapta a ese flujo. #845 copió el orquestador; el ejercicio siguió
cambiando la apertura de la pull request (draft y asignación en una
invocación, script `gh`, confirmación de cada paso).

Lo único que sigue mandando en first-app es su proceso SDD. Las paradas
de «Orden» en `AGENTS.md` no se quitan. `AGENTS.md` no se reescribe.

La única adaptación local es la ruta del script. El comando se lanza
desde la raíz del repositorio, y first-app no es esa raíz. Donde el
ejercicio apunta a su carpeta `tools/`, aquí queda
`staff/sergio-cortes/first-app/tools/`. El resto del texto es el del
ejercicio.

`docs/TREE.md` no se toca: `tools/` ya está listado y no enumera los
ficheros de dentro. `docs/ARCHITECTURE.md` sí, porque añade el script
y cambia los puntos de la apertura.

`docs/specs/sync-git-orchestrator/` no se reescribe. Donde choque con
este flujo, manda esta spec.

## Ficheros

Se crean en esta fase spec:

- `docs/specs/align-pr-creation-flow/spec.md`
- `docs/specs/align-pr-creation-flow/plan.md`

Se crea en la implementación (cuando exista `tasks.md` aprobado):

- `docs/specs/align-pr-creation-flow/tasks.md`
- `tools/create-pr-base-staging.sh` — copia del ejercicio.

Se sustituyen por el fichero del ejercicio, sin otro cambio:

- `agents/git-workflow-agent.md`
- `agents/create-pr.md`
- `skills/create-draft/SKILL.md`

Se sustituye por el fichero del ejercicio y, después, la ruta del
comando pasa a `staff/sergio-cortes/first-app/tools/create-pr-base-staging.sh`:

- `skills/create-pr-base-staging/SKILL.md`

Se toca `docs/ARCHITECTURE.md`, en estos puntos:

- `agents/git-workflow-agent.md` reconoce el momento, llama al
  subagente o a la skill que toca y confirma cada paso antes del
  siguiente.
- `agents/create-pr.md` abre la pull request contra `staging` en draft
  y asignada al usuario autenticado, en una misma invocación, sin
  enlazar la issue.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request con
  base `staging`, en draft y asignada, con el script de `tools/`.
- `skills/create-draft/SKILL.md` pasa a draft una pull request que ya
  existe.
- `tools/create-pr-base-staging.sh` crea la pull request con base
  `staging`, en draft y asignada al usuario autenticado. Se añade junto
  a los demás scripts de `tools/`.

No se tocan:

- `AGENTS.md`, `docs/CONSTITUTIONS.md`, `docs/TREE.md`
- las siete skills cuyo único desfase con el ejercicio es la ruta
  (`check-status`, `commit-changes`, `create-branch`,
  `create-branch-from-staging`, `create-empty-commit`, `launch-push`,
  `pull-changes`)
- `src/`, `package.json`, `MCPS/socket-mcp/`, plantillas, resto de
  `agents/`, `tools/` y `skills/`

## Comprobación prevista

- `agents/create-pr.md` coincide con el del ejercicio.
- `agents/git-workflow-agent.md` coincide con el del ejercicio.
- `skills/create-draft/SKILL.md` coincide con el del ejercicio.
- `skills/create-pr-base-staging/SKILL.md` apunta a
  `staff/sergio-cortes/first-app/tools/create-pr-base-staging.sh`.
- `tools/create-pr-base-staging.sh` coincide con el del ejercicio y
  llama a `gh pr create` con `--base staging`, `--draft` y
  `--assignee "@me"`.
- `docs/ARCHITECTURE.md` nombra el script y esa apertura en una sola
  invocación.
- En el árbol git-workflow, los únicos desfases template ↔ first-app
  son esas siete skills de ruta más
  `skills/create-pr-base-staging/SKILL.md` (misma clase de desfase).
- `src/`, `package.json` y `MCPS/socket-mcp/` no cambian.
- `staff/sergio-cortes/first-app/tools/check-status.sh` termina bien
  desde la raíz del repositorio.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión de cierre

`tasks.md` se escribe cuando una persona haya leído y aprobado esta spec
y este plan. La copia de los ficheros va en esas tareas, no antes.
