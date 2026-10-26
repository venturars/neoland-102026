# Tareas 006 · Límite por IP pública

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23 · Aprobado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test. Después el código de esa tarea. `static/` y `asistencia/domain/codes.py` no se tocan.

---

## Fase A · La regla

- [x] **T01** · Crear `tests/test_attempts.py`.
  - 5 intentos en el segundo y 20 en el minuto no se pasan.
  - 6 en el segundo, o 21 en el minuto, sí.
  - _Cubre:_ CA-01.
  - _Hecha cuando:_ `pytest tests/test_attempts.py` falla porque `asistencia.domain.attempts` todavía no existe.

- [x] **T02** · Crear `asistencia/domain/attempts.py`.
  - `over_limit(en_el_segundo, en_el_minuto)` compara con 5 y con 20.
  - `Banned` lleva el aviso: «Esta dirección queda bloqueada por haber superado los intentos permitidos.»
  - No importa Flask ni `sqlite3`. Las funciones públicas llevan tipos, `:param`, `:return`, `:rtype` y `Usage::`.
  - _Cubre:_ CA-01, CA-04.
  - _Hecha cuando:_ `pytest tests/test_attempts.py` pasa.

## Fase B · El archivo

- [x] **T03** · Crear `tests/test_blocklist.py` contra el almacén, con un archivo temporal.
  - Anotar un intento y contarlo dentro del último segundo y del último minuto.
  - Un intento de hace más de 60 segundos no cuenta, y la poda lo quita.
  - Bloquear una IP, cerrar la conexión y volver a abrir el mismo archivo: sigue bloqueada.
  - `checkins` no tiene una columna de IP.
  - _Cubre:_ CA-04, CA-06, CA-09.
  - _Hecha cuando:_ `pytest tests/test_blocklist.py` falla porque el almacén todavía no tiene esas operaciones.

- [x] **T04** · En `asistencia/storage/sqlite.py`, crear `registration_attempts` y `blocked_ips`.
  - Anota un intento, cuenta los de una IP desde una hora, borra los de más de 60 segundos, lee si una IP está bloqueada y la bloquea.
  - No importa Flask ni las reglas. No decide si el máximo se ha pasado. No hay forma de borrar una IP bloqueada.
  - _Cubre:_ CA-04, CA-06, CA-09.
  - _Hecha cuando:_ `pytest tests/test_blocklist.py` pasa y `checkins` sigue sin columna de IP.

## Fase C · El registro

- [x] **T05** · Crear `tests/test_rate_limit.py` con el cliente de la API y el reloj fijo.
  - Cinco códigos malos en el mismo instante responden 422. El sexto responde 429 con el aviso y no crea un registro.
  - Veinte intentos separados, sin 6 en el mismo segundo, siguen sin ban. El veintiuno responde 429.
  - Un intento con el código vigente, sin llegar al máximo, responde 201.
  - Muchas lecturas de la lista y de la ficha pública, desde la misma IP, no bloquean un registro posterior.
  - Con la IP ya bloqueada, el código vigente responde 429.
  - Tras el bloqueo, otra app abierta con el mismo archivo sigue respondiendo 429 a esa IP.
  - El cuerpo trae `ip` y las cabeceras traen `X-Forwarded-For` y `CF-Connecting-IP` con otra dirección. El bloqueo queda en `REMOTE_ADDR`. Esa otra dirección todavía puede registrarse.
  - _Cubre:_ CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07.
  - _Hecha cuando:_ `pytest tests/test_rate_limit.py` falla porque el registro todavía no cuenta la IP.

- [x] **T06** · En `check_in` de `asistencia/usecases/attendance.py`, recibir la IP.
  - Si ya está bloqueada, lanza `Banned` y no registra.
  - Si no, anota el intento. Si `over_limit` lo dice, la bloquea y lanza `Banned`.
  - Si no se pasa, el registro sigue como ahora.
  - _Cubre:_ CA-01, CA-02, CA-04, CA-05.
  - _Hecha cuando:_ la acción pide la IP y la suite anterior a T05 sigue en verde.

- [x] **T07** · En `app.py`, pasar `request.remote_addr` a `check_in` y responder 429 cuando salta `Banned`.
  - `ProxyFix` sigue sin `x_for`. No se lee la IP del cuerpo ni de una cabecera. `app.py` no abre la base.
  - _Cubre:_ CA-01, CA-03, CA-04, CA-05, CA-06, CA-07.
  - _Hecha cuando:_ `pytest tests/test_rate_limit.py` pasa.

## Fase D · Los documentos

- [x] **T08** · Enmendar `docs/CONSTITUTION.md` a 3.0.
  - P4 permite recordar la IP pública estática solo para contar los intentos de registrarse y para la lista de bloqueo. No forma parte del registro del alumno. El nombre, la hora y el archivo local siguen.
  - El historial gana la fila del 2026-10-23. No entran el 5, el 20, el aviso ni que la lista dura para siempre.
  - `tests/test_architecture.py` busca la versión vigente `3.0` y la frase de la excepción, no un «2.3» suelto en el historial.
  - _Cubre:_ CA-09.
  - _Hecha cuando:_ `pytest tests/test_architecture.py` pasa y el encabezado de la constitución dice 3.0.

- [x] **T09** · En `docs/ARCHITECTURE.md`, añadir la fila de `asistencia/domain/attempts.py`.
  - Dice que decide si los intentos de una IP se han pasado, y que no abre la base ni dibuja pantallas.
  - _Cubre:_ CA-09.
  - _Hecha cuando:_ esa fila está en la tabla de archivos.

- [x] **T10** · En `README.md`, explicar el bloqueo y corregir la privacidad.
  - Junto a «Un registro por navegador»: 5 intentos por segundo, 20 por minuto, bloqueo para siempre, sin forma de quitar la IP, y el código no cambia.
  - En «Privacidad»: la IP se recuerda solo para ese recuento y para la lista, en el archivo local, y no junto al nombre ni a la hora.
  - _Cubre:_ CA-06, CA-08, CA-09.
  - _Hecha cuando:_ el README dice eso y ya no dice que no se guarda ninguna IP.

## Fase E · Cerrar

- [x] **T11** · Lanzar `pytest` desde `staff/ventura-rodriguez/asistenciapp/`.
  - _Cubre:_ CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - _Hecha cuando:_ la suite termina en verde, incluidos `tests/test_codes.py` y los tests nuevos.
