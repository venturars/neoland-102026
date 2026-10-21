# Tareas 004 · Asistencia automática desde Google Meet

> Estado: **Borrador (pendiente de aprobación)** · Plan: [plan.md](plan.md) · Creado: 2026-10-21

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- `👤` = necesita que **Victor** haga algo con su cuenta de Google (nadie más puede hacerlo por él).
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- **Puerta de la Fase A:** si el spike (T03) falla, se para todo y se revisa la spec (plan §0).

---

## Fase A · Prueba de concepto (plan §0)

Antes de tocar la app, comprobamos que Google deja hacer lo que necesitamos con una cuenta gratuita.

- [ ] **T01** · Dependencia nueva:
  - Añadir `google-auth-oauthlib` a `requirements.txt` y ejecutar `pip install -r requirements.txt`.
  - *Hecha cuando:* `python -c "import google_auth_oauthlib"` no da error y `pytest` sigue con 77 tests en verde.
- [ ] **T02** 👤 · Preparar Google Cloud (Victor, guiado paso a paso; unos 15 min):
  1. Crear un proyecto en Google Cloud Console.
  2. Activar la **Google Meet REST API**.
  3. Configurar la pantalla de consentimiento: tipo *Externo*, scopes `meetings.space.readonly` y `openid`, y **publicarla "En producción"** sin verificar (plan §8.1).
  4. Crear credenciales **OAuth de tipo "Aplicación de escritorio"** y guardar el JSON como `data/google-client.json`.
  - *Hecha cuando:* el archivo existe en `data/` y `git status` **no** lo muestra.
- [ ] **T03** 👤 · Spike: `scripts/spike_meet.py` (desechable):
  - Inicia sesión con Google, pide un código de reunión e imprime:
    - cada participante activo: tipo (`signedinUser`/`anonymousUser`/`phoneUser`), `displayName` y `user`;
    - el `sub` de la cuenta que ha iniciado sesión.
  - Victor crea una reunión con su cuenta gratuita, se une desde otro dispositivo (con otra cuenta o como invitado) y lo ejecuta.
  - Responde y anota aquí:
    - [ ] ¿Lee los participantes con una cuenta **gratuita**? (si **no** → **parar**, plan §0)
    - [ ] ¿`users/<sub>` coincide con el profesor? (si no → excluir por nombre, plan §2.4)
    - [ ] ¿Qué ve una **segunda cuenta** que no organiza la reunión? (decide CA-13 y CA-15, plan §2.5)
    - [ ] ¿Qué pasa si la reunión **no está en curso** o el código no existe? (mensajes de CA-14)
  - *Cubre:* riesgo de §0; base de CA-09, CA-13, CA-14, CA-15.
  - *Hecha cuando:* las cuatro preguntas tienen respuesta. Si alguna obliga a cambiar el plan o la spec, se actualizan **antes** de seguir.

## Fase B · Lógica pura (sin servidor ni red)

- [ ] **T04** 🧪 · `asistencia/meet.py`: `parse_meeting_code(text)`.
  - Tests en `tests/test_meet.py`: acepta `abc-defg-hij`, el enlace completo `https://meet.google.com/abc-defg-hij` (con o sin `?authuser=…`), mayúsculas y espacios alrededor. Rechaza textos vacíos, otros dominios y formatos incorrectos con `ValueError`.
  - *Cubre:* CA-14.
- [ ] **T05** 🧪 · `asistencia/meet.py`: `participant_names(raw_participants, self_user)`.
  - Tests con JSON de ejemplo **copiado del spike** (sin datos reales):
    - devuelve solo `displayName`, aunque traiga `user` o `phoneUser`;
    - excluye al profesor;
    - vacío → "Invitado sin nombre"; varios → numerados (`2`, `3`…);
    - más de 60 caracteres → recortado.
  - *Cubre:* CA-08, CA-09, CA-17.

## Fase C · Base de datos

- [ ] **T06** 🧪 · `asistencia/db.py`: columnas `mode` y `meeting_code`.
  - `init_schema()` las añade a una BD antigua (test: crear una BD con el esquema de la spec 001, insertar una sesión, migrar → sigue ahí con `mode = 'codigo'`).
  - `create_session(..., mode='codigo', meeting_code=None)`; `get_session` y `list_sessions` devuelven `mode`.
  - *Cubre:* CA-01, CA-03, CA-04.
  - *Hecha cuando:* los 77 tests anteriores siguen en verde y la migración funciona con **una copia** de `data/asistencia.db` de Victor.

## Fase D · Servidor

- [ ] **T07** 🧪 · Modo al abrir clase: `POST /api/sessions` con `{mode, meeting}`; `mode` en `GET /api/sessions`; vista de sesión sin `code`, `secondsLeft` ni `studentUrl` en modo automático.
  - *Cubre:* CA-01, CA-02, CA-04, CA-14 (`400` con enlace mal escrito).
- [ ] **T08** 🧪 · Check-in por código bloqueado en modo automático: `409` con el mensaje del plan §4; `GET /api/s/<id>` incluye `mode`.
  - *Cubre:* CA-02, CA-03.
- [ ] **T09** 🧪 · `create_app(..., meet=None)`, `FakeMeet` y fixture en `tests/conftest.py`. Ruta `POST /api/sessions/<id>/meet-sync` → `{added, inCall, total}`.
  - Tests:
    - primera toma (CA-05);
    - segunda toma con repetidos y tildes (CA-06);
    - alguien que sale sigue en la lista (CA-07);
    - reunión vacía (CA-10);
    - `MeetError` → `502` con el mensaje (CA-13, CA-14);
    - clase de código o cerrada → `409`;
    - sin token → `401`;
    - quitar y exportar en una clase automática (CA-16).
  - *Cubre:* CA-05, CA-06, CA-07, CA-10, CA-13, CA-14, CA-16.
- [ ] **T10** · `asistencia/meet.py`: `GoogleMeet` real.
  - Carga o renueva el permiso de `data/google-token.json`. Si no hay permiso, abre el inicio de sesión de Google (CA-11).
  - Hace las dos llamadas del plan §2.1 y pasa el resultado por `participant_names`.
  - Traduce los errores de Google (`403`, `404`, sin reunión en curso) a `MeetError` en español.
  - Sin test automático, porque necesita Google (plan §2.7). Se verifica en T13.
  - *Cubre:* CA-11, CA-12, CA-13, CA-14.
- [ ] **T11** · `app.py --meet <código>` (combinable con `--tunel`):
  - valida el código antes de arrancar;
  - crea la clase automática y hace la primera toma;
  - imprime cuántos se registraron y el enlace del panel **a esa clase** (`#t=…&s=…`).
  - Si la toma falla, imprime el error y arranca igualmente, para poder reintentar desde el panel.
  - *Cubre:* HU-01 (plan §8.2).

## Fase E · Interfaz

- [ ] **T12** · `static/`:
  - `profesor.html/.js`:
    - grupo de `radio` **Código / Automático (Meet)**; el campo del enlace de Meet solo aparece con Automático;
    - en una clase automática, tarjeta con el código de la reunión y el botón **"Tomar asistencia ahora"**, que muestra el resultado en `role="status"` y se desactiva mientras espera;
    - sin tarjeta de código;
    - etiqueta **"código"** / **"Meet"** en la lista de clases.
  - `alumno.js`: mensaje "Esta clase no usa código…" en clases automáticas.
  - `styles.css`: estilos del selector y de la etiqueta.
  - *Cubre:* CA-01, CA-02, CA-04, CA-10 (mensaje), CA-16.
  - *Hecha cuando:* revisada a 400 px y con teclado (P5), y la clase de código sigue igual que antes.

## Fase F · Verificación y cierre

- [ ] **T13** 👤 · Prueba real en Meet (Victor, con su cuenta y otro dispositivo):
  1. `python app.py --meet <código>` → abre Google la primera vez (CA-11), registra a los presentes sin el profesor (CA-05, CA-09).
  2. Entra otra persona → "Tomar asistencia ahora" → `added = 1` (CA-06).
  3. Sale alguien → nueva toma → sigue en la lista (CA-07).
  4. Un invitado sin nombre aparece como "Invitado sin nombre" y se puede quitar (CA-08, CA-16).
  5. Cerrar la app, volver a arrancarla otro día → no pide permiso (CA-12).
  6. Con la segunda cuenta → mensaje de CA-13. CA-15 según el spike.
  7. Descargar el CSV: solo nombres y horas (CA-16, CA-17).
- [ ] **T14** · Cierre:
  - borrar `scripts/spike_meet.py`;
  - README: sección "Modo automático (Google Meet)" con la preparación de Google Cloud paso a paso y el uso de `--meet`;
  - AGENT.md: comandos, estructura y estado; corregir "Las únicas dependencias son Flask y pytest";
  - spec: nota en CA-15 según el spike;
  - comprobar que `pytest` pasa y que el puerto 8000 queda libre;
  - definición de terminado (AGENT.md §6).
