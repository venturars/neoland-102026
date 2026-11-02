# Tareas 007 · Flujo de git y cinco momentos

> Estado: **Terminado** (2026-10-30) · Plan: [plan.md](plan.md) · Creado: 2026-10-30

Issue: #616.

Cómo leer esta lista:

- Se hacen **en orden**. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, este plan y esta lista ya están escritos. Las tareas de abajo son la copia y las enmiendas.

---

## Fase A · Copia

- [x] **T01** · Copiar `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` desde `exercises/git-workflow-agent-template`.
  - El texto queda igual que en la plantilla. La plantilla no se edita.
  - *Cubre:* CA-06.
  - *Hecha cuando:* las cinco carpetas están en esta app y el diff de la plantilla está vacío.

- [x] **T02** · En las siete skills de terminal, cambiar `./tools/` por `staff/ventura-rodriguez/asistenciapp/tools/`.
  - Skills: `check-status`, `pull-changes`, `create-branch-from-staging`, `create-branch`, `create-empty-commit`, `commit-changes`, `launch-push`.
  - Los scripts quedan ejecutables.
  - *Cubre:* CA-06.
  - *Hecha cuando:* esas siete skills apuntan a la ruta de esta carpeta.

## Fase B · Documentos

- [x] **T03** · Reescribir el orden de `AGENTS.md`.
  - Cinco momentos, sin parar entre spec, plan y tasks.
  - Commit y push solo en el draft (commit vacío) y cuando se piden después.
  - La tabla de estado marca esta spec como implementada.
  - *Cubre:* CA-07.
  - *Hecha cuando:* el manual describe los cinco momentos y la fila de esta spec.

- [x] **T04** · Enmendar `docs/CONSTITUTION.md` a 3.1.
  - El §4 ya no pide ok entre spec y plan.
  - El orden de los ficheros sigue siendo spec, plan, tasks e implementación.
  - Una issue, una rama o una pull request no autorizan el código.
  - El historial gana la fila 3.1, fecha 2026-10-30. P1–P6 no cambian.
  - *Cubre:* CA-08.
  - *Hecha cuando:* la cabecera dice versión 3.1 y la fila está en el historial.

- [x] **T05** · Actualizar el árbol de `docs/ARCHITECTURE.md`.
  - Antes de `docs/` entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, sin los ficheros de dentro.
  - El orquestador reconoce el momento y llama al subagente o a la skill que toca.
  - *Cubre:* CA-09.
  - *Hecha cuando:* el árbol y ese párrafo están escritos.

- [x] **T06** · Comprobar que el pasar lista no se ha movido.
  - Sin cambios en `app.py`, `asistencia/`, `static/`, `tests/` ni `README.md`.
  - `pytest` pasa.
  - *Cubre:* CA-10.
  - *Hecha cuando:* el diff de esos caminos está vacío y `pytest` termina bien.
