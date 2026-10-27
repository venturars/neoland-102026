# Spec · Validación de paquetes con Socket

> Estado: **Aprobada** (2026-10-27) · Issue: #492

---

## 1. Problema

Al añadir un paquete de Node o cambiar su versión, hace falta comprobar ese paquete y esa versión con Socket antes de aceptar el plan. Sin esa regla, se puede meter una dependencia de riesgo sin dejar rastro en el desarrollo.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien construye la app con IA** | Un chequeo automático con Socket al proponer un paquete nuevo o un cambio de versión. |
| **Quien acepta el plan** | Ver el resumen de la validación y decidir sobre las alertas. |

---

## 3. Historias de usuario

- **HU-01**: Como quien acepta el plan, quiero que cada alta o cambio de versión de un paquete Node se valide con Socket, para no aceptar dependencias sin revisar campaña, alertas y stats.
- **HU-02**: Como quien acepta el plan, quiero que las alertas se comenten en la conversación y que yo decida si las acepto, para no dejar esa decisión a la IA.
- **HU-03**: Como quien acepta el plan, quiero que se revisen también las dependencias hasta 3 capas con los mismos criterios, y que el resumen entre en el `plan.md` antes de aceptarlo.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** un plan que añade un paquete de Node o cambia su versión, **cuando** se prepara la aceptación, **entonces** se valida con Socket ese paquete y esa versión.
- **CA-02**: **Dado** esa validación, **cuando** se miran campaña, alertas y stats, **entonces** el resumen indica si hay campaña, si hay alertas y si alguna stat está por debajo de 50 puntos.
- **CA-03**: **Dado** alertas abiertas relevantes, **cuando** aparecen, **entonces** se comentan en la conversación y la persona decide si las acepta; la IA no decide sola.
- **CA-04**: **Dado** el paquete principal, **cuando** se revisan dependencias, **entonces** se aplican los mismos criterios hasta 3 capas.
- **CA-05**: **Dado** la validación hecha, **cuando** se mira el `plan.md`, **entonces** incluye el resumen Socket **antes** de dar el plan por aceptado.
- **CA-06**: **Dado** que Socket no responde, **cuando** falla la consulta, **entonces** no se acepta el plan ni se inventa el resumen hasta repetir o acordar otro camino.
- **CA-07**: **Dado** la documentación, **cuando** se leen constitución y agents, **entonces** la obligación de usar Socket está en `docs/CONSTITUTIONS.md` y el procedimiento concreto en `AGENTS.md`.

---

## 5. Fuera de alcance

- Paquetes que no son de Node.
- Paquetes cuya versión no cambia en el plan.
- Más de 3 capas de dependencias.
- Que la IA acepte alertas sin la persona.
- Cambiar el comportamiento de las funcionalidades de usuarios que ya existen.
- Sustituir el MCP de Socket por otras herramientas para esta validación.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-27 | Aprobada (issue #492) |
