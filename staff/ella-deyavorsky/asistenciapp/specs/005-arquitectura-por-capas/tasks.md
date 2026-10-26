# Tareas 005 · Documentación en `docs/` y código por capas

> Estado: **Terminado v1.4 (2026-10-26)** · Plan: [plan.md](plan.md) v1.3 · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test y luego el código. Se mueve con `git mv` para conservar el historial.
- Tras cada tarea de código, `pytest` en verde. Las specs 001–004 y `docs/CONSTITUTION.md` no se editan.
- No se hace commit de nada de `staff/ella-deyavorsky/first-app/`.

---

## Fase A · El test primero

- [x] **T01** · Crear `tests/test_architecture.py` con dos grupos:
  1. *Imports*: lee con `ast` los `import` de cada `.py` de `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/` y comprueba la tabla del plan §2.2 (`domain` solo biblioteca estándar; `usecases` solo `domain`; `storage` solo `domain` y biblioteca estándar). Falla si falta alguna de las tres carpetas.
  2. *Documentos*: existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`; no existen `CONSTITUTION.md` ni `AGENT.md` en la raíz; `AGENTS.md` contiene `:param`, `:return` y `Usage`.
  - *Cubre:* CA-09, CA-13.
  - *Hecha cuando:* `pytest tests/test_architecture.py` falla porque las carpetas y los documentos aún no existen.

## Fase B · Documentación

- [x] **T02** · Crear `docs/` y mover la constitución con `git mv CONSTITUTION.md docs/CONSTITUTION.md`, sin editarla (sigue en 2.2).
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* `git diff -M` la muestra como renombrada al 100 %.
- [x] **T03** · Renombrar con `git mv AGENT.md AGENTS.md`. Actualizar sus rutas a `docs/CONSTITUTION.md` y `docs/ARCHITECTURE.md`, el título y el árbol de carpetas del §3, y añadir la fila de la spec 005 en el §7.
  - *Cubre:* CA-06, CA-08.
  - *Hecha cuando:* no queda `AGENT.md`; `AGENTS.md` no menciona rutas viejas.
- [x] **T04** · Escribir `docs/ARCHITECTURE.md` (en español): las tres partes y su contenido, el borde `app.py`, tabla de dependencias permitidas, dónde va cada cosa que la app hace hoy (plan §2.3, con las decisiones de sesión en `domain/session.py` y `export.py`/`tunnel.py` donde están), qué se dejó fuera del ejemplo y por qué (P2, P3), y cómo añadir una funcionalidad nueva.
  - *Cubre:* CA-03, CA-04, CA-05.
  - *Hecha cuando:* cada fila de la tabla del plan §2.3 está en el documento y no pide ninguna herramienta nueva.
- [x] **T05** · Añadir a `AGENTS.md` la sección «Normas de escritura del código» (plan §2.4): frase de módulo, `:param`, `:return`, `:rtype`, `:raises`, ejemplo `Usage::` y tipos en las funciones públicas, más el ejemplo `check_open`.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la sección existe, contiene `:param`, `:return` y `Usage`, y el flujo SDD sigue intacto.
- [x] **T06** · En `README.md`, apuntar a `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`.
  - *Cubre:* CA-08, CA-12.
  - *Hecha cuando:* búsqueda de `AGENT.md` y de `](CONSTITUTION.md)` en README y `AGENTS.md`: vacía. Los comandos del README no cambian. El grupo *Documentos* de `test_architecture.py` pasa en verde.

## Fase C · Código por capas

- [x] **T07** · Dominio: `git mv` de `codes.py` y `names.py` a `asistencia/domain/`; crear `asistencia/domain/session.py` con las decisiones «sesión no existe», «sesión cerrada» y «código no válido», y los errores `SessionNotFound`, `SessionClosed`, `InvalidCode` y `CheckinNotFound` con los mensajes actuales. Con docstrings según las normas. Actualizar imports en `test_codes.py` y `test_names.py`.
  - *Cubre:* CA-05, CA-09, CA-10.
  - *Hecha cuando:* `pytest tests/test_codes.py tests/test_names.py` en verde.
- [x] **T08** · Almacenamiento: `git mv asistencia/db.py asistencia/storage/sqlite.py`. Funciones y esquema sin cambios. Actualizar el import en `app.py`. `export.py` y `tunnel.py` no se mueven.
  - *Cubre:* CA-09, CA-10.
  - *Hecha cuando:* `pytest` completo en verde.
- [x] **T09** · Acciones: crear `asistencia/usecases/attendance.py` (crear sesión, ver sesión pública, registrar asistencia, listar, ver detalle del profesor, cerrar, borrar registro, listar registros para exportar). Reciben el almacenamiento y el reloj; usan las decisiones y lanzan los errores del dominio; no importan Flask ni `sqlite3`.
  - *Cubre:* CA-05, CA-09, CA-11.
  - *Hecha cuando:* el módulo se importa sin Flask ni `sqlite3`.
- [x] **T10** · Borde HTTP: adelgazar `app.py`: las rutas llaman a las acciones y traducen los errores del dominio a 404/409/422/400 con el mismo JSON; se mantienen token, `ProxyFix`, `create_app` (misma firma), `main` y `port_in_use`.
  - *Cubre:* CA-09, CA-10, CA-11.
  - *Hecha cuando:* `pytest` completo en verde, incluidos `test_api.py` y `test_port.py` sin cambiar lo que comprueban, y `test_architecture.py` en verde (imports y documentos).

## Fase D · Cierre

- [x] **T11** · Verificación manual (CA-11, CA-12): preparar el entorno con los comandos del README, `python app.py`, crear una clase, registrar a un alumno con el código, cerrar y exportar. Parar el servidor y comprobar con `lsof -nP -iTCP:8000 -sTCP:LISTEN` que el puerto queda libre.
  - *Cubre:* CA-11, CA-12.
- [x] **T12** · Repaso final: `pytest` completo, búsqueda del nombre ajeno (test de referencias), tabla §7 de `AGENTS.md` y estados de spec, plan y tasks a «Implementada / Terminado».
  - *Cubre:* CA-01…CA-13.
- [x] **T13** · Almacenamiento autónomo: cada función de `storage/sqlite.py` recibe `db_path` y abre y cierra su conexión; sin imports del proyecto. Ajustar `usecases/attendance.py`, `app.py` y `test_architecture.py`.
  - *Cubre:* CA-14, CA-15, CA-13.
  - *Hecha cuando:* `pytest` y doctest en verde y `app.py` sin gestión de conexiones.

- [x] **T14** · Test primero: en `tests/test_architecture.py`, cambiar la tabla de `usecases` a `domain` y `storage`, y añadir una comprobación que falle si `app.py` importa `asistencia.storage` o `sqlite3`.
  - *Cubre:* CA-16, CA-13.
  - *Hecha cuando:* `pytest tests/test_architecture.py` falla solo por la comprobación nueva (hoy `app.py` importa `storage`).
- [x] **T15** · Acción `prepare` y `app.py` sin almacenamiento:
  - En `usecases/attendance.py`: importar `storage` dentro de la acción (sin parámetro `repo`); todas las acciones pasan a `(db_path, …)`; añadir `prepare(db_path) -> str` (crea el esquema y devuelve el token del profesor) con `:param`, `:return`, `:rtype` y `Usage::`.
  - En `app.py`: quitar `from asistencia.storage …`; `create_app` llama a `attendance.prepare(db_path)` (el token recibido, si lo hay, manda) y pasa `db_path` a las acciones.
  - En `docs/ARCHITECTURE.md`: quitar `storage` de lo que puede importar `app.py` y añadirlo a `usecases`. Actualizar el árbol de `AGENTS.md` si lo menciona.
  - *Cubre:* CA-09, CA-16.
  - *Hecha cuando:* `pytest` completo en verde, doctest de `usecases` en verde y `grep -n "storage\|sqlite3" app.py` vacío.
- [x] **T16** · Verificación manual (CA-11): `python app.py`, crear una clase, registrar a un alumno, cerrar y exportar. Parar el servidor y comprobar con `lsof -nP -iTCP:8000 -sTCP:LISTEN` que el puerto queda libre. Estados de spec, plan y tasks a «Implementada / Terminado».
  - *Cubre:* CA-11, CA-16.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial (cuatro capas) | Plan 1.0 |
| 1.1 | 2026-10-26 | Tres partes; sin tareas de `web/` ni `infrastructure/`; `export.py` y `tunnel.py` no se mueven; T01 incluye documentos; T07 crea `session.py` | Plan 1.1. Aprobado |
| 1.2 | 2026-10-26 | Tareas T01–T12 hechas: 93 tests en verde, verificación manual con `curl` y puerto 8000 libre | Cierre |
| 1.3 | 2026-10-26 | T13: `storage/sqlite.py` abre y cierra su conexión en cada función (CA-14, CA-15); `usecases` y `app.py` pasan `db_path`; `test_architecture.py` exige que `storage` no importe nada del proyecto. 93 tests y doctest en verde | Spec y plan 1.2 |
| 1.4 | 2026-10-26 | Cabecera corregida (plan v1.3, spec v1.3); T14–T16: test de que `app.py` no importa `storage`, acción `prepare`, verificación | Spec y plan 1.3. Aprobado |
| 1.5 | 2026-10-26 | T14–T16 hechas: 95 tests y doctest en verde, `app.py` sin `storage` ni `sqlite3`, verificación manual y puerto 8000 libre | Cierre |
