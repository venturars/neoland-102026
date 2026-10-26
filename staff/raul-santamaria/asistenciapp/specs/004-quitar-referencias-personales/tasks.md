# Tareas 004 · Quitar las referencias personales a Raúl

> Estado: **Terminado** (2026-10-26) · Plan: [plan.md](plan.md) · Creado: 2026-10-26 · Aprobado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Los documentos se tocan después, un fichero por tarea.

---

## Fase A · El test, antes de cambiar los documentos

- [x] **T01** · Crear `tests/test_personal_references.py` con las tres comprobaciones del plan §2.4.
  - Las dos líneas del README que empiezan por `cd staff/` son `cd staff/<usuario>/asistenciapp`.
  - Ningún Markdown de esta carpeta contiene `raul` ni `raúl`, en cualquier mayúscula. El test se salta `.venv/` y `specs/004-quitar-referencias-personales/`.
  - Cada frase «Después» de las tablas del plan §2.2 y §2.3 está en su fichero.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* `pytest tests/test_personal_references.py` falla porque el README, las reglas y las specs todavía tienen la carpeta personal.

## Fase B · Las instrucciones

- [x] **T02** · En `README.md`, cambiar las dos líneas `cd staff/raul-santamaria/asistenciapp` por `cd staff/<usuario>/asistenciapp`.
  - `<usuario>` se deja escrito así. El resto del README no cambia.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* el diff de `README.md` solo cambia esas dos líneas.

## Fase C · Constitución y manual

- [x] **T03** · En `AGENT.md`, dejar las dos frases del plan §2.2 (comandos y regla de edición).
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* esas dos frases son las de la columna «Después».

- [x] **T04** · En `docs/CONSTITUTION.md`, dejar las dos frases del plan §2.2 (§7 y historial 2.2).
  - La versión de la constitución sigue en 2.3.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* esas dos frases son las de la columna «Después» y la cabecera sigue diciendo 2.3.

## Fase D · Specs que citaban la carpeta personal

- [x] **T05** · En `specs/002-spec-antes-del-cambio/spec.md`, dejar el CA-06 del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* ese criterio es el de la tabla y ya no nombra `raul-santamaria`.

- [x] **T06** · En `specs/002-spec-antes-del-cambio/plan.md`, dejar las dos frases del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las dos frases son las de la tabla.

- [x] **T07** · En `specs/002-spec-antes-del-cambio/tasks.md`, dejar la frase del plan §2.3.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

- [x] **T08** · En `specs/003-activar-el-entorno/tasks.md`, dejar la frase del plan §2.3 sobre lanzar `pytest`.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

- [x] **T09** · En `specs/001-checkin-codigo/tasks.md`, dejar la frase del plan §2.3 sobre las rutas del README.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa frase es la de la tabla.

## Fase E · Comprobar

- [x] **T10** · Lanzar `pytest` desde esta carpeta de la app y revisar el diff de `README.md`.
  - Actualizar la tabla de `AGENT.md` §7: esta spec pasa a implementada.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* `pytest` termina en verde, el diff de `README.md` solo cambia las dos líneas `cd`, y la tabla de `AGENT.md` §7 nombra esta spec como implementada.
