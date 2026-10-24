# Tareas 005 · Reorganizar documentos y arquitectura

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Después un fichero por tarea. `static/` no se toca. Las specs `001` a `004` no se reescriben.

---

## Fase A · El test, antes de mover nada

- [x] **T01** · Crear `tests/test_architecture.py` con las siete comprobaciones del plan §2.6.
  - `asistencia/domain/` no contiene `sqlite3` ni `flask`.
  - `asistencia/storage/sqlite.py` no contiene `flask`, `clean_name`, `is_valid_code` ni `session`.
  - `app.py` no contiene `sqlite3` ni `asistencia.storage`.
  - Existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`. No existen `CONSTITUTION.md` ni `AGENT.md` en la raíz.
  - `AGENTS.md` contiene `:param`, `:return` y `Usage`.
  - `ARCHITECTURE.md` nombra las tres partes y dice que no entran PostgreSQL, SQLAlchemy ni Alembic.
  - La constitución está en versión 2.3 y su §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/`.
  - _Cubre:_ CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-09.
  - _Hecha cuando:_ `pytest tests/test_architecture.py` falla porque esos documentos y esas carpetas todavía no están.

## Fase B · Los documentos

- [x] **T02** · Mover `CONSTITUTION.md` a `docs/CONSTITUTION.md` y enmendarla a 2.3.
  - El §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/` y `app.py`. El archivo de datos sigue en `data/` y las pantallas en `static/`. El detalle apunta a `docs/ARCHITECTURE.md`.
  - No se tocan el propósito, la privacidad, P1–P6 ni las reglas de pasar lista. El historial gana una fila.
  - _Cubre:_ CA-01, CA-09.
  - _Hecha cuando:_ el fichero está en `docs/`, ya no está en la raíz, y la versión es 2.3.

- [x] **T03** · Crear `docs/ARCHITECTURE.md`.
  - Explica las tres partes del plan §1 y qué archivo vive en cada una.
  - Dice que no entran PostgreSQL, SQLAlchemy, Alembic, una segunda base, una interfaz de almacén, una entrada de línea de comandos, `.env`, pre-commit ni documentación generada.
  - _Cubre:_ CA-02.
  - _Hecha cuando:_ el documento está en `docs/` y dice eso.

- [x] **T04** · Renombrar `AGENT.md` a `AGENTS.md`.
  - El enlace a la constitución apunta a `docs/CONSTITUTION.md`. Se actualizan el orden de lectura y el árbol del §3.
  - Se añade la sección de escritura del plan §2.3: frase de módulo, `:param`, `:return`, `:rtype`, ejemplo `Usage::` y tipos en las funciones públicas.
  - _Cubre:_ CA-03, CA-08.
  - _Hecha cuando:_ `AGENT.md` ya no está, `AGENTS.md` tiene esos tres textos y el enlace abre la constitución en su sitio nuevo.

- [x] **T05** · En `README.md`, enlazar `docs/CONSTITUTION.md` y `AGENTS.md` en la frase de las reglas.
  - El resto del README no cambia.
  - _Cubre:_ CA-08.
  - _Hecha cuando:_ el diff de `README.md` solo cambia esa frase.

## Fase C · Las reglas

- [x] **T06** · Mover `asistencia/codes.py` a `asistencia/domain/codes.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_codes.py` y `app.py` importan la ruta nueva. Se borra el fichero viejo.
  - _Cubre:_ CA-04.
  - _Hecha cuando:_ `pytest tests/test_codes.py` pasa y `domain/codes.py` no importa `sqlite3` ni `flask`.

- [x] **T07** · Mover `asistencia/names.py` a `asistencia/domain/names.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_names.py` y `app.py` importan la ruta nueva. Se borra el fichero viejo.
  - _Cubre:_ CA-04.
  - _Hecha cuando:_ `pytest tests/test_names.py` pasa y `domain/names.py` no importa `sqlite3` ni `flask`.

- [x] **T08** · Crear `asistencia/domain/session.py` con las decisiones que hoy están en `app.py`: sesión que no existe, sesión cerrada y código no válido.
  - Cada una lanza su propio error. No importa Flask ni `sqlite3`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - _Cubre:_ CA-04.
  - _Hecha cuando:_ el módulo existe, no importa `sqlite3` ni `flask`, y `app.py` todavía no lo necesita para que la suite siga pasando.

## Fase D · El almacén y las acciones

- [x] **T09** · Mover `asistencia/db.py` a `asistencia/storage/sqlite.py`.
  - Cada función abre y cierra la conexión. No importa Flask, ni `codes`, ni `names`, ni `session`. No decide si la sesión está cerrada ni si el código vale.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `app.py` llama a este módulo con la ruta de la base, para que el pasar lista siga funcionando. Se borra `db.py`.
  - _Cubre:_ CA-05.
  - _Hecha cuando:_ `db.py` ya no está y `pytest tests/test_api.py` pasa.

- [x] **T10** · Crear `asistencia/usecases/attendance.py`.
  - Ahí viven abrir, cerrar, listar, exportar, quitar y registrarse. Pide la decisión a `domain/` y el guardado a `storage/`. No importa Flask.
  - Incluye `prepare`, que devuelve el token del profesor.
  - Las funciones públicas quedan con `:param`, `:return`, `:rtype` y un ejemplo `Usage::`.
  - _Cubre:_ CA-04, CA-05, CA-06.
  - _Hecha cuando:_ el módulo existe y no importa Flask. `app.py` todavía no cambia en esta tarea.

- [x] **T11** · Dejar `app.py` en HTTP.
  - Cada ruta llama a una acción de `attendance.py` y traduce el error de las reglas al mismo estado de ahora: 404, 409, 422 y 400.
  - No importa `sqlite3` ni `asistencia.storage`. Al arrancar pide `prepare`.
  - _Cubre:_ CA-06, CA-07.
  - _Hecha cuando:_ `pytest tests/test_api.py` pasa y `app.py` ya no abre la base.

## Fase E · Comprobar

- [x] **T12** · Lanzar `pytest` desde esta carpeta de la app.
  - Actualizar la tabla de `AGENTS.md` §7: esta spec pasa a implementada.
  - _Cubre:_ CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - _Hecha cuando:_ `pytest` termina en verde, `tests/test_architecture.py` también, y la tabla de `AGENTS.md` §7 nombra esta spec como implementada.
