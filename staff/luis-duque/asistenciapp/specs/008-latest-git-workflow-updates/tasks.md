# Tareas 008 · Lo último del flujo de git

Spec: [spec.md](spec.md). Plan: [plan.md](plan.md), aceptado el 2026-11-06. Issue #1163.

Las rutas de comando van a `staff/luis-duque/asistenciapp/tools/`. Cada tarea comprueba el texto. Si ya está, no lo reescribe.

- [x] **T01** · Crea `tools/create-pr-base-staging.sh` copiado del template. Abre la PR contra `staging`, en draft y asignada a `@me`, en una sola llamada. → CA-01

- [x] **T02** · Crea `tools/github-cache.mjs` copiado del template. Crea `skills/github-cache/SKILL.md`. El comando es `node ./staff/luis-duque/asistenciapp/tools/github-cache.mjs`. No apunta al template. → CA-02

- [x] **T03** · Crea `templates/issues/knowledge_issue.md` y `templates/pull-request/knowledge-pull-request.md` copiados del template. → CA-03

- [x] **T04** · Abre `skills/create-pr-base-staging/SKILL.md`. Una invocación deja la PR en draft y asignada. El comando es `./staff/luis-duque/asistenciapp/tools/create-pr-base-staging.sh`. `assign-author` y `create-draft` siguen para actualizar una PR ya existente. → CA-01

- [x] **T05** · Abre `agents/create-pr.md`. Crear usa `create-pr-base-staging`. Pedir revisión usa `github-cache` y `assign-reviewers` y saca la PR de draft. No enlaza la issue. → CA-01, CA-02

- [x] **T06** · Abre `skills/assign-reviewers/SKILL.md`. Recibe logins ya resueltos. Comprueba en vivo que son colaboradores. No inventa un login. → CA-02

- [x] **T07** · Abre `agents/git-workflow-agent.md`. Se quedan «Cuándo actuar» y no saltar las paradas. Entra: issue clara se escribe; con issue y cambios, Empezar; revisión en `create-pr`; confirmar cada paso. Empezar llama a `create-pr` con `create-pr-base-staging`. → CA-05, CA-06

- [x] **T08** · Abre `agents/help-me-to-think.md`, `skills/grill-with-docs/SKILL.md` y `skills/grill-me/SKILL.md`. Las preguntas que hagan falta salen de una vez, cada una con una respuesta recomendada, y se espera. → CA-05

- [x] **T09** · Abre `skills/commit-changes/SKILL.md`. Entra el tipo `knowledge`, el desglose y el pie. El comando sigue `./staff/luis-duque/asistenciapp/tools/commit-changes.sh`. → CA-04

- [x] **T10** · En `AGENTS.md` §7, añade la fila de `008-latest-git-workflow-updates`. No borres las filas que ya están. → CA-06

- [x] **T11** · Lee `docs/CONSTITUTION.md`, `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt`, `pytest.ini`, `README.md`, `tools/create-branch-from-staging.sh` y `skills/create-branch-from-staging/SKILL.md`. Siguen sin cambios de este trabajo. Ninguna skill apunta a `exercises/git-workflow-agent-template`. No hay dependencia nueva. Las specs 006 y 007 no se reescriben. → CA-07
