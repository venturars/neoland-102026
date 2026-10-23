# Spec 005 · Adaptar el código a la arquitectura

> Estado: **Borrador (pendiente de aprobación)** · Creada: 2026-10-23

---

## 1. Problema

El código de AsistenciApp (spec 001) se escribió **antes** de que existiera [`ARCHITECTURE.md`](../../ARCHITECTURE.md) (v1.1, aprobada el 2026-10-23), y no la cumple. Los fallos más importantes:

- Las reglas del negocio están repartidas entre el servidor web y el resto del código, y el servidor web habla directamente con el almacenamiento.
- La organización de carpetas no es la que fija la arquitectura, y la función que monta la aplicación es demasiado larga.
- Los errores no siguen un único criterio: algunos mensajes no dicen qué hacer, y algunas entradas mal formadas se aceptan o se reinterpretan en vez de rechazarse.

La próxima funcionalidad (spec 004, asistencia desde Meet) toca casi todas las piezas. Si se construye sobre el código actual, o sigue reglas viejas o mezcla dos formas de organizar el código. Por eso se adapta **primero** el código a la arquitectura, sin añadir funcionalidades.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Victor** (quien mantiene la app) | Que el código siga las reglas aprobadas, para que las siguientes funcionalidades se construyan sobre una base ordenada. |
| **Profesor** y **alumno** | Que la app siga funcionando **igual** que antes. Solo notan mensajes de error más claros. |

---

## 3. Historias de usuario

- **HU-01**: Como Victor, quiero que **todo el código cumpla `ARCHITECTURE.md`**, para que cualquier funcionalidad nueva sepa dónde va cada pieza y cómo se escribe.
- **HU-02**: Como profesor y como alumno, quiero que **la app se comporte igual** que antes del cambio, sin perder ninguna clase ni registro guardado.
- **HU-03**: Como profesor y como alumno, quiero que **cada error me diga qué hacer**, y que lo que envío mal se rechace con un mensaje claro en vez de interpretarse a medias.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Nada cambia para quien usa la app (HU-02)
- **CA-01**: **Dado** el código adaptado, **entonces** todos los criterios de aceptación de la spec 001 se siguen cumpliendo, y todas sus comprobaciones automáticas siguen pasando. Se pueden **mover o renombrar**, pero no quitar ni relajar (salvo lo que cambie CA-05 o CA-06, y solo en lo que cambien).
- **CA-02**: **Dado** la base de datos que ya usa el profesor, **cuando** arranca la app adaptada, **entonces** siguen ahí todas sus clases, sus registros y su enlace secreto de profesor, sin hacer nada.
- **CA-03**: **Dado** el profesor que arranca la app, **entonces** los pasos y órdenes para prepararla, arrancarla (en local y con túnel) y ejecutar las comprobaciones son los mismos que hoy, o el README explica el cambio.

### El código cumple la arquitectura (HU-01)
- **CA-04**: **Dado** el código adaptado, **entonces** cumple cada punto de la lista de comprobación de `ARCHITECTURE.md` (§13). Cada punto que no cumpla está justificado por escrito en el `plan.md` (qué regla, por qué y hasta cuándo).

### Errores más claros (HU-03)
- **CA-05**: **Dado** cualquier error que pueda ver el profesor o el alumno (clase cerrada, clase o registro que no existe, dirección o acción desconocida, fallo inesperado), **entonces** el mensaje dice **qué ha pasado y qué hacer**.
- **CA-06**: **Dado** un alumno o un programa que envía un dato con un **tipo equivocado** (p. ej. el código como número en vez de como texto, o el nombre como lista), **cuando** intenta registrarse o abrir una clase, **entonces** se rechaza con un mensaje claro y no se guarda nada.
- **CA-07**: **Dado** el registro de lo que hace la app mientras funciona, **entonces** no aparece ningún nombre de alumno, dirección IP ni credencial.

---

## 5. Requisitos no funcionales

- Las comprobaciones automáticas siguen tardando **segundos**.
- Ningún cambio en lo que se guarda de cada alumno (constitución P4).

---

## 6. Fuera de alcance

- Cualquier funcionalidad nueva: Meet (spec 004), Discord (spec 002), servidor MCP (spec 003).
- Cambios de diseño en las pantallas, más allá del texto de los mensajes de error.
- Cambiar qué datos se guardan o cómo se calcula el código de asistencia.

---

## 7. Preguntas abiertas

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | Hoy, si el profesor abre una clase enviando algo que no es un formulario válido, la app lo ignora y pone la fecha como título (decisión de la spec 001, plan §2.13). La arquitectura (E1) pide **rechazar** lo mal formado. ¿Se rechaza, o se mantiene el comportamiento actual? | `[NECESITA ACLARACIÓN: propuesta, rechazarlo con un mensaje claro (E1) y ajustar esa comprobación de la spec 001]` |
| P2 | ¿Se aprovecha esta spec para añadir herramientas de desarrollo que revisen el estilo y los tipos de forma automática (constitución P3 v3.1)? | `[NECESITA ACLARACIÓN: propuesta, sí; así CA-04 se comprueba en parte de forma automática]` |

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador inicial | `ARCHITECTURE.md` v1.1 aprobada; Victor decide adaptar el código antes de construir la spec 004 |
