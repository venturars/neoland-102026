# Spec 002 · Spec antes del cambio

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

Quien trabaja en esta copia pide un cambio y el agente lo escribe enseguida. Las reglas solo frenan el código de una funcionalidad nueva. Un cambio de las instrucciones de uso, de las comprobaciones o de otra documentación de uso cabe fuera de esa frase, así que se hace sin una spec aprobada.

La issue, la rama y la pull request del bootcamp dejan la tarea apuntada. No dicen qué hay que cumplir y no sustituyen a la spec de la app.

Las reglas, además, nombran otra carpeta y a otra persona. La parada para pedir el ok no es para quien trabaja aquí.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta copia** | Que ningún cambio se escriba hasta que haya una spec aprobada por esa persona, y que el ok se le pida a ella. |
| **Agente** | Saber cuándo parar y a quién pedir el ok. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta copia, quiero que **cualquier cambio que pida** espere una spec aprobada por mí, para que no se escriba antes de decir qué hay que cumplir.
- **HU-02**: Como quien trabaja en esta copia, quiero que el ok **se me pida a mí y en esta carpeta**, para que la parada no sea para otra persona.
- **HU-03**: Como quien trabaja en esta copia, quiero que **la tarea apuntada en el bootcamp no autorice a escribir** si falta la spec de la app.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Cambios que esperan spec (HU-01)

- **CA-01**: **Dado** un pedido de cambiar las instrucciones de uso y **sin** spec aprobada por quien trabaja en esta copia, **cuando** el agente va a escribir, **entonces** no escribe ese cambio.
- **CA-02**: **Dado** un pedido de cambiar las comprobaciones y **sin** spec aprobada, **cuando** el agente va a escribir, **entonces** no escribe ese cambio.
- **CA-03**: **Dado** un pedido de cambiar otra documentación de uso y **sin** spec aprobada, **cuando** el agente va a escribir, **entonces** no escribe ese cambio.
- **CA-04**: **Dado** un pedido de código de una funcionalidad nueva y **sin** spec aprobada, **cuando** el agente va a escribir, **entonces** no escribe ese código.

### La tarea del bootcamp (HU-03)

- **CA-05**: **Dado** que la issue, la rama o la pull request del bootcamp ya apuntan la tarea, y **sin** spec de la app aprobada, **cuando** el agente va a escribir en esta copia, **entonces** no escribe.

### A quién se pide el ok (HU-02)

- **CA-06**: **Dado** las reglas de esta copia, **cuando** el agente para para pedir el ok, **entonces** se lo pide a quien trabaja en esta copia y en esta carpeta.

---

## 5. Requisitos no funcionales

- La parada ocurre **antes** de escribir, no después.
- Las reglas de esta copia y esta spec se leen en **español**.

---

## 6. Fuera de alcance (en esta spec)

- El check-in de la spec 001.
- Discord, que sigue como idea futura y sin número de spec.
- El plan, las tareas y el código que aplicarían esta spec.
- Cambiar el camino de git del bootcamp: la issue, la rama y la pull request siguen existiendo.

---

## 7. Preguntas abiertas

Ninguna. Lo que no esté en esta spec no se inventa.

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| Borrador | 2026-10-22 | Versión inicial, pendiente de aprobación | — |
| 1.0 | 2026-10-22 | Aprobada e implementada en las reglas de esta copia | Jose Miguel pidió seguir con la implementación |
