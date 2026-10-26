# Tareas 005 · Arquitectura limpia adaptada

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Documentación de arquitectura

- [x] **T01** · Redactar `docs/ARCHITECTURE.md` según plan §2 (capas, dependencias, tabla «dónde va cada cosa», casos de uso, fuera de alcance).
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* el fichero existe, está en español y un revisor puede mapear cada módulo a una capa.

## Fase B · Dominio

- [x] **T02** · Crear `asistencia/domain/` (`session.py`, `codes.py`, `names.py`) con las reglas puras que antes vivían en la raíz del paquete (mismo comportamiento).
  - *Cubre:* CA-03.
  - *Hecha cuando:* `pytest` pasa en tests de códigos, nombres y export tras actualizar imports.

- [x] **T03** · Dejar `export.py` y `tunnel.py` en la raíz de `asistencia/` como utilidades de exportación y túnel (sin Flask ni SQL).
  - *Cubre:* CA-03.
  - *Hecha cuando:* export CSV y `--tunel` siguen funcionando con los mismos imports documentados.

## Fase C · Infraestructura SQLite y almacén

- [x] **T04** · Crear `infra/sqlite/schema.py` (DDL) y `connection.py` (`connect`, `init_schema`).
  - *Cubre:* CA-03, CA-05.
  - *Hecha cuando:* el esquema crea las mismas tablas que antes en `db.py`.

- [x] **T05** · Implementar `storage/sqlite.py`: funciones con `path` que abren SQLite, leen/escriben asistencia y delegan DDL/conexión en `infra/sqlite/`.
  - *Cubre:* CA-03, CA-05.
  - *Hecha cuando:* no queda lógica SQL en `web` ni en `usecases`; datos mínimos igual que antes.

- [x] **T06** · Eliminar `asistencia/db.py` y actualizar imports en tests y app.
  - *Cubre:* CA-03.
  - *Hecha cuando:* no hay referencias vivas a `asistencia.db`.

## Fase D · Casos de uso

- [x] **T07** · Implementar `usecases/attendance.py` (`prepare`, `check_in`, sesiones, vistas profesor/alumno, export, etc.) orquestando `domain` + `storage`.
  - *Cubre:* CA-03, CA-04.
  - *Hecha cuando:* cada flujo de `tests/test_api.py` se describe como «ruta → use case → storage» sin reglas de negocio en Flask.

## Fase E · Capa web

- [x] **T08** · Extraer Flask a `asistencia/web/` (`flask_app.py` con `create_app`, `run(action)`, token, `ProxyFix`); dejar `app.py` como entrada (`main`, `--tunel`, `port_in_use`).
  - *Cubre:* CA-04, CA-09.
  - *Hecha cuando:* `pytest tests/test_api.py` pasa sin cambiar expectativas de JSON ni códigos HTTP.

- [x] **T09** · Ejecutar `pytest` completo y corregir imports rotos en `tests/`.
  - *Cubre:* CA-08.
  - *Hecha cuando:* la suite entera pasa en local.

## Fase F · Gobernanza

- [x] **T10** · Actualizar `AGENTS.md` (§1 lectura de `ARCHITECTURE.md`, §3 árbol de carpetas, §7 fila `005-clean-architecture`).
  - *Cubre:* CA-06, CA-10.
  - *Hecha cuando:* el manual describe la estructura real post-refactor.

- [x] **T11** · Enmienda constitución **2.3** en `docs/CONSTITUTIONS.md` (referencia a `ARCHITECTURE.md`, historial §8).
  - *Cubre:* CA-07.
  - *Hecha cuando:* no hay contradicción entre constitución, ARCHITECTURE y código.

## Fase G · Cierre

- [x] **T12** · Revisión manual rápida: arrancar `python app.py`, abrir panel y alumno; confirmar mismos flujos que antes del refactor.
  - *Cubre:* CA-09.
  - *Hecha cuando:* check-in y listado funcionan en local sin sorpresas.

- [x] **T13** · Marcar spec `005` como implementada en `spec.md`, `plan.md` y tabla §7 de `AGENTS.md`.
  - *Cubre:* CA-10.
  - *Hecha cuando:* documentos de spec reflejan fase terminada e issue #239 comprobable según su «Cómo probarlo».
