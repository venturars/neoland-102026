# Spec 007 · Informe al descargar la lista de asistencia

> Estado: **Aprobada** (2026-10-28) · Creada: 2026-10-28 · Issue: [#324](https://github.com/venturars/neoland-102026/issues/324)

---

## 1. Problema

Hoy, cuando el profesor pulsa **Descargar lista**, obtiene un volcado mínimo (dos columnas) con un **nombre de archivo poco legible** (incluye un identificador técnico de la sesión). En algunos programas de hoja de cálculo —sobre todo en Mac— el archivo se ve como una **tabla pequeña flotante**, no como un informe listo para archivar.

El profesor **ya escribe un título de clase** al abrir la asistencia (o la app genera uno por defecto), pero ese título **no aparece** de forma clara en la descarga. Quiere un documento **fácil de entender y de guardar** en Mac y Windows (Excel, Google Sheets o equivalente), con **contexto de la clase**, **total de asistentes** y **fecha y hora de cada registro** en columnas separadas.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Descargar un informe con título claro, total de asistentes y tabla ordenada; archivarlo sin retoques manuales ni adivinar qué sesión era. |
| **Quien trabaja en esta carpeta** | Cumplir la issue #324 y sustituir la exportación mínima actual por un informe alineado con el título de sesión ya guardado, sin romper el resto del flujo de asistencia. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que la descarga lleve un **encabezado legible** con el patrón **`Asistencia {título de la clase} - AAAA-MM-DD`**, para reconocer la clase de un vistazo.
- **HU-02**: Como profesor, quiero que el **nombre sugerido al guardar** el archivo siga la **misma información** (sin identificador técnico de sesión), para encontrarlo en mis carpetas.
- **HU-03**: Como profesor, quiero ver el **total de asistentes** en el informe y que coincida con lo que veo en el panel (incluido quitar un registro).
- **HU-04**: Como profesor, quiero **fecha y hora de registro** en **columnas separadas** y filas **ordenadas por momento de registro** (como hoy), para filtrar y ordenar en la hoja de cálculo.
- **HU-05**: Como profesor, quiero que el archivo **funcione bien en Mac y en Windows** al abrirlo con herramientas habituales (Excel, Google Sheets o equivalente).
- **HU-06**: Como quien trabaja en esta carpeta, quiero que sesiones **anteriores** sigan pudiendo descargarse con el **mismo criterio** de informe (como la lista del panel en la spec `001-checkin-codigo`, CA-16).

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Encabezado y nombre del archivo (HU-01, HU-02)

- **CA-01**: **Dado** una sesión cuyo título es «Clase 20/10 – SDD» y se **abrió** el día **2026-10-24**, **cuando** el profesor pulsa **Descargar lista**, **entonces** el informe muestra como título visible **`Asistencia Clase 20/10 – SDD - 2026-10-24`** (misma fecha en formato `AAAA-MM-DD`, correspondiente al **día de apertura** de la sesión, no al identificador técnico de la sesión).
- **CA-02**: **Dado** el mismo caso que CA-01, **entonces** el nombre sugerido al guardar refleja la **misma frase** (`Asistencia … - 2026-10-24`) y **no** incluye el identificador técnico de la sesión (p. ej. cadenas opacas de enlace).
- **CA-03**: **Dado** un título de clase con caracteres que en algunos sistemas no son válidos en nombres de archivo (p. ej. `/`, `:`, `\`), **cuando** se descarga, **entonces** el contenido del informe conserva el título **tal como está guardado** y el nombre sugerido al guardar es una variante **segura** que un compañero puede reconocer como la misma clase y la misma fecha.
- **CA-15**: **Dado** varias sesiones abiertas el **mismo día**, **cuando** el profesor descarga cada una, **entonces** el encabezado y el nombre al guardar siguen **siempre** el patrón **`Asistencia {título de esa sesión} - AAAA-MM-DD`**, **sin** añadir hora de apertura ni identificadores técnicos; si hace falta distinguir dos clases el mismo día, el profesor lo resuelve con **títulos distintos** al abrir la asistencia.

### Título por defecto (HU-01)

- **CA-04**: **Dado** una sesión abierta **sin** título escrito por el profesor, **cuando** se descarga, **entonces** el encabezado usa el **título por defecto** que la app ya asigna al abrir la sesión, con el mismo patrón **`Asistencia {título} - AAAA-MM-DD`**.

### Total y tabla (HU-03, HU-04)

- **CA-05**: **Dado** una sesión con varios registros, **cuando** se descarga, **entonces** el informe incluye el **número total de asistentes** y coincide con el total del panel en ese momento.
- **CA-06**: **Dado** una sesión con registros, **entonces** cada fila incluye al menos **nombre**, **fecha de registro** y **hora de registro** en columnas distintas; el orden de filas es por **momento de registro** (igual criterio que la lista actual ordenada por hora).
- **CA-07**: **Dado** que el profesor **quita** un registro del panel, **cuando** vuelve a descargar, **entonces** ese nombre **no** aparece y el total se actualiza.

### Sesión vacía y acceso (HU-05, HU-06)

- **CA-08**: **Dado** una sesión **sin** registros, **cuando** el profesor descarga, **entonces** obtiene un informe con título, fecha de la sesión y total **0**, **sin** error ni archivo inutilizable.
- **CA-09**: **Dado** una sesión **cerrada** o **abierta**, **cuando** el profesor descarga desde el panel privado, **entonces** puede obtener el informe (misma regla que CA-14 de la spec `001-checkin-codigo`).
- **CA-10**: **Dado** alguien **sin** el enlace secreto del profesor, **entonces** **no** puede descargar listas (se mantiene CA-15 de la spec `001-checkin-codigo`).

### Seguridad de nombres en la hoja (HU-05)

- **CA-11**: **Dado** un alumno cuyo nombre podría interpretarse como instrucción de la hoja de cálculo (p. ej. empieza por `=`, `+`, `-` o `@`), **cuando** se abre el informe, **entonces** no se ejecuta comportamiento extraño por culpa del nombre (misma intención que la exportación actual).

### Formato del documento (HU-05)

- **CA-12**: **Dado** una sesión con registros, **cuando** el profesor abre la descarga en Excel, Google Sheets o un equivalente habitual en Mac o Windows, **entonces** ve un **informe estructurado** (título, total y tabla con cabeceras), no solo un bloque crudo difícil de leer como único contenido.
- **CA-13**: **Dado** el criterio CA-14 de la spec `001-checkin-codigo` (columnas de nombre y hora en hoja de cálculo), **cuando** se cierra esta spec, **entonces** el profesor sigue pudiendo usar la descarga en Excel o Google Sheets, con **información al menos tan completa** como antes y **más contexto** (título, total, fecha y hora separadas).

### Comportamiento previo preservado

- **CA-14**: **Dado** los criterios de las specs `001-checkin-codigo` y `006-limite-intentos-ip` que no entren en conflicto con esta spec, **cuando** se cierra la implementación, **entonces** la suite de pruebas automatizadas pasa y el flujo de check-in, cierre, listado en vivo y sesiones anteriores se mantiene.

---

## 5. Fuera de alcance

- Exportar **varias sesiones** en un solo archivo o informes consolidados del curso.
- **Reimportar** cambios hechos en la hoja de cálculo hacia la app.
- Gráficos, logos, plantillas corporativas o cambios estéticos del panel del profesor (salvo textos del botón o ayuda mínima si hace falta explicar el nuevo formato).
- Exportar intentos fallidos, direcciones bloqueadas u otros datos de anti-abuso (spec `006-limite-intentos-ip`).
- Cambios fuera de `staff/sergio-cortes/asistenciapp/`.

---

## 6. Preguntas abiertas

Ninguna. Dos sesiones el mismo día se distinguen con el **título escrito a mano** al abrir; el patrón del informe y del nombre de archivo no añade sufijos (CA-15).

---

## 7. Historial de cambios

| Fecha | Cambio |
| --- | --- |
| 2026-10-28 | Borrador inicial para issue #324. |
| 2026-10-28 | Aprobada por quien trabaja en esta carpeta; decisión CA-15 (título manual distingue sesiones). |
