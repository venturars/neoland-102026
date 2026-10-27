# Tareas 005 · Reorganizar documentos y arquitectura

> Estado: **Terminado** (2026-10-26) · Plan: [plan.md](plan.md) · Creado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Después un fichero por tarea. `static/` no se toca. Las specs `001` a `004` no se reescriben.

---

## Fase A · El test, antes de mover nada

- [x] **T01** · Crear `tests/test_architecture.py` con las siete comprobaciones del plan §2.6.
  - `asistencia/domain/` no contiene `sqlite3` ni `flask`.
  - `asistencia/storage/sqlite.py` no contiene `flask` ni las reglas de nombre, código o sesión.
  - `app.py` no contiene `sqlite3` ni `asistencia.storage`.
  - Existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`. No existen `CONSTITUTION.md` ni `AGENT.md` en la raíz.
  - `AGENTS.md` contiene `:param`, `:return` y `Usage`.
  - `ARCHITECTURE.md` nombra las tres partes y dice que no entran otras bases ni ORMs de más.
  - La constitución está en versión 3.1 y su §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-09.
  - *Hecha cuando:* `pytest tests/test_architecture.py` falla porque esos documentos y esas carpetas todavía no están.

## Fase B · Los documentos

- [x] **T02** · Mover `CONSTITUTION.md` a `docs/CONSTITUTION.md` y enmendarla a 3.1.
  - El §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/` y `app.py`. El archivo de datos sigue en `data/` y las pantallas en `static/`. El detalle apunta a `docs/ARCHITECTURE.md`.
  - No se tocan el propósito, la privacidad, P1–P6 ni lo que aportó la 3.0. El historial gana una fila con fecha 2026-10-26.
  - *Cubre:* CA-01, CA-09.
  - *Hecha cuando:* el fichero está en `docs/`, ya no está en la raíz, y la versión es 3.1.

- [x] **T03** · Crear `docs/ARCHITECTURE.md`.
  - Explica las tres partes del plan §1 y qué archivo vive en cada una.
  - Dice que no entran otras bases ni ORMs, una segunda forma de guardar, una interfaz de almacén, una entrada de línea de comandos, `.env`, pre-commit ni documentación generada.
  - *Cubre:* CA-02.
  - *Hecha cuando:* el documento está en `docs/` y dice eso.

- [x] **T04** · Renombrar `AGENT.md` a `AGENTS.md`.
  - El enlace a la constitución apunta a `docs/CONSTITUTION.md`. Se actualizan el orden de lectura y el árbol del §3.
  - Se añade la sección de escritura del plan §2.3: frase de módulo, `:param`, `:return`, `:rtype`, ejemplo `Usage::` y tipos en las funciones públicas.
  - Quien aprueba sigue siendo el usuario de esta copia.
  - *Cubre:* CA-03, CA-08.
  - *Hecha cuando:* `AGENT.md` ya no está, `AGENTS.md` tiene esos tres textos y el enlace abre la constitución en su sitio nuevo.

- [x] **T05** · En `README.md`, enlazar `docs/CONSTITUTION.md` y `AGENTS.md` en la frase de las reglas.
  - El resto del README no cambia (activar el entorno, arrancar la app y rutas `staff/<usuario>/asistenciapp` se quedan).
  - *Cubre:* CA-08.
  - *Hecha cuando:* el diff de `README.md` solo cambia esa frase.

## Fase C · Las reglas

- [x] **T06** · Mover `asistencia/codes.py` a `asistencia/domain/codes.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_codes.py` y `app.py` importan la ruta nueva. Se borra el fichero viejo.
  - *Cubre:* CA-04.
  - *Hecha cuando:* `pytest tests/test_codes.py` pasa y `domain/codes.py` no importa `sqlite3` ni `flask`.

- [x] **T07** · Mover `asistencia/names.py` a `asistencia/domain/names.py`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `tests/test_names.py` y `app.py` importan la ruta nueva. Se borra el fichero viejo.
  - *Cubre:* CA-04.
  - *Hecha cuando:* `pytest tests/test_names.py` pasa y `domain/names.py` no importa `sqlite3` ni `flask`.

- [x] **T08** · Crear `asistencia/domain/session.py` con las decisiones que hoy están en `app.py`: sesión que no existe, sesión cerrada y código no válido.
  - Cada una lanza su propio error. No importa Flask ni `sqlite3`.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el módulo existe, no importa `sqlite3` ni `flask`, y `app.py` todavía no lo necesita para que la suite siga pasando.

## Fase D · El almacén y las acciones

- [x] **T09** · Mover `asistencia/db.py` a `asistencia/storage/sqlite.py`.
  - Cada función abre y cierra la conexión. No importa Flask ni las reglas. No decide si la sesión está cerrada ni si el código vale.
  - Las funciones públicas quedan con `:param`, `:return` y `:rtype`.
  - `app.py` llama a este módulo con la ruta de la base, para que el pasar lista siga funcionando. Se borra `db.py`.
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
  - Ajustar `tests/test_personal_references.py` si hace falta por los nombres nuevos de documentos, sin volver a introducir rutas personales.
  - Actualizar la tabla de `AGENTS.md` §7: esta spec pasa a implementada.
  - Marcar esta lista como Terminada y el plan como Implementado.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - *Hecha cuando:* `pytest` termina en verde (incluida la arquitectura), y la tabla de `AGENTS.md` §7 nombra esta spec como implementada.
