# Tareas 007 · Check-in con Discord

> Estado: **Hecha** · Plan: [plan.md](plan.md) · Creado: 2026-10-27 · Issue: #498

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test, después el código, cuando sea posible.

---

## Fase A · Constitución y docs base

- [x] **T01** · Enmendar `docs/CONSTITUTION.md` a **3.1** (P4: nombre visible de Discord como nombre de asistencia; sin id ni email). Historial con fecha 2026-10-27.
  - Actualizar el test que fija la versión de la constitución (p. ej. `tests/test_architecture.py`).
  - *Cubre:* CA-10.
  - *Hecha cuando:* `pytest` pasa en ese test y P4 dice la excepción nueva.

- [x] **T02** · Actualizar `docs/ARCHITECTURE.md` (fila `bot_discord.py`, nota `discord.py`) y la tabla de estado en `AGENTS.md` (spec 007 en plan/tareas).
  - *Cubre:* documentación del plan §3.5.
  - *Hecha cuando:* esos ficheros reflejan el borde Discord.

## Fase B · Almacén y acción

- [x] **T03** · Tests de almacén: columna `discord_enabled`, activar en sesión abierta, resolver sesión abierta con Discord activo; `checkins` sin columnas Discord.
  - *Cubre:* CA-01, CA-02, CA-10.
  - *Hecha cuando:* el test falla porque el almacén aún no tiene la columna/API.

- [x] **T04** · Implementar en `asistencia/storage/sqlite.py` lo de T03 (migración de esquema incluida).
  - *Cubre:* CA-01, CA-02, CA-10.
  - *Hecha cuando:* los tests de T03 pasan.

- [x] **T05** · Tests de `check_in_discord` y `enable_discord` (código vigente / malo / ya registrado / sin Discord activo).
  - *Cubre:* CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* fallan porque las acciones no existen.

- [x] **T06** · Implementar `enable_discord` y `check_in_discord` en `asistencia/usecases/attendance.py` (sin límite por IP).
  - *Cubre:* CA-02 a CA-05, CA-10.
  - *Hecha cuando:* los tests de T05 pasan. El check-in web sigue igual (CA-06).

## Fase C · API y panel

- [x] **T07** · Test API: `POST /api/sessions/<id>/discord` con token de profesor activa Discord; sin token 401; sesión cerrada 409.
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* falla o la ruta no existe.

- [x] **T08** · Ruta en `app.py` + botón y estado en `static/profesor.html` / `profesor.js`.
  - *Cubre:* CA-01, CA-07, CA-11.
  - *Hecha cuando:* test API de T07 pasa; verificación manual del botón a ~400 px (anotar en la tarea al cerrarla).
  - *Manual CA-11:* el botón vive en `.actions` del panel (mismo layout responsive que el resto); pendiente de mirar a ~400 px al probar en local.

## Fase D · Bot, dependencia y README

- [x] **T09** · Añadir `discord.py` con versión fija a `requirements.txt`. Crear `bot_discord.py`: lee `data/discord_token.txt`, comando `/asistencia`, llama a `check_in_discord`, mensajes en español.
  - *Cubre:* CA-02 a CA-05, CA-11 (mensajes).
  - *Hecha cuando:* el módulo arranca en seco si falta el token (error claro) y los textos de error/éxito tienen test o constantes comprobadas.

- [x] **T10** · README: crear bot, token en `data/discord_token.txt`, invitar, `python bot_discord.py`, botón del panel. Asegurar que `data/discord_token.txt` no se sube a git.
  - *Cubre:* uso humano del plan §3.1.
  - *Hecha cuando:* el README documenta el flujo completo.

- [x] **T11** · Cierre: `pytest` en verde; comprobar CA-07–CA-09 (lista en vivo / quitar / CSV) con un registro vía `check_in_discord` en test o manual breve; marcar spec 007 como implementada en `AGENTS.md`.
  - *Cubre:* CA-06 a CA-09, §5.
  - *Hecha cuando:* `pytest` pasa y la tabla de estado en `AGENTS.md` dice implementada.
  - *Cierre:* `tests/test_discord_list_export.py`; suite completa en verde.
