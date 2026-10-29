# Tareas 007 · Listas de grupo para pasar lista

> Estado: **Aprobado v1.2 (2026-10-28)** · Plan: [plan.md](plan.md) v1.4 · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-27

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test y luego el código. Tras cada tarea de código, `pytest` en verde (salvo los tests nuevos que esperan su código).
- Los tests existentes no se modifican: los casos nuevos van en archivos nuevos o al final de `tests/test_names.py`. Si un test existente falla por el cambio, se para y se propone el cambio antes de tocarlo.
- Los tests nuevos usan su propia base temporal y avanzan el reloj, para no chocar con el límite por IP (spec 006).
- Ningún código guarda una lista de alumnos antes de que la enmienda 4.0 esté aprobada (T01).
- No se hace commit de nada de `staff/ella-deyavorsky/first-app/`. No hay commits ni pushes sin que lo pidas.

---

## Fase A · Constitución

- [x] **T01** · Proponer en `docs/CONSTITUTION.md` la enmienda 4.0 (plan §2.8): cabecera en 4.0 con la fecha; en P4 se sustituye **solo** la primera regla por el texto de la spec §7; fila 4.0 en el historial (spec 007, issue #539). **Se para y se espera tu ok** antes de seguir.
  - *Cubre:* spec §7.
  - *Hecha cuando:* `git diff docs/CONSTITUTION.md` muestra solo esos tres cambios y lo has aprobado.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase B · Reglas del dominio

- [x] **T02** · Añadir al final de `tests/test_names.py` los casos de `is_similar` y `find_similar`: «ella g» y «ella garcia» son parecidos; «maria garcia» y «mria garcia» también; dos claves iguales no cuentan como parecidas; «ana lopez» y «pedro ruiz» no se parecen; `find_similar` devuelve el primer parecido o `None`.
  - *Cubre:* CA-05.
  - *Hecha cuando:* los casos nuevos fallan y los existentes siguen pasando.
- [x] **T03** · En `asistencia/domain/names.py`: `is_similar` y `find_similar` con `difflib` y la regla de la inicial (plan §2.2). `MAX_LENGTH` sigue en 60.
  - *Cubre:* CA-05.
  - *Hecha cuando:* `pytest tests/test_names.py tests/test_architecture.py` pasa.
- [x] **T04** · Crear `tests/test_roster.py`:
  - `parse_pasted`: 25 líneas dan 25 nombres y las vacías se cuentan.
  - `parse_csv`: lee separado por `,` y por `;`, con y sin BOM, con acentos; reconoce la cabecera «Nombre»/«Alumnos»; toma solo la primera columna.
  - `review`: marca «maria garcia» / «María  García» como duplicado, también contra los nombres ya guardados; marca los de más de 60 caracteres y los parecidos; más de 200 es un problema.
  - `can_save`: falso con duplicados, nombres largos o más de 200; verdadero si solo hay parecidos.
  - `ensure_room`: no hace nada con 199 + 1; lanza `GroupFull` con 200 + 1, con el mensaje «Este grupo ya tiene 200 alumnos».
  - Los errores nuevos tienen mensaje en español.
  - *Cubre:* CA-01, CA-02, CA-18 (lectura), CA-20.
  - *Hecha cuando:* `pytest tests/test_roster.py` falla porque `asistencia.domain.roster` no existe.
- [x] **T05** · Crear `asistencia/domain/roster.py` (plan §2.2): `parse_pasted`, `parse_csv`, `review`, `can_save`, `MAX_STUDENTS`, `ensure_room` y los errores `DuplicateName`, `SimilarName` (con la sugerencia), `NotInRoster`, `NameTaken`, `EmptyGroup`, `GroupFull`, `GroupHasOpenSession`, `GroupArchived`, `GroupGone`. Solo biblioteca estándar.
  - *Cubre:* CA-01, CA-02, CA-18, CA-20.
  - *Hecha cuando:* `pytest tests/test_roster.py tests/test_architecture.py` pasa.
- [x] **T06** · Crear `tests/test_passes.py`: un pase recién emitido vale; a los 119 s vale y a los 121 s no; un pase con la firma cambiada o de otra sesión no vale; un recibo vale solo para su registro y su sesión; `PassExpired` tiene el mensaje de la spec.
  - *Cubre:* CA-11, CA-14, CA-16.
  - *Hecha cuando:* `pytest tests/test_passes.py` falla porque `asistencia.domain.passes` no existe.
- [x] **T07** · Crear `asistencia/domain/passes.py` (plan §2.2): `PASS_SECONDS`, `issue_pass`, `pass_is_valid`, `receipt_for`, `receipt_is_valid`, `PassExpired`. HMAC con el secreto de la sesión, comparación con `hmac.compare_digest`.
  - *Cubre:* CA-11, CA-14, CA-16.
  - *Hecha cuando:* `pytest tests/test_passes.py tests/test_architecture.py` pasa.
- [x] **T08** · Crear `tests/test_session_rules.py`: `ensure_can_open` lanza `GroupArchived` con un grupo archivado y `EmptyGroup` con 0 alumnos, y no hace nada con un grupo activo con alumnos; `ensure_can_delete` lanza `GroupHasOpenSession` con una sesión abierta y no hace nada sin sesiones abiertas.
  - *Cubre:* CA-09, CA-19.
  - *Hecha cuando:* `pytest tests/test_session_rules.py` falla porque las funciones no existen.
- [x] **T09** · En `asistencia/domain/session.py`: `ensure_can_open(group, student_count)` y `ensure_can_delete(open_sessions)` (plan §2.2).
  - *Cubre:* CA-09, CA-19.
  - *Hecha cuando:* `pytest tests/test_session_rules.py tests/test_architecture.py` pasa.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase C · Almacenamiento

- [x] **T10** · Crear `tests/test_migration.py`: una base creada con el esquema de hoy (copiado en el test), con una sesión y dos registros, gana las columnas nuevas al llamar a `init_schema`, sin perder datos; las sesiones quedan como rápidas (`group_name` vacío); llamar dos veces a `init_schema` no falla; las tablas nuevas existen.
  - *Cubre:* CA-10.
  - *Hecha cuando:* el test falla porque faltan las columnas y las tablas.
- [x] **T11** · En `asistencia/storage/sqlite.py`: las tres tablas nuevas en `SCHEMA` y la migración de las cuatro columnas con `PRAGMA table_info` y `ALTER TABLE` (plan §2.1).
  - *Cubre:* CA-10.
  - *Hecha cuando:* `pytest tests/test_migration.py` y los tests existentes pasan.
- [x] **T12** · Funciones de grupos en `storage/sqlite.py` (plan §2.1): crear, leer, listar, renombrar, archivar, borrar (y poner `group_id = NULL` en sus sesiones), alumnos (listar, añadir, renombrar, quitar) y `count_open_sessions_of_group`. Con sus casos en un archivo nuevo `tests/test_group_storage.py`, escrito antes.
  - *Cubre:* CA-09, CA-13 (datos).
  - *Hecha cuando:* `pytest tests/test_group_storage.py tests/test_architecture.py` pasa.
- [x] **T13** · Funciones de sesión con grupo en `storage/sqlite.py`: `create_session` acepta grupo y guarda la copia en la misma transacción; `list_session_roster`, `add_to_session_roster`, `set_checkin_kind`, `set_checkin_decided`; `add_checkin` acepta `kind`. Casos en `tests/test_group_storage.py`, escritos antes. Las llamadas de hoy a `create_session` y `add_checkin` siguen funcionando igual.
  - *Cubre:* CA-08 (datos), CA-17 (datos).
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase D · Gestión de grupos (profesor)

- [x] **T14** · Crear `tests/test_groups_api.py` con los casos de grupos:
  - Sin token, `/api/groups` responde 401.
  - Vista previa de 25 nombres pegados y de un CSV con un duplicado (no deja guardar).
  - Crear, listar dos grupos, renombrar, añadir, renombrar y quitar alumnos.
  - Archivar y restaurar; el archivado no sale en la lista principal.
  - Borrar un grupo sin sesiones.
  - *Cubre:* CA-01, CA-02, CA-13.
  - *Hecha cuando:* los casos fallan porque las rutas no existen.
- [x] **T15** · Crear `asistencia/usecases/groups.py` (plan §2.3) y las rutas `/api/groups…` en `app.py` (plan §2.4), con `require_teacher` también para `/api/groups` y los errores nuevos en `DOMAIN_ERRORS`. Sin lógica de negocio en las rutas.
  - *Cubre:* CA-01, CA-02, CA-13.
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase E · Sesiones con grupo (profesor)

- [x] **T16** · Añadir a `tests/test_groups_api.py`:
  - Abrir una sesión con grupo guarda la copia; con un grupo de 0 alumnos da 409 con el mensaje; con un grupo archivado da 409.
  - Renombrar a un alumno en el grupo no cambia la copia de una sesión anterior.
  - Borrar un grupo con una sesión abierta da 409; archivarlo sí funciona y la sesión sigue abierta.
  - `teacher_view` devuelve «X de N», presentes, nuevos y ausentes; una sesión rápida devuelve lo de hoy.
  - *Cubre:* CA-08, CA-09, CA-19.
  - *Hecha cuando:* los casos nuevos fallan.
- [x] **T17** · En `usecases/attendance.py`: `create_session` con `group_id` opcional y `ensure_can_open`; `teacher_view` ampliada. En `usecases/groups.py`: `delete_group` comprueba `ensure_can_delete`. En `app.py`: `POST /api/sessions` acepta `groupId`.
  - *Cubre:* CA-08, CA-09, CA-19.
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase F · Registro del alumno

- [x] **T18** · Crear `tests/test_group_checkin_api.py`:
  - `GET /api/s/<id>` dice `hasGroup` y no devuelve nombres; `unlock` con un código malo no devuelve nombres.
  - `unlock` con el código bueno devuelve el pase y la lista.
  - Registrarse de la lista: el nombre queda como registrado y un segundo intento da 409.
  - Nombre que no está en la copia sin `isNew` da 422.
  - Nuevo «Ella G.» con «Ella García» en la lista da `SimilarName` con la sugerencia; con `confirmSimilar` queda como nuevo.
  - Un segundo nuevo «ella g.» da `DuplicateName`.
  - Con el reloj a los 60 s, registrarse sin código funciona y en `ip_attempts` solo hay un intento; a los 121 s da `PassExpired` con el mensaje.
  - Registrarse sin pase en una sesión con grupo se rechaza.
  - *Cubre:* CA-03, CA-04, CA-05, CA-11, CA-15, CA-16.
  - *Hecha cuando:* los casos fallan porque las rutas no existen.
- [x] **T19** · En `usecases/attendance.py`: `public_session` con `hasGroup`, `unlock`, `roster_for_pass` y `check_in_group` (plan §2.3). En `app.py`: rutas `unlock` y `roster`, y `checkin` elige el camino según la sesión.
  - *Cubre:* CA-03, CA-04, CA-05, CA-11, CA-15, CA-16.
  - *Hecha cuando:* `pytest` completo en verde.
- [x] **T20** · Añadir a `tests/test_group_checkin_api.py` los recibos:
  - Un registro nuevo en sesión rápida devuelve `id` y `receipt` (201), y la respuesta `already` (200) no cambia.
  - `registration_exists` es `true` y pasa a `false` tras quitar o liberar el registro, en sesión rápida y con grupo.
  - Un recibo falso da 404.
  - *Cubre:* CA-14.
  - *Hecha cuando:* los casos nuevos fallan.
- [x] **T21** · En `usecases/attendance.py`: `check_in` añade `id` y `receipt` solo al crear; `check_in_group` también; `registration_exists`. En `app.py`: ruta `GET /api/s/<id>/checkins/<cid>`.
  - *Cubre:* CA-14.
  - *Hecha cuando:* `pytest` completo en verde, incluido `test_duplicate_name_is_not_added_twice` sin tocarlo.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase G · Los nuevos y la descarga

- [x] **T22** · Añadir a `tests/test_groups_api.py` los casos de `decide_new`:
  - Cerrar con un nuevo sin decidir; después `add`, `keep` y `discard` funcionan con la sesión cerrada.
  - `add` lo pone en la copia de la siguiente sesión.
  - Grupo archivado: `add` funciona. Grupo borrado: 410.
  - Nombre ya en el grupo: une el registro a ese alumno, lo añade a la copia si faltaba, y no se duplica.
  - Grupo de 200: 409 «Este grupo ya tiene 200 alumnos», el grupo sigue con 200 y luego `keep` y `discard` funcionan.
  - *Cubre:* CA-06, CA-12, CA-17, CA-20.
  - *Hecha cuando:* los casos fallan.
- [x] **T23** · En `usecases/attendance.py`: `decide_new` en el orden del plan §2.3. En `app.py`: ruta `POST /api/sessions/<id>/checkins/<cid>/decision`.
  - *Cubre:* CA-06, CA-12, CA-17, CA-20.
  - *Hecha cuando:* `pytest` completo en verde.
- [x] **T24** · Crear `tests/test_group_export.py`: columnas `Grupo;Fecha;Nombre;Estado;Hora`; una fila por alumno de la copia y por nuevo; «Hora» en presentes y nuevos, vacía en ausentes; `;`, UTF-8 con BOM; «=SUMA(1)» sale como `'=SUMA(1)` y un nombre de grupo con `=` también; el CSV de una sesión rápida no cambia.
  - *Cubre:* CA-07, CA-10, CA-18.
  - *Hecha cuando:* los casos fallan.
- [x] **T25** · En `asistencia/export.py`: `to_group_csv` (plan §2.5). `checkins_for_export` devuelve también la copia. En `app.py`: la descarga elige `to_csv` o `to_group_csv`.
  - *Cubre:* CA-07, CA-10, CA-18.
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase H · Pantallas

- [ ] **T26** · *(Código hecho; falta tu verificación manual.)* Antes de arrancar la app, copia `data/asistencia.db` a una carpeta fuera del repo: el primer arranque con este cambio añade columnas a la base real (plan §2.1). Después, panel del profesor, grupos (plan §2.6): sección «Grupos» con listado, Editar, Archivar, Borrar con confirmación y «Ver archivados» con Restaurar; vista «Grupo» con nombre, pegar, subir CSV con `FileReader`, vista previa con problemas, Guardar desactivado con duplicados, y edición de alumnos con avisos «¿Quisiste decir…?».
  - *Cubre:* CA-01, CA-02, CA-13 (pantalla).
  - *Hecha cuando:* verificación manual: crear un grupo pegando 25 nombres y otro subiendo un CSV con un duplicado; editarlos; a ~400 px se usa sin zoom.
- [ ] **T27** · *(Código hecho; falta tu verificación manual.)* Panel del profesor, sesiones (plan §2.6): `<select>` de grupo o sesión rápida al abrir; mensaje de grupo vacío con sus dos botones; en la sesión, «X de N presentes», presentes con Liberar, nuevos con sus tres botones (también cerrada; sin «Añadir al grupo» si el grupo está borrado; mensaje de grupo lleno) y ausentes.
  - *Cubre:* CA-06, CA-09, CA-12, CA-17, CA-19, CA-20 (pantalla).
  - *Hecha cuando:* verificación manual de cada caso en el navegador.
- [ ] **T28** · *(Código hecho; falta tu verificación manual.)* Página del alumno (plan §2.7): los tres pasos con grupo, buscador con `<label>`, nombres registrados atenuados y desactivados, «No estoy en la lista», «¿Quisiste decir…?», confirmación «✓ Estás dentro», tiempo agotado que conserva el nombre, y recibo en `localStorage` que libera el navegador. La sesión rápida sigue con su formulario de hoy.
  - *Cubre:* CA-03, CA-04, CA-05, CA-14, CA-16 (pantalla).
  - *Hecha cuando:* verificación manual en dos navegadores, con teclado y a ~400 px.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase I · Documentación y cierre

- [x] **T29** · `docs/ARCHITECTURE.md`: `roster.py`, `passes.py`, `usecases/groups.py` y las tablas nuevas (plan §2.9).
  - *Hecha cuando:* el árbol y las tablas describen el código real.
- [x] **T30** · `README.md`: sección «Grupos», cómo se registra el alumno con grupo, la descarga con «Estado», copiar `data/asistencia.db` antes del primer arranque con el cambio, y el cambio de «Un registro por navegador» (si quitas a alguien, su navegador puede volver a registrarse). En `specs/001-checkin-codigo/spec.md`, solo una fila en su historial: CA-26 cambia por la spec 007 (RF-22).
  - *Hecha cuando:* el README describe lo que hace la app.
- [ ] **T31** · Verificación manual completa (plan §4): `python app.py`, grupo desde un CSV de Excel, sesión, registro desde dos navegadores (uno de la lista y uno nuevo), liberar y volver a registrarse, cerrar, decidir sobre el nuevo, abrir el CSV en Excel o Google Sheets. Parar la app y comprobar que `lsof -nP -iTCP:8000 -sTCP:LISTEN` no muestra nada. Si algo salió mal, vuelve a poner la copia de `data/asistencia.db`.
  - *Cubre:* todos los CA, de punta a punta.
  - *Hecha cuando:* todo funciona y el puerto queda libre.
- [ ] **T32** · `AGENTS.md` §5: la fila de la spec 007 pasa a «Implementada», con el número de tests.
  - *Hecha cuando:* `pytest` completo en verde y la tabla está al día.
- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase J · Un pase, un registro (spec v1.2, plan v1.3)

- [x] **T33** · Tests primero:
  - En `tests/test_group_checkin_api.py`: un segundo registro con el mismo pase da 409 «Este pase ya se ha usado: escribe el código otra vez» y el segundo nombre no queda registrado; 30 nombres con un pase → solo 1 registrado; un registro que falla (nombre ya registrado, parecido sin confirmar) no gasta el pase.
  - En los tests de la spec 007 que reutilizaban un pase (`test_register_from_list_marks_the_name`, `test_second_identical_new_name_is_rejected`, `test_released_name_frees_the_browser`), el segundo intento pide un pase nuevo escribiendo el código otra vez. Los tests de antes de la spec 007 no se tocan.
  - En `tests/test_group_storage.py`: `add_checkin_with_pass` inserta y apunta el pase; con el pase repetido no inserta nada; con el nombre ya registrado no apunta el pase.
  - En `tests/test_passes.py`: el mensaje de `PassUsed`.
  - *Cubre:* CA-14, CA-21.
  - *Hecha cuando:* los casos nuevos fallan y se para a esperar tu ok.
- [x] **T34** · Código (plan v1.3): tabla `used_passes` y `add_checkin_with_pass` en `storage/sqlite.py`; `PassUsed` y `PASS_USED` en `domain/passes.py`; `check_in_group` usa `add_checkin_with_pass`; `PassUsed` 409 con `needCode` en `app.py`; `alumno.js` vuelve al código con `PassUsed` como con `PassExpired`, conservando el nombre, y olvida el pase tras registrarse. README: «un pase, un registro» en la sección de grupos.
  - *Cubre:* CA-14, CA-21.
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase K · Casillas, mayúsculas y separación (spec v1.3, plan v1.4)

Salen de la verificación manual de T26. Cuando esta fase acabe, T26 se verifica con las pantallas nuevas.

- [x] **T35** · Tests primero:
  - Al final de `tests/test_names.py`, `capitalize_name`: «maría de la fuente» → «María de la Fuente»; «de la rosa» → «De la Rosa»; «McDonald» no cambia; «ana-belén» → «Ana-Belén»; «ana  garcía» → «Ana  García» (conserva los dos espacios); «ELLA» no cambia.
  - Nuevo `tests/test_group_capitals_api.py`: crear un grupo con «ana lópez» guarda «Ana López»; añadir «luis de la rosa» guarda «Luis de la Rosa»; renombrar a un alumno como «luis» guarda «Luis»; la vista previa devuelve `students` con mayúscula y `duplicates` tal como se escribieron; una sesión rápida con «ana» guarda «ana»; un nuevo «ella g.» en una sesión con grupo se guarda «ella g.».
  - *Cubre:* CA-22.
  - *Hecha cuando:* los casos de mayúsculas fallan, los de «se guarda tal cual» pasan, y los tests de hoy siguen pasando. Se para a esperar tu ok.
- [x] **T36** · Código del dominio (plan §2.11): `LOWERCASE_WORDS` y `capitalize_name` en `asistencia/domain/names.py`; la aplican `review()` en `domain/roster.py` y `rename_student` en `usecases/groups.py`. `usecases/attendance.py` no cambia.
  - *Cubre:* CA-22.
  - *Hecha cuando:* `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de T35 y T36 (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

- [x] **T37** · Formulario de alumnos (plan §2.11) en `static/profesor.html` y `profesor.js`: casillas con «×» y «+ Añadir alumno»; Intro y pegar varias líneas; tarjeta del CSV con «Revisar», que llena las casillas; «Subir lista» con la vista previa, las marcas en las casillas, «Subir igualmente» y el guardado con las rutas de hoy. Desaparecen el `<textarea>`, «Guardar grupo» y «Añadir a la lista».
  - *Cubre:* CA-01, CA-02, CA-23, CA-24 (pantalla).
  - *Hecha cuando:* `pytest` en verde y verificación manual: pegar 25 nombres da 25 casillas y se guardan; Intro crea una casilla sin subir nada; un CSV con un repetido lo marca en su casilla y no guarda hasta corregirlo; un nombre parecido pide «Subir igualmente»; en «Editar grupo», sin nombres, sale «Escribe al menos un nombre.»; un grupo nuevo sin nombres se crea vacío.
- [x] **T38** · Separación (plan §2.11) en `static/styles.css` y `profesor.html`: `margin-bottom` de `.list.card`; cabecera de «Grupos» con «Nuevo grupo» a la derecha; botones de las sesiones anteriores en `small`; `.card-title`, `.boxes` y filas de botones con `.actions`.
  - *Cubre:* CA-25.
  - *Hecha cuando:* verificación manual del panel, «Nuevo grupo» y «Editar grupo» en un ordenador y a ~400 px, en modo claro y oscuro: la misma separación y ningún botón pegado a otro ni a una tarjeta.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de T37 y T38 (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

- [x] **T39** · Documentación: en `README.md`, la sección «Grupos» explica las casillas, Intro, pegar varias líneas, «Revisar» para el CSV, «Subir lista» y las mayúsculas automáticas. En `AGENTS.md` §8, la fila de la spec 007 dice v1.3 y el número de tests.
  - *Hecha cuando:* el README describe lo que hace la app y `pytest` completo en verde.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de T39 (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-27 | Borrador inicial | Plan 007 v1.0 aprobado |
| 0.2 | 2026-10-27 | Copia de `data/asistencia.db` antes del primer arranque (T26) y cómo volver a ponerla (T31); T08 se parte en test (T08) y código (T09), y las siguientes se renumeran; checkpoint con commit propuesto al final de cada fase | Revisión de las tareas |
| 1.0 | 2026-10-27 | Aprobadas | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-27 | Fase J: un pase, un registro (T33 tests, T34 código) | Spec 007 v1.2 y plan v1.3 |
| 1.2 | 2026-10-28 | Fase K: mayúsculas (T35 tests, T36 código), formulario con casillas (T37), separación (T38) y documentación (T39) | Spec 007 v1.3 y plan v1.4 |
