# Plan — adaptar el flujo de git

Issue: #596.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma. No hay SQL. No hay paquete de Node.

El orquestador va antes que la spec. El subagente del momento corre como
un agente aparte. Las paradas de «Orden» se quedan después de la issue.

## Ficheros

Se crean en la implementación (no en esta fase spec):

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

Origen de la copia: `exercises/git-workflow-agent-template`.

Se tocan en la implementación:

- `AGENTS.md` (renombrado desde `AGENTS.MD` con `git mv`)
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`
- `docs/CONSTITUTIONS.md`
- Cualquier otro fichero bajo `first-app` que cite `AGENTS.MD` (solo el nombre)

No se toca `logic/`, `queries/`, `db/`, `clients/` ni `package.json`.

En esta fase spec solo existen `spec.md` y este `plan.md`. No hay
`tasks.md` ni copia de plantilla hasta que una persona apruebe ambos.

## Rutas

Los scripts se lanzan desde la raíz del repositorio. En las skills, cada
`./tools/` pasa a `staff/sergio-cortes/first-app/tools/`.

## AGENTS.md

Al principio: el trabajo de git sigue `agents/git-workflow-agent.md` de
esta carpeta. Las paradas son las de «Orden». Ese flujo no las quita.

En `## Proyecto`: primer párrafo de first-app y SDD; segundo párrafo
corto sobre `docs/CONSTITUTIONS.md` y el resto de guías. Sin párrafo de
stack Node/SQLite/pnpm.

«Orden» queda como en Ventura (orquestador primero; issue antes de
`docs/specs/`; spec con `Issue: #N`; paradas de revisión y de
`tasks.md`). Se quita la referencia a `docs/GIT-WORKFLOW.md` en la raíz.

La primera regla de «Reglas» pasa a «empieza por el orquestador y sigue
«Orden»». Se conservan Paquetes, Comandos y «Al terminar una tarea» de
Sergio.

## Orden

```
Lo primero es el orquestador. Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea docs/specs/<nombre>/ antes de que exista el número de issue. <nombre> va en kebab-case.

Con la issue escrita, el proceso siguiente escribe spec.md y plan.md. La spec abre con Issue: #N. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay tasks.md.

Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe tasks.md. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta tasks.md y no inventa pasos.
```

## Llamar

En `agents/git-workflow-agent.md`, llamar es la herramienta Task. El
tipo es `generalPurpose`. La descripción es el nombre del subagente. El
encargo es la ruta del fichero de ese subagente y lo que pidió el
alumno. El padre espera y dice lo que el subagente devuelve. No llama
a la skill ni al MCP de ese momento.

Pensar la tarea llama a `agents/help-me-to-think.md`. Dejarla escrita
llama a `agents/create-issue.md`. Empezar, guardar un trozo y pedir
revisión siguen el orden que ese fichero ya tiene, cada paso con su
agente o su skill, también como agente aparte.

En `agents/help-me-to-think.md`, la entrevista sigue siendo una
pregunta cada vez. El subagente devuelve esa pregunta al orquestador.
No espera él la respuesta del alumno y no escribe ficheros.

## Árbol

En `docs/TREE.md`, dentro de `first-app/` y antes de `docs/`, entran
`agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`. La entrada raíz
pasa de `AGENTS.MD` a `AGENTS.md`. No se listan los ficheros de dentro
de esas carpetas. El resto del árbol sigue igual.

## Arquitectura

Se añaden estos puntos antes de los de `docs/`. El punto de
`git-workflow-agent` usa la redacción de subagente aparte. El resto de
los puntos existentes sigue igual.

- `agents/git-workflow-agent.md` reconoce el momento y llama al
  subagente como un agente aparte. El padre no hace ese trabajo.
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

En `docs/CONSTITUTIONS.md`, la primera frase del desarrollo sigue
pasando por `spec.md`, `plan.md` y `tasks.md`, y un humano lee cada
uno antes de seguir. Se añade que antes está la issue, escrita por su
subagente, y que la spec abre con `Issue: #N`. Las citas a `AGENTS.MD`
pasan a `AGENTS.md`.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores».

## Decisión

Se mantiene el orden SDD de esta app después de la issue. Las tareas de
implementación entran en `tasks.md` cuando una persona haya leído y
aprobado esta spec y este plan. El cambio del árbol y de la arquitectura
se hace en esas tareas, no antes.
