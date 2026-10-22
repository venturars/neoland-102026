# Tareas 004 · Constitución en `docs` y manual `AGENTS.md`

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22 · Terminado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Mover y renombrar ficheros

- [x] **T01** · Desde `staff/sergio-cortes/asistenciapp/`, `mkdir -p docs` y `git mv CONSTITUTION.md docs/CONSTITUTIONS.md`.
  - *Cubre:* CA-01, CA-07.
  - *Hecha cuando:* existe `docs/CONSTITUTIONS.md` y no hay `CONSTITUTION.md` en la raíz; el diff del cuerpo de reglas está vacío salvo la ruta.

- [x] **T02** · `git mv AGENT.md AGENTS.md`.
  - *Cubre:* CA-02.
  - *Hecha cuando:* existe `AGENTS.md` y no hay `AGENT.md`.

## Fase B · Referencias vivas

- [x] **T03** · Actualizar enlaces en `README.md` a `docs/CONSTITUTIONS.md` y `AGENTS.md`.
  - *Cubre:* CA-03.
  - *Hecha cuando:* los dos enlaces del bloque SDD apuntan a las rutas nuevas.

- [x] **T04** · En `AGENTS.md`, actualizar título, párrafo introductorio, §1 (lectura obligatoria) y §3 (árbol de carpetas).
  - *Cubre:* CA-04.
  - *Hecha cuando:* no quedan menciones de `CONSTITUTION.md` en raíz ni de `AGENT.md` como nombre del manual.

- [x] **T05** · Corregir enlaces relativos en `specs/002-spec-antes-del-cambio/plan.md` y `specs/003-readme-entorno-y-arranque/plan.md`.
  - *Cubre:* CA-05.
  - *Hecha cuando:* los links `../../…` abren los ficheros nuevos.

## Fase C · Estado y comprobación

- [x] **T06** · Añadir fila `004-docs-constitution-y-agents` en `AGENTS.md` §7.
  - *Cubre:* CA-06.
  - *Hecha cuando:* la tabla incluye esta spec con estado implementada.

- [x] **T07** · Comprobar CA-01–CA-07 con la tabla del plan §3; `rg` sin enlaces rotos a rutas antiguas en raíz; `pytest` en verde.
  - *Hecha cuando:* checklist manual ok y 77 tests pasan.

- [x] **T08** · Marcar esta spec como implementada en `spec.md` (estado e historial) y `tasks.md` como terminado.
  - *Hecha cuando:* metadatos alineados con el cierre de T07.
