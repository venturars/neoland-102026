# Tareas 008 · Bloqueo justo y reglas claras

> Estado: **Terminado** (2026-10-30) · Plan: [plan.md](plan.md) · Creado: 2026-10-30

Issue: #653.

Cómo leer esta lista:

- Se hacen **en orden**. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · El freno

- [x] **T01** · Tests del freno nuevo en `tests/test_rate_limit.py` y `tests/test_blocklist.py`.
  - Registros correctos que no cuentan, bloqueo que caduca, IP del túnel, `client_ip`, bloqueos caducados que se borran.
  - El aviso `BAN` pasa a decir cuánto dura.
  - *Cubre:* CA-01 a CA-07.
  - *Hecha cuando:* los tests nuevos existen y fallan con el código de antes.

- [x] **T02** · `asistencia/domain/attempts.py`: `BAN_SECONDS` y el aviso nuevo.
  - *Cubre:* CA-03, CA-04.
  - *Hecha cuando:* el aviso dice «10 minutos».

- [x] **T03** · `asistencia/storage/sqlite.py`: `prune_blocked_ips` y `block_ip` que actualiza la hora.
  - *Cubre:* CA-03, CA-07.
  - *Hecha cuando:* pasan los tests de `tests/test_blocklist.py`.

- [x] **T04** · `asistencia/usecases/attendance.py`: `check_in` en el orden del plan §2.1.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* pasan los tests de `tests/test_rate_limit.py` sin túnel.

- [x] **T05** · `app.py`: `client_ip`, `create_app(tunnel=...)` y `main()` que lo pasa.
  - *Cubre:* CA-05, CA-06.
  - *Hecha cuando:* pasan los tests del túnel y de `client_ip`.

## Fase B · Documentos

- [x] **T06** · `docs/CONSTITUTION.md` a 4.0 (§3, §4.1, P3, P4, §6, historial) y `tests/test_architecture.py`.
  - *Cubre:* CA-08, CA-09, CA-10.
  - *Hecha cuando:* la cabecera dice 4.0 y la fila está en el historial.

- [x] **T07** · `agents/git-workflow-agent.md` y `AGENTS.md` §2: el agente se para al acabar el momento.
  - *Cubre:* CA-11.
  - *Hecha cuando:* ya no aparece «Llama y continúa. No espera un sí».

- [x] **T08** · `asistencia/tunnel.py`: `install_hint` y su test en `tests/test_tunnel.py`.
  - *Cubre:* CA-13.
  - *Hecha cuando:* hay una pista para macOS, Windows y Linux.

- [x] **T09** · `README.md` y `AGENTS.md` §4–§5: comandos de macOS/Linux y Windows. README §4 y §8 con el freno nuevo.
  - Siguen las dos líneas `cd staff/<usuario>/asistenciapp`.
  - *Cubre:* CA-12.
  - *Hecha cuando:* cada paso tiene su comando en los dos grupos de sistemas.

- [x] **T10** · `docs/ARCHITECTURE.md` (fila de `app.py`), nota en la spec 006 y fila 008 en `AGENTS.md` §7.
  - *Hecha cuando:* `pytest` pasa.
