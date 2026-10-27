# Plan técnico 005 · Dominio, acciones, almacenamiento y entrada

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-23

Este documento sustituye al plan de la versión 1.1, que ya está hecha. Explica **cómo** se cumple la ampliación. Cada decisión indica qué criterios (`CA-xx`) cubre. Pasar lista sigue igual. No se añade ninguna dependencia y no se enmienda la constitución.

---

## 1. Visión general

Hoy las reglas están en `rules.py`, las acciones en `teacher.py` y `student.py`, la base en `db.py` y las rutas en `http.py`. Las rutas comprueban si la clase existe antes de llamar a la acción, y el registro devuelve palabras (`closed`, `bad_code`).

Se dejan cuatro responsabilidades. Las dependencias van hacia dentro: la entrada llama a las acciones, las acciones llaman al dominio y al almacenamiento, y el dominio no llama a nadie de fuera.

```text
app.py
  → usecases/attendance.py
      → domain/codes.py, domain/names.py, domain/session.py
      → storage/sqlite.py
      → export.py
```

`tunnel.py` lo usa solo el arranque. `static/` no se reescribe.

---

## 2. Decisiones

### 2.1 Módulos que se mueven o se retiran (CA-01, CA-03, CA-07, CA-11, CA-14, CA-18)

| Ahora | Después |
| --- | --- |
| `asistencia/codes.py` | `asistencia/domain/codes.py` |
| `asistencia/names.py` | `asistencia/domain/names.py` |
| `asistencia/rules.py` | se elimina; sus comprobaciones pasan a `domain/session.py` sin funciones que solo renombren |
| `asistencia/teacher.py` y `asistencia/student.py` | se eliminan; sus acciones pasan a `usecases/attendance.py` |
| `asistencia/db.py` | `asistencia/storage/sqlite.py` |
| `asistencia/http.py` | se elimina; las rutas pasan a `app.py` |
| `asistencia/export.py` y `asistencia/tunnel.py` | se quedan |

Se crean los `__init__.py` vacíos de `domain/`, `usecases/` y `storage/`. El de `asistencia/` sigue vacío.

### 2.2 Dominio (CA-04, CA-05, CA-06)

`domain/codes.py` y `domain/names.py` conservan el cálculo del código, la ventana de 30 segundos, `clean_name` y `name_key`. Un nombre vacío o largo sigue lanzando `ValueError` con el mensaje actual (`Escribe tu nombre.` o el del máximo de 60).

`domain/session.py` recibe datos ya cargados. No abre nada.

| Error | Cuándo |
| --- | --- |
| `SessionNotFound` | La clase cargada no está (`None`) |
| `SessionClosed` | `closed_at` tiene valor |
| `InvalidCode` | El código no es el vigente ni el de la ventana anterior |

Tres funciones, una por comprobación: `require_session`, `require_open`, `require_code`. `require_code` usa `is_valid_code` de `domain/codes.py`. No se envuelve `code_for`, `seconds_left` ni `name_key` con otro nombre.

El paquete `domain` no importa Flask, `sqlite3`, `storage` ni `usecases`.

### 2.3 Almacenamiento (CA-02, CA-12, CA-13, CA-19)

`storage/sqlite.py` guarda el esquema actual, con `CREATE TABLE IF NOT EXISTS`. No hay `DROP` ni borrado del archivo. Una base que ya existe se sigue leyendo.

Cada función pública recibe la ruta, abre la conexión, activa las claves foráneas y la cierra en `finally`, también si hay una excepción. Las consultas siguen con `?`. El duplicado sigue siendo `UNIQUE (session_id, name_key)` y `ON CONFLICT DO NOTHING`.

Funciones públicas: `prepare`, `get_session`, `list_sessions`, `create_session`, `close_session`, `add_checkin`, `list_checkins`, `remove_checkin`.

`prepare` crea las tablas si faltan y devuelve el token del profesor, creándolo si no estaba. No valida nombres ni códigos y no importa el dominio ni Flask.

`export.to_csv` sigue recibiendo filas con `name` y `checked_at`. No abre la base. El CSV conserva BOM, separador `;`, orden, tildes y el apóstrofo delante de `=`, `+`, `-` y `@`.

La ruta por defecto sigue siendo `Path(__file__).parent / "data" / "asistencia.db"` desde `app.py`. Al arrancar se hace `mkdir` de esa carpeta. `storage/` no contiene el archivo. `*.db`, `.venv/`, `__pycache__/` y `.pytest_cache/` ya están en el `.gitignore` del repositorio; no se añade otro mecanismo.

### 2.4 Acciones (CA-08, CA-09, CA-10)

`usecases/attendance.py` recibe la ruta y un reloj `now` invocable, el mismo que ya usan los tests. No importa Flask ni `sqlite3`. No usa `request`, `jsonify`, `Response` ni `g`. No recibe una conexión.

| Acción | Qué coordina | Qué devuelve o lanza |
| --- | --- | --- |
| `prepare` | `storage.prepare` | El token |
| `public_info` | Carga la clase y `require_session` | `title` y si está abierta |
| `check_in` | Existe, está abierta, `clean_name`, `require_code`, y entonces guarda | El registro (`name`, `checked_at`) y si se creó |
| `list_classes` | `storage.list_sessions` | Filas con `opened_at` y `closed_at` |
| `open_class` | Título vacío → fecha local; crea la clase | `id` y `title` |
| `teacher_detail` | Existe, lista registros, código solo si está abierta | Datos internos, sin URL pública y sin `openedAt` |
| `close_class` | Existe y cierra | Nada |
| `remove_checkin` | Existe y borra esa fila | `CheckinNotFound` si no estaba en esa clase |
| `export_csv` | Existe, carga filas y llama a `to_csv` | El texto CSV y `opened_at`, para que la entrada arme el nombre del archivo |

`CheckinNotFound` vive en este módulo. No es una regla de clase: es que esa fila no pertenece a esa clase. El orden de `check_in` es el de hoy: no existe, cerrada, nombre, código, y solo entonces se guarda.

### 2.5 Entrada (CA-15, CA-16, CA-17, CA-26)

`create_app(db_path, token, now)` sigue en `app.py`. Siempre llama a `prepare` para asegurar las tablas. Si el test pasa `token`, ese valor es el de la aplicación; si no, se usa el que devuelve `prepare`.

`app.py` crea Flask, aplica `ProxyFix`, registra las mismas rutas y el mismo token del profesor. Lee el JSON, llama a la acción y traduce:

| Situación | HTTP | Mensaje, el de ahora |
| --- | --- | --- |
| `SessionNotFound` | 404 | Esta clase no existe. Revisa el enlace. |
| `SessionClosed` | 409 | La asistencia de esta clase ya está cerrada. |
| `InvalidCode` | 422 | El código no es válido o ha caducado. Pide el código actual al profesor. |
| `ValueError` del nombre | 400 | El texto de esa excepción |
| `CheckinNotFound` | 404 | Ese registro no existe en esta clase. |
| Registro nuevo | 201 | `name`, `checkedAt` |
| Registro repetido | 200 | `already`, `name`, `checkedAt` |

Los nombres `openedAt`, `closedAt`, `checkedAt`, `secondsLeft` y `studentUrl` se construyen aquí. `studentUrl` usa `request.host_url`. El arranque, el puerto y el túnel se quedan en `main`. `app.py` no importa `sqlite3` ni `storage`.

### 2.6 Escritura y documentación (CA-20, CA-21, CA-22, CA-23, CA-24, CA-25)

En el código público de dominio, acciones, almacenamiento, exportación y entrada, cada módulo dice su responsabilidad y cada función pública documenta parámetros, resultado y errores con `:param`, `:return`, `:rtype` y `:raises`. Lleva `Usage::` cuando un ejemplo corto ayude. Hay tipos en parámetros y resultados. No se añaden clases de más: los tres errores del dominio y `CheckinNotFound` son excepciones, que es el mecanismo que pide la spec.

`AGENTS.md` §3 muestra el árbol nuevo. §8 sustituye las cuatro frases sueltas por estas normas, sin instalar un linter. §7 deja la fila de esta spec en la ampliación, no como si el corte 1.1 fuera el final. La búsqueda de specs sigue en `staff/maria-osipuk/asistenciapp/specs/`.

`docs/ARCHITECTURE.md` explica las cuatro partes, la flecha de dependencias y el camino de un registro: navegador → `app.py` → `check_in` → reglas y `storage`. También deja escritos los tres fallos de CA-29, como pendientes de otra spec.

El README ya enlaza `docs/CONSTITUTION.md` y `docs/ARCHITECTURE.md`. No se reescriben los antecedentes de las specs 001 a 004.

La constitución permanece en 2.2.

### 2.7 Pruebas (CA-26, CA-27, CA-28, CA-29)

| Prueba | Cambio |
| --- | --- |
| `tests/test_codes.py` | Importa `asistencia.domain.codes` |
| `tests/test_names.py` | Importa `asistencia.domain.names` |
| `tests/test_api.py`, `tests/conftest.py`, `tests/test_port.py`, `tests/test_tunnel.py`, `tests/test_export.py` | Siguen igual de comportamiento. `create_app` no cambia de firma |
| `tests/test_layout.py` | Pasa a leer el árbol sintáctico con `ast`. Comprueba las dependencias prohibidas y que los módulos viejos no existen |
| `tests/test_attendance.py` | Llama a `check_in`, `public_info`, `close_class`, `remove_checkin` y `export_csv` con una ruta temporal, sin Flask |

No se añade un test que «arregle» estos tres casos, ni se cambia el código para que dejen de fallar:

- Un JSON que es una lista.
- Un nombre que es un número.
- Un código con cifras de ancho completo, como `１２３４`.

Siguen provocando un error genérico del servidor. La arquitectura los nombra. La suite actual no los cubre y no se va a presentar como si los cubriera.

### 2.8 Qué no cambia (CA-28)

URL, pantallas, mensajes, esquema y `requirements.txt`. No hay límite por dirección de red.

---

## 3. Comprobación

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-07, CA-11, CA-14, CA-18 | El árbol del §2.1 existe y los módulos retirados no están. Lo cubre `test_layout.py` |
| CA-02 | La ruta por defecto acaba en `data/asistencia.db` y `storage/` no tiene un `.db`. `git check-ignore` acepta un `*.db` |
| CA-03, CA-04, CA-06 | `test_codes.py`, `test_names.py` y el `ast` del dominio |
| CA-05, CA-09, CA-10, CA-17 | `test_attendance.py` sin Flask, y `test_api.py` para la traducción HTTP |
| CA-08 | Lectura de los nombres de función de `attendance.py` en `test_layout.py` |
| CA-12, CA-13, CA-19 | `test_api.py` y `test_export.py`. El `ast` impide que `sqlite.py` importe el dominio o Flask |
| CA-15, CA-16 | `create_app` sigue en `app.py`. El `ast` impide `sqlite3` en `app.py` |
| CA-20, CA-21 | Lectura de `AGENTS.md` §8 y de un docstring público con `:param` y `:raises` |
| CA-22, CA-23, CA-24 | `ARCHITECTURE.md`, el árbol de `AGENTS.md` y los enlaces del README |
| CA-25 | `git diff` no toca `docs/CONSTITUTION.md` |
| CA-26, CA-27, CA-28 | `pytest` entero. `requirements.txt` no cambia |
| CA-29 | Los tres fallos están en `docs/ARCHITECTURE.md` y no hay un test que los dé por buenos |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Cuatro carpetas y las excepciones que la spec pide. No hay interfaces ni capas de más |
| P3 Dependencias mínimas | Sí | Siguen Flask, pytest y la biblioteca estándar, `ast` incluido |
| P4 Privacidad | Sí | Se siguen guardando solo el nombre y la hora, en local. No se guarda una dirección de red |
| P5 Accesible y móvil | Sí | `static/` no se reescribe |
| P6 Español | Sí | Mensajes, spec, plan y arquitectura siguen en español. Los nombres de función pueden ir en inglés |
| §5 Calidad | Sí | Cada CA de la tabla del §3 tiene test o un paso de lectura. `pytest` tiene que pasar |
| §6 Seguridad | Sí | El token, la caducidad, el registro único y la clase cerrada siguen. La validación ocurre en la acción, antes de guardar |
| §7 Alcance | Sí | Todo queda dentro de `staff/maria-osipuk/asistenciapp/` |

---

## 5. Decisiones tomadas

1. **La 1.1 no se deshace en la documentación histórica** (2026-10-23): las specs 001 a 004 se quedan. Este plan solo cambia el código y los documentos vivos.
2. **Los errores de clase viven en el dominio** (2026-10-23): `SessionNotFound`, `SessionClosed` e `InvalidCode`. El nombre malo sigue siendo `ValueError`, porque ese mensaje ya existe y los tests lo esperan.
3. **La fila ausente no es una regla de clase** (2026-10-23): `CheckinNotFound` lo lanza la acción de quitar.
4. **La conexión no sale del almacenamiento** (2026-10-23): la acción pasa la ruta. `prepare` usa `CREATE TABLE IF NOT EXISTS` y no borra datos.
5. **Los tres fallos se nombran y no se tapan** (2026-10-23): no se añade un `isinstance` para que la suite parezca más verde.
6. **Sin enmienda** (2026-10-23): la constitución 2.2 ya deja la base en `data/` y no nombra los módulos que se retiran.

## 6. Correcciones posteriores (spec v1.6)

No cambian la arquitectura. Cubren CA-30 a CA-35.

- El código rechazado en `test_attendance.py` es `no-es-un-codigo`, que el generador no puede producir. La caducidad usa el secreto fijo `b"secreto-fijo-de-la-prueba"` y un instante en el que ese código ya no vale 60 segundos después. No se toca `domain/codes.py`.
- La hora de apertura exportada se compara con el ISO UTC de milisegundos del reloj, el mismo formato que `_checked_at`.
- `modules_in` lee `import`, `from`, el nombre real aunque haya alias, y los relativos. `from asistencia import storage` cuenta como `asistencia.storage`. Un test pequeño prueba esas formas con código de ejemplo, no con archivos de la app.
- `create_app`, las acciones públicas y `to_csv` anotan ruta, token, reloj, filas y zona horaria con tipos de Python. Las llamadas siguen igual.
- La tabla de `AGENTS.md` incluye la spec 003 con el texto de sus documentos: implementada el 2026-10-23, T01–T03 hechas en el README, sin cambio de requisitos.
