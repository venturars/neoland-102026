# Plan técnico 007 · Llegadas tardías

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada el 2026-10-27 · Creado: 2026-10-27 · Aprobado: 2026-10-27

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No se añade ninguna dependencia. Flask y pytest siguen siendo las únicas. No se añade ninguna columna a la base: el estado se calcula con `opened_at` y `checked_at`, que ya se guardan.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `asistencia/domain/arrival.py` | Regla pura: con la hora de apertura y la hora del registro, devuelve «A tiempo» o «Llegada tardía» | CA-01, CA-02, CA-13 |
| `asistencia/actions/attendance.py` | Al registrar, al preparar la vista del profesor y al preparar la descarga, añade ese texto. No lo guarda | CA-01 a CA-07, CA-09 a CA-13 |
| `asistencia/infra/export.py` | El CSV escribe la columna `Estado` con el texto que ya trae cada fila. No pinta celdas | CA-06, CA-07 |
| `app.py` | El alta, la vista del profesor y la respuesta de «ya estabas registrado» incluyen el texto. Un alta fallida no lo incluye. La descarga sigue exigiendo el token del profesor | CA-03, CA-04, CA-08 a CA-12 |
| `static/profesor.js` | En cada fila, el nombre va en verde o en rojo y al lado se lee el texto | CA-03, CA-04, CA-05, CA-14 |
| `static/alumno.js` | La confirmación muestra el nombre en color y el texto. Al volver a abrir el enlace, reutiliza el texto guardado con ese primer registro. Un error no muestra estado | CA-09, CA-10, CA-11, CA-12, CA-14 |
| `static/styles.css` | El verde y el rojo del nombre usan los colores de texto que ya existen, en claro y en oscuro. El texto del estado se puede partir de línea | CA-14, CA-15 |
| `docs/ARCHITECTURE.md` | El árbol nombra `domain/arrival.py` | — |
| `README.md` | Explica el margen de 5 minutos, los dos textos, el color del nombre y la columna `Estado` | CA-01, CA-03, CA-06, CA-09 |
| `tests/test_arrival.py` | La regla de los 5 minutos, sin base y sin navegador | CA-01, CA-02 |
| `tests/test_export.py` | La cabecera pasa a `Nombre;Hora;Estado` y cada fila lleva el texto | CA-06, CA-07 |
| `tests/test_api.py` | Alta, lista, sesión anterior, archivo, enlace de alumno, primer registro y registro nuevo tras quitar | CA-01 a CA-13 |

No se tocan `codes.py`, `access.py`, el esquema de la base, las specs `001` a `006` ni `requirements.txt`. `tasks.md` se escribe en la fase siguiente, no aquí.

---

## 2. Decisiones

### 2.1 La regla del margen (CA-01, CA-02)

`domain/arrival.py` no abre la base y no conoce el navegador. Recibe dos horas en ISO y devuelve el texto.

El margen es de 5 minutos. Si la hora del registro es anterior a la de apertura, o han pasado 5 minutos justos, el texto es «A tiempo». Si ha pasado más de 5 minutos, el texto es «Llegada tardía». Un segundo después de los 5 minutos ya es tardía.

La misma función sirve para la lista en vivo, una sesión anterior, el archivo y la confirmación del alumno. No hay una segunda regla.

### 2.2 No se guarda el estado (CA-05, CA-13)

`checkins` sigue con `id`, `session_id`, `name`, `name_key` y `checked_at`. `sessions` sigue con `opened_at`. No hay columna de estado ni de motivo.

`register` calcula el texto con la `opened_at` de esa clase y la `checked_at` que devuelve la base. Si el nombre ya estaba, la base no crea otra fila: el texto sale de la hora del primer registro.

`teacher_view` calcula el texto de cada fila al prepararla. Una sesión cerrada usa el mismo cálculo: las dos horas siguen guardadas.

`remove_checkin` borra la fila, como ahora. Un alta posterior guarda una `checked_at` nueva y el texto sale de esa hora.

La IP no entra en la lista ni en el archivo. El motivo no se pide ni se escribe.

### 2.3 Lo que ve cada pantalla (CA-03, CA-04, CA-09, CA-10, CA-11, CA-12, CA-14)

El JSON del profesor añade `arrival` a cada registro, junto a `id`, `name` y `checkedAt`. `profesor.js` pinta el nombre con `textContent` y una clase: verde si el texto es «A tiempo», rojo si es «Llegada tardía». El texto va en otro elemento, con el color normal del texto, para que no dependa del color del nombre.

El alta que se acepta responde `201` con `name`, `checkedAt` y `arrival`. Si ya estaba registrado, responde `200` con `already: true` y el `arrival` del primer registro. `alumno.js` construye la confirmación con el nombre en el color que toca y el texto al lado. Guarda en el navegador, para esa clase, el nombre, la hora y el texto. Al volver a abrir el enlace, muestra esos tres datos y no llama otra vez al alta.

Una respuesta de error no trae `arrival`. La página no muestra estado de llegada.

El verde es el texto de acierto que ya usa la app (`--ok-text`). El rojo es el de peligro (`--danger`). Sirven en claro y en oscuro y mantienen contraste. No se inventan un verde puro ni un rojo puro.

### 2.4 El archivo (CA-06, CA-07, CA-08)

`export_csv` añade el texto a cada fila y `to_csv` escribe tres columnas: `Nombre`, `Hora` y `Estado`. El separador sigue siendo `;`. El orden sigue siendo la hora de registro. El archivo es texto: no hay color de celda.

La descarga sigue en `/api/sessions/<id>/export`, que ya exige el token del profesor. El enlace del alumno no gana ninguna descarga.

Los tests de `to_csv` que esperan la cabecera `Nombre;Hora` pasan a esperar `Nombre;Hora;Estado`.

### 2.5 El móvil (CA-15)

La fila del profesor y la confirmación del alumno dejan que el texto del estado baje de línea. No se fija un ancho que obligue a desplazarse en horizontal.

Esto se comprueba a mano, con la ventana a unos 400 px: en la lista del profesor y en la confirmación del alumno se lee «A tiempo» o «Llegada tardía» sin zoom y sin desplazamiento horizontal. El nombre se ve verde o rojo y el texto también está.

---

## 3. Verificación

| Criterio | Qué se comprueba | Resultado |
| --- | --- | --- |
| CA-01 | Un registro a los 5 minutos justos, y otro antes | El texto es «A tiempo» |
| CA-02 | Un registro un segundo después de los 5 minutos | El texto es «Llegada tardía» |
| CA-03 | La vista del profesor con la clase abierta | Cada fila trae el nombre, la hora, el texto y la clase de color |
| CA-04 | La misma vista con la clase cerrada | El texto y el color salen de las horas guardadas |
| CA-05 | La lista y el archivo | Hay nombre, hora y estado. No hay IP ni motivo |
| CA-06 | La descarga de una clase abierta y de una cerrada | Cabecera `Nombre;Hora;Estado`, ordenado por hora |
| CA-07 | El cuerpo del archivo | El estado es el texto. No hay color de celda |
| CA-08 | Descargar sin el token del profesor | Sigue en `401`. El alumno no tiene esa acción |
| CA-09 | Un alta `201` | La confirmación puede mostrar nombre, hora, texto y color. No trae la lista de los demás |
| CA-10 | Volver a abrir el enlace en ese navegador | Se ven la hora y el texto guardados del primer registro. No hay un segundo alta |
| CA-11 | El mismo nombre cuando el registro ya existe | `already: true` con la hora y el texto del primer registro |
| CA-12 | Código no válido, nombre no válido o clase cerrada | La respuesta de error no trae estado de llegada |
| CA-13 | Quitar un registro y aceptar otro con una hora distinta | El texto es el de la hora nueva |
| CA-14 | La lista y la confirmación | El texto está en la página. El color solo acompaña al nombre |
| CA-15 | Ventana de unos 400 px | Comprobación manual del apartado 2.5 |

---

## 4. Comprobación de la constitución (v3.0)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | El estado sale de las horas de la asistencia. No se ata a Discord ni a Meet |
| P2 Simplicidad | Sí | Una función pura y el mismo texto en la lista, la confirmación y el archivo. No hay una segunda forma de guardar |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. Siguen Flask y pytest |
| P4 Privacidad | Sí | Del alumno siguen guardados el nombre y la hora. El estado no se guarda. No se guarda un motivo. La IP no entra en la lista ni en el archivo |
| P5 Accesible y móvil | Sí | El estado es texto. El color del nombre usa los colores de texto ya existentes. El apartado 2.5 comprueba los 400 px |
| P6 Español | Sí | Los textos visibles, el README, la spec y este plan están en español. Los nombres del código siguen en inglés |
| Apartado 5, calidad | Sí | CA-01 a CA-14 tienen un test en la tabla de arriba. CA-15 es la comprobación manual del apartado 2.5. Quien no se registra sigue viendo el aviso que ya existía |
| Apartado 6, seguridad | Sí | El código no cambia. El límite por IP no cambia. Un mismo nombre sigue sin duplicarse. Una clase cerrada sigue sin aceptar registros. El archivo sigue exigiendo el token del profesor |
