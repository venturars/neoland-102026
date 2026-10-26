# Plan 007 · Quién falta

> Estado: **Aprobado** (2026-10-25) · Spec: [spec.md](spec.md) aprobada el 2026-10-25

Este plan dice cómo se cumple la spec. Cada decisión nombra el criterio (`CA-xx`) que cubre.

---

## 1. Cómo

La clase es una lista fija de quince nombres, en el orden de la spec. No está en el fichero de la asistencia y no se edita desde la pantalla (CA-01).

El alumno recibe esos nombres con la página de la clase. El cuadro empieza vacío: no se ve la lista. Al escribir, salen las sugerencias. Al elegir una, el cuadro se completa con el nombre entero. «sergio» deja a Sergio Cortes y a Sergio Moras. «torres» deja a Diego Torres. No hay fotos (CA-02, CA-03, CA-07).

Pasar lista envía el nombre elegido, no el texto a medias. El servidor lo acepta solo si es uno de los quince. Lo guarda con la grafía de la lista y la hora. Si el nombre no está, no apunta a nadie y responde «Elige tu nombre de la lista.» (CA-04, CA-06).

La lista del profesor sigue mostrando quién ya está. Aparte, muestra quién falta: los de la clase que ahora no están apuntados, en el mismo orden. Si se quita a alguien, vuelve a faltar, porque faltar es «no está apuntado ahora» (CA-05).

La descarga sigue siendo solo quien está apuntado. El código de cuatro cifras, el límite de intentos y el no apuntarse dos veces no cambian (CA-08).

No se añaden dependencias.

La constitución pasa a 4.0. Hoy P4 solo deja el nombre que el alumno escribe. La lista de la clase contradice esa frase. La 4.0 deja guardar estos nombres para ver quién falta. El registro sigue siendo el nombre elegido y la hora, en el fichero local. Sin fotos ni emails (CA-09).

Los tests que ya apuntan a «Ana», «Luis» u otro nombre inventado pasan a usar un nombre de la clase. Si no, un registro que antes valía quedaría rechazado. Lo que prueban (el código, el duplicado, quitar, la descarga) no cambia.

---

## 2. Dónde vive cada parte

| Archivo | Qué hace |
| --- | --- |
| `asistencia/domain/roster.py` | La lista, en el orden de la spec. `matches(texto)` devuelve los nombres que contienen ese texto, sin mirar mayúsculas. Vacío devuelve los quince. `official_name(texto)` devuelve el nombre de la lista o nada si no es exactamente uno de ellos. No abre el fichero y no dibuja la página. |
| `asistencia/usecases/attendance.py` | `public_session` incluye `names`. `check_in` guarda el nombre oficial o lanza el aviso si no está en la clase. `teacher_view` incluye `missing`: los que no están entre los presentes. |
| `app.py` | No abre el fichero. El aviso de un nombre que no está sale como el resto de errores de nombre. |
| `static/alumno.html` y `static/alumno.js` | El cuadro de búsqueda y la lista para elegir. Se envía el nombre elegido. Sin imágenes. |
| `static/profesor.html` y `static/profesor.js` | Bajo los presentes, los nombres que faltan. Se escriben como texto. |
| `docs/CONSTITUTION.md` | Versión 4.0. P4 permite la lista de estos nombres para ver quién falta. El registro sigue siendo el nombre elegido y la hora (CA-09). |
| `docs/ARCHITECTURE.md` | Una fila para `asistencia/domain/roster.py`. |
| `AGENTS.md` | La tabla de specs marca 007. |
| `README.md` | Un apartado corto: la clase ya está en la lista, el alumno busca y elige, y el profesor ve quién falta. Sin fotos. |

Las funciones nuevas dicen qué reciben, qué devuelven y un ejemplo, como el resto de esta carpeta.

`checkins` no gana columnas. Quien falta se calcula al leer, no se guarda aparte.

---

## 3. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 | Sí | Pasar lista no depende de Discord ni de Meet. |
| P2 | Sí | Una lista fija y un filtro por texto. Quien falta sale de restar los presentes. |
| P3 | Sí | No hay dependencias nuevas. La búsqueda es la página, sin librería. |
| P4 | No, hasta la enmienda | Hoy solo deja el nombre escrito por el alumno. La versión 4.0 permite la lista de la clase para ver quién falta. El registro sigue siendo el nombre elegido y la hora, en local. Sin fotos ni emails. |
| P5 | Sí | El cuadro tiene etiqueta, se usa con teclado y cabe en un móvil. Los nombres se muestran como texto. |
| P6 | Sí | La página, el aviso, el README, la spec y este plan van en español. |
| §4 | Sí | La spec está aprobada antes de este plan. El código espera al sí de las tasks. |
| §5 | Sí | CA-01 a CA-09 tienen test. El filtro en la página se mira a mano, porque el navegador no entra en pytest. La regla del filtro sí tiene test. |
| §6 | Sí | El código sigue caducando. Una clase cerrada y un nombre repetido siguen igual. El nombre se valida en el servidor. |
| §7 | Sí | Todo queda en `staff/meghan-martin/asistenciapp/`. |

---

## 4. Tests

- Sin presentes, la vista del profesor devuelve los quince como faltantes, en el orden de la spec.
- `matches("sergio")` devuelve a Sergio Cortes y a Sergio Moras. `matches("meghan")` solo a Meghan Martin. `matches("torres")` solo a Diego Torres. `matches("")` devuelve los quince.
- Elegir Meghan Martin con el código vigente la apunta con ese nombre y la hora, y ya no está entre los que faltan.
- Con ella apuntada, el resto sigue faltando.
- «Otra Persona» y un nombre vacío no apuntan a nadie. El de fuera recibe «Elige tu nombre de la lista.»
- La respuesta del alumno trae los quince nombres y ningún campo de foto. La página del alumno no tiene imágenes.
- Un segundo intento con el mismo nombre, ya en otra grafía, sigue contando como la misma persona.
- El código viejo, la clase cerrada y el límite de intentos siguen respondiendo como ahora.
- `pytest` de los códigos sigue pasando, y `codes.py` no se modifica.
- La constitución vigente es 4.0 y P4 dice la lista de la clase. `checkins` no tiene columnas nuevas.
