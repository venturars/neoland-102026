# Spec 002 · Spec antes de tocar la app

> Estado: **Implementada** (2026-10-23) · Creada: 2026-10-23 · Issue: #287

---

## 1. Problema

Quien trabaja en esta carpeta pide un cambio y el agente lo escribe enseguida. Las reglas solo frenan el código de una funcionalidad nueva. Un cambio del README, de los tests o de otra documentación de uso cabe fuera de esa frase, así que se hace sin un spec aprobado.

La issue, la rama y la pull request del bootcamp dejan la tarea apuntada. No dicen qué hay que cumplir ni sustituyen al spec de esta app. Las reglas, además, siguen nombrando otra carpeta y a otra persona, así que la parada para pedir el ok no es para quien trabaja aquí.

Un spec o una aprobación de un compañero tampoco autorizan un cambio aquí. Lo único que cuenta es un spec aprobado dentro de `staff/maria-osipuk/asistenciapp/specs/`.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Decidir el qué de un cambio y dar el ok en cada fase antes de que se escriba el plan, las tareas o el cambio. |
| **Agente** | Saber dónde buscar specs, cuál es el único fichero que puede crear al empezar, y cuándo tiene que parar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que un cambio de la app no se escriba hasta que haya un spec aprobado que lo cubra, para que el qué quede decidido antes del cambio.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que al empezar un cambio el agente solo escriba el spec y espere mi ok explícito, para poder corregirlo antes del plan y de la implementación.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero que un pedido que no cabe en ninguna spec local aprobada abra una spec nueva con el siguiente número de mi carpeta, para no mezclarlo con una spec ya terminada ni con las de otras personas.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request no cuenten como spec, para que el camino de git no se salte esta puerta.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que las reglas nombren esta carpeta y que yo apruebe cada fase, para que no sigan apuntando a otro proyecto ni a otra persona.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero que el agente busque specs solo en `staff/maria-osipuk/asistenciapp/specs/`, para que un spec o una aprobación de un compañero no autoricen cambios aquí.
- **HU-07**: Como persona que trabaja en esta carpeta, quiero que el manual del agente se llame `AGENTS.md`, para que el nombre coincida con el que usa el resto del repositorio.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Antes de escribir (HU-01, HU-02)

- **CA-01**: **Dado** un pedido de cambiar el código, los tests, el README u otra documentación, **cuando** todavía no hay un spec aprobado de esta aplicación que lo cubra, **entonces** ese fichero no se modifica y lo primero que se escribe es el spec.
- **CA-02**: **Dado** un spec recién escrito para ese pedido, **cuando** el agente termina de escribirlo, **entonces** lo enseña y espera el ok explícito de quien trabaja en esta carpeta. No escribe el plan, las tareas ni el cambio.

### El orden (HU-02, HU-03)

- **CA-03**: **Dado** el ok al spec, **cuando** se sigue con el cambio, **entonces** el orden es plan, luego tareas, luego el cambio. Hay aprobación entre fases. No se salta ninguna.
- **CA-04**: **Dado** un pedido que ninguna spec local aprobada describe, **cuando** se empieza, **entonces** se abre otra spec con el siguiente número disponible en `staff/maria-osipuk/asistenciapp/specs/` y no se reutiliza `001-checkin-codigo`.

### Qué no cuenta como spec (HU-04, HU-05, HU-06)

- **CA-05**: **Dado** una issue, una rama o una pull request que describen el cambio, **cuando** aún no hay un spec aprobado de esta aplicación, **entonces** esos tres no autorizan a modificar la app.
- **CA-06**: **Dado** un spec o una aprobación en la carpeta de un compañero, **cuando** se pide un cambio en esta aplicación, **entonces** no autorizan el cambio. Solo cuenta un spec aprobado dentro de `staff/maria-osipuk/asistenciapp/specs/`.
- **CA-07**: **Dado** la constitución y el manual del agente, **entonces** nombran `staff/maria-osipuk/asistenciapp/` y dicen que quien aprueba cada fase es la persona que trabaja en esa carpeta.
- **CA-08**: **Dado** el historial de la spec `001-checkin-codigo`, **entonces** los nombres y las fechas de quien la aprobó y la probó siguen como estaban.

### Nombre del manual (HU-07)

- **CA-09**: **Dado** que el manual del agente se llama `AGENT.md`, **cuando** se aplica este cambio, **entonces** el fichero pasa a llamarse `AGENTS.md`, las reglas vivas lo nombran así y ya no existe `AGENT.md`. El README solo se toca para actualizar ese enlace.

---

## 5. Fuera de alcance (en esta spec)

- Cambiar cómo se pasa lista (abrir sesión, código, registro, lista, cierre o descarga).
- El bot de Discord. Se queda como idea futura, sin número de spec.
- Reescribir el historial de la spec `001-checkin-codigo`.
- Corregir rutas o términos del README que todavía nombren otra carpeta o a otra persona, salvo el enlace al manual del agente (`AGENT.md` → `AGENTS.md`).

---

## 6. Preguntas abiertas

Ninguna. El alcance, la carpeta de specs, quién aprueba y el nombre `AGENTS.md` quedaron decididos el 2026-10-23 (issue #287).

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Versión inicial aprobada | Issue #287: puerta spec antes de cualquier fichero de esta app |
| 1.1 | 2026-10-23 | HU-07 y CA-09: el manual pasa a llamarse `AGENTS.md` | Pedido explícito al revisar el plan |
