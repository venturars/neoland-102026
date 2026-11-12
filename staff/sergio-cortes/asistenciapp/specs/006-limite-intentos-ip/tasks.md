# Tareas 006 · Límite de intentos inválidos por IP

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23 · Aprobado: 2026-10-23

---

## Fase A · Dominio y constitución

- [x] **T01** · `domain/attempts.py` + `tests/test_rate_limit.py` (`over_limit`, constantes, `Banned`).
  - *Cubre:* CA-06.
- [x] **T02** · Bloqueo vía `check_in` + `run(action)` (`Banned` → 429).
  - *Cubre:* CA-05.
- [x] **T03** · Enmienda constitución v2.4 (P4 excepción anti-abuso, §6).
  - *Cubre:* CA-13.

## Fase B · Persistencia

- [x] **T04** · Ampliar `infra/sqlite/schema.py` (tablas `blocked_ips`, `invalid_code_attempts`).
  - *Cubre:* CA-07, CA-08.
- [x] **T05** · Funciones anti-abuso en `storage/sqlite.py` (con `path`; DDL en `schema.py`).
  - *Cubre:* CA-08, CA-09.
- [x] **T06** · Lógica en `usecases/attendance.py` (`_after_invalid_code`, `list_blocked`, desbloqueos).
  - *Cubre:* CA-01, CA-03, CA-04.

## Fase C · Web y API

- [x] **T07** · `ProxyFix(x_for=1)` y `request.remote_addr` en ruta check-in (429/422).
  - *Cubre:* CA-01–CA-05.
- [x] **T08** · Rutas profesor `GET/DELETE /api/blocked-ips` + token.
  - *Cubre:* CA-10–CA-12.
- [x] **T09** · `tests/test_rate_limit_api.py` (y helpers) para rate limit y blocked-ips.
  - *Cubre:* CA-01–CA-12, CA-14.

## Fase D · UI y documentación

- [x] **T10** · Panel profesor: listar / quitar una / quitar todas (`profesor.html`, `profesor.js`, estilos mínimos).
  - *Cubre:* CA-10, CA-11.
- [x] **T11** · `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md` §7.
  - *Cubre:* CA-13, CA-14.
- [x] **T12** · `pytest` completo verde; marcar tareas `[x]`.
  - *Cubre:* CA-14.

## Nota · Documentación 2026-10-26

- [x] **T13** · Actualizar `plan.md` §13 y specs 005 §11 para reflejar módulos finales (`attempts`, `storage`, `usecases`).
  - *Hecha cuando:* plan 006 y tasks describen la misma estructura que el código y ARCHITECTURE v1.2.
