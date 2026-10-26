# Tareas 002 · Ningún fichero sin spec aprobada

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado · Creado: 2026-10-23 · Aplicadas: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- No hay test automático: la comprobación es leer el texto, como dice el plan, apartado 3.

---

## Fase A · Constitución

- [x] **T01** · En `CONSTITUTION.md`, apartado 4, punto 1, sustituir «No hay código sin especificación aprobada…» por el párrafo del plan, apartado 2.1.
  - Los puntos 2 a 5 de ese apartado no se tocan.
  - Victor sigue siendo quien aprueba antes del plan.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* el punto 1 nombra código, tests, documento de uso y otra documentación de uso; dice que un spec de otro cambio no cubre este; y dice que una issue, una rama o una pull request no sustituyen al spec.
- [x] **T02** · Subir la constitución a la versión **2.2** y añadir la fila del historial del plan, apartado 2.1, con fecha 2026-10-23.
  - El apartado 8 no se reescribe. Victor sigue aprobando las enmiendas.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la cabecera dice 2.2 y el historial tiene la fila nueva.

## Fase B · Manual del agente

- [x] **T03** · En `AGENT.md`, apartado 2, antes de la tabla de fases, escribir las tres reglas del plan, apartado 2.2.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* esas tres reglas están antes de la tabla y Victor sigue aprobando cada fase.
- [x] **T04** · En `AGENT.md`, apartado 2.4, nombrar los mismos ficheros: código, tests, documento de uso y otra documentación de uso. No dejar la frase solo en «el código».
  - *Cubre:* CA-01.
  - *Hecha cuando:* el apartado 2.4 lista esos ficheros.
- [x] **T05** · En `AGENT.md`, apartado 5, poner las mismas tres reglas como primera regla de comportamiento.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* la primera regla del apartado 5 dice lo mismo que T03.
- [x] **T06** · En `AGENT.md`, apartado 3, quitar `002-discord-bot` del ejemplo de nombres. En el apartado 7, poner `002-require-approved-spec` en la fase que tenga y pasar la idea del bot a `003-discord-bot`, sin carpeta.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla nombra esta spec y ya no hay una fila `002-discord-bot`.

## Fase C · Comprobación

- [x] **T07** · Leer la constitución y `AGENT.md` con la tabla del plan, apartado 3.
  - Primero solo la constitución. Después solo `AGENT.md`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* cada documento, por su cuenta, dice las tres reglas. No se ha tocado `README.md` ni `specs/001-checkin-codigo`, y el nombre de Victor sigue donde ya estaba.
