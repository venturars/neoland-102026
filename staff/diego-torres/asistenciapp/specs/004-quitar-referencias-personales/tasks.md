# Tareas 004 · Quitar las referencias personales a Victor

> Estado: **Aprobado** (2026-10-27) · Plan: [plan.md](plan.md) · Creado: 2026-10-27 · Aprobado: 2026-10-27

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Los documentos se tocan después, un fichero por tarea. Las specs 002 y 003 no se reescriben: ya no nombran a Victor.

---

## Fase A · El test, antes de cambiar los documentos

- [ ] **T01** · Crear `tests/test_personal_references.py` con las tres comprobaciones del plan §2.4.
  - Las dos líneas del README que empiezan por `cd staff/` son `cd staff/<usuario>/asistenciapp`.
  - Ningún Markdown de esta carpeta contiene `victor`, en cualquier mayúscula. El test se salta `.venv/` y `specs/004-quitar-referencias-personales/`.
  - Cada frase «Después» de la tabla del plan §2.2 está en su fichero.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* `pytest tests/test_personal_references.py` falla porque el README y las notas de la spec 001 todavía tienen el nombre.

## Fase B · Las instrucciones

- [ ] **T02** · En `README.md`, cambiar las dos líneas `cd staff/victor-chang/asistenciapp` por `cd staff/<usuario>/asistenciapp`.
  - `<usuario>` se deja escrito así. El resto del README no cambia.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* el diff de `README.md` solo cambia esas dos líneas.

## Fase C · Las notas de la spec 001

- [ ] **T03** · En `specs/001-checkin-codigo/spec.md`, quitar el nombre de las dos frases de la tabla del plan §2.2.
  - Se quedan la fecha `2026-10-19` y el hecho de que las propuestas quedaron aceptadas.
  - Se queda el hecho de que un alumno puede registrar a compañeros ausentes con otros nombres.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* esas dos frases son las de la columna «Después» y el resto del fichero no cambia.

- [ ] **T04** · En `specs/001-checkin-codigo/plan.md`, cambiar el título «Decisiones tomadas por Victor» por «Decisiones tomadas».
  - Las cinco decisiones numeradas no se reescriben.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* el título es el de la tabla y las cinco decisiones siguen igual.

- [ ] **T05** · En `specs/001-checkin-codigo/tasks.md`, quitar el nombre de las cuatro notas de la tabla del plan §2.2.
  - Cada nota conserva su fecha `2026-10-20` y lo que se comprobó.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* las cuatro notas son las de la columna «Después».

## Fase D · Comprobar las specs que dejaron la carpeta fuera

- [ ] **T06** · En `specs/002-spec-antes-del-cambio/spec.md`, comprobar la frase del plan §2.3 sobre las rutas del README.
  - No se reescribe. Ya dice «carpeta personal» y no nombra a Victor.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla y el fichero no cambia.

- [ ] **T07** · En `specs/002-spec-antes-del-cambio/plan.md`, comprobar las dos frases del plan §2.3.
  - No se reescriben.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las dos frases son las de la tabla y el fichero no cambia.

- [ ] **T08** · En `specs/002-spec-antes-del-cambio/tasks.md`, comprobar la frase del plan §2.3.
  - No se reescribe.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla y el fichero no cambia.

- [ ] **T09** · En `specs/003-activar-el-entorno/spec.md`, comprobar la frase del plan §2.3 sobre las rutas del README.
  - No se reescribe. Se escribió ya sin el nombre.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla y el fichero no cambia.

- [ ] **T10** · En `specs/003-activar-el-entorno/plan.md`, comprobar las dos frases del plan §2.3.
  - No se reescriben.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las dos frases son las de la tabla y el fichero no cambia.

- [ ] **T11** · En `specs/003-activar-el-entorno/tasks.md`, comprobar la frase del plan §2.3.
  - No se reescribe.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla y el fichero no cambia.

## Fase E · Comprobar

- [ ] **T12** · Lanzar `pytest` desde `staff/diego-torres/asistenciapp/` y revisar el diff de `README.md`.
  - La tabla de `AGENTS.md` §7 ya nombra esta spec. No se edita.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* `pytest` termina en verde y el diff de `README.md` solo cambia las dos líneas `cd`.
