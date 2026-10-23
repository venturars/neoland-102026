# Tareas 002 · Spec antes del cambio

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) (aprobado 2026-10-23) · Creado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec y el plan ya están escritos. Abajo está la enmienda y la comprobación.

---

## Fase A · Constitución

- [x] **T01** · Enmendar `docs/CONSTITUTION.md` §4 y subir la versión a **2.3**.
  - Añadir que una issue, una rama o una pull request **no sustituyen** al spec y **no autorizan** a modificar la app sin spec aprobado.
  - Dejar intactos los puntos que ya cubren CA-01, CA-02 y CA-03.
  - Cabecera: versión 2.3 · última enmienda 2026-10-23.
  - Historial: fila 2.3 con fecha y motivo (CA-05 / spec 002).
  - *Cubre:* CA-05 (y mantiene CA-01, CA-02, CA-03).
  - *Hecha cuando:* §4 incluye ese texto, la cabecera dice 2.3 y la fila está en el historial.

## Fase B · Manual del agente

- [x] **T02** · Actualizar `AGENT.md` §2 o §2.4 con la misma regla de issue / rama / PR.
  - *Cubre:* CA-05.
  - *Hecha cuando:* el manual dice que esos tres no autorizan sin spec aprobado.

- [x] **T03** · Actualizar la tabla de `AGENT.md` §7.
  - Fila de `002-spec-antes-del-cambio`.
  - Bot de Discord sigue como idea futura, sin número.
  - `001-checkin-codigo` sigue terminada.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla muestra 001, 002 y la idea sin número.

## Fase C · Comprobar lo que no se toca

- [x] **T04** · Comprobar que `specs/001-checkin-codigo/` y el `README.md` no han cambiado por esta spec.
  - *Cubre:* CA-07.
  - *Hecha cuando:* no hay diff de esa carpeta ni del README atribuible a la 002 (salvo lo ajeno a esta tarea).

- [x] **T05** · Repaso manual de CA-01, CA-02, CA-03 y CA-06 en constitución y `AGENT.md` (plan §2.1 y §3).
  - *Cubre:* CA-01, CA-02, CA-03, CA-06.
  - *Hecha cuando:* esos apartados siguen nombrando la puerta, el orden, la carpeta `staff/raul-santamaria/asistenciapp/` y quién aprueba.
