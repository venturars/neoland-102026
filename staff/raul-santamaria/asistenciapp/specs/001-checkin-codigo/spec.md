# Spec 001 · Check-in con código

> Estado: **Aprobada** (v1.2 reescrita) · Reescrita: 2026-10-22 · Aprobada: 2026-10-22 · Origen del alcance: v1.2 (2026-10-20)

---

## 1. Problema

Pasar lista en una clase online a mano —llamar nombres, mirar el chat o capturar la lista de participantes— **consume varios minutos** al profesor cada sesión. Además, el rastro queda repartido y no hay una prueba clara de quién estuvo.

Hace falta que el profesor pase lista **en menos de un minuto**, en Discord, Meet u otra plataforma, y se quede con una **lista guardada que pueda exportar**.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Abrir la asistencia, compartir un código, ver quién entra y conservar la lista final. |
| **Alumno** | Apuntarse como presente lo más rápido posible (objetivo: menos de 30 s). |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero **abrir una sesión de asistencia** con un título (p. ej. "Clase 19/10 – SDD") para empezar a pasar lista.
- **HU-02**: Como profesor, quiero **ver un código grande y un enlace** para compartirlos en la llamada y que los alumnos se registren.
- **HU-03**: Como alumno, quiero **escribir mi nombre y el código** para quedar como presente.
- **HU-04**: Como profesor, quiero **ver en vivo quién se ha registrado**, para saber cuándo seguir con la clase.
- **HU-05**: Como profesor, quiero **cerrar la sesión** para que nadie más se registre.
- **HU-06**: Como profesor, quiero **descargar la lista** para guardarla o pegarla en una hoja de cálculo.
- **HU-07**: Como profesor, quiero **consultar sesiones anteriores** y recuperar su lista.
- **HU-08**: Como profesor, quiero que mis alumnos **abran el enlace desde casa**, con cualquier conexión, en clases online.
- **HU-09**: Como profesor, quiero que **cada navegador solo registre a una persona** por clase, para dificultar apuntar a quien no está.
- **HU-10**: Como profesor, quiero **quitar a alguien de la lista** si el registro es falso o erróneo, para dejar la lista correcta.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Abrir sesión (HU-01, HU-02)

- **CA-01**: **Dado** el profesor en su **panel privado**, **cuando** escribe un título y pulsa "Abrir asistencia", **entonces** la sesión queda abierta y ve un código de **4 dígitos** y el enlace para alumnos.
- **CA-02**: **Dado** que el profesor no escribe título, **cuando** abre la sesión, **entonces** el título por defecto es la fecha y hora actuales.
- **CA-03**: **Dado** una sesión abierta, **cuando** pasan **30 segundos**, **entonces** el código en pantalla cambia solo, sin recargar la página.

### Registrarse (HU-03)

- **CA-04**: **Dado** un alumno en la página de registro, **cuando** escribe su nombre y el código vigente, **entonces** ve una confirmación con su nombre y la hora del registro.
- **CA-05**: **Dado** un código que acaba de cambiar, **cuando** el alumno envía el código **inmediatamente anterior**, **entonces** el registro se acepta. Un código más viejo se rechaza (CA-06).
- **CA-06**: **Dado** un código incorrecto o caducado, **cuando** el alumno lo envía, **entonces** ve "El código no es válido o ha caducado. Pide el código actual al profesor." y **no** queda registrado.
- **CA-07**: **Dado** un alumno ya registrado en esa sesión, **cuando** vuelve a registrarse con el mismo nombre (sin distinguir mayúsculas, tildes ni espacios de más), **entonces** ve "Ya estabas registrado a las HH:MM" y **no** se duplica en la lista.
- **CA-08**: **Dado** un nombre vacío o de más de 60 caracteres, **cuando** el alumno lo envía, **entonces** ve un error que explica el problema y no queda registrado.
- **CA-09**: **Dado** una sesión cerrada, **cuando** un alumno intenta registrarse, **entonces** ve "La asistencia de esta clase ya está cerrada." y no queda registrado.

### Ver la lista en vivo (HU-04)

- **CA-10**: **Dado** el profesor viendo su sesión, **cuando** un alumno se registra, **entonces** ese alumno aparece en la lista en **5 segundos como máximo**, sin recargar, con nombre y hora.
- **CA-11**: **Dado** el profesor viendo su sesión, **entonces** ve siempre el **total** de alumnos registrados.
- **CA-12**: **Dado** un alumno que escribe un nombre con HTML o caracteres especiales (p. ej. `<b>Ana</b>`), **cuando** aparece en la lista, **entonces** se muestra como texto literal, sin interpretarse.

### Cerrar y exportar (HU-05, HU-06)

- **CA-13**: **Dado** una sesión abierta, **cuando** el profesor pulsa "Cerrar asistencia" y lo confirma, **entonces** la sesión queda cerrada, el código deja de mostrarse y no se aceptan más registros.
- **CA-14**: **Dado** una sesión (abierta o cerrada), **cuando** el profesor pulsa "Descargar lista", **entonces** obtiene un archivo usable en Excel o Google Sheets con columnas *Nombre* y *Hora*, ordenado por hora de registro.

### Acceso del profesor

- **CA-15**: **Dado** alguien que solo tiene el enlace de alumno, **entonces** **no** puede abrir sesiones, ver listas, cerrar sesiones ni descargar nada. Eso solo ocurre en el **panel privado del profesor**, con un **enlace secreto** difícil de adivinar (sin contraseña).

### Sesiones anteriores (HU-07)

- **CA-16**: **Dado** el profesor en su panel privado, **cuando** consulta las sesiones anteriores, **entonces** ve título, fecha y nº de asistentes de cada una, y puede descargar la lista de cualquiera (como en CA-14).
- **CA-17**: **Dado** alguien sin el enlace secreto del profesor, **entonces** no puede ver la lista de sesiones anteriores.

### Acceso desde casa (HU-08)

- **CA-19**: **Dado** que el profesor arranca la app en modo "clase online", **cuando** comparte el enlace de alumnos, **entonces** un alumno en otra red (p. ej. datos móviles) puede abrirlo y registrarse.
- **CA-20**: **Dado** que el profesor arranca la app en modo "clase online", **entonces** obtiene el enlace de su panel privado listo para usar, **sin tener que editarlo a mano**.
- **CA-21**: **Dado** que el profesor abre su panel desde una dirección que solo funciona en su ordenador, **entonces** el panel avisa de que los alumnos no podrán abrir el enlace de alumnos y explica cómo arrancar en modo "clase online".

### Un registro por navegador (HU-09)

- **CA-22**: **Dado** un alumno que ya se registró en una clase desde un navegador, **cuando** vuelve a abrir el enlace de esa clase en el mismo navegador, **entonces** ve "Ya te registraste en esta clase como *Nombre* a las HH:MM." y **no** ve el formulario, así que no puede registrar otro nombre.
- **CA-23**: **Dado** un alumno registrado en una clase, **cuando** abre en el mismo navegador el enlace de **otra** clase, **entonces** puede registrarse con normalidad (el límite es por clase).

### Quitar registros (HU-10)

- **CA-24**: **Dado** el profesor viendo una sesión (abierta o cerrada), **cuando** pulsa "Quitar" junto a un alumno, **entonces** se pide confirmación en la página; si confirma, el alumno sale de la lista, del total y de la descarga; si cancela, no cambia nada.
- **CA-25**: **Dado** alguien sin el enlace secreto del profesor, **entonces** no puede quitar registros.
- **CA-26**: **Dado** un registro quitado, **cuando** esa persona se registra de nuevo con un código vigente, **entonces** se acepta (salvo que CA-22 lo impida en ese navegador).

### Generales

- **CA-18**: **Dado** un móvil de ~400 px de ancho, **cuando** se usa cualquier pantalla, **entonces** todo es legible y usable sin zoom ni desplazamiento horizontal.

---

## 5. Requisitos no funcionales

- Un alumno se registra en **menos de 30 s** desde que ve el código (constitución P2).
- Del alumno solo se guarda **nombre y hora** (constitución P4).
- Debe aguantar una clase de **hasta 50 alumnos** registrándose casi a la vez.
- La app solo está disponible **mientras el ordenador del profesor está encendido** y la app arrancada. El enlace público **puede cambiar** cada vez que se arranca.

---

## 6. Fuera de alcance (en esta spec)

- Integraciones automáticas con Discord o Google Meet (→ futura spec).
- Alojamiento permanente en internet (la app vive en el ordenador del profesor).
- Un enlace público fijo que no cambie entre clases.
- Impedir **del todo** que alguien registre a otra persona: el límite por navegador (HU-09) disuade, pero se salta con otro navegador, ventana privada u otro dispositivo. La prueba fuerte de identidad queda para una spec futura (p. ej. Discord).
- Cuentas de usuario, contraseñas de alumnos o inicio de sesión con Google.
- Registrar **salidas** o la **duración** de la estancia en clase.
- Lista previa de alumnos para detectar ausentes (P4).
- Varios profesores o varias clases con permisos distintos.
- Que el profesor **añada** o **edite** registros a mano. Quitarlos sí está en alcance (HU-10).

---

## 7. Preguntas abiertas

Decisiones de producto ya tomadas (alcance v1.2). Quedan sujetas a la aprobación de la persona que trabaja en esta carpeta.

| # | Pregunta | Propuesta | Decisión |
| --- | --- | --- | --- |
| P1 | ¿Cada cuánto cambia el código y cuánto margen de cortesía hay? | Cambia cada **30 s**; también se acepta el **código anterior** (≈ 30–60 s de margen en total). | Propuesta a aceptar |
| P2 | ¿Qué formato tiene el código? | **4 dígitos** (rápido en móvil; la rotación dificulta adivinarlo). | Propuesta a aceptar |
| P3 | ¿Cómo se protege la vista del profesor? | **Enlace secreto**: un **panel privado** con URL difícil de adivinar; desde ahí se abren sesiones y se ven las anteriores. Sin contraseñas. | Propuesta a aceptar |
| P4 | ¿Se carga una lista previa de alumnos para ver quién falta? | **No** en esta spec; queda para una futura. | Propuesta a aceptar |
| P5 | ¿El profesor puede ver sesiones anteriores? (HU-07) | **Sí, sencillo**: lista de sesiones pasadas (título, fecha, nº de asistentes) con descarga de cada una. | Propuesta a aceptar |
| P6 | ¿Puede el profesor añadir o quitar a alguien a mano? | **Quitar sí** (HU-10); **añadir o editar, no**. | Propuesta a aceptar |

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-19 | Versión inicial del alcance | Arranque del producto |
| 1.1 | 2026-10-20 | HU-08, CA-19 a CA-21, NFR y fuera de alcance ampliados | Faltaba cómo llegan a la app los alumnos desde casa |
| 1.2 | 2026-10-20 | HU-09 y HU-10, CA-22 a CA-26; P6 revisada | Un alumno podía registrar a compañeros ausentes con otros nombres |
| 1.2-reescrita | 2026-10-22 | Texto reescrito en esta carpeta; estado pendiente de aprobación | Adoptar el alcance v1.2 como spec propia, sin referencias a otra persona |
