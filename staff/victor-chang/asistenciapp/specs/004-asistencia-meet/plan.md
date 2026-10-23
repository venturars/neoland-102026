# Plan técnico 004 · Asistencia automática desde Google Meet

> Versión 2.0 · Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.1 · Arquitectura: [ARCHITECTURE.md](../../ARCHITECTURE.md) v1.1 · Constitución v3.1 · Creado: 2026-10-21 · Reescrito: 2026-10-23

Este documento explica **cómo** construimos lo que pide la spec 004 sobre el código ya adaptado a `ARCHITECTURE.md` (spec 005). Meet es una **segunda forma de llenar la lista**: una entrada nueva que llama a casos de uso, y una pieza de infraestructura nueva que habla con Google (C3, P1). Las reglas se citan por su identificador (`C2`, `E4`…).

La versión 1.0 (aprobada el 2026-10-21) se escribió para la estructura anterior; queda en el historial de git. Esta versión conserva sus decisiones (§8) y las aplica a las capas.

---

## 0. Riesgo principal: verificarlo antes de construir

La documentación de Google no deja del todo claro si la API de Meet funciona con una **cuenta de Google gratuita** (Neoland no tiene plan de pago, spec P6).

Por eso la **primera tarea es una prueba de concepto** (*spike*): un script desechable que, con la cuenta gratuita de Victor, lea los participantes de una reunión real.

- **Si funciona**, se sigue con el resto del plan.
- **Si no funciona**, se **para** y se vuelve a la spec (decisión §8.3).

La misma prueba responde a cuatro dudas que cambian detalles de este plan:
1. si el identificador del profesor en Meet coincide con el de su inicio de sesión, para excluirle (CA-09, §2.5);
2. qué ve una cuenta que **no** organiza la reunión (CA-13, CA-15, §2.6);
3. qué responde Google si la reunión no existe o no está en curso (CA-14, §2.7);
4. si `ALTER TABLE … ADD COLUMN` con `CHECK` funciona en el SQLite del proyecto (3.49) como se espera (§3).

El spike guarda **ejemplos de respuesta de Google, con los nombres cambiados** (P4), para los tests de §2.10.

---

## 1. Visión general

```
 profesor.html ── "Tomar asistencia ahora" ──► entrypoints/web/teacher.py  POST /api/sessions/<id>/meet-sync
 app.py --meet abc-defg-hij ─────────────────► entrypoints/cli.py
                                                     │  (las dos entradas llaman a los mismos casos de uso, C3)
                                                     ▼
                                   usecases/attendance.py: sync_from_meeting
                                     │                 │                     │
                                     ▼                 ▼                     ▼
                         domain/participants.py   infra/storage.py   participantes de la reunión
                         (nombres de la plataforma (add_checkin,     (una función inyectada; en la app,
                          → nombres de la lista)   una transacción)   infra/google_meet.py → API de Meet)
```

- La **clase** sigue siendo una sesión, con dos campos nuevos: su **modo** (`code` o `automatic`) y, en modo automático, su **código de reunión**.
- "Tomar asistencia ahora" pide a Google **quién está ahora** en la reunión y registra a cada persona con la **misma regla anti-duplicados** de la spec 001 (`name_key` y la restricción `UNIQUE`). Repetirla solo añade a los nuevos; **nunca se borra** a nadie por salir (CA-06, CA-07).
- Atajo de línea de comandos (decisión §8.2): `python app.py --meet abc-defg-hij` (combinable con `--tunel`) crea la clase automática, toma asistencia una vez e imprime el enlace del panel **a esa clase**.

---

## 2. Decisiones clave

### 2.1 Dónde va cada pieza (C1, O1)

| Capa | Archivo | Qué hace |
| --- | --- | --- |
| Dominio | `domain/sessions.py` | `Mode` (`code` / `automatic`); `Session` y `SessionSummary` ganan `mode` y `meeting_code` |
| Dominio | `domain/participants.py` **(nuevo)** | `names_from_platform(display_names)`: de los nombres que da una plataforma a los nombres de la lista (invitados sin nombre, numeración, recorte). No sabe nada de Google: sirve también para Discord (C3, P1) |
| Dominio | `domain/errors.py` | Los errores nuevos de §2.7 |
| Casos de uso | `usecases/sessions.py` | `create_session` recibe el modo y el enlace; `teacher_view` no da código en modo automático |
| Casos de uso | `usecases/checkins.py` | `check_in` rechaza las clases automáticas (CA-02) |
| Casos de uso | `usecases/attendance.py` **(nuevo)** | `sync_from_meeting`: toma la asistencia de una reunión |
| Entrada | `entrypoints/web/teacher.py` | Modo al abrir clase; ruta `meet-sync` |
| Entrada | `entrypoints/cli.py` **(nuevo)** | El atajo `--meet` |
| Infraestructura | `infra/google_meet.py` **(nuevo)** | Único módulo que habla con Google (F4): permiso OAuth, las dos llamadas de §2.3 y el formato de los enlaces de Meet |
| Infraestructura | `infra/storage.py` | Columnas nuevas y su migración (§3) |
| Configuración | `config.py` | Rutas de los archivos de Google (§2.4) |

### 2.2 Los participantes llegan como una función (C4, M3, §12)

- El caso de uso recibe **una función** `fetch_participants(meeting_code) -> list[str]`: los nombres visibles de quienes están ahora en la reunión, **sin el profesor**.
- En la app es el método `participants` de un `GoogleMeet` que se crea en `app.py` (el punto de montaje, C4) y llega a `create_app` por parámetro. En los tests es una función falsa que devuelve la lista que decide cada test.
- **Sin `Protocol` ni clase base**: hay una sola implementación real, y una función con su tipo (`Callable[[str], list[str]]`) basta (ARCHITECTURE §12). Si llega Discord (spec 002) con su propia fuente, se revisa.
- `GoogleMeet` sí es una clase: guarda estado que comparten sus operaciones, las credenciales y la sesión HTTP (M3).

### 2.3 Cómo se habla con Google (CA-05, CA-14; F4)

Dos llamadas a la API REST de Meet v2, desde `infra/google_meet.py`:

1. `GET spaces/{códigoReunión}` → si hay reunión en curso, devuelve `activeConference.conferenceRecord`.
2. `GET {conferenceRecord}/participants?filter=latest_end_time IS NULL&pageSize=250` → **solo quienes siguen en la llamada** (spec P2). Se siguen las páginas (`nextPageToken`) hasta un máximo de 10.

Límites (F4):
- cada llamada lleva un **tiempo máximo de 10 s**;
- el primer inicio de sesión espera como mucho **2 minutos** a que el profesor acepte en el navegador;
- cualquier fallo se traduce a un error con nombre de §2.7, y el texto de la respuesta de Google **nunca** se registra ni se muestra (E5, E7).

El **enlace o código** de la reunión se acepta pegando el enlace completo (`https://meet.google.com/abc-defg-hij`, con o sin `?authuser=…`) o solo el código, con mayúsculas o espacios alrededor. `parse_meeting_code` lo valida con el patrón `[a-z]{3}-[a-z]{4}-[a-z]{3}` (`fullmatch`, E1) antes de llamar a Google. Es formato de Meet, así que vive en `infra/google_meet.py`; lo usa el caso de uso al abrir la clase.

### 2.4 Permiso de Google (CA-11, CA-12)

- Google exige **OAuth**: el profesor inicia sesión y acepta que la app "vea información sobre sus reuniones de Meet".
- Permisos mínimos: `meetings.space.readonly` (solo lectura) y `openid` (para saber qué cuenta es y excluirla, §2.5). **No** se pide el email (P4).
- **Primera vez** (CA-11): al tomar asistencia sin permiso guardado, la app abre el navegador **del ordenador donde corre** con la pantalla de Google (flujo de escritorio *loopback*, en un puerto libre que elige el sistema). Al aceptar, la toma continúa sola. Si en 2 minutos no se acepta → `MeetLoginNotCompletedError`.
  - El servidor de Flask atiende varias peticiones a la vez, así que el panel no se bloquea mientras tanto.
- **Siguientes veces** (CA-12): el permiso se guarda y se renueva solo.
- Archivos, leídos por `Config` (F5), los dos en `data/` (fuera de git):

  | Variable | Por defecto | Qué es |
  | --- | --- | --- |
  | `ASISTENCIA_GOOGLE_CLIENT` | `data/google-client.json` | La "llave" de la app, que el profesor crea una vez en Google Cloud (README) |
  | `ASISTENCIA_GOOGLE_TOKEN` | `data/google-token.json` | El permiso guardado. Se escribe con permisos `0600` (solo el usuario), porque es un secreto (X) |

- Estado de la app en Google Cloud: **"En producción" sin verificar** (decisión §8.1), para que el permiso no caduque cada 7 días.

### 2.5 Excluir al profesor (CA-09)

- Con `openid`, el permiso trae el identificador de la cuenta (`sub`). `GoogleMeet` descarta el participante cuyo `signedinUser.user` sea `users/<sub>`.
- Ese identificador **solo se usa en memoria**; no se guarda (P4).
- *A confirmar en el spike (§0.1).* Si no coincide, alternativa: pedir también `profile` y excluir por nombre visible.

### 2.6 Coorganizador (HU-06, CA-15, opcional)

En cuentas gratuitas de Meet la figura de coanfitrión no existe, y la API solo enseña los participantes al **dueño** de la reunión. Lo más probable es que HU-06 no sea viable: el spike lo comprueba con una segunda cuenta (§0.2). Si no lo es, CA-15 se marca "no aplicable" en la spec. CA-13 se cumple igualmente: es el mensaje que verá esa cuenta.

### 2.7 Errores nuevos (E3, E4, E5; decisión §8.5)

Todos heredan de `AppError` y llevan su mensaje como constante. Viven en `domain/errors.py`: así la tabla de la entrada web no depende de la infraestructura (C1), y la entrada CLI los imprime igual.

| Error | Cuándo | HTTP | Mensaje |
| --- | --- | --- | --- |
| `NotCodeSessionError` | Check-in por código en una clase automática (CA-02) | 409 | "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." |
| `NotAutomaticSessionError` | Tomar asistencia de Meet en una clase de código | 409 | "Esta clase usa código: los alumnos se registran con el enlace y el código." |
| `MeetingLinkInvalidError` | Enlace o código de Meet mal escrito, o que falta en modo automático (CA-14) | 422 | "Pega el enlace o el código de la reunión de Meet (p. ej. abc-defg-hij)." |
| `MeetingNotFoundError` | Google responde `404` (CA-14) | 422 | "No existe ninguna reunión con ese código. Revisa el enlace de Meet." |
| `MeetingNotInProgressError` | Sin `activeConference` (CA-14) | 422 | "La reunión no está en curso. Toma la asistencia mientras la clase está en marcha." |
| `MeetingAccessDeniedError` | Google responde `403` (CA-13) | 422 | "Esta cuenta no tiene acceso a la reunión. Pide al organizador de la reunión que tome la asistencia o que te haga coorganizador." |
| `MeetLoginNotCompletedError` | No se aceptó el permiso en 2 minutos (CA-11) | 422 | "No se completó el permiso de Google. Vuelve a pulsar «Tomar asistencia ahora» y acepta en la ventana de Google." |
| `MeetNotConfiguredError` | Falta `google-client.json` | 422 | "Falta la llave de Google de la app. Sigue los pasos de «Modo automático» en el README." |
| `MeetServiceError` | Google o la red fallan (`5xx`, tiempo agotado, sin conexión) | 502 | "Google Meet no responde ahora mismo. Inténtalo de nuevo en unos segundos." |

- Una clase automática **cerrada** responde a la toma con `SessionClosedError` (`409`, el de la spec 001).
- En cada fallo de Google se registra **solo el tipo de error y el código HTTP**, nunca el cuerpo de la respuesta, que lleva nombres (E7).

### 2.8 Del participante al nombre (CA-05, CA-08, CA-17)

`infra/google_meet.py` lee de cada participante (`signedinUser`, `anonymousUser` o `phoneUser`) **solo `displayName`**; del resto (identificador de cuenta, teléfono parcial…) no sale nada del módulo (P4, CA-17).

`domain/participants.names_from_platform(display_names)`:
- quita los espacios de los extremos;
- nombre vacío → **"Invitado sin nombre"** (CA-08); si en una misma toma hay varios, se numeran: "Invitado sin nombre", "Invitado sin nombre 2"…;
- más de 60 caracteres (`names.MAX_LENGTH`): se **recorta** a 60 en vez de rechazarlo, porque el alumno no puede corregirlo.

Después cada nombre pasa por `name_key` y `storage.add_checkin`, sin cambios.

*Límite conocido (spec CA-08, decisión §8.7):* los invitados sin nombre no se distinguen entre sí. Si uno sale y entra otro distinto, la segunda toma genera otra vez "Invitado sin nombre" y no lo añade.

### 2.9 Modo por clase (CA-01 a CA-04)

- Al abrir una clase se elige **Código** (por defecto, como ahora) o **Automático (Meet)**; con Automático se pide el enlace de Meet. El modo **no se puede cambiar** después (spec P3).
- Reglas, en los casos de uso:
  - `create_session`: en modo `automatic`, el enlace es obligatorio y se valida (§2.3); en modo `code`, se ignora.
  - `teacher_view`: sin código ni cuenta atrás en modo automático (CA-02).
  - `check_in`: en una clase automática → `NotCodeSessionError`, después de comprobar si está cerrada (mismo orden que la spec 001: cerrada → modo → nombre → código).
- En la entrada, `mode` se lee con `optional_str`; vacío = `code`; cualquier otro valor que no sea `code` o `automatic` → `MalformedRequestError` (`400`, E1).
- En modo código todo sigue **exactamente igual** que hoy (CA-03): los 240 tests actuales siguen en verde (solo cambian los que comparan el JSON completo, para incluir `mode`).

### 2.10 Pruebas sin Google (T2, T4)

- **Dominio y casos de uso**: `fetch_participants` falso, que devuelve una lista o lanza el error que decida el test.
- **`infra/google_meet.py`**: `GoogleMeet` recibe por parámetro su sesión HTTP; en los tests es una falsa que devuelve las respuestas de ejemplo guardadas en el spike (con nombres cambiados), o un `403`, `404`, `500`, o un tiempo agotado. Así se prueban sin red la paginación, la exclusión del profesor y la traducción de cada fallo (T4: se simula solo lo externo).
- El flujo OAuth real (abrir el navegador de Google) no se prueba de forma automática: se verifica a mano en la prueba final (CA-11, CA-12).
- **Entrada web y CLI**: con `create_app(..., fetch_participants=falsa)`.

### 2.11 Horas (D6)

Todos los registros de una misma toma llevan **la hora de la toma** (`to_iso(t)`): es la hora a la que se comprobó que estaban, no la de entrada (la spec deja fuera las entradas y salidas).

---

## 3. Modelo de datos

Dos columnas nuevas en `sessions`; `checkins` **no cambia**.

```sql
mode         TEXT NOT NULL DEFAULT 'code' CHECK (mode IN ('code', 'automatic')),
meeting_code TEXT CHECK (mode = 'code' OR meeting_code IS NOT NULL)
```

- Las reglas que deben cumplirse siempre (modo válido; toda clase automática tiene su reunión) las impone la propia base de datos (D5).
- **Migración** (D5): `init_schema()` comprueba las columnas con `PRAGMA table_info(sessions)` y añade las que falten con `ALTER TABLE … ADD COLUMN`. Las clases que ya existen quedan como `code`, que es lo que eran. La tabla nueva de una base de datos vacía ya nace con ellas.
- `meeting_code` es un dato de la **reunión**, no del alumno: no afecta a P4. Nombre genérico (no `meet_code`) para servir a otras plataformas (P1).

---

## 4. API (cambios sobre la spec 001)

| Método y ruta | Cambio |
| --- | --- |
| `POST /api/sessions` | Cuerpo `{title?, mode?, meeting?}`. `mode` por defecto `code`. En `automatic`, `meeting` es obligatorio (`422` `MeetingLinkInvalidError` si falta o está mal escrito); `mode` desconocido → `400`. Respuesta: `{id, title, mode}` |
| `GET /api/sessions` | Cada clase incluye `mode` |
| `GET /api/sessions/<id>` | Incluye `mode` y `meetingCode`. En modo automático, **sin** `code`, `secondsLeft` ni `studentUrl` |
| **`POST /api/sessions/<id>/meet-sync`** (nueva) | Sin cuerpo. `200 {added, inCall, total}` · `409` si la clase es de código o está cerrada · `422`/`502` con los errores de §2.7 · `404` si no existe · `401` sin token |
| `GET /api/s/<id>` | Incluye `mode` |
| `POST /api/s/<id>/checkin` | `409` `NotCodeSessionError` si la clase es automática |

- Los serializadores nuevos o ampliados viven en `entrypoints/web/serializers.py` (F2, D7). `teacher_view_json` solo incluye `studentUrl` en modo código: es elegir campos, no una regla del negocio.
- El panel compone el texto del resultado: "Añadidas 3 personas nuevas · 12 en la llamada ahora"; con `inCall = 0`, "No hay participantes en la reunión" (CA-10).

---

## 5. Archivos

```
asistenciapp/
├── requirements.txt                 # + google-auth-oauthlib (trae google-auth y requests)
├── app.py                           # monta GoogleMeet y la opción --meet <código>
├── attendance/
│   ├── config.py                    # + google_client_path, google_token_path
│   ├── domain/
│   │   ├── errors.py                # + errores de §2.7
│   │   ├── participants.py          # NUEVO: names_from_platform
│   │   └── sessions.py              # + Mode; mode y meeting_code en Session y SessionSummary
│   ├── usecases/
│   │   ├── attendance.py            # NUEVO: sync_from_meeting
│   │   ├── checkins.py              # check_in rechaza clases automáticas
│   │   └── sessions.py              # create_session con modo; teacher_view sin código en automático
│   ├── entrypoints/
│   │   ├── cli.py                   # NUEVO: atajo --meet
│   │   └── web/                     # create_app(..., fetch_participants); ruta meet-sync; errores; serializadores
│   └── infra/
│       ├── google_meet.py           # NUEVO: GoogleMeet, parse_meeting_code
│       └── storage.py               # columnas, migración, tipos con modo
├── static/
│   ├── profesor.html / .js          # selector de modo, campo de Meet, "Tomar asistencia ahora", etiqueta de modo
│   ├── alumno.js                    # aviso "Esta clase no usa código…"
│   └── styles.css                   # selector y etiqueta
├── tests/
│   ├── fixtures/meet/               # NUEVO: respuestas de ejemplo de Google, con nombres cambiados
│   ├── test_participants.py         # NUEVO
│   ├── test_attendance.py           # NUEVO
│   ├── test_google_meet.py          # NUEVO
│   ├── test_cli.py                  # NUEVO
│   └── test_web_meet.py             # NUEVO (+ cambios en test_web_*, test_sessions, test_checkins, test_storage, test_config)
├── scripts/spike_meet.py            # NUEVO y desechable (§0): se borra al terminar
└── README.md                        # sección "Modo automático (Google Meet)"
```

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01 | `test_web_teacher`: abrir con `mode` `code` y `automatic`; `mode` desconocido → `400` |
| CA-02 | `test_sessions`: vista automática sin código; `test_checkins` y `test_web_public`: check-in → `409` `NotCodeSessionError` |
| CA-03 | Los tests de la spec 001 siguen en verde; `meet-sync` en clase de código → `409` |
| CA-04 | `test_web_teacher`: `GET /api/sessions` incluye `mode`. Manual: etiqueta visible en el panel |
| CA-05 | `test_attendance`: 3 nombres → 3 registros con la hora de la toma, en una transacción |
| CA-06 | `test_attendance`: segunda toma con 2 repetidos (uno con otra tilde o mayúscula) + 1 nuevo → `added = 1` |
| CA-07 | `test_attendance`: segunda toma sin una persona → sigue en la lista |
| CA-08 | `test_participants`: vacío → "Invitado sin nombre"; varios → numerados; 80 caracteres → 60 |
| CA-09 | `test_google_meet`: el participante `users/<sub>` no sale. Manual en el spike y en la prueba final |
| CA-10 | `test_attendance`: reunión vacía → `inCall = 0`, `added = 0`. Manual: mensaje en el panel |
| CA-11, CA-12 | Manual: la primera toma abre Google; otro día no lo vuelve a pedir |
| CA-13 | `test_google_meet`: `403` → `MeetingAccessDeniedError`; `test_web_meet`: `422` con su mensaje. Manual con la segunda cuenta |
| CA-14 | `test_google_meet`: enlaces válidos y no válidos, `404`, sin reunión en curso; `test_web_meet`: `422` |
| CA-15 | Manual en el spike (probablemente "no aplicable", §2.6) |
| CA-16 | `test_web_meet`: quitar y exportar en una clase automática |
| CA-17 | `test_google_meet`: solo salen nombres aunque el JSON traiga `user` y `phoneUser`; `test_storage`: `checkins` no tiene columnas nuevas |

---

## 7. Comprobaciones

### 7.1 Constitución (v3.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | Meet es una entrada y una pieza de infraestructura nuevas; las reglas (`participants.py`, `sync_from_meeting`) no saben de Google. Columnas genéricas (`mode`, `meeting_code`) |
| P2 Simplicidad | ✅ | Toma bajo demanda (un botón); sin eventos en tiempo real, colas ni interfaces. Reutiliza `add_checkin` y `name_key` |
| P3 Dependencias mínimas | ⚠️ Justificada | **`google-auth-oauthlib`** (oficial de Google; trae `google-auth` y `requests`): resuelve el inicio de sesión, guardar el permiso y renovarlo. Hacerlo a mano es más código y **delicado en seguridad**. Las llamadas a la API son dos peticiones HTTP: no hace falta la biblioteca cliente completa |
| P4 Privacidad (v3.0) | ✅ | Solo `displayName` y la hora; sin el permiso de email; el `sub` del profesor solo en memoria; el permiso, en `data/` y con `0600`; nada de las respuestas de Google en los registros |
| P5 Accesible y móvil | ✅ | Selector de modo con `radio` y `<label>`; resultados en `role="status"`; revisión a 400 px y con teclado |
| P6 Español | ✅ | Todos los mensajes nuevos en español (§2.7) |
| §3 Stack | ✅ | Sin cambios |
| §5 Calidad | ✅ | Cada CA con test o paso manual (§6) |
| §6 Seguridad | ✅ | Solo lectura en Google; `meet-sync` exige el token del profesor; una clase cerrada no admite tomas; el modo automático no expone código |

### 7.2 Arquitectura (v1.1)

| Regla | Cómo |
| --- | --- |
| C1, C3 | Dos entradas (web y CLI) llaman a `sync_from_meeting`; el dominio no importa nada de Google |
| C2 | La ruta `meet-sync` y el atajo `--meet` solo validan, llaman al caso de uso y responden |
| C4, F5 | `GoogleMeet` se crea en `app.py` con las rutas de `Config`; `create_app` y la CLI lo reciben por parámetro |
| D3 | Todos los registros de una toma, en una sola transacción |
| D5 | `CHECK` en la propia BD y migración descrita en §3 |
| E3, E4 | Errores con nombre en el dominio; su código HTTP en la única tabla de `entrypoints/web/errors.py` |
| E7 | Ni nombres ni respuestas de Google en los registros |
| F4 | Un único módulo para Google, con tiempos máximos (10 s por llamada, 2 min para el permiso), y traducción de cada fallo |
| T4 | Solo se simulan Google (su sesión HTTP) y la función de participantes |
| §12 | Sin `Protocol`: la fuente de participantes es una función (§2.2) |

**Excepciones a la arquitectura:** ninguna nueva.

---

## 8. Decisiones tomadas por Victor

1. **Estado de la app en Google Cloud** (2026-10-21): **"En producción" sin verificar**. Hay un aviso de Google al iniciar sesión, pero el permiso no caduca cada semana (§2.4, CA-12).
2. **Atajo `--meet`** (2026-10-21): **sí** (§1).
3. **Spike primero** (2026-10-21): si la cuenta gratuita no puede leer participantes, se para y se revisa la spec (§0).
4. **Orden** (2026-10-23): primero se adapta el código a `ARCHITECTURE.md` (spec 005, terminada) y después se reescribe este plan.
5. **Errores de Meet** (2026-10-23): `422` para lo que el profesor puede arreglar; `502` solo cuando falla Google o la red. Cada caso es una excepción con nombre (§2.7).
6. **Valores de `mode`** (2026-10-23): `code` y `automatic`. Las etiquetas del panel siguen en español ("código", "Meet").
7. **Invitados sin nombre** (2026-10-23): se acepta como límite conocido y se anota en la spec junto a CA-08 (spec v1.1). No se guarda ningún identificador de la plataforma (P4).
8. **Plan v2.0 aprobado** (2026-10-23).

---

## 9. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-21 | Versión inicial, aprobada por Victor | — |
| 2.0 | 2026-10-23 | Reescrito sobre `ARCHITECTURE.md`: capas (§2.1), participantes como función (§2.2), errores con nombre y sus códigos (§2.7), tiempos máximos (§2.3, §2.4), `CHECK` en la BD (§3), pruebas de `GoogleMeet` sin red (§2.10) y comprobación de la arquitectura (§7.2) | Decisión §8.4: la spec 005 dejó el código en capas |
