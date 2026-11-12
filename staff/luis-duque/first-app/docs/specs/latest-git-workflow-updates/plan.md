# Plan — lo último del flujo de git en first-app

Cumple `docs/specs/latest-git-workflow-updates/spec.md`. Issue #1163. La misma issue cubre asistenciapp; su plan está en `staff/luis-duque/asistenciapp/specs/008-latest-git-workflow-updates/plan.md`.

No hay operación de usuarios nueva ni SQL nuevo. No hay paquete de Node nuevo ni cambio de versión. No entra Socket. El cliente HTTP de Node no se toca. `frontend-design` se queda.

La fuente es `exercises/git-workflow-agent-template` en `staging`. Solo entra lo que first-app aún no tiene. Los textos de «Cuándo actuar» y las paradas de spec, plan y tareas se quedan.

Toda skill con comando apunta a `./staff/luis-duque/first-app/tools/…`, no a `exercises/git-workflow-agent-template`. El archivo local de la caché sigue en la raíz del repositorio, ignorado.

## Ficheros

Se crea `tools/create-pr-base-staging.sh`, copiado del template. Abre la pull request contra `staging`, en draft y asignada a quien está autenticado, en una sola llamada a `gh`.

Se crea `tools/github-cache.mjs`, copiado del template. Se crea `skills/github-cache/SKILL.md`. El comando es `node ./staff/luis-duque/first-app/tools/github-cache.mjs`.

Se crean `templates/issues/knowledge_issue.md` y `templates/pull-request/knowledge-pull-request.md`, copiados del template.

Se toca `tools/create-branch-from-staging.sh`. Se quita la lista cerrada de tipos para que quepa `knowledge`. El resto del script se queda.

Se toca `skills/create-branch-from-staging/SKILL.md`. El tipo pasa a ser el de la plantilla. El comando sigue siendo `./staff/luis-duque/first-app/tools/create-branch-from-staging.sh`.

Se toca `skills/create-pr-base-staging/SKILL.md`. Una invocación deja la PR en draft y asignada. El comando apunta a `./staff/luis-duque/first-app/tools/create-pr-base-staging.sh`. `assign-author` y `create-draft` siguen por si hay que actualizar una PR que ya existe.

Se toca `agents/create-pr.md`. Crear o actualizar usa esa skill. Pedir revisión resuelve nombres con `github-cache`, pide las revisiones con `assign-reviewers` y saca la PR de draft. No enlaza la issue.

Se toca `skills/assign-reviewers/SKILL.md`. Recibe logins ya resueltos. Comprueba en vivo que siguen siendo colaboradores. No inventa un login.

Se toca `agents/git-workflow-agent.md`. Se quedan «Cuándo actuar» y no saltar las paradas. Entra: si el problema, el resultado, el alcance y cómo comprobarlo ya están claros, se deja escrita la issue; si la issue ya está y hay cambios, el momento es Empezar; pedir revisión se delega en `create-pr`; se confirma cada paso antes del siguiente. Empezar llama a `create-pr` con `create-pr-base-staging`, no lista `assign-author` ni `create-draft` aparte.

Se toca `agents/help-me-to-think.md`, `skills/grill-with-docs/SKILL.md` y `skills/grill-me/SKILL.md`. Las preguntas que hagan falta salen de una vez, cada una con una respuesta recomendada, y se espera.

Se toca `skills/commit-changes/SKILL.md`. El tipo `knowledge` entra. El mensaje puede llevar desglose y pie. El comando sigue siendo `./staff/luis-duque/first-app/tools/commit-changes.sh`.

Se toca `docs/CONSTITUTIONS.MD`. El desarrollo abierto pasa a `docs/specs/latest-git-workflow-updates/`.

No se tocan `src/`, `package.json`, `pnpm-lock.yaml`, `scripts/`, `skills/frontend-design`, `AGENTS.MD` salvo si nombra el desarrollo abierto (entonces solo esa línea). No se toca el `.gitignore` de la raíz. No se toca asistenciapp desde este plan: eso es el plan 008.

## Firma

No hay función de negocio nueva. No hay SQL nuevo.

## Decisiones

1. Scripts y skills de first-app llaman a `staff/luis-duque/first-app/tools/`. No quedan rutas al template.
2. `github-cache.mjs` y `create-pr-base-staging.sh` se copian a `tools/` de first-app.
3. No se sustituye el orquestador entero: se mezclan las piezas nuevas con los textos que ya estaban.

## Constitución, código y spec

La spec pide solo lo último y conservar los ajustes. El código de usuarios no cambia. No hay paquete nuevo. No hay pregunta abierta. Hay tareas.

## Cómo se verifica

1. Al empezar un cambio, la PR nace en draft y asignada en un paso.
2. Al pedir revisión, se reutilizan alias; un nombre ambiguo se pregunta.
3. Hay plantillas `knowledge`. El commit admite ese tipo. La rama admite ese tipo.
4. Los textos de pedido por el flujo y de paradas siguen. Listar usuarios no cambia.
