# Spec 007 · Llegadas tardías

> Estado: **Aprobada** · Creada: 2026-10-27 · Aprobada: 2026-10-27

---

## 1. Problema

El profesor ve quién se ha registrado y a qué hora, y no puede distinguir de un vistazo quién lo hizo dentro del margen y quién llegó después.

El margen es de 5 minutos desde que el profesor pulsa **Abrir asistencia**. Ese gesto empieza a contar el tiempo de control de asistencia. Un registro en ese margen, incluido el instante en que se cumplen los 5 minutos, es **A tiempo**. Un registro posterior es **Llegada tardía**.

El alumno, en la página donde se registra, tampoco ve cómo ha quedado contado su propio registro. El archivo descargado lo sigue viendo solo el profesor.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Distinguir en su lista, y en el archivo que descarga, quién se registró a tiempo y quién llegó tarde. |
| **Alumno** | Ver, en la página de registro, cómo ha quedado su propio registro, sin ver el de los demás y sin abrir ningún archivo. |

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero ver en la lista de la sesión si cada registro es «A tiempo» o «Llegada tardía», para distinguir las dos situaciones mientras pasa lista.
- **HU-02**: Como profesor, quiero ver ese mismo estado al consultar una sesión anterior, para recuperarlo cuando la asistencia ya no está abierta.
- **HU-03**: Como profesor, quiero que el archivo descargado incluya ese estado escrito, para conservarlo junto al nombre y la hora.
- **HU-04**: Como alumno, quiero ver mi propio estado en la página de registro, con texto y con color, para saber cómo ha quedado mi registro.
- **HU-05**: Como alumno, quiero que al volver a abrir el enlace se conserven la hora y el estado de mi primer registro, para que una segunda visita no los cambie.
- **HU-06**: Como profesor, quiero que, si quito un registro y esa persona vuelve a registrarse, el estado sea el del registro nuevo, porque el anterior ya no está.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

Los textos visibles son «A tiempo» y «Llegada tardía». **A tiempo** se muestra con el nombre en verde. **Llegada tardía** se muestra con el nombre en rojo. El texto se lee siempre: el color no es la única señal.

El margen se cuenta desde que el profesor abre la asistencia: ese momento empieza el tiempo de control de asistencia. A los 5 minutos justos el registro sigue siendo «A tiempo». Un segundo después es «Llegada tardía». El estado sale de esa hora de apertura y de la hora del registro. No se guarda un motivo ni se pide uno.

### El margen (HU-01)

- **CA-01**: **Dado** una asistencia abierta, **cuando** un alumno se registra antes de cumplirse los 5 minutos o en el instante en que se cumplen, **entonces** su estado es «A tiempo».
- **CA-02**: **Dado** una asistencia abierta, **cuando** un alumno se registra después de esos 5 minutos, **entonces** su estado es «Llegada tardía».

### La lista del profesor (HU-01, HU-02)

- **CA-03**: **Dado** el profesor viendo la lista en vivo, **cuando** mira un registro, **entonces** ve el nombre, la hora, el texto «A tiempo» o «Llegada tardía», y el nombre en verde o en rojo según ese texto.
- **CA-04**: **Dado** el profesor consultando una sesión anterior, **cuando** mira un registro, **entonces** ve el mismo texto y el mismo color que le correspondían por la hora de apertura y la hora de ese registro.
- **CA-05**: **Dado** la lista del profesor, en vivo o anterior, **cuando** se muestra, **entonces** siguen apareciendo el nombre y la hora, y no aparece la IP ni un motivo de retraso.

### El archivo del profesor (HU-03)

- **CA-06**: **Dado** una sesión abierta o cerrada, **cuando** el profesor descarga la lista, **entonces** el archivo incluye, por cada registro, el nombre, la hora y el texto «A tiempo» o «Llegada tardía», ordenado por hora de registro como hasta ahora.
- **CA-07**: **Dado** ese archivo, **cuando** el profesor lo abre, **entonces** el estado se lee por el texto. El archivo no lleva el nombre pintado de verde o de rojo.
- **CA-08**: **Dado** un alumno en la página de registro, **cuando** usa solo ese enlace, **entonces** no puede descargar el archivo. El archivo lo obtiene el profesor desde su panel.

### La página del alumno (HU-04, HU-05)

- **CA-09**: **Dado** un alumno que acaba de registrarse, **cuando** ve la confirmación en la página de registro, **entonces** ve su nombre en verde o en rojo, el texto «A tiempo» o «Llegada tardía», y la hora de ese registro. No ve cómo llegaron los demás.
- **CA-10**: **Dado** un alumno que ya se registró en esa clase, **cuando** vuelve a abrir el enlace, **entonces** ve la hora y el estado de su primer registro, y no se crea otro registro.
- **CA-11**: **Dado** un alumno que envía otra vez el mismo nombre y ese registro ya existe, **cuando** la página le indica que ya estaba registrado, **entonces** la hora y el estado son los del primer registro.
- **CA-12**: **Dado** un intento que no queda registrado, **cuando** el alumno ve la respuesta, **entonces** no aparece un estado de llegada.

### Si se quita un registro (HU-06)

- **CA-13**: **Dado** un registro que el profesor ha quitado, **cuando** esa persona vuelve a registrarse y el registro se acepta, **entonces** el estado es el que corresponde a la hora del registro nuevo.

### Texto, color y móvil (HU-01, HU-04)

- **CA-14**: **Dado** la lista del profesor o la confirmación del alumno, **cuando** se muestra un estado, **entonces** el texto «A tiempo» o «Llegada tardía» está visible. El verde o el rojo acompañan al texto y no lo sustituyen.
- **CA-15**: **Dado** un móvil de unos 400 px de ancho, **cuando** el profesor mira su lista o el alumno mira su confirmación, **entonces** el texto del estado se lee sin hacer zoom ni desplazamiento horizontal.

## 5. Fuera de alcance

- Guardar o pedir un motivo del retraso, o afirmar por qué llegó tarde.
- Guardar el estado como un dato permanente distinto de la hora de apertura y la hora del registro.
- Pintar de verde o de rojo el nombre dentro del archivo descargado.
- Mostrar al alumno la llegada de los demás.
- Dejar que el alumno descargue el archivo.
- Cambiar el margen de 5 minutos, el código de la clase o el control de acceso por IP.
- Lista de ausentes, duración de la estancia o un inicio de clase distinto del de abrir la asistencia.
- El plan y las tareas. Son las fases siguientes.

## 6. Preguntas abiertas

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | ¿Desde cuándo se cuenta el margen de 5 minutos? | Abrir la asistencia empieza a contar el tiempo de control de asistencia. El margen se cuenta desde ese momento (CA-01, CA-02). |
