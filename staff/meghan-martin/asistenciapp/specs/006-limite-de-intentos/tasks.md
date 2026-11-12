# Tareas 006 · Límite de intentos al pasar lista

> Estado: **Terminado** (2026-10-25) · Plan: [plan.md](plan.md) aprobado el 2026-10-25 · Creada: 2026-10-25

Se hacen en orden. Primero el test de esa tarea, después el código. `static/` y `asistencia/domain/codes.py` no se tocan.

---

- [x] **T01** · Crear `tests/test_attempts.py`.
  - 5 en el segundo y 20 en el minuto no se pasan.
  - 6 en el segundo, o 21 en el minuto, sí.
  - *Cubre:* CA-01.
  - *Hecha cuando:* `pytest tests/test_attempts.py` falla porque `asistencia.domain.attempts` todavía no existe.

- [x] **T02** · Crear `asistencia/domain/attempts.py`.
  - `over_limit` compara con 5 y con 20.
  - `Banned` lleva el aviso: «Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista.»
  - No importa Flask ni abre el fichero. Cada función dice qué recibe, qué devuelve y un ejemplo.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* `pytest tests/test_attempts.py` pasa.

- [x] **T03** · Crear `tests/test_blocklist.py` contra el almacén, con un fichero temporal.
  - Anotar un intento y contarlo dentro del último segundo y del último minuto.
  - Un intento de hace más de 60 segundos no cuenta, y al limpiar se quita.
  - Bloquear una dirección, cerrar y volver a abrir el mismo fichero: sigue bloqueada.
  - `checkins` no tiene una columna de dirección.
  - *Cubre:* CA-04, CA-06, CA-09.
  - *Hecha cuando:* `pytest tests/test_blocklist.py` falla porque el almacén todavía no tiene esas operaciones.

- [x] **T04** · En `asistencia/storage/sqlite.py`, crear `checkin_attempts` y `blocked_computers`.
  - Anota un intento, cuenta los de una dirección desde un instante, borra los de hace más de 60 segundos, lee si una dirección está bloqueada y la bloquea.
  - No decide si el tope se ha pasado. No hay forma de quitar un bloqueo.
  - *Cubre:* CA-04, CA-06, CA-09.
  - *Hecha cuando:* `pytest tests/test_blocklist.py` pasa y `checkins` sigue sin columna de dirección.

- [x] **T05** · Crear `tests/test_rate_limit.py` con el cliente de la API y el reloj fijo.
  - Cinco códigos malos en el mismo instante responden como código malo. El sexto responde con el aviso y no apunta a nadie.
  - Veinte intentos separados, sin 6 en el mismo segundo, no bloquean. El veintiuno sí.
  - Un intento con el código vigente, sin llegar al tope, apunta como ahora.
  - Muchas lecturas de la lista y de la página, desde la misma dirección, no bloquean un registro posterior.
  - Con la dirección ya bloqueada, el código vigente responde con el aviso.
  - Tras el bloqueo, otra app abierta con el mismo fichero sigue respondiendo el aviso a esa dirección.
  - El cuerpo y las cabeceras traen otra dirección. El bloqueo queda en la dirección de la conexión. Esa otra dirección todavía puede apuntarse.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_rate_limit.py` falla porque pasar lista todavía no cuenta la dirección.

- [x] **T06** · En `check_in` de `asistencia/usecases/attendance.py`, recibir la dirección.
  - Si ya está bloqueada, lanza `Banned` y no apunta a nadie.
  - Si no, anota el intento. Si `over_limit` lo dice, la bloquea y lanza `Banned`.
  - Si no se pasa, el registro sigue como ahora.
  - *Cubre:* CA-01, CA-02, CA-04, CA-05.
  - *Hecha cuando:* la acción pide la dirección y los tests anteriores a T05 siguen en verde.

- [x] **T07** · En `app.py`, pasar la dirección contada a `check_in` y responder 429 cuando salta `Banned`.
  - `ProxyFix` sigue sin fiarse de `X-Forwarded-For`. No se lee la dirección del cuerpo. `CF-Connecting-IP` solo cuenta con `--tunel`. `app.py` no abre el fichero.
  - *Cubre:* CA-01, CA-03, CA-04, CA-05, CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_rate_limit.py` pasa.

- [x] **T08** · Enmendar `docs/CONSTITUTION.md` a 3.0.
  - P4 permite recordar la dirección de la conexión solo para contar los intentos y para la lista de bloqueo. No forma parte del registro. El nombre, la hora y el fichero local siguen.
  - El historial gana la fila del 2026-10-25. No entran el 5, el 20, el aviso ni que la lista dura para siempre.
  - *Cubre:* CA-09.
  - *Hecha cuando:* el encabezado de la constitución dice 3.0.

- [x] **T09** · En `docs/ARCHITECTURE.md`, añadir la fila de `asistencia/domain/attempts.py`.
  - Dice que decide si los intentos de una dirección se han pasado, y que no abre el fichero ni dibuja la página.
  - *Cubre:* CA-09.
  - *Hecha cuando:* esa fila está en la tabla de archivos.

- [x] **T10** · En `README.md`, explicar el bloqueo y corregir la privacidad.
  - Junto al registro por navegador: 5 intentos por segundo, 20 por minuto, bloqueo que se queda, sin forma de quitar la dirección, y el código no cambia.
  - En privacidad: la dirección se recuerda solo para ese recuento y para la lista, en el fichero local, y no junto al nombre ni a la hora.
  - *Cubre:* CA-06, CA-08, CA-09.
  - *Hecha cuando:* el README dice eso y ya no dice que no se guarda ninguna dirección.

- [x] **T11** · Lanzar `pytest` desde `staff/meghan-martin/asistenciapp/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - *Hecha cuando:* la suite termina en verde, incluidos `tests/test_codes.py` y los tests nuevos.
