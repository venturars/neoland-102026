# Tasks 006 · Límite de intentos de registro por IP

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md)

Una tarea cada vez, en orden. Al acabarla se marca `[x]`. Cada «Terminada cuando» dice qué tests tienen que pasar en ese punto; si no se puede cumplir tal cual, se para y se propone el cambio antes de seguir.

---

## Fase A · La regla

- [x] **T01 · Test de la regla.** Crear `tests/test_attempts.py` con los casos del plan §8.
  - Cubre: CA-01, CA-02.
  - Terminada cuando: falla porque `asistencia/domain/attempts.py` no existe; el resto de la suite sigue en verde.

- [x] **T02 · `domain/attempts.py`.** Límites, `Blocked` y `exceeds_limit`, documentados como dice `AGENTS.md` §8.
  - Cubre: CA-01, CA-02, CA-07.
  - Terminada cuando: la suite completa pasa, incluido `test_attempts.py`.

## Fase B · El guardado

- [x] **T03 · Tablas y funciones.** Añadir `attempts`, `blocked_ips` y su índice al esquema, y `is_blocked`, `block_ip` y `record_attempt` a `sqlite_store.py` (plan §4).
  - Cubre: CA-06, CA-11.
  - Terminada cuando: la suite completa pasa (las funciones aún no se usan).

## Fase C · Aplicarlo

- [x] **T04 · Test de la API.** Crear `tests/test_rate_limit.py` con los casos del plan §8.
  - Cubre: CA-01 a CA-06, CA-08, CA-09, CA-11.
  - Terminada cuando: `test_rate_limit.py` falla porque la app todavía no limita; el resto de la suite sigue en verde.

- [x] **T05 · Caso de uso y entrada HTTP.** En el mismo paso, porque cambia la firma de `check_in`:
  - `student.check_in` recibe `ip` y sigue el orden del plan §5.
  - `app.py`: `client_ip` (plan §2), `behind_tunnel` en `create_app`, `--tunel` lo activa en `main()`, `ProxyFix(x_for=0)` y `Blocked` → 429.
  - Cubre: CA-01 a CA-09.
  - Terminada cuando: la suite completa pasa, incluidos `test_rate_limit.py` y `test_api.py` sin modificarlo.

## Fase D · Documentos

- [x] **T06 · Constitución 3.0.** Enmendar P4 y §6 y añadir la fila al historial (plan §6).
  - Cubre: CA-12.
  - Terminada cuando: la cabecera dice 3.0, P4 y §6 dicen lo del plan y la suite sigue en verde (`test_architecture.py` busca `Versión 2.3` y hay que actualizarlo a `3.0` en esta misma tarea).

- [x] **T07 · README y arquitectura.** Lo del plan §7 en `README.md` y `docs/ARCHITECTURE.md`.
  - Cubre: CA-07, CA-11.
  - Terminada cuando: el README explica el límite, el riesgo y cómo desbloquear, Privacidad ya no dice «ni IPs», y `ARCHITECTURE.md` lista `attempts.py`.

## Fase E · Verificar

- [x] **T08 · Demo de hack ético.** Lo del plan §9.
  - Cubre: CA-13.
  - Terminada cuando: el script recibe 429 a partir del 6.º intento, la clase no tiene registros, la app está parada, el puerto libre y la base de prueba borrada.

- [x] **T09 · Cierre.** Lanzar `pytest` completo y añadir la 006 a `AGENTS.md` §7.
  - Cubre: CA-01 a CA-12.
  - Terminada cuando: todo en verde y la tabla muestra la 006 como implementada.
