# Plan técnico 004 · Asistencia automática desde Google Meet

> Estado: **Aprobado** (2026-10-21) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-21

Este documento explica **cómo** construimos lo que pide la spec 004. Se apoya en todo lo que ya existe de la spec 001: misma app, misma base de datos, mismo panel. Solo se añade una **segunda forma de llenar la lista**.

---

## 0. Riesgo principal: verificarlo antes de construir

La documentación de Google no deja del todo claro si la API de Meet funciona con una **cuenta de Google gratuita** (Neoland no tiene plan de pago, spec P6). Algunas fuentes dicen que "en general" hace falta Workspace.

Por eso la **primera tarea es una prueba de concepto** (*spike*): un script desechable que, con la cuenta gratuita de Victor, lea los participantes de una reunión real.

- **Si funciona**, se sigue con el resto del plan.
- **Si no funciona**, se **para** y se vuelve a la spec: el modo automático no sería posible sin plan de pago, y habría que replantearlo (p. ej. Discord, spec 002).

La misma prueba responde a otras dos dudas (ver §2.4 y §2.5):
- si el identificador del profesor en Meet coincide con el de su login, para excluirle (CA-09);
- qué ve una cuenta que **no** organiza la reunión (CA-13, CA-15).

---

## 1. Visión general

```
 Navegador del PROFESOR
 profesor.html  ── "Tomar asistencia ahora" ──┐
                                              ▼
 ┌──────────────────────────── app.py (Flask) ─────────────────────────────┐
 │  POST /api/sessions/<id>/meet-sync                                      │
 │        │                                                                │
 │        ▼                                                                │
 │  asistencia/meet.py ── HTTPS ──► API de Google Meet                     │
 │        │  (nombres de quienes están en la llamada)                      │
 │        ▼                                                                │
 │  asistencia/names.py + db.add_checkin  ──► data/asistencia.db           │
 └─────────────────────────────────────────────────────────────────────────┘
```

- La **clase** sigue siendo una sesión normal, con un campo nuevo: su **modo** (`codigo` o `automatico`).
- En modo automático, el botón **"Tomar asistencia ahora"** pide a Google la lista de **quién está ahora** en la reunión y añade a cada persona como un registro más, con la **misma regla anti-duplicados** de la spec 001 (`name_key` y la restricción `UNIQUE`).
- Pulsarlo otra vez solo añade a los nuevos. **Nunca se borra** a nadie por haber salido (CA-07).
- Atajo de línea de comandos para el caso "estoy en la reunión y lanzo un comando":
  `python app.py --meet abc-defg-hij` (combinable con `--tunel`). Crea la clase automática, toma asistencia una vez e imprime el enlace del panel **directamente a esa clase**.

---

## 2. Decisiones clave

### 2.1 Cómo se habla con Google (CA-05, CA-14)
Dos llamadas a la API REST de Meet v2:

1. `GET spaces/{códigoReunión}` → si hay reunión en curso, devuelve `activeConference.conferenceRecord`.
   - Sin `activeConference`: "La reunión no está en curso. Toma la asistencia mientras la clase está en marcha." (CA-14)
   - `404`: "No existe ninguna reunión con ese código. Revisa el enlace de Meet." (CA-14)
   - `403`: mensaje de CA-13.
2. `GET {conferenceRecord}/participants?filter=latest_end_time IS NULL&pageSize=250` → **solo quienes siguen en la llamada** (spec P2). Se siguen las páginas (`nextPageToken`) aunque con ≤ 100 personas cabrá en una.

El código de reunión se acepta pegando el **enlace completo** (`https://meet.google.com/abc-defg-hij`) o solo el código. Se valida con el patrón `xxx-xxxx-xxx` antes de llamar a Google.

### 2.2 Permiso de Google (CA-11, CA-12)
- Google exige **OAuth**: el profesor inicia sesión en Google y acepta que la app "vea información sobre sus reuniones de Meet".
- Permisos (*scopes*) mínimos:
  - `https://www.googleapis.com/auth/meetings.space.readonly`: solo lectura;
  - `openid`: para saber qué cuenta es, y excluirla (§2.5).
  - **No** se pide el email.
- **Primera vez** (CA-11): al pulsar "Tomar asistencia ahora" sin permiso guardado, la app abre el navegador **del ordenador donde corre** con la pantalla de Google. Al aceptar, la toma de asistencia continúa sola.
  - Es el flujo estándar de Google para apps de escritorio ("loopback": Google devuelve el permiso a `http://localhost:<puerto>`).
- **Siguientes veces** (CA-12): el permiso se guarda en `data/google-token.json` y se renueva solo.
- La "llave" de la app (`client_secret`) la crea el profesor **una vez** en Google Cloud y la guarda en `data/google-client.json`. El README explica los pasos.
- Ambos archivos están en `data/`, que **no se sube a git**.

**Ojo con los 7 días:** si la app de Google Cloud queda en estado *Testing*, Google **caduca el permiso cada 7 días** y habría que volver a iniciar sesión cada semana (incumple CA-12).
- Propuesta: ponerla en estado **"En producción" sin verificar**. Google muestra un aviso ("Google no ha verificado esta aplicación", se pulsa *Avanzado → Continuar*), pero el permiso ya no caduca semanalmente.
- Es válido para uso propio (hasta 100 usuarios). Decidido por Victor: producción sin verificar (§8).

### 2.3 Del participante al nombre (CA-05, CA-08, CA-17)
Cada participante llega como `signedinUser`, `anonymousUser` o `phoneUser`, todos con `displayName`.

- Se toma **solo `displayName`**. Del resto (identificador de cuenta, número de teléfono parcial…) **no se guarda nada** (constitución P4 v2.2). El email no llega, porque no se pide.
- Nombre vacío → **"Invitado sin nombre"** (CA-08).
  - Si en una misma toma hay varios, se numeran: "Invitado sin nombre", "Invitado sin nombre 2"…
  - Así no se pierden en la regla anti-duplicados, y al repetir la toma no se duplican.
- Nombre de más de 60 caracteres: se **recorta** a 60 en vez de rechazarlo (el alumno no puede corregirlo, como sí puede en modo código).
- Después se aplica `name_key()` (de `asistencia/names.py`) y `db.add_checkin()`, sin cambios.

### 2.4 Excluir al profesor (CA-09)
- Con `openid`, el permiso trae el identificador de la cuenta (`sub`).
- Se descarta el participante cuyo `signedinUser.user` sea `users/<sub>`.
- Ese identificador **solo se usa en memoria**; no se guarda en la base de datos.
- *A confirmar en el spike (§0):* que `users/<id>` de Meet coincide con el `sub` del login.
  - Si no coincide, alternativa: pedir también el scope `profile` y excluir por nombre visible.

### 2.5 Coorganizador (HU-06, CA-15, opcional)
En cuentas gratuitas de Meet, la figura de **coanfitrión no existe**: es una función de Workspace de pago. Además, la API solo enseña los participantes a quien es **dueño** de la reunión.

- Lo más probable es que **HU-06 no sea viable** sin plan de pago.
- El spike lo comprueba con una segunda cuenta.
- Si no es viable, CA-15 se marca "no aplicable" con una nota en la spec. CA-13 sí se cumple: es justo el mensaje que verá esa cuenta.

### 2.6 Modo por clase (CA-01 a CA-04)
- Al abrir una clase se elige **Código** (por defecto, igual que ahora) o **Automático (Meet)**. Con Automático se pide además el enlace de Meet.
- El modo **no se puede cambiar** después (spec P3: nunca los dos a la vez).
- En modo automático:
  - **No** se calcula ni se muestra código, ni enlace de alumnos (CA-02).
  - Si alguien abre `alumno.html?s=<id>`, ve "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." El servidor rechaza cualquier check-in por código con `409`.
- En modo código todo sigue **exactamente igual** que en la spec 001 (CA-03). Los 77 tests actuales deben seguir pasando sin cambios.
- El panel muestra una etiqueta **"código"** o **"Meet"** en cada clase (CA-04).
- Una clase automática **cerrada** no acepta más tomas: `409`, "La asistencia de esta clase ya está cerrada."

### 2.7 La llamada a Google se puede sustituir en los tests
- `create_app(..., meet=None)` recibe un objeto con un único método `participants(meeting_code) -> list[str]` (nombres ya limpios, sin el profesor), que lanza `MeetError(mensaje)` si algo falla.
- En producción es el cliente real de `asistencia/meet.py`. En los tests, un **cliente falso** que devuelve la lista que decida cada test.
- Así **ningún test toca la red ni Google**, igual que el reloj falso de la spec 001.

### 2.8 Horas
- Todos los registros de una misma toma llevan **la hora de la toma** (`now_iso()`).
- Es la hora a la que se comprobó que estaban, no la hora a la que entraron: la spec deja fuera los tiempos de entrada y salida.

---

## 3. Modelo de datos

Dos columnas nuevas en `sessions`. `checkins` **no cambia**.

```sql
ALTER TABLE sessions ADD COLUMN mode TEXT NOT NULL DEFAULT 'codigo';  -- 'codigo' | 'automatico'
ALTER TABLE sessions ADD COLUMN meeting_code TEXT;                    -- 'abc-defg-hij' o NULL
```

- **Migración:** las bases de datos ya existentes (la de Victor) no tienen esas columnas, y `CREATE TABLE IF NOT EXISTS` no las añade.
  - `init_schema()` comprueba las columnas con `PRAGMA table_info(sessions)` y ejecuta los `ALTER TABLE` que falten.
  - Las clases antiguas quedan como `codigo`, que es lo que eran.
- `meeting_code` es un dato de la **reunión**, no del alumno: no afecta a P4.
- Nombre genérico (no `meet_code`) para que sirva a otras plataformas (P1).

---

## 4. API (cambios sobre la spec 001)

| Método y ruta | Cambio |
| --- | --- |
| `POST /api/sessions` | Cuerpo `{title?, mode?, meeting?}`. `mode` por defecto `codigo`. Con `automatico`, `meeting` es obligatorio y se valida (`400` "Pega el enlace o el código de la reunión de Meet (p. ej. abc-defg-hij).") |
| `GET /api/sessions` | Cada clase incluye `mode` |
| `GET /api/sessions/<id>` | Incluye `mode` y `meetingCode`. En modo automático **sin** `code`, `secondsLeft` ni `studentUrl` |
| **`POST /api/sessions/<id>/meet-sync`** (nueva) | `200 {added, inCall, total}` · `409` si la clase es de modo código o está cerrada · `502 {error}` con el mensaje de `MeetError` (CA-13, CA-14) · `404` |
| `GET /api/s/<id>` | Incluye `mode` |
| `POST /api/s/<id>/checkin` | `409` "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." si `mode = automatico` |

Respuesta de la toma, que el panel muestra tal cual:
- "Añadidas 3 personas nuevas · 12 en la llamada ahora".
- Lista vacía: "No hay participantes en la reunión" (CA-10).

---

## 5. Archivos

```
asistenciapp/
├── requirements.txt       # + google-auth-oauthlib (y requests, que ya trae)
├── app.py                 # modo en POST /api/sessions, ruta meet-sync, check-in bloqueado en modo automático,
│                          # create_app(..., meet=None), opción --meet <código>
├── asistencia/
│   ├── db.py              # migración de columnas; create_session(..., mode, meeting_code); list/get con mode
│   └── meet.py            # NUEVO:
│                          #   parse_meeting_code(text)        → 'abc-defg-hij' o ValueError
│                          #   participant_names(raw, self_id) → nombres limpios (puro, sin red)
│                          #   class MeetError(Exception)
│                          #   class GoogleMeet: participants(code) — OAuth + las dos llamadas de §2.1
├── static/
│   ├── profesor.html/.js  # selector de modo + campo de Meet; tarjeta "Tomar asistencia ahora";
│                          # etiqueta de modo en el panel; sin tarjeta de código en modo automático
│   ├── alumno.js          # mensaje "Esta clase no usa código…" en modo automático
│   └── styles.css         # estilo del selector de modo y de la etiqueta
├── tests/
│   ├── conftest.py        # + FakeMeet y fixture `meet`
│   ├── test_meet.py       # NUEVO: parse_meeting_code, participant_names (con JSON de ejemplo de Google)
│   └── test_api.py        # + tests de modo, meet-sync y check-in bloqueado
├── scripts/spike_meet.py  # NUEVO y desechable: prueba de concepto de §0 (se borra al terminar)
└── README.md              # sección "Modo automático (Google Meet)": preparar Google Cloud paso a paso
```

`data/google-client.json` y `data/google-token.json` se crean en `data/`, ya ignorada por git.

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01 | `test_api`: crear clase con `mode` `codigo` y `automatico`; modo no válido → `400` |
| CA-02 | `test_api`: la vista de una clase automática no trae `code` ni `studentUrl`; check-in por código → `409` |
| CA-03 | Los 77 tests existentes pasan **sin cambios**; `meet-sync` en clase de código → `409` |
| CA-04 | `test_api`: `GET /api/sessions` incluye `mode`. Manual: etiqueta visible en el panel |
| CA-05 | `test_api` con `FakeMeet`: 3 nombres → 3 registros con la hora de la toma |
| CA-06 | `test_api`: segunda toma con 2 repetidos (uno con otra tilde o mayúscula) + 1 nuevo → `added = 1` |
| CA-07 | `test_api`: segunda toma sin una persona → sigue en la lista |
| CA-08 | `test_meet`: `displayName` vacío → "Invitado sin nombre", varios → numerados; nombre de 80 caracteres → recortado |
| CA-09 | `test_meet`: el participante `users/<sub>` no sale. Manual en el spike y en la prueba final |
| CA-10 | `test_api`: `FakeMeet` vacío → mensaje "No hay participantes en la reunión" |
| CA-11, CA-12 | Manual: primera toma abre Google; segunda toma, otro día, no |
| CA-13 | `test_api`: `FakeMeet` lanza `MeetError` → `502` con el mensaje. Manual con una segunda cuenta en el spike |
| CA-14 | `test_meet`: códigos y enlaces válidos y no válidos. `test_api`: `400` con enlace mal escrito |
| CA-15 | Manual en el spike (probablemente "no aplicable", §2.5) |
| CA-16 | `test_api`: quitar y exportar en una clase automática |
| CA-17 | `test_meet`: el resultado son solo nombres, aunque el JSON traiga `user` y `phoneUser`. Revisión del esquema: no hay columnas nuevas en `checkins` |

---

## 7. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | Meet es una **fuente adicional**. El núcleo (sesiones, registros, panel, CSV) no cambia. Lo específico de Google vive solo en `asistencia/meet.py`. Columnas genéricas (`mode`, `meeting_code`) |
| P2 Simplicidad | ✅ | Toma bajo demanda (un botón), sin escuchar eventos en tiempo real ni colas. Reutiliza `add_checkin` y `name_key` |
| P3 Dependencias mínimas | ⚠️ Justificada | **`google-auth-oauthlib`** (oficial de Google; trae `google-auth` y `requests`). Resuelve el inicio de sesión con Google, guardar el permiso y renovarlo. Hacerlo a mano con la biblioteca estándar es más código y es **delicado en seguridad**. Las llamadas a la API son dos peticiones HTTP: no hace falta la librería cliente completa de Google |
| P4 Privacidad (v2.2) | ✅ | Se guarda solo `displayName` y la hora. No se pide el email (sin scope `email`). El identificador de cuenta del profesor solo se usa en memoria. Credenciales en `data/`, fuera de git |
| P5 Accesible y móvil | ✅ | El selector de modo es un grupo de `radio` con `<label>`. Mensajes en `role="status"`. Verificación manual a 400 px |
| P6 Español | ✅ | Todos los mensajes nuevos en español (§2.1, §4) |
| §3 Stack | ✅ | Sin cambios: Python + Flask + `sqlite3` + frontend sin frameworks |
| §5 Calidad | ✅ | Cada CA con test o paso manual (§6). Google se sustituye por un cliente falso en los tests |
| §6 Seguridad | ✅ | Solo permiso de **lectura**. `meet-sync` requiere el token del profesor. Una clase cerrada no admite tomas. El modo automático no expone código |

---

## 8. Decisiones tomadas por Victor

1. **Estado de la app en Google Cloud** (2026-10-21): **"En producción" sin verificar**. Hay un aviso de Google al iniciar sesión, pero el permiso no caduca cada semana (§2.2, CA-12).
2. **Atajo `--meet`** (2026-10-21): **sí** (§1).
3. **Spike primero** (2026-10-21): si la cuenta gratuita no puede leer participantes, se para y se revisa la spec (§0).
