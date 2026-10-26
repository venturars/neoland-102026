# Tareas 005 · Dominio, acciones, almacenamiento y entrada

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) v1.3 · Creado: 2026-10-23

Las tareas de la versión 1.1 ya están hechas. Esta lista es solo la ampliación. Se hacen en orden, una cada vez, y al terminar se marcan `[x]`.

Hasta T10, las pruebas de pasar lista que ya existen tienen que seguir pasando. Los módulos viejos se borran cuando ya no los importa nadie.

---

## Fase A · Tests que fallan

- [x] **T01** · Reescribir `tests/test_layout.py` con `ast`.
  - Comprueba el árbol de CA-01 y que no existen `rules.py`, `teacher.py`, `student.py`, `db.py`, `http.py`, `asistencia/codes.py` ni `asistencia/names.py`.
  - Lee las importaciones de verdad. El dominio no importa Flask, `sqlite3`, `storage` ni `usecases`. `attendance.py` no importa Flask ni `sqlite3`. `sqlite.py` no importa Flask ni el dominio. `app.py` no importa `sqlite3` ni `storage`.
  - Comprueba que `attendance.py` define las nueve acciones del plan §2.4.
  - *Cubre:* CA-01, CA-06, CA-07, CA-08, CA-10, CA-11, CA-14, CA-16, CA-18, CA-27.
  - *Hecha cuando:* el test existe y falla porque esa estructura todavía no está.

- [x] **T02** · Crear `tests/test_attendance.py`.
  - Con una ruta temporal y sin Flask, llama a preparar, ver la clase, registrar, repetir el registro, rechazar un código, rechazar una clase cerrada, rechazar una clase inexistente, cerrar, quitar y exportar.
  - El reloj es el `FakeClock` que ya existe, o uno igual de inyectable.
  - *Cubre:* CA-05, CA-09, CA-10, CA-19.
  - *Hecha cuando:* el test existe y falla al importar `asistencia.usecases.attendance`.

## Fase B · Dominio

- [x] **T03** · Mover los códigos a `asistencia/domain/codes.py`.
  - El comportamiento no cambia. Se actualizan `tests/test_codes.py` y quien aún importe `asistencia.codes`.
  - `__init__.py` de `domain/` vacío.
  - La función pública documenta parámetros, resultado y errores, con tipos.
  - *Cubre:* CA-03, CA-21.
  - *Hecha cuando:* `tests/test_codes.py` pasa desde la ruta nueva y la suite actual sigue pasando.

- [x] **T04** · Mover los nombres a `asistencia/domain/names.py`.
  - `clean_name` sigue lanzando `ValueError` con los mensajes actuales. Se actualizan `tests/test_names.py` y quien aún importe `asistencia.names`.
  - *Cubre:* CA-03, CA-21.
  - *Hecha cuando:* `tests/test_names.py` pasa desde la ruta nueva y la suite actual sigue pasando.

- [x] **T05** · Crear `asistencia/domain/session.py`.
  - `require_session`, `require_open` y `require_code`, con `SessionNotFound`, `SessionClosed` e `InvalidCode`.
  - Reciben datos ya cargados. No abren base ni importan Flask.
  - No hay funciones que solo renombren `code_for`, `seconds_left` o `name_key`.
  - *Cubre:* CA-04, CA-05, CA-06, CA-07.
  - *Hecha cuando:* esas tres funciones lanzan el error que les corresponde y la suite actual sigue pasando.

## Fase C · Almacenamiento y acciones

- [x] **T06** · Crear `asistencia/storage/sqlite.py`.
  - Pasa aquí el esquema y las consultas de `db.py`. Cada función pública recibe la ruta, abre, activa las claves foráneas y cierra en `finally`.
  - `prepare` crea las tablas si faltan y devuelve el token. No hay `DROP` ni borrado del archivo.
  - `__init__.py` de `storage/` vacío. `db.py` sigue hasta que nadie lo importe.
  - *Cubre:* CA-12, CA-13.
  - *Hecha cuando:* una base temporal se crea, se lee y se cierra, y un archivo que ya tenía filas no se vacía. La suite actual sigue pasando.

- [x] **T07** · Crear `asistencia/usecases/attendance.py`.
  - Las nueve acciones del plan §2.4. Registran por dentro: existe, abierta, nombre, código, y solo entonces guarda.
  - Devuelve el registro y si se creó. `remove_checkin` lanza `CheckinNotFound`. `export_csv` usa `to_csv` con filas ya cargadas.
  - No importa Flask ni `sqlite3`. `__init__.py` de `usecases/` vacío.
  - *Cubre:* CA-08, CA-09, CA-10, CA-19.
  - *Hecha cuando:* `tests/test_attendance.py` pasa y la suite actual sigue pasando.

## Fase D · Entrada

- [x] **T08** · Dejar las rutas en `app.py`.
  - `create_app(db_path, token, now)` llama a `prepare`, registra las mismas rutas y traduce los errores a los HTTP y mensajes del plan §2.5.
  - Los nombres `openedAt`, `closedAt`, `checkedAt`, `secondsLeft` y `studentUrl` se arman aquí.
  - Se quitan `g` y el uso de `http.register`. El puerto y el túnel se quedan. La ruta por defecto sigue siendo `data/asistencia.db` junto a `app.py`, y al arrancar se crea la carpeta.
  - *Cubre:* CA-02, CA-15, CA-16, CA-17.
  - *Hecha cuando:* `tests/test_api.py` pasa igual que antes.

- [x] **T09** · Retirar los módulos que ya no tienen quien los importe.
  - Se borran `rules.py`, `teacher.py`, `student.py`, `db.py`, `http.py`, `asistencia/codes.py` y `asistencia/names.py`.
  - No queda ninguna importación a esas rutas.
  - *Cubre:* CA-01, CA-07, CA-11, CA-14, CA-18.
  - *Hecha cuando:* esos archivos no existen y `pytest` de la suite actual, más `test_attendance.py`, pasa. `test_layout.py` puede seguir en rojo solo por la documentación.

## Fase E · Documentación

- [x] **T10** · Actualizar `docs/ARCHITECTURE.md`.
  - Explica dominio, acciones, almacenamiento, entrada, la dirección de las dependencias y el recorrido de un registro.
  - Deja escritos los tres fallos de CA-29, como pendientes de otra spec, sin decir que estén corregidos.
  - *Cubre:* CA-22, CA-29.
  - *Hecha cuando:* se leen esas cuatro partes y los tres fallos.

- [x] **T11** · Actualizar `AGENTS.md`.
  - El árbol coincide con CA-01. §8 recoge las normas de escritura del plan §2.6, sin añadir una herramienta.
  - La tabla de estado muestra esta ampliación. La búsqueda de specs sigue limitada a esta aplicación.
  - No se cambia `docs/CONSTITUTION.md` ni el significado de las specs 001 a 004. Los enlaces activos del README siguen resolviendo.
  - *Cubre:* CA-20, CA-23, CA-24, CA-25.
  - *Hecha cuando:* se leen el árbol, las normas y la fila de estado, y la constitución no tiene diff.

## Fase F · Cierre

- [x] **T12** · Comprobar el conjunto.
  - `pytest` pasa, incluido `test_layout.py`.
  - `requirements.txt` no ha cambiado.
  - No quedan importaciones a los módulos retirados.
  - Los tres fallos de CA-29 siguen solo documentados.
  - *Cubre:* CA-26, CA-27, CA-28, CA-29.
  - *Hecha cuando:* se cumplen esas cuatro comprobaciones.

## Fase G · Correcciones

- [x] **T13** · Quitar el azar de `tests/test_attendance.py`.
  - El código inválido es `no-es-un-codigo`.
  - La caducidad fija el secreto y busca un instante en el que ese código ya no vale 60 segundos después.
  - La hora exportada se compara con el ISO UTC de milisegundos del reloj.
  - *Cubre:* CA-30, CA-31, CA-32.
  - *Hecha cuando:* esas tres comprobaciones fallarían si el valor fuera otro, y `domain/codes.py` no cambia.

- [x] **T14** · Completar el detector de `tests/test_layout.py` y los tipos públicos.
  - Ve import directo, `from`, alias y relativo. `from asistencia import storage` cuenta como almacenamiento.
  - Hay un test del detector con ejemplos, no con archivos nuevos de la app.
  - `create_app`, las acciones públicas y `to_csv` anotan ruta, token, reloj, filas y zona horaria.
  - *Cubre:* CA-33, CA-34.
  - *Hecha cuando:* el test del detector pasa y las firmas siguen aceptando las llamadas actuales.

- [x] **T15** · Añadir la fila de `003-aclarar-instrucciones-arranque` en `AGENTS.md`.
  - Implementada el 2026-10-23. T01–T03 hechas en el README, sin cambio de requisitos.
  - La tabla muestra 001, 002, 003, 004 y 005.
  - *Cubre:* CA-35.
  - *Hecha cuando:* la fila repite esos documentos y no añade otra comprobación.
