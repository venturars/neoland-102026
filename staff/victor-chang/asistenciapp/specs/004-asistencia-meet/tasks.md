# Tareas 004 · Asistencia automática desde Google Meet

> Versión 2.2 · Estado: **Aprobado** (2026-10-28) · Plan: [plan.md](plan.md) v2.2 · Creado: 2026-10-21 · Reescrito: 2026-10-23

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- `👤` = necesita que **Victor** haga algo con su cuenta de Google (nadie más puede hacerlo por él).
- **Regla de todas las tareas:** al acabar, `pytest`, `ruff check`, `ruff format --check` y `mypy` están en verde (AGENT.md §6).
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- **Puerta de la fase A:** si el spike (T03) falla, se para todo y se revisa la spec (plan §0, decisión §8.3).

---

## Fase A · Prueba de concepto (plan §0)

Antes de tocar la app, comprobamos que Google deja hacer lo que necesitamos con una cuenta gratuita.

- [x] **T01** · Dependencia nueva (plan §7.1, P3):
  - Añadir `google-auth-oauthlib` a `requirements.txt` e instalarlo.
  - Si `mypy --strict` pide tipos de las bibliotecas de Google, añadir en `pyproject.toml` la excepción mínima, solo para esos módulos.
  - *Hecha cuando:* `python -c "import google_auth_oauthlib"` funciona y siguen en verde los 240 tests, `ruff` y `mypy`.
  - **Hecha (2026-10-23):** `google-auth-oauthlib` 1.5.0, que trae `google-auth` 2.62.0 y `requests` 2.34.2. Solo `google_auth_oauthlib` no publica tipos: en `pyproject.toml` se le aplica `ignore_missing_imports`, solo a ese módulo (comprobado con un archivo de prueba en `mypy --strict`). `google-auth` y `requests` sí traen tipos. 240 tests, `ruff` y `mypy` en verde.
- [x] **T02** 👤 · Preparar Google Cloud (Victor, guiado paso a paso; unos 15 min):
  1. Crear un proyecto en Google Cloud Console.
  2. Activar la **Google Meet REST API**.
  3. Configurar la pantalla de consentimiento: tipo *Externo*, permisos `meetings.space.readonly` y `openid`, y **publicarla "En producción"** sin verificar (decisión §8.1).
  4. Crear credenciales **OAuth de tipo "Aplicación de escritorio"** y guardar el JSON como `data/google-client.json`.
  - *Hecha cuando:* el archivo existe en `data/` y `git status` **no** lo muestra.
  - **Notas (2026-10-23):**
    - Para publicar "En producción", Google pide una URL de página principal y de política de privacidad. Victor no las tiene, así que la app queda en **Testing**, con sus dos cuentas como usuarios de prueba: basta para el spike. La decisión §8.1 se revisa después del spike (permiso semanal o publicar con páginas sencillas).
    - El primer archivo era un cliente **Web**; hace falta uno de tipo **Aplicación de escritorio** para el flujo *loopback* (plan §2.4).
    - **Hecha (marcada el 2026-10-27, en T17):** `data/google-client.json` de tipo escritorio, fuera de git y con `0600`; el spike (T03) y la prueba real (T16) lo usan. No se había marcado al hacerla.
- [x] **T03** 👤 · Spike: `scripts/spike_meet.py` (desechable):
  - Inicia sesión con Google, pide un código de reunión e imprime, de cada participante activo, su tipo (`signedinUser` / `anonymousUser` / `phoneUser`), su `displayName` y su `user`; y el `sub` de la cuenta que ha iniciado sesión.
  - Victor crea una reunión con su cuenta gratuita, se une desde otro dispositivo (con otra cuenta o como invitado) y lo ejecuta.
  - Responde y anota aquí:
    - [x] ¿Lee los participantes con una cuenta **gratuita**? (si **no** → **parar**, plan §0)
      - **Sí** (2026-10-23), pero por `conferenceRecords`, no por `spaces/{código}`: `spaces.get` responde `403` incluso con una reunión propia creada desde meet.google.com. `conferenceRecords?filter=space.meeting_code="…"` devuelve la reunión en curso (sin `endTime`), y sus `participants?filter=latest_end_time IS NULL` dan quién está ahora. Cambia plan §2.3.
    - [x] ¿`users/<sub>` coincide con el profesor? (si no → excluir por nombre, plan §2.5)
      - **Sí** (2026-10-23): el participante `signedinUser` del profesor trae `user = users/<sub>`, el mismo `sub` del inicio de sesión. El invitado anónimo llega como `anonymousUser`, con `displayName` y sin `user`.
    - [x] ¿Qué ve una **segunda cuenta** que no organiza la reunión? (decide CA-13 y CA-15, plan §2.6)
      - Se probó con las clases reales del bootcamp, en las que Victor **participa sin organizar** (decisión de Victor: solo recuentos, sin nombres ni identificadores, y sin guardar nada). Su cuenta ve los participantes de las 8 clases de la lista (15 a 18 por clase). Un participante puede leer la lista; la segunda cuenta ya no hace falta.
    - [x] ¿Qué responde Google si la reunión **no está en curso** o el código no existe? (plan §2.7)
      - No está en curso → `conferenceRecords` filtrado por código la devuelve **con** `endTime`. No existe → **0 reuniones**, sin error. Google no distingue "no existe", "aún no ha empezado", "caducada" ni "esta cuenta no la ve": todo es una lista vacía.
    - [x] ¿Funciona en el SQLite del proyecto `ALTER TABLE … ADD COLUMN` con los `CHECK` de plan §3, y rechaza un modo no válido? (plan §0.4)
      - **Sí** (2026-10-23, SQLite 3.49.1, en memoria): la migración añade las dos columnas y la clase antigua queda en `code`; la BD rechaza un modo no válido, una clase automática sin reunión y pasar a automática sin reunión; acepta los casos válidos.
  - **Hallazgos de las primeras ejecuciones (2026-10-23), para el plan:**
    - Google deja **conceder solo parte** de los permisos (casillas en su pantalla). Sin la casilla de Meet solo concede `openid`. La app tiene que comprobar los permisos concedidos y explicar cuál falta, en vez de fallar.
    - Google responde **el mismo `403 PERMISSION_DENIED`** cuando la API de Meet no está activada en el proyecto de Google Cloud. `GoogleMeet` tiene que leer el motivo de la respuesta: API desactivada → error de configuración (`MeetNotConfiguredError`); sin acceso a la reunión → `MeetingNotVisibleError` (CA-13; nombre de la v2.1 del plan).
    - El `sub` de la cuenta llega bien con `openid` (no se copia aquí: identifica la cuenta de Victor).
    - `conferenceRecords` sin filtro devuelve también reuniones de **otra** sala en las que Victor solo participa (parecen las clases del bootcamp). Puede que un participante que no organiza vea la lista: es la pregunta 3.
  - Guarda en `tests/fixtures/meet/` las respuestas de Google de ejemplo, **con los nombres cambiados** (P4), para los tests de T09.
  - *Cubre:* riesgo de §0; base de CA-09, CA-13, CA-14, CA-15.
  - *Hecha cuando:* las cinco preguntas tienen respuesta. Si alguna obliga a cambiar el plan o la spec, se actualizan **antes** de seguir.
  - **Hecha (2026-10-23).** La puerta de la fase A se pasa: una cuenta gratuita lee los participantes. Hallazgos que cambian la spec y el plan (se proponen como spec v1.2 y plan v2.1 antes de seguir):
    1. **Vía de la API:** `spaces/{código}` responde `403` con reuniones creadas desde meet.google.com; la que funciona es `conferenceRecords?filter=space.meeting_code="…"` → `participants`.
    2. **Quién puede leer:** un participante que no organiza ve la lista (no solo el organizador).
    3. **Reuniones terminadas:** sin filtro, `participants` da **todos los que estuvieron en algún momento**, cada uno una vez, con su primera entrada y su última salida.
    4. **Caducidad:** cada reunión trae `expireTime` a los **30 días** de terminar.
    5. **La misma sala cada día:** las clases usan siempre la misma sala (mismo código), y cada día es una reunión distinta. Filtrar por código devuelve varias.
    6. **Lista vacía para todo:** inexistente, sin empezar, caducada o no visible para esa cuenta dan lo mismo (0 reuniones).
    7. **Permisos a medias** y **`403` con la API desactivada** (anotados arriba).
  - Ejemplos guardados en `tests/fixtures/meet/` (solo la reunión de prueba de Victor, anonimizados y revisados campo a campo): `conference_records_by_code.json` y `participants_ended.json`.

## Fase B · Dominio (plan §2.7 a §2.9)

- [x] **T04** 🧪 · `domain/sessions.py` y `domain/errors.py`:
  - `Mode` (`code` / `automatic`); `Session` y `SessionSummary` ganan `mode` y `meeting_code`.
  - Los nueve errores de plan §2.7 (v2.1), con su mensaje (tests en `test_errors.py`).
  - *Cubre:* base de CA-01 a CA-04, CA-13, CA-14, CA-21.
  - **Hecha (2026-10-25):** 285 tests en verde (los nuevos fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - `Mode` es un `StrEnum` (`code`, `automatic`). En `Session` y `SessionSummary`, `mode` vale `code` por defecto y `meeting_code` `None`: así todo lo que ya existe sigue siendo una clase de código hasta que `storage` guarde el modo (T06).
    - Los nueve errores, con los mensajes de plan §2.7 copiados tal cual (un test los compara uno a uno).
    - Adelantado de T12: los errores nuevos ya están en la tabla `STATUS` de la entrada web (409, 422, y 502 para Google), porque el test que comprueba que no falta ninguno lo exige.
- [x] **T05** 🧪 · `domain/participants.py`: `Who` (`now` / `everyone`), `MeetingAttendance` (nombres, hora de inicio de la reunión y si ya terminó) y `names_from_platform(display_names)`.
  - Tests en `test_participants.py`: quita espacios; vacío → "Invitado sin nombre"; varios → numerados (`2`, `3`…); más de 60 caracteres → recortado a 60; los demás nombres no cambian.
  - *Cubre:* CA-08.
  - **Hecha (2026-10-25):** 295 tests en verde (los nuevos fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - `MeetingAttendance.names` lleva los nombres **tal como los da la plataforma** (sin el profesor); los convierte `names_from_platform` en el caso de uso (T11).
    - Si el recorte a 60 deja un espacio al final, se quita. Un test comprueba que todo lo que devuelve pasa `clean_name`, es decir, que se guarda con las reglas de la spec 001.

## Fase C · Infraestructura y configuración (plan §2.3 a §2.5, §3)

- [x] **T06** 🧪 · `infra/storage.py`: columnas `mode` y `meeting_code`, con sus `CHECK`.
  - `init_schema()` las añade a una BD antigua. Tests: una BD con el esquema de la spec 001 conserva sus clases con `mode = 'code'`; la BD rechaza un modo no válido y una clase automática sin reunión; `checkins` no tiene columnas nuevas (CA-17).
  - `create_session`, `get_session` y `list_sessions` guardan y devuelven el modo.
  - *Cubre:* CA-01, CA-03, CA-04, CA-17.
  - *Hecha cuando:* además, la migración funciona con **una copia** de `data/asistencia.db` de Victor.
  - **Hecha (2026-10-25):** 300 tests en verde (los nuevos de modo fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - La tabla nueva nace con las dos columnas y sus `CHECK`; `init_schema()` las añade a una BD antigua con `ALTER TABLE` (frases fijas en `SESSION_MIGRATIONS`, sin texto de fuera, D2). Se puede llamar varias veces.
    - Copia de la BD de Victor: 6 clases y 18 registros antes y después, todas en `code` y sin reunión, y el mismo token. El original no se abre (misma suma de comprobación antes y después).
- [x] **T07** 🧪 · `config.py`: `google_client_path` y `google_token_path` (`ASISTENCIA_GOOGLE_CLIENT`, `ASISTENCIA_GOOGLE_TOKEN`), con sus valores por defecto en `data/`.
  - *Cubre:* CA-11, CA-12.
  - **Hecha (2026-10-25):** 302 tests en verde (los nuevos fallaron primero); `ruff` y `mypy --strict` sin avisos. Las dos rutas tienen valor por defecto en `Config`, así que los `Config(...)` que ya existían (tests incluidos) siguen igual. Un valor vacío cuenta como no puesto, como el resto de variables.
- [x] **T08** 🧪 · `infra/google_meet.py`: `parse_meeting_code(text)`.
  - Tests en `test_google_meet.py`: acepta `abc-defg-hij` y el enlace completo (con o sin `?authuser=…`), con mayúsculas y espacios alrededor. Rechaza con `MeetingLinkInvalidError` textos vacíos, otros dominios, formatos incorrectos y letras de otros alfabetos.
  - *Cubre:* CA-14.
  - **Hecha (2026-10-25):** 328 tests en verde (26 nuevos, que fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - Acepta también `http://`, el enlace sin esquema (`meet.google.com/…`) y una barra final.
    - Rechaza dominios que se parecen (`meet.google.com.evil.com`, `evil.com/meet.google.com/…`), otras plataformas, `#…` y letras que parecen latinas pero no lo son.
    - Comprueba que el texto es ASCII **antes** de pasarlo a minúsculas, porque `lower()` convierte algunos símbolos en letras ASCII (el signo Kelvin "K" pasa a "k").
- [x] **T09** 🧪 · `infra/google_meet.py`: `GoogleMeet.participants(meeting_code, who)`, con la sesión HTTP por parámetro (plan §2.3, v2.1).
  - Tests con una sesión HTTP falsa y los ejemplos de `tests/fixtures/meet/`:
    - pide `conferenceRecords` filtrado por el código; elige la reunión en curso y, si no hay, la más reciente (CA-20); 0 reuniones → `MeetingNotVisibleError` (CA-13, CA-14);
    - `now` → participantes con `latest_end_time IS NULL`; con la reunión ya terminada → `MeetingEndedError` sin pedirlos (CA-21); `everyone` → sin filtro (CA-18);
    - solo devuelve `displayName`, aunque traiga `user` o `phoneUser` (CA-17);
    - excluye al profesor en los dos modos (CA-09);
    - sigue las páginas, como mucho 10;
    - `403` con motivo `SERVICE_DISABLED` → `MeetNotConfiguredError`; otro `403` → `MeetingNotVisibleError`; `5xx`, tiempo agotado o sin red → `MeetServiceError`; sin `google-client.json` → `MeetNotConfiguredError`;
    - permisos concedidos sin el de Meet → `MeetPermissionMissingError`; permiso caducado (renovación rechazada) → se borra y se vuelve a pedir (CA-12, P7);
    - cada llamada lleva un tiempo máximo de 10 s;
    - el permiso se guarda con permisos `0600`;
    - nada de la respuesta de Google llega a los registros (`caplog`).
  - El flujo OAuth real (abrir Google, esperar como mucho 2 minutos → `MeetLoginNotCompletedError`) se verifica a mano en T16.
  - *Cubre:* CA-09, CA-11 a CA-14, CA-17, CA-18, CA-20, CA-21.
  - **Hecha (2026-10-25):** 359 tests en verde (31 nuevos, que fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - `GoogleMeet` recibe por parámetro su sesión HTTP y la función que pide el permiso (`run_browser_login` por defecto); los tests simulan solo eso y las credenciales de Google (T4).
    - `run_browser_login` traduce los fallos del navegador: 2 minutos sin aceptar (`WSGITimeoutError`) o "Cancelar" (`AccessDeniedError`) → `MeetLoginNotCompletedError`; aceptar sin la casilla de Meet (el `Warning` de oauthlib) → `MeetPermissionMissingError`.
    - Errores de Google: el motivo del `403` decide entre API desactivada (`SERVICE_DISABLED`), permiso insuficiente (`ACCESS_TOKEN_SCOPE_INSUFFICIENT`) y "no se ve". Un `401` olvida el permiso guardado. En el registro solo queda el código HTTP.
    - Tipos: `oauthlib` tampoco publica tipos (se añade a la excepción de `google_auth_oauthlib` en `pyproject.toml`), y tres métodos de `Credentials` de `google-auth` no están anotados: se marcan solo esas tres llamadas.
    - Lo que no se puede probar sin Google (el inicio de sesión real, la caducidad semanal de verdad) queda para T16.
    - **Después (2026-10-25, a petición de Victor):** `google_meet.py` llegaba a 290 líneas (M1: ~300). El permiso pasa a `infra/google_auth.py` (`run_browser_login` y `GooglePermission`), y `google_meet.py` queda con la API de Meet (193 líneas). Sus tests van a `tests/test_google_auth.py`; `FakeCredentials` se comparte en `tests/google_fakes.py`. 361 tests en verde.
    - **Prueba real con la cuenta de Victor (2026-10-25)**, con un script de prueba fuera del proyecto que solo muestra recuentos y fechas. Reunión de prueba del 23/10: con "todos" da 1 participante sin el profesor y la marca como terminada. La segunda vez **no** abre Google, porque reutiliza el permiso (CA-12). "Ahora" da `MeetingEndedError` (CA-21), y un código inventado `MeetingNotVisibleError` (CA-14). El permiso queda en `data/google-token.json` con `0600`, fuera de git.

## Fase D · Casos de uso (plan §2.2, §2.9, §2.11)

- [x] **T10** 🧪 · `usecases/sessions.py` y `usecases/checkins.py`:
  - `create_session` con modo: en `automatic`, el enlace es obligatorio y se guarda su código; en `code`, se ignora.
  - `teacher_view`: sin código ni cuenta atrás en modo automático (CA-02).
  - `check_in` en una clase automática → `NotCodeSessionError`, después de comprobar si está cerrada.
  - *Cubre:* CA-01, CA-02, CA-03.
  - **Hecha (2026-10-25):** 371 tests en verde (los nuevos fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - `create_session(..., mode=Mode.CODE, meeting="")`: los parámetros nuevos tienen valor por defecto, así que todo lo que ya abría clases de código sigue igual. En modo automático guarda el código limpio que da `parse_meeting_code` (p. ej. de un enlace con `?authuser=1`).
    - El orden de `check_in` queda: cerrada → modo → nombre → código, con un test para cada paso.
- [x] **T11** 🧪 · `usecases/attendance.py`: `sync_from_meeting(conn, fetch_participants, session_id, who, t)` → `added`, `found`, `total` y de qué reunión es (hora de inicio, si ya terminó).
  - Tests en `test_attendance.py`, con una función de participantes falsa:
    - primera toma (CA-05);
    - segunda toma con repetidos (otra tilde o mayúscula) y uno nuevo → `added = 1` (CA-06);
    - alguien que sale sigue en la lista (CA-07);
    - reunión vacía (CA-10);
    - "todos" con el mismo nombre dos veces → un registro (CA-19);
    - pasa `who` tal cual a la función de participantes (CA-18);
    - clase de código o cerrada → `409`; clase inexistente → `SessionNotFoundError`;
    - si la función de participantes falla, no se guarda nada;
    - todo en una transacción, con la hora de la toma.
  - *Cubre:* CA-05, CA-06, CA-07, CA-10, CA-18, CA-19.
  - **Hecha (2026-10-25):** 384 tests en verde (13 nuevos, que fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - Devuelve un `SyncResult` (en `domain/participants.py`): `added`, `found`, `total`, `meeting_started_at`, `meeting_ended`.
    - Primero comprueba la clase (existe → abierta → automática) y luego pregunta a la plataforma. Así no se llama a Google por una clase cerrada o de código, y si Google falla no se ha escrito nada.
    - Test de "todo o nada": si un registro falla a mitad de la toma, no queda ninguno (una sola transacción, D3).

## Fase E · Entradas (plan §2.9, §4)

- [x] **T12** 🧪 · Entrada web:
  - `create_app(..., fetch_participants=None)`; `POST /api/sessions` con `mode` y `meeting`; `mode` en `GET /api/sessions`, `GET /api/sessions/<id>` (con `meetingCode`, sin `code` ni `studentUrl` en modo automático) y `GET /api/s/<id>`.
  - Ruta `POST /api/sessions/<id>/meet-sync` con `{who: "now" | "everyone"}` → `{added, found, total, meetingStartedAt, meetingEnded}`.
  - Los errores de plan §2.7 en la tabla de `errors.py` (un test ya comprueba que no falta ninguno).
  - Tests nuevos en `test_web_meet.py`: crear en modo automático, `mode` desconocido → `400`, enlace mal escrito → `422`, `meet-sync` correcto en los dos modos, `who` que falta o desconocido → `400`, `409`, `422` y `502` con sus mensajes, `401` sin token, y quitar y exportar en una clase automática (CA-16).
  - Cambian los tests de la spec 001 que comparan el JSON completo, para incluir `mode`.
  - *Cubre:* CA-01, CA-02, CA-04, CA-13, CA-14, CA-16, CA-18, CA-20.
  - **Hecha (2026-10-25):** 421 tests en verde (los 37 nuevos fallaron primero); `ruff` y `mypy --strict` sin avisos.
    - `validation.choice(body, key, Enum, default)` lee `mode` y `who`: un valor que no es del enum (o que no es texto) → `400`. `who` no tiene valor por defecto.
    - `meetingCode` sale siempre en `GET /api/sessions/<id>` (`null` en las clases de código); `studentUrl`, solo en modo código.
    - Si la app se monta sin `fetch_participants` (p. ej. en los tests de la spec 001), `meet-sync` responde `422` `MeetNotConfiguredError`.
    - Solo cambió un test de la spec 001 (`GET /api/s/<id>` compara el JSON entero); los de serializadores ganan `mode`.
- [x] **T13** 🧪 · Atajo `python app.py --meet <código>` (decisión §8.2): `entrypoints/cli.py` y `app.py`.
  - Valida el código antes de arrancar; crea la clase automática y hace la primera toma ("quién está ahora"; `--meet-todos` para "todos los que han estado") con los mismos casos de uso (C3); imprime cuántos se registraron y el enlace del panel **a esa clase** (`#t=…&s=…`).
  - Si la toma falla, imprime el mensaje del error y arranca igualmente, para poder reintentar desde el panel.
  - Combinable con `--tunel`. `app.py` monta `GoogleMeet` con las rutas de `Config` (C4).
  - Tests en `test_cli.py` y `test_app.py` (solo se simulan Google y `Flask.run`, T4).
  - *Cubre:* HU-01.
  - **Hecha (2026-10-25):** 435 tests en verde (los nuevos fallaron primero, salvo el de `--meet-todos` sin `--meet`, que el arranque anterior ya rechazaba como opción desconocida); `ruff` y `mypy --strict` sin avisos.
    - `cli.start_meet_session(conn, fetch_participants, meeting, who, t, tz)` devuelve el id de la clase y el texto del resultado; no imprime (lo hace `app.py`). La clase se titula con la fecha, como en la web sin título.
    - El texto sigue el formato del panel (plan §4): "Reunión del 23/10 a las 06:56 · Añadidas 2 personas nuevas · 2 en la llamada ahora", en singular con 1 persona, y "No hay participantes en la reunión" con 0 (CA-10). La hora de la reunión se muestra en la zona de `ASISTENCIA_TZ`.
    - `app.py` comprueba el enlace **antes** de anunciar la toma o abrir el navegador; si está mal, para con el mensaje de `MeetingLinkInvalidError` y no arranca. `--meet-todos` sin `--meet` es un error de uso.
    - La toma va antes del túnel. Probado a mano: enlace mal escrito y `--meet-todos` solo. La toma real con Google queda para T16.

## Fase F · Interfaz (plan §4)

- [x] **T14** · `static/`:
  - `profesor.html/.js`:
    - grupo de `radio` **Código / Automático (Meet)**; el campo del enlace de Meet solo aparece con Automático;
    - en una clase automática, tarjeta con el código de la reunión y dos botones, **"Quién está ahora"** y **"Todos los que han estado"** (CA-18), que muestran el resultado y de qué reunión es (CA-20) en `role="status"` y se desactivan mientras esperan;
    - sin tarjeta de código en una clase automática;
    - etiqueta **"código"** / **"Meet"** en la lista de clases.
  - `alumno.js`: "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." en clases automáticas.
  - `styles.css`: estilos del selector y de la etiqueta.
  - *Cubre:* CA-01, CA-02, CA-04, CA-10 (mensaje), CA-16, CA-18, CA-20.
  - *Hecha cuando:* revisada en el navegador a 400 px y con teclado (P5), y la clase de código sigue igual que antes.
  - **Hecha (2026-10-25):** revisada en Chrome con una BD temporal y un Meet falso (sin Google ni datos reales); 435 tests, `ruff` y `mypy` sin avisos.
    - Con teclado: Tab hasta el grupo de modo, flecha para "Automático", aparece el campo del enlace; Enter abre la clase. Un enlace mal escrito muestra el mensaje del servidor y devuelve el foco al campo.
    - "Quién está ahora" en una reunión terminada muestra el aviso de CA-21; "Todos los que han estado" registra a 3 (uno como "Invitado sin nombre") con "Reunión del 23/10 a las 08:56 · …"; repetirla añade 0 (CA-06).
    - Mientras espera, los dos botones se desactivan y se avisa de que la primera vez se abre el navegador para el permiso. **Arreglado durante la revisión:** al desactivarse, el botón perdía el foco; ahora se le devuelve.
    - A 400 px: panel con etiquetas "código"/"Meet", clase automática, clase de código (igual que antes) y página del alumno (mensaje de clase automática, sin formulario); sin desplazamiento horizontal.
    - Ahora el formulario de "Abrir asistencia" muestra los errores del servidor (antes un título demasiado largo no se avisaba en la interfaz).

## Fase G · Verificación y cierre

- [x] **T15** · Lista de comprobación de `ARCHITECTURE.md` §13, anotada aquí punto por punto, y `ruff` y `mypy` sin avisos.
  - *Cubre:* todos (revisión).
  - **Hecha (2026-10-25):** 435 tests en verde; `ruff check`, `ruff format --check` y `mypy --strict` sin avisos. Revisión con un script (importaciones por capa, tamaños, SQL, registros) y leyendo el código nuevo de la spec 004:
    - ✅ **Capas (C1, O1).** El dominio no importa nada de fuera de `domain/`; la infraestructura no importa casos de uso ni entradas. Las entradas solo usan `infra.storage` para la conexión y la lista de clases (C5); `app.py` monta las piezas (C4).
    - ✅ **Dominio sin E/S (C1, M5).** `participants.py` solo tiene tipos y `names_from_platform`; la hora de la toma y los participantes llegan por parámetro.
    - ✅ **Entradas finas (C2, C5)**, con dos matices justificados:
      - `cli.start_meet_session` llama a **dos** casos de uso (abrir la clase y tomar asistencia): es lo que pide el atajo aprobado (plan §1, decisión §8.2). No decide nada del negocio; solo junta el texto.
      - `meet-sync` responde `MeetNotConfiguredError` si la app se montó sin participantes: es una comprobación del montaje, no una regla del negocio.
    - ✅ **Un único sitio de montaje (C4, F5).** `app.py` crea `GoogleMeet` con las rutas de `Config` y se lo pasa a `create_app` y al atajo.
    - ✅ **Tamaños (M1, M2).** Ningún archivo pasa de 250 líneas. `sync_from_meeting` ocupa 45 líneas, pero 25 son su docstring; el código son unas 20. `start_tunnel` (37, de la spec 001) está dentro del límite.
    - ✅ **Tipos con nombre (M4).** `MeetingAttendance`, `SyncResult`, `Who`, `Mode`. **Arreglado en esta revisión:** `cli.start_meet_session` devolvía una tupla a `app.py`; ahora devuelve `MeetStart(session_id, message)`.
    - ✅ **SQL (D1–D4).** Solo en `infra/storage.py`, con parámetros; la migración usa frases fijas. La toma guarda todos los registros en una transacción abierta por el caso de uso; ninguna función de almacenamiento confirma por su cuenta.
    - ✅ **Respuestas (D7, F2).** Cada respuesta tiene su función en `serializers.py` (`sync_result_json` nueva). El secreto de la clase no sale nunca (test); `studentUrl` solo en modo código.
    - ✅ **Validación (E1).** `mode` y `who` con `validation.choice` (solo texto y solo valores del enum; `who` obligatorio); `meeting` con `optional_str` y su formato en `parse_meeting_code` (ASCII antes de minúsculas).
    - ✅ **Errores (E3, E4).** Los nueve errores nuevos son `AppError` con su mensaje, en la tabla `STATUS` (un test comprueba que no falta ninguno). La CLI imprime el mismo mensaje.
    - ✅ **JSON, español, qué hacer (F3, E5).** Todos los mensajes de plan §2.7 dicen qué hacer; los fallos de Google son `502` con "Inténtalo de nuevo en unos segundos".
    - ✅ **Registros sin datos personales (E7).** `google_meet.py` registra solo el tipo de excepción o el código HTTP, nunca el cuerpo; `google_auth.py`, solo que el permiso caducó. Ni nombres, ni el `sub` de la cuenta, ni el token.
    - ✅ **Navegador (U2, X4).** Sin `innerHTML` en `static/`; el código de reunión, el resultado y los mensajes del servidor se pintan con `textContent`.
    - ✅ **Tipos y docstrings con rastro (S2, S3).** `mypy --strict` y las reglas `D` de ruff pasan; cada función nueva cita su spec, plan o regla.
    - ✅ **Tests (T1, T3, T4).** Cada CA de la spec 004 tiene test, salvo los manuales del plan §6 (CA-15 en el spike; CA-09, CA-11, CA-12 se repiten en T16). Caminos de error: `meeting` vacío, numérico y de otra plataforma; `who` que falta, vacío, numérico o desconocido; letras de otros alfabetos en `parse_meeting_code`. Una matización de T4:
      - `test_app.py` sustituye `GoogleMeet.participants`, que es la frontera con Google; su comportamiento se prueba aparte con una sesión HTTP falsa (`test_google_meet.py`). El resto de tests usan una función falsa de participantes, que es lo que `create_app` recibe.
    - ✅ **Complejidad (§12).** `GoogleMeet` es una clase porque guarda estado (permiso y sesión HTTP), el caso permitido. Los participantes son un `Callable`, no un `Protocol`. La única dependencia nueva, `google-auth-oauthlib`, está justificada en plan §7.1.
    - ✅ **`pytest` en verde:** 435 tests.
- [x] **T16** 👤 · Prueba real en Meet (Victor, con su cuenta y otro dispositivo):
  1. `python app.py --meet <código>` → abre Google la primera vez (CA-11) y registra a los presentes sin el profesor (CA-05, CA-09).
  2. Entra otra persona → "Quién está ahora" → se añade 1 (CA-06).
  3. Sale alguien → nueva toma → sigue en la lista (CA-07).
  4. Un invitado sin nombre aparece como "Invitado sin nombre" y se puede quitar (CA-08, CA-16).
  5. Al terminar la reunión → "Todos los que han estado" → están todos, también quien salió antes, y el panel dice de qué reunión es (CA-18 a CA-20); "Quién está ahora" avisa de que terminó (CA-21).
  6. Cerrar la app y volver a arrancarla otro día de la misma semana → no pide permiso (CA-12).
  7. Con una clase real del bootcamp en la que Victor participa → funciona con su cuenta (CA-15); con un enlace inventado → mensaje de CA-14.
  8. Descargar el CSV: solo nombres y horas (CA-16, CA-17).
  9. La consola no muestra nombres, IPs ni nada de Google (E7).
  - **Hecha (2026-10-27):** Victor confirma que los nueve pasos salen como se espera, incluido el paso 7 en una clase real del bootcamp (2026-10-26).
- [x] **T17** · Cierre:
  - borrar `scripts/spike_meet.py`;
  - README: sección "Modo automático (Google Meet)" con la preparación de Google Cloud paso a paso, el uso de `--meet` y las variables nuevas;
  - AGENT.md: comandos, estructura y estado;
  - comprobar que `pytest`, `ruff` y `mypy` pasan y que los puertos quedan libres;
  - definición de terminado (AGENT.md §6).
  - **Hecha (2026-10-27):** 435 tests en verde; `ruff check`, `ruff format --check` y `mypy --strict` sin avisos.
    - `scripts/spike_meet.py` borrado, con su excepción de `ruff` en `pyproject.toml`. Los ejemplos que guardó siguen en `tests/fixtures/meet/`.
    - README: nueva sección 4 "Modo automático (Google Meet)" (preparar Google Cloud, `--meet`, los dos botones, permiso semanal), variables `ASISTENCIA_GOOGLE_*`, mensajes de Meet en "Problemas frecuentes" y privacidad. Las secciones siguientes se renumeran.
    - AGENT.md: estructura (`entrypoints/cli.py`, Google en `infra/`, `tests/fixtures/meet/`), comando `--meet` y estado.
    - Definición de terminado: todas las tareas en `[x]`; cada CA con su test (plan §6) o su paso en T16; Victor la ha probado (T16).
    - Puertos 8000, 8001 y 8012 sin AsistenciApp (en el 8000 escucha otro programa de Victor, `uvicorn`, que no se toca).

## Fase H · Revisión de código de la PR #532 (plan §2.12)

- [x] **T18** 🧪 · El formato del enlace de Meet en el dominio:
  - test que falla: importar `attendance.usecases.sessions` y crear una clase de código no carga `attendance.infra.google_meet` ni las librerías de Google (comprobado en un proceso aparte, mirando `sys.modules`);
  - mover `parse_meeting_code` y `MEETING_LINK` a `domain/meetings.py`; `usecases/sessions.py` y `app.py` lo importan de ahí; sus tests pasan de `test_google_meet.py` a `test_meetings.py`.
  - *Cubre:* CA-01 a CA-04 (las clases de código no dependen de Meet).
  - **Hecha (2026-10-28):** `parse_meeting_code` y `MEETING_LINK` en `domain/meetings.py`; `usecases/sessions.py` y `app.py` lo importan de ahí, y `infra/google_meet.py` ya no lo tiene. Sus 26 tests pasan, sin cambios, de `test_google_meet.py` a `test_meetings.py`.
    - Test nuevo `test_code_classes_do_not_load_google` (`test_sessions.py`): en otro proceso carga la parte web y los casos de uso y abre una clase de código. Antes del cambio cargaba 48 módulos de Google (`requests`, `google.*`, `attendance.infra.google_*`); ahora, ninguno.
    - 436 tests en verde; `ruff` y `mypy` sin avisos. `app.py` sigue montando `GoogleMeet` al arrancar (plan §2.12).
- [x] **T19** 🧪 · Fecha local en el nombre del CSV:
  - test que falla: una clase abierta a las 00:30 de Madrid (22:30 UTC del día anterior en verano, 23:30 en invierno) descarga `asistencia-<día de Madrid>-<id>.csv`;
  - `export_attendance` convierte `opened_at` con la zona horaria antes de tomar el día.
  - *Cubre:* spec 001 · CA-14.
  - **Hecha (2026-10-28):** `local_day(iso, tz)` en `domain/sessions.py` (sin E/S; la zona llega por parámetro) y `export_attendance` la usa en vez de los 10 primeros caracteres de `opened_at` en UTC. La ruta de descarga ya pasaba la zona de la configuración.
    - Test nuevo `test_export_filename_uses_the_local_day` (`test_sessions.py`), en verano (22:30 UTC del 24/10/2026) y en invierno (23:30 UTC del 14/01/2027): los dos fallaron con el día anterior y ahora dan el día de Madrid.
    - 438 tests en verde; `ruff` y `mypy` sin avisos.
- [x] **T20** · `requests` en `requirements.txt` (plan §2.12, §7.1); AGENT.md §4 nombra las dependencias de la app.
  - **Hecha (2026-10-28):** `requests` en `requirements.txt`, justo después de `google-auth-oauthlib`, sin versión fija como las demás. Ya estaba instalada (2.34.2, por `requests-oauthlib`): no hay nada nuevo que instalar. AGENT.md §4 nombra las tres dependencias de la app, y §3 corrige la línea de `requirements.txt`, que solo hablaba de Flask y las herramientas. 438 tests en verde; `ruff` y `mypy` sin avisos.
- [ ] **T21** · Cierre de la revisión:
  - `pytest`, `ruff check`, `ruff format --check` y `mypy` en verde;
  - respuestas en la PR #532 a los cinco comentarios;
  - llevar los arreglos a la rama de la PR #547 con un merge (sin reescribir su historia).
