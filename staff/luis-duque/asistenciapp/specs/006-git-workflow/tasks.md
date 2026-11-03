# Tareas 006 · Flujo de git del curso en AsistenciApp

Spec: [spec.md](spec.md). Plan: [plan.md](plan.md). Issue #777.

- [x] **T01** · Sustituye `staff/luis-duque/asistenciapp/agents/` (excepto adaptar luego el orquestador) con los `.md` de `exercises/git-workflow-agent-template/agents/`. Entran los siete ficheros con el mismo nombre. Se pueden leer. → CA-01

- [x] **T02** · Sustituye `staff/luis-duque/asistenciapp/skills/` con las quince carpetas de la plantilla (cada una con `SKILL.md`). El texto de las skills que no lanzan script queda igual que la plantilla. Se pueden leer. → CA-01

- [x] **T03** · Sustituye `staff/luis-duque/asistenciapp/tools/` con los siete `.sh` de la plantilla. El texto no cambia. Se pueden leer. → CA-01

- [x] **T04** · Sustituye `staff/luis-duque/asistenciapp/templates/` con `issues/` (seis) y `pull-request/` (seis) de la plantilla. El texto no cambia. Se pueden leer. → CA-01

- [x] **T05** · Sustituye `staff/luis-duque/asistenciapp/MCPS/` con `github-mcp-server/mcp.txt` de la plantilla. El texto no cambia. Se puede leer. → CA-01

- [x] **T06** · En las siete skills de script (`check-status`, `pull-changes`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `commit-changes`, `launch-push`), cambia cada `./tools/` por `./staff/luis-duque/asistenciapp/tools/`. El resto de cada skill coincide con la plantilla. → CA-02

- [x] **T07** · Abre `staff/luis-duque/asistenciapp/agents/git-workflow-agent.md`. En los límites, añade que no se salta la parada de la spec, la del plan ni la de las tareas. Sigue sin hacer merge a `staging`. El de `exercises/` no se toca. → CA-04

- [x] **T08** · Abre `AGENTS.md`. Al inicio, el flujo de git de esta app es `agents/git-workflow-agent.md`, entero: pensar una tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión. El flujo SDD (§2) se queda; una frase dice que ese flujo de git no quita esas paradas. En §3 entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`. La regla de commits/pushes se alinea con el orquestador. → CA-03

- [x] **T09** · Abre `docs/CONSTITUTION.md`. En §7, la ruta pasa a `staff/luis-duque/asistenciapp/`. Anota enmienda 2.2 en el historial. No toques P1–P6 ni §1–§6. → CA-01 (alcance) / plan decisión 4

- [x] **T10** · Lee `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` y el `AGENTS.md` de la raíz del repositorio. Siguen sin cambios de este trabajo. No hay dependencia nueva. → CA-05
