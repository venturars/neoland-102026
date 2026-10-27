# Spec 004 · Quitar las referencias personales a Raúl

> Estado: **Implementada** (2026-10-26) · Creada: 2026-10-26 · Aprobada: 2026-10-26

---

## 1. Problema

Quien lee AsistenciApp encuentra el nombre Raúl y su carpeta personal.

Las instrucciones para entrar en el proyecto usan `staff/raul-santamaria/asistenciapp` en los dos pasos que cambian de carpeta. Esa carpeta tiene que nombrar un usuario genérico, sin el nombre de una persona.

El manual del agente y la constitución también escriben esa carpeta personal. Las specs ya cerradas la citan en criterios, planes y tareas. Eso tiene que salir: ni el nombre Raúl ni la carpeta `raul-santamaria`.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien sigue las instrucciones para entrar en el proyecto** | Ver un usuario genérico, sin el nombre de una persona. |
| **Quien lee la documentación** | No encontrar el nombre Raúl ni su carpeta personal. |
| **Quien trabaja con las reglas de esta carpeta** | Seguir viendo dónde se edita y quién aprueba cada fase, sin esa carpeta personal. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que sigue las instrucciones, quiero que la carpeta nombre un usuario genérico, para no depender del nombre de una persona.
- **HU-02**: Como persona que lee la documentación, quiero que no aparezcan el nombre Raúl ni su carpeta personal, para que el proyecto no guarde esas referencias.
- **HU-03**: Como persona que trabaja con las reglas, quiero que la constitución y el manual sigan delimitando el proyecto y quién aprueba, sin escribir la carpeta personal.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### La carpeta de las instrucciones (HU-01)

- **CA-01**: **Dado** el README, **cuando** se leen los dos pasos que cambian de carpeta, **entonces** la carpeta es `staff/<usuario>/asistenciapp`. `<usuario>` es un usuario genérico y no el nombre de una persona.

### Sin referencias personales (HU-02)

- **CA-02**: **Dado** la documentación del proyecto, **cuando** se busca el nombre Raúl o la carpeta personal `raul-santamaria`, **entonces** no queda ninguna de las dos, ni queda sustituida por el nombre de otra persona.

### Reglas sin carpeta personal (HU-03)

- **CA-03**: **Dado** la constitución y el manual del agente, **cuando** se quita la carpeta personal, **entonces** siguen diciendo desde dónde se trabaja y que aprueba la persona que trabaja en esta carpeta, usando el usuario genérico `staff/<usuario>/asistenciapp/` donde haga falta una ruta.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto de la documentación y el uso de la app, **cuando** se quitan esas referencias, **entonces** el resto de las instrucciones y el pasar lista siguen igual.

---

## 5. Fuera de alcance

- Nombres de ejemplo del alumnado en la interfaz o el README (p. ej. un nombre de demostración en un mensaje).
- Cambiar el resultado de una decisión o de una prueba ya anotada.
- El comportamiento de la app al pasar lista.
- Crear issue, rama o pull request en GitHub.

---

## 6. Preguntas abiertas

Ninguna. El alcance (README, AGENT, constitución y specs que citan la carpeta; sin notas de la 001 que nombraran a Raúl) y el nombre `004-quitar-referencias-personales` quedaron decididos el 2026-10-26. De momento no hay issue en GitHub.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Las specs 002 y 003 dejaron la carpeta personal fuera; toca quitar Raúl y `raul-santamaria` |
| 1.0 | 2026-10-26 | Aprobada | Ok para plan, tasks e implementación |
| 1.1 | 2026-10-26 | Implementada | T01–T10 hechas; test nuevo con el resto de la suite |
