# Tareas 001 · Check-in con código

> Estado: **Terminado** (v1.2, 2026-10-20) · Plan: [plan.md](plan.md) · Creado: 2026-10-19 · Re-planificado: 2026-10-20

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Las tareas de una misma fase dependen de las anteriores; no se empieza una fase sin cerrar la previa.

---

## Fase A · Preparación

- [x] **T01** · Preparar el entorno de Python:
  - `requirements.txt` con `flask` y `pytest`.
  - Entorno virtual: `python3 -m venv .venv` y `pip install -r requirements.txt`.
  - `.gitignore` con `data/` (la BD con nombres reales de alumnos no se sube a git), `.venv/` (se recrea con `requirements.txt`), `__pycache__/` y `.pytest_cache/` (archivos que Python genera solo).
  - Carpetas `asistencia/` (con un `__init__.py` vacío) y `tests/`, que **sí** se suben.
  - `pytest.ini` con `testpaths = tests` y `pythonpath = .`, para que los tests puedan hacer `import asistencia`.
  - *Hecha cuando:* `pytest` se ejecuta sin errores (aunque aún no haya tests).

## Fase B · Lógica pura (sin servidor ni BD)

Primero lo que no depende de nada: es lo más fácil de probar y la base de todo lo demás.

- [x] **T02** 🧪 · `asistencia/codes.py`: `code_for(secret, t)`, `is_valid_code(secret, code, t)` y `seconds_left(t)`.
  - Tests en `tests/test_codes.py`: siempre 4 dígitos con ceros a la izquierda · mismo secreto y ventana → mismo código · ventana siguiente → código distinto · se acepta el código actual y el anterior · se rechazan el de hace dos ventanas y uno incorrecto · `secondsLeft` correcto.
  - *Cubre:* CA-03, CA-05, CA-06.
- [x] **T03** 🧪 · `asistencia/names.py`: `clean_name(raw)` y `name_key(name)`.
  - Tests en `tests/test_names.py`: recorta espacios · vacío → error · 61 caracteres → error, 60 → ok · `"  Ana   García "` y `"ana garcia"` dan la misma clave · `<b>Ana</b>` se conserva tal cual.
  - *Cubre:* CA-07, CA-08, CA-12.
- [x] **T04** 🧪 · `asistencia/export.py` (no `csv.py`, ver plan §2.6): `to_csv(rows)`.
  - Tests en `tests/test_export.py`: empieza por BOM · cabecera `Nombre;Hora` · separador `;` · nombres con `;` o `"` van entre comillas · nombres que empiezan por `=`, `+`, `-` o `@` llevan `'` delante.
  - *Cubre:* CA-14.

## Fase C · Base de datos

- [x] **T05** · `asistencia/db.py`: `connect(path)` e `init_schema(conn)` crean las tablas del plan §3. Funciones: `get_or_create_teacher_token`, `create_session`, `get_session`, `list_sessions` (con total), `close_session`, `add_checkin` (si el nombre ya existe devuelve el registro previo), `list_checkins`.
  - *Hecha cuando:* se puede crear una BD y una sesión desde la consola de Python. Sus tests llegan con la API (Fase D), que la usa de verdad.

## Fase D · API

Todos los tests de esta fase van en `tests/test_api.py`. Usan las fixtures de `tests/conftest.py`: una app con **BD temporal** (`tmp_path`), un token fijo y un **reloj falso**, y su `client = app.test_client()`, que hace peticiones sin levantar un servidor real.

- [x] **T06** 🧪 · `app.py` base: `create_app(db_path, token=None, now=time.time)`, una conexión a la BD por petición (`flask.g`), archivos estáticos de `static/` y comprobación del token del profesor. Crear también `tests/conftest.py` con las fixtures.
  - Tests: las rutas `/api/sessions…` sin token o con token incorrecto → `401` · ruta desconocida → `404`.
  - *Cubre:* CA-15, CA-17.
- [x] **T07** 🧪 · Crear y listar sesiones: `POST /api/sessions`, `GET /api/sessions`.
  - Tests: con título · sin título → fecha y hora · el listado va de la más reciente a la más antigua y trae el total de cada una.
  - *Cubre:* CA-01, CA-02, CA-16.
- [x] **T08** 🧪 · Registro del alumno: `GET /api/s/:id`, `POST /api/s/:id/checkin`.
  - Tests: código actual → `201` · código anterior → `201` · código de hace dos ventanas → `422` con el texto de la spec · nombre vacío → `400` · mismo nombre normalizado → `200 {already: true}` y no se duplica · `<b>Ana</b>` se devuelve literal · sesión inexistente → `404`.
  - *Cubre:* CA-04, CA-05, CA-06, CA-07, CA-08, CA-12.
- [x] **T09** 🧪 · Vista del profesor: `GET /api/sessions/:id`.
  - Tests: trae `code`, `secondsLeft`, `studentUrl`, la lista ordenada por hora y el `total` · tras un registro nuevo, la siguiente llamada lo incluye.
  - *Cubre:* CA-10, CA-11.
- [x] **T10** 🧪 · Cerrar sesión: `POST /api/sessions/:id/close`.
  - Tests: tras cerrar, `GET` no trae `code` y `open: false` · un registro → `409` con el texto de la spec.
  - *Cubre:* CA-09, CA-13.
- [x] **T11** 🧪 · Exportar: `GET /api/sessions/:id/export`.
  - Tests: `Content-Type: text/csv` · nombre de archivo en `Content-Disposition` · contenido con los alumnos en orden.
  - *Cubre:* CA-14.
- [x] **T12** · Bloque `if __name__ == "__main__":` en `app.py`: crea `data/` si no existe, obtiene el token, imprime `Panel del profesor: http://localhost:8000/profesor.html#t=<token>` y arranca en `PORT` o `8000`.
  - *Hecha cuando:* `python app.py` muestra la URL y `curl` a una ruta privada con ese token responde `200`.

## Fase D2 · Acceso desde casa (spec v1.1, plan §2.10)

- [x] **T13** 🧪 · `ProxyFix` en `create_app()` para que Flask use la dirección pública que le pasa el túnel.
  - Tests en `test_api.py`: con `X-Forwarded-Proto: https` y `X-Forwarded-Host: abc.trycloudflare.com`, `studentUrl` es `https://abc.trycloudflare.com/alumno.html?s=<id>`.
  - *Cubre:* CA-19.
- [x] **T14** 🧪 · `asistencia/tunnel.py` + opción `python app.py --tunel`.
  - Instalar `cloudflared` (`brew install cloudflared`).
  - Tests en `tests/test_tunnel.py`: `find_tunnel_url` encuentra la URL en una línea real de la salida de `cloudflared` y devuelve `None` en las demás.
  - `start_tunnel(port)` lanza `cloudflared`, espera la URL (máx. 30 s) y devuelve `(proceso, url)`; si falla, mensaje claro en español (p. ej. "No se encontró cloudflared. Instálalo con: brew install cloudflared").
  - `app.py`: escucha en `127.0.0.1`; con `--tunel` imprime el enlace público del panel y al salir para el túnel.
  - *Hecha cuando:* `python app.py --tunel` imprime un enlace del panel con `https://….trycloudflare.com` y `curl` a esa URL pública responde.
  - *Cubre:* CA-19, CA-20.

- [x] **T14b** 🧪 · Comprobar que el puerto está libre antes de arrancar (incidencia en T12: un servidor de prueba olvidado seguía ocupando el puerto 8000).
  - Tests en `tests/test_port.py`: `port_in_use(port)` es `True` con un socket escuchando y `False` al cerrarlo.
  - `main()`: si está ocupado, mensaje "El puerto 8000 ya está en uso…" y salir **antes** de abrir el túnel.

## Fase E · Interfaz

- [x] **T15** · `static/styles.css` (móvil primero, contraste, foco visible) y `static/index.html` ("Pide el enlace a tu profesor").
  - *Cubre:* CA-18 (base).
- [x] **T16** · `static/alumno.html` + `alumno.js`: muestra el título de la clase, campos *Nombre* y *Código* (`inputmode="numeric"`), recuerda el nombre en `localStorage` y muestra la confirmación o el error de la API. Si la sesión está cerrada, lo dice sin mostrar el formulario.
  - *Cubre:* CA-04 a CA-09 (interfaz).
- [x] **T17** · `static/profesor.html` + `profesor.js`, **panel**: lee el token del `#t=`; formulario "Abrir asistencia"; lista de sesiones anteriores con botón "Descargar lista". Sin token o con token incorrecto → mensaje claro. Si la página está en `localhost`/`127.0.0.1`, aviso de que los alumnos no podrán entrar y cómo arrancar con `--tunel`.
  - *Cubre:* CA-01, CA-02, CA-14, CA-16, CA-21 (interfaz).
- [x] **T18** · `profesor.js`, **vista de sesión**: código grande con cuenta atrás, botón "Copiar enlace de alumnos", lista en vivo (consulta cada 2 s) con total, "Cerrar asistencia" con confirmación dentro de la página y "Descargar lista". Todo el texto del alumnado se pinta con `textContent`.
  - *Cubre:* CA-03, CA-10, CA-11, CA-12, CA-13 (interfaz).

## Fase F · Cierre

- [x] **T19** · `README.md`: qué es, cómo preparar el entorno (`.venv` + `requirements.txt`), cómo instalar `cloudflared`, cómo arrancar (`python app.py --tunel` para clase online), cómo pasar lista paso a paso, cómo ejecutar los tests.
- [x] **T20** · **Verificación manual** (en dos navegadores o navegador + móvil):
  - [x] CA-03 · el código cambia solo cada 30 s. *(Chrome automatizado, 2026-10-20: cambió sin recargar y la cuenta atrás volvió a 30 s.)*
  - [x] CA-10 · un alumno aparece en la lista del profesor en ≤ 5 s. *(Chrome automatizado: 0,5 s.)*
  - [x] CA-12 · `<b>Ana</b>` se ve literal en la lista. *(Captura a 400 px.)*
  - [x] CA-18 · todas las pantallas se ven bien a 400 px. *(Emulación móvil de Chrome: 6 páginas sin scroll horizontal.)*
  - [x] CA-19 · con `--tunel`, un móvil **con datos móviles (sin Wi-Fi)** abre el enlace de alumnos y se registra. *(2026-10-20: registro correcto desde un móvil con datos móviles.)*
  - [x] CA-20 · el enlace del panel que imprime `--tunel` funciona tal cual, sin retocarlo. *(2026-10-20: el panel se abre directamente.)*
  - [x] CA-21 · abrir el panel en `localhost` muestra el aviso. *(Capturas.)*
  - [x] El CSV descargado se abre bien en Excel o Google Sheets, con tildes. *(2026-10-20: dos columnas y tildes correctas.)*
- [x] **T21** · Repasar la **Definición de terminado** (`AGENT.md` §6) y actualizar el estado en `AGENT.md` §7.

## Fase G · Ampliación v1.2: un registro por navegador + quitar registros

- [x] **T22** 🧪 · Quitar registros en el servidor: `db.remove_checkin`, ruta `DELETE /api/sessions/<id>/checkins/<checkinId>` e `id` en cada registro de `GET /api/sessions/<id>`.
  - Tests en `test_api.py`: quitar → desaparece de la lista, del total y del CSV · id inexistente o de **otra** sesión → `404` · sin token → `401` · también funciona con la sesión cerrada · tras quitar, el mismo nombre puede registrarse otra vez (`201`).
  - *Cubre:* CA-24, CA-25, CA-26.
- [x] **T23** · `profesor.js`: botón "Quitar" en cada fila con confirmación dentro de la página (`[Sí, quitar] [Cancelar]`), que sobrevive al repintado cada 2 s.
  - *Cubre:* CA-24 (interfaz).
- [x] **T24** · `alumno.js`: guardar la marca `asistenciapp.registro.<idSesión>` tras registrarse; al abrir la página, si existe, mostrar "Ya te registraste en esta clase como *Nombre* a las HH:MM." sin formulario.
  - *Cubre:* CA-22, CA-23.
- [x] **T25** · Verificación y cierre:
  - [x] Chrome automatizado: CA-22 (recargar → bloqueado), CA-23 (otra clase → formulario), CA-24 (cancelar no cambia nada; confirmar quita, y la confirmación no desaparece con el repintado). *(2026-10-20: 12 comprobaciones OK, incluida la confirmación tras 4,5 s de polling con un alumno nuevo llegando.)*
  - [x] Capturas a 400 px de la lista con botones "Quitar" y de la confirmación (CA-18). *(Sin scroll horizontal.)*
  - [x] `README.md`: explicar el límite por navegador y cómo quitar registros.
  - [x] Prueba manual con móvil (registrarse dos veces con nombres distintos → bloqueado) y quitar un registro desde el panel. *(2026-10-20: pasos 1–5 correctos.)*
