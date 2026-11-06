# Spec 008 · Bloqueo justo y reglas claras

> Estado: **Implementada** (2026-10-30) · Creada: 2026-10-30

Issue: #653.

---

## 1. Problema

Cuatro problemas salieron al revisar la carpeta:

1. **El freno de la spec 006 puede dejar fuera a la clase entera, para siempre.** En una clase online todos los alumnos llegan por el túnel con la misma dirección. Se cuenta cada intento, también el correcto, así que basta con que seis alumnos pulsen a la vez para bloquear a todos. El bloqueo no caduca ni se puede quitar, y alcanza también a las clases siguientes. Un solo alumno puede provocarlo a propósito.
2. **La constitución se contradice.** El §6 dice que protegerse de los scripts no es un requisito, pero la versión 3.0 añadió ese freno. La privacidad habla de una «IP pública estática» que la app nunca veía.
3. **Las reglas del agente se pueden leer de dos formas.** El manual dice que el agente se para al terminar cada momento; el orquestador de git dice «llama y continúa». No está claro si las carpetas del flujo de git son ficheros de la app. Las herramientas externas que se usan no aparecen en las reglas.
4. **Los comandos solo sirven en macOS.** Hay alumnos con Windows y Linux.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que la clase pueda pasar lista aunque un alumno se equivoque o haga trampas. |
| **Alumno** | Registrarse con el código correcto sin que lo bloqueen por culpa de otro. |
| **Quien prueba códigos sin parar** | Quedar frenado un rato, sin frenar a los demás. |
| **Quien trabaja en esta carpeta** | Reglas sin contradicciones y comandos para su sistema. |

---

## 3. Historias de usuario

- **HU-01**: Como alumno, quiero que registrarme con el código correcto nunca cuente como intento, para que una clase grande no se bloquee sola.
- **HU-02**: Como profesor, quiero que el bloqueo dure 10 minutos y luego caduque, para que un error no deje la app inservible.
- **HU-03**: Como alumno de una clase online, quiero que se cuente mi propia dirección y no la del túnel, para que el que prueba códigos solo se bloquee a sí mismo.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que la constitución diga lo que hace la app, sin contradecirse.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero saber qué ficheros piden spec y dónde se para el agente.
- **HU-06**: Como alumno con Windows o Linux, quiero comandos que funcionen en mi sistema.

---

## 4. Criterios de aceptación

### El freno (HU-01, HU-02, HU-03)

- **CA-01**: **Dado** 25 alumnos con la misma dirección y el código vigente, **cuando** se registran en menos de un minuto, **entonces** quedan registrados todos.
- **CA-02**: **Dado** una dirección que falla el código 5 veces en un segundo, **cuando** lo falla una sexta vez, **entonces** ve el aviso de bloqueo. Lo mismo al fallar 21 veces en un minuto.
- **CA-03**: **Dado** una dirección bloqueada, **cuando** pasan 10 minutos, **entonces** puede volver a registrarse con el código vigente. Antes de eso no puede, aunque se cierre y se abra la app.
- **CA-04**: **Dado** el aviso de bloqueo, **cuando** se lee, **entonces** dice en español cuánto dura y qué hacer.
- **CA-05**: **Dado** una clase online por el túnel, **cuando** un alumno se bloquea, **entonces** otro alumno, desde otra dirección, sigue pudiendo registrarse.
- **CA-06**: **Dado** la app sin túnel, **cuando** quien se registra indica otra dirección en lo que envía, **entonces** se sigue usando la dirección de la conexión.
- **CA-07**: **Dado** un bloqueo que ya caducó, **cuando** alguien intenta registrarse, **entonces** esa dirección se borra del archivo.

### La constitución (HU-04, HU-05)

- **CA-08**: **Dado** la constitución, **cuando** se leen el §6 y la privacidad, **entonces** describen el freno tal como funciona y no se contradicen. Sube a la versión 4.0 y queda anotada en el historial.
- **CA-09**: **Dado** la constitución, **cuando** se lee qué ficheros piden spec, **entonces** nombra también las carpetas del flujo de git.
- **CA-10**: **Dado** la constitución, **cuando** se leen las dependencias y el stack, **entonces** nombran las herramientas externas que ya se usan (túnel y flujo de git) y los sistemas en los que funciona la app.

### El agente (HU-05)

- **CA-11**: **Dado** el orquestador de git, **cuando** termina el último paso de un momento, **entonces** se para y no empieza el siguiente, igual que dice el manual.

### Los comandos (HU-06)

- **CA-12**: **Dado** el README y el manual, **cuando** alguien con macOS, Linux o Windows prepara, activa, arranca y para la app, **entonces** encuentra los comandos de su sistema.
- **CA-13**: **Dado** que falta el programa del túnel, **cuando** se arranca con túnel, **entonces** el aviso dice cómo instalarlo en el sistema de quien lo arranca.

---

## 5. Fuera de alcance

- Un botón del profesor para quitar un bloqueo.
- Cambiar el código de 4 cifras o su duración.
- Cambiar los máximos de 5 por segundo y 20 por minuto.
- Reescribir los scripts del flujo de git para que no pidan bash.
- Los tests que buscan frases exactas en los documentos (otra issue).

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-30 | Borrador inicial | La issue 653 recoge los cuatro problemas de la revisión |
| 1.0 | 2026-10-30 | Implementada | T01–T10 hechas |
