# Spec 002 · Ningún cambio sin spec aprobada

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01 · Aprobada: 2026-11-01 · Issue: #720

---

## 1. Problema

Las reglas de AsistenciApp llegaron con la copia del ejercicio y todavía hablan de otro proyecto:

- **La puerta es estrecha.** Solo exigen una spec para el «código de una funcionalidad». Arreglar el README, añadir un test o retocar la documentación queda fuera, así que el agente puede hacerlo directamente.
- **El flujo de git puede confundirse con permiso.** Para cada tarea del curso hay issue, rama y pull request. Nada dice que eso no basta para tocar la app.
- **Apuntan a otra carpeta y a otra persona.** La ruta de trabajo y quien da el ok no son los de esta copia, así que nadie de aquí puede aprobar nada según las reglas.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Quien trabaja en esta carpeta** | Decidir qué se cambia antes de que se toque nada, y ser quien aprueba. |
| **Agente de IA** | Tener claro qué puede escribir al recibir un pedido y en qué momento debe pararse. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta carpeta, quiero que cualquier cambio de la app (no solo el código) pase antes por una spec aprobada, para decidir el qué antes que el cómo.
- **HU-02**: Como quien trabaja en esta carpeta, quiero revisar la spec antes de que exista plan o cambio, para corregirla cuando todavía es barato.
- **HU-03**: Como agente, quiero saber que issue, rama y pull request no me autorizan a cambiar la app, para no saltarme la spec.
- **HU-04**: Como quien trabaja en esta carpeta, quiero que las reglas hablen de mi carpeta y me nombren como quien aprueba, para que sean aplicables aquí.

---

## 4. Criterios de aceptación

Formato: **Dado** · **Cuando** · **Entonces**.

### Qué se puede tocar al empezar (HU-01, HU-02)

- **CA-01**: **Dado** un pedido que cambia código, tests, README o documentación de uso, **cuando** ninguna spec aprobada lo cubre, **entonces** el agente solo crea la spec del cambio y no modifica ningún otro fichero.
- **CA-02**: **Dado** que el agente termina la spec, **cuando** la presenta, **entonces** se detiene hasta recibir el ok; no escribe plan, tasks ni cambios.
- **CA-03**: **Dado** el ok de una fase, **cuando** se continúa, **entonces** el orden es plan, tasks e implementación, con una parada para el ok entre cada una.
- **CA-04**: **Dado** un pedido que no encaja en la spec activa, **cuando** se empieza, **entonces** se crea una spec con el siguiente número y no se reabre una ya terminada.

### Qué no cuenta como spec (HU-03)

- **CA-05**: **Dado** una issue, una rama o una pull request que describen el cambio, **cuando** no hay spec aprobada, **entonces** las reglas dicen que eso no autoriza a modificar la app.

### A quién se aplican (HU-04)

- **CA-06**: **Dado** la constitución y el manual del agente, **cuando** indican dónde se trabaja, **entonces** nombran `staff/sergio-moras/asistenciapp/`.
- **CA-07**: **Dado** la constitución y el manual del agente, **cuando** indican quién aprueba fases, commits y enmiendas, **entonces** es quien trabaja en esta carpeta, sin el nombre de otra persona.

### Lo que se respeta (HU-04)

- **CA-08**: **Dado** la spec `001-checkin-codigo`, **cuando** se aplica este cambio, **entonces** su texto e historial no se modifican.

---

## 5. Fuera de alcance

- Cambiar títulos o rutas del README.
- Quitar nombres de las notas ya escritas de la spec 001.
- Cambiar cómo funciona la app.
- La integración con Discord, que queda como idea sin número.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Aprobada e implementada |
