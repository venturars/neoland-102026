# Plan 006 · Límite de intentos de registro por IP

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0

---

## 1. Resumen

| Pieza | Fichero | Cambio |
| --- | --- | --- |
| Reglas | `asistencia/domain/attempts.py` | Nuevo. Límites, error `Blocked` y la función que decide si se ha pasado |
| Infraestructura | `asistencia/infra/sqlite_store.py` | Dos tablas nuevas y sus funciones |
| Casos de uso | `asistencia/use_cases/student.py` | `check_in` recibe la IP y aplica el límite antes de todo lo demás |
| Entrada HTTP | `app.py` | Saca la IP de la petición y responde 429 al bloqueo |
| Documentos | `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md` | Enmienda 3.0, fichero nuevo, explicación para el profesor, tabla de estado |

Sin dependencias nuevas. Las pantallas no cambian: `alumno.js` ya muestra el mensaje de error que llega en cualquier respuesta no prevista.

---

## 2. De dónde sale la IP (CA-08, CA-09)

La app solo escucha en `127.0.0.1`, así que hay dos casos:

| Cómo se arrancó | Quién llega | IP que se cuenta |
| --- | --- | --- |
| `python app.py` | Solo el propio ordenador | La de la conexión (`request.remote_addr`) |
| `python app.py --tunel` | Alumnos a través de `cloudflared`, que conecta desde `127.0.0.1` | La cabecera `CF-Connecting-IP`, si la conexión viene de `127.0.0.1` y la cabecera es una IP válida; si no, la de la conexión |

- Cloudflare escribe `CF-Connecting-IP` con la IP real de quien se conecta y sustituye cualquier valor que mande el cliente. Por eso solo se confía en ella en modo túnel.
- Sin `--tunel` la cabecera se ignora siempre: nadie puede inventarse una IP enviándola.
- `create_app` recibe un parámetro nuevo, `behind_tunnel: bool = False`. `main()` lo pone a `True` con `--tunel`.
- `ProxyFix` pasa a `x_for=0`, para que `X-Forwarded-For`, que el cliente puede mandar, no cambie `remote_addr`.
- La lógica va en una función de `app.py`, `client_ip(request, behind_tunnel)`, porque leer cabeceras HTTP es trabajo de la entrada HTTP.

---

## 3. La regla (CA-01, CA-02, CA-07)

`asistencia/domain/attempts.py`:

- `MAX_PER_SECOND = 5` y `MAX_PER_MINUTE = 20`.
- `Blocked(Exception)` con el mensaje «Esta conexión ha quedado bloqueada por demasiados intentos de registro. Habla con el profesor.»
- `exceeds_limit(previous: list[float], t: float) -> bool`: recibe los instantes de los intentos anteriores de esa IP y el actual. Cuenta cuántos caen en el último segundo y en el último minuto, incluido el actual, y dice si alguno pasa del máximo. No toca la base de datos, así que se prueba con listas de números.

---

## 4. Guardado (CA-06, CA-11)

Dos tablas nuevas en el mismo archivo, separadas de `checkins`:

```sql
CREATE TABLE IF NOT EXISTS attempts (
  ip  TEXT NOT NULL,
  at  REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS attempts_ip_at ON attempts (ip, at);

CREATE TABLE IF NOT EXISTS blocked_ips (
  ip          TEXT PRIMARY KEY,
  blocked_at  TEXT NOT NULL
);
```

Funciones nuevas en `sqlite_store.py`:

- `is_blocked(conn, ip) -> bool`
- `block_ip(conn, ip, blocked_at)`, que no falla si ya estaba.
- `record_attempt(conn, ip, t) -> list[float]`: borra los intentos de **todas** las IPs con más de 60 s de antigüedad, devuelve los instantes que le quedan a esa IP y guarda el actual.

Al borrar lo antiguo en cada intento, la tabla `attempts` nunca guarda IPs de más de un minuto. `blocked_ips` sí es permanente.

`checkins` no cambia: la IP nunca se guarda junto al nombre ni sale en la lista ni en el CSV.

---

## 5. El caso de uso (CA-03, CA-04, CA-05)

`student.check_in(db_path, session_id, raw_name, code, t, ip)`. Orden dentro de una sola conexión:

1. Si `is_blocked(ip)` → `Blocked`. No se comprueba nada más (CA-05).
2. `previous = record_attempt(ip, t)`. Si `exceeds_limit(previous, t)` → `block_ip(ip)` y `Blocked`.
3. Lo de antes: la clase existe, está abierta, el nombre vale, el código vale y se registra.

Todo intento de registrarse cuenta, acierte o no, aunque la clase no exista (CA-04). `public_info` y el panel del profesor no llaman a nada de esto (CA-03).

En `app.py`, `Blocked` se añade a la tabla de errores con el estado **429** (*Too Many Requests*).

---

## 6. Constitución 3.0 (CA-12)

Se cambia un principio (P4 prohibía guardar IPs) y se invierte una decisión de §6 (v1.1), así que, según §8, sube a **3.0**:

- **P4:** se mantiene la prohibición de guardar IPs, con una excepción: la IP de quien intenta registrarse se guarda solo para contar intentos (un minuto como máximo) y en la lista de bloqueo. Nunca junto al nombre ni a la hora del registro.
- **§6:** los códigos siguen sin poder adivinarse a mano, y además se limitan los intentos automáticos: 5 por segundo y 20 por minuto por IP, con bloqueo permanente.
- **Historial:** fila 3.0 con el motivo (spec 006).

---

## 7. Documentación

- **README:** apartado «Intentos de registro» dentro de «Pasar lista», que explica el límite, el bloqueo permanente, el riesgo de la conexión compartida y cómo desbloquear a mano (`DELETE FROM blocked_ips WHERE ip = '…'`). En «Privacidad» se cambia «Nada de emails ni IPs» por el texto que corresponde. En «Problemas frecuentes», una fila para el aviso de bloqueo.
- **`docs/ARCHITECTURE.md`:** `attempts.py` en la tabla de ficheros.
- **`AGENTS.md` §7:** fila de la 006.

---

## 8. Tests

- `tests/test_attempts.py` (reglas, sin app): justo en el límite no se pasa; el 6.º en el mismo segundo sí; el 21.º en el mismo minuto sí; los intentos de hace más de un minuto no cuentan.
- `tests/test_rate_limit.py` (API, con el reloj falso de `conftest.py`):
  - El 6.º intento en el mismo segundo recibe 429 con el aviso; los 5 primeros, su respuesta normal (CA-01, CA-04).
  - 20 intentos repartidos en un minuto pasan y el 21.º recibe 429 (CA-02).
  - Abrir páginas, consultar la clase y usar el panel no cuentan (CA-03).
  - Una IP bloqueada recibe 429 en otra clase, con un código correcto, pasado el tiempo y tras crear la app de nuevo con la misma base (CA-05, CA-06).
  - Sin túnel, `CF-Connecting-IP` y `X-Forwarded-For` se ignoran (CA-09).
  - Con túnel, dos `CF-Connecting-IP` distintos tienen contadores separados, y un valor que no es una IP se ignora (CA-08, CA-09).
  - `checkins` no tiene columna de IP y el CSV sigue igual (CA-11).
- `test_architecture.py` ya cubre que `attempts.py` no importa Flask ni `sqlite3`.
- `test_api.py` no se toca: cada test hace pocos registros y tiene su propia base, así que sigue pasando (CA-04, CA-10).

---

## 9. Verificación manual (CA-13)

Arrancar la app en local, abrir una clase y lanzar `asistencia/hack-etico.sh` sobre un rango de 50 códigos con 10 en paralelo. Debe recibir 429 a partir del 6.º intento, y la clase no debe tener ningún registro. Después se para la app, se comprueba que el puerto queda libre y se borra la base de prueba.

---

## 10. Comprobación de la constitución (3.0)

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1 Plataforma | Sí | Funciona igual con cualquier plataforma de clase |
| P2 Simplicidad | Sí | Dos tablas y una función de regla. Sin dependencias ni servicios externos |
| P3 Dependencias | Sí | `ipaddress` es de la biblioteca estándar |
| P4 Privacidad | Sí, con la enmienda 3.0 | IP solo en intentos (≤ 60 s) y en la lista de bloqueo; nunca con el nombre |
| P5 Móvil | Sí | Las pantallas no cambian |
| P6 Español | Sí | Aviso y documentación en español |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes del código |
| §5 Calidad | Sí | Cada criterio tiene test o verificación manual |
| §6 Seguridad | Sí, con la enmienda 3.0 | El límite es la protección nueva |
| §7 Alcance | Sí | Solo `staff/sergio-moras/asistenciapp/` |
