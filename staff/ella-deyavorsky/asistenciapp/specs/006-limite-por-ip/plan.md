# Plan técnico 006 · Límite de intentos por IP al registrarse

> Estado: **Aprobado v1.3 (2026-10-26)** · Spec: [spec.md](spec.md) v1.2 · Creado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

La regla vive en una función pura de `domain/` que, dados los contadores, dice si una IP se ha pasado. Los contadores y la lista negra se guardan en dos tablas nuevas de SQLite, en `storage/`, sin relación con los nombres. La acción `check_in` de `usecases/` coordina: pregunta al almacenamiento, aplica la regla y, si hace falta, bloquea y lanza el error. `app.py` solo pasa la IP de la conexión a la acción y traduce el error a 429. No se añade ninguna dependencia.

```
app.py (request.remote_addr) ──▶ usecases.check_in ──▶ domain.rate_limit   (decide)
                                        └────────────▶ storage.sqlite      (cuenta y guarda)
```

---

## 2. Decisiones

### 2.1 La regla: `asistencia/domain/rate_limit.py` (CA-01 a CA-06)

Módulo nuevo, solo biblioteca estándar, sin estado y sin hilos que proteger. Decide; no guarda.

- Constantes: `MAX_PER_SECOND = 5`, `MAX_PER_MINUTE = 20`, `BAN_MESSAGE` (en español: la IP ha sido bloqueada; si es un error, avisa al profesor).
- `IpBanned(Exception)`, como los demás errores del dominio (`domain/session.py`).
- `is_over_limit(in_last_second: int, in_last_minute: int) -> bool`: `True` si `in_last_second > MAX_PER_SECOND` o `in_last_minute > MAX_PER_MINUTE`. Los contadores incluyen el intento actual (el 6.º en un segundo y el 21.º en un minuto dan `True`).
- `ensure_not_blocked(blocked: bool) -> None`: lanza `IpBanned` si la IP ya está en la lista negra.
- Docstrings con `:param`, `:return`, `:rtype`, `:raises` y `Usage::` (`AGENTS.md` §6).

### 2.2 El almacenamiento: dos tablas nuevas (CA-08, CA-09, CA-15, CA-16)

En `asistencia/storage/sqlite.py`, dentro de `SCHEMA` (`CREATE TABLE IF NOT EXISTS`, así que una base ya creada se actualiza sola al arrancar con `prepare`):

```sql
CREATE TABLE IF NOT EXISTS ip_attempts (
  ip           TEXT NOT NULL,
  attempted_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ip_attempts_ip ON ip_attempts (ip, attempted_at);

CREATE TABLE IF NOT EXISTS blocked_ips (
  ip         TEXT PRIMARY KEY,
  blocked_at TEXT NOT NULL
);
```

- **Aisladas de los nombres (CA-15):** ninguna de las dos tiene clave foránea, columna de sesión, de nombre o de registro. `checkins` y `sessions` no cambian. Nada une una IP con una persona.
- Funciones nuevas, cada una abre y cierra su conexión y solo guarda o lee, sin importar nada del proyecto:
  - `record_ip_attempt(db_path, ip, at: float) -> tuple[int, int]`: borra los intentos de esa IP de hace más de 60 s, apunta este y devuelve `(en el último segundo, en el último minuto)`, contando el actual. Solo cuenta; no decide.
  - `is_ip_blocked(db_path, ip) -> bool`.
  - `block_ip(db_path, ip, blocked_at: str) -> None`: `INSERT OR IGNORE`.
- Los intentos de hace más de 60 s se borran en cada registro de esa IP, así que la tabla de contadores no crece sin límite.
- El esquema no toca `export.py`: el CSV se genera con `checkins`, que no tiene IP (CA-16).

### 2.3 La coordinación: `usecases/attendance.py` (CA-02, CA-04, CA-06, CA-08, CA-14)

`check_in` pasa a recibir la IP: `check_in(db_path, session_id, name, code, ip, now)`. Antes de la lógica de siempre llama a un auxiliar privado `_enforce_ip_limit(db_path, ip, now)`:

1. `ensure_not_blocked(storage.is_ip_blocked(db_path, ip))` → una IP ya bloqueada se rechaza **sin contar** (CA-06, CA-08).
2. `in_second, in_minute = storage.record_ip_attempt(db_path, ip, now())`.
3. Si `is_over_limit(in_second, in_minute)`: `storage.block_ip(db_path, ip, _now_iso(now))` y se lanza `IpBanned`. El intento que provoca el ban también se rechaza (CA-02, CA-04).
4. Si no se pasa, sigue el check-in sin cambios (CA-14). El límite se aplica antes de validar nombre, código o sesión, así que un intento inválido también cuenta.

El auxiliar no importa Flask ni `sqlite3`; usa solo `domain` y `storage`, como dice `docs/ARCHITECTURE.md`.

### 2.4 La IP que se cuenta: `app.py` (CA-10, CA-11, CA-12)

- La ruta `check_in` pasa `request.remote_addr` a la acción. Es la IP de la conexión: no sale del cuerpo ni de cabeceras (CA-10, CA-11).
- `ProxyFix` pasa a `x_for=0, x_proto=1, x_host=1`. `ProxyFix` confía por defecto en `X-Forwarded-For` (`x_for=1`) y reescribe `remote_addr` con ella, así que hay que desactivarlo expresamente para que esa cabecera no influya (descubierto al implementar T05).
- No se lee `CF-Connecting-IP` ni se añade ningún parámetro nuevo a `create_app` ni a `main`.
- Con `--tunel` la conexión llega siempre desde `cloudflared` en `127.0.0.1`, así que todos los alumnos son la misma IP (CA-12). Es la decisión aceptada en la spec §6; queda también escrita en el README.
- `IpBanned` entra en `DOMAIN_ERRORS` con estado **429** y el mensaje del dominio. `app.py` no importa `storage`. El profesor y la lectura de la clase no pasan por la regla.

### 2.5 El código no se toca (CA-13)

`domain/codes.py` y `tests/test_codes.py` no cambian. Un test nuevo fija las cifras y la rotación actuales para que un cambio futuro falle.

### 2.6 Desbloqueo a mano (CA-09)

Sin ruta ni pantalla nuevas. El README explica, desde la carpeta de la app y con la aplicación parada:

```bash
sqlite3 data/asistencia.db "DELETE FROM blocked_ips WHERE ip = '127.0.0.1'; DELETE FROM ip_attempts WHERE ip = '127.0.0.1';"
```

Borrar de `ip_attempts` hace que la IP empiece a contar desde cero (CA-09). `sqlite3` es el cliente que trae macOS; no es una dependencia del proyecto.

### 2.7 Constitución 3.0 (CA-17)

Enmienda propuesta, que apruebas tú, en `docs/CONSTITUTION.md`. Es una versión mayor (2.2 → 3.0) porque contradice P4, según la constitución §8:

- Versión 3.0, fecha 2026-10-26, en la cabecera.
- **P4**: «Prohibido guardar emails, IPs…» pasa a permitir guardar la IP **solo en la lista negra y en los contadores de intentos**, nunca junto a nombres, sesiones o registros, ni en el CSV.
- **§6**: «La protección contra ataques automatizados (scripts) no es un requisito» pasa a pedir que el registro limite los intentos por IP.
- Historial: fila 3.0 con fecha y motivo (issue #395). El resto del texto no cambia.

### 2.8 Documentación

- `docs/ARCHITECTURE.md`: `rate_limit.py` en el árbol y en las tablas de §1 y §3; las dos tablas en `storage/`; `check_in` coordina la regla y el almacenamiento.
- `README.md`: sección corta con los límites (5 por segundo, 20 por minuto), el aviso de ban, que el bloqueo es permanente, el efecto «toda la clase comparte la IP `127.0.0.1`» y el comando de desbloqueo (§2.6).
- `AGENTS.md` §8: fila de la spec 006.

---

## 3. Archivos

| Archivo | Cambio |
| --- | --- |
| `specs/006-limite-por-ip/` | `spec.md`, `plan.md`, `tasks.md` |
| `asistencia/domain/rate_limit.py` | **Nuevo** |
| `asistencia/storage/sqlite.py` | 2 tablas en `SCHEMA` y 3 funciones |
| `asistencia/usecases/attendance.py` | `check_in` recibe `ip` y llama a `_enforce_ip_limit` |
| `app.py` | Pasa `request.remote_addr`; `IpBanned: 429` en `DOMAIN_ERRORS` |
| `tests/test_rate_limit.py` | **Nuevo**: función pura |
| `tests/test_ip_storage.py` | **Nuevo**: contadores, poda, bloqueo persistente, aislamiento del esquema |
| `tests/test_api.py` | Casos nuevos añadidos al final; los existentes no se tocan |
| `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md` | Ver §2.7 y §2.8 |

`asistencia/domain/codes.py`, `asistencia/export.py`, `static/` y `tests/test_architecture.py` no cambian.

---

## 4. Plan de pruebas

| CA | Cómo se comprueba |
| --- | --- |
| CA-01, CA-03 | `test_rate_limit.py`: 5 por segundo y 20 por minuto no superan el límite |
| CA-02, CA-04 | `test_rate_limit.py`: 6 por segundo y 21 por minuto lo superan; `test_api.py`: el 6.º y el 21.º reciben 429 |
| CA-05 | `test_api.py`: 429 con mensaje en español que menciona al profesor |
| CA-06, CA-07 | `test_api.py`: IP bloqueada rechazada con código válido; otra IP (`REMOTE_ADDR`) se registra |
| CA-08 | `test_ip_storage.py` y `test_api.py`: un `create_app` nuevo sobre la misma base sigue rechazando |
| CA-09 | `test_ip_storage.py`: tras borrar de las dos tablas, la IP vuelve a registrarse y cuenta desde 0 |
| CA-10 | `test_api.py`: cambiar nombre y código no cambia la IP contada |
| CA-11 | `test_api.py`: `X-Forwarded-For` y `CF-Connecting-IP` no cambian la IP contada |
| CA-12 | `test_api.py`: peticiones con cabeceras distintas cuentan juntas como `127.0.0.1`; verificación manual con `--tunel` si `cloudflared` está instalado |
| CA-13 | `test_codes.py` sin cambios + test que fija cifras y rotación |
| CA-14 | Los tests existentes siguen pasando; verificación manual de un registro normal |
| CA-15 | `test_ip_storage.py`: las dos tablas no tienen columnas ni claves hacia `checkins`/`sessions`, y `checkins` no tiene IP |
| CA-16 | `test_api.py`: el CSV exportado no contiene la IP bloqueada |
| CA-17 | Revisión manual de `git diff docs/CONSTITUTION.md`: solo los cuatro cambios previstos |

**Riesgo con los tests existentes:** usan siempre la misma IP de prueba y un reloj parado, así que los que hacen más de 5 registros seguidos se bloquearían. Los tests antiguos no se editan: se para y se propone el cambio antes de tocarlos (precedente: spec 005, CA-10). Los tests nuevos avanzan el reloj.

**Carreras:** las funciones de `storage` abren conexiones propias; con peticiones simultáneas dos hilos pueden contar el mismo instante. Para este límite se acepta: la IP se bloquea igualmente en el siguiente intento.

---

## 5. Comprobación de la constitución

| Regla | Cómo la cumple el plan |
| --- | --- |
| P1 · Independiente de la plataforma | El límite es de la aplicación, no de Discord ni de Meet. |
| P2 · Simplicidad | Una función pura, dos tablas y una llamada. Sin clases, sin hilos, sin pantalla de desbloqueo ni bloqueos por tiempo. |
| P3 · Dependencias mínimas | Solo biblioteca estándar y SQLite. `sqlite3` de la terminal solo se usa para desbloquear a mano. |
| P4 · Privacidad mínima | **Requiere la enmienda 3.0 (§2.7).** La IP solo está en `blocked_ips` e `ip_attempts`, sin relación con nombres, sesiones o CSV. Los contadores se borran a los 60 s. |
| P5 · Accesible y móvil | No cambia ninguna pantalla; el alumno ve el mensaje de error de siempre. |
| P6 · Todo en español | El aviso de ban y el README van en español; el código, en inglés. |
| §3 Stack | Sin cambios. |
| §4 SDD | Spec aprobada primero; este plan, luego tasks, luego código. |
| §5 Calidad | Cada CA tiene su test (§4); el mensaje de error dice qué hacer. |
| §6 Seguridad | **Requiere la enmienda 3.0.** Añade protección contra intentos automáticos. |
| §7 Alcance | Todo dentro de `staff/ella-deyavorsky/asistenciapp/`. |
| `docs/ARCHITECTURE.md` | `domain` solo biblioteca estándar; `storage` no importa nada del proyecto; `usecases` usa `domain` y `storage`; `app.py` no importa `storage` ni `sqlite3`. `test_architecture.py` lo vigila. |

---

## 6. Riesgos

- **Toda la clase comparte contador (CA-12).** Si se registran más de 5 alumnos en un segundo o más de 20 en un minuto, se bloquea `127.0.0.1` para siempre y nadie puede registrarse hasta el desbloqueo manual (§2.6). Aceptado por la persona que trabaja en esta carpeta; queda dicho en el README.
- **Bloqueo por error de quien está probando en local.** Quien pruebe a mano con más de 5 intentos seguidos se bloquea a sí mismo, y también en el entorno de desarrollo, hasta desbloquear.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Spec 006 v1.0 aprobada |
| 1.0 | 2026-10-26 | Aprobado, incluida la enmienda de la constitución | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-26 | Función pura en `domain/`, contadores y lista negra en dos tablas de `storage/`, coordinación en `usecases/check_in`; bloqueo permanente; `remote_addr` siempre; desbloqueo manual | Spec 006 v1.1. Aprobado, incluida la enmienda de la constitución |
| 1.2 | 2026-10-26 | La enmienda de la constitución pasa de 2.3 a 3.0 (§2.7, §5) | La constitución §8 sube la versión mayor cuando se contradice un principio, y esto contradice P4. Spec 006 v1.2 |
| 1.3 | 2026-10-26 | §2.4: `ProxyFix` lleva `x_for=0` | Al implementar, el test de cabeceras mostró que por defecto `X-Forwarded-For` cambiaba la IP contada (CA-11) |
