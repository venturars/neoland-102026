# Tareas 004 · Quitar el nombre

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

Primero el test. Los documentos se tocan después, un fichero por tarea.

---

- [x] **T01** · Crear `tests/test_personal_references.py` con las tres comprobaciones del plan.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* ese test falla porque el README y las notas todavía tienen el nombre.

- [x] **T02** · En `README.md`, las dos líneas `cd` pasan a `cd staff/<usuario>/asistenciapp`.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* el diff del README en este paso solo cambia esas dos líneas.

- [x] **T03** · En `specs/001-checkin-codigo/spec.md`, quitar el nombre de las dos frases y dejar la fecha y el hecho.
  - *Cubre:* CA-02, CA-03.

- [x] **T04** · En `specs/001-checkin-codigo/plan.md`, el título pasa a «Decisiones tomadas». Las cinco decisiones no se reescriben.
  - *Cubre:* CA-02, CA-03.

- [x] **T05** · En `specs/001-checkin-codigo/tasks.md`, quitar el nombre de las cuatro notas. Cada una conserva el 2026-10-20 y lo que se comprobó.
  - *Cubre:* CA-02, CA-03.

- [x] **T06** · En la spec 002, el plan 002, las tasks 002, la spec 003 y la constitución, dejar las frases que hablan de una carpeta personal sin escribir el nombre.
  - *Cubre:* CA-02.

- [x] **T07** · Lanzar `pytest` desde esta carpeta y actualizar la tabla de `AGENT.md` §7.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* `pytest` termina en verde y la tabla nombra esta spec como hecha.
