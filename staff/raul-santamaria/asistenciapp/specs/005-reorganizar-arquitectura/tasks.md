# Tareas 005 · Reorganizar documentos y arquitectura

> Estado: **Borrador** · Plan: [plan.md](plan.md) · Creado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Después un fichero por tarea. `static/` no se toca. Las specs `001` a `004` no se reescriben.

---

## Fase A · El test, antes de mover nada

- [x] **T01** · Crear `tests/test_architecture.py` con las siete comprobaciones del plan §2.6.
  - `asistencia/domain/` no contiene `sqlite3` ni `flask`.
  - `asistencia/storage/sqlite.py` no contiene `flask`, `clean_name`, `is_valid_code` ni `session` de las reglas.
  - `app.py` no contiene `sqlite3` ni `asistencia.storage`.
  - Existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`. No existen `CONSTITUTION.md` ni `AGENT.md` en la raíz.
  - `AGENTS.md` contiene `:param`, `:return` y `Usage`.
  - `ARCHITECTURE.md` nombra las tres partes y dice que no entran PostgreSQL, SQLAlchemy ni Alembic.
  - La constitución está en versión 2.4 y su §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-09.
  - *Hecha cuando:* `pytest tests/test_architecture.py` falla porque faltan `ARCHITECTURE.md`, `AGENTS.md` y las carpetas nuevas.

## Fase B · Los documentos

- [x] **T02** · Enmendar `docs/CONSTITUTION.md` a 2.4.
  - El §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/` y `app.py`. El archivo de datos sigue en `data/` y las pantallas en `static/`. El detalle apunta a `docs/ARCHITECTURE.md`.
  - No se tocan el propósito, la privacidad, P1–P6 ni las reglas de pasar lista. El historial gana una fila. No se mueve el fichero (ya está en `docs/`).
  - *Cubre:* CA-01, CA-09.
  - *Hecha cuando:* la versión es 2.4, el fichero sigue en `docs/` y no hay `CONSTITUTION.md` en la raíz.

- [x] **T03** · Crear `docs/ARCHITECTURE.md`.
  - Explica las tres partes del plan §1 y qué archivo vive en cada una **en esta app**.
  - Dice que no entran PostgreSQL, SQLAlchemy, Alembic, una segunda base, una interfaz de almacén, una entrada de línea de comandos, `.env`, pre-commit ni documentación generada.
  - *Cubre:* CA-02.
  - *Hecha cuando:* el documento está en `docs/` y dice eso.

- [x] **T04** · Renombrar `AGENT.md` a `AGENTS.md`.
  - Actualizar título, orden de lectura (incluye `docs/ARCHITECTURE.md`) y árbol del §3.
  - Conservar la sección de escritura (§8) con `:param`, `:return`, `:rtype` y `Usage::`; actualizar ejemplos de importación a `domain/` cuando toque.
  - En `tests/test_personal_references.py`, la clave de frases conservadas pasa de `AGENT.md` a `AGENTS.md`.
  - *Cubre:* CA-03, CA-08.
  - *Hecha cuando:* `AGENT.md` ya no está, `AGENTS.md` tiene esos textos y el test de referencias personales sigue apuntando al manual.

- [x] **T05** · En `README.md`, enlazar `AGENTS.md` en la frase de las reglas (la constitución ya apunta a `docs/CONSTITUTION.md`).
  - El resto del README no cambia.
  - *Cubre:* CA-08.
  - *Hecha cuando:* el diff de `README.md` solo cambia ese enlace del manual.

## Fase C · Las reglas

- [x] **T06** · Mover `asistencia/codes.py` a `asistencia/domain/codes.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_codes.py` y quien importe hoy `asistencia.codes` pasan a la ruta nueva. Se borra el fichero viejo.
  - *Cubre:* CA-04.
  - *Hecha cuando:* `pytest tests/test_codes.py` pasa y `domain/codes.py` no importa `sqlite3` ni `flask`.

- [x] **T07** · Mover `asistencia/names.py` a `asistencia/domain/names.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_names.py` y quien importe hoy `asistencia.names` pasan a la ruta nueva. Se borra el fichero viejo.
  - *Cubre:* CA-04.
  - *Hecha cuando:* `pytest tests/test_names.py` pasa y `domain/names.py` no importa `sqlite3` ni `flask`.

- [x] **T08** · Crear `asistencia/domain/session.py` con las decisiones que hoy están en `app.py`: sesión que no existe, sesión cerrada y código no válido.
  - Cada una lanza su propio error. No importa Flask ni `sqlite3`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el módulo existe, no importa `sqlite3` ni `flask`, y `app.py` todavía no lo necesita para que la suite siga pasando.

## Fase D · El almacén y las acciones

- [x] **T09** · Mover `asistencia/db.py` a `asistencia/storage/sqlite.py`.
  - No importa Flask, ni `codes`, ni `names`, ni `session`. No decide si la sesión está cerrada ni si el código vale.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `app.py` (o la acción, cuando exista) sigue pudiendo guardar para que el pasar lista no se rompa a mitad. Se borra `db.py`.
  - *Cubre:* CA-05.
  - *Hecha cuando:* `db.py` ya no está y `pytest tests/test_api.py` pasa.

- [x] **T10** · Crear `asistencia/usecases/attendance.py`.
  - Ahí viven abrir, cerrar, listar, exportar, quitar y registrarse. Pide la decisión a `domain/` y el guardado a `storage/`. No importa Flask.
  - Incluye `prepare`, que devuelve el token del profesor.
  - Las funciones públicas quedan con `:param`, `:return`, `:rtype` y un ejemplo `Usage::`.
  - *Cubre:* CA-04, CA-05, CA-06.
  - *Hecha cuando:* el módulo existe y no importa Flask. `app.py` todavía no cambia en esta tarea.

- [x] **T11** · Dejar `app.py` en HTTP.
  - Cada ruta llama a una acción de `attendance.py` y traduce el error de las reglas al mismo estado de ahora: 404, 409, 422 y 400.
  - No importa `sqlite3` ni `asistencia.storage`. Al arrancar pide `prepare`.
  - *Cubre:* CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_api.py` pasa y `app.py` ya no abre la base.

## Fase E · Comprobar

- [x] **T12** · Lanzar `pytest` desde esta carpeta de la app.
  - Actualizar la tabla de `AGENTS.md` §7: esta spec pasa a implementada.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - *Hecha cuando:* `pytest` termina en verde, `tests/test_architecture.py` también, y la tabla de `AGENTS.md` §7 nombra esta spec como implementada.
