# Tareas 002 · Spec antes de tocar la app

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, el plan y esta lista ya están escritos. Las tareas de abajo son la enmienda y el renombre.

---

## Fase A · Constitución

- [x] **T01** · Enmendar `CONSTITUTION.md` §4.
  - Ningún fichero de la app se modifica sin un spec aprobado de esta aplicación que cubra ese cambio.
  - El spec que cuenta está en `staff/maria-osipuk/asistenciapp/specs/`. Un spec o una aprobación de un compañero no autorizan.
  - El orden sigue siendo spec, plan, tasks e implementación, con aprobación entre fases. Al terminar el spec, el agente espera el ok explícito.
  - Una issue, una rama o una pull request no sustituyen al spec.
  - *Cubre:* CA-01, CA-02, CA-03, CA-05, CA-06.
  - *Hecha cuando:* el §4 dice esas cuatro cosas.

- [x] **T02** · Enmendar `CONSTITUTION.md` §7, §8 y el historial, y subir la versión a 2.2.
  - §7 nombra `staff/maria-osipuk/asistenciapp/`.
  - §8 dice que aprueba la persona que trabaja en esa carpeta.
  - El historial gana la fila 2.2, con fecha 2026-10-23 y el motivo.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la cabecera dice versión 2.2 y la fila está en el historial.

## Fase B · Manual del agente

- [x] **T03** · Renombrar `AGENT.md` a `AGENTS.md`.
  - Mismo contenido. El título interno y el árbol del §3 usan `AGENTS.md`.
  - *Cubre:* CA-09.
  - *Hecha cuando:* existe `AGENTS.md` y ya no existe `AGENT.md`.

- [x] **T04** · Actualizar `AGENTS.md` §2, §2.4, §3, §4, §5 y §6.
  - «Cada cambio en esta app». Al empezar, el único fichero nuevo es el `spec.md`.
  - Ningún fichero de la app se adelanta al spec. Si ninguna spec local aprobada cubre el pedido, se abre otra en `staff/maria-osipuk/asistenciapp/specs/` con el siguiente número.
  - Un spec o una aprobación de un compañero no autorizan.
  - La ruta de trabajo es `staff/maria-osipuk/asistenciapp/`.
  - Quien da el ok, pide los commits y aprueba enmiendas es quien trabaja en esa carpeta.
  - El ejemplo de numeración deja de usar `002-discord-bot`.
  - *Cubre:* CA-01, CA-02, CA-04, CA-06, CA-07.
  - *Hecha cuando:* esos apartados ya no nombran Victor ni `victor-chang`, y las specs se buscan solo en esta carpeta.

- [x] **T05** · Actualizar la tabla de `AGENTS.md` §7.
  - `002-spec-antes-del-cambio` tiene su fila.
  - El bot de Discord sigue como idea futura, sin el número 002.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla muestra las dos specs y la idea sin número.

- [x] **T06** · En el README, cambiar el enlace `[AGENT.md](AGENT.md)` por `[AGENTS.md](AGENTS.md)`.
  - No se corrige nada más del README.
  - *Cubre:* CA-09.
  - *Hecha cuando:* el README enlaza a `AGENTS.md` y no a `AGENT.md`.

## Fase C · Comprobar lo que no se toca

- [x] **T07** · Comprobar que `specs/001-checkin-codigo/` no ha cambiado; que no queda `AGENT.md`; ejecutar `pytest`.
  - *Cubre:* CA-08, CA-09, regresión.
  - *Hecha cuando:* no hay diff de esa spec, no existe `AGENT.md`, y `pytest` pasa.
