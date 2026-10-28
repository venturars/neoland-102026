# Plan técnico 004 · Asistencia automática desde Google Meet

> Versión 2.2 · Estado: **Aprobado** (2026-10-28) · Spec: [spec.md](spec.md) v1.2 · Arquitectura: [ARCHITECTURE.md](../../ARCHITECTURE.md) v1.1 · Constitución v3.1 · Creado: 2026-10-21 · Reescrito: 2026-10-23

Este documento explica **cómo** construimos lo que pide la spec 004 sobre el código ya adaptado a `ARCHITECTURE.md` (spec 005). Meet es una **segunda forma de llenar la lista**: una entrada nueva que llama a casos de uso, y una pieza de infraestructura nueva que habla con Google (C3, P1). Las reglas se citan por su identificador (`C2`, `E4`…).

La versión 1.0 (aprobada el 2026-10-21) se escribió para la estructura anterior; queda en el historial de git. Esta versión conserva sus decisiones (§8) y las aplica a las capas.

---

## 0. Riesgo principal: verificarlo antes de construir

La documentación de Google no dejaba claro si la API de Meet funciona con una **cuenta de Google gratuita** (Neoland no tiene plan de pago, spec P6). Por eso la primera tarea fue una prueba de concepto (*spike*, tarea T03).

**Resultado (2026-10-23): funciona, y la puerta se pasa.** Lo que mostró, y que esta versión del plan ya aplica:

| # | Hallazgo | Dónde se aplica |
| --- | --- | --- |
| 1 | `spaces/{código}` responde `403` con reuniones creadas desde meet.google.com; la vía que funciona es `conferenceRecords` filtrado por código | §2.3 |
| 2 | Una cuenta **participante** que no organiza ve la lista (las clases del bootcamp) | §2.6, spec CA-15 |
| 3 | Sin filtro, `participants` da **todos los que estuvieron** en algún momento, una vez cada uno | §2.3, spec CA-18, CA-19 |
| 4 | Cada reunión caduca a los **30 días** de terminar (`expireTime`) | §2.3, spec CA-14 |
| 5 | La clase usa **la misma sala cada día**: un código, varias reuniones | §2.3, spec CA-20 |
| 6 | Inexistente, sin empezar, caducada o no visible dan lo mismo: **0 reuniones** | §2.7, spec CA-13, CA-14 |
| 7 | El participante del profesor trae `users/<sub>`, el mismo `sub` del inicio de sesión | §2.5 |
| 8 | Google deja **conceder solo parte** de los permisos | §2.4 |
| 9 | `403 PERMISSION_DENIED` también cuando **la API está desactivada** en el proyecto | §2.7 |
| 10 | `ALTER TABLE … ADD COLUMN` con los `CHECK` de §3 funciona en SQLite 3.49 | §3 |

Los ejemplos de respuesta guardados (con nombres e identificadores cambiados, P4) están en `tests/fixtures/meet/`.

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
- Tomar asistencia pide a Google, según elija el profesor en cada toma, **quién está ahora** o **todos los que han estado** en la reunión (spec CA-18), y registra a cada persona con la **misma regla anti-duplicados** de la spec 001 (`name_key` y la restricción `UNIQUE`). Repetirla solo añade a los nuevos; **nunca se borra** a nadie por salir (CA-06, CA-07). Funciona durante la clase y después, hasta 30 días (CA-20, CA-21).
- Atajo de línea de comandos (decisión §8.2): `python app.py --meet abc-defg-hij` (combinable con `--tunel`) crea la clase automática, toma asistencia una vez e imprime el enlace del panel **a esa clase**.

---

## 2. Decisiones clave

### 2.1 Dónde va cada pieza (C1, O1)

| Capa | Archivo | Qué hace |
| --- | --- | --- |
| Dominio | `domain/sessions.py` | `Mode` (`code` / `automatic`); `Session` y `SessionSummary` ganan `mode` y `meeting_code` |
| Dominio | `domain/participants.py` **(nuevo)** | `Who` (`now` / `everyone`), `MeetingAttendance` (los nombres y de qué reunión son) y `names_from_platform(display_names)`: de los nombres que da una plataforma a los nombres de la lista (invitados sin nombre, numeración, recorte). No sabe nada de Google: sirve también para Discord (C3, P1) |
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

- El caso de uso recibe **una función** `fetch_participants(meeting_code, who) -> MeetingAttendance`:
  - `who` es `Who.NOW` (quién está ahora) o `Who.EVERYONE` (todos los que han estado);
  - `MeetingAttendance` lleva los **nombres visibles**, **sin el profesor**, y la **hora de inicio** de la reunión elegida y si **ya terminó**, para que el panel diga de qué reunión es la toma (CA-20).
- En la app es el método `participants` de un `GoogleMeet` que se crea en `app.py` (el punto de montaje, C4) y llega a `create_app` por parámetro. En los tests es una función falsa que devuelve lo que decide cada test.
- **Sin `Protocol` ni clase base**: hay una sola implementación real, y una función con su tipo (`Callable[[str, Who], MeetingAttendance]`) basta (ARCHITECTURE §12). Si llega Discord (spec 002) con su propia fuente, se revisa.
- `GoogleMeet` sí es una clase: guarda estado que comparten sus operaciones, las credenciales y la sesión HTTP (M3).

### 2.3 Cómo se habla con Google (CA-05, CA-14; F4)

Dos llamadas a la API REST de Meet v2, desde `infra/google_meet.py` (§0, hallazgos 1, 3 y 5):

1. `GET conferenceRecords?filter=space.meeting_code = "{código}"` → las reuniones con ese código que **esta cuenta puede ver** (organizadas o en las que participó).
   - **Qué reunión se usa** (spec CA-20): la que no tiene `endTime` (en curso); si no hay, la de `endTime` más reciente. Ninguna → `MeetingNotVisibleError` (CA-13, CA-14).
   - Con `Who.NOW` y la reunión elegida ya terminada → `MeetingEndedError` (CA-21), sin pedir los participantes.
2. `GET {conferenceRecord}/participants` → los participantes:
   - `Who.NOW` → con `filter=latest_end_time IS NULL`: solo quienes siguen en la llamada (CA-05);
   - `Who.EVERYONE` → sin filtro: todos los que entraron en algún momento, cada uno una vez (CA-18, CA-19).
   - `pageSize=250`, siguiendo `nextPageToken` hasta un máximo de 10 páginas.

Límites (F4):
- cada llamada lleva un **tiempo máximo de 10 s**;
- el primer inicio de sesión espera como mucho **2 minutos** a que el profesor acepte en el navegador;
- cualquier fallo se traduce a un error con nombre de §2.7, y el texto de la respuesta de Google **nunca** se registra ni se muestra (E5, E7).

El **enlace o código** de la reunión se acepta pegando el enlace completo (`https://meet.google.com/abc-defg-hij`, con o sin `?authuser=…`) o solo el código, con mayúsculas o espacios alrededor. `parse_meeting_code` lo valida con el patrón `[a-z]{3}-[a-z]{4}-[a-z]{3}` (`fullmatch`, E1) antes de llamar a Google. Es formato de Meet, así que vive en `infra/google_meet.py`; lo usa el caso de uso al abrir la clase.

### 2.4 Permiso de Google (CA-11, CA-12)

- Google exige **OAuth**: el profesor inicia sesión y acepta que la app "vea información sobre sus reuniones de Meet".
- Permisos mínimos: `meetings.space.readonly` (solo lectura) y `openid` (para saber qué cuenta es y excluirla, §2.5). **No** se pide el email (P4).
- **Permisos a medias** (§0, hallazgo 8): Google deja conceder solo una parte, con casillas. Tras el inicio de sesión se comprueban los permisos concedidos; si falta el de Meet → `MeetPermissionMissingError`, y no se guarda ese permiso incompleto.
- **Primera vez** (CA-11): al tomar asistencia sin permiso guardado, la app abre el navegador **del ordenador donde corre** con la pantalla de Google (flujo de escritorio *loopback*, en un puerto libre que elige el sistema). Al aceptar, la toma continúa sola. Si en 2 minutos no se acepta → `MeetLoginNotCompletedError`.
  - El servidor de Flask atiende varias peticiones a la vez, así que el panel no se bloquea mientras tanto.
- **Siguientes veces** (CA-12): el permiso se guarda y se renueva solo.
- **Caducidad semanal** (spec P7, opción A): mientras la app de Google esté **en prueba**, Google invalida el permiso a los 7 días. Cuando la renovación falla por eso, `GoogleMeet` borra el permiso guardado y vuelve al flujo de la primera vez, sin que el profesor tenga que hacer nada más que aceptar.
  - *Paso futuro (P7, opción B):* publicar una página principal y una política de privacidad y pasar la app a producción; entonces el permiso deja de caducar y este punto no cambia de código.
- Archivos, leídos por `Config` (F5), los dos en `data/` (fuera de git):

  | Variable | Por defecto | Qué es |
  | --- | --- | --- |
  | `ASISTENCIA_GOOGLE_CLIENT` | `data/google-client.json` | La "llave" de la app, de tipo **Aplicación de escritorio**, que el profesor crea una vez en Google Cloud (README) |
  | `ASISTENCIA_GOOGLE_TOKEN` | `data/google-token.json` | El permiso guardado. Se escribe con permisos `0600` (solo el usuario), porque es un secreto (X) |

### 2.5 Excluir al profesor (CA-09)

- Con `openid`, el permiso trae el identificador de la cuenta (`sub`). `GoogleMeet` descarta el participante cuyo `signedinUser.user` sea `users/<sub>`; el spike confirmó que coinciden (§0, hallazgo 7).
- Ese identificador **solo se usa en memoria**; no se guarda (P4).
- En "Todos los que han estado" también se excluye: el profesor estuvo, pero no es alumno.

### 2.6 Cualquier participante (HU-06, CA-15)

El spike mostró que una cuenta **participante** ve la lista de una reunión que no organiza (§0, hallazgo 2). Por eso la spec v1.2 deja que tome la asistencia **quien arranca la app con su propia cuenta**, si organiza la reunión **o** estuvo en ella. No hace falta nada especial en el código: `conferenceRecords` ya devuelve las reuniones que esa cuenta puede ver.

### 2.7 Errores nuevos (E3, E4, E5; decisión §8.5)

Todos heredan de `AppError` y llevan su mensaje como constante. Viven en `domain/errors.py`: así la tabla de la entrada web no depende de la infraestructura (C1), y la entrada CLI los imprime igual.

| Error | Cuándo | HTTP | Mensaje |
| --- | --- | --- | --- |
| `NotCodeSessionError` | Check-in por código en una clase automática (CA-02) | 409 | "Esta clase no usa código: la asistencia se toma automáticamente desde Meet." |
| `NotAutomaticSessionError` | Tomar asistencia de Meet en una clase de código | 409 | "Esta clase usa código: los alumnos se registran con el enlace y el código." |
| `MeetingLinkInvalidError` | Enlace o código de Meet mal escrito, o que falta en modo automático | 422 | "Pega el enlace o el código de la reunión de Meet (p. ej. abc-defg-hij)." |
| `MeetingNotVisibleError` | Ninguna reunión con ese código para esta cuenta: no existe, no ha empezado, caducó o no la ve (CA-13, CA-14; §0, hallazgo 6). También un `403` que no sea de API desactivada | 422 | "No hay ninguna reunión con ese enlace que esta cuenta pueda ver. Revisa el enlace, entra en la reunión con esta cuenta o pide al organizador que tome la asistencia." |
| `MeetingEndedError` | "Quién está ahora" en una reunión que ya terminó (CA-21) | 422 | "Esta reunión ya terminó. Usa «Todos los que han estado» para registrar a quienes estuvieron." |
| `MeetPermissionMissingError` | Se aceptó el inicio de sesión sin la casilla de Meet (§2.4) | 422 | "Falta el permiso de Google Meet. Vuelve a tomar la asistencia y marca la casilla «Ver información sobre tus reuniones de Google Meet»." |
| `MeetLoginNotCompletedError` | No se aceptó el permiso en 2 minutos (CA-11) | 422 | "No se completó el permiso de Google. Vuelve a tomar la asistencia y acepta en la ventana de Google." |
| `MeetNotConfiguredError` | Falta `google-client.json`, o Google dice que la API de Meet está desactivada en el proyecto (`403` con ese motivo; §0, hallazgo 9) | 422 | "Falta preparar la app en Google Cloud. Sigue los pasos de «Modo automático» en el README." |
| `MeetServiceError` | Google o la red fallan (`5xx`, tiempo agotado, sin conexión) | 502 | "Google Meet no responde ahora mismo. Inténtalo de nuevo en unos segundos." |

- Una clase automática **cerrada** responde a la toma con `SessionClosedError` (`409`, el de la spec 001).
- Para distinguir "API desactivada" de "sin acceso", `GoogleMeet` lee el **motivo** que Google pone en el cuerpo del error (`SERVICE_DISABLED`), sin registrarlo ni mostrarlo.
- En cada fallo de Google se registra **solo el tipo de error y el código HTTP**, nunca el cuerpo de la respuesta, que puede llevar nombres (E7).

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

- **Dominio y casos de uso**: `fetch_participants` falso, que devuelve un `MeetingAttendance` o lanza el error que decida el test.
- **`infra/google_meet.py`**: `GoogleMeet` recibe por parámetro su sesión HTTP; en los tests es una falsa que devuelve los ejemplos de `tests/fixtures/meet/` (`conference_records_by_code.json`, `participants_ended.json`; los demás casos, como una reunión en curso o varias reuniones con el mismo código, se derivan de ellos en el propio test), o un `403` (con y sin el motivo `SERVICE_DISABLED`), un `500` o un tiempo agotado. Así se prueban sin red la elección de la reunión, los dos modos, la paginación, la exclusión del profesor y la traducción de cada fallo (T4: se simula solo lo externo).
- El flujo OAuth real (abrir el navegador de Google, permisos a medias, caducidad semanal) se verifica a mano en la prueba final (CA-11, CA-12). La comprobación de los permisos concedidos sí se prueba, con unas credenciales falsas.
- **Entrada web y CLI**: con `create_app(..., fetch_participants=falsa)`.

### 2.11 Horas (D6)

Todos los registros de una misma toma llevan **la hora de la toma** (`to_iso(t)`), también con "Todos los que han estado" y al terminar la clase: es cuándo se pasó lista, no cuándo entró cada uno (la spec deja fuera las entradas y salidas). La descarga en CSV (CA-16) muestra esa hora.

### 2.12 Revisión de código de la PR #532 (2026-10-28)

Tres arreglos que no cambian la spec ni la API:

- **El formato del enlace de Meet pasa al dominio.** `parse_meeting_code` y su expresión regular salen de `infra/google_meet.py` a un módulo nuevo, `domain/meetings.py`: solo comprueban un texto, sin E/S (C1, O1). Hoy `usecases/sessions.py` importa `infra/google_meet.py`, que a su vez importa `requests` y las librerías de Google: los casos de uso de **cualquier** clase, también las de código, dependen de Google. Después, solo `infra/` y `app.py` (que monta `GoogleMeet` al arrancar, §2.2) las cargan. Arrancar la app sigue necesitándolas, porque son dependencias de la app en `requirements.txt` (§7.1); hacerlas opcionales sería otra decisión.
- **El nombre del CSV usa la fecha local.** `export_attendance` toma el día de `opened_at` en UTC; una clase abierta entre las 00:00 y la 01:00 o 02:00 de Madrid recibe la fecha del día anterior. Se convierte con la zona horaria de la configuración, como ya se hace con las horas del CSV (D6, §2.11).
- **`requests` en `requirements.txt`.** `infra/google_meet.py` la importa directamente; hoy solo llega como dependencia de `google-auth-oauthlib` (§7.1). Se lista para que no dependa de eso; no es una dependencia nueva.

Se deja como está, con su motivo en la PR:
- **Invitados sin nombre entre tomas:** límite conocido (§2.8, decisión §8.7). Distinguirlos exigiría guardar un identificador de la plataforma, que la constitución (P4) no permite.
- **`requires-python` en `pyproject.toml`:** exige una sección `[project]`, y el archivo solo configura herramientas, sin convertir el proyecto en un paquete (ARCHITECTURE §12). La versión 3.13 ya la fijan `ruff` (`target-version`) y `mypy` (`python_version`).

## 3. Modelo de datos

Dos columnas nuevas en `sessions`; `checkins` **no cambia**.

```sql
mode         TEXT NOT NULL DEFAULT 'code' CHECK (mode IN ('code', 'automatic')),
meeting_code TEXT CHECK (mode = 'code' OR meeting_code IS NOT NULL)
```

- Las reglas que deben cumplirse siempre (modo válido; toda clase automática tiene su reunión) las impone la propia base de datos (D5).
- **Migración** (D5): `init_schema()` comprueba las columnas con `PRAGMA table_info(sessions)` y añade las que falten con `ALTER TABLE … ADD COLUMN`. Las clases que ya existen quedan como `code`, que es lo que eran. La tabla nueva de una base de datos vacía ya nace con ellas. Comprobado en el spike con SQLite 3.49 (§0, hallazgo 10).
- `meeting_code` es un dato de la **reunión**, no del alumno: no afecta a P4. Nombre genérico (no `meet_code`) para servir a otras plataformas (P1).

---

## 4. API (cambios sobre la spec 001)

| Método y ruta | Cambio |
| --- | --- |
| `POST /api/sessions` | Cuerpo `{title?, mode?, meeting?}`. `mode` por defecto `code`. En `automatic`, `meeting` es obligatorio (`422` `MeetingLinkInvalidError` si falta o está mal escrito); `mode` desconocido → `400`. Respuesta: `{id, title, mode}` |
| `GET /api/sessions` | Cada clase incluye `mode` |
| `GET /api/sessions/<id>` | Incluye `mode` y `meetingCode`. En modo automático, **sin** `code`, `secondsLeft` ni `studentUrl` |
| **`POST /api/sessions/<id>/meet-sync`** (nueva) | Cuerpo `{who}`: `"now"` o `"everyone"` (obligatorio; otro valor → `400`). `200 {added, found, total, meetingStartedAt, meetingEnded}` · `409` si la clase es de código o está cerrada · `422`/`502` con los errores de §2.7 · `404` si no existe · `401` sin token |
| `GET /api/s/<id>` | Incluye `mode` |
| `POST /api/s/<id>/checkin` | `409` `NotCodeSessionError` si la clase es automática |

- Los serializadores nuevos o ampliados viven en `entrypoints/web/serializers.py` (F2, D7). `teacher_view_json` solo incluye `studentUrl` en modo código: es elegir campos, no una regla del negocio.
- El panel compone el texto del resultado, con la reunión de la que es (CA-20): "Reunión del 23/10 a las 08:56 · Añadidas 3 personas nuevas · 12 en la llamada ahora" (o "· 17 estuvieron en la reunión" con `everyone`); con `found = 0`, "No hay participantes en la reunión" (CA-10).

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
│       ├── google_meet.py           # NUEVO: GoogleMeet (parse_meeting_code pasa a domain/meetings.py, §2.12)
│       └── storage.py               # columnas, migración, tipos con modo
├── static/
│   ├── profesor.html / .js          # selector de modo, campo de Meet, "Tomar asistencia ahora", etiqueta de modo
│   ├── alumno.js                    # aviso "Esta clase no usa código…"
│   └── styles.css                   # selector y etiqueta
├── tests/
│   ├── fixtures/meet/               # respuestas de ejemplo del spike, con nombres cambiados (ya guardadas)
│   ├── test_participants.py         # NUEVO
│   ├── test_attendance.py           # NUEVO
│   ├── test_google_meet.py          # NUEVO
│   ├── test_cli.py                  # NUEVO
│   └── test_web_meet.py             # NUEVO (+ cambios en test_web_*, test_sessions, test_checkins, test_storage, test_config)
├── scripts/spike_meet.py            # desechable (§0, ya usado): se borra al terminar
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
| CA-05 | `test_attendance`: "ahora" con 3 nombres → 3 registros con la hora de la toma, en una transacción. `test_google_meet`: `now` pide los participantes con `latest_end_time IS NULL` |
| CA-06 | `test_attendance`: segunda toma con 2 repetidos (uno con otra tilde o mayúscula) + 1 nuevo → `added = 1` |
| CA-07 | `test_attendance`: segunda toma sin una persona → sigue en la lista |
| CA-08 | `test_participants`: vacío → "Invitado sin nombre"; varios → numerados; 80 caracteres → 60 |
| CA-09 | `test_google_meet`: el participante `users/<sub>` no sale, en los dos modos. Manual en la prueba final |
| CA-10 | `test_attendance`: reunión vacía → `found = 0`, `added = 0`. Manual: mensaje en el panel |
| CA-11, CA-12 | `test_google_meet`: permisos a medias → `MeetPermissionMissingError`; permiso caducado → vuelve al inicio de sesión. Manual: la primera toma abre Google; otra toma en la misma semana no lo pide |
| CA-13, CA-14 | `test_google_meet`: 0 reuniones y `403` sin motivo de API → `MeetingNotVisibleError`; enlaces válidos y no válidos; `test_web_meet`: `422` con su mensaje |
| CA-15 | Comprobado en el spike: una cuenta participante ve la lista de las clases del bootcamp (§0). Manual en la prueba final |
| CA-16 | `test_web_meet`: quitar y exportar en una clase automática |
| CA-17 | `test_google_meet`: solo salen nombres aunque el JSON traiga `user` y `phoneUser`; `test_storage`: `checkins` no tiene columnas nuevas |
| CA-18 | `test_google_meet`: `everyone` pide los participantes sin filtro; `test_web_meet`: `who` obligatorio y con valores válidos. Manual: los dos botones en el panel |
| CA-19 | `test_attendance`: el mismo nombre dos veces en una toma de "todos" → un registro |
| CA-20 | `test_google_meet`: varias reuniones con el mismo código → la en curso; si no hay, la más reciente; `test_web_meet`: `meetingStartedAt` en la respuesta |
| CA-21 | `test_google_meet`: `now` con la reunión terminada → `MeetingEndedError` sin pedir los participantes |

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

1. **Estado de la app en Google Cloud** (2026-10-21; **cambiado el 2026-10-23**): se quería "En producción" sin verificar, pero Google exige para ello una página principal y una política de privacidad. **Por ahora queda en prueba**, con el permiso semanal (spec P7, opción A); publicarla es un paso futuro (P7, opción B) (§2.4).
2. **Atajo `--meet`** (2026-10-21): **sí** (§1).
3. **Spike primero** (2026-10-21): si la cuenta gratuita no puede leer participantes, se para y se revisa la spec (§0).
4. **Orden** (2026-10-23): primero se adapta el código a `ARCHITECTURE.md` (spec 005, terminada) y después se reescribe este plan.
5. **Errores de Meet** (2026-10-23): `422` para lo que el profesor puede arreglar; `502` solo cuando falla Google o la red. Cada caso es una excepción con nombre (§2.7).
6. **Valores de `mode`** (2026-10-23): `code` y `automatic`. Las etiquetas del panel siguen en español ("código", "Meet").
7. **Invitados sin nombre** (2026-10-23): se acepta como límite conocido y se anota en la spec junto a CA-08 (spec v1.1). No se guarda ningún identificador de la plataforma (P4).
8. **Plan v2.0 aprobado** (2026-10-23).
9. **Quién toma la asistencia** (2026-10-23, tras el spike): quien arranca la app, si organiza la reunión o participa en ella (spec v1.2, HU-06).
10. **Quién cuenta** (2026-10-23): las dos opciones, elegidas en cada toma: "Quién está ahora" o "Todos los que han estado" (spec CA-18).
11. **Qué reunión** (2026-10-23): la en curso; si no hay, la última que terminó (spec CA-20).
12. **Plan v2.1 aprobado** (2026-10-25).

---

## 9. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-21 | Versión inicial, aprobada por Victor | — |
| 2.2 | 2026-10-28 | §2.12: arreglos de la revisión de la PR #532 (formato del enlace en el dominio, fecha local en el nombre del CSV, `requests` en `requirements.txt`) | Comentarios de la revisión de código |
| 2.1 | 2026-10-23 | Resultados del spike (§0): vía `conferenceRecords` y elección de la reunión (§2.3), dos modos de toma (§2.2, §2.3, §4), cualquier participante (§2.6), errores revisados (§2.7), permisos a medias y caducidad semanal (§2.4), trazabilidad de CA-18 a CA-21 (§6), decisiones §8.1 y §8.9 a §8.11 | Spike de la tarea T03 y spec v1.2 |
| 2.0 | 2026-10-23 | Reescrito sobre `ARCHITECTURE.md`: capas (§2.1), participantes como función (§2.2), errores con nombre y sus códigos (§2.7), tiempos máximos (§2.3, §2.4), `CHECK` en la BD (§3), pruebas de `GoogleMeet` sin red (§2.10) y comprobación de la arquitectura (§7.2) | Decisión §8.4: la spec 005 dejó el código en capas |
