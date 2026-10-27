# Spec 006 · Límite de intentos al pasar lista

> Estado: **Implementada** (2026-10-25) · Creada: 2026-10-25 · Aprobada: 2026-10-25

---

## 1. Problema

El código de la clase tiene 4 cifras. Son 10.000 posibilidades. Alguien que no está en clase puede probarlas con un programa hasta acertar y apuntarse, o apuntar a otra persona.

Quiero un freno: 5 intentos por segundo y 20 por minuto. El siguiente intento bloquea ese ordenador. El bloqueo se queda escrito en el mismo sitio donde ya se guarda la asistencia, y sigue ahí si cierro la app y la vuelvo a abrir. El aviso dice: «Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista.»

La dirección que se cuenta es la del ordenador que envía el intento. Otra dirección escrita en el formulario no cambia la cuenta. El bloqueo no se guarda junto al nombre ni a la hora.

Por el enlace público, el túnel llega desde este ordenador. Ahí la dirección contada es la que Cloudflare envía de cada alumno (`CF-Connecting-IP`), y solo si la app se arrancó con `--tunel`. Sin el túnel, esa cabecera no se usa. `X-Forwarded-For` no se usa nunca. Un alumno no bloquea a los demás.

Quien escribe el código bien una sola vez no llega al tope. Mirar la lista o abrir la página no cuenta.

La constitución no deja guardar esa dirección. Hace falta una enmienda: se puede recordar solo para contar los intentos y para el bloqueo. El registro de asistencia sigue siendo el nombre y la hora. El 5, el 20, el aviso y que el bloqueo no caduca se quedan en esta spec. La enmienda sube a la versión 3.0 porque contradice la prohibición de guardar esa dirección.

El código de 4 cifras no se alarga ni cambia de otra forma.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que un programa no pueda probar el código sin límite, y que el bloqueo siga al cerrar la app. |
| **Alumno** | Pasar lista una vez, con su nombre y el código, como hasta ahora. |
| **Quien prueba códigos sin parar** | Quedar bloqueado al pasarse, ver el aviso y seguir bloqueado. |

---

## 3. Historias de usuario

- **HU-01**: Quiero que un mismo ordenador no pase de 5 intentos por segundo ni de 20 por minuto.
- **HU-02**: Quiero que el intento que se pasa no apunte a nadie, muestre el aviso y deje el bloqueo escrito.
- **HU-03**: Quiero que un ordenador ya bloqueado siga sin poder pasar lista, aunque el código sea el de ahora, y también después de cerrar la app y abrirla otra vez.
- **HU-04**: Quiero que la dirección contada sea la del ordenador que envía el intento, no una que escriba quien lo envía.
- **HU-05**: Quiero registrarme como hasta ahora si no llego a esos topes.
- **HU-06**: Quiero que mirar la lista y abrir la página no cuenten.
- **HU-07**: Quiero que el código de 4 cifras siga igual de corto y siga cambiando como ahora.
- **HU-08**: Quiero que la constitución permita recordar la dirección solo para este recuento y para el bloqueo.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** un ordenador que no está bloqueado, **cuando** intenta pasar lista, **entonces** puede hacerlo 5 veces en un segundo y 20 veces en un minuto. Cuenta cada intento, también si el código es malo, el nombre está vacío, la clase no existe o ya está cerrada.
- **CA-02**: **Dado** un alumno con el código vigente que no llega a esos topes, **cuando** escribe su nombre y el código, **entonces** queda apuntado como hasta ahora.
- **CA-03**: **Dado** el profesor mirando la lista, o alguien abriendo la página, **cuando** usa la app sin intentar pasar lista, **entonces** eso no cuenta y no bloquea.
- **CA-04**: **Dado** un ordenador que hace un sexto intento en un segundo o un vigésimo primero en un minuto, **cuando** se pasa, **entonces** no queda nadie apuntado por ese intento, ve «Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista.», y el bloqueo queda escrito.
- **CA-05**: **Dado** un ordenador ya bloqueado, **cuando** intenta pasar lista con el código vigente, **entonces** no queda apuntado y vuelve a ver el mismo aviso.
- **CA-06**: **Dado** un ordenador bloqueado, **cuando** cierro la app y la vuelvo a abrir, **entonces** sigue bloqueado.
- **CA-07**: **Dado** un intento que trae otra dirección escrita, **cuando** se cuenta o se bloquea, **entonces** se usa la dirección del ordenador que envió el intento. Otro ordenador, con otra dirección de verdad, todavía puede pasar lista.
- **CA-08**: **Dado** este freno, **cuando** miro el código de 4 cifras, **entonces** no es más largo y sigue cambiando como hasta ahora.
- **CA-09**: **Dado** la constitución enmendada, **cuando** leo la privacidad, **entonces** deja recordar la dirección solo para contar los intentos y para el bloqueo, no junto al nombre ni a la hora. La versión es 3.0 y la enmienda está en el historial. El 5, el 20, el aviso y que el bloqueo no caduca no se escriben en la constitución.
- **CA-10**: **Dado** la app arrancada con el enlace público, **cuando** varios alumnos pasan lista casi a la vez, **entonces** cada uno es su propia dirección y los intentos de uno no bloquean a los demás. Sin `--tunel`, la cabecera del túnel no cambia la cuenta. `X-Forwarded-For` tampoco.

---

## 5. Fuera de alcance

- Alargar el código, hacerlo más difícil o cambiar cómo caduca.
- Guardar la dirección junto al nombre o a la hora.
- Escribir en la constitución los topes, el aviso o que el bloqueo no caduca.
- Quitar un ordenador de la lista de bloqueo.
- Dar un tope distinto a cada persona cuando varias llegan como el mismo ordenador.
- Contar mirar la lista, abrir la página u otro uso que no sea intentar pasar lista.
- El bot de Discord y la asistencia automática de Meet.
- Reescribir las specs ya cerradas.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-25 | Borrador | El bloqueo se queda al cerrar la app. 5 por segundo, 20 por minuto, y solo cuenta intentar pasar lista. |
| 0.2 | 2026-10-25 | El borrador pasó a inglés | Quien trabaja en esta carpeta lo pidió. El aviso que ve el alumno sigue en español. |
| 1.0 | 2026-10-25 | Aprobada, otra vez en español | El sí fue a este texto. |
| 1.1 | 2026-10-25 | Implementada | T01–T11 hechas. 100 tests en verde. |
| 1.2 | 2026-10-26 | Por el enlace público, cada alumno es su dirección | El túnel hacía que toda la clase contara como este ordenador. El sexto intento bloqueaba a todos. |
