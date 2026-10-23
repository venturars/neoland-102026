# Tareas 002 · Spec antes de tocar la app

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, el plan y esta lista ya están escritos. Las tareas de abajo son la enmienda.

---

## Fase A · Constitución

- [x] **T01** · Enmendar `CONSTITUTION.md` §4.
  - Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio.
  - El orden sigue siendo spec, plan, tasks e implementación. Al terminar el spec, el agente espera el ok.
  - Una issue, una rama o una pull request no sustituyen al spec.
  - *Cubre:* CA-01, CA-02, CA-03, CA-05.
  - *Hecha cuando:* el §4 dice esas tres cosas.

- [x] **T02** · Enmendar `CONSTITUTION.md` §7, §8 y el historial, y subir la versión a 2.2.
  - §7 nombra `staff/sergio-cortes/asistenciapp/`.
  - §8 dice que aprueba la persona que trabaja en esa carpeta.
  - El historial gana la fila 2.2, con fecha 2026-10-22 y el motivo.
  - *Cubre:* CA-06.
  - *Hecha cuando:* la cabecera dice versión 2.2 y la fila está en el historial.

## Fase B · Manual del agente

- [x] **T03** · Actualizar `AGENT.md` §2, §2.4, §4, §5 y §6.
  - «Cada cambio en esta app». Al empezar, el único fichero nuevo es el `spec.md`.
  - Ningún fichero de la app se adelanta al spec. Si la spec activa no cubre el pedido, se abre otra.
  - La ruta de trabajo es `staff/sergio-cortes/asistenciapp/`.
  - Quien da el ok, pide los commits y aprueba enmiendas es quien trabaja en esa carpeta.
  - *Cubre:* CA-01, CA-02, CA-04, CA-06.
  - *Hecha cuando:* esos apartados ya no nombran Victor ni `victor-chang`.

- [x] **T04** · Actualizar la tabla de `AGENT.md` §7.
  - `002-spec-antes-del-cambio` tiene su fila.
  - El bot de Discord sigue como idea futura, sin el número 002.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla muestra las dos specs y la idea sin número.

## Fase C · Comprobar lo que no se toca

- [x] **T05** · Comprobar que el historial de `specs/001-checkin-codigo/` y el README de la app no han cambiado en T01–T04; ejecutar `pytest`.
  - *Cubre:* CA-07, regresión.
  - *Hecha cuando:* no hay diff de esa spec ni del README por esta spec, y `pytest` pasa.
