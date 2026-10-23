# Tareas 002 · Spec antes de tocar la app

> Estado: **Terminado (2026-10-23)** · Plan: [plan.md](plan.md) · Creado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, el plan y esta lista se escriben antes de la enmienda. Las tareas de abajo son la enmienda.

---

## Fase A · Constitución

- [x] **T01** · Enmendar `CONSTITUTION.md` §4.
  - Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio (código, tests, README y demás documentación de uso).
  - El orden sigue siendo spec, plan, tasks e implementación. Al terminar el spec, el agente lo enseña y espera el ok.
  - Una issue, una rama o una pull request no sustituyen al spec.
  - Si el cambio no cabe en la spec activa, se abre otra.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* el §4 dice esas cuatro cosas y no nombra a Victor.

- [x] **T02** · Enmendar `CONSTITUTION.md` §7, §8 y el historial, y subir la versión a 2.2.
  - §7 nombra `staff/ella-deyavorsky/asistenciapp/`.
  - §8 dice que aprueba la persona que trabaja en esta carpeta.
  - El historial gana la fila 2.2, con fecha 2026-10-23 y el motivo.
  - *Cubre:* CA-06.
  - *Hecha cuando:* la cabecera dice versión 2.2 y la fila está en el historial.

## Fase B · Manual del agente

- [x] **T03** · Actualizar `AGENT.md` §2, §2.4, §4, §5 y §6.
  - «Cada cambio en esta app». Al empezar, el único fichero nuevo es el `spec.md`.
  - La fase de implementar incluye el README cuando una task lo diga.
  - Ningún fichero de la app se adelanta al spec. Si la spec activa no cubre el pedido, se abre otra.
  - La ruta de trabajo es `staff/ella-deyavorsky/asistenciapp/`.
  - Quien da el ok, pide los commits y aprueba enmiendas es la persona que trabaja en esta carpeta.
  - *Cubre:* CA-01, CA-02, CA-04, CA-06.
  - *Hecha cuando:* esos apartados ya no nombran una carpeta personal ni dejan el ok en manos de otra persona.

- [x] **T04** · Actualizar la tabla de `AGENT.md` §7 y el ejemplo de numeración del §3.
  - §7: `002-spec-antes-del-cambio` tiene su fila. El bot de Discord sigue como idea futura, sin el número 002.
  - §3: el ejemplo de numeración `002-discord-bot` pasa a `002-spec-antes-del-cambio`, para que no contradiga al §7.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla del §7 muestra las dos specs y la idea sin número, y el ejemplo del §3 ya no usa el número 002 para el bot de Discord.

## Fase C · Comprobar lo que no se toca

- [x] **T05** · Comprobar que el historial de `specs/001-checkin-codigo/` y el README de esta rama no han cambiado.
  - *Cubre:* CA-07.
  - *Hecha cuando:* no hay diff de esa spec ni del README en esta rama.

## Fase D · Cierre

- [x] **T06** · Repasar la tabla de comprobación manual del plan §3, criterio por criterio.
  - Ejecutar `grep -n -i "victor" CONSTITUTION.md AGENT.md`: no debe encontrar nada.
  - Ejecutar `pytest` una vez: debe pasar.
  - Marcar la spec como **Implementada** (estado arriba + una fila 1.1 en su historial), y el plan y este fichero como terminados.
  - *Cubre:* CA-01 a CA-07.
  - *Hecha cuando:* el `grep` no devuelve nada, `pytest` pasa, y la spec, el plan y este fichero quedan marcados como terminados.
