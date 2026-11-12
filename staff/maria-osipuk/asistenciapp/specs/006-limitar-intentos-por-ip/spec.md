# Spec 006 · Limitar los intentos de registro por dirección

> Estado: **Implementada** (v1.1, 2026-10-26) · Creada: 2026-10-26 · Issue: #400 · Pull request: #401

---

## 1. Problema

Cualquiera que tenga el enlace de la clase puede probar nombres y códigos tantas veces como quiera. La aplicación no distingue un registro normal de una ráfaga de intentos desde el mismo sitio.

Hace falta un tope por dirección de red, solo en el intento de registrarse. Si esa dirección se pasa, ese intento no queda en la lista y la dirección queda bloqueada. El bloqueo se conserva al cerrar y volver a abrir la aplicación. En esta versión no caduca y no hay forma de quitarlo.

La constitución, en P4, prohíbe guardar direcciones de red. Este control no cabe sin una enmienda: la dirección se usa solo para contar intentos y para la lista de bloqueo. No pasa a formar parte de la asistencia, donde siguen el nombre y la hora.

El código sigue siendo de cuatro cifras y sigue rotando. Quien no se pasa del tope registra la asistencia como hasta ahora.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Alumno** | Registrarse con normalidad si no se ha pasado del tope, y entender el mensaje si este intento no se guarda. |
| **Profesor** | Que una ráfaga de intentos no llene la lista, y que mirar la clase, abrir las pantallas o descargar la lista no cuente como intento. |
| **Quien trabaja en esta carpeta** | Saber qué dirección cuenta, qué se guarda y qué se tira. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero un máximo de 5 intentos de registro por segundo y 20 por minuto desde la misma dirección, para frenar una ráfaga sin impedir un registro normal.
- **HU-02**: Como profesor, quiero que cuenten los intentos válidos y los que no valen, para que probar códigos o nombres no quede fuera del tope.
- **HU-03**: Como alumno, quiero que el intento que se pasa del tope no me apunte en la lista, y ver un mensaje claro en español.
- **HU-04**: Como profesor, quiero que una dirección bloqueada siga sin poder registrarse después de reiniciar, y que esta versión no caduque ni desbloquee.
- **HU-05**: Como quien mantiene la aplicación, quiero conservar solo los intentos que hacen falta para las dos ventanas, y que la lista de bloqueo siga guardada.
- **HU-06**: Como profesor, quiero que mis consultas, las visitas a las páginas y el resto de peticiones que no son un registro no cuenten ni bloqueen.
- **HU-07**: Como alumno que entra desde otra dirección, quiero que el tope y el bloqueo de otra dirección no me afecten.
- **HU-08**: Como alumno, quiero que el código de cuatro cifras, su rotación y el registro normal sigan igual cuando no hay bloqueo.
- **HU-09**: Como quien mantiene la aplicación, quiero la dirección definida sin fiarme de lo que escriba el alumno ni de un texto añadido a la petición, y quiero por escrito los límites de lo que esa dirección significa.
- **HU-10**: Como quien mantiene la aplicación, quiero una enmienda aprobada que permita guardar la dirección solo para este control.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

Una ventana de un segundo cuenta los intentos de esa dirección desde hace un segundo hasta este intento, incluido. Una ventana de un minuto cuenta los de hace 60 segundos hasta este intento, incluido. No son el segundo ni el minuto del reloj de pared. El tope se mira antes de apuntar a nadie en la lista.

### Topes (HU-01, HU-02, HU-03)

- **CA-01**: **Dado** una dirección con 4 intentos de registro en el último segundo y menos de 20 en el último minuto, **cuando** llega un quinto intento que en lo demás sería válido, **entonces** ese intento sí puede registrarse y la dirección no queda bloqueada.
- **CA-02**: **Dado** una dirección con 5 intentos de registro en el último segundo, **cuando** llega otro intento de registro, **entonces** ese sexto intento no se apunta en la asistencia, la dirección queda bloqueada y quien lo envió ve un mensaje claro en español.
- **CA-03**: **Dado** una dirección con 19 intentos de registro en el último minuto y menos de 5 en el último segundo, **cuando** llega un intento que en lo demás sería válido, **entonces** ese intento sí puede registrarse y la dirección no queda bloqueada.
- **CA-04**: **Dado** una dirección con 20 intentos de registro en el último minuto, **cuando** llega otro intento de registro, **entonces** ese intento no se apunta en la asistencia, la dirección queda bloqueada y quien lo envió ve el mismo tipo de mensaje que en CA-02.
- **CA-05**: **Dado** un intento con el código bien, el nombre bien y la clase abierta, **cuando** ese intento es el que supera el tope del segundo o el del minuto, **entonces** tampoco se apunta en la asistencia.
- **CA-06**: **Dado** intentos de registro que la aplicación rechaza por el código, por el nombre, por la clase o por un duplicado, **cuando** todavía no hay bloqueo, **entonces** esos intentos cuentan igual para las dos ventanas. Un intento aceptado también cuenta.

### Bloqueo (HU-03, HU-04)

- **CA-07**: **Dado** una dirección ya bloqueada, **cuando** alguien intenta registrarse desde ella, **entonces** no se apunta la asistencia y ve un mensaje claro en español, del mismo tipo que al superar el tope.
- **CA-08**: **Dado** el mensaje de CA-02, CA-04 y CA-07, **cuando** se lee, **entonces** está en español, dice que este intento no ha quedado registrado y no promete que el bloqueo vaya a caducar.
- **CA-09**: **Dado** una dirección bloqueada y la aplicación cerrada y abierta de nuevo, **cuando** se intenta registrar desde esa dirección, **entonces** sigue bloqueada. Esta versión no ofrece caducidad ni desbloqueo, ni al cambiar de clase.
- **CA-10**: **Dado** una dirección bloqueada, **cuando** se mira la asistencia, **entonces** la dirección no aparece junto al nombre y la hora. El bloqueo no añade una fila de asistencia.

### Qué se conserva (HU-05)

- **CA-11**: **Dado** intentos de una dirección que ya quedan fuera del último minuto, **cuando** se vuelve a calcular el tope, **entonces** esos intentos ya no cuentan y no se conservan.
- **CA-12**: **Dado** los intentos que todavía caen en el último segundo o en el último minuto, **cuando** llega otro intento de una dirección que no está bloqueada, **entonces** esos intentos siguen disponibles para calcular las dos ventanas.
- **CA-13**: **Dado** una dirección ya bloqueada, **cuando** llegan más intentos de registro, **entonces** no se apuntan en la asistencia y no hace falta conservarlos para calcular las ventanas. El bloqueo guardado basta.

### Qué no cuenta (HU-06, HU-07, HU-08)

- **CA-14**: **Dado** una consulta del profesor, una visita a una página, un cierre, un borrado, una descarga u otra petición que no sea un intento de registro, **cuando** se repite, **entonces** no mueve el contador ni bloquea ninguna dirección.
- **CA-15**: **Dado** una dirección bloqueada o por encima del tope, **cuando** otra dirección intenta registrarse dentro de su propio tope, **entonces** esa otra dirección se registra con normalidad.
- **CA-16**: **Dado** una dirección dentro del tope y sin bloquear, **cuando** un alumno se registra con el código vigente, **entonces** el código sigue teniendo cuatro cifras, sigue rotando como hasta ahora y la asistencia queda guardada con el nombre y la hora, igual que antes de este control.

### Qué dirección es (HU-09)

- **CA-17**: **Dado** un intento de registro que trae una dirección escrita por el alumno, o un texto distinto de la dirección del visitante que envía Cloudflare, **cuando** se cuenta el intento, **entonces** esa dirección escrita y ese otro texto no deciden el contador ni el bloqueo. Entra aquí el texto que el alumno puede anteponer para fingir otra dirección.
- **CA-18**: **Dado** un intento que llega desde este mismo ordenador y no trae la dirección del visitante que envía Cloudflare, **cuando** se cuenta, **entonces** la dirección usada es la de esa conexión local. Quien se registra en este mismo ordenador sin esa dirección comparte el contador y el bloqueo.
- **CA-19**: **Dado** la documentación de este control, **cuando** se lee, **entonces** dice que varios alumnos pueden compartir una dirección pública y que el bloqueo afecta a ese grupo, no a toda la clase por usar el túnel. Dice que un programa en este ordenador puede presentar otra dirección de visitante. No dice que una dirección identifique para siempre a una persona ni que la aplicación pueda comprobar por sí sola si es fija.

### Enmienda (HU-10)

- **CA-20**: **Dado** esta spec aprobada, **cuando** se lee la constitución, **entonces** incluye la enmienda de la sección 8, aprobada por quien trabaja en esta carpeta. La dirección de red solo puede guardarse para contar estos intentos y para la lista de bloqueo. Sigue prohibido guardarla en la asistencia y usarla para cualquier otra cosa.
- **CA-21**: **Dado** el túnel de Cloudflare, **cuando** un intento llega por la conexión local de este ordenador y trae una sola dirección de visitante enviada por Cloudflare, **entonces** esa dirección es la que cuenta. Dos visitantes con distinta dirección no comparten contador ni bloqueo. Si esa dirección falta o no es una sola dirección, cuenta la conexión local. Una conexión que no sea la de este ordenador no usa esa dirección de visitante.

---

## 5. Fuera de alcance

- Caducidad del bloqueo, desbloqueo manual o desbloqueo al cerrar la clase.
- Corregir los tres fallos de validación ya escritos en la spec 005. Siguen pendientes de su propia spec.
- Añadir una dependencia nueva.
- Cambiar el código de cuatro cifras, su rotación, las pantallas o el registro de quien está dentro del tope.
- Guardar la dirección junto al nombre y la hora.
- Contar consultas del profesor, visitas a páginas u otras peticiones que no sean un intento de registro.
- Decir que una dirección identifica para siempre a una persona, o comprobar si es fija.
- Tocar archivos fuera de `staff/maria-osipuk/asistenciapp/`.
- El reparto interno va en el plan: reglas del tope, recuerdo de intentos y bloqueos, coordinación antes de registrar, y la entrada que obtiene la dirección y traduce el rechazo. No se añade otra parte ni otra dependencia. El plan también fija el rechazo distinguible como respuesta de demasiados intentos.

---

## 6. Preguntas abiertas

Ninguna. El 2026-10-26 quien trabaja en esta carpeta eligió la opción 1: con el túnel, la dirección es la del visitante que envía Cloudflare, y solo se acepta si la conexión es la de este ordenador. En local, sin esa dirección, sigue valiendo la conexión local.

---

## 7. Enmienda propuesta

La versión pasa de 2.2 a 3.0 porque contradice la prohibición de guardar direcciones de red en P4. Quien trabaja en esta carpeta la aprobó el 2026-10-26, junto con esta spec. El plan la aplica; hasta esa tarea la constitución sigue en 2.2.

Texto que se añade a P4:

> Excepción de la spec 006: la dirección de red puede guardarse solo para contar los intentos de registro y para la lista de bloqueo de este control. No forma parte del registro de asistencia. No se guarda para ningún otro fin.

Motivo para el historial: la issue #400 pide este tope y una lista de bloqueo que sobreviva al reinicio. P4 lo prohibía. La enmienda 1.1 decía que no hacía falta protegerse de scripts; no lo prohíbe. Este tope es un requisito nuevo de esa issue, no una protección general.

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Issue #400. A la espera del ok antes del plan. Falta la decisión del túnel |
| 1.0 | 2026-10-26 | Aprobada tal cual. El túnel usa la conexión local y el bloqueo es de toda la clase | Ok de quien trabaja en esta carpeta. CA-21 |
| 1.1 | 2026-10-26 | Con el túnel cuenta la dirección del visitante que envía Cloudflare, solo si la conexión es la de este ordenador | Quien trabaja en esta carpeta eligió la opción 1 para no bloquear a toda la clase. CA-17, CA-18, CA-19 y CA-21 |
| 1.2 | 2026-10-26 | Implementada | T01–T05. Falta la prueba de quien trabaja en esta carpeta |
