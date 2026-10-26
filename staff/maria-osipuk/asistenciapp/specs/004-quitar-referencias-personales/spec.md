# Spec 004 · Quitar las referencias personales a Víctor

> Estado: **Implementada** (2026-10-23) · Creada: 2026-10-23 · Issue: #302

---

## 1. Problema

Quien lee la documentación de esta aplicación todavía encuentra a Víctor y a su carpeta.

Las instrucciones de uso nombran a esa persona. Tienen que quedar genéricas: un usuario sin nombre propio. El nombre de Víctor no se sustituye por el de quien trabaja en esta carpeta.

Las reglas del agente tienen que identificar con claridad esta aplicación y limitar la búsqueda de specs a su propia carpeta.

Las notas que ya recogen una decisión o una prueba conservan su fecha y su resultado. Al quitar la referencia personal, ese resultado no pasa a presentarse como una comprobación hecha por quien trabaja en esta carpeta.

Este cambio no altera el funcionamiento de la aplicación ni reorganiza su arquitectura.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien sigue las instrucciones de uso** | Ver un usuario genérico, sin el nombre de una persona. |
| **Quien lee la documentación** | No encontrar a Víctor ni su carpeta. |
| **Quien lee las reglas del agente** | Ver identificada esta aplicación, y que la búsqueda de specs se queda en su propia carpeta. |
| **Quien lee las notas ya escritas** | Seguir viendo la fecha y el resultado de cada decisión y de cada prueba, sin que figuren como comprobaciones de quien trabaja aquí. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que sigue las instrucciones de uso, quiero que hablen de un usuario genérico, para no depender del nombre de Víctor ni del de quien trabaja en esta carpeta.
- **HU-02**: Como persona que lee la documentación, quiero que no aparezcan Víctor ni su carpeta, para que el proyecto no guarde esas referencias personales.
- **HU-03**: Como persona que lee las reglas del agente, quiero que identifiquen esta aplicación y que la búsqueda de specs se limite a su propia carpeta, para no mezclar este proyecto con el de otra persona.
- **HU-04**: Como persona que lee las notas ya escritas, quiero conservar la fecha y el resultado de cada decisión y de cada prueba, para no perder lo que ya quedó registrado, y que eso no se presente como una comprobación de quien trabaja en esta carpeta.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Instrucciones genéricas (HU-01)

- **CA-01**: **Dado** las instrucciones de uso, **cuando** se leen, **entonces** hablan de un usuario genérico. No nombran a Víctor ni sustituyen ese nombre por el de quien trabaja en esta carpeta.

### Sin referencias personales (HU-02)

- **CA-02**: **Dado** la documentación de esta aplicación, **cuando** se busca a Víctor o su carpeta, **entonces** no queda ninguna de las dos.

### Reglas del agente (HU-03)

- **CA-03**: **Dado** las reglas del agente, **cuando** se leen, **entonces** identifican esta aplicación y limitan la búsqueda de specs a su propia carpeta.

### Lo que las notas conservan (HU-04)

- **CA-04**: **Dado** las notas que hoy nombran a Víctor, **cuando** se quita esa referencia, **entonces** cada nota conserva su fecha y el resultado de la decisión o de la prueba. Ese resultado no se presenta como una comprobación hecha por quien trabaja en esta carpeta.

### Lo que no cambia (HU-01, HU-02)

- **CA-05**: **Dado** este cambio, **cuando** se quitan esas referencias, **entonces** el funcionamiento de la aplicación y su arquitectura siguen igual.

---

## 5. Fuera de alcance

- Cambiar el funcionamiento de la aplicación.
- Reorganizar su arquitectura.
- Cambiar el resultado de una decisión o de una prueba ya registrada.
- Sustituir el nombre de Víctor por el de quien trabaja en esta carpeta.

---

## 6. Preguntas abiertas

Ninguna. El alcance quedó decidido el 2026-10-23 (issue #302): quitar las referencias a Víctor y a su carpeta, dejar las instrucciones genéricas, acotar las reglas del agente a esta aplicación y conservar fechas y resultados históricos sin atribuirlos a quien trabaja aquí.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador inicial | Issue #302. La spec 003 dejó fuera limpiar las referencias personales |
| 1.0 | 2026-10-23 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-23 | Implementada | T01–T11 hechas; el test nuevo pasa con el resto de la suite |
