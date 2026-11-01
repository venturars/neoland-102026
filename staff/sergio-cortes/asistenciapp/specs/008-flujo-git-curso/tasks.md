# Tareas 008 · Flujo de git del curso

> Estado: **Terminado** (2026-10-30) · Plan: [plan.md](plan.md) · Creado: 2026-10-30 · Aprobada: 2026-10-30

Issue: #688.

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec y el plan ya están escritos. Las tareas de abajo son la copia y las enmiendas.

---

## Fase A · Copia

- [x] **T01** · Copiar `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` desde `exercises/git-workflow-agent-template`.
  - El texto queda igual que en la plantilla. La plantilla no se edita.
  - *Cubre:* CA-03.
  - *Hecha cuando:* las cinco carpetas están en esta app y `git diff` de `exercises/git-workflow-agent-template` está vacío.

- [x] **T02** · En las siete skills de terminal, cambiar `./tools/` por `staff/sergio-cortes/asistenciapp/tools/`.
  - Skills: `check-status`, `pull-changes`, `create-branch-from-staging`, `create-branch`, `create-empty-commit`, `commit-changes`, `launch-push`.
  - Los siete scripts quedan ejecutables.
  - El resto de ficheros copiados no se toca.
  - *Cubre:* CA-03.
  - *Hecha cuando:* esas siete skills apuntan a la ruta de esta carpeta y el diff del resto contra la plantilla está vacío.

- [x] **T03** · Comprobar plantillas, enlace y el script de estado.
  - `templates/issues/` y `templates/pull-request/` tienen feat, fix, chore, docs, refactor y test. No hay una plantilla única `basic_*`.
  - `skills/link-pr-to-issue/SKILL.md` y las plantillas de pull request siguen el texto de la plantilla: piden `Closes #N` y no llaman a cerrar la issue. La mención de `Related to #N` se queda, como línea a sustituir.
  - Desde la raíz del monorepo, `staff/sergio-cortes/asistenciapp/tools/check-status.sh` termina con código 0.
  - *Cubre:* CA-03, CA-04, CA-05.
  - *Hecha cuando:* esas tres comprobaciones del plan §3 salen bien.

## Fase B · Documentos

- [x] **T04** · Actualizar `AGENTS.md` según el plan §2.2.
  - Al principio remite a `agents/git-workflow-agent.md`. El agente elige un momento y no lo encadena.
  - No se abre `specs/NNN-nombre/` sin número de issue. El spec abre con `Issue: #N`. Siguen las paradas tras el spec, tras el plan y tras las tasks.
  - Una issue, una rama o una pull request no autorizan el código.
  - El §5 permite commit y push solo al empezar (commit vacío, push y pull request en draft) y cuando se piden después. No se fusiona a `staging`.
  - La tabla §7 gana la fila `008-flujo-git-curso`. La fase «implementada» se escribe en T07.
  - *Cubre:* CA-01, CA-02, CA-06.
  - *Hecha cuando:* el manual dice eso y la fila está en la tabla.

- [x] **T05** · Enmendar `docs/CONSTITUTIONS.md` a 2.5 según el plan §2.3.
  - Cabecera 2.5, última enmienda 2026-10-30. La fila 2.4 no se reescribe.
  - El §4.1 pide la issue antes de `specs/NNN-nombre/` y deja claro que issue, rama y pull request no autorizan el código.
  - El §4.2 mantiene spec, plan, tasks e implementación, con ok tras el spec, tras el plan y tras las tasks.
  - P1–P6, §3, §5, §6 y §7 no cambian. El historial gana la fila 2.5.
  - *Cubre:* CA-02.
  - *Hecha cuando:* la cabecera dice 2.5 y la fila 2.5 está en el historial.

- [x] **T06** · Actualizar `docs/ARCHITECTURE.md` a 1.6 según el plan §2.4.
  - Antes de `docs/` entran `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, sin los ficheros de dentro.
  - El §2.1 dice que no son capas de la app en marcha y que el orquestador reconoce el momento.
  - No se inventa la fila 1.5. El historial gana la fila 1.6. El §1 no cambia.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la cabecera dice 1.6 y el árbol y el §2.1 están escritos.

## Fase C · Cierre

- [x] **T07** · Comprobar que el pasar lista no se ha movido y cerrar los documentos.
  - Sin cambios en `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md`.
  - No entran `test.py` ni `contextlibtest.py`. La plantilla del ejercicio sigue sin diff.
  - `pytest` pasa.
  - La fila §7 de `AGENTS.md` marca esta spec como implementada. `spec.md`, `plan.md` y este `tasks.md` pasan a implementada o terminado.
  - *Cubre:* CA-06, CA-08.
  - *Hecha cuando:* el diff de esos caminos está vacío, `pytest` termina bien y los tres documentos reflejan el cierre.
