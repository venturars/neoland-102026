# Tareas 006 · Límite de intentos inválidos por IP

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23 · Aprobado: 2026-10-23

---

## Fase A · Dominio y constitución

- [x] **T01** · `domain/rate_limit.py` + `tests/test_rate_limit.py` (`should_block_after_attempt`, constantes).
  - *Cubre:* CA-06.
- [x] **T02** · `IpBlocked` en `domain/errors.py`.
  - *Cubre:* CA-05.
- [x] **T03** · Enmienda constitución v2.4 (P4 excepción anti-abuso, §6).
  - *Cubre:* CA-13.

## Fase B · Persistencia

- [x] **T04** · Ampliar `infra/sqlite/schema.py` (tablas `blocked_ips`, `invalid_code_attempts`).
  - *Cubre:* CA-07, CA-08.
- [x] **T05** · `ports/rate_limit_repository.py` + `infra/sqlite/rate_limit_repository.py`.
  - *Cubre:* CA-08, CA-09.
- [x] **T06** · `use_cases/rate_limit.py` (`assert_not_blocked`, `after_invalid_code`).
  - *Cubre:* CA-01, CA-03, CA-04.

## Fase C · Web y API

- [x] **T07** · `client_ip`, `ProxyFix(x_for=1)`, integración en ruta check-in (429/422).
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
