# Tareas 006 · Flujo de git y cinco momentos

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md) · Creado: 2026-11-01

Issue: #712.

Cómo leer esta lista:

- Se hacen **en orden**. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Copia

- [x] **T01** · Copiar `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` desde `exercises/git-workflow-agent-template`.
  - *Cubre:* CA-06.
  - *Hecha cuando:* las cinco carpetas están en esta app y la plantilla del ejercicio no se ha editado.

- [x] **T02** · En las siete skills de terminal, cambiar `./tools/` por `staff/jose-miguel/asistenciapp/tools/`.
  - *Cubre:* CA-06.
  - *Hecha cuando:* esas siete skills apuntan a la ruta de esta carpeta y los scripts son ejecutables.

## Fase B · Documentos

- [x] **T03** · Reescribir el orden de `AGENTS.md` (cinco momentos).
  - *Cubre:* CA-07.
  - *Hecha cuando:* el manual describe los cinco momentos y la fila de `006-flujo-de-git`.

- [x] **T04** · Enmendar `docs/CONSTITUTION.md` a 3.2.
  - *Cubre:* CA-08.
  - *Hecha cuando:* la cabecera dice versión 3.2 y la fila está en el historial.

- [x] **T05** · Actualizar el árbol de `docs/ARCHITECTURE.md`.
  - *Cubre:* CA-09.
  - *Hecha cuando:* el árbol y el párrafo del orquestador están escritos.

- [x] **T06** · Comprobar que el pasar lista no se ha movido.
  - Ajuste mínimo en `tests/test_architecture.py` si la constitución pasa a 3.2.
  - *Cubre:* CA-10.
  - *Hecha cuando:* `pytest` termina bien y no hay diff en `app.py`, `asistencia/`, `static/` ni `README.md`.
