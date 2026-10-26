# Plan técnico 006 · Límite por IP pública

> Estado: **Aprobado** (2026-10-26) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-26 · Aprobado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

El alumno se registra como hasta ahora. Antes de aceptar el intento, la app mira la IP de esa conexión.

La IP es la de la conexión TCP (`request.remote_addr`). No se lee del cuerpo ni de una cabecera. Quien envía otra IP no cambia la que se cuenta.

Si esa IP ya está bloqueada, el intento no registra a nadie y responde con el aviso de ban. Si no lo está, el intento se anota. Con más de 5 en el último segundo, o más de 20 en el último minuto, la IP entra en la lista de bloqueo y la respuesta es el mismo aviso. Con 5 y con 20 todavía se puede registrar.

La lista vive en el mismo archivo local que la asistencia y no se borra. Los intentos de más de un minuto se tiran: no hacen falta para el máximo y no son la lista.

El código de cuatro dígitos no se toca. Ver la lista, abrir la página y el resto de rutas no anotan intentos.

No se añaden dependencias. Siguen Flask, pytest y `sqlite3`.

---

## 2. Decisiones

### 2.1 La IP es la de la conexión (CA-07)

`app.py` pasa `request.remote_addr` a la acción de registrarse. `ProxyFix` sigue con `x_proto=1` y `x_host=1`, sin `x_for`. Así `X-Forwarded-For` no sustituye a la IP de la conexión.

No se leen `CF-Connecting-IP`, `X-Forwarded-For` ni un campo `ip` del JSON. El test los envía con otra dirección y comprueba que el recuento y el bloqueo siguen en `REMOTE_ADDR`.

Con `python app.py`, el script local es `127.0.0.1`. El límite y la lista le aplican a esa IP.

Con `python app.py --tunel`, cloudflared también entra desde `127.0.0.1`. La app no coge la IP pública que Cloudflare escribe en una cabecera: quien llama en local a `127.0.0.1` podría poner esa cabecera y saltarse el límite. Todos los alumnos del túnel comparten `127.0.0.1`: 20 intentos por minuto son de la clase entera, y un ban los bloquea a todos.

### 2.2 Qué cuenta como intento (CA-01, CA-02, CA-03)

Solo cuenta `POST /api/s/<id>/checkin`. Cuenta aunque el código sea malo, el nombre esté vacío, la clase no exista o ya esté cerrada: es un intento de registrarse.

No cuentan abrir la página, `GET /api/s/<id>`, ni las rutas del profesor. El panel puede seguir pidiendo la lista cada 2 segundos.

El máximo es de la IP, no de una clase. Un bloqueo vale para cualquier clase.

5 intentos en el último segundo, y 20 en el último minuto, siguen adelante. El siguiente, si pasa de uno de los dos, bloquea. La ventana es cerrada: entra un intento cuya hora es `>= ahora - 1` segundo, o `>= ahora - 60` segundos. El intento actual ya está anotado cuando se cuenta.

Ese intento que se pasa no registra al alumno. Si la IP ya estaba bloqueada, se responde el ban y no se vuelve a anotar.

### 2.3 Dónde se guarda (CA-04, CA-05, CA-06)

En `data/asistencia.db`, el mismo archivo de ahora. Dos tablas nuevas:

| Tabla | Columnas | Qué dura |
| --- | --- | --- |
| `registration_attempts` | `ip`, `attempted_at` (segundos Unix) | Se borran los de más de 60 segundos |
| `blocked_ips` | `ip` (clave), `blocked_at` (ISO UTC) | Para siempre. No hay borrado |

`checkins` no gana columna. La IP no se guarda junto al nombre ni a la hora.

Al cerrar y volver a abrir la app se usa el mismo archivo, así que la IP sigue en `blocked_ips`.

### 2.4 Quién decide y quién guarda (CA-01 a CA-07)

| Archivo | Parte | Qué hace |
| --- | --- | --- |
| `asistencia/domain/attempts.py` | Reglas | `over_limit(en_el_segundo, en_el_minuto)` es verdadero si el segundo pasa de 5 o el minuto de 20. El error `Banned` lleva el aviso |
| `asistencia/storage/sqlite.py` | Almacén | Crea las dos tablas. Anota, cuenta, poda intentos, lee y escribe el bloqueo. No decide el máximo |
| `asistencia/usecases/attendance.py` | Acciones | En `check_in`, mira el bloqueo, anota el intento y, si la regla lo dice, bloquea. Luego sigue el registro de ahora |
| `app.py` | Pantalla | Lee `request.remote_addr` y traduce `Banned` a HTTP 429 con el aviso. No abre la base |
| `static/` | Pantalla | No se toca. El formulario ya muestra `data.error` cuando el registro no sale bien |

El aviso, en español, es: «Esta dirección queda bloqueada por haber superado los intentos permitidos.»

Las reglas no importan Flask ni `sqlite3`. El almacén no importa Flask ni las reglas.

### 2.5 El puzzle no cambia (CA-08)

`asistencia/domain/codes.py` no se modifica. Sigue el código de cuatro dígitos y su caducidad. Lo cubre la suite que ya prueba los códigos.

### 2.6 La constitución pasa a 3.0 (CA-09)

En `docs/CONSTITUTION.md`, P4 deja de prohibir toda IP. El texto nuevo dice que la IP pública estática se recuerda solo para contar los intentos de registrarse y para la lista de bloqueo, y que no forma parte del registro del alumno. El nombre y la hora siguen siendo lo único del alumno. El archivo sigue siendo local.

La versión pasa de **2.4 a 3.0** porque se contradice la prohibición de guardar IPs. El historial gana una fila con fecha 2026-10-26. No se escriben ahí el 5, el 20, el aviso, que la lista dura para siempre, ni la regla del puzzle.

§6 no se reescribe. El código sigue caducando, un alumno no se registra dos veces y una clase cerrada no acepta registros. La protección contra scripts sigue sin figurar como requisito en §6.

`tests/test_architecture.py` deja de exigir «Versión 2.4». Pasa a buscar la versión vigente `3.0` y la frase de la excepción en P4. Las carpetas de la 005 siguen comprobándose.

### 2.7 El README y la arquitectura

Junto a «Un registro por navegador», un apartado corto: una IP puede intentar registrarse 5 veces por segundo y 20 por minuto; al pasarse queda bloqueada para siempre; no hay forma de quitarla en esta versión; el código no cambia.

En «Privacidad», la frase de que no se guardan IPs pasa a decir que la IP se recuerda solo para ese recuento y para la lista, en el mismo archivo local, y no junto al nombre ni a la hora.

`docs/ARCHITECTURE.md` gana la fila de `asistencia/domain/attempts.py`.

---

## 3. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test de la regla: 5 y 20 no bloquean; 6 en el segundo o 21 en el minuto, sí. Test de la API con el reloj fijo: cinco códigos malos en el mismo instante responden 422; el sexto, 429 |
| CA-02 | Test de la API: un intento con el código vigente, sin llegar al máximo, responde 201 y guarda nombre y hora |
| CA-03 | Test de la API: muchas lecturas de la lista y de la página, desde la misma IP, no bloquean un registro posterior |
| CA-04 | Test de la API: el intento que se pasa responde 429 con el aviso, no crea un registro, y la IP queda en `blocked_ips` |
| CA-05 | Test de la API: con la IP ya bloqueada, el código vigente responde 429 y no crea un registro |
| CA-06 | Test de la API: se cierra la app, se abre otra con el mismo archivo y la IP sigue recibiendo 429 |
| CA-07 | Test de la API: el cuerpo y las cabeceras traen otra IP; el bloqueo queda en `REMOTE_ADDR` y la otra IP todavía puede registrarse |
| CA-08 | La suite actual de `tests/test_codes.py`. `codes.py` no se modifica |
| CA-09 | Test: la constitución vigente es 3.0 y P4 dice la excepción. El nombre y la hora siguen. `checkins` no tiene columna de IP |

---

## 4. Comprobación de la constitución (v2.4, antes de la enmienda)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | El registro sigue sin depender de Discord, Meet u otra plataforma |
| P2 Simplicidad | Sí | Dos tablas en el archivo que ya existe y una regla que compara dos números |
| P3 Dependencias mínimas | Sí | No se añade ninguna. Siguen Flask, pytest y `sqlite3` |
| P4 Privacidad | No, hasta la enmienda | Hoy prohíbe guardar IPs. La enmienda 3.0 (§2.6) permite recordar la IP pública estática solo para el recuento y la lista de bloqueo |
| P5 Accesible y móvil | Sí | `static/` no se toca. El aviso sale en el mismo mensaje de error del formulario |
| P6 Español | Sí | El aviso, el README y este plan van en español |
| §5 Calidad | Sí | CA-01 a CA-07 y CA-09 tienen test. CA-08 es la suite de códigos que ya existe |
| §6 Seguridad | Sí | El código sigue caducando y no se alarga. El límite nuevo vive en la spec, no se escribe en §6 |

---

## 5. Decisiones tomadas

1. **La IP es `request.remote_addr`** (2026-10-26): es la única que quien se registra no puede cambiar. Fiarse de `CF-Connecting-IP` dejaría que un script local pusiera esa cabecera y se saltara el límite.
2. **El túnel comparte `127.0.0.1`** (2026-10-26): cloudflared y el script local entran por la misma dirección. Un ban en una clase online bloquea a todos los alumnos de ese túnel.
3. **Los intentos caducan al minuto y la lista no** (2026-10-26): el máximo solo mira el último minuto. La lista dura para siempre.
4. **No hay forma de quitar una IP** (2026-10-26): la spec lo deja fuera.
5. **La enmienda es 3.0** (2026-10-26): se contradice la prohibición de guardar IPs. No basta una 2.5.
