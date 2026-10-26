# Plan técnico 006 · Control de acceso por IP

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada el 2026-10-24 · Creado: 2026-10-24 · Aprobado: 2026-10-24

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No se añade ninguna dependencia. Flask y pytest siguen siendo las únicas. `asistencia/domain/codes.py` no se modifica: el código sigue siendo de 4 cifras y caduca igual.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `asistencia/domain/access.py` | Regla pura: con las horas de las llamadas de una IP y el instante actual, dice si esta llamada pasa de 5 en un segundo o de 20 en un minuto | CA-01, CA-02, CA-03, CA-04 |
| `asistencia/infra/db.py` | Tabla `blacklist`. Guardar una IP y mirar si está. No hay forma de quitarla ni de cambiarla. La lista de asistencia no gana ninguna columna | CA-03, CA-04, CA-05, CA-08, CA-09, CA-10 |
| `asistencia/actions/attendance.py` | Antes de registrar, cuenta la llamada y aplica el ban | CA-01 a CA-06, CA-09, CA-10 |
| `app.py` | Lee la IP de la conexión. No lee una IP del cuerpo ni de una cabecera. No hay ruta para tocar la blacklist | CA-06, CA-10 |
| `static/alumno.js` | Muestra el texto de error que ya devuelve el servidor, también el aviso de ban | CA-03, CA-04, CA-05 |
| `docs/ARCHITECTURE.md` | El árbol nombra `domain/access.py` | — |
| `README.md` | Dice el límite, el aviso y que una IP de la blacklist no se quita ni se cambia | CA-03, CA-10 |
| `tests/test_access.py` | La regla de 5 y de 20, sin base y sin navegador | CA-01, CA-02, CA-03, CA-04 |
| `tests/test_api.py` | Llamadas, ban, IP de la conexión, lista sin IP, persistencia y que no se puede modificar la blacklist | CA-01 a CA-10 |

No se tocan `codes.py`, las specs `001` a `005`, ni `requirements.txt`. `tasks.md` se escribe en la fase siguiente, no aquí.

---

## 2. Decisiones

### 2.1 La IP que cuenta (CA-06)

La IP pública estática es la dirección de la conexión, `request.remote_addr`. Quien llama no puede cambiarla escribiendo otra en el cuerpo, ni en `X-Forwarded-For`, ni en `CF-Connecting-IP`.

`ProxyFix` sigue como está: solo ajusta el protocolo y el host del túnel. No se activa `x_for`, porque esa cabecera la puede escribir quien llama.

En los tests, la dirección de la conexión se fija aparte del JSON. El JSON puede traer otra IP: no se usa.

Con `python app.py --tunel`, cloudflared es quien se conecta al programa, así que las llamadas que entran por el túnel comparten esa dirección. No se usa la cabecera del túnel: quien llama podría escribirla si entra en local, y la spec pide una IP que no se pueda cambiar.

### 2.2 Límite y blacklist (CA-01, CA-02, CA-03, CA-04, CA-05, CA-09)

Cada `POST` de pasar lista cuenta, antes de mirar el nombre, el código o si la clase está abierta. Da igual el nombre y da igual la clase. La cuenta es de esa IP.

La cuenta vive en memoria, en la app, como horas de llamada por IP. No se guarda en la base: la constitución solo permite guardar la IP para la blacklist. Al anotar una llamada se olvidan las que ya tienen más de un minuto.

`domain/access.py` recibe esas horas y el instante. Devuelve que hay ataque si en el último segundo hay más de 5, o en el último minuto hay más de 20. La llamada número 5 de ese segundo y la número 20 de ese minuto siguen valiendo.

Orden en la acción de registrar:

1. Si la IP ya está en la blacklist, se responde el aviso de ban y no se registra.
2. Se anota esta llamada. Si pasa el límite, la IP entra en la blacklist y se responde el mismo aviso. No se registra.
3. Si no pasa el límite, sigue el registro de ahora: clase cerrada, nombre, código o alta.

El aviso, en los tres casos, es: «No puedes pasar lista: tu acceso está bloqueado.» El estado HTTP es `403`.

La blacklist es una tabla en la misma base local:

```
CREATE TABLE IF NOT EXISTS blacklist (
  ip        TEXT PRIMARY KEY,
  banned_at TEXT NOT NULL
);
```

`CREATE TABLE IF NOT EXISTS` la añade también en una base que ya existía. Cerrar la clase, dejar pasar el tiempo o volver a abrir la app con esa base no la borra. No hay función para borrar una fila ni para cambiar la IP.

Por debajo del límite, un código que no vale sigue respondiendo el aviso que ya existe y esa llamada cuenta.

### 2.3 Nadie modifica la blacklist (CA-10)

No hay ruta, botón ni función para quitar una IP o cambiarla. Ni el profesor, ni el gestor, ni quien llama. El panel no gana una lista de bloqueados.

Pedir borrar una IP responde como cualquier ruta que no existe, y la fila sigue igual.

### 2.4 Lo que no cambia (CA-07, CA-08)

`codes.py` no se toca. La vista del profesor y el CSV siguen con nombre y hora, sin IP. `alumno.js` ya enseña `data.error` cuando el alta no sale bien; el aviso de ban sale por ahí. Si el estado es `403`, no se trata como un código mal escrito.

---

## 3. Verificación

| Criterio | Qué se comprueba | Resultado |
| --- | --- | --- |
| CA-01 | Cinco llamadas o menos en ese segundo, y menos de 20 en ese minuto, con el código vigente | El alta sigue en `201` |
| CA-02 | Una llamada bajo el límite con un código que no vale | Sigue el aviso de código no válido, y la siguiente llamada ya cuenta una más |
| CA-03 | La sexta llamada en ese mismo segundo | `403` con «No puedes pasar lista: tu acceso está bloqueado.», sin alta, y la IP de la conexión en la blacklist |
| CA-04 | La llamada 21 en ese minuto, sin llegar a 6 en un segundo | El mismo `403`, sin alta, y la IP en la blacklist |
| CA-05 | Una IP que ya está en la blacklist envía el código vigente | `403` y no queda registrada |
| CA-06 | El cuerpo y las cabeceras traen otra IP | La blacklist guarda `request.remote_addr` |
| CA-07 | `codes.py` no está en el diff. `tests/test_codes.py` pasa | El código sigue en 4 cifras y caduca igual |
| CA-08 | La vista del profesor y el CSV | Nombre y hora, sin IP |
| CA-09 | Pasa el tiempo, se cierra la clase y se abre otra app con la misma base | La IP sigue en la blacklist |
| CA-10 | Se pide quitar o cambiar esa IP, con o sin el token del panel | No existe esa acción. La IP sigue igual |

---

## 4. Comprobación de la constitución (v3.0)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | El control es de la llamada para pasar lista. No se ata a Discord ni a Meet |
| P2 Simplicidad | Sí | Una regla pura, una tabla y la dirección de la conexión. No hay una segunda base ni una cabecera que haya que interpretar |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. Siguen Flask y pytest. La cuenta en memoria usa un diccionario |
| P4 Privacidad | Sí | La lista de asistencia sigue siendo nombre y hora. La IP solo se guarda en `blacklist`. Las horas del límite no se escriben en la base |
| P5 Accesible y móvil | Sí | El aviso es texto. El panel no cambia |
| P6 Español | Sí | El aviso, el panel, la spec y este plan están en español. Los nombres del código siguen en inglés |
| Apartado 5, calidad | Sí | CA-01 a CA-10 tienen un test en la tabla de arriba. El aviso dice que no puede pasar lista |
| Apartado 6, seguridad | Sí | El código no se complica: `codes.py` no cambia. Quien ataca entra en la blacklist con la IP de la conexión. El registro único, la clase cerrada y la validación del nombre siguen delante cuando la llamada está dentro del límite |
