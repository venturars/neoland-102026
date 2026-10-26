# Tareas 005 · Arquitectura limpia adaptada

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Documentación de arquitectura

- [x] **T01** · Redactar `docs/ARCHITECTURE.md` según plan §2 (capas, dependencias, tabla “dónde va cada cosa”, casos de uso, fuera de alcance).
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* el fichero existe, está en español y un revisor puede mapear cada módulo actual a una capa.

## Fase B · Dominio y ports

- [x] **T02** · Crear `asistencia/domain/` (`errors.py`, `session.py`) y mover `codes.py`, `names.py`, `export.py` desde la raíz del paquete (mismo comportamiento).
  - *Cubre:* CA-03.
  - *Hecha cuando:* `pytest` pasa en tests de `test_codes.py`, `test_names.py`, `test_export.py` tras actualizar imports.

- [x] **T03** · Definir `asistencia/ports/repository.py` (`AttendanceRepository`) y opcional `Clock` según plan §3.2.
  - *Cubre:* CA-03.
  - *Hecha cuando:* el protocolo expone las operaciones que hoy usa `app.py` vía `db.py`.

## Fase C · Infraestructura

- [x] **T04** · Reorganizar SQLite en `asistencia/infra/sqlite/` (schema, conexión, `AttendanceRepository`); mover `tunnel.py` a `asistencia/infra/`.
  - *Cubre:* CA-03, CA-05.
  - *Hecha cuando:* no queda lógica SQL en `web` ni en `use_cases`; BD y datos mínimos igual que antes.

- [x] **T05** · Eliminar módulos obsoletos en raíz de `asistencia/` (`db.py`, etc.) o dejar shims mínimos solo si algún test lo exige temporalmente.
  - *Cubre:* CA-03.
  - *Hecha cuando:* `rg 'from asistencia import db'` y `from asistencia.db` no apuntan a código vivo salvo shims documentados.

## Fase D · Casos de uso

- [x] **T06** · Implementar casos de uso en `asistencia/use_cases/` (crear/listar sesión, vista profesor, pública, check-in, cerrar, borrar check-in, export CSV) usando domain + ports.
  - *Cubre:* CA-03, CA-04.
  - *Hecha cuando:* cada flujo de `tests/test_api.py` puede describirse como “ruta → use case → repo” sin reglas de negocio en Flask.

## Fase E · Capa web

- [x] **T07** · Extraer Flask a `asistencia/web/` (factory, middleware token/BD, handlers); dejar `app.py` como entrada (`main`, `--tunel`, `port_in_use`).
  - *Cubre:* CA-04, CA-09.
  - *Hecha cuando:* `pytest tests/test_api.py` pasa sin cambiar expectativas de JSON ni códigos HTTP.

- [x] **T08** · Ejecutar `pytest` completo y corregir imports rotos en `tests/`.
  - *Cubre:* CA-08.
  - *Hecha cuando:* la suite entera pasa en local.

## Fase F · Gobernanza

- [x] **T09** · Actualizar `AGENTS.md` (§1 lectura de `ARCHITECTURE.md`, §3 árbol de carpetas, §7 fila `005-clean-architecture`).
  - *Cubre:* CA-06, CA-10.
  - *Hecha cuando:* el manual describe la estructura real post-refactor.

- [x] **T10** · Enmienda constitución **2.3** en `docs/CONSTITUTIONS.md` (referencia a `ARCHITECTURE.md`, historial §8).
  - *Cubre:* CA-07.
  - *Hecha cuando:* no hay contradicción entre constitución, ARCHITECTURE y código.

## Fase G · Cierre

- [x] **T11** · Revisión manual rápida: arrancar `python app.py`, abrir panel y alumno; confirmar mismos flujos que antes del refactor.
  - *Cubre:* CA-09.
  - *Hecha cuando:* check-in y listado funcionan en local sin sorpresas.

- [x] **T12** · Marcar spec `005` como implementada en `spec.md`, `plan.md` y tabla §7 de `AGENTS.md`.
  - *Cubre:* CA-10.
  - *Hecha cuando:* documentos de spec reflejan fase terminada e issue #239 comprobable según su «Cómo probarlo».
