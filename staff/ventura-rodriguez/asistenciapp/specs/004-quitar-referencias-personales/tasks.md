# Tareas 004 · Quitar las referencias personales a Victor

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Los documentos se tocan después, un fichero por tarea.

---

## Fase A · El test, antes de cambiar los documentos

- [x] **T01** · Crear `tests/test_personal_references.py` con las tres comprobaciones del plan §2.4.
  - Las dos líneas del README que empiezan por `cd staff/` son `cd staff/<usuario>/asistenciapp`.
  - Ningún Markdown de esta carpeta contiene `victor`, en cualquier mayúscula. El test se salta `.venv/` y `specs/004-quitar-referencias-personales/`.
  - Cada frase «Después» de la tabla del plan §2.2 está en su fichero.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* `pytest tests/test_personal_references.py` falla porque el README y las notas todavía tienen el nombre.

## Fase B · Las instrucciones

- [x] **T02** · En `README.md`, cambiar las dos líneas `cd staff/victor-chang/asistenciapp` por `cd staff/<usuario>/asistenciapp`.
  - `<usuario>` se deja escrito así. El resto del README no cambia.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* el diff de `README.md` solo cambia esas dos líneas.

## Fase C · Las notas de la spec 001

- [x] **T03** · En `specs/001-checkin-codigo/spec.md`, quitar el nombre de las dos frases de la tabla del plan §2.2.
  - Se quedan la fecha `2026-10-19` y el hecho de que las propuestas quedaron aceptadas.
  - Se queda el hecho de que un alumno puede registrar a compañeros ausentes con otros nombres.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* esas dos frases son las de la columna «Después» y el resto del fichero no cambia.

- [x] **T04** · En `specs/001-checkin-codigo/plan.md`, cambiar el título «Decisiones tomadas por Victor» por «Decisiones tomadas».
  - Las cinco decisiones numeradas no se reescriben.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* el título es el de la tabla y las cinco decisiones siguen igual.

- [x] **T05** · En `specs/001-checkin-codigo/tasks.md`, quitar el nombre de las cuatro notas de la tabla del plan §2.2.
  - Cada nota conserva su fecha `2026-10-20` y lo que se comprobó.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* las cuatro notas son las de la columna «Después».

## Fase D · Las specs que dejaron la carpeta fuera

- [x] **T06** · En `specs/002-spec-antes-del-cambio/spec.md`, dejar la frase del plan §2.3 sobre las rutas del README.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla y ya no nombra la carpeta personal.

- [x] **T07** · En `specs/002-spec-antes-del-cambio/plan.md`, dejar las dos frases del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las dos frases son las de la tabla.

- [x] **T08** · En `specs/002-spec-antes-del-cambio/tasks.md`, dejar la frase del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

- [x] **T09** · En `specs/003-activar-el-entorno/spec.md`, dejar la frase del plan §2.3 sobre las rutas del README.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

- [x] **T10** · En `specs/003-activar-el-entorno/plan.md`, dejar las dos frases del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las dos frases son las de la tabla.

- [x] **T11** · En `specs/003-activar-el-entorno/tasks.md`, dejar la frase del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

## Fase E · Comprobar

- [x] **T12** · Lanzar `pytest` desde esta carpeta de la app y revisar el diff de `README.md`.
  - Actualizar la tabla de `AGENT.md` §7: esta spec pasa a implementada.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* `pytest` termina en verde, el diff de `README.md` solo cambia las dos líneas `cd`, y la tabla de `AGENT.md` §7 nombra esta spec como implementada.
