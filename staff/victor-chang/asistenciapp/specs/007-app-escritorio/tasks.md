# Tareas 007 · App de escritorio para el profesor

> Versión 1.0 · Estado: **Aprobado** (2026-11-04) · Plan: [plan.md](plan.md) v1.0 · Creado: 2026-11-04 · Issue: #919

Cómo leer esta lista:
- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]` y se anota qué se hizo.
- `🧪` = se escribe primero el test, se ve fallar y luego se escribe el código hasta que pase.
- `👤` = necesita que **Victor** (o un compañero) haga algo: aprobar una descarga, configurar Google o GitHub, o probar a mano.
- **Regla de todas las tareas:** al acabar, `pytest`, `ruff check`, `ruff format --check` y `mypy` están en verde (AGENT.md §6), y lo que se arrancó para probar (servidor, `cloudflared`, la ventana) está parado, con los puertos libres.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Spike (plan §0)

- [x] **T01** 👤 · Prueba de concepto en el Mac de Victor, fuera de la app (`scripts/spike_escritorio.py`, desechable):
  - **Victor:** en Google Cloud, pasar la app de OAuth de *Prueba* a **En producción** (sin verificar) y tener a mano una cuenta de Google que **no** esté en la lista de usuarios de prueba.
  - **Victor:** aprobar la instalación de `pywebview` y `pyinstaller` en el entorno, y la descarga de `cloudflared` darwin-arm64 (versión fija y suma SHA-256).
  - Un `.app` mínimo con PyInstaller (`--windowed --onedir`): Flask en un hilo, una ventana con una página de prueba, un botón que abre el túnel con el `cloudflared` incluido, otro que guarda un CSV con BOM por el diálogo nativo y otro que lanza el inicio de sesión de Google.
  - Comprobar las 6 filas de plan §0 y anotar el resultado de cada una (con tamaño en MB y segundos hasta ver la ventana).
  - **Puerta:** si fallan #2 (inicio de sesión) o #3 (llave en producción sin verificar), se para y se revisa la spec con Victor. Si falla otra, se ajusta el plan antes de seguir.
  - *Cubre:* riesgo de CA-01, CA-02, CA-07, CA-14, CA-15, CA-17 y los requisitos no funcionales.
  - **Hecha (2026-11-05): las seis comprobaciones pasan en macOS y la puerta se pasa** (plan v1.1 §0). Hecho por el agente, con el permiso de Victor para instalar y descargar: `pywebview` 6.2.1 y `pyinstaller` 6.22.3 en un entorno temporal; `cloudflared` 2026.10.7 darwin-arm64; `scripts/spike_escritorio.py`; `Spike.app` (`--windowed --onedir`, firma *ad hoc*) y `Spike.dmg`.
    - **#4 ✅** El `cloudflared` incluido arranca desde `Contents/Frameworks/` y da su URL en ~5 s. Desde fuera, la URL responde `200` unos 2 s después (resolución por 1.1.1.1 y por el DNS del sistema). Al cerrar la ventana, el túnel y el servidor se paran y no queda ningún proceso.
    - **#6 ✅** `Spike.dmg` pesa **40 MB** (77 MB instalada, 39 MB son de `cloudflared`). La ventana aparece en **0,9 s** al abrirla normalmente; la primera vez tras compilar, entre 3,7 y 10 s (macOS revisa los archivos nuevos).
    - **#1 ✅** Victor guardó con el diálogo nativo (`asistencia-prueba.csv`, 55 bytes con BOM). La descarga del navegador, con `ALLOW_DOWNLOADS`, también funciona y también pregunta dónde guardar.
    - **#2 ✅** Desde el `.app`, el inicio de sesión abre el navegador del sistema y vuelve a la app.
    - **#3 ✅** Con la app de Google **en producción sin verificar** (publicada por Victor el 2026-11-05, con sus páginas en GitHub Pages) y una cuenta que **nunca** fue de prueba: aviso de Google de app no verificada, permiso de Meet concedido, API de Meet `200` y permiso renovable. Que no caduque a los 7 días queda para T13/T16 (el spike no guarda el permiso).
    - **#5 ✅** "Abrir igualmente" aparece en Privacidad y seguridad (macOS 26.6) con el `.dmg` marcado como descargado. `spctl` rechaza el `.app`, como se esperaba sin firma de pago.
    - **Cerrar con el túnel abierto ✅** tras corregir el spike: la confirmación nativa (`confirm_close` + textos en español) pregunta, "Cancelar" deja la app abierta y "Cerrar" la cierra sin dejar procesos. La primera versión, con un diálogo propio desde el evento `closing`, **congeló la app**.
    - **Texto seleccionable ✅** con `text_select=True` (la primera versión no dejaba seleccionar el enlace).
    - **Hallazgos, ya aplicados en el plan v1.1** (§0, tabla de hallazgos; además: congelación al cerrar, texto no seleccionable y *App Translocation*):
      1. La suma SHA-256 del `.tgz` de macOS que publican las notas de la versión **no coincide** con el archivo (las notas dicen `2136…`; el archivo y el *digest* de GitHub, `3586…`). El binario es auténtico: firmado con el Developer ID de Cloudflare Inc. (`68WVV388M8`) y notarizado por Apple. En Windows, la suma de las notas sí coincide con el *digest* de GitHub. Hace falta otra comprobación para macOS en plan §2.11.
      2. PyInstaller cambia la firma de Cloudflare del binario incluido por una *ad hoc*; sigue funcionando.
      3. La app no debe comprobar su propia URL pública nada más abrir el túnel: la primera consulta al DNS llega antes de que exista el nombre y macOS guarda el "no existe" (en el spike, 60 s sin resolver). Para los alumnos no pasa: consultan más tarde desde su móvil.
      4. pywebview abre la ventana en modo privado por defecto (`private_mode=True`): lo que guarda la página en el navegador no dura entre arranques. Al panel no le afecta (el token llega en el enlace).

## Fase B · Infraestructura (plan §2.3–§2.6)

- [x] **T02** 🧪 · Configuración por sistema en `config.py` (plan §2.3):
  - tests en `test_config.py`: `load_config(environ, desktop=True, platform=…, home=…)` da las rutas de la carpeta del usuario en `darwin` y en `win32` (con `APPDATA`); sin `desktop`, las de `data/` como hoy; las variables `ASISTENCIA_*` mandan en los dos casos; la llave propia de la carpeta del usuario va antes que la incluida; `cloudflared_path` es `None` desde el código y el binario incluido en escritorio;
  - deben fallar; luego, el código.
  - *Cubre:* CA-05, CA-06, CA-16, CA-18.
  - **Hecha (2026-11-05):** 12 tests nuevos en `test_config.py`; fallaron los 12 (`load_config` no aceptaba los parámetros nuevos) y ahora pasan. 510 tests en verde; `ruff` y `mypy` sin avisos.
    - `load_config(environ, desktop, platform, home, bundle)`: además de lo que decía el plan, `bundle` es la carpeta de lo que va dentro de la app (`sys._MEIPASS`); se la pasará `app.py` (T12), así `config.py` no lee `sys` por su cuenta salvo `sys.platform` por defecto.
    - `user_data_dir` es pública: la usarán el README (dónde copiar `asistencia.db`, decisión §8.8) y quizá `app.py`.
    - Windows sin `APPDATA` (o vacía) usa `~/AppData/Roaming`; otros sistemas, `~/.local/share` (fuera de la spec, pero sin fallar).
    - Con `--ventana` desde el código (sin `bundle`), la llave es la de `data/` del proyecto y `cloudflared`, el del `PATH`.
- [x] **T03** 🧪 · `infra/server.py` (plan §2.4):
  - tests en `test_server.py`: `start(app)` da un puerto distinto de 0 en el que responde la app; `stop()` lo libera (se puede volver a abrir) y el hilo termina;
  - deben fallar; luego, el código.
  - *Cubre:* CA-12.
  - **Hecha (2026-11-05):** 5 tests nuevos en `test_server.py` (fallaron al no existir el módulo) y `infra/server.py`: `start(app) -> RunningServer` con `make_server("127.0.0.1", 0, app, threaded=True)` en un hilo; `port`, `host`, `running` y `stop()`. 515 tests en verde; `ruff` y `mypy` sin avisos.
    - Además de lo previsto: `stop()` se puede llamar dos veces (lo llamará el `finally` de `app.py` aunque algo falle antes) y `RunningServer` funciona con `with` (S7); dos servidores a la vez reciben puertos distintos.
    - El hilo es *daemon*: si algo falla antes del `finally`, no impide que el proceso termine.
    - Los tests tardan ~3 s en total por el sondeo de medio segundo de `shutdown()` de werkzeug; se acepta (T5: segundos).
- [x] **T04** 🧪 · `infra/instance.py` (plan §2.5):
  - tests en `test_instance.py` (con un puerto de bloqueo libre elegido por el test): un segundo `acquire` lanza `AlreadyRunningError` con su mensaje; tras soltar el primero, `acquire` vuelve a funcionar; `ASISTENCIA_LOCK_PORT` cambia el puerto;
  - deben fallar; luego, el código.
  - *Cubre:* CA-03.
  - **Hecha (2026-11-05):** 5 tests nuevos en `test_instance.py` y 2 en `test_config.py` (fallaron al no existir el módulo ni el valor nuevo) y `infra/instance.py`: `acquire(port) -> InstanceLock` y `AlreadyRunningError` con el mensaje del plan. 525 tests en verde; `ruff` y `mypy` sin avisos.
    - **Cambio sobre el plan:** `ASISTENCIA_LOCK_PORT` no lo lee `instance.py`, sino `config.py` (C4: solo la configuración lee el entorno). Es `Config.lock_port`, por defecto 47913 y validado como `PORT` (`InvalidLockPortError`); `acquire` lo recibe por parámetro. `_port` pasa a recibir su valor por defecto y su error.
    - Sin `SO_REUSEADDR`; en Windows, `SO_EXCLUSIVEADDRUSE` para que otro programa no pueda compartir el puerto.
    - `release()` se puede llamar dos veces y `InstanceLock` funciona con `with` (S7).
    - Comprobado también entre **dos procesos**: con el bloqueo tomado, otro proceso recibe `AlreadyRunningError`; al soltarlo, lo toma sin problema.
- [x] **T05** 🧪 · Clase `Tunnel` en `infra/tunnel.py` (plan §2.6):
  - tests en `test_tunnel.py` con un `cloudflared` falso (un script que imprime una URL y espera): `open` dos veces → un solo proceso y la misma URL; `close` termina el proceso y deja `url` en `None`; `close` sin abrir no falla; si el proceso no sale en 5 s, se mata; `start_tunnel` usa el ejecutable que recibe y, con `None`, el del `PATH` como hoy; en Windows se pasa `CREATE_NO_WINDOW`;
  - deben fallar; luego, el código. Los tests de hoy de `start_tunnel` siguen en verde.
  - *Cubre:* CA-07, CA-12.
  - **Hecha (2026-11-05):** 14 tests nuevos en `test_tunnel.py` (fallaron al no existir `Tunnel`); el `cloudflared` falso gana `wait`, `kill` y `poll`, y guarda cómo se lanzó. 539 tests en verde; `ruff` y `mypy` sin avisos.
    - `start_tunnel(port, timeout, executable)`: con `executable`, no busca en el `PATH`; si el archivo no existe, `CloudflaredMissingError`. `creationflags=CREATE_NO_WINDOW` solo en Windows.
    - `close_process(process)`: `terminate`, espera 5 s y, si no sale, `kill` (F4).
    - `Tunnel(executable, port, timeout)`: `open()` (con `threading.Lock`: dos hilos a la vez lanzan un solo `cloudflared`), `close()` (no falla si no estaba abierto), `url` y `on_change` (lista de funciones avisadas con la URL o `None`, plan v1.1 §2.7).
    - Además de lo previsto: `url` es `None` si `cloudflared` se cerró solo (así el panel no dice "Activa" sin túnel), y `open()` lo recoge antes de lanzar otro.
    - Comprobado también con el **`cloudflared` real** 2026.10.7: abre en 5,4 s, el segundo `open()` da la misma URL, `close()` lo para al momento, avisa dos veces (URL y `None`) y no queda ningún proceso.
    - `app.py` sigue llamando a `start_tunnel(port)` como hasta ahora; pasa a usar `Tunnel` en T12.

## Fase C · Entrada web (plan §2.6, §2.8, §2.12, §4)

- [x] **T06** 🧪 · `auth.py` con `PRIVATE_PREFIXES`, y `create_app` / `WebContext` con `tunnel` y `desktop` (plan §4):
  - tests: `/api/online` y `/api/app` sin token → `401`; `/api/sessions` sigue protegido; las rutas públicas siguen abiertas;
  - deben fallar; luego, el código.
  - *Cubre:* base de CA-04 y CA-07 (§6 de la constitución).
  - **Hecha (2026-11-05):** 16 tests en el nuevo `test_web_online.py`; fallaron los 8 que dependían del cambio (6 de credencial y 2 de `create_app`) y los otros 8 quedan como red. 555 tests en verde; `ruff` y `mypy` sin avisos.
    - `auth.py`: `PRIVATE_PREFIXES = ("/api/sessions", "/api/online", "/api/app")`, comprobados en el mismo sitio (X3). Solo la ruta exacta o lo que cuelga de ella: `/api/apps` no queda protegida (test).
    - `WebContext` y `create_app` ganan `tunnel` (por defecto `None`) y `desktop` (por defecto `False`); las llamadas de hoy no cambian.
    - Con el token, las rutas nuevas responden `404` hasta T07.
- [x] **T07** 🧪 · `entrypoints/web/online.py` y errores de túnel en `errors.py` (plan §4, §2.12):
  - tests en `test_web_online.py` con un `Tunnel` falso: `GET /api/app` → `version` (= `__version__`), `desktop` y `online.active`; `POST /api/online` → `active` y `url`, y la segunda vez la misma URL; `DELETE /api/online` → `active: false`, también si ya estaba cerrada; `TunnelTimeoutError` y `TunnelExitedError` → `502`, `CloudflaredMissingError` → `422`, con su mensaje en JSON (F3);
  - `attendance/__init__.py` gana `__version__ = "1.0.0"`;
  - deben fallar; luego, el código.
  - *Cubre:* CA-04, CA-07, CA-08.
  - **Hecha (2026-11-05):** 13 tests nuevos en `test_web_online.py` (fallaron al no existir `__version__`, `OnlineNotAvailableError` ni las rutas). 571 tests en verde; `ruff` y `mypy` sin avisos.
    - **Cambio sobre el plan:** los tests usan el **`Tunnel` de verdad** con un `cloudflared` falso, no un `Tunnel` falso (T4: solo se simula lo externo). El `cloudflared` falso pasa de `test_tunnel.py` a `conftest.py` (`fake_cloudflared`, `TUNNEL_URL`, `TUNNEL_URL_LINE`) para compartirlo.
    - `online.py`: `GET /api/app`, `POST /api/online` y `DELETE /api/online`, con la excepción a C2 de plan §7.2 anotada en el módulo. Respuestas por `serializers.py` (`online_json`, `app_info_json`, D7/F2); con clase online, `GET /api/app` incluye también su `url`.
    - **Añadido al plan:** `OnlineNotAvailableError` (`409`, "La clase online no está disponible en este arranque. Cierra la app y vuelve a abrirla.") si la app se montó sin `tunnel`. Desde T12 `app.py` siempre lo pasa, así que solo puede pasar si algo se monta mal.
    - Errores de túnel en la tabla única (`422` sin `cloudflared`, `502` tiempo agotado o cerrado); el test de `test_web_errors.py` que recorre la tabla ya comprueba su código y su mensaje en JSON.
- [x] **T08** 🧪 · Enlace de alumnos con la URL del túnel en `teacher.py` (plan §2.6):
  - tests en `test_web_teacher.py`: con clase online, `studentUrl` empieza por la URL del túnel; sin ella, por `request.host_url` como hoy;
  - deben fallar; luego, el código.
  - *Cubre:* CA-07.
  - **Hecha (2026-11-05):** 2 tests nuevos en `test_web_teacher.py` con la app de escritorio, el `Tunnel` de verdad y el `cloudflared` falso, pidiendo el panel desde `http://127.0.0.1:<puerto>`. Falló el de "clase online abierta" (daba `127.0.0.1`); el de "cerrada" ya pasaba y queda como red. 573 tests en verde; `ruff` y `mypy` sin avisos.
    - `teacher.py`: `_student_base_url()` da `tunnel.url + "/"` si hay clase online y, si no, `request.host_url`. El test de spec 001 con el panel abierto desde el túnel (`X-Forwarded-Host`) sigue en verde.
- [x] **T09** 🧪 · Mensajes de Google para la llave compartida (plan §2.8):
  - test: el mensaje de `MeetLoginNotCompletedError` incluye la frase del tope de usuarios y dónde dejar la llave propia;
  - el comentario de `google_auth.py` sobre la caducidad semanal (spec 004 P7) pasa a decir que en producción el permiso no caduca;
  - debe fallar; luego, el código.
  - *Cubre:* CA-15, CA-16.
  - **Hecha (2026-11-05):** en `test_errors.py`, el mensaje esperado de `MeetLoginNotCompletedError` pasa al del plan §2.8 y un test nuevo exige "límite de usuarios", "tu propia llave" y "README §4.1"; fallaron los dos y ahora pasan. 574 tests en verde; `ruff` y `mypy` sin avisos.
    - El comentario de `google_auth.py` explica ahora cuándo deja de valer un permiso: retirado por el profesor o, con una llave propia en modo de prueba, a los 7 días; con la app publicada no caduca solo.
    - **Para T17:** la fila de *"No se completó el permiso de Google…"* en "Problemas frecuentes" del README todavía manda añadir la cuenta en **Usuarios de prueba**; hay que cambiarla por el aviso de app no verificada y la llave propia.

## Fase D · Panel (plan §2.6, §2.9, §2.10)

- [x] **T10** 🧪 · Interruptor "Clase online", versión y guardar en la ventana en `profesor.html`, `profesor.js` y `styles.css`:
  - tests en `test_static.py`: existe el botón `#online-toggle` con `aria-pressed`; el estado va en una zona `role="status"`; ya no está `#local-warning`; `profesor.js` llama a `/api/app` y `/api/online` por su única función de API (U3) y usa `window.pywebview.api.save_file` solo si existe;
  - deben fallar; luego, el código: estados "Abriendo…", "Activa" y "Desactivada: tus alumnos no pueden entrar desde fuera de este ordenador"; versión en el pie; `downloadCsv` con la rama de la ventana (lee la exportación como texto y la pasa a `save_file`).
  - Comprobar en Chrome desde el código (sin ventana), con un `cloudflared` falso: el interruptor, sus tres estados y un error; a 400 px y con teclado (P5).
  - *Cubre:* CA-04, CA-07, CA-08, CA-09, CA-17.
  - **Hecha (2026-11-05):** 9 tests nuevos en `test_static.py`; fallaron los 7 que dependían del cambio y los otros 2 (un solo `fetch`, el `h1` primero) quedan como red. 583 tests en verde; `ruff` y `mypy` sin avisos.
    - `profesor.html`: la tarjeta **"Clase online"** (`#online`, con `#online-toggle` con `aria-pressed` y `#online-status` con `role="status"` y `aria-live`) sustituye a `#local-warning`; pie con "Versión <span id=\"app-version\">". El título de la tarjeta es un `<p class="online-title">` con aspecto de `h2`, porque la tarjeta va antes del `h1` de cada vista (U4; test).
    - `profesor.js`: `loadAppInfo()` (`/api/app`: versión y estado) y el interruptor (`POST`/`DELETE /api/online`), todo por `api()` (U3). Estados "Abriendo…" (botón desactivado), "Activa…" (verde), "Desactivada…" (aviso, CA-09) y el error del servidor (CA-08). El interruptor solo se muestra en la dirección local: abierto desde el túnel (arrancada con `--tunel`), cerrar la clase online cortaría el propio panel. `downloadCsv` usa `window.pywebview.api.save_file` si existe y, si no, la descarga de siempre.
    - `styles.css`: fila de la tarjeta (se parte a 400 px), estado y pie.
    - **Comprobado en Chrome** con un servidor de vista previa (fuera del proyecto) con la app de escritorio, el `Tunnel` de verdad y un `cloudflared` falso: estado inicial y versión; "Abriendo…" → "Activa…"; abrir una clase y ver su enlace de alumnos con la dirección del túnel; cerrar con el **teclado** (foco y Enter): `aria-pressed="false"`, aviso y el enlace vuelve a `127.0.0.1`; error de `cloudflared` con su mensaje; a **400 px** (en un `iframe`, como en la spec 006): sin desplazamiento horizontal y botón de 45 px de alto. Servidor parado y puerto libre.
    - **Queda para T13** (en la ventana de verdad): guardar el CSV con `save_file`. **Para T12/T17:** el mensaje "Enlace del panel no válido… aparece en la terminal" no tiene sentido en la app de escritorio, que no tiene terminal.

## Fase E · Escritorio (plan §2.2, §2.7, §2.9)

- [x] **T11** 🧪 · `entrypoints/desktop.py`:
  - tests en `test_desktop.py` con una ventana y un diálogo falsos (sin abrir nada): abrir el túnel pone `confirm_close` a `True` y cerrarlo a `False`, y los textos de cierre están en español (plan v1.1 §2.7); la ventana se crea con `text_select=True`; `DesktopApi.save_file` escribe el contenido en `utf-8-sig` en la ruta elegida y devuelve `True`, y si se cancela devuelve `False` sin escribir;
  - `webview` se importa dentro de las funciones (plan §5);
  - deben fallar; luego, el código, con `run_window` y `show_already_open`.
  - *Cubre:* CA-03, CA-10, CA-11, CA-17.
  - **Hecha (2026-11-05):** 20 tests en el nuevo `test_desktop.py` (fallaron al no existir el módulo), con un módulo `webview` falso (externo, T4) y el `Tunnel` de verdad con el `cloudflared` falso. 603 tests en verde; `ruff` y `mypy` sin avisos.
    - `watch_close(window, tunnel)`: registra en `tunnel.on_change` una función que pone `window.confirm_close`; también si la clase online ya estaba abierta (con `--tunel`). `CLOSE_TEXTS` con los textos en español.
    - `DesktopApi(save_dialog)`: `attach(window)` y `save_file(filename, content)`: diálogo nativo con el nombre sugerido, escribe con `utf-8-sig`; `False` si se cancela, si no hay ventana o si lo que llega de la página no es texto (E1). Acepta la ruta como texto o como tupla, según el sistema.
    - `run_window(url, tunnel)`: ventana de 1000 × 760 (mínimo 400 × 560), `text_select=True`, `localization=CLOSE_TEXTS` y la API; `show_already_open(message)`: ventana pequeña con el mensaje escapado (X4).
    - `webview` se importa dentro de las funciones; para los tipos, `Window` de pywebview solo con `TYPE_CHECKING` (sin `Protocol`, §12).
    - **Adelantado de T14:** `pywebview` (app) y `pyinstaller` (empaquetado) en `requirements.txt`, porque `desktop.py` ya usa los tipos de pywebview y `mypy` lo necesita. Su justificación ya está en plan §7.1.
- [x] **T12** 🧪 · Modo escritorio en `app.py` (plan §2.2):
  - tests en `test_app.py`: con `--ventana` o `sys.frozen` se elige el modo escritorio; sin ellos, el arranque de siempre; `--tunel` abre el `Tunnel`; en el modo escritorio, el `finally` cierra el túnel, para el servidor y suelta el bloqueo aunque la ventana falle (con piezas falsas);
  - `main()` se divide en `_run_terminal` y `_run_desktop` (M2);
  - deben fallar; luego, el código.
  - *Cubre:* CA-12, CA-13, CA-18.
  - **Hecha (2026-11-05):** 12 tests nuevos en `test_app.py` (11 de escritorio y 1 de la terminal) y 1 en `test_tunnel.py`; fallaron los 10 que dependían del cambio y los de `--ventana` combinada quedan como red. Los tests de escritorio ejecutan `main()` de verdad con el `webview` falso y el usuario en `tmp_path`, y piden el panel al servidor real mientras la "ventana" está abierta. 615 tests en verde; `ruff` y `mypy` sin avisos.
    - `main()` elige: con `--ventana` o `sys.frozen`, `_run_desktop()`; si no, `_run_terminal(args)` (lo de siempre).
    - `_run_desktop()`: `load_config(desktop=True, bundle=sys._MEIPASS o None)` y `instance.acquire`; si fallan (`ConfigError`, `AlreadyRunningError`), `desktop.show_message` y sale. Luego `_open_desktop()`: `Tunnel(port=0)`, `create_app(desktop=True)`, `server.start` con `with`, `tunnel.port = running.port`, `desktop.run_window(panel, tunnel)` y, en `finally`, `tunnel.close()`, el servidor y el bloqueo (probado también con la ventana fallando).
    - La terminal también usa `Tunnel`: `--tunel` lo abre al arrancar y el panel puede abrir la clase online después.
    - **Cambios pequeños fuera de `app.py`:** `Tunnel.port` pasa a ser público y modificable (el puerto se sabe al arrancar el servidor, que necesita antes la app con el túnel); `desktop.show_already_open` pasa a `show_message`, porque también enseña los errores de configuración; `--ventana` no se combina con `--tunel` ni `--meet` (`parser.error`).
    - Tests: el `cloudflared` falso de `test_app.py` pasa a ser el de `conftest.py` (el que necesita `Tunnel`), y el `webview` falso de `test_desktop.py` pasa a `conftest.py`, con `on_start` para actuar "con la ventana abierta".
- [x] **T13** 👤 · Prueba a mano en el Mac desde el código (`python app.py --ventana`):
  - abrir la clase online y registrarse desde un móvil con datos (CA-07); cerrar con clase online y cancelar, luego confirmar (CA-10); cerrar sin clase online (CA-11); tras cerrar, ni la app ni `cloudflared` siguen en marcha (CA-12); una asistencia abierta sigue al volver (CA-13); guardar el CSV y abrirlo en Excel o Numbers (CA-17); abrir dos veces (CA-03).
  - *Cubre:* CA-03, CA-07, CA-10 a CA-13, CA-17 (en macOS).
  - **Hecha (2026-11-05):** Victor la hizo con `python app.py --ventana` (lanzada por el agente; el `cloudflared` de Homebrew) y confirmó que **todo funciona como se espera**: registro desde el móvil con datos por la clase online, diálogo de guardar el CSV, confirmación al cerrar con clase online ("Cancelar" y "Cerrar"), cierre sin preguntar sin ella, la asistencia abierta sigue al volver a abrir y la segunda copia avisa de que ya está abierta.
    - **CA-12** comprobado por el agente al terminar: ningún proceso de la app ni de `cloudflared`, el puerto del bloqueo (47913) y el del servidor (49868) libres, y la app terminó con código 0 sin errores en su salida.
    - Pendiente para T16: que el permiso de Google no caduque a los 7 días (CA-15); este mismo recorrido en Windows.

## Fase F · Empaquetado y publicación (plan §2.11)

- [x] **T14** · Receta de PyInstaller y `requirements.txt` (plan §2.11, §5):
  - `requirements.txt`: `pywebview` (app) y `pyinstaller` (empaquetado);
  - `AsistenciApp.spec`: `static/`, la llave (desde un archivo que no está en git) y `cloudflared`; `--windowed --onedir`; icono;
  - compilar el `.app` en el Mac de Victor y comprobar: tamaño < 100 MB, panel en < 10 s, datos en `~/Library/Application Support/AsistenciApp/`, "Abrir igualmente" la primera vez.
  - *Cubre:* CA-01, CA-02, CA-05 (en macOS) y los requisitos no funcionales.
  - **Hecha (2026-11-05):** `AsistenciApp.spec` en la carpeta de la app. Lee de fuera `ASISTENCIA_BUILD_CLOUDFLARED` (obligatoria) y `ASISTENCIA_BUILD_GOOGLE_CLIENT` (opcional, debe llamarse `google-client.json`; sin ella avisa de que no habrá Meet), mete `static/`, la llave y `cloudflared`, quita las herramientas de desarrollo y, en macOS, crea el `.app` con la versión de `attendance/__init__.py`, el identificador `io.github.changvictor.asistenciapp` y macOS 14 como mínimo. `build/` y `dist/` en `.gitignore`. `pywebview` y `pyinstaller` ya estaban en `requirements.txt` desde T11.
    - Compilado en el Mac de Victor (con el `cloudflared` 2026.10.7 comprobado en T01 y su llave de Google): `AsistenciApp.app` de **78 MB** (37 MB de `cloudflared`), firma *ad hoc*; `AsistenciApp-1.0.0-macos.dmg` de **41 MB**.
    - Arranque automático con `HOME` en una carpeta temporal: el panel responde en **1,5 s** la primera vez y **0,4 s** después; sirve `profesor.html`, `styles.css`, las letras y `alumno.html`; la base de datos se crea en `~/Library/Application Support/AsistenciApp/`; al cerrarla no queda ningún proceso.
    - **Victor** abrió el `.dmg` marcado como descargado, lo arrastró a Aplicaciones y con "Abrir igualmente" (macOS pidió su contraseña) la app se abrió bien. También tomó asistencia de Meet **desde la app empaquetada**, con la llave incluida y el permiso de Google de siempre (CA-14 en la app de verdad).
    - **Icono** (opción c de Victor): "A_", la inicial de la marca "AsistenciApp_" con su cursor rojo (`--brand-mark`), en el fondo oscuro de la cabecera (`#0b0b0b`) y con Montserrat 800 de la propia app, en el cuadrado redondeado de 824 px de los iconos de macOS. El diseño está en `icono/icono.html`; `scripts/generar_icono.py` (solo macOS, sin dependencias nuevas: Chrome sin ventana, `sips` e `iconutil`) genera `icono/AsistenciApp.png` (1024 px), `AsistenciApp.icns` y `AsistenciApp.ico` (7 tamaños, con PNG dentro). Los tres se suben a git para que Actions no necesite Chrome. La receta los usa (`EXE(icon=…)` y `BUNDLE(icon=…)`); comprobado en `Info.plist` y legible a 32 px.
- [ ] **T15** 👤 · Repositorio público y primera *Release*:
  - **Victor:** crear el repositorio público `ChangVictor/asistenciapp` (vacío) y su secreto de Actions `GOOGLE_CLIENT_JSON` con la llave.
  - `scripts/publicar.sh` (copia con `git subtree split` y empuja `main` y la etiqueta) y `.github/workflows/publicar.yml` (trabajos de macOS y Windows de plan §2.11, comprobación de la versión, *Release* con los dos archivos).
  - Publicar `v1.0.0-rc1`; comprobar que se crean `AsistenciApp-1.0.0-rc1-macos.dmg` y `AsistenciApp-1.0.0-rc1-windows.zip`, y que una etiqueta que no coincide con `__version__` hace fallar el flujo.
  - *Cubre:* CA-01, CA-04.
- [ ] **T16** 👤 · Prueba en Windows (decisión §8.7):
  - un compañero con Windows (o una máquina virtual de Windows 11) descarga el `.zip` de la *Release*, lo descomprime y abre `AsistenciApp.exe` siguiendo la página de descarga;
  - repite las filas #1, #2, #4 y #6 del spike (plan §0) y la lista de T13 en Windows, y la toma de Meet con una cuenta que nunca ha dado permiso (CA-14).
  - *Cubre:* CA-01, CA-02, CA-03, CA-05, CA-07, CA-10 a CA-12, CA-14, CA-17 (en Windows).

## Fase G · Cierre

- [ ] **T17** · README:
  - sección nueva "Descargar la app": macOS ("Abrir igualmente" en Privacidad y seguridad) y Windows ("Más información → Ejecutar de todas formas"), con capturas; el aviso de Google de app no verificada y cómo continuar; qué hacer si Google dice que se alcanzó el límite de usuarios (llave propia, CA-16); cómo copiar `asistencia.db` desde `data/` (decisión §8.8);
  - sección "Publicar una versión" (para Victor): subir `__version__`, `scripts/publicar.sh`, revisar la *Release*;
  - §2 explica `--ventana`; las notas de la *Release* enlazan a "Descargar la app".
  - *Cubre:* CA-02, CA-15, CA-16.
- [ ] **T18** · Comprobación final:
  - AGENT.md: estado y estructura de carpetas (`desktop.py`, `online.py`, `server.py`, `instance.py`, `.github/`, `scripts/`) y comandos (`--ventana`, compilar);
  - lista de comprobación de `ARCHITECTURE.md` (§13) y de la constitución (plan §7);
  - cada `CA-xx` con su test o su verificación manual hecha (plan §6);
  - borrar `scripts/spike_escritorio.py`;
  - publicar `v1.0.0` y Victor la da por buena.
  - *Cubre:* todos.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-04 | Borrador inicial: 18 tareas en 7 fases | Plan 007 v1.0 aprobado por Victor |
| 1.0 | 2026-11-04 | Aprobado por Victor | — |
| 1.1 | 2026-11-05 | T01 hecha; T11 prueba la confirmación nativa al cerrar y el texto seleccionable | Plan v1.1 (spike) |
