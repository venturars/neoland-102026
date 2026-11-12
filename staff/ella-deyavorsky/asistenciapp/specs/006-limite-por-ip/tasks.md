# Tareas 006 · Límite de intentos por IP al registrarse

> Estado: **Borrador v1.0 (2026-10-26)** · Plan: [plan.md](plan.md) v1.2 · Spec: [spec.md](spec.md) v1.2 · Creado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test y luego el código. Tras cada tarea de código, `pytest` en verde (salvo los tests nuevos que esperan su código).
- Las specs 001–005 no se editan. Los tests existentes no se modifican: los casos nuevos se añaden aparte. Si un test existente se bloquea por el límite, se para y se propone el cambio antes de tocarlo.
- No se hace commit de nada de `staff/ella-deyavorsky/first-app/`. No hay commits ni pushes sin que lo pidas.

---

## Fase A · La regla del dominio

- [x] **T01** · Crear `tests/test_rate_limit.py`: `is_over_limit` es falso con 5 en el último segundo y 20 en el último minuto, y verdadero con 6 en el último segundo o con 21 en el último minuto; `ensure_not_blocked(False)` no hace nada; `ensure_not_blocked(True)` lanza `IpBanned`; el mensaje está en español y menciona al profesor.
  - *Cubre:* CA-01 a CA-05.
  - *Hecha cuando:* `pytest tests/test_rate_limit.py` falla porque `asistencia.domain.rate_limit` no existe.
- [x] **T02** · Crear `asistencia/domain/rate_limit.py` con `MAX_PER_SECOND`, `MAX_PER_MINUTE`, `BAN_MESSAGE`, `IpBanned`, `is_over_limit` y `ensure_not_blocked` (plan §2.1). Docstrings y tipos según `AGENTS.md` §6.
  - *Cubre:* CA-01 a CA-05.
  - *Hecha cuando:* `pytest tests/test_rate_limit.py` y `tests/test_architecture.py` pasan.

## Fase B · El almacenamiento

- [x] **T03** · Crear `tests/test_ip_storage.py` con una base temporal: `record_ip_attempt` devuelve `(1, 1)` en el primer intento y cuenta por ventana (varios en el mismo segundo, otros 30 s antes); borra los intentos de hace más de 60 s de esa IP y no toca los de otras IPs; `is_ip_blocked` es falso, `block_ip` lo hace verdadero y repetirlo no falla; el bloqueo sigue ahí al abrir de nuevo la misma base; las tablas `ip_attempts` y `blocked_ips` no tienen claves foráneas ni columnas hacia `checkins`/`sessions`, y `checkins` no tiene columna de IP; borrar la IP de las dos tablas la deja libre y con el contador a cero.
  - *Cubre:* CA-08, CA-09, CA-15.
  - *Hecha cuando:* `pytest tests/test_ip_storage.py` falla porque las funciones y las tablas no existen.
- [x] **T04** · En `asistencia/storage/sqlite.py`: añadir las dos tablas y el índice a `SCHEMA`, y las funciones `record_ip_attempt`, `is_ip_blocked` y `block_ip` (plan §2.2). No importan nada del proyecto. Docstrings y tipos según `AGENTS.md` §6.
  - *Cubre:* CA-08, CA-09, CA-15.
  - *Hecha cuando:* `pytest tests/test_ip_storage.py` y `tests/test_architecture.py` pasan, y los tests existentes siguen en verde.

## Fase C · La acción y la ruta

- [x] **T05** · Añadir al final de `tests/test_api.py` los casos de la ruta, avanzando el reloj donde haga falta: el 6.º registro en un segundo recibe 429 con el aviso; 20 registros espaciados pasan y el 21.º en un minuto recibe 429; una IP bloqueada es rechazada con un código válido y con otro nombre; otra IP (`REMOTE_ADDR` distinta) se registra; un `create_app` nuevo sobre la misma base sigue rechazando; cambiar el nombre y el código no cambia la IP contada; `X-Forwarded-For` y `CF-Connecting-IP` se ignoran; un registro normal sigue devolviendo 201.
  - *Cubre:* CA-02, CA-04 a CA-08, CA-10 a CA-12, CA-14.
  - *Hecha cuando:* los casos nuevos fallan y los existentes de `test_api.py` siguen pasando.
- [x] **T06** · En `asistencia/usecases/attendance.py`: `check_in` recibe `ip` y llama primero a `_enforce_ip_limit(db_path, ip, now)` (plan §2.3). En `app.py`: la ruta pasa `request.remote_addr` y `IpBanned: 429` entra en `DOMAIN_ERRORS`. `ProxyFix`, `create_app` y `main` no cambian de firma.
  - *Cubre:* CA-02, CA-04 a CA-08, CA-10 a CA-12, CA-14.
  - *Hecha cuando:* `pytest` completo en verde, incluidos los tests de T05 y los existentes sin cambios.

## Fase D · Código y privacidad intactos

- [x] **T07** · Añadir un test que fija el código actual (4 cifras y rotación igual que `tests/test_codes.py`) y otro que, tras bloquear una IP con registros ya hechos, comprueba que el CSV exportado y las filas de `sessions` y `checkins` no contienen la IP.
  - *Cubre:* CA-13, CA-15, CA-16.
  - *Hecha cuando:* pasan sin tocar `asistencia/domain/codes.py` ni `asistencia/export.py` (`git diff` de esos ficheros vacío).
- [x] **T08** · Comprobar que el front enseña bien el mensaje de un 429 al alumno: leer `static/` y, si ya muestra el campo `error` del servidor, no cambiar nada. Si no lo hace, parar y proponer la tarea antes de tocarlo.
  - *Cubre:* CA-05, CA-14.
  - *Hecha cuando:* anotado en el resumen de la fase qué se encontró; verificado a mano en T12.

## Fase E · Documentación y constitución

- [x] **T09** · Enmienda 3.0 en `docs/CONSTITUTION.md` (plan §2.7): versión y fecha en la cabecera, P4, §6 y fila 3.0 en el historial. El resto del texto no cambia.
  - *Cubre:* CA-17.
  - *Hecha cuando:* `git diff docs/CONSTITUTION.md` solo muestra esos cuatro cambios.
- [x] **T10** · `docs/ARCHITECTURE.md`: añadir `rate_limit.py` al árbol y a las tablas de §1 y §3, mencionar las dos tablas en `storage/` y que `check_in` coordina la regla y el almacenamiento.
  - *Cubre:* CA-17 (la arquitectura sigue al día).
  - *Hecha cuando:* `tests/test_architecture.py` pasa y el documento menciona `rate_limit.py`.
- [x] **T11** · `README.md`: sección corta con los límites (5 por segundo, 20 por minuto), el aviso de ban, que el bloqueo es permanente, el efecto «toda la clase comparte la IP `127.0.0.1`» y el comando de desbloqueo con la app parada (plan §2.6). `AGENTS.md` §8: fila de la spec 006. Plan y tasks: estado actualizado.
  - *Cubre:* CA-08, CA-09, CA-12.
  - *Hecha cuando:* el README no menciona ninguna ruta, comando ni función que no exista, y el comando de desbloqueo se ha probado sobre una base de prueba.

## Fase F · Verificación

- [x] **T12** · Verificación manual con `python app.py` sobre una base de prueba (no la real): crear una clase y registrarse una vez con normalidad; enviar 6 registros seguidos y ver el aviso de ban en el 6.º y en los siguientes aunque el código sea el bueno; repetir cambiando nombre, código y la cabecera `X-Forwarded-For` y comprobar que sigue bloqueada; comprobar que el panel del profesor y ver la clase funcionan; reiniciar y comprobar que sigue bloqueada; desbloquear con el comando del README y comprobar que vuelve a registrarse. Parar todo lo arrancado y comprobar `lsof -nP -iTCP:8000 -sTCP:LISTEN` vacío.
  - *Cubre:* CA-06, CA-08 a CA-11, CA-14.
  - *Hecha cuando:* los pasos anteriores dan el resultado esperado y el puerto queda libre.
- [ ] **T13** · Cierre: `pytest` completo en verde, cada `CA-01` a `CA-17` con su test o su verificación hecha, y resumen para ti de lo que tienes que revisar. Marcar la spec como implementada.
  - *Cubre:* todos.
  - *Hecha cuando:* tú lo pruebas y lo das por bueno (`AGENTS.md` §7).

---

## Trazabilidad

| CA | Tareas |
| --- | --- |
| CA-01, CA-03 | T01, T02 |
| CA-02, CA-04 | T01, T02, T05, T06 |
| CA-05 | T01, T02, T05, T06, T08 |
| CA-06 | T05, T06, T12 |
| CA-07 | T05, T06 |
| CA-08 | T03, T04, T05, T06, T11, T12 |
| CA-09 | T03, T04, T11, T12 |
| CA-10 | T05, T06, T12 |
| CA-11 | T05, T06, T12 |
| CA-12 | T05, T06, T11 |
| CA-13 | T07 |
| CA-14 | T05, T06, T08, T12 |
| CA-15 | T03, T04, T07 |
| CA-16 | T07 |
| CA-17 | T09, T10 |
