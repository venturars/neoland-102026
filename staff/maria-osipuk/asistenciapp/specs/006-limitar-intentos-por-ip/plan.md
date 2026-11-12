# Plan técnico 006 · Limitar los intentos de registro por dirección

> Estado: **Aprobado e implementado** (2026-10-26) · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios (`CA-xx`) cubre. No se añade ninguna dependencia. La constitución se enmienda a 3.0 en la misma implementación, con el texto ya aprobado en la spec.

---

## 1. Visión general

El registro sigue entrando por `app.py`, que llama a `check_in`. Antes de apuntar a nadie, la acción anota el intento y pregunta a la regla si esa dirección se ha pasado. La regla no abre la base. El almacenamiento guarda los intentos recientes y la lista de bloqueo en el mismo archivo de siempre.

```text
app.py
  → usecases/attendance.py
      → domain/attempts.py
      → storage/sqlite.py
```

La dirección no se lee del JSON. En local es la de la conexión. Con `--tunel` la conexión sigue siendo la de este ordenador, y la dirección que cuenta es la del visitante que Cloudflare envía en `CF-Connecting-IP`, solo en ese caso. Así la clase no comparte un único bloqueo.

---

## 2. Decisiones

### 2.1 Regla (`asistencia/domain/attempts.py`) (CA-01 a CA-07)

El módulo nuevo no importa Flask, el almacenamiento ni las acciones. Una función recibe cuántos intentos de esa dirección hay ya en cada ventana, **incluido el intento que acaba de llegar**:

| Ventana | Qué entra | Tope que todavía pasa | A partir de aquí se bloquea |
| --- | --- | --- | --- |
| Último segundo | marcas posteriores a `ahora - 1` y hasta `ahora` | 5 | 6 |
| Último minuto | marcas posteriores a `ahora - 60` y hasta `ahora` | 20 | 21 |

Un intento con marca exactamente igual a `ahora - 1` o a `ahora - 60` queda fuera. No se usa el segundo ni el minuto del reloj de pared.

`RegistrationBlocked` es el error de bloqueo. Su mensaje, el único, es: «Demasiados intentos de registro. Este intento no se ha guardado.» Vale igual al superar el tope y al llegar desde una dirección ya bloqueada. No dice que el bloqueo caduque.

### 2.2 Tablas (`asistencia/storage/sqlite.py`) (CA-09 a CA-13, CA-20)

`prepare` crea las tablas si faltan, sin borrar clases ni registros:

```sql
CREATE TABLE IF NOT EXISTS registration_attempts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  address      TEXT NOT NULL,
  attempted_at REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS registration_blocks (
  address    TEXT PRIMARY KEY,
  blocked_at REAL NOT NULL
);
```

`attempted_at` y `blocked_at` son segundos Unix, el mismo reloj que ya recibe la acción. La dirección no se añade a `checkins` ni al CSV ni al JSON del profesor.

En una sola transacción, anotar un intento hace esto:

1. Si la dirección ya está en `registration_blocks`, no inserta el intento y lo dice.
2. Si no, inserta la marca, borra las marcas con `attempted_at <= ahora - 60` de cualquier dirección y devuelve cuántas marcas de esta dirección caen en cada ventana, incluida la nueva.

Otra función guarda el bloqueo con `INSERT OR IGNORE`. No hay columna de caducidad ni operación de desbloqueo. El bloqueo no depende de la clase: sigue valiendo en la siguiente y después de cerrar y abrir la aplicación.

La regla de los números 5 y 20 no se copia aquí. Este módulo solo cuenta y guarda.

### 2.3 Acción (`asistencia/usecases/attendance.py`) (CA-02, CA-04 a CA-07, CA-14 a CA-16)

`check_in` recibe un argumento nuevo, `address: str`, además de la ruta, la clase, el nombre, el código y el reloj. Ese argumento no sale del nombre ni del código.

Orden:

1. Anotar el intento. Si la dirección ya estaba bloqueada, lanzar `RegistrationBlocked` y no registrar.
2. Si la regla dice que este intento es el sexto del segundo o pasa de 20 en el minuto, guardar el bloqueo, lanzar `RegistrationBlocked` y no registrar. Da igual que el nombre y el código hubieran valido.
3. Si no, seguir el registro de ahora: clase, clase abierta, nombre, código y alta. Un rechazo de esos también deja la marca ya anotada, así que cuenta.

Las demás acciones no anotan intentos ni consultan el bloqueo.

### 2.4 Entrada (`app.py`) (CA-08, CA-17, CA-18, CA-21)

Solo la ruta de registro elige la dirección, con la biblioteca estándar `ipaddress`. No se lee un campo del JSON. `ProxyFix` sigue con `x_proto=1, x_host=1` y sin `x_for`.

1. Si la conexión es `127.0.0.1` o `::1` y `CF-Connecting-IP` es una sola dirección, válida y sin comas, esa es la que cuenta.
2. Si esa cabecera falta, viene vacía o no es una sola dirección, cuenta `request.remote_addr`.
3. Si la conexión no es la de este ordenador, `CF-Connecting-IP` se ignora y cuenta `request.remote_addr`.
4. `X-Forwarded-For` no se lee. El alumno puede anteponer valores falsos.

La aplicación ya escucha en `127.0.0.1` y el túnel reenvía ahí, así que la cabecera solo entra por esa conexión local. Quien ejecute un programa en este ordenador puede enviar otra. Desde fuera no hay otra entrada. Dos alumnos con la misma dirección pública siguen compartiendo contador y bloqueo. La clase entera no.

`RegistrationBlocked` se traduce a HTTP 429 con ese mensaje en `{"error": "..."}`. El resto de errores sigue con sus códigos actuales.

`static/alumno.js` ya muestra `data.error` cuando la respuesta no es un registro nuevo ni un duplicado ni una clase cerrada. Un 429 cae ahí. No se cambia la pantalla.

### 2.5 Documentación (CA-19, CA-20, CA-21)

- `docs/CONSTITUTION.md` pasa a 3.0. En P4 se añade el párrafo aprobado en la spec. El historial de enmiendas recoge el motivo de la issue #400.
- `README.md`, en privacidad, deja de decir que no se guarda ninguna dirección. Explica que se guarda solo para este control, que con `--tunel` cuenta la dirección del visitante que envía Cloudflare y solo porque la conexión es la de este ordenador, que varios alumnos pueden compartir una dirección pública y el bloqueo es de ese grupo, que un programa en este ordenador puede presentar otra, y que la aplicación no identifica para siempre a una persona ni comprueba si la dirección es fija.
- `docs/ARCHITECTURE.md` nombra `domain/attempts.py`, las dos tablas y esta elección de dirección. Los tres fallos de validación siguen escritos igual.
- `AGENTS.md` añade el módulo al árbol y la fila de la spec 006 en la tabla de estado. `tests/test_layout.py` incluye el archivo nuevo entre los obligatorios y la fila de la spec en la comprobación de la tabla.

### 2.6 Qué no se toca

Los tres fallos de validación de la spec 005. El código de cuatro cifras y su rotación. Las pantallas. El esquema de `checkins`. No se añade ninguna dependencia.

---

## 3. Pruebas

El reloj falso de `tests/conftest.py` fija las ventanas. La conexión de prueba se fija con `REMOTE_ADDR`. La dirección del visitante, cuando toca, va en `CF-Connecting-IP`.

| Criterio | Dónde |
| --- | --- |
| CA-01, CA-02 | El quinto registro en el mismo segundo entra. El sexto responde 429, no crea fila y bloquea |
| CA-03, CA-04 | El vigésimo en el mismo minuto entra. El siguiente responde 429 y bloquea |
| CA-05 | El intento que supera el tope lleva un código vigente y un nombre válido, y aun así no hay fila |
| CA-06 | Un código mal, un nombre que no vale, una clase cerrada y un duplicado aumentan el contador |
| CA-07, CA-08 | Una dirección ya bloqueada recibe 429 y el mensaje acordado, que no promete caducidad |
| CA-09 | Tras crear la aplicación otra vez con el mismo archivo, la dirección sigue bloqueada. Otra clase tampoco la acepta |
| CA-10 | El JSON del profesor, la lista pública y el CSV no traen la dirección |
| CA-11, CA-12 | Una marca de hace justo 60 segundos ya no cuenta y no queda guardada. Una marca dentro del minuto sí cuenta |
| CA-13 | Los intentos posteriores al bloqueo no añaden marcas |
| CA-14 | Ver la clase, abrir una página, cerrar, borrar y descargar no mueven el contador |
| CA-15 | Otra dirección registra aunque la primera esté bloqueada |
| CA-16 | Por debajo del tope, el alta sigue en 201, el código tiene cuatro cifras y la fila guarda nombre y hora |
| CA-17 | Un campo `ip` en el JSON y `X-Forwarded-For` no cambian el contador |
| CA-18 | Desde `127.0.0.1`, sin `CF-Connecting-IP`, cuenta esa conexión local |
| CA-21 | Desde `127.0.0.1`, `CF-Connecting-IP` con una sola dirección válida es la que cuenta, y dos valores distintos no comparten bloqueo. Si falta, trae una coma o no es una dirección, cuenta `127.0.0.1`. Desde otra `REMOTE_ADDR`, esa cabecera se ignora |
| CA-19, CA-20 | El README y la constitución 3.0 dicen la excepción, la dirección pública compartida, el programa en este ordenador, que no identifica a una persona y que no se comprueba si es fija |

No se arranca `cloudflared`. La prueba usa la misma conexión local y la cabecera que el túnel enviaría.

---

## 4. Comprobación de la constitución

La enmienda 3.0 forma parte de este plan. El resto se lee contra esa versión.

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de la plataforma | Sí | El tope no depende de Discord, Meet ni de otra plataforma |
| P2 Simplicidad primero | Sí | Dos tablas, una regla y una sola cabecera, aceptada solo si la conexión es la de este ordenador y el valor es una dirección. Sin caducidad ni desbloqueo |
| P3 Dependencias mínimas | Sí | No se añade nada a `requirements.txt`. Siguen Flask, pytest y la biblioteca estándar |
| P4 Privacidad mínima | Sí, con la enmienda 3.0 | La dirección solo entra en `registration_attempts` y `registration_blocks`. No entra en la asistencia. El túnel sigue sin guardar los datos; el bloqueo queda en el archivo local |
| P5 Accesible y usable en móvil | Sí | No se cambia la pantalla. El mensaje sale donde ya salen los errores |
| P6 Todo en español | Sí | El mensaje nuevo está en español. La spec y este plan también |
| §5 Calidad | Sí | Cada CA tiene una prueba en la tabla de arriba. `pytest` tiene que pasar |
| §6 Seguridad | Sí | El código sigue caducando, un nombre no se apunta dos veces en la clase y una clase cerrada no acepta altas. El tope se valida en el servidor. La enmienda 1.1 no pedía este tope; la issue #400 sí, y no convierte la protección general contra scripts en un requisito |

---

## 5. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador | Spec 006 aprobada. A la espera del ok antes de las tareas |
| 0.2 | 2026-10-26 | La dirección del túnel es `CF-Connecting-IP` si la conexión es local | Opción 1, spec v1.1. A la espera del ok antes de las tareas |
| 1.0 | 2026-10-26 | Implementado | Quien trabaja en esta carpeta pidió implementar y commitear |
