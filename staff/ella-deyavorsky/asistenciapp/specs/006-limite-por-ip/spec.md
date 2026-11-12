# Spec 006 · Límite de intentos por IP al registrarse

> Estado: **Aprobada v1.2 (2026-10-26)** · Creada: 2026-10-26

---

## 1. Problema

Hoy, quien está fuera de la clase puede probar códigos de asistencia una y otra vez, desde su misma conexión y sin ningún freno, hasta acertar uno y quedar apuntado sin haber asistido. Un código de 4 cifras caduca, pero a esa velocidad se puede acertar antes de que caduque.

La issue #395 pide un control de acceso por IP: una IP no puede intentar registrarse más de 5 veces por segundo ni más de 20 veces por minuto. Quien se pasa recibe un aviso de ban y su IP queda en una lista negra para siempre. El control cuenta la IP de la conexión con la que llega la petición, un valor que el usuario no puede cambiar escribiendo otros datos. El código no se hace más difícil de resolver para los alumnos: el control frena al que insiste, no complica el registro de quien asiste.

Este cambio contradice dos reglas de la constitución 2.2 (P4 prohíbe guardar IPs; §6 dice que la protección contra programas automáticos no es requisito). Como contradice un principio, la constitución §8 pide subir a una versión mayor: por eso la spec incluye una enmienda 3.0, que solo aprueba la persona que trabaja en esta carpeta.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Alumno que asiste** | Registrarse a la primera, sin notar ningún control. |
| **Profesor** | Que nadie ausente se apunte probando códigos al azar. |
| **Persona ausente que insiste** | (Usuario no deseado.) No debe poder probar códigos sin freno. |
| **Persona que trabaja en esta carpeta** | Un control sencillo, que guarde lo mínimo y separado de los nombres de los alumnos. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que una misma IP no pueda intentar registrarse más de 5 veces por segundo, para que no se pueda probar códigos a toda velocidad.
- **HU-02**: Como profesor, quiero que una misma IP no pueda intentar registrarse más de 20 veces por minuto, para que tampoco se pueda probar códigos despacio pero sin parar.
- **HU-03**: Como profesor, quiero que la IP que se pasa reciba un aviso de ban y quede en una lista negra para siempre, aunque la aplicación se reinicie, para que deje de poder registrarse.
- **HU-04**: Como profesor, quiero que el control cuente la IP de la conexión y no pueda cambiarse con datos que envíe el usuario, para que no se pueda esquivar.
- **HU-05**: Como alumno, quiero que el código siga siendo igual de fácil de leer y escribir, para registrarme en menos de 30 segundos (constitución P2).
- **HU-06**: Como persona que trabaja aquí, quiero que las IPs se guarden separadas de los nombres de los alumnos, para que nadie pueda unir una IP con una persona (constitución P4).
- **HU-07**: Como persona que trabaja aquí, quiero poder quitar una IP de la lista negra sin tocar el código, para arreglar un bloqueo por error.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

Un «intento de registro» es cada vez que se envía el nombre y el código para apuntarse a una clase. Ver la página de la clase o usar el panel del profesor no cuenta.

### Límite por segundo (HU-01)

- **CA-01**: **Dado** una IP que no ha intentado nada en el último segundo, **cuando** hace 5 intentos de registro en ese segundo, **entonces** los 5 se atienden con normalidad.
- **CA-02**: **Dado** una IP que ya ha hecho 5 intentos en el último segundo, **cuando** hace un sexto, **entonces** ese intento no se atiende y la IP recibe un aviso de ban.

### Límite por minuto (HU-02)

- **CA-03**: **Dado** una IP que hace sus intentos de forma espaciada (nunca más de 5 en un segundo), **cuando** hace 20 intentos en un minuto, **entonces** los 20 se atienden con normalidad.
- **CA-04**: **Dado** una IP que ya ha hecho 20 intentos en el último minuto, **cuando** hace uno más, **entonces** ese intento no se atiende y la IP recibe un aviso de ban.

### Aviso de ban y lista negra (HU-03, HU-07)

- **CA-05**: **Dado** una IP que se ha pasado de cualquiera de los dos límites, **cuando** recibe la respuesta, **entonces** el aviso de ban está en español, dice que la IP ha sido bloqueada y que debe avisar al profesor si es un error.
- **CA-06**: **Dado** una IP en la lista negra, **cuando** vuelve a intentar registrarse, aunque sea con un nombre y un código distintos y aunque el código sea el correcto, **entonces** el intento no se atiende y recibe de nuevo el aviso de ban.
- **CA-07**: **Dado** una IP en la lista negra, **cuando** otra IP distinta se registra con un código válido, **entonces** se registra con normalidad: el bloqueo es solo de la IP que se pasó.
- **CA-08**: **Dado** una IP en la lista negra, **cuando** se reinicia la aplicación, **entonces** la IP sigue bloqueada: el bloqueo es para siempre, hasta que alguien lo quite a mano.
- **CA-09**: **Dado** una IP en la lista negra, **cuando** la persona que trabaja en esta carpeta la quita siguiendo las instrucciones del README, **entonces** esa IP vuelve a poder registrarse con normalidad y empieza a contar desde cero.

### La IP que se cuenta (HU-04)

- **CA-10**: **Dado** una IP que ya ha hecho 5 intentos en un segundo, **cuando** el siguiente intento cambia el nombre, el código o cualquier otro dato que envía el usuario, **entonces** se sigue contando como la misma IP y recibe el aviso de ban.
- **CA-11**: **Dado** una petición de registro, **cuando** alguien intenta indicar otra IP en lo que envía, **entonces** se ignora y se cuenta la IP de la conexión con la que llegó la petición.
- **CA-12**: **Dado** que la aplicación está abierta al público con el enlace de la clase, **cuando** los alumnos se registran desde conexiones distintas, **entonces** todos llegan con la misma IP (`127.0.0.1`), comparten contador y bloqueo, y los límites cuentan a toda la clase junta. Es una decisión aceptada por la persona que trabaja en esta carpeta (ver §6).

### El código no se complica (HU-05)

- **CA-13**: **Dado** el código de asistencia, **cuando** se compara con el de antes del cambio, **entonces** tiene las mismas cifras y rota con la misma frecuencia: los tests de los códigos existentes siguen pasando sin cambios.
- **CA-14**: **Dado** un alumno que asiste y escribe su código bien, **cuando** se registra una vez, **entonces** no ve ningún aviso ni control nuevo.

### Privacidad (HU-06)

- **CA-15**: **Dado** una IP contada o bloqueada, **cuando** se revisa lo que guarda la aplicación, **entonces** la IP está solo en la lista negra y en los contadores de intentos, y ningún registro de asistencia, sesión ni nombre de alumno lleva IP ni se relaciona con ella.
- **CA-16**: **Dado** una clase con registros y una IP bloqueada, **cuando** el profesor exporta la lista, **entonces** el CSV no contiene ninguna IP.

### Constitución (todas)

- **CA-17**: **Dado** `docs/CONSTITUTION.md`, **cuando** se lee tras el cambio, **entonces** está en la versión 3.0: P4 permite guardar la IP solo en la lista negra y en los contadores de intentos, nunca junto a nombres ni en el CSV; §6 pasa a pedir protección contra intentos automáticos en el registro; y el historial de enmiendas recoge fecha y motivo. El resto del texto no cambia.

---

## 5. Fuera de alcance

- Limitar otras llamadas (ver la clase, el panel y las rutas del profesor).
- Un botón o pantalla para que el profesor desbloquee una IP (se quita a mano, con las instrucciones del README).
- Bloqueos por tiempo que caducan solos.
- Distinguir a cada alumno por su IP real cuando entran por el enlace público.
- Hacer el código más largo o difícil, o añadir captchas.
- Cambiar nada fuera de `staff/ella-deyavorsky/asistenciapp/`.

---

## 6. Preguntas abiertas

Ninguna. Decisiones de la persona que trabaja en esta carpeta (2026-10-26):

- Enmienda 3.0 de la constitución (versión mayor, porque contradice P4). Solo cuenta el registro. Los límites cuentan todos los intentos, sean válidos o no.
- El bloqueo es permanente, se guarda en la base y se quita a mano.
- La IP se guarda, separada de los nombres de los alumnos.
- Se cuenta siempre la IP de la conexión (`127.0.0.1` para todos). **Riesgo aceptado:** con el enlace público todos los alumnos comparten contador. Si en una clase se registran más de 5 a la vez o más de 20 en un minuto, quedará bloqueada toda la clase para siempre hasta que se quite a mano.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | La issue #395 pide limitar los intentos por IP. La constitución §4 exige un spec aprobado antes de tocar cualquier fichero. |
| 1.0 | 2026-10-26 | Aprobada; las dos preguntas abiertas se cierran aceptando el texto tal cual (IP compartida bloqueada entera; cuentan todos los intentos) | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-26 | Bloqueo permanente y guardado (HU-03, CA-08), desbloqueo a mano (HU-07, CA-09), se cuenta siempre la IP de la conexión (CA-10 a CA-12), la IP se guarda separada de los nombres y no sale en el CSV (HU-06, CA-15, CA-16), enmienda reformulada (CA-17). Los CA posteriores al 08 se renumeran | Decisiones de la persona que trabaja en esta carpeta tras revisar el plan. Aprobada |
| 1.2 | 2026-10-26 | La enmienda de la constitución pasa de 2.3 a 3.0 (CA-17) | La constitución §8 sube la versión mayor cuando se contradice un principio, y esto contradice P4 |
