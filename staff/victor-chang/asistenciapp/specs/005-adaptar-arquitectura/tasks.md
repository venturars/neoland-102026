# Tareas 005 · Adaptar el código a la arquitectura

> Estado: **Aprobado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- `👤` = necesita que **Victor** haga algo.
- **Regla de todas las tareas:** al acabar, `pytest` está en verde. Si una tarea cambia un test de la spec 001, la tarea dice cuál y por qué (spec 005, CA-01).
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Herramientas (plan §2.10)

- [x] **T01** · ruff y mypy:
  - Añadir `ruff` y `mypy` a `requirements.txt` e instalarlos.
  - Crear `pyproject.toml` con la configuración del plan §2.10, y la excepción de los tests (plan §5).
  - Ejecutar `ruff check` y `mypy` y **anotar aquí cuántos avisos dan** (punto de partida). No se arregla nada todavía.
  - *Cubre:* base de CA-04.
  - *Hecha cuando:* los tres comandos (`ruff format --check`, `ruff check`, `mypy`) se ejecutan, y el número de avisos está anotado.
  - **Punto de partida (2026-10-23, ruff 0.17.2, mypy 2.4.0):**
    - `ruff format --check`: 6 archivos por reformatear.
    - `ruff check`: 51 avisos. Sobre todo anotaciones de tipo que faltan (`ANN`, 29) y docstrings (`D`, 13). Además: `datetime.UTC` en vez de `timezone.utc` (`UP017`, 6), complejidad de `create_app` (`C901`), un `f-string` sin variables (`F541`) y `subprocess` en `tunnel.py` (`S603`, uso legítimo; se justificará en T17).
    - `mypy --strict`: 47 errores en 5 archivos, casi todos funciones sin anotar.
    - `pytest`: 102 en verde.
    - Se ignora `N818` (sufijo `Error` en excepciones): el plan §2.7 ya fija sus nombres.

## Fase B · Mover sin cambiar nada (plan §2.1)

- [x] **T02** · Nuevo paquete `attendance/` con sus capas, moviendo con `git mv` para conservar el historial:
  - `codes.py`, `names.py` → `domain/`;
  - `db.py` → `infra/storage.py`; `export.py`, `tunnel.py` → `infra/`;
  - `checkin.py` → `usecases/checkins.py`;
  - actualizar los imports de `app.py` y de los tests; borrar `asistencia/`.
  - *Cubre:* CA-01.
  - *Hecha cuando:* los 102 tests pasan **sin cambiar nada más que los imports**.
  - **Hecha (2026-10-23):** 102 tests en verde. Además de los imports (ya ordenados, `ruff` `I`): `db.` pasa a `storage.` y `checkin.` a `checkins.` donde se usan; en `app.py`, la variable local `checkins` pasa a `session_checkins` para no tapar el módulo `checkins`; un docstring de una línea en cada `__init__.py`; `mypy` revisa ya `attendance/`. `ruff check`: 50 avisos (antes 51).
- [x] **T03** · `port_in_use` sale de `app.py` a `infra/ports.py`; `test_port.py` pasa a `test_ports.py`.
  - *Cubre:* CA-01.
  - **Hecha (2026-10-23):** 102 tests en verde; `app.py` ya no importa `socket`.

## Fase C · Dominio (plan §2.2, §2.7)

- [x] **T04** 🧪 · `domain/errors.py`: `AppError` y `EmptyNameError`, `NameTooLongError`, `InvalidCodeError`, `SessionClosedError`, `SessionNotFoundError`, `CheckinNotFoundError`, cada una con su `MESSAGE` (plan §2.7).
  - `clean_name` lanza `EmptyNameError` / `NameTooLongError` en vez de `ValueError`, y recibe solo `str`.
  - Las excepciones de `usecases/checkins.py` pasan a importarse de `domain/errors.py`. `app.py` captura las nuevas mientras no exista la tabla de errores (T11).
  - Tests en `test_names.py` y `test_errors.py`: cada excepción tiene un mensaje en español que dice qué hacer.
  - *Cubre:* CA-05.
  - **Hecha (2026-10-23):** 115 tests en verde (los tests se vieron fallar primero).
    - Por decisión de Victor, las excepciones llevan el sufijo `Error` (`SessionClosedError`…), y `ruff` vuelve a comprobarlo (`N818`).
    - Cambia un test de la spec 001: `CLOSED` en `test_api.py` tiene el texto nuevo (plan §2.7). También cambia el mensaje de "registro inexistente".
    - `test_names.py`: se quita el test de nombres que no son texto, porque `clean_name` ya solo recibe `str` (lo comprueba `mypy`). El caso sigue cubierto en `test_api.py` y pasará a `MalformedRequestError` en T13.
    - Temporal hasta T13: `usecases/checkins.register` trata un nombre que no es texto como vacío, como hasta ahora.
    - Pendiente para T16: `alumno.js` escribe su propio aviso de clase cerrada con el texto antiguo.
- [ ] **T05** 🧪 · `domain/sessions.py`: los tipos `Session`, `SessionSummary`, `Checkin`, `CheckinResult`, `TeacherView`, `ExportFile` (plan §2.2), y las funciones puras `is_open`, `to_iso(t)` y `default_title(t, tz)`.
  - *Cubre:* base de CA-01 (spec 001 CA-02 y CA-13).
- [ ] **T06** 🧪 · `domain/codes.py`: `is_valid_code` recibe solo `str` y ya no convierte con `str()` (E1).
  - *Cubre:* base de CA-06.

## Fase D · Infraestructura y configuración (plan §2.4, §2.5)

- [ ] **T07** 🧪 · `infra/storage.py` devuelve los tipos de T05, nunca filas, y **no confirma** por su cuenta.
  - Mientras no existan los casos de uso (T09, T10), `app.py` abre la transacción con `with conn:` alrededor de cada escritura.
  - `create_app` abre su conexión de preparación con `contextlib.closing`.
  - Tests nuevos en `test_storage.py`:
    - sin `with conn:`, una escritura no queda guardada al cerrar;
    - las restricciones `UNIQUE` y `NOT NULL` se cumplen en la propia BD;
    - una BD creada con el esquema de la spec 001 se lee sin cambios (CA-02).
  - *Cubre:* CA-02.
- [ ] **T08** 🧪 · `attendance/config.py`: `Config` y `load_config(environ)` (`ASISTENCIA_DB`, `PORT`, `ASISTENCIA_TZ`).
  - Tests en `test_config.py`: valores por defecto, valores válidos, y `PORT=abc` o una zona que no existe → `ConfigError` con un mensaje que dice qué variable corregir.
  - *Cubre:* CA-03.

## Fase E · Casos de uso (plan §2.3)

- [ ] **T09** 🧪 · `usecases/sessions.py`: `create_session`, `close_session`, `find_session`, `teacher_view`, `export_attendance`.
  - Tests en `test_sessions.py`, con BD temporal y reloj falso: título por defecto, sin código en una clase cerrada, nombre del archivo exportado, clase inexistente → `SessionNotFoundError`.
  - Las rutas de `app.py` pasan a llamar a estos casos de uso.
  - *Cubre:* CA-01 (spec 001 CA-01, CA-02, CA-13, CA-14).
- [ ] **T10** 🧪 · `usecases/checkins.py`: `check_in` (todo en una transacción) y `remove_checkin` (`CheckinNotFoundError`).
  - `test_checkin.py` pasa a `test_checkins.py`; se conserva el test del orden "cerrada → nombre → código".
  - *Cubre:* CA-01 (spec 001 CA-04 a CA-09, CA-24).

## Fase F · Entrada web (plan §2.6, §2.7)

- [ ] **T11** 🧪 · `entrypoints/web/`: `create_app(config, clock, teacher_token)` en `__init__.py`, `auth.py` (X3) y `errors.py` (la tabla excepción → HTTP, y los manejadores de `404`, `405` y `500`).
  - `conftest.py` monta la app con una `Config` de prueba.
  - Tests nuevos en `test_web_errors.py`: cada excepción de la tabla responde con su código y su mensaje; `404`, `405` y `500` con su mensaje y en JSON; un error inesperado en un check-in no deja el nombre del alumno en el registro (`caplog`).
  - Cambian los tests que comparan los mensajes de `CLOSED` y de los errores genéricos (plan §2.7).
  - *Cubre:* CA-05, CA-07.
- [ ] **T12** 🧪 · `validation.py` y `serializers.py` (una función por tipo, F2, D7).
  - Tests: los serializadores no sacan nunca el secreto de una clase; `json_object` y `optional_str` rechazan lo que no es objeto o texto sin convertirlo.
  - *Cubre:* CA-06.
- [ ] **T13** 🧪 · `public.py`: rutas del alumno, sin `try/except` (E4). Sus tests pasan de `test_api.py` a `test_web_public.py`.
  - Tests nuevos (T3): `code` numérico, `name` lista, cuerpo que no es objeto → `400` y nada guardado; nombre con otros alfabetos y demasiado largo.
  - Cambia el test de entradas mal formadas: los casos de tipo equivocado pasan a esperar el mensaje de `MalformedRequestError`.
  - *Cubre:* CA-01, CA-06.
- [ ] **T14** 🧪 · `teacher.py`: rutas del profesor. Sus tests pasan de `test_api.py` a `test_web_teacher.py`, y se borra `test_api.py`.
  - Cambia `test_create_session_with_malformed_body_uses_date`: ahora espera `400` (spec P1). Se conserva el caso "sin título → fecha" (spec 001 CA-02).
  - Tests nuevos (T3) para `title`: vacío, tipo equivocado, demasiado largo.
  - *Cubre:* CA-01, CA-06.
- [ ] **T15** 🧪 · `app.py` queda solo como arranque: argumentos, `load_config(os.environ)`, puerto, túnel, `create_app`, `run`.
  - Silencia el registro de accesos (plan §2.8). Test en `test_app.py`.
  - Los errores del túnel y de la configuración se imprimen con su mensaje y la app termina.
  - *Cubre:* CA-03, CA-07.

## Fase G · Frontend (plan §2.9)

- [ ] **T16** · `alumno.js`: una única función `api()` para las dos llamadas (U3), que convierte errores y fallos de red en un mensaje.
  - *Hecha cuando:* revisado a mano en el navegador: clase inexistente, código incorrecto, clase cerrada y sin conexión muestran su mensaje; el registro normal sigue igual.
  - *Cubre:* CA-01, CA-05.

## Fase H · Estilo y tipos (plan §2.10)

- [ ] **T17** · `ruff format` y `ruff check` sin avisos.
  - Incluye los docstrings que faltan, con su rastro a la spec (S3: `spec 001 · plan §2.1 · CA-05`, y `spec 005` donde aplique).
  - *Cubre:* CA-04.
- [ ] **T18** · `mypy` (modo `strict`) sin errores.
  - *Cubre:* CA-04.

## Fase I · Verificación y cierre

- [ ] **T19** 👤 · Prueba real (Victor):
  1. Arrancar con **una copia** de `data/asistencia.db`: siguen las clases y el mismo enlace de profesor (CA-02).
  2. `python app.py` y `python app.py --tunel`: arrancan como antes (CA-03).
  3. Abrir una clase, registrarse desde el móvil, quitar un registro, cerrar y exportar: todo igual que antes (CA-01).
  4. Revisar la consola: ninguna IP ni ningún nombre de alumno (CA-07).
- [ ] **T20** · Lista de comprobación de `ARCHITECTURE.md` §13, anotada aquí punto por punto (cumple, o dónde está su excepción en el plan §5). Comprobar también que cada `# CA-xx` de la spec 001 sigue en algún test.
  - *Cubre:* CA-01, CA-04.
- [ ] **T21** · Cierre:
  - `AGENT.md`: estructura (§3), comandos de `ruff` y `mypy` (§4), definición de terminado con `ruff` y `mypy` en verde (§6) y estado (§7);
  - `README.md`: estructura, comandos nuevos y variables de entorno (`ASISTENCIA_DB`, `PORT`, `ASISTENCIA_TZ`);
  - plan 001 §5: nota de que los archivos cambiaron de sitio con la spec 005;
  - comprobar que `pytest`, `ruff check` y `mypy` pasan y que el puerto 8000 queda libre;
  - definición de terminado (`AGENT.md` §6).
  - *Cubre:* CA-03.
