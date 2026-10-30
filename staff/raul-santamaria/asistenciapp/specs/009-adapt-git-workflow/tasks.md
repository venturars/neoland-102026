# Tareas 009 · Adaptar el flujo de git y los momentos humanos

> Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md) · Issue: #618

Cada tarea indica qué `CA-xx` cubre. Orden de ejecución.

- [x] **T01** Copiar `agents/` de `exercises/git-workflow-agent-template/` a `staff/raul-santamaria/asistenciapp/agents/`. Los siete ficheros del plan; texto sin cambios; no añadir más. (CA-08)

- [x] **T02** Copiar `skills/` de la plantilla a `staff/raul-santamaria/asistenciapp/skills/`. Todas las skills del plan; texto sin cambios todavía; no añadir más. (CA-08)

- [x] **T03** Copiar `tools/` de la plantilla a `staff/raul-santamaria/asistenciapp/tools/`. Los siete scripts; texto sin cambios; deben poder ejecutarse. (CA-08, CA-11)

- [x] **T04** Copiar `templates/` de la plantilla a `staff/raul-santamaria/asistenciapp/templates/`. Issue y pull-request; texto sin cambios; enlace `Closes #` en la plantilla de PR. (CA-02, CA-08)

- [x] **T05** Copiar `MCPS/github-mcp-server/mcp.txt` de la plantilla a `staff/raul-santamaria/asistenciapp/MCPS/github-mcp-server/mcp.txt`. Texto sin cambios. (CA-08)

- [x] **T06** En las skills cuyo comando es `./tools/`, sustituir cada `./tools/` por `staff/raul-santamaria/asistenciapp/tools/`. El resto de cada skill igual. Las skills sin script no cambian. (CA-09)

- [x] **T07** Reescribir `AGENTS.md` §2 con los cinco momentos; puntero a `agents/git-workflow-agent.md`; commit/push solo en momento 2 y en momento 5 cuando lo piden; actualizar tabla de estado con la 009. (CA-01–CA-07)

- [x] **T08** Enmendar `docs/CONSTITUTION.md` §4 según el plan (enmienda **3.2**, 2026-10-30) y añadir la fila al historial. P1–P6 no cambian. (CA-06, CA-10)

- [x] **T09** Actualizar `docs/ARCHITECTURE.md`: en el árbol, antes de `docs/`, `agents/`, `skills/`, `tools/`, `templates/`, `MCPS/`; párrafo corto del orquestador. (CA-10)

- [x] **T10** Desde la raíz del monorepo, ejecutar `staff/raul-santamaria/asistenciapp/tools/check-status.sh` y comprobar que termina bien (repositorio, rama, remoto). (CA-11)

- [x] **T11** Marcar esta spec como implementada en la cabecera de `spec.md` / `plan.md` y en la tabla de `AGENTS.md` cuando T01–T10 estén hechas. (cierre)
