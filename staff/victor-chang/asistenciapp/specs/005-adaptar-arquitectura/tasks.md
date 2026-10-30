# Tareas 005 · Adaptar el código a la arquitectura

> Estado: **Terminado** (2026-10-23): 21 de 21 tareas · Plan: [plan.md](plan.md) · Creado: 2026-10-23

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
- [x] **T05** 🧪 · `domain/sessions.py`: los tipos `Session`, `SessionSummary`, `Checkin`, `CheckinResult`, `TeacherView`, `ExportFile` (plan §2.2), y las funciones puras `is_open`, `to_iso(t)` y `default_title(t, tz)`.
  - *Cubre:* base de CA-01 (spec 001 CA-02 y CA-13).
  - **Hecha (2026-10-23):** 121 tests en verde; `domain/` pasa `ruff` y `mypy --strict` sin avisos.
    - `is_open` es una propiedad de `Session`, no una función suelta.
    - `TeacherView.checkins` es una tupla y no una lista, para que el tipo sea inmutable de verdad (`frozen`).
    - Los tests van en `tests/test_domain_sessions.py`: `test_sessions.py` queda para los casos de uso (plan §2.11), porque los dos módulos se llaman `sessions`.
    - `app.py` ya usa `to_iso` y `default_title` en lugar de calcular las fechas por su cuenta (el título sigue en la zona del sistema hasta que `create_app` reciba la `Config`, en T11).
- [x] **T06** 🧪 · `domain/codes.py`: `is_valid_code` recibe solo `str` y ya no convierte con `str()` (E1).
  - *Cubre:* base de CA-06.
  - **Hecha (2026-10-23):** 122 tests en verde. El test nuevo (`test_checkin.py`) falló primero: un `1234` numérico se aceptaba como el código `"1234"`.
    - Desde ahora un código numérico responde `422` (código no válido) en vez de registrar al alumno. En T13 pasa a `400` (`MalformedRequestError`).
    - Temporal hasta T13: `usecases/checkins.register` trata un código que no es texto como no válido.

## Fase D · Infraestructura y configuración (plan §2.4, §2.5)

- [x] **T07** 🧪 · `infra/storage.py` devuelve los tipos de T05, nunca filas, y **no confirma** por su cuenta.
  - Mientras no existan los casos de uso (T09, T10), `app.py` abre la transacción con `with conn:` alrededor de cada escritura.
  - `create_app` abre su conexión de preparación con `contextlib.closing`.
  - Tests nuevos en `test_storage.py`:
    - sin `with conn:`, una escritura no queda guardada al cerrar;
    - las restricciones `UNIQUE` y `NOT NULL` se cumplen en la propia BD;
    - una BD creada con el esquema de la spec 001 se lee sin cambios (CA-02).
  - *Cubre:* CA-02.
  - **Hecha (2026-10-23):** 129 tests en verde (los nuevos fallaron primero). `storage.py`, `export.py` y `usecases/` pasan `ruff` y `mypy --strict`.
    - `to_csv` y `usecases/checkins.register` reciben y devuelven los tipos del dominio; `test_checkin.py` y `test_export.py` se adaptan a ellos (mismas comprobaciones).
    - `create_session` ya no vuelve a leer la clase de la BD: devuelve la `Session` que acaba de crear.
    - El check-in sigue respondiendo **sin** `id`, como hasta ahora: `checkin_json(..., with_id=False)` (T12 lo pasa a su serializador).
    - Comprobación extra de CA-02: una **copia** de `data/asistencia.db` (5 clases, 17 registros, token de profesor) se lee entera con el código nuevo; el original no se toca.
- [x] **T08** 🧪 · `attendance/config.py`: `Config` y `load_config(environ)` (`ASISTENCIA_DB`, `PORT`, `ASISTENCIA_TZ`).
  - Tests en `test_config.py`: valores por defecto, valores válidos, y `PORT=abc` o una zona que no existe → `ConfigError` con un mensaje que dice qué variable corregir.
  - *Cubre:* CA-03.
  - **Hecha (2026-10-23):** 143 tests en verde (fallaron primero); `config.py` pasa `ruff` y `mypy --strict`.
    - Un valor vacío cuenta como no puesto. `PORT` solo admite cifras ASCII entre 1 y 65535 (E1).
    - Errores con nombre: `InvalidPortError` e `InvalidTimezoneError`, hijos de `ConfigError` (y este de `AppError`), cada uno con su mensaje.
    - Aún no se usa: `app.py` la leerá en T15 y `create_app` la recibirá en T11. Hasta entonces el título por defecto sigue en la zona del sistema (nota de T05).

## Fase E · Casos de uso (plan §2.3)

- [x] **T09** 🧪 · `usecases/sessions.py`: `create_session`, `close_session`, `find_session`, `teacher_view`, `export_attendance`.
  - Tests en `test_sessions.py`, con BD temporal y reloj falso: título por defecto, sin código en una clase cerrada, nombre del archivo exportado, clase inexistente → `SessionNotFoundError`.
  - Las rutas de `app.py` pasan a llamar a estos casos de uso.
  - *Cubre:* CA-01 (spec 001 CA-01, CA-02, CA-13, CA-14).
  - **Hecha (2026-10-23):** 155 tests en verde (fallaron primero); `attendance/` pasa `mypy --strict` salvo `tunnel.py` (T18).
    - Los casos de uso reciben la hora como `t` (segundos Unix) en vez del reloj: quien llama lo lee una sola vez por petición, así todo lo de una petición usa la misma hora (M5).
    - El id y el secreto de cada clase los genera `create_session` con `secrets` (X1); `storage.create_session` solo los guarda.
    - Las rutas de abrir, cerrar, ver y exportar ya llaman a los casos de uso y no deciden nada. Desaparece `session_or_404`.
    - Temporal hasta T14: un título que no es texto se sigue tratando como vacío. Hasta T11: el título y el CSV usan la zona del sistema.
    - `test_storage.py` y `test_checkin.py` crean las clases con el id y el secreto nuevos.
- [x] **T10** 🧪 · `usecases/checkins.py`: `check_in` (todo en una transacción) y `remove_checkin` (`CheckinNotFoundError`).
  - `test_checkin.py` pasa a `test_checkins.py`; se conserva el test del orden "cerrada → nombre → código".
  - *Cubre:* CA-01 (spec 001 CA-04 a CA-09, CA-24).
  - **Hecha (2026-10-23):** 162 tests en verde (los nuevos fallaron primero).
    - `check_in(conn, session_id, name, code, t)` busca la clase por su id (antes la ruta le pasaba la clase ya leída) y calcula la hora del registro con `to_iso(t)`.
    - `register` pasa a llamarse `check_in`, como en el plan. `remove_checkin` lanza `CheckinNotFoundError`.
    - Tests nuevos: el registro queda guardado (transacción confirmada), un registro rechazado no guarda nada, clase inexistente, quitar de otra clase, y volver a registrarse tras ser quitado (CA-26).
    - `app.py` ya no abre ninguna transacción. Un test de la spec 001 (`test_unknown_session`) detectó que el `except AppError` temporal de la ruta convertía "clase inexistente" en `400`; se limitó a los dos errores de nombre.

## Fase F · Entrada web (plan §2.6, §2.7)

- [x] **T11** 🧪 · `entrypoints/web/`: `create_app(config, clock, teacher_token)` en `__init__.py`, `auth.py` (X3) y `errors.py` (la tabla excepción → HTTP, y los manejadores de `404`, `405` y `500`).
  - `conftest.py` monta la app con una `Config` de prueba.
  - Tests nuevos en `test_web_errors.py`: cada excepción de la tabla responde con su código y su mensaje; `404`, `405` y `500` con su mensaje y en JSON; un error inesperado en un check-in no deja el nombre del alumno en el registro (`caplog`).
  - Cambian los tests que comparan los mensajes de `CLOSED` y de los errores genéricos (plan §2.7).
  - *Cubre:* CA-05, CA-07.
  - **Hecha (2026-10-23):** 176 tests en verde (los nuevos fallaron primero). `attendance/` pasa `ruff` y `mypy --strict` salvo `tunnel.py` (T17, T18): `ruff` baja de 41 a 3 avisos y `mypy` de 34 a 3.
    - Además de lo previsto: las rutas ya viven en `public.py` y `teacher.py` (*blueprints*), tal cual estaban pero sin `try/except`. T13 y T14 les añaden la validación, los serializadores y el traslado de sus tests.
    - `context.py` (nuevo, no estaba en el plan): guarda la `Config`, el reloj, el token y la conexión de cada petición, para que las rutas no dependan de variables globales (M5).
    - Las excepciones de la entrada web (`MalformedRequestError`, `TeacherUnauthorizedError`) viven en `entrypoints/web/errors.py`, junto a la tabla. Un test comprueba que la tabla no deja ningún error sin código.
    - `serializers.py` y `validation.py` ya existen con lo que había en `app.py`; T12 los completa.
    - `app.py` ya usa `load_config` y la nueva `create_app` (adelanta parte de T15). Ya usan la zona de `ASISTENCIA_TZ`: el título por defecto y el CSV.
    - No cambia ningún test de la spec 001: `test_api.py` solo comprobaba que hubiera un mensaje de error, y sigue en verde.
    - Prueba real: servidor arrancado con una copia de la BD en el puerto 8765; responde la página, la lista (5 clases), el `401` y el `404` con sus mensajes nuevos. Parado y puerto libre.
- [x] **T12** 🧪 · `validation.py` y `serializers.py` (una función por tipo, F2, D7).
  - Tests: los serializadores no sacan nunca el secreto de una clase; `json_object` y `optional_str` rechazan lo que no es objeto o texto sin convertirlo.
  - *Cubre:* CA-06.
  - **Hecha (2026-10-23):** 202 tests en verde (los nuevos fallaron primero), en `test_web_serializers.py` y `test_web_validation.py` (un archivo por módulo, T6).
    - Un serializador por respuesta: `checkin_json`, `check_in_result_json`, `public_session_json`, `created_session_json`, `session_summary_json`, `teacher_view_json`. Fijan **la forma exacta** del JSON de hoy, y un test comprueba que el secreto no sale en ninguno.
    - Las rutas ya los usan: no queda ningún JSON montado a mano en ellas (F2). Las respuestas no cambian (siguen en verde los tests de la spec 001).
    - `json_object`: sin cuerpo → objeto vacío (para abrir una clase sin título, spec 001 CA-02); un cuerpo que no es un objeto JSON, JSON roto o un formulario → `MalformedRequestError`. `optional_str`: campo ausente → `""`; presente y no texto (incluido `null`) → `MalformedRequestError`.
    - Las rutas aún leen con el `json_body` antiguo: pasan a `json_object` y `optional_str` en T13 y T14, que es donde cambia el comportamiento.
- [x] **T13** 🧪 · `public.py`: rutas del alumno, sin `try/except` (E4). Sus tests pasan de `test_api.py` a `test_web_public.py`.
  - Tests nuevos (T3): `code` numérico, `name` lista, cuerpo que no es objeto → `400` y nada guardado; nombre con otros alfabetos y demasiado largo.
  - Cambia el test de entradas mal formadas: los casos de tipo equivocado pasan a esperar el mensaje de `MalformedRequestError`.
  - *Cubre:* CA-01, CA-06.
  - **Hecha (2026-10-23):** 212 tests en verde (los 9 nuevos fallaron primero).
    - `public.py` lee con `json_object` y `optional_str`; `usecases/checkins.check_in` recibe ya `str` y pierde los arreglos temporales de T04 y T06.
    - Los tests del alumno pasan **sin cambios** a `test_web_public.py`; las ayudas comunes (`open_session`, `current_code`, `check_in`) a `tests/web_helpers.py`.
    - Cambia el test de entradas mal formadas de la spec 001, como preveía el plan §2.6: nombre que no es texto, cuerpo que no es objeto y JSON roto → `400` con el mensaje de `MalformedRequestError`; se añaden código numérico, `null` y lista. Los dígitos de otros alfabetos y `12é4` siguen siendo `422` (código no válido).
    - Tests nuevos (T3): sin cuerpo → "Escribe tu nombre."; nombres en cirílico, chino, árabe y con tildes; el límite de 60 cuenta caracteres, no bytes; un cuerpo mal formado en una clase cerrada da `400` (la forma se comprueba primero).
    - El test de código numérico pasa del caso de uso a la ruta, que es donde ahora se rechaza; en el caso de uso ya no aplica porque recibe `str` (lo comprueba `mypy`).
- [x] **T14** 🧪 · `teacher.py`: rutas del profesor. Sus tests pasan de `test_api.py` a `test_web_teacher.py`, y se borra `test_api.py`.
  - Cambia `test_create_session_with_malformed_body_uses_date`: ahora espera `400` (spec P1). Se conserva el caso "sin título → fecha" (spec 001 CA-02).
  - Tests nuevos (T3) para `title`: vacío, tipo equivocado, otros alfabetos y demasiado largo.
  - **Límite de 20 caracteres** (spec CA-08, añadido el 2026-10-23): `TitleTooLongError` en el dominio, `MAX_TITLE_LENGTH` en `domain/sessions.py`, y el campo de `profesor.html` con `maxlength="20"`.
  - *Cubre:* CA-01, CA-06, CA-08.
  - **Hecha (2026-10-23):** 229 tests en verde (los nuevos fallaron primero). Ya no queda ningún arreglo temporal en `attendance/`.
    - `teacher.py` lee con `json_object` y `optional_str`; desaparece `json_body`.
    - Límite del título (CA-08, nuevo en spec v1.1): `clean_title` y `MAX_TITLE_LENGTH = 20` en el dominio, `TitleTooLongError` (`400`) en la tabla de errores, y `maxlength="20"` en `profesor.html`. Las 5 clases guardadas miden 16 caracteres o menos (comprobado en solo lectura), y la fecha por defecto siempre mide 16.
    - Los tests del profesor pasan **sin cambios** a `test_web_teacher.py`, y se borra `test_api.py`.
    - Cambia `test_create_session_with_malformed_body_uses_date` (spec P1): ahora espera `400` con el mensaje de `MalformedRequestError` y que no se abra ninguna clase; se añaden `null`, JSON roto y un texto suelto. Se conserva "sin cuerpo o sin título → fecha".
    - Dos tests de `test_api.py` no se mueven porque ya los cubre, con más comprobaciones, `test_web_errors.py`: `test_unknown_api_route_is_404_json` y `test_unexpected_error_is_json_500`.
- [x] **T15** 🧪 · `app.py` queda solo como arranque: argumentos, `load_config(os.environ)`, puerto, túnel, `create_app`, `run`.
  - Silencia el registro de accesos (plan §2.8). Test en `test_app.py`.
  - Los errores del túnel y de la configuración se imprimen con su mensaje y la app termina.
  - *Cubre:* CA-03, CA-07.
  - **Hecha (2026-10-23):** 235 tests en verde; `app.py` pasa `ruff` y `mypy --strict`.
    - `main()` queda en 15 líneas y llama a funciones cortas (M2): argumentos, configuración, puerto, túnel y enlaces.
    - `configure_logging()`: registros de la app por consola y el de werkzeug solo con avisos. El test de CA-07 se vio fallar primero; los otros cinco de `test_app.py` describen lo que `main()` ya hacía (configuración mala, puerto ocupado, error del túnel, enlace del túnel y cierre del túnel al parar), para poder reorganizarlo sin riesgo.
    - Prueba real con una copia de la BD en el puerto 8765: abrir clase, registrar a "Zoe Prueba" y rechazar un título de 25 caracteres. La consola solo muestra el enlace del panel y dos líneas de Flask: ninguna IP ni ningún nombre. Parado y puerto libre.

## Fase G · Frontend (plan §2.9)

- [x] **T16** · `alumno.js`: una única función `api()` para las dos llamadas (U3), que convierte errores y fallos de red en un mensaje.
  - *Hecha cuando:* revisado a mano en el navegador: clase inexistente, código incorrecto, clase cerrada y sin conexión muestran su mensaje; el registro normal sigue igual.
  - *Cubre:* CA-01, CA-05.
  - **Hecha (2026-10-23):**
    - `api(path, options)` es la única llamada a `fetch`: envía y lee JSON y devuelve `{ status, ok, data }`. Sin conexión lanza "No se pudo conectar…", y si la respuesta no es JSON, el mensaje genérico de `AppError`.
    - El aviso de clase cerrada al abrir la página usa el texto nuevo de `SessionClosedError` (constante `CLOSED`, con un comentario que apunta a `errors.py`).
    - Revisado en Chrome contra un servidor con una BD de prueba nueva (no la de Victor):
      1. clase inexistente → "Clase no encontrada" y "Esta clase no existe. Revisa el enlace.";
      2. clase cerrada → el texto nuevo de clase cerrada, sin formulario;
      3. código incorrecto → "El código no es válido o ha caducado…", con el formulario a la vista;
      4. registro normal → "¡Listo, Ana Prueba! Registrado a las 12:57." y el formulario se oculta;
      5. servidor parado → "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.", y el botón vuelve a estar activo.
    - Servidor parado al terminar; puerto 8765 libre.

## Fase H · Estilo y tipos (plan §2.10)

- [x] **T17** · `ruff format` y `ruff check` sin avisos.
  - Incluye los docstrings que faltan, con su rastro a la spec (S3: `spec 001 · plan §2.1 · CA-05`, y `spec 005` donde aplique).
  - *Cubre:* CA-04.
- [x] **T18** · `mypy` (modo `strict`) sin errores.
  - *Cubre:* CA-04.
  - **Hechas T17 y T18 (2026-10-23):** `ruff check` sin avisos (antes 51), `ruff format` sin cambios pendientes (antes 6 archivos), `mypy --strict` sin errores en 25 archivos (antes 47), y 240 tests en verde.
    - Casi todo se resolvió al reescribir cada pieza en T02–T16. Lo que quedaba era `tunnel.py`, dos detalles de `test_web_teacher.py`, `datetime.UTC` en `test_export.py`, el formato de `codes.py` y un bloque de Python en el plan 005.
    - `tunnel.py` sigue E3 como el resto: `TunnelError` hereda de `AppError`, con tres errores con nombre y mensaje fijo (`CloudflaredMissingError`, `TunnelTimeoutError`, `TunnelExitedError`). Lleva tipos, y el aviso `S603` de `subprocess` queda justificado en el código: ejecutable de `shutil.which`, argumentos fijos y sin shell.
    - Tests nuevos del túnel: cloudflared no instalado, y un cloudflared que no dice nada (se rinde tras el tiempo máximo y lo para, F4). `test_app.py` lanza ya el error con nombre.
    - Todos los módulos citan en su docstring la spec, el plan o la regla que implementan (S3).

## Fase I · Verificación y cierre

- [x] **T19** 👤 · Prueba real (Victor):
  1. Arrancar con **una copia** de `data/asistencia.db`: siguen las clases y el mismo enlace de profesor (CA-02).
  2. `python app.py` y `python app.py --tunel`: arrancan como antes (CA-03).
  3. Abrir una clase, registrarse desde el móvil, quitar un registro, cerrar y exportar: todo igual que antes (CA-01).
  4. Revisar la consola: ninguna IP ni ningún nombre de alumno (CA-07).
  - **Hecha (2026-10-23):** Victor lo probó todo y funciona. Primero le salió `SyntaxError: Non-ASCII character` porque `python` era el Python 2 del sistema: hay que activar `.venv` antes (lo aclara T21).
- [x] **T20** · Lista de comprobación de `ARCHITECTURE.md` §13, anotada aquí punto por punto (cumple, o dónde está su excepción en el plan §5). Comprobar también que cada `# CA-xx` de la spec 001 sigue en algún test.
  - *Cubre:* CA-01, CA-04.
  - **Hecha (2026-10-23).** Marcas de la spec 001: no se ha perdido ninguna. Antes del cambio (commit `c219b1d`) los tests marcaban 22 de los 26 CA; ahora 23, porque se añade CA-21 (`test_app.py`: el túnel se cierra al parar). CA-18, CA-22 y CA-23 son comprobaciones manuales o en el navegador (plan 001 §6): CA-22 y CA-23 se repitieron en Chrome porque T16 tocó `alumno.js` (registrarse en A, volver a A → "Ya te registraste…" sin formulario; abrir B → formulario con el nombre recordado). CA-18 (móvil a 400 px) no se repite: la spec 005 no cambia el HTML ni el CSS de ninguna pantalla, salvo el `maxlength` del título.

    | Punto de ARCHITECTURE.md §13 | Resultado | Cómo se ha comprobado |
    | --- | --- | --- |
    | Dependencias hacia el dominio (C1, O1) | ✅ | `domain/` solo importa la biblioteca estándar y el propio dominio; `usecases/` no importa Flask ni nada de HTTP o JSON; `infra/` solo importa tipos y errores del dominio |
    | Dominio sin E/S, reloj ni configuración (C1, M5) | ✅ | Ninguna llamada a `time.time`, `datetime.now`, `os.environ`, `sqlite3` ni archivos en `domain/`; la hora llega como `t` |
    | Entrada fina (C2, C5) | ✅ | Ningún `if` ni `try/except` en `public.py` y `teacher.py`; cada ruta llama a un caso de uso, salvo la lista de clases, que es una lectura sin reglas (C5) |
    | Un único punto de montaje (C4, F5) | ✅ | Solo `app.py` lee el entorno (`load_config(os.environ)`); `create_app` lo recibe todo por parámetro |
    | Límites de tamaño (M1, M2) | ✅ | Ningún módulo pasa de 300 líneas (el mayor, `storage.py`, tiene 149); ninguna función pasa de 40; `ruff` `C90` (complejidad) sin avisos |
    | Tipos con nombre entre capas (M4) | ✅ | `Session`, `SessionSummary`, `Checkin`, `CheckinResult`, `TeacherView`, `ExportFile`, `Config`; los diccionarios solo existen al leer filas y al construir JSON |
    | SQL solo en `infra/`, con parámetros; transacciones en el caso de uso (D1–D4) | ✅ | Ningún `execute` fuera de `storage.py`; ningún SQL construido con texto; ningún `commit()`; `with conn:` solo en los casos de uso y en la preparación de `create_app` |
    | Cada respuesta elige sus campos, en una sola función (D7, F2) | ✅ | Todas las rutas responden con un serializador (o `{"ok": true}`); un test comprueba que el secreto no sale en ninguno |
    | Forma, tipo y formato de lo que entra, sin conversiones (E1) | ✅ | `json_object` y `optional_str`; tests con cuerpos que no son objetos, números, listas, `null` y otros alfabetos |
    | Errores con nombre, traducidos en una única tabla (E3, E4) | ✅ | Todos heredan de `AppError` con su `MESSAGE`; no se lanza ninguna excepción estándar; `STATUS` en `errors.py` y un test comprueba que no falta ninguna |
    | Errores en JSON, en español y diciendo qué hacer (F3, E5) | ✅ | `test_web_errors.py`: cada error de la tabla, `404`, `405` y `500` |
    | Registros sin datos personales (E7) | ✅ | Un solo `logger.exception` (método y ruta, sin el cuerpo); el registro de accesos queda silenciado; test con `caplog` y prueba real con la consola |
    | Datos pintados como texto en el navegador (U2, X4) | ✅ | Ningún `innerHTML` en `static/`; el CSV neutraliza fórmulas (`test_export.py`) |
    | Tipos y docstring con su rastro a la spec (S2, S3) | ✅ | `mypy --strict` y `ruff` (`ANN`, `D`) sin avisos; todos los módulos citan su spec, plan o regla. Los tests quedan fuera de `ANN` y `D` (excepción del plan §5) |
    | Tests de criterios y de caminos de error; solo se simula lo externo (T1, T3, T4) | ✅ tras un arreglo | Al revisarlo, `test_app.py` (T15) sustituía dos funciones nuestras (`port_in_use` y `start_tunnel`), cosa que T4 no permite. Se arregló: el puerto ocupado es un socket real y lo que se simula es cloudflared (`shutil.which`, `subprocess.Popen`). Solo quedan dos sustituciones de funciones nuestras, para provocar a propósito un error inesperado (T4 lo permite) |
    | Abstracciones o dependencias sin su condición (§12) | ✅ | Sin `Protocol`, clases abstractas, `async` ni `__all__`; las dependencias de la app siguen siendo Flask (más pytest, ruff y mypy, que son herramientas de desarrollo, P3 v3.1) |
    | `pytest` en verde | ✅ | 240 tests en verde; `ruff check`, `ruff format --check` y `mypy` sin avisos |

    - Excepciones a la arquitectura: solo las dos del plan §5 (los tests sin anotaciones ni docstrings; el reloj en segundos Unix).
- [x] **T21** · Cierre:
  - `AGENT.md`: estructura (§3), comandos de `ruff` y `mypy` (§4), definición de terminado con `ruff` y `mypy` en verde (§6) y estado (§7);
  - `README.md`: estructura, comandos nuevos y variables de entorno (`ASISTENCIA_DB`, `PORT`, `ASISTENCIA_TZ`);
  - plan 001 §5: nota de que los archivos cambiaron de sitio con la spec 005;
  - comprobar que `pytest`, `ruff check` y `mypy` pasan y que el puerto 8000 queda libre;
  - definición de terminado (`AGENT.md` §6).
  - *Cubre:* CA-03.
  - **Hecha (2026-10-23):**
    - `AGENT.md`: árbol nuevo (§3); comandos de `ruff`, `mypy`, las variables de entorno y la comprobación de `python --version` (§4); definición de terminado con `ruff`, `mypy` y la lista de `ARCHITECTURE.md` (§6); estado (§7).
    - `README.md`: tabla de variables (`PORT`, `ASISTENCIA_DB`, `ASISTENCIA_TZ`), título de 20 caracteres como máximo, el error de Python 2 y los de configuración en "Problemas frecuentes", y los comandos de revisión del código.
    - Plan 001 §5: nota de que los archivos cambiaron de sitio con esta spec.
    - Comprobación final: 240 tests en verde; `ruff format --check`, `ruff check` y `mypy` sin avisos; puertos 8000 y 8765 libres.

## Definición de terminado (AGENT.md §6)

- [x] Todas las tareas están en `[x]`.
- [x] `pytest` pasa (240 tests).
- [x] `ruff format --check`, `ruff check` y `mypy` no dan ningún aviso.
- [x] La lista de `ARCHITECTURE.md` §13 se cumple (T20); las únicas excepciones son las del plan §5.
- [x] CA-01 a CA-08 verificados: CA-01 (T20), CA-02 (T07 y T19), CA-03 (T08, T15 y T19), CA-04 (T17, T18 y T20), CA-05 (T04 y T11), CA-06 (T06 y T12 a T14), CA-07 (T11, T15 y T19), CA-08 (T14).
- [x] El `README.md` explica lo nuevo (T21).
- [x] Victor la ha probado y la ha dado por buena (T19).
