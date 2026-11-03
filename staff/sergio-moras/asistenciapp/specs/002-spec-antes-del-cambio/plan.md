# Plan 002 · Ningún cambio sin spec aprobada

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0

---

## 1. Resumen

Es un cambio de reglas escritas. Se tocan dos ficheros y ninguno es código:

| Fichero | Qué cambia |
| --- | --- |
| [CONSTITUTION.md](../../CONSTITUTION.md) | §4 amplía la puerta y excluye issue, rama y PR. §7 y §8 pasan a esta carpeta y a quien trabaja en ella. Versión 2.1 → 2.2 |
| [AGENT.md](../../AGENT.md) | §2 describe el flujo para cualquier cambio. §2.1 y §2.4 dicen cuándo abrir spec nueva y qué no cuenta como spec. §4, §5 y §6 cambian ruta y aprobador. §7 añade esta spec |

---

## 2. Constitución

**§4 · SDD.** Los tres primeros puntos quedan así:

1. Antes de modificar cualquier fichero de la app (código, tests, README o documentación de uso) tiene que haber una spec aprobada que lo cubra. Si lo pedido no encaja en la spec activa, se crea otra con el siguiente número. (CA-01, CA-04)
2. El orden es spec → plan → tasks → implementación, y tras cada fase el agente espera el ok de quien trabaja en esta carpeta. (CA-02, CA-03)
3. Issue, rama y pull request sirven para seguir la tarea en git, pero no sustituyen a la spec ni autorizan cambios. (CA-05)

Los puntos que ya había (qué describe la spec, qué describe el plan, las dudas) se mantienen y se renumeran.

**§7 · Alcance.** La carpeta pasa a `staff/sergio-moras/asistenciapp/`. (CA-06)

**§8 · Enmiendas.** Aprueba quien trabaja en esta carpeta. (CA-07)

**Versión.** Es un añadido, no quita ningún principio: sube a 2.2 y se anota en el historial.

---

## 3. Manual del agente

- **§2:** el flujo se aplica a «todo cambio en la app» y lo primero que se escribe es `spec.md`. En la tabla de fases, quien da el ok es quien trabaja en esta carpeta, y la implementación abarca lo que digan las tasks, README incluido. (CA-01, CA-02, CA-03, CA-07)
- **§2.1:** si lo pedido no encaja en ninguna spec abierta, se crea otra; las terminadas no se reabren. (CA-04)
- **§2.4:** ningún fichero se adelanta a su spec, e issue, rama o PR no cuentan como spec. (CA-05)
- **§4 y §5:** la ruta pasa a esta carpeta. (CA-06)
- **§5 y §6:** explicar cada fase, pedir commits, aprobar enmiendas y dar por terminada una funcionalidad pasan a quien trabaja en esta carpeta. (CA-07)
- **§7:** fila para esta spec. La integración con Discord queda como idea sin número.

La nota de la incidencia del 2026-10-20 en §5 no cambia: es un registro de algo que pasó, no una regla sobre quién aprueba.

---

## 4. Lo que no se toca

- `specs/001-checkin-codigo/` (CA-08).
- `README.md`, el código y los tests.

---

## 5. Verificación

No hay comportamiento de la app que probar, así que se revisa a mano (constitución §5):

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-01 a CA-05 | Leer constitución §4 y `AGENT.md` §2, §2.1 y §2.4 |
| CA-06, CA-07 | Buscar el nombre y la carpeta anteriores en `CONSTITUTION.md` y `AGENT.md`: no deben aparecer |
| CA-08 | `specs/001-checkin-codigo/` y `README.md` sin diff en la rama |

---

## 6. Comprobación de la constitución

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1–P6 | Sí | No cambia la app, ni datos, ni pantallas, ni dependencias; todo en español |
| §3 Stack | Sí | Sin cambios |
| §4 SDD | Sí | Spec, plan y tasks se escriben antes de la enmienda |
| §5 Calidad | Sí | Verificación manual de cada criterio (§5 de este plan) |
| §6 Seguridad | Sí | No se tocan códigos ni registros |
| §7 Alcance | Sí | Solo ficheros de esta carpeta |
| §8 Enmiendas | Sí | La aprueba quien trabaja en esta carpeta y queda en el historial |
