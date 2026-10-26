# Spec 006 · Límite por IP pública

> Estado: **Implementada** (2026-10-26) · Creada: 2026-10-26 · Aprobada: 2026-10-26

---

## 1. Problema

Una persona, desde una única IP, puede probar combinaciones sin control hasta acertar el código y registrarse en la clase como si hubiera pasado lista.

El puzzle del código no se complica. El freno cuenta los intentos de registrarse de cada IP: como máximo 5 por segundo y 20 por minuto. Si una IP pasa de ahí, ve un aviso de ban y entra en una lista de bloqueo. Esa lista se guarda para siempre.

Esa IP es la pública estática del intento. Quien se registra no puede cambiarla por otra.

Ver la lista, abrir la página o el resto de usos de la app no cuentan para el máximo.

La constitución prohíbe guardar IPs. Este cambio necesita una enmienda: la app puede recordar la IP pública estática solo para contar los intentos de registrarse y para la lista de bloqueo. El registro de asistencia sigue guardando el nombre y la hora. Los máximos, el aviso de ban, que la lista dura para siempre y la regla de no complicar el puzzle se quedan en esta spec.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que nadie se registre a base de probar códigos sin límite, y que un bloqueo no se olvide al cerrar la app. |
| **Alumno** | Registrarse una vez, con su nombre y el código, como hasta ahora. |
| **Quien prueba códigos sin parar** | Quedar bloqueado al pasar de los intentos permitidos, con un aviso de ban, y seguir bloqueado para siempre. |
| **Quien trabaja en esta carpeta** | Que la constitución permita recordar la IP solo para ese control, y que el detalle viva en esta spec. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que una misma IP pública estática no pase de 5 intentos de registrarse por segundo ni de 20 por minuto, para que no pueda probar el código sin control.
- **HU-02**: Como profesor, quiero que una IP que pasa de esos máximos vea un aviso de ban y entre en la lista de bloqueo para siempre, para que el intento de ataque se corte y no se olvide al cerrar la app.
- **HU-03**: Como profesor, quiero que la IP contada sea la pública estática, para que quien se registra no pueda cambiarla.
- **HU-04**: Como alumno, quiero registrarme igual que ahora si no paso de esos máximos, para que el control no me impida pasar lista.
- **HU-05**: Como alumno, quiero que el código siga igual de fácil de copiar, para que este control no complique el puzzle.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero que la constitución solo permita recordar esa IP para el recuento de intentos y la lista de bloqueo, para que el registro de asistencia siga con el nombre y la hora.
- **HU-07**: Como profesor, quiero que ver la lista y el resto de usos de la app no cuenten como intentos, para que el panel no me bloquee.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### El límite (HU-01, HU-04, HU-07)

- **CA-01**: **Dado** una IP pública estática que no está bloqueada, **cuando** intenta registrarse, **entonces** puede hacerlo como máximo 5 veces en un segundo y 20 veces en un minuto.
- **CA-02**: **Dado** un alumno con el código vigente que no pasa de esos máximos, **cuando** escribe su nombre y el código, **entonces** queda registrado como hasta ahora.
- **CA-03**: **Dado** el profesor viendo la lista, o alguien abriendo la página, **cuando** usa la app sin intentar registrarse, **entonces** eso no cuenta para el máximo y no provoca un ban.

### El ban y la lista de bloqueo (HU-02)

- **CA-04**: **Dado** una IP pública estática que supera los 5 intentos de registrarse en un segundo o los 20 en un minuto, **cuando** se detecta ese exceso, **entonces** ve un aviso de ban, en español, que dice que queda bloqueada por haber superado los intentos permitidos, y esa IP entra en la lista de bloqueo.
- **CA-05**: **Dado** una IP que ya está en la lista de bloqueo, **cuando** intenta registrarse, **entonces** no queda registrada y vuelve a ver el aviso de ban, aunque el código sea el vigente.
- **CA-06**: **Dado** una IP en la lista de bloqueo, **cuando** se cierra la app y se vuelve a abrir, **entonces** esa IP sigue bloqueada. La lista no caduca.

### La IP que no se puede cambiar (HU-03)

- **CA-07**: **Dado** que quien intenta registrarse indica otra IP en lo que envía, **cuando** se cuenta el intento o se decide el bloqueo, **entonces** se usa la IP pública estática de ese intento.

### El puzzle (HU-05)

- **CA-08**: **Dado** el código de cuatro dígitos que el alumno copia de la clase, **cuando** existe este control, **entonces** el puzzle no es más complejo: el código no es más largo y sigue cambiando como hasta ahora.

### La constitución (HU-06)

- **CA-09**: **Dado** la constitución enmendada, **cuando** se lee la privacidad, **entonces** permite recordar la IP pública estática solo para contar los intentos de registrarse y para la lista de bloqueo. El registro de asistencia sigue guardando el nombre y la hora. La enmienda pasa a la versión 3.0, porque contradice la prohibición de guardar IPs, y queda anotada en el historial. Los máximos de 5 y de 20, el aviso de ban, que la lista dura para siempre y la regla de no complicar el puzzle no se escriben en la constitución.

---

## 5. Fuera de alcance

- Hacer el código más largo, más difícil o que cambie de otra forma.
- Guardar la IP junto al nombre o a la hora del alumno.
- Escribir en la constitución los máximos, el aviso de ban, la duración de la lista o la regla del puzzle.
- Quitar una IP de la lista de bloqueo.
- Dar un límite distinto a cada persona cuando varias comparten la misma IP pública.
- Contar para el máximo ver la lista, abrir la página u otro uso que no sea intentar registrarse.
- Reescribir el §6 de la constitución (la protección contra scripts sigue sin ser un requisito escrito ahí).
- El bot de Discord.
- Crear issue, rama o pull request en GitHub.

---

## 6. Preguntas abiertas

Ninguna. La lista de bloqueo se guarda para siempre. El máximo cuenta cada intento de registrarse. La IP es la de la conexión (con `--tunel`, la clase entera comparte esa dirección). Decidido el 2026-10-26. Sin issue en GitHub.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Límite 5/s y 20/min; lista permanente; enmienda 3.0 solo para el recuento y el bloqueo |
| 1.0 | 2026-10-26 | Aprobada | Ok para plan, tasks e implementación |
| 1.1 | 2026-10-26 | Implementada | T01–T11 hechas; 102 tests en verde |
