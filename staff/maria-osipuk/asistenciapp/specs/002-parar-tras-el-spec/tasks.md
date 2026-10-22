# Tareas 002 · Parar tras el spec

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, el plan y esta lista ya están escritos. El ok al plan y a esta lista se dio el 2026-10-22. Las tareas de abajo son la enmienda.

---

## Fase A · Constitución

- [x] **T01** · Enmendar `CONSTITUTION.md` §4.
  - Si ninguna spec aprobada cubre el pedido, el único fichero nuevo es `specs/NNN-nombre/spec.md`.
  - En ese paso no se crean el plan, las tasks ni el cambio, y no se modifican ficheros que ya existían.
  - Al terminar el spec, el agente lo enseña y para hasta el ok explícito del autor de la carpeta. Con ese ok, el siguiente paso es el plan.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* el §4 dice esas tres cosas y llama a quien aprueba «el autor de la carpeta», sin un nombre propio.

- [x] **T02** · Enmendar `CONSTITUTION.md` §8 y el historial, y subir la versión a 2.2.
  - §8 dice que las enmiendas las aprueba el autor de la carpeta.
  - El §7 no se toca: la ruta sigue siendo `staff/victor-chang/asistenciapp/`.
  - El historial gana la fila 2.2, con fecha 2026-10-22 y el motivo.
  - *Cubre:* CA-04, CA-05.
  - *Hecha cuando:* la cabecera dice versión 2.2, el §8 habla del autor de la carpeta sin un nombre propio, y la fila está en el historial.

## Fase B · Manual del agente

- [x] **T03** · Actualizar `AGENT.md` §2, §2.4, §5 y §6.
  - Al empezar, el único fichero nuevo es el `spec.md`. No se modifican ficheros que ya existían.
  - Al terminar el spec, se enseña y se para hasta el ok explícito del autor de la carpeta. Sin ese ok no se escribe el plan.
  - Si la spec activa no cubre el pedido, se abre otra y se escribe solo su `spec.md`.
  - Quien da el ok, pide los commits, aprueba enmiendas y da por terminada una funcionalidad es el autor de la carpeta.
  - No se cambian las rutas de `staff/victor-chang/asistenciapp/` en el §4 ni en el §5.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* esos apartados describen el fichero único y la parada, y el ok queda en el autor de la carpeta, sin un nombre propio.

- [x] **T04** · Actualizar `AGENT.md` §3 y la tabla del §7.
  - El ejemplo de numeración ya no asigna el 002 al bot de Discord.
  - `002-parar-tras-el-spec` tiene su fila.
  - El bot de Discord sigue como idea futura, sin número.
  - *Cubre:* el fuera de alcance de la spec (el bot no usa el 002).
  - *Hecha cuando:* la tabla muestra `001-checkin-codigo` terminada, esta spec en su fase, y el bot sin número.

## Fase C · Comprobar lo que no se toca

- [x] **T05** · Comprobar que siguen intactos el historial de `specs/001-checkin-codigo/`, el README y las rutas que nombran `staff/victor-chang/asistenciapp/`.
  - *Cubre:* el fuera de alcance de la spec.
  - *Hecha cuando:* no hay diff de esa spec ni del README, y la constitución §7 y `AGENT.md` §4 y §5 siguen citando esa ruta.
