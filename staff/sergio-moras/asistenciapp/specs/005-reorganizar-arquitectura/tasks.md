# Tasks 005 · Ordenar documentos y código por responsabilidades

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md)

Una tarea cada vez, en orden. Al acabarla se marca `[x]`. Después de cada tarea de código, `pytest` tiene que seguir en verde (salvo T01, que debe fallar).

---

## Fase A · Tests que marcan el objetivo

- [x] **T01 · Test de arquitectura.** Crear `tests/test_architecture.py` con las comprobaciones del plan §3: importaciones de cada pieza analizadas con `ast` y documentos en su sitio.
  - Cubre: CA-01 a CA-07, CA-10.
  - Terminada cuando: falla porque las carpetas y los documentos nuevos aún no existen.

## Fase B · Documentos

- [x] **T02 · Constitución.** `git mv CONSTITUTION.md docs/CONSTITUTION.md` y enmendar a 2.3 (plan §2.7).
  - Cubre: CA-01, CA-10.
  - Terminada cuando: está en `docs/`, la versión es 2.3, el §3 nombra las carpetas nuevas y el historial tiene la fila.

- [x] **T03 · Arquitectura.** Crear `docs/ARCHITECTURE.md` (plan §1 y §2.7).
  - Cubre: CA-02.
  - Terminada cuando: explica las cuatro piezas, quién importa a quién, qué fichero va en cada una, el árbol y lo que no se usa del ejemplo.

- [x] **T04 · Manual del agente.** `git mv AGENT.md AGENTS.md`, actualizar enlaces, orden de lectura y árbol, y añadir «Cómo se escribe el código».
  - Cubre: CA-03, CA-04.
  - Terminada cuando: `AGENT.md` no existe y `AGENTS.md` explica tipos, `:param`, `:return`, `:rtype`, `:raises` y `Usage::`.

- [x] **T05 · README.** Cambiar solo los enlaces de la frase de las reglas.
  - Cubre: CA-04.
  - Terminada cuando: enlaza `docs/CONSTITUTION.md` y `AGENTS.md`, y no cambia nada más.

## Fase C · Reglas

- [x] **T06 · `domain/codes.py` y `domain/names.py`.** Moverlos con `git mv`, documentarlos, añadir `InvalidName` y ajustar los imports de `app.py`, `test_codes.py` y `test_names.py`.
  - Cubre: CA-05.
  - Terminada cuando: la suite pasa y los ficheros viejos no existen.

- [x] **T07 · `domain/rules.py` y su test.** Crear los errores y las funciones que los lanzan, y `tests/test_rules.py`.
  - Cubre: CA-05.
  - Terminada cuando: `test_rules.py` pasa sin app ni base de datos.

## Fase D · Infraestructura

- [x] **T08 · `infra/`.** Mover `db.py` → `infra/sqlite_store.py` (con `open_db`), `export.py` → `infra/csv_export.py` y `tunnel.py` → `infra/tunnel.py`. Documentarlos y ajustar imports de `app.py`, `test_export.py` y `test_tunnel.py`.
  - Cubre: CA-06.
  - Terminada cuando: la suite pasa y los ficheros viejos no existen.
  - Nota: al pasar de `connect` a `open_db`, `app.py` dejó de arrancar hasta T10; en T08 se comprobaron solo los tests de los módulos (40 en verde) y la suite completa volvió a verde en T10.

## Fase E · Casos de uso y app

- [x] **T09 · `use_cases/teacher.py` y `use_cases/student.py`.** Pasar ahí la lógica de cada ruta, usando `rules`, `names`, `codes` y `sqlite_store`, con una conexión por acción y el instante `t` como parámetro.
  - Cubre: CA-05, CA-06, CA-07.
  - Terminada cuando: los módulos existen, están documentados y no importan Flask.

- [x] **T10 · `app.py` solo HTTP.** Cada ruta llama a un caso de uso y traduce los errores con la tabla del plan §2.5. Se quitan `flask.g`, `sqlite3` y el acceso directo a la base.
  - Cubre: CA-07, CA-08.
  - Terminada cuando: `test_api.py` pasa sin modificarlo y `test_architecture.py` pasa entero.

## Fase F · Verificar

- [x] **T11 · Suite completa.** Lanzar `pytest`.
  - Cubre: CA-01 a CA-08, CA-10.
  - Terminada cuando: todo en verde.

- [x] **T12 · Demo de hack ético.** Arrancar la app en local, abrir una clase y lanzar `asistencia/hack-etico.sh` con un rango corto de códigos. Después parar la app y comprobar que el puerto queda libre.
  - Cubre: CA-09.
  - Terminada cuando: el script hace sus peticiones y la app responde como antes.

- [x] **T13 · Tabla de estado.** Añadir la spec 005 a `AGENTS.md` §7.
  - Terminada cuando: aparece como implementada.
