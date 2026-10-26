# Plan técnico 006 · Límite de intentos inválidos por IP

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) · Creado: 2026-10-23 · Issue: [#318](https://github.com/venturars/neoland-102026/issues/318)

Este documento explica **cómo** cumplimos la spec 006 sin cambiar el comportamiento de check-in exitoso (spec 001), siguiendo [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

---

## 1. Visión general

### 1.1 Flujo en `POST /api/s/<session_id>/checkin`

```
web: request.remote_addr (tras ProxyFix) → run(action)
  → attendance.check_in(path, session_id, name, code, now, ip)
       → storage.is_ip_blocked → raise Banned → 429 (CA-05)
       → código inválido → _after_invalid_code (purga, insert, cuenta ventanas)
            → over_limit → block_ip + raise Banned → 429 (CA-03, CA-04)
            → si no → raise InvalidCode → 422 (CA-01)
       → resto de errores de sesión/nombre → sin contador (CA-02)
       → éxito → 201 / already (CA-02)
```

La comprobación de bloqueo va **antes** de validar código válido (CA-05). Solo **InvalidCode** dispara registro de intento (CA-01, CA-02).

### 1.2 Capas nuevas / tocadas

| Pieza | Capa | Ubicación |
| --- | --- | --- |
| Umbrales 5/1 s, 20/60 s, `over_limit`, `Banned` | Dominio | `domain/attempts.py` |
| Orquestación check-in + intento inválido | Casos de uso | `usecases/attendance.py` (`check_in`, `_after_invalid_code`, `list_blocked`, …) |
| SQL asistencia + bloqueos/intentos | Almacén | `storage/sqlite.py` (funciones con `path`); DDL en `infra/sqlite/schema.py` |
| IP cliente, rutas JSON, HTTP 429/422 | Web | `web/flask_app.py` (`run(action)` captura `Banned` e `InvalidCode`) |
| Lista / quitar bloqueos | Web + static | API profesor + `profesor.html` / `profesor.js` |
| Enmienda P4 + §6 | Docs | `docs/CONSTITUTIONS.md` §8 (v2.4) |
| Dónde va la lógica | Docs | `docs/ARCHITECTURE.md` v1.2 |

---

## 2. Modelo de datos (SQLite)

Ampliar `SCHEMA` en [`infra/sqlite/schema.py`](../../asistencia/infra/sqlite/schema.py) (sin tocar `checkins`):

```sql
CREATE TABLE IF NOT EXISTS blocked_ips (
  ip         TEXT PRIMARY KEY,
  blocked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invalid_code_attempts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ip            TEXT NOT NULL,
  attempted_at  TEXT NOT NULL  -- ISO UTC, mismo estilo que checked_at
);

CREATE INDEX IF NOT EXISTS idx_attempts_ip_time
  ON invalid_code_attempts (ip, attempted_at);
```

- **blocked_ips**: persistente hasta DELETE por profesor (CA-09).
- **invalid_code_attempts**: filas con `attempted_at`; para contar solo las de los últimos 60 s; **DELETE** donde `attempted_at < now - 60s` en cada operación relevante (purga incremental, CA-08). La tabla no se trunca entera.

No FK a `sessions` ni `checkins` (CA-07).

---

## 3. Dominio

### 3.1 Constantes y regla pura

`domain/attempts.py`:

- `MAX_PER_SECOND = 5` (el 6.º bloquea, CA-06).
- `MAX_PER_MINUTE = 20` (el 21.º bloquea, CA-06).
- `ATTEMPT_RETENTION_SECONDS = 60` (purga y ventana del minuto).
- `over_limit(in_last_second, in_last_minute) -> bool` — true si el recuento **incluye** el intento recién insertado y supera umbrales.
- `Banned` — excepción con `BAN_MESSAGE` (CA-03, CA-05).

Tests unitarios en `tests/test_rate_limit.py` (dominio `attempts`) sin Flask ni SQLite.

### 3.2 Errores HTTP

- IP bloqueada o bloqueo tras intento inválido: `check_in` lanza **`Banned`** → `run(action)` responde **429** con el mensaje de `BAN_MESSAGE` (CA-05, CA-03).
- Código inválido sin bloqueo: **`InvalidCode`** → **422** con el mensaje ya usado en spec 001 (CA-01).

---

## 4. Almacén (`storage/sqlite.py`)

Funciones con **`path`** al fichero SQLite (mismo módulo que asistencia spec 001):

| Función | Uso |
| --- | --- |
| `is_ip_blocked(path, ip) -> bool` | CA-05 |
| `block_ip(path, ip, blocked_at_iso)` | CA-03, CA-04 |
| `record_invalid_code_attempt(path, ip, attempted_at_iso)` | CA-01 |
| `count_invalid_code_attempts(path, ip, since_iso) -> int` | Ventanas 1 s / 60 s |
| `purge_invalid_code_attempts_older_than(path, cutoff_iso)` | CA-08 |
| `list_blocked_ips(path) -> list[dict]` | `{ip, blocked_at}` |
| `unblock_ip(path, ip) -> bool` | CA-10 |
| `unblock_all_ips(path) -> int` | CA-11 |

Cada llamada abre/cierra conexión vía `infra/sqlite/connection.py`; el DDL compartido vive en `schema.py`.

---

## 5. Casos de uso

`usecases/attendance.py`:

1. **`check_in(..., ip)`** — al inicio `is_ip_blocked`; tras código inválido llama **`_after_invalid_code`**: purga, registra intento, cuenta ventanas; si `over_limit`, `block_ip` y **`raise Banned()`**; si no, **`raise InvalidCode()`**.
2. **`list_blocked`**, **`unblock_one`**, **`unblock_all`** — API profesor (delegan en `storage`).

La ruta Flask solo obtiene IP, parsea JSON y llama a `check_in` dentro de **`run(action)`** (sin SQL ni umbrales en `web`).

---

## 6. Web (Flask)

### 6.1 IP del cliente

- `ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)` para túnel Cloudflare: Flask rellena `request.remote_addr` desde `X-Forwarded-For`.
- En check-in se pasa `request.remote_addr or ""` a `check_in` (sin módulo aparte).
- Tests: fijar IP con `environ_overrides` / `REMOTE_ADDR` en cliente de prueba.

### 6.2 Check-in

En `check_in` route:

1. IP = `request.remote_addr or ""`
2. `check_in(app.config["DB_PATH"], session_id, …, now, ip)` dentro de `run(action)`
3. **`Banned`** → **429** + texto de `BAN_MESSAGE` (`domain/attempts.py`, CA-03)
4. **`InvalidCode`** → **422** + mensaje spec 001

El mensaje de bloqueo vive en **`BAN_MESSAGE`**; distinto del error de código inválido.

### 6.3 API profesor (token `X-Teacher-Token`, CA-12)

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/blocked-ips` | `[{ "ip": "…", "blockedAt": "…" }]` |
| DELETE | `/api/blocked-ips/<path:ip>` | `{ "ok": true }` (404 si no estaba) |
| DELETE | `/api/blocked-ips` | `{ "ok": true, "removed": N }` |

Misma protección `require_teacher` que `/api/sessions` (ampliar condición en `before_request` o lista de prefijos).

### 6.4 Front profesor

- Sección en panel o vista sesión: «Conexiones bloqueadas», lista con IP y hora, botón «Quitar» por fila y «Quitar todas».
- Llamadas `api('/api/blocked-ips')` desde `profesor.js`.
- Mobile ~400 px (P5).

`alumno.js`: si 429, mostrar `data.error` del servidor (sin cambiar flujo 422).

---

## 7. Constitución (CA-13)

Enmienda **2.4** en `docs/CONSTITUTIONS.md`:

- **P4**: excepción — se pueden guardar direcciones de conexión **solo** en tablas de anti-abuso (`blocked_ips`, `invalid_code_attempts`), sin enlace a nombre/hora del alumno; intentos con retención máxima ~60 s; bloqueos hasta acción del profesor.
- **§6**: añadir que la app **limita** intentos automatizados de códigos inválidos por origen de conexión (coherente con spec 006).

Registrar fila en historial §8 con fecha y motivo (issue #318).

---

## 8. Tests (mapeo CA → test)

| CA | Test |
| --- | --- |
| CA-01, CA-06 | `test_api`: 5×422 código malo OK; 6.ª → 429 y fila en `blocked_ips` |
| CA-02 | Código bueno / nombre malo no incrementa (consulta COUNT attempts o mock) |
| CA-03, CA-04 | Ventana 1 s y 60 s (reloj inyectable `now` en `create_app`) |
| CA-05 | IP bloqueada + código válido → 429 |
| CA-07 | Schema / assert no columna IP en checkins |
| CA-08 | Tras purga, intentos >60 s borrados; tabla existe |
| CA-09–CA-12 | API blocked-ips con/sin token; unblock |
| CA-14 | `pytest` completo sigue verde |
| Dominio | `tests/test_rate_limit.py` |

---

## 9. README

Añadir breve apartado: bloqueo por intentos, mensaje al alumno, panel profesor para desbloquear, NAT compartido (varios alumnos misma IP solo acumulan intentos **inválidos**).

---

## 10. Comprobación de la constitución

| Principio | Cómo lo cumple |
| --- | --- |
| **P2** Simplicidad | Funciones en `storage/sqlite.py`; sin Redis ni middleware externo |
| **P3** Dependencias | Solo stdlib + Flask/pytest existentes |
| **P4** Privacidad | IP fuera de checkins; enmienda acotada; purga de intentos |
| **P5** Móvil | UI profesor en la misma hoja/CSS |
| **P6** Español | Mensajes y docs |
| **§4 SDD** | Spec aprobada → este plan → tasks → código |
| **§3 stack** | SQLite vía sqlite3 |

---

## 11. Riesgos documentados

- **NAT / aula**: varios alumnos, una IP pública; solo cuentan códigos inválidos (spec).
- **X-Forwarded-For**: confiar solo detrás de ProxyFix en despliegue con túnel; en local `127.0.0.1`.
- **Codificación IP en URL**: DELETE con IP en path; usar `<path:ip>` o body JSON si IPv6 complica (preferir path con quote en cliente).

---

## 12. Fuera de este plan

- `tasks.md` (siguiente fase tras aprobación de este plan).
- Cambios en `hack-etico.sh` (opcional manual en issue).

---

## 13. Alineación con arquitectura 005 (2026-10-26)

Con la arquitectura **005**, la feature 006 **no** usa módulos aparte `rate_limit_db.py` ni `use_cases/rate_limit.py`. Toda la persistencia anti-abuso está en **`storage/sqlite.py`**; la orquestación en **`usecases/attendance.py`**; reglas puras en **`domain/attempts.py`**. IP del check-in: **`request.remote_addr`** tras `ProxyFix` en `web/flask_app.py`. Ver `specs/005-clean-architecture/plan.md` §1.2 y `docs/ARCHITECTURE.md` v1.3.

---

## 14. Historial

| Fecha | Cambio |
| --- | --- |
| 2026-10-23 | Borrador inicial tras aprobación de spec. |
| 2026-10-26 | §1–§6 y §10 actualizados a `attempts` + `storage` + `usecases`; §13 enlace 005. |
| 2026-10-26 | §6.1: IP vía `request.remote_addr` (eliminado `client_ip.py`). |
