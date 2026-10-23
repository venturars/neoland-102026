# Tareas 004 · Asistencia automática desde Google Meet

> Versión 2.0 · Estado: **Borrador (pendiente de aprobación)** · Plan: [plan.md](plan.md) v2.0 · Creado: 2026-10-21 · Reescrito: 2026-10-23

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

- [ ] **T01** · Dependencia nueva (plan §7.1, P3):
  - Añadir `google-auth-oauthlib` a `requirements.txt` e instalarlo.
  - Si `mypy --strict` pide tipos de las bibliotecas de Google, añadir en `pyproject.toml` la excepción mínima, solo para esos módulos.
  - *Hecha cuando:* `python -c "import google_auth_oauthlib"` funciona y siguen en verde los 240 tests, `ruff` y `mypy`.
- [ ] **T02** 👤 · Preparar Google Cloud (Victor, guiado paso a paso; unos 15 min):
  1. Crear un proyecto en Google Cloud Console.
  2. Activar la **Google Meet REST API**.
  3. Configurar la pantalla de consentimiento: tipo *Externo*, permisos `meetings.space.readonly` y `openid`, y **publicarla "En producción"** sin verificar (decisión §8.1).
  4. Crear credenciales **OAuth de tipo "Aplicación de escritorio"** y guardar el JSON como `data/google-client.json`.
  - *Hecha cuando:* el archivo existe en `data/` y `git status` **no** lo muestra.
- [ ] **T03** 👤 · Spike: `scripts/spike_meet.py` (desechable):
  - Inicia sesión con Google, pide un código de reunión e imprime, de cada participante activo, su tipo (`signedinUser` / `anonymousUser` / `phoneUser`), su `displayName` y su `user`; y el `sub` de la cuenta que ha iniciado sesión.
  - Victor crea una reunión con su cuenta gratuita, se une desde otro dispositivo (con otra cuenta o como invitado) y lo ejecuta.
  - Responde y anota aquí:
    - [ ] ¿Lee los participantes con una cuenta **gratuita**? (si **no** → **parar**, plan §0)
    - [ ] ¿`users/<sub>` coincide con el profesor? (si no → excluir por nombre, plan §2.5)
    - [ ] ¿Qué ve una **segunda cuenta** que no organiza la reunión? (decide CA-13 y CA-15, plan §2.6)
    - [ ] ¿Qué responde Google si la reunión **no está en curso** o el código no existe? (plan §2.7)
    - [ ] ¿Funciona en el SQLite del proyecto `ALTER TABLE … ADD COLUMN` con los `CHECK` de plan §3, y rechaza un modo no válido? (plan §0.4)
  - Guarda en `tests/fixtures/meet/` las respuestas de Google de ejemplo, **con los nombres cambiados** (P4), para los tests de T09.
  - *Cubre:* riesgo de §0; base de CA-09, CA-13, CA-14, CA-15.
  - *Hecha cuando:* las cinco preguntas tienen respuesta. Si alguna obliga a cambiar el plan o la spec, se actualizan **antes** de seguir.

## Fase B · Dominio (plan §2.7 a §2.9)

- [ ] **T04** 🧪 · `domain/sessions.py` y `domain/errors.py`:
  - `Mode` (`code` / `automatic`); `Session` y `SessionSummary` ganan `mode` y `meeting_code`.
  - Los nueve errores de plan §2.7, con su mensaje (tests en `test_errors.py`).
  - *Cubre:* base de CA-01 a CA-04, CA-13, CA-14.
- [ ] **T05** 🧪 · `domain/participants.py`: `names_from_platform(display_names)`.
  - Tests en `test_participants.py`: quita espacios; vacío → "Invitado sin nombre"; varios → numerados (`2`, `3`…); más de 60 caracteres → recortado a 60; los demás nombres no cambian.
  - *Cubre:* CA-08.

## Fase C · Infraestructura y configuración (plan §2.3 a §2.5, §3)

- [ ] **T06** 🧪 · `infra/storage.py`: columnas `mode` y `meeting_code`, con sus `CHECK`.
  - `init_schema()` las añade a una BD antigua. Tests: una BD con el esquema de la spec 001 conserva sus clases con `mode = 'code'`; la BD rechaza un modo no válido y una clase automática sin reunión; `checkins` no tiene columnas nuevas (CA-17).
  - `create_session`, `get_session` y `list_sessions` guardan y devuelven el modo.
  - *Cubre:* CA-01, CA-03, CA-04, CA-17.
  - *Hecha cuando:* además, la migración funciona con **una copia** de `data/asistencia.db` de Victor.
- [ ] **T07** 🧪 · `config.py`: `google_client_path` y `google_token_path` (`ASISTENCIA_GOOGLE_CLIENT`, `ASISTENCIA_GOOGLE_TOKEN`), con sus valores por defecto en `data/`.
  - *Cubre:* CA-11, CA-12.
- [ ] **T08** 🧪 · `infra/google_meet.py`: `parse_meeting_code(text)`.
  - Tests en `test_google_meet.py`: acepta `abc-defg-hij` y el enlace completo (con o sin `?authuser=…`), con mayúsculas y espacios alrededor. Rechaza con `MeetingLinkInvalidError` textos vacíos, otros dominios, formatos incorrectos y letras de otros alfabetos.
  - *Cubre:* CA-14.
- [ ] **T09** 🧪 · `infra/google_meet.py`: `GoogleMeet.participants(meeting_code)`, con la sesión HTTP por parámetro.
  - Tests con una sesión HTTP falsa y las respuestas guardadas en T03:
    - solo devuelve `displayName`, aunque traiga `user` o `phoneUser` (CA-17);
    - excluye al profesor (CA-09);
    - sigue las páginas, como mucho 10;
    - `403` → `MeetingAccessDeniedError`; `404` → `MeetingNotFoundError`; sin `activeConference` → `MeetingNotInProgressError`; `5xx`, tiempo agotado o sin red → `MeetServiceError`; sin `google-client.json` → `MeetNotConfiguredError`;
    - cada llamada lleva un tiempo máximo de 10 s;
    - el permiso se guarda con permisos `0600`;
    - nada de la respuesta de Google llega a los registros (`caplog`).
  - El flujo OAuth real (abrir Google, esperar como mucho 2 minutos → `MeetLoginNotCompletedError`) se verifica a mano en T16.
  - *Cubre:* CA-09, CA-11 a CA-14, CA-17.

## Fase D · Casos de uso (plan §2.2, §2.9, §2.11)

- [ ] **T10** 🧪 · `usecases/sessions.py` y `usecases/checkins.py`:
  - `create_session` con modo: en `automatic`, el enlace es obligatorio y se guarda su código; en `code`, se ignora.
  - `teacher_view`: sin código ni cuenta atrás en modo automático (CA-02).
  - `check_in` en una clase automática → `NotCodeSessionError`, después de comprobar si está cerrada.
  - *Cubre:* CA-01, CA-02, CA-03.
- [ ] **T11** 🧪 · `usecases/attendance.py`: `sync_from_meeting(conn, fetch_participants, session_id, t)` → `added`, `in_call`, `total`.
  - Tests en `test_attendance.py`, con una función de participantes falsa:
    - primera toma (CA-05);
    - segunda toma con repetidos (otra tilde o mayúscula) y uno nuevo → `added = 1` (CA-06);
    - alguien que sale sigue en la lista (CA-07);
    - reunión vacía (CA-10);
    - clase de código o cerrada → `409`; clase inexistente → `SessionNotFoundError`;
    - si la función de participantes falla, no se guarda nada;
    - todo en una transacción, con la hora de la toma.
  - *Cubre:* CA-05, CA-06, CA-07, CA-10.

## Fase E · Entradas (plan §2.9, §4)

- [ ] **T12** 🧪 · Entrada web:
  - `create_app(..., fetch_participants=None)`; `POST /api/sessions` con `mode` y `meeting`; `mode` en `GET /api/sessions`, `GET /api/sessions/<id>` (con `meetingCode`, sin `code` ni `studentUrl` en modo automático) y `GET /api/s/<id>`.
  - Ruta `POST /api/sessions/<id>/meet-sync` → `{added, inCall, total}`.
  - Los errores de plan §2.7 en la tabla de `errors.py` (un test ya comprueba que no falta ninguno).
  - Tests nuevos en `test_web_meet.py`: crear en modo automático, `mode` desconocido → `400`, enlace mal escrito → `422`, `meet-sync` correcto, `409`, `422` y `502` con sus mensajes, `401` sin token, y quitar y exportar en una clase automática (CA-16).
  - Cambian los tests de la spec 001 que comparan el JSON completo, para incluir `mode`.
  - *Cubre:* CA-01, CA-02, CA-04, CA-13, CA-14, CA-16.
- [ ] **T13** 🧪 · Atajo `python app.py --meet <código>` (decisión §8.2): `entrypoints/cli.py` y `app.py`.
  - Valida el código antes de arrancar; crea la clase automática y hace la primera toma con los mismos casos de uso (C3); imprime cuántos se registraron y el enlace del panel **a esa clase** (`#t=…&s=…`).
  - Si la toma falla, imprime el mensaje del error y arranca igualmente, para poder reintentar desde el panel.
  - Combinable con `--tunel`. `app.py` monta `GoogleMeet` con las rutas de `Config` (C4).
  - Tests en `test_cli.py` y `test_app.py` (solo se simulan Google y `Flask.run`, T4).
  - *Cubre:* HU-01.

## Fase F · Interfaz (plan §4)

- [ ] **T14** · `static/`:
  - `profesor.html/.js`:
    - grupo de `radio` **Código / Automático (Meet)**; el campo del enlace de Meet solo aparece con Automático;
    - en una clase automática, tarjeta con el código de la reunión y el botón **"Tomar asistencia ahora"**, que muestra el resultado en `role="status"` y se desactiva mientras espera;
    - sin tarjeta de código en una clase automática;
    - etiqueta **"código"** / **"Meet"** en la lista de clases.
  - `alumno.js`: "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." en clases automáticas.
  - `styles.css`: estilos del selector y de la etiqueta.
  - *Cubre:* CA-01, CA-02, CA-04, CA-10 (mensaje), CA-16.
  - *Hecha cuando:* revisada en el navegador a 400 px y con teclado (P5), y la clase de código sigue igual que antes.

## Fase G · Verificación y cierre

- [ ] **T15** · Lista de comprobación de `ARCHITECTURE.md` §13, anotada aquí punto por punto, y `ruff` y `mypy` sin avisos.
  - *Cubre:* todos (revisión).
- [ ] **T16** 👤 · Prueba real en Meet (Victor, con su cuenta y otro dispositivo):
  1. `python app.py --meet <código>` → abre Google la primera vez (CA-11) y registra a los presentes sin el profesor (CA-05, CA-09).
  2. Entra otra persona → "Tomar asistencia ahora" → se añade 1 (CA-06).
  3. Sale alguien → nueva toma → sigue en la lista (CA-07).
  4. Un invitado sin nombre aparece como "Invitado sin nombre" y se puede quitar (CA-08, CA-16).
  5. Cerrar la app y volver a arrancarla otro día → no pide permiso (CA-12).
  6. Con la segunda cuenta → mensaje de CA-13. CA-15 según el spike.
  7. Descargar el CSV: solo nombres y horas (CA-16, CA-17).
  8. La consola no muestra nombres, IPs ni nada de Google (E7).
- [ ] **T17** · Cierre:
  - borrar `scripts/spike_meet.py`;
  - README: sección "Modo automático (Google Meet)" con la preparación de Google Cloud paso a paso, el uso de `--meet` y las variables nuevas;
  - AGENT.md: comandos, estructura y estado;
  - spec: nota en CA-15 según el spike;
  - comprobar que `pytest`, `ruff` y `mypy` pasan y que los puertos quedan libres;
  - definición de terminado (AGENT.md §6).
