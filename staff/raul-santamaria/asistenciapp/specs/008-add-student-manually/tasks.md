# Tareas 008 · Añadir alumno a mano

> Estado: **Hecha** · Plan: [plan.md](plan.md) · Creado: 2026-10-27 · Aprobado: 2026-10-27 · Issue: #529

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test, después el código, cuando sea posible.

---

## Fase A · Acción

- [x] **T01** · Tests de `add_checkin_manual`: sesión abierta (nombre + hora, total); sesión cerrada; vacío / > 60; duplicado por `name_key`; sesión inexistente.
  - *Cubre:* CA-01, CA-02, CA-03, CA-05, CA-09.
  - *Hecha cuando:* fallan porque la acción no existe.

- [x] **T02** · Implementar `add_checkin_manual` en `asistencia/usecases/attendance.py` (`require_session`, `clean_name`, `add_checkin`; sin código, sin IP, sin `ensure_open`).
  - *Cubre:* CA-01 a CA-05, CA-09.
  - *Hecha cuando:* los tests de T01 pasan.

## Fase B · API y panel

- [x] **T03** · Tests API: `POST /api/sessions/<id>/checkins` con token → 201; duplicado → `already`; sin token → 401; sesión cerrada → 201; nombre inválido → 400.
  - *Cubre:* CA-01, CA-02, CA-03, CA-05, CA-07.
  - *Hecha cuando:* fallan o la ruta no existe.

- [x] **T04** · Ruta en `app.py` + formulario (campo + **Añadir**) en `static/profesor.html` / `profesor.js` (visible abierta y cerrada; mensajes en `#status`).
  - *Cubre:* CA-01, CA-05, CA-08, CA-09.
  - *Hecha cuando:* tests de T03 pasan; anotar verificación manual ~400 px al cerrar la tarea.
  - *Manual CA-08:* el formulario usa el mismo `.card` + `input` + `button.full` que «Abrir asistencia» (layout responsive existente); pendiente de mirar a ~400 px al probar en local.

## Fase C · Documentación y cierre

- [x] **T05** · README: cómo añadir a mano (también con asistencia cerrada). Actualizar tabla de estado en `AGENTS.md`.
  - *Cubre:* uso humano del plan §3.3.
  - *Hecha cuando:* el README describe el flujo.

- [x] **T06** · Cierre: `pytest` en verde; test o comprobación breve de CSV y quitar tras alta manual (CA-04, CA-06); marcar spec 008 como implementada en `AGENTS.md` y cabeceras de spec/plan/tasks.
  - *Cubre:* CA-04, CA-06, §5.
  - *Hecha cuando:* `pytest` pasa y la tabla de estado dice implementada.
  - *Cierre:* `tests/test_manual_add_list_export.py`; suite completa 140 tests en verde.
