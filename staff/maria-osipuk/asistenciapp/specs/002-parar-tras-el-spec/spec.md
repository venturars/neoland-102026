# Spec 002 · Parar tras el spec

> Estado: **Implementada** (v1.1, 2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

El autor de la carpeta pide un cambio y el agente puede seguir escribiendo. Las reglas dicen que cada fase termina con un ok, pero no dicen cuál es el **único fichero nuevo** permitido al empezar, ni que el trabajo **para en cuanto ese fichero está escrito**.

Sin esa puerta, en el mismo paso pueden aparecer el plan, las tareas y el cambio. Quien tiene que decidir el qué ya no llega a corregirlo antes.

La spec `001-checkin-codigo` está terminada. No cubre esta puerta.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Agente** | Saber cuál es el único fichero que puede crear al empezar, y cuándo tiene que parar. |
| **Autor de la carpeta** | Ver ese fichero y dar el ok antes de que se escriba nada más. |

---

## 3. Historias de usuario

- **HU-01**: Como agente, quiero saber que al empezar un cambio el único fichero nuevo que puedo crear es el spec, para no escribir el plan, las tareas ni el cambio en ese mismo paso.
- **HU-02**: Como agente, quiero parar en cuanto el spec está escrito y enseñarlo, para no seguir hasta que haya un ok explícito.
- **HU-03**: Como autor de la carpeta, quiero corregir ese spec antes del plan y de la implementación, para que el qué quede decidido antes del cambio.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Al empezar (HU-01)

- **CA-01**: **Dado** un pedido de cambio que ninguna spec aprobada cubre, **cuando** el agente empieza, **entonces** el único fichero nuevo es el `spec.md` de una spec nueva. No crea el plan, las tareas ni el cambio.
- **CA-02**: **Dado** ese mismo pedido, **cuando** el agente empieza, **entonces** no modifica ficheros que ya existían en la app. El spec es lo único que se escribe en ese paso.

### Cuándo parar (HU-02, HU-03)

- **CA-03**: **Dado** un spec recién escrito para ese pedido, **cuando** el agente termina de escribirlo, **entonces** lo enseña y para. No escribe el plan, las tareas ni el cambio.
- **CA-04**: **Dado** ese spec a la espera de ok, **cuando** todavía no hay un ok explícito, **entonces** el agente sigue parado aunque le pidan seguir con el cómo o con el cambio.
- **CA-05**: **Dado** el ok explícito a ese spec, **cuando** se pide el siguiente paso, **entonces** ya se puede escribir el plan. Hasta ese ok, no.

---

## 5. Fuera de alcance (en esta spec)

- El bot de Discord. Sigue como idea futura y no usa este número.
- Reescribir el historial de la spec `001-checkin-codigo`.
- Cambiar las rutas que todavía nombran otra carpeta.
- Decidir si una issue, una rama o una pull request cuentan como spec.
- El contenido del plan, de las tareas y de la implementación de esta puerta: solo se escriben después del ok a este spec.

---

## 6. Preguntas abiertas

Ninguna. Resuelta el 2026-10-22.

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | ¿El ok lo da el autor de la carpeta, o sigue siendo el nombre que dicen ahora la constitución y el manual? | **Lo da el autor de la carpeta.** CA-04 y CA-05 esperan su ok explícito, sin escribir un nombre propio. |

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | Fijar el único fichero al empezar y el momento de parar, antes de escribir nada más |
| 1.0 | 2026-10-22 | Aprobada. P1 resuelta: el ok lo da quien trabaja en la carpeta | Se pide el plan y las tasks |
| 1.1 | 2026-10-22 | El ok lo da el autor de la carpeta, sin nombre propio | El rol no debe quedar atado a una persona |
