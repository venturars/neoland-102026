# Tareas 007 · Plantillas por tipo y reglas sin duplicar

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md) · Creado: 2026-11-01

Issue: #714.

---

## Fase A · Spec

- [x] **T01** · Escribir `spec.md`, `plan.md` y `tasks.md` con CA-01 a CA-07.
  - *Cubre:* CA-07 (documentación de la spec).
  - *Hecha cuando:* los tres ficheros existen y la spec abre con `Issue: #714`.

## Fase B · Tests

- [x] **T02** · Añadir `tests/test_git_workflow_templates.py`.
  - *Cubre:* CA-01 a CA-06.
  - *Hecha cuando:* `pytest` pasa el módulo nuevo.

- [x] **T03** · Sincronizar `templates/` desde el ejercicio si CA-05 falla.
  - *Cubre:* CA-05.
  - *Hecha cuando:* el test de paridad pasa (copia solo si hace falta).

## Fase C · Documentos

- [x] **T04** · Actualizar `docs/ARCHITECTURE.md` y `AGENTS.md` (numeración y §7).
  - *Cubre:* CA-07.
  - *Hecha cuando:* el árbol menciona seis tipos y la tabla incluye `007-plantillas-por-tipo`.

- [x] **T05** · Ejecutar `pytest` en la carpeta de la app.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la suite completa termina bien.
