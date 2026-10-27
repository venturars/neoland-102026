# Spec 007 · Quién falta

> Estado: **Implementada** (2026-10-25) · Creada: 2026-10-25 · Aprobada: 2026-10-25

---

## 1. Problema

El profesor ve quién ha pasado lista, pero no ve quién falta. Quiero que la clase esté ya en la lista: al empezar, faltan todos. Cuando alguien pasa lista, esa persona deja de salir como faltante. Quien no ha pasado lista sigue viéndose como que falta.

El alumno no escribe el nombre a mano. El cuadro empieza vacío. Cuando escribe, salen solo los nombres que coinciden y puede elegir el suyo: el cuadro se completa con el nombre entero. El nombre se ve completo, sin foto. Así Sergio Cortes y Sergio Moras, y Diego Molero y Diego Torres, se distinguen sin escribir el apellido. Después escribe el código de 4 cifras, como hasta ahora.

Si todavía no ha escrito, no sale la lista. Las mayúsculas no importan: «sergio» y «Sergio» encuentran lo mismo. «diego» muestra a los dos Diego. «torres» muestra a Diego Torres.

Un nombre que no está en la clase no puede pasar lista. Hay que elegir uno de la lista.

La asistencia que se guarda sigue siendo el nombre elegido y la hora. La constitución hoy dice que solo se guarda el nombre que el alumno escribe. Esta spec pide poder tener también la lista de la clase, porque sin esos nombres no se puede ver quién falta. No se guardan fotos, emails ni otra cosa. El sí a esta spec incluye ese cambio de la constitución.

El código de 4 cifras, el límite de intentos y que una persona no se apunte dos veces siguen igual.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Ver, en la lista de la clase, quién falta y quién ya ha pasado lista. |
| **Alumno** | Encontrar su nombre con unas letras, elegirlo y pasar lista con el código. |

---

## 3. Historias de usuario

- **HU-01**: Quiero que, antes de que pase lista nadie, la lista muestre a toda la clase como faltante.
- **HU-02**: Quiero escribir unas letras y ver solo los nombres completos que coinciden, para elegir el mío.
- **HU-03**: Quiero que, si no escribo nada, no salga ninguna lista. Las sugerencias aparecen al empezar a escribir.
- **HU-04**: Quiero que, al elegir mi nombre y escribir el código vigente, deje de salir como faltante.
- **HU-05**: Quiero que quien no ha pasado lista siga viéndose como faltante.
- **HU-06**: Quiero que no se pueda pasar lista con un nombre que no está en la clase.
- **HU-07**: Quiero que no haya fotos.
- **HU-08**: Quiero que el código, el límite de intentos y el no apuntarse dos veces sigan como ahora.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** que nadie ha pasado lista, **cuando** el profesor abre la lista, **entonces** faltan Ella Deyavorsky, Meghan Martin, Esther Patino, Miguel Rodriguez, Sergio Cortes, Sergio Moras, Luis Duque, Diego Molero, Diego Torres, Manuel Diaz, Jimena Duran, Jose Miguel, Maria Osipuk, Raul Santamaria y Victor Chang.
- **CA-02**: **Dado** el cuadro de búsqueda, **cuando** el alumno escribe unas letras, **entonces** solo salen los nombres completos que las contienen, sin mirar mayúsculas. «sergio» muestra a Sergio Cortes y a Sergio Moras. «meghan» muestra solo a Meghan Martin. «torres» muestra a Diego Torres.
- **CA-03**: **Dado** el cuadro vacío, **cuando** el alumno aún no escribe, **entonces** no se ve la lista. Al escribir, salen las sugerencias y, al elegir una, el cuadro se completa con ese nombre.
- **CA-04**: **Dado** un alumno que elige su nombre y escribe el código vigente, **cuando** pasa lista, **entonces** queda apuntado con ese nombre y la hora, y ya no sale como faltante.
- **CA-05**: **Dado** que algunas personas ya han pasado lista, **cuando** el profesor mira la lista, **entonces** esas personas ya no faltan y el resto sigue faltando.
- **CA-06**: **Dado** un nombre que no está en la clase, o un intento sin elegir un nombre de la lista, **cuando** se intenta pasar lista, **entonces** no queda nadie apuntado.
- **CA-07**: **Dado** la búsqueda y la lista, **cuando** se miran, **entonces** no hay fotos.
- **CA-08**: **Dado** el código de 4 cifras, el límite de intentos y la regla de no apuntarse dos veces, **cuando** se usa la lista de la clase, **entonces** esos tres siguen como antes.
- **CA-09**: **Dado** la constitución enmendada, **cuando** leo la privacidad, **entonces** la asistencia sigue siendo el nombre elegido y la hora, y se puede guardar la lista de estos nombres para ver quién falta. No entran fotos ni emails.

---

## 5. Fuera de alcance

- Fotos, cuentas externas o emails.
- Añadir, quitar o cambiar nombres desde la pantalla.
- Incluir a quien da la clase en la lista del alumnado.
- Cambiar el código de 4 cifras, el límite de intentos o la regla de no apuntarse dos veces.
- El bot de Discord y la asistencia automática de Meet.
- Reescribir las specs ya cerradas.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-25 | Borrador | La clase está en la lista para ver quién falta. El alumno busca su nombre y lo elige. Sin fotos. |
| 1.0 | 2026-10-25 | Aprobada | El sí fue a este texto. |
| 1.1 | 2026-10-25 | Implementada | T01–T12 hechas. |
| 1.2 | 2026-10-25 | El cuadro empieza vacío | Las sugerencias salen al escribir, y al elegir una el nombre se completa. |
