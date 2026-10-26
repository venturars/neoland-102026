# Tareas 004 · Quitar las referencias personales a Víctor

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Después, un fichero de documentación cada vez.
- La spec, el plan y esta lista ya están escritos. Las tareas de abajo son el cambio.

---

## Fase A · Test

- [x] **T01** · Crear `tests/test_docs.py`.
  - Recorre los `.md` de esta aplicación, salvo `specs/004-quitar-referencias-personales/` y salvo `.venv/`.
  - Falla si aparece `Victor`, `Víctor` o `victor-chang`.
  - Comprueba que los dos `cd` del README son `staff/<usuario>/asistenciapp`.
  - Comprueba que `AGENTS.md` identifica `staff/maria-osipuk/asistenciapp/` y limita la búsqueda de specs a `staff/maria-osipuk/asistenciapp/specs/`.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* el test existe y falla por las referencias que todavía están.

## Fase B · Documentación

- [x] **T02** · En `README.md`, cambiar los dos `cd`.
  - Pasan a `staff/<usuario>/asistenciapp`.
  - No se usa `maria-osipuk`. El resto del README no cambia.
  - *Cubre:* CA-01.
  - *Hecha cuando:* los dos `cd` son esa ruta genérica.

- [x] **T03** · En `specs/001-checkin-codigo/tasks.md`, quitar el nombre de las cuatro notas del 2026-10-20.
  - Siguen la fecha y el resultado: registro desde un móvil con datos móviles, panel que se abre directamente, CSV con dos columnas y tildes correctas, y los pasos 1–5 correctos.
  - «Su móvil» pasa a «un móvil».
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* esas notas ya no nombran a una persona y conservan fecha y resultado.

- [x] **T04** · En `specs/001-checkin-codigo/spec.md`, quitar el nombre.
  - El 2026-10-19 queda «se aceptaron las propuestas».
  - El historial del 2026-10-20 sigue detectando que un alumno puede registrar a compañeros ausentes con otros nombres.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* esas dos frases conservan fecha y resultado, sin nombre de persona.

- [x] **T05** · En `specs/001-checkin-codigo/plan.md`, renombrar el apartado 8.
  - Pasa a «Decisiones tomadas».
  - Las cinco decisiones, sus fechas y sus resultados no cambian.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* el título ya no nombra a una persona y las cinco decisiones siguen igual.

- [x] **T06** · En `specs/002-spec-antes-del-cambio/tasks.md`, quitar el nombre y la carpeta de la condición de T04.
  - Queda hecha cuando esos apartados ya no nombran a una persona ni a su carpeta, y las specs se buscan solo en esta carpeta.
  - *Cubre:* CA-02.
  - *Hecha cuando:* esa condición ya no contiene el nombre ni la carpeta.

- [x] **T07** · En `specs/002-spec-antes-del-cambio/plan.md`, quitar el nombre y la carpeta.
  - Las menciones personales de las reglas vivas pasan a ser quien trabaja en esta carpeta.
  - Quien aprueba es la persona que trabaja en `staff/maria-osipuk/asistenciapp/`, no otra persona ni otra carpeta del repositorio.
  - La fecha 2026-10-23 se queda.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* esas dos frases conservan la decisión y la fecha, sin el nombre ni la carpeta personal.

- [x] **T08** · En `specs/003-aclarar-instrucciones-arranque/plan.md`, quitar la carpeta concreta.
  - Sigue constando que aquel cambio no tocó las rutas personales de las instrucciones de uso.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* ya no aparece la carpeta y la decisión de no tocarla sigue escrita.

- [x] **T09** · En `specs/003-aclarar-instrucciones-arranque/tasks.md`, quitar la carpeta concreta.
  - Sigue constando que aquellas rutas personales no cambiaron en ese cambio.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* ya no aparece la carpeta y la decisión sigue escrita.

## Fase C · Cierre

- [x] **T10** · Añadir la fila de `004-quitar-referencias-personales` en la tabla de estado de `AGENTS.md`.
  - No se cambia ninguna otra frase de `AGENTS.md` ni de `CONSTITUTION.md`.
  - *Cubre:* CA-03, CA-05.
  - *Hecha cuando:* la tabla tiene la fila y el resto de esas reglas sigue igual.

- [x] **T11** · Pasar el test y leer las notas.
  - `pytest` pasa.
  - Cada nota de T03–T09 conserva su fecha y su resultado, y no atribuye la comprobación a quien trabaja en esta carpeta.
  - `git diff` no toca `app.py`, `asistencia/`, `static/` ni `CONSTITUTION.md`.
  - *Cubre:* CA-04, CA-05.
  - *Hecha cuando:* se cumplen esas tres comprobaciones.
