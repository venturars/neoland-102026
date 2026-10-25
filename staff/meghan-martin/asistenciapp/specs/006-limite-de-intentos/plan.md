# Plan 006 · Límite de intentos al pasar lista

> Estado: **Aprobado** (2026-10-25) · Spec: [spec.md](spec.md) aprobada el 2026-10-25

Este plan dice cómo se cumple la spec. Cada decisión nombra el criterio (`CA-xx`) que cubre.

---

## 1. Cómo

El alumno se apunta como hasta ahora. Antes, la app mira la dirección del ordenador que envió el intento.

Esa dirección es la de la conexión (`request.remote_addr`). No se lee del formulario ni de una cabecera. Quien escribe otra dirección no cambia la que se cuenta (CA-07). `ProxyFix` sigue sin fiarse de `X-Forwarded-For`.

Si ese ordenador ya está bloqueado, el intento no apunta a nadie y responde con el aviso. Si no lo está, el intento se anota. Con más de 5 en el último segundo, o más de 20 en el último minuto, el ordenador entra en la lista de bloqueo y la respuesta es el mismo aviso. Con 5 y con 20 todavía se puede apuntar (CA-01, CA-02, CA-04, CA-05).

La lista vive en el mismo fichero local de la asistencia y no se borra. Por eso sigue al cerrar la app y volver a abrirla (CA-06). Los intentos de hace más de un minuto se tiran: no hacen falta para el tope y no son la lista.

El código de cuatro cifras no se toca (CA-08). Mirar la lista, abrir la página y el resto de rutas no anotan intentos (CA-03).

No se añaden dependencias. Siguen Flask, pytest y el fichero local.

Quien entra por el enlace público comparte la dirección del ordenador donde corre la app. Esta spec no les da un tope distinto. Un programa en este mismo ordenador también usa esa dirección, y el tope le aplica.

---

## 2. Dónde vive cada parte

| Archivo | Qué hace |
| --- | --- |
| `asistencia/domain/attempts.py` | La regla. `over_limit(en_el_segundo, en_el_minuto)` es verdadero si el segundo pasa de 5 o el minuto de 20. El error `Banned` lleva el aviso. No abre el fichero y no dibuja la página. |
| `asistencia/storage/sqlite.py` | Dos tablas nuevas en el mismo fichero. Anota un intento, cuenta los de una dirección desde un instante, borra los de hace más de un minuto, dice si una dirección está bloqueada y la bloquea. No decide el tope. `checkins` no gana una columna de dirección. |
| `asistencia/usecases/attendance.py` | `check_in` recibe la dirección. Si ya está bloqueada, lanza `Banned`. Si no, anota el intento y, si la regla lo dice, bloquea y lanza `Banned`. Si no se pasa, el registro sigue como ahora. |
| `app.py` | Solo en pasar lista, pasa `request.remote_addr` y traduce `Banned` a 429 con el aviso. No abre el fichero. |
| `static/` | No se toca. El formulario ya muestra el aviso cuando el registro no sale bien. |
| `docs/CONSTITUTION.md` | Pasa a 3.0. P4 deja recordar la dirección solo para el recuento y la lista de bloqueo, no junto al nombre ni a la hora (CA-09). |
| `docs/ARCHITECTURE.md` | Una fila para `asistencia/domain/attempts.py`. |
| `README.md` | Un apartado corto: 5 por segundo, 20 por minuto, bloqueo que se queda, sin forma de quitarlo, y el código no cambia. En privacidad, la dirección se recuerda solo para eso y no junto al nombre ni a la hora. |

El aviso es: «Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista.»

Las funciones nuevas dicen qué reciben, qué devuelven y un ejemplo, como el resto de esta carpeta.

### El fichero

| Tabla | Qué guarda | Cuánto dura |
| --- | --- | --- |
| `checkin_attempts` | dirección y el instante del intento | Se borran los de hace más de 60 segundos |
| `blocked_computers` | dirección y la hora del bloqueo | Para siempre. No hay borrado |

`check_in` anota el intento, tira los viejos y entonces cuenta. Entran los de hace 1 segundo o menos, y los de hace 60 segundos o menos, incluido el intento de ahora. 5 y 20 siguen. El 6 y el 21 bloquean. Ese intento no apunta a nadie. Si ya estaba bloqueado, no se vuelve a anotar.

---

## 3. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 | Sí | Pasar lista no depende de Discord ni de Meet. |
| P2 | Sí | Dos tablas en el fichero que ya existe y una comparación de dos números. |
| P3 | Sí | No hay dependencias nuevas. |
| P4 | No, hasta la enmienda | Hoy prohíbe guardar direcciones. La versión 3.0 permite recordar la de la conexión solo para el recuento y el bloqueo. El nombre y la hora siguen siendo el registro, en el fichero local. |
| P5 | Sí | La página no cambia. El aviso sale en el mismo sitio que los otros errores. |
| P6 | Sí | El aviso, el README, la spec y este plan van en español. |
| §4 | Sí | La spec está aprobada antes de este plan. El código espera al sí de las tasks. |
| §5 | Sí | CA-01 a CA-07 y CA-09 tienen test. CA-08 lo cubre la suite de códigos que ya existe. |
| §6 | Sí | El código sigue caducando. Una clase cerrada y un nombre repetido siguen igual. Los topes no se escriben en §6. |
| §7 | Sí | Todo queda en `staff/meghan-martin/asistenciapp/`. |

---

## 4. Tests

- 5 códigos malos en el mismo instante siguen siendo un código malo. El sexto responde con el aviso y no apunta a nadie.
- 20 intentos separados, sin 6 en el mismo segundo, no bloquean. El 21 sí.
- Un intento con el código vigente, sin llegar al tope, apunta como ahora.
- Muchas lecturas de la lista y de la página, desde la misma dirección, no bloquean un registro posterior.
- Con el ordenador ya bloqueado, el código vigente responde con el aviso.
- Se cierra la app, se abre otra con el mismo fichero y esa dirección sigue bloqueada.
- El formulario y las cabeceras traen otra dirección. El bloqueo queda en la dirección de la conexión, y la otra todavía puede apuntarse.
- `pytest` de los códigos sigue pasando, y `codes.py` no se modifica.
- La constitución vigente es 3.0 y P4 dice la excepción. `checkins` no tiene columna de dirección.
