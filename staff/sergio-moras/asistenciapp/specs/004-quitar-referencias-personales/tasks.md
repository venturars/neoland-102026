# Tasks 004 · Documentación sin referencias personales

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md)

Una tarea cada vez, en orden. Al acabarla se marca `[x]`. Primero el test.

---

- [x] **T01 · Test.** Crear `tests/test_no_personal_references.py` con las tres pruebas del plan §4.
  - Cubre: CA-01, CA-02, CA-03.
  - Terminada cuando: las tres fallan porque los documentos aún tienen el nombre.

- [x] **T02 · README.** Cambiar los dos `cd` a `staff/<usuario>/asistenciapp`.
  - Cubre: CA-01, CA-04.
  - Terminada cuando: el diff del README son solo esas dos líneas.

- [x] **T03 · Notas de la spec 001.** Aplicar la tabla del plan §2 en `spec.md`, `plan.md` y `tasks.md`.
  - Cubre: CA-02, CA-03.
  - Terminada cuando: cada nota tiene el texto de la columna «Después» y conserva su fecha.

- [x] **T04 · Verificar.** Lanzar `pytest` y añadir esta spec a la tabla de `AGENT.md` §7.
  - Cubre: CA-01 a CA-04.
  - Terminada cuando: toda la suite pasa.
