# Spec 004 · Quitar las referencias personales a otro usuario

> Estado: **Implementada (2026-10-26)** · Creada: 2026-10-26 · Aprobada: 2026-10-26

---

## 1. Problema

Esta carpeta de la app viene de otra persona. En el README, la ruta para entrar en la carpeta lleva el nombre de esa persona y no la de esta carpeta. En las especificaciones antiguas, las aprobaciones, las pruebas y las decisiones están atribuidas a esa persona por su nombre.

Quien lee la documentación ve un nombre que no es el de quien trabaja aquí. Con la ruta del README, además, no puede entrar en la carpeta.

La issue #351 pide quitar todas las referencias personales a ese usuario. La spec 003 dejó la ruta fuera de alcance; esta la incluye.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien abre el README para poner la app en marcha** | Una ruta que lleve a esta carpeta. |
| **Quien lee las especificaciones** | Entender qué se decidió y qué se probó, sin que el texto señale a una persona que no trabaja aquí. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que abre el README, quiero que la ruta para entrar en la carpeta sea la de esta carpeta, para poder copiarla tal cual.
- **HU-02**: Como persona que lee las especificaciones, quiero que las decisiones, las pruebas y las aprobaciones se cuenten sin nombrar a otra persona, para que el texto no dependa de quién trabajó antes.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### La ruta del README (HU-01)

- **CA-01**: **Dado** el README, **cuando** se lee cada ruta para entrar en la carpeta del proyecto, **entonces** es la ruta de esta carpeta, `staff/ella-deyavorsky/asistenciapp`.

### Sin nombre ajeno (HU-02)

- **CA-02**: **Dado** cualquier fichero de texto de la app (README, constitución, manual del agente, especificaciones, planes y tareas), **cuando** se busca el nombre del usuario de la issue #351, **entonces** no aparece en ninguno.
- **CA-03**: **Dado** una frase que atribuía una decisión, una prueba o una aprobación a esa persona, **cuando** se reescribe, **entonces** la frase dice lo mismo (qué se decidió, qué se probó, qué fecha) sin nombrar a nadie.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto de la documentación, **cuando** se hacen estos cambios, **entonces** los requisitos, los criterios de aceptación, las fechas, los estados y los números de versión siguen diciendo lo mismo.
- **CA-05**: **Dado** el código y los tests de la app, **cuando** se hacen estos cambios, **entonces** el código y los tests que ya existen no se modifican, solo se añade un test nuevo, `tests/test_personal_references.py`, que comprueba CA-01 y CA-02, y todos los tests siguen en verde.

---

## 5. Fuera de alcance

- Cambiar el comportamiento de la app o el código.
- Los nombres de otras personas que vienen dentro de las herramientas instaladas (la carpeta .venv), y que no son este usuario.
- Reescribir otras frases de las especificaciones que no nombren a esa persona.
- Cambiar las rutas del resto del repositorio fuera de esta carpeta.

---

## 6. Preguntas abiertas

Ninguna. La ruta del README y la forma impersonal de las frases salen de las respuestas de la persona que trabaja en esta carpeta (2026-10-26).

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | La issue #351 pide quitar las referencias personales. La constitución §4 exige un spec aprobado antes de tocar cualquier fichero. |
| 1.0 | 2026-10-26 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-26 | Fuera de alcance: .venv. Se añade un test nuevo que comprueba CA-01 y CA-02. | Cambio pedido antes de aprobar el plan |
| 1.1 | 2026-10-26 | Aprobada | Ok para pasar al plan y a las tareas |
| 1.2 | 2026-10-26 | Implementada | Verificado (CA-01…05): búsqueda de nombres vacía y 79 tests en verde |
