# Tareas 004 · Quitar las referencias personales

> Estado: **Terminado** (2026-10-25) · Plan: [plan.md](plan.md) · Creado: 2026-10-24

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Preparación

- [x] **T01** · Crear la rama `jose-miguel-spec-004`.
  - *Hecha cuando:* `git branch` muestra la nueva rama.

## Fase B · Implementación en Documentación Principal

- [x] **T02** · Actualizar `README.md` con rutas genéricas.
  - Sustituir `staff/jose-miguel/asistenciapp` por `staff/<usuario>/asistenciapp`.
  - *Cubre:* CA-01.
  - *Hecha cuando:* El README no contiene la ruta personal.

- [x] **T03** · Anonimizar `AGENT.md`.
  - Sustituir "Jose Miguel" por "el usuario" o frases impersonales.
  - *Cubre:* CA-02.
  - *Hecha cuando:* El archivo no contiene el nombre propio.

- [x] **T04** · Anonimizar `CONSTITUTION.md`.
  - Sustituir "Jose Miguel" por "el usuario" o frases impersonales.
  - *Cubre:* CA-02.
  - *Hecha cuando:* El archivo no contiene el nombre propio.

## Fase C · Limpieza de Specs Anteriores

- [x] **T05** · Limpiar referencias en `specs/001-checkin-codigo/`.
  - *Cubre:* CA-03.
- [x] **T06** · Limpiar referencias en `specs/002-spec-antes-del-cambio/`.
  - *Cubre:* CA-03.
- [x] **T07** · Limpiar referencias en `specs/003-activar-entorno-no-es-arrancar-app/`.
  - *Cubre:* CA-03.

## Fase D · Verificación

- [x] **T08** · Crear `tests/test_personal_references.py`.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* El test existe y pasa.

- [x] **T09** · Ejecutar `pytest` y revisión final.
  - *Cubre:* CA-04.
  - *Hecha cuando:* Todos los tests pasan.
