# Plan técnico 007 · Listas de grupo para pasar lista

> Estado: **Aprobado v1.1 (2026-10-27)** · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-27

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué requisitos (`RF-n`) y criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

Los grupos y sus alumnos se guardan en dos tablas nuevas de SQLite. Al abrir una sesión con grupo se copia la lista a una tercera tabla (la copia fija). Los registros de siempre (`checkins`) ganan dos columnas: si el alumno es de la lista o **nuevo**, y si el profesor ya decidió sobre él. Los **ausentes** no se guardan: se calculan como la copia menos los registros de la lista.

Las sesiones rápidas no cambian: mismo formulario, mismas rutas, mismo CSV. La única excepción es la de RF-22: quitar un registro libera también ese navegador.

En las sesiones con grupo, el alumno primero valida el código. La app le devuelve la lista y un **pase** firmado que vale 2 minutos; con él se registra sin volver a escribir el código ni gastar otro intento. El pase y el «recibo» que libera el navegador se firman con el secreto de la sesión: **no se guarda nada nuevo** para ellos.

No se añade ninguna dependencia.

```
alumno.js ──código──▶ /unlock ──▶ usecases.unlock ──▶ domain.passes (firma el pase)
                                        └──────────▶ límite por IP (1 intento) + lista de la copia
alumno.js ──pase+nombre──▶ /checkin ──▶ usecases.check_in_group ──▶ domain.roster / names (decide)
profesor.js ──▶ /api/groups… ──▶ usecases.groups ──▶ storage.sqlite (grupos, alumnos, copias)
```

---

## 2. Decisiones

### 2.1 Datos: `asistencia/storage/sqlite.py` (RF-4, RF-9, RF-23, RF-24)

Tablas nuevas en `SCHEMA` (`CREATE TABLE IF NOT EXISTS`):

```sql
CREATE TABLE IF NOT EXISTS groups (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS group_students (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id  TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  name_key  TEXT NOT NULL,
  UNIQUE (group_id, name_key)
);

-- Copia fija de la lista al abrir la sesión (RF-9, RF-23)
CREATE TABLE IF NOT EXISTS session_roster (
  session_id TEXT NOT NULL REFERENCES sessions(id),
  name       TEXT NOT NULL,
  name_key   TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
```

Columnas nuevas en tablas que ya existen. `CREATE TABLE IF NOT EXISTS` no añade columnas a una base ya creada, así que `init_schema` las añade con `ALTER TABLE … ADD COLUMN` si `PRAGMA table_info` dice que faltan. Así la base de una profesora que ya usa la app se actualiza sola al arrancar, sin perder datos (RF-22).

| Tabla | Columna | Para qué |
| --- | --- | --- |
| `sessions` | `group_id TEXT` (sin clave foránea) | El grupo de la sesión. Pasa a `NULL` si el grupo se borra. |
| `sessions` | `group_name TEXT` | Copia del nombre del grupo al abrir (RF-23). `NULL` = sesión rápida. |
| `checkins` | `kind TEXT` | `NULL` en sesiones rápidas; `'listed'` (presente) o `'new'` (nuevo) con grupo. |
| `checkins` | `decided INTEGER NOT NULL DEFAULT 0` | `1` cuando el profesor ya decidió sobre un nuevo (RF-20). |

- **Una sesión es «con grupo» si `group_name` no es `NULL`**, aunque el grupo ya esté borrado (`group_id` a `NULL`). Así RF-20 sabe que no puede ofrecer «Añadir al grupo».
- Las sesiones y registros existentes quedan con `NULL`/`0`: siguen siendo sesiones rápidas (CA-10).
- Nada nuevo guarda IP, emails ni identificadores de navegador (P4).
- Funciones nuevas, cada una con su conexión y sin reglas de negocio: `create_group`, `get_group`, `list_groups`, `rename_group`, `set_group_archived`, `delete_group`, `list_group_students`, `add_group_students`, `rename_group_student`, `remove_group_student`, `count_open_sessions_of_group`, `create_session` (con grupo y copia en una sola transacción), `list_session_roster`, `add_to_session_roster`, `set_checkin_kind`, `set_checkin_decided`.

### 2.2 Reglas nuevas en `domain/` (RF-1, RF-2, RF-7, RF-8b, RF-14)

Solo biblioteca estándar, como pide `docs/ARCHITECTURE.md`.

**`domain/names.py`** (se amplía):
- `MAX_LENGTH` sigue en 60 (spec §5.1).
- `is_similar(a_key, b_key) -> bool` para el «¿Quisiste decir…?» (RF-14). Dos claves son parecidas si no son iguales y:
  - `difflib.SequenceMatcher` da un parecido de 0,8 o más (erratas: «Maria Garcia» / «Mria Garcia»), o
  - coinciden en la primera palabra y una de las demás palabras es la inicial de la otra («ella g» / «ella garcia»).
- `find_similar(key, keys) -> str | None`: el primer parecido.

**`domain/roster.py`** (nuevo): leer y revisar la lista que introduce el profesor.
- `parse_pasted(text) -> list[str]`: un nombre por línea (RF-1a).
- `parse_csv(text) -> list[str]`: quita el BOM, detecta `;` o `,` con `csv.Sniffer` (si solo hay una columna, cada línea es un nombre) y toma la primera columna (RF-1b, CA-18). La primera fila se trata como cabecera si, normalizada, es `nombre`, `nombres`, `name`, `alumno` o `alumnos`.
- `review(names, existing_keys) -> dict`: limpia cada nombre con `clean_name` y devuelve `{"students", "duplicates", "empty", "too_long", "similar"}`. Los duplicados se comparan con la clave de `name_key` y también contra el grupo ya guardado al editar (RF-7). Más de 200 alumnos es un problema más (spec §5.1).
- `can_save(review) -> bool`: `False` si hay duplicados, nombres largos o más de 200 (CA-02). Los parecidos solo avisan.
- Errores del dominio con mensaje en español: `DuplicateName` («Ya hay un alumno que se llama así. Diferéncialo, por ejemplo con la inicial del apellido.»), `SimilarName` (lleva el nombre parecido para «¿Quisiste decir…?»), `NotInRoster`, `NameTaken` («Este nombre ya está registrado.»), `EmptyGroup` («Este grupo todavía no tiene alumnos.»), `GroupFull` («Este grupo ya tiene 200 alumnos», spec §5.1 y RF-20, CA-20), `GroupHasOpenSession`, `GroupArchived`, `GroupGone`.
- `MAX_STUDENTS = 200` y `ensure_room(student_count, adding=1)`: lanza `GroupFull` si el grupo pasaría de 200. La usan la revisión de la lista y «Añadir al grupo».

**`domain/passes.py`** (nuevo): pase de 2 minutos y recibo del registro, firmados con HMAC y el secreto de la sesión, como `codes.py`. No se guardan.
- `PASS_SECONDS = 120`.
- `issue_pass(secret, t) -> str` y `pass_is_valid(secret, token, t) -> bool`: el pase lleva la hora en que se emitió y su firma (RF-11, CA-11).
- `receipt_for(secret, checkin_id) -> str` y `receipt_is_valid(...)`: el navegador lo guarda al registrarse y con él pregunta si su registro sigue existiendo (RF-17, CA-14).
- `PassExpired` con el mensaje «Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor.» (CA-16).

**`domain/session.py`** (se amplía): `ensure_can_open(group, student_count)` (archivado → `GroupArchived`; 0 alumnos → `EmptyGroup`, RF-8b, CA-19), `ensure_can_delete(open_sessions)` (RF-6, CA-09).

### 2.3 Acciones: `usecases/` (todas las RF)

`usecases/attendance.py` ya tiene 245 líneas; la gestión de grupos va en un módulo nuevo **`usecases/groups.py`**, con las mismas normas (recibe `db_path` y el reloj, usa `domain` y `storage`, devuelve diccionarios). `docs/ARCHITECTURE.md` se actualiza para decirlo.

**`usecases/groups.py`**:
- `preview_roster(db_path, text, source, group_id=None)`: `source` es `"paste"` o `"csv"`. Devuelve la revisión sin guardar (RF-2, CA-01, CA-02).
- `create_group(db_path, name, students, now)`, `rename_group`, `add_students`, `rename_student`, `remove_student` (RF-1, RF-3, CA-13). Vuelven a revisar en el servidor: nunca se fían de la vista previa del navegador.
- `list_groups(db_path, archived=False)`: id, nombre, número de alumnos, archivado (RF-4, CA-13).
- `archive_group` / `restore_group`: se puede archivar con una sesión abierta, que sigue funcionando (RF-5, CA-09).
- `delete_group`: `ensure_can_delete`; borra el grupo y sus alumnos y pone `group_id = NULL` en sus sesiones, que conservan `group_name` y su copia (RF-6, RF-23, CA-09).

**`usecases/attendance.py`** (se amplía; las funciones de hoy no cambian de firma):
- `create_session(db_path, title, now, group_id=None)`: sin grupo, como hoy. Con grupo: `ensure_can_open`, guarda `group_id`, `group_name` y la copia de la lista en la misma transacción (RF-8, RF-8b, RF-9).
- `public_session` añade `hasGroup` (sí o no). **Nunca** devuelve nombres (RF-11, CA-03).
- `unlock(db_path, session_id, code, ip, now)` (nuevo): aplica el límite por IP (**cuenta un intento**, reutiliza `_enforce_ip_limit`), comprueba sesión abierta y código, y devuelve el pase y la lista: nombres de la copia, cuáles ya están registrados, y los nuevos ya registrados para el aviso de nombres repetidos (RF-11, RF-12, RF-13).
- `roster_for_pass(db_path, session_id, pass, ip, now)` (nuevo): con un pase válido, vuelve a dar la lista actualizada sin contar intento; la IP bloqueada se sigue rechazando sin contar (`ensure_not_blocked`).
- `check_in_group(db_path, session_id, pass, name, is_new, confirm_similar, ip, now)` (nuevo):
  1. `ensure_not_blocked` (sin contar: el intento ya se contó al validar, CA-11).
  2. Sesión abierta y pase vigente; si no, `PassExpired` (CA-16).
  3. De la lista (`is_new` falso): el nombre tiene que estar en la copia (`NotInRoster`) y no registrado (`NameTaken`) (RF-13, CA-04).
  4. Nuevo: igual a uno de la copia o a otro nuevo de la sesión → `DuplicateName`; parecido y sin `confirm_similar` → `SimilarName` con la sugerencia (RF-14, CA-05, CA-15).
  5. Guarda con `kind` `'listed'` o `'new'` y devuelve el registro con su `id` y su recibo.
- `registration_exists(db_path, session_id, checkin_id, receipt)` (nuevo): con un recibo válido, dice si el registro sigue ahí. Sirve en sesiones rápidas y con grupo (RF-17, RF-22, CA-14).
- `check_in` (sesión rápida) añade `id` y `receipt` a la respuesta **solo cuando crea un registro nuevo** (estado 201). La respuesta «ya estabas registrado» (`already`, estado 200) se queda **exactamente como hoy**, sin campos nuevos, porque `tests/test_api.py` la compara con `==` (`test_duplicate_name_is_not_added_twice`). Si llega un registro sin pase a una sesión con grupo, se rechaza.
- `teacher_view` añade, si hay grupo: `group`, `rosterSize`, `present`, `new`, `absent` y el contador (RF-18, CA-07). Las sesiones rápidas devuelven lo de hoy.
- `decide_new(db_path, session_id, checkin_id, action)` (nuevo), con `action` en `add`, `keep` o `discard` (RF-20, CA-06, CA-12, CA-17):
  - `discard` → como `remove_checkin` (libera el navegador).
  - `keep` → `decided = 1`.
  - `add`, en este orden:
    1. Grupo borrado → `GroupGone`.
    2. El grupo (archivado o no) ya tiene esa clave → **se une** («Ya está en el grupo»): el registro pasa a `'listed'`, toma el nombre del grupo y `decided = 1`. Si ese alumno no estaba en la copia de la sesión, se añade con `add_to_session_roster`. Es la **única** excepción a la copia fija (spec RF-9); ninguna otra acción llama a esa función.
    3. Si no, `ensure_room(alumnos del grupo)` → `GroupFull` si ya tiene 200 (CA-20); el registro sigue como nuevo sin decidir, así que «Dejar solo en esta sesión» y «Descartar» siguen disponibles.
    4. Se añade el alumno al grupo y `decided = 1`.
- `checkins_for_export` devuelve también la copia para calcular los ausentes.

Liberar un nombre (RF-19) es el `remove_checkin` de hoy: no hace falta una acción nueva.

### 2.4 Rutas: `app.py` (sin lógica de negocio)

Alumno (públicas, como hoy):

| Ruta | Acción |
| --- | --- |
| `POST /api/s/<id>/unlock` | `unlock`: `{code}` → `{pass, roster}` |
| `POST /api/s/<id>/roster` | `roster_for_pass`: `{pass}` → `{roster}` |
| `POST /api/s/<id>/checkin` | Sin grupo: `check_in` de hoy. Con grupo: `check_in_group` (`{pass, name, isNew, confirmSimilar}`) |
| `GET /api/s/<id>/checkins/<cid>?r=<recibo>` | `registration_exists` → `{exists}` |

Profesor: todo lo que cuelga de `/api/groups` pasa por el mismo `require_teacher` que `/api/sessions` (CA de la spec 001, acceso del profesor).

| Ruta | Acción |
| --- | --- |
| `GET /api/groups?archived=0\|1` · `POST /api/groups` | listar · crear |
| `POST /api/groups/preview` | vista previa (`{text, source, groupId?}`) |
| `PATCH /api/groups/<gid>` | renombrar, archivar o restaurar |
| `DELETE /api/groups/<gid>` | borrar |
| `GET /api/groups/<gid>/students` · `POST` · `PATCH /<sid>` · `DELETE /<sid>` | alumnos |
| `POST /api/sessions` | acepta `groupId` opcional |
| `POST /api/sessions/<id>/checkins/<cid>/decision` | `decide_new` |

`DOMAIN_ERRORS` añade: `DuplicateName` 409, `SimilarName` 409 (con el campo `suggestion`), `NameTaken` 409, `NotInRoster` 422, `PassExpired` 401, `EmptyGroup` 409, `GroupFull` 409, `GroupHasOpenSession` 409, `GroupArchived` 409, `GroupGone` 410. El manejador genérico se amplía para que `SimilarName` lleve también la sugerencia.

### 2.5 Descarga: `asistencia/export.py` (RF-21, CA-07, CA-18)

- `to_csv` de hoy no cambia: lo siguen usando las sesiones rápidas (CA-10).
- `to_group_csv(group_name, opened_at, rows, tz=None)` (nueva): columnas `Grupo;Fecha;Nombre;Estado;Hora`, una fila por alumno de la copia y una por nuevo. La «Hora» es la del registro para cada presente y cada nuevo; los ausentes la dejan vacía (spec RF-21). Mismo formato que hoy: `;`, UTF-8 con BOM, y el mismo `_safe` (apóstrofo delante de `=`, `+`, `-`, `@`) para **todas** las celdas de texto, también el nombre del grupo.
- `app.py` elige `to_csv` o `to_group_csv` según la sesión.

### 2.6 Panel del profesor: `static/profesor.html` y `profesor.js` (RF-1 a RF-8b, RF-18 a RF-20)

- **Panel:** sección «Grupos» con el listado, el número de alumnos de cada uno, y botones Editar, Archivar y Borrar (con confirmación dentro de la página, como el Quitar de hoy). Enlace «Ver archivados», con Restaurar.
- **Vista nueva «Grupo»** (`#t=…&g=<id>` o `&g=new`): nombre del grupo; un `<textarea>` para pegar nombres y un `<input type="file" accept=".csv,text/csv">` que se lee con `FileReader` y se manda como texto (sin subidas de ficheros ni dependencias); vista previa con el número de alumnos y los problemas marcados; Guardar desactivado mientras haya duplicados (CA-01, CA-02). En un grupo ya guardado: filas con Renombrar y Quitar, y avisos «¿Quisiste decir…?» que no bloquean.
- **Abrir asistencia:** un `<select>` con «Sesión rápida» y los grupos activos. Un grupo vacío muestra el error de CA-19 con los botones «Añadir alumnos» y «Abrir sesión rápida».
- **Sesión con grupo:** «X de N presentes», listas de presentes (con Liberar), nuevos (con Añadir al grupo, Dejar solo aquí y Descartar, que también se ven con la sesión cerrada) y ausentes. «Añadir al grupo» no aparece si el grupo está borrado (CA-17). Encuesta cada 2 s, como hoy.
- Todo texto se pinta con `textContent` (spec 001, CA-12).

### 2.7 Página del alumno: `static/alumno.html` y `alumno.js` (RF-11 a RF-17)

- Si `hasGroup` es falso, el formulario de hoy, sin cambios.
- Con grupo, tres pasos en la misma página:
  1. **Código.** Validado → se guarda el pase en memoria (no en `localStorage`) y empieza la cuenta de 2 minutos.
  2. **Elegir nombre.** Un `<input type="search">` con `<label>` que filtra al escribir (sin acentos ni mayúsculas, con la misma normalización que `name_key`), y debajo una lista de botones. Los ya registrados van atenuados, con `disabled` y el texto «ya registrado» (RF-13). Un botón «No estoy en la lista» abre un campo para escribir el nombre. Si el servidor responde `SimilarName`: «¿Quisiste decir Ella García?», con «Sí, soy Ella García» y «No, seguir como nuevo» (CA-05). Si responde `DuplicateName` o `NameTaken`, se vuelve a pedir la lista y se enseña el mensaje.
  3. **Confirmación:** «✓ Estás dentro, {nombre} – {hora}» (RF-16).
- **Tiempo agotado (CA-16):** a los 2 minutos, o si el servidor responde `PassExpired`, se vuelve al paso 1 con el mensaje del dominio, y el nombre elegido o escrito se guarda en memoria y se recupera al validar el código otra vez.
- **Liberar el navegador (RF-17, RF-22, CA-14):** la marca de `localStorage` guarda también `id` y `receipt`. Al abrir el enlace con una marca, se pregunta a `GET …/checkins/<id>?r=`; si el registro ya no existe, se borra la marca y se enseña el formulario. Las marcas antiguas, sin recibo, se quedan como hoy. Vale para sesiones rápidas y con grupo.
- Móvil a ~400 px, navegable con teclado, con `aria-live` en los mensajes (P5).

### 2.8 Constitución 4.0 (spec §7)

Enmienda propuesta en `docs/CONSTITUTION.md`, que solo apruebas tú, en su propia tarea y antes del código que guarda la lista:

- Cabecera: versión 4.0, enmienda del 2026-10-27.
- P4: se sustituye **solo** la primera regla («Del alumno solo se guarda el nombre que él mismo escribe y la hora del registro») por el texto de la spec §7. El resto de P4 no cambia.
- Historial: fila 4.0 con fecha y motivo (spec 007, issue #539).

### 2.9 Documentación

- `docs/ARCHITECTURE.md`: `roster.py` y `passes.py` en `domain/`; `usecases/groups.py`; las tablas nuevas en `storage/`; filas nuevas en la tabla «Dónde va cada cosa».
- `README.md`: sección «Grupos» (crear, pegar o subir CSV, archivar, borrar), cómo se registra el alumno en una sesión con grupo, la descarga con «Estado», y el cambio de «Un registro por navegador»: si quitas a alguien, **su navegador puede volver a registrarse**.
- `specs/001-checkin-codigo/spec.md`: nota en su historial de que CA-26 cambia por la spec 007 (RF-22). El resto no se toca.
- `AGENTS.md` §8: la fila de la spec 007 cambia de fase.

---

## 3. Archivos

| Archivo | Cambio |
| --- | --- |
| `specs/007-lista-de-alumnos/` | `plan.md`, `tasks.md` |
| `asistencia/domain/names.py` | `is_similar`, `find_similar` |
| `asistencia/domain/roster.py` | **Nuevo** |
| `asistencia/domain/passes.py` | **Nuevo** |
| `asistencia/domain/session.py` | `ensure_can_open`, `ensure_can_delete` |
| `asistencia/storage/sqlite.py` | 3 tablas, 4 columnas con migración, funciones nuevas |
| `asistencia/usecases/groups.py` | **Nuevo** |
| `asistencia/usecases/attendance.py` | `create_session` con grupo, `unlock`, `roster_for_pass`, `check_in_group`, `registration_exists`, `decide_new`; `teacher_view` y `checkins_for_export` ampliadas |
| `asistencia/export.py` | `to_group_csv` |
| `app.py` | Rutas de §2.4 y errores nuevos |
| `static/profesor.html`, `profesor.js`, `alumno.html`, `alumno.js`, `styles.css` | §2.6 y §2.7 |
| `tests/test_roster.py`, `test_passes.py`, `test_session_rules.py`, `test_groups_api.py`, `test_group_checkin_api.py`, `test_group_export.py`, `test_migration.py` | **Nuevos** |
| `tests/test_names.py` | Casos nuevos al final para `is_similar`; los de hoy no se tocan |
| `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md`, `specs/001-checkin-codigo/spec.md` | §2.8 y §2.9 |

`asistencia/domain/codes.py`, `asistencia/domain/rate_limit.py`, `asistencia/tunnel.py` y los tests que ya existen no cambian.

---

## 4. Plan de pruebas

| CA | Cómo se comprueba |
| --- | --- |
| CA-01 | `test_roster.py`: 25 líneas pegadas → 25 alumnos; `test_groups_api.py`: vista previa y guardado |
| CA-02 | `test_roster.py`: «maria garcia» y «María  García» son duplicado; `can_save` falso; la API rechaza guardar |
| CA-03 | `test_group_checkin_api.py`: `GET /api/s/<id>` y `unlock` con código malo no devuelven ningún nombre |
| CA-04 | `test_group_checkin_api.py`: tras registrarse, la lista marca el nombre como registrado y un segundo intento da 409 |
| CA-05 | `test_names.py` («ella g» / «ella garcia»); API: `SimilarName` con sugerencia y, con `confirmSimilar`, registro como nuevo |
| CA-06 | `test_groups_api.py`: `decide_new add` y la siguiente sesión tiene ese nombre en su copia |
| CA-07 | `test_group_export.py`: una fila por alumno de la copia y por nuevo; `Estado` presente, ausente o nuevo; «Hora» en presentes y nuevos, vacía en ausentes |
| CA-08 | `test_groups_api.py`: renombrar en el grupo no cambia la copia ni el CSV de una sesión anterior |
| CA-09 | `test_session_rules.py`: `ensure_can_delete` con y sin sesión abierta; `test_groups_api.py`: borrar con sesión abierta da 409; archivar sí, y la sesión abierta sigue aceptando registros |
| CA-10 | Todos los tests de hoy siguen pasando sin tocarlos; `test_migration.py`: una base con el esquema de hoy se actualiza y sus sesiones se ven y descargan igual |
| CA-11 | `test_group_checkin_api.py`: con reloj de prueba, `unlock` y `checkin` a los 60 s solo apuntan un intento en `ip_attempts` |
| CA-12 | `test_groups_api.py`: cerrar con un nuevo sin decidir; después `add`, `keep` y `discard` funcionan con la sesión cerrada |
| CA-13 | `test_groups_api.py`: listar dos grupos; añadir, renombrar y quitar alumnos y renombrar el grupo |
| CA-14 | `test_group_checkin_api.py`: `registration_exists` pasa de `true` a `false` al liberar; un recibo falso da 404; verificación manual en el navegador |
| CA-15 | `test_group_checkin_api.py`: un segundo nuevo «ella g.» da `DuplicateName` |
| CA-16 | `test_passes.py`: el pase caduca a los 120 s; API: `PassExpired` con el mensaje; verificación manual de que el nombre se conserva |
| CA-17 | `test_groups_api.py`: `add` con grupo archivado funciona, con grupo borrado da 410, y con nombre ya en el grupo une el registro a ese alumno y lo añade a la copia si faltaba; renombrar o añadir alumnos al grupo no cambia la copia |
| CA-18 | `test_roster.py`: CSV con `,`, con `;` y con BOM; `test_group_export.py`: «=SUMA(1)» sale como `'=SUMA(1)` |
| CA-19 | `test_session_rules.py`: `ensure_can_open` con grupo archivado, con 0 alumnos y con un grupo válido; `test_groups_api.py`: abrir sesión con un grupo de 0 alumnos da 409 con el mensaje |
| CA-20 | `test_roster.py`: `ensure_room` con 200; `test_groups_api.py`: `add` con un grupo de 200 da 409 «Este grupo ya tiene 200 alumnos», el grupo sigue con 200, y luego `keep` y `discard` funcionan |

Verificación manual al final: `python app.py`, crear un grupo subiendo un CSV de Excel, abrir sesión, registrarse desde dos navegadores (uno de la lista y uno nuevo), liberar y volver a registrarse, cerrar, decidir sobre el nuevo y abrir el CSV en Excel o Google Sheets. Al terminar, parar la app y comprobar con `lsof -nP -iTCP:8000 -sTCP:LISTEN` que el puerto queda libre (`AGENTS.md` §5).

**Tests de hoy:** no se editan (como en la spec 006). Los nuevos usan su propia base y avanzan el reloj para no tocar el límite por IP.

---

## 5. Comprobación de la constitución

| Regla | Cómo la cumple el plan |
| --- | --- |
| P1 · Independiente de la plataforma | Los grupos son de la app, no de Discord ni de Meet. |
| P2 · Simplicidad | Sin clases ni ORM; diccionarios, funciones y tres tablas. El pase y el recibo son firmas, sin tablas ni caducidades que limpiar. El alumno se registra en menos de 30 s: código, tres letras y un toque. |
| P3 · Dependencias mínimas | Solo biblioteca estándar (`csv`, `difflib`, `hmac`) y el navegador (`FileReader`). Nada nuevo en `requirements.txt`. |
| P4 · Privacidad mínima | **Requiere la enmienda 4.0 (§2.8).** De cada alumno solo se guarda el nombre y, por sesión, la hora y el estado. No se guardan otras columnas del CSV. El pase y el recibo no se guardan. La lista no sale sin código válido (CA-03). Las reglas de IP no cambian. |
| P5 · Accesible y móvil | Buscador con `<label>`, botones navegables con teclado, nombres atenuados con `disabled`, mensajes con `aria-live`, pantallas probadas a ~400 px. |
| P6 · Todo en español | Mensajes, pantallas y README en español; código en inglés. |
| §3 Stack | Sin cambios: Flask, SQLite, HTML, CSS y JS sin frameworks. |
| §4 SDD | Spec 007 aprobada; este plan, luego tasks, luego código. |
| §5 Calidad | Cada CA tiene test o verificación manual (§4); los errores dicen qué hacer. |
| §6 Seguridad | Validar el código cuenta como intento (límite por IP intacto). El pase y el recibo van firmados con el secreto de la sesión y no se pueden inventar. Un alumno no puede registrar dos veces el mismo nombre. Una sesión cerrada no acepta registros. Toda entrada se valida en el servidor y se pinta como texto. |
| §7 Alcance | Todo dentro de `staff/ella-deyavorsky/asistenciapp/`. |
| `docs/ARCHITECTURE.md` | `domain` solo biblioteca estándar; `storage` no importa nada del proyecto; `usecases/groups.py` y `attendance.py` usan `domain` y `storage`; `app.py` no importa `storage` ni `sqlite3`. `test_architecture.py` lo vigila. |

---

## 6. Riesgos

- **Cambio grande.** Toca casi todos los archivos de la app. Las tasks lo parten en pasos pequeños, cada uno con su test, y las sesiones rápidas se comprueban en cada paso con los tests de hoy.
- **Migración de la base.** Una base ya usada gana columnas al arrancar. Antes del primer arranque con el cambio, conviene copiar `data/asistencia.db`; el README lo dirá.
- **Límite por IP con el túnel.** Sigue el riesgo aceptado en la spec 006: toda la clase comparte IP. Con el pase, cada alumno gasta un intento, como hoy, pero pedir la lista otra vez tras un `NameTaken` no cuenta.
- **El recibo se queda en el navegador.** Si alguien copia la marca de `localStorage` de otro navegador, solo puede preguntar si ese registro existe; no puede registrar ni borrar nada.
- **«¿Quisiste decir…?»** es una heurística: puede no avisar en algún caso raro, o avisar de más. Nunca bloquea; solo pregunta.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-27 | Borrador inicial | Spec 007 v1.0 aprobada |
| 0.2 | 2026-10-27 | `check_in` rápido añade `id` y `receipt` solo en 201; la respuesta `already` no cambia (§2.3). Excepción de la copia y límite de 200 en `decide_new`, con `GroupFull` 409 (§2.2, §2.3, §2.4). «Hora» de los nuevos en `to_group_csv` (§2.5). CA-20 y ajustes de CA-07 y CA-17 en §4 | Spec 007 v1.1 y revisión del plan |
| 1.0 | 2026-10-27 | Aprobado | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-27 | `tests/test_session_rules.py` en la tabla de archivos (§3) y en las pruebas de CA-09 y CA-19 (§4) | Las tareas separan el test de las reglas de sesión (tasks v0.2, T08) |
