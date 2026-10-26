# Plan técnico 006 · Límite de intentos inválidos por IP

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) · Creado: 2026-10-23 · Issue: [#318](https://github.com/venturars/neoland-102026/issues/318)

Este documento explica **cómo** cumplimos la spec 006 sin cambiar el comportamiento de check-in exitoso (spec 001), siguiendo [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

---

## 1. Visión general

### 1.1 Flujo en `POST /api/s/<session_id>/checkin`

```
web: client_ip(request)
  → si IP bloqueada → 429 + mensaje bloqueo (CA-05)
  → uc.check_in(...) como hoy
       → InvalidCode → uc.record_invalid_code_attempt(ip, now)
            → purga intentos > 60 s
            → cuenta ventanas 1 s y 60 s
            → si umbral → repo.block_ip + 429
            → si no → 422 (mensaje código inválido, CA-01)
       → resto de errores → sin contador (CA-02)
       → éxito → 201 / already (CA-02)
```

La comprobación de bloqueo va **antes** de validar código válido (CA-05). Solo **InvalidCode** dispara registro de intento (CA-01, CA-02).

### 1.2 Capas nuevas / tocadas

| Pieza | Capa | Ubicación |
| --- | --- | --- |
| Umbrales 5/1 s, 20/60 s, decisión bloqueo | Dominio | `domain/rate_limit.py` |
| `IpBlocked` (petición desde IP ya bloqueada) | Dominio | `domain/errors.py` |
| Orquestación intento inválido + bloqueo | Casos de uso | `use_cases/rate_limit.py` |
| Contrato persistencia bloqueos/intentos | Port | `ports/rate_limit_repository.py` |
| Tablas + SQL | Infra | `infra/sqlite/schema.py`, `rate_limit_repository.py` |
| IP cliente, rutas JSON, HTTP 429/422 | Web | `web/flask_app.py` |
| Lista / quitar bloqueos | Web + static | API profesor + `profesor.html` / `profesor.js` |
| Enmienda P4 + §6 | Docs | `docs/CONSTITUTIONS.md` §8 (v2.4) |
| Dónde va la lógica | Docs | `docs/ARCHITECTURE.md` (tabla §4 ampliada) |

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

`domain/rate_limit.py`:

- `MAX_INVALID_PER_SECOND = 5` (el 6.º bloquea, CA-06).
- `MAX_INVALID_PER_MINUTE = 20` (el 21.º bloquea, CA-06).
- `ATTEMPT_RETENTION_SECONDS = 60` (purga y ventana del minuto).
- `def should_block_after_attempt(count_last_second: int, count_last_minute: int) -> bool` — true si `count_last_second > 5` o `count_last_minute > 20` **después** de insertar el intento actual (equivalente a 6.º / 21.º).

Tests unitarios en `tests/test_rate_limit.py` sin Flask ni SQLite.

### 3.2 Errores

- `IpBlocked`: la IP está en block list antes de procesar check-in.
- Mantener `InvalidCode` para intento inválido que **aún** no bloquea.

---

## 4. Port e infra

`RateLimitRepository` (Protocol):

| Método | Uso |
| --- | --- |
| `is_blocked(ip: str) -> bool` | CA-05 |
| `block_ip(ip: str, blocked_at_iso: str) -> None` | CA-03, CA-04 |
| `record_invalid_attempt(ip: str, attempted_at_iso: str) -> None` | CA-01 |
| `count_invalid_attempts(ip: str, since_iso: str) -> int` | Ventanas 1 s / 60 s |
| `purge_attempts_older_than(cutoff_iso: str) -> None` | CA-08 |
| `list_blocked() -> list[dict]` | `{ip, blocked_at}` |
| `unblock_ip(ip: str) -> bool` | CA-10 |
| `unblock_all() -> int` | CA-11, filas borradas |

Implementación: `SqliteRateLimitRepository` en `infra/sqlite/rate_limit_repository.py`, misma conexión por request que el repositorio de asistencia (patrón `g` en Flask).

---

## 5. Casos de uso

`use_cases/rate_limit.py`:

1. **`assert_not_blocked(repo, ip)`** — lanza `IpBlocked` si aplica.
2. **`after_invalid_code(repo, ip, now_float, now_iso)`**:
   - `purge_attempts_older_than(now - 60s)`
   - `record_invalid_attempt`
   - contar desde `now - 1s` y `now - 60s`
   - si `should_block_after_attempt` → `block_ip` y devolver `{blocked: True}`
   - si no → `{blocked: False}`

`check_in` en `use_cases/attendance.py` **no** mezcla rate limit; la ruta web orquesta (mantiene attendance.py enfocado en asistencia).

---

## 6. Web (Flask)

### 6.1 IP del cliente

- Función `client_ip(request) -> str` en `web/flask_app.py` (o `web/client_ip.py` si crece).
- Ampliar `ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)` para túnel Cloudflare (cabecera `X-Forwarded-For`).
- Tests: fijar IP con `environ_overrides` / `REMOTE_ADDR` en cliente de prueba.

### 6.2 Check-in

En `check_in` route:

1. `ip = client_ip(request)`
2. `assert_not_blocked(rate_repo, ip)` → capturar `IpBlocked` → **429** + `BLOCKED_MSG`
3. `uc.check_in(...)` como hoy
4. `except InvalidCode`: llamar `after_invalid_code`; si `blocked` → **429** + `BLOCKED_MSG`; si no → **422** + mensaje actual

Mensajes propuestos (español, CA-03):

- `BLOCKED_MSG`: «Demasiados intentos incorrectos. Tu conexión quedó bloqueada. Pide al profesor que te desbloquee.»
- Distinto de `INVALID_CODE` existente.

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
| **P2** Simplicidad | Un port + repo SQLite; sin Redis ni middleware externo |
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
