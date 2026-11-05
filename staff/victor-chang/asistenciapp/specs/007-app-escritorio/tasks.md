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

- [ ] **T02** 🧪 · Configuración por sistema en `config.py` (plan §2.3):
  - tests en `test_config.py`: `load_config(environ, desktop=True, platform=…, home=…)` da las rutas de la carpeta del usuario en `darwin` y en `win32` (con `APPDATA`); sin `desktop`, las de `data/` como hoy; las variables `ASISTENCIA_*` mandan en los dos casos; la llave propia de la carpeta del usuario va antes que la incluida; `cloudflared_path` es `None` desde el código y el binario incluido en escritorio;
  - deben fallar; luego, el código.
  - *Cubre:* CA-05, CA-06, CA-16, CA-18.
- [ ] **T03** 🧪 · `infra/server.py` (plan §2.4):
  - tests en `test_server.py`: `start(app)` da un puerto distinto de 0 en el que responde la app; `stop()` lo libera (se puede volver a abrir) y el hilo termina;
  - deben fallar; luego, el código.
  - *Cubre:* CA-12.
- [ ] **T04** 🧪 · `infra/instance.py` (plan §2.5):
  - tests en `test_instance.py` (con un puerto de bloqueo libre elegido por el test): un segundo `acquire` lanza `AlreadyRunningError` con su mensaje; tras soltar el primero, `acquire` vuelve a funcionar; `ASISTENCIA_LOCK_PORT` cambia el puerto;
  - deben fallar; luego, el código.
  - *Cubre:* CA-03.
- [ ] **T05** 🧪 · Clase `Tunnel` en `infra/tunnel.py` (plan §2.6):
  - tests en `test_tunnel.py` con un `cloudflared` falso (un script que imprime una URL y espera): `open` dos veces → un solo proceso y la misma URL; `close` termina el proceso y deja `url` en `None`; `close` sin abrir no falla; si el proceso no sale en 5 s, se mata; `start_tunnel` usa el ejecutable que recibe y, con `None`, el del `PATH` como hoy; en Windows se pasa `CREATE_NO_WINDOW`;
  - deben fallar; luego, el código. Los tests de hoy de `start_tunnel` siguen en verde.
  - *Cubre:* CA-07, CA-12.

## Fase C · Entrada web (plan §2.6, §2.8, §2.12, §4)

- [ ] **T06** 🧪 · `auth.py` con `PRIVATE_PREFIXES`, y `create_app` / `WebContext` con `tunnel` y `desktop` (plan §4):
  - tests: `/api/online` y `/api/app` sin token → `401`; `/api/sessions` sigue protegido; las rutas públicas siguen abiertas;
  - deben fallar; luego, el código.
  - *Cubre:* base de CA-04 y CA-07 (§6 de la constitución).
- [ ] **T07** 🧪 · `entrypoints/web/online.py` y errores de túnel en `errors.py` (plan §4, §2.12):
  - tests en `test_web_online.py` con un `Tunnel` falso: `GET /api/app` → `version` (= `__version__`), `desktop` y `online.active`; `POST /api/online` → `active` y `url`, y la segunda vez la misma URL; `DELETE /api/online` → `active: false`, también si ya estaba cerrada; `TunnelTimeoutError` y `TunnelExitedError` → `502`, `CloudflaredMissingError` → `422`, con su mensaje en JSON (F3);
  - `attendance/__init__.py` gana `__version__ = "1.0.0"`;
  - deben fallar; luego, el código.
  - *Cubre:* CA-04, CA-07, CA-08.
- [ ] **T08** 🧪 · Enlace de alumnos con la URL del túnel en `teacher.py` (plan §2.6):
  - tests en `test_web_teacher.py`: con clase online, `studentUrl` empieza por la URL del túnel; sin ella, por `request.host_url` como hoy;
  - deben fallar; luego, el código.
  - *Cubre:* CA-07.
- [ ] **T09** 🧪 · Mensajes de Google para la llave compartida (plan §2.8):
  - test: el mensaje de `MeetLoginNotCompletedError` incluye la frase del tope de usuarios y dónde dejar la llave propia;
  - el comentario de `google_auth.py` sobre la caducidad semanal (spec 004 P7) pasa a decir que en producción el permiso no caduca;
  - debe fallar; luego, el código.
  - *Cubre:* CA-15, CA-16.

## Fase D · Panel (plan §2.6, §2.9, §2.10)

- [ ] **T10** 🧪 · Interruptor "Clase online", versión y guardar en la ventana en `profesor.html`, `profesor.js` y `styles.css`:
  - tests en `test_static.py`: existe el botón `#online-toggle` con `aria-pressed`; el estado va en una zona `role="status"`; ya no está `#local-warning`; `profesor.js` llama a `/api/app` y `/api/online` por su única función de API (U3) y usa `window.pywebview.api.save_file` solo si existe;
  - deben fallar; luego, el código: estados "Abriendo…", "Activa" y "Desactivada: tus alumnos no pueden entrar desde fuera de este ordenador"; versión en el pie; `downloadCsv` con la rama de la ventana (lee la exportación como texto y la pasa a `save_file`).
  - Comprobar en Chrome desde el código (sin ventana), con un `cloudflared` falso: el interruptor, sus tres estados y un error; a 400 px y con teclado (P5).
  - *Cubre:* CA-04, CA-07, CA-08, CA-09, CA-17.

## Fase E · Escritorio (plan §2.2, §2.7, §2.9)

- [ ] **T11** 🧪 · `entrypoints/desktop.py`:
  - tests en `test_desktop.py` con una ventana y un diálogo falsos (sin abrir nada): abrir el túnel pone `confirm_close` a `True` y cerrarlo a `False`, y los textos de cierre están en español (plan v1.1 §2.7); la ventana se crea con `text_select=True`; `DesktopApi.save_file` escribe el contenido en `utf-8-sig` en la ruta elegida y devuelve `True`, y si se cancela devuelve `False` sin escribir;
  - `webview` se importa dentro de las funciones (plan §5);
  - deben fallar; luego, el código, con `run_window` y `show_already_open`.
  - *Cubre:* CA-03, CA-10, CA-11, CA-17.
- [ ] **T12** 🧪 · Modo escritorio en `app.py` (plan §2.2):
  - tests en `test_app.py`: con `--ventana` o `sys.frozen` se elige el modo escritorio; sin ellos, el arranque de siempre; `--tunel` abre el `Tunnel`; en el modo escritorio, el `finally` cierra el túnel, para el servidor y suelta el bloqueo aunque la ventana falle (con piezas falsas);
  - `main()` se divide en `_run_terminal` y `_run_desktop` (M2);
  - deben fallar; luego, el código.
  - *Cubre:* CA-12, CA-13, CA-18.
- [ ] **T13** 👤 · Prueba a mano en el Mac desde el código (`python app.py --ventana`):
  - abrir la clase online y registrarse desde un móvil con datos (CA-07); cerrar con clase online y cancelar, luego confirmar (CA-10); cerrar sin clase online (CA-11); tras cerrar, ni la app ni `cloudflared` siguen en marcha (CA-12); una asistencia abierta sigue al volver (CA-13); guardar el CSV y abrirlo en Excel o Numbers (CA-17); abrir dos veces (CA-03).
  - *Cubre:* CA-03, CA-07, CA-10 a CA-13, CA-17 (en macOS).

## Fase F · Empaquetado y publicación (plan §2.11)

- [ ] **T14** · Receta de PyInstaller y `requirements.txt` (plan §2.11, §5):
  - `requirements.txt`: `pywebview` (app) y `pyinstaller` (empaquetado);
  - `AsistenciApp.spec`: `static/`, la llave (desde un archivo que no está en git) y `cloudflared`; `--windowed --onedir`; icono;
  - compilar el `.app` en el Mac de Victor y comprobar: tamaño < 100 MB, panel en < 10 s, datos en `~/Library/Application Support/AsistenciApp/`, "Abrir igualmente" la primera vez.
  - *Cubre:* CA-01, CA-02, CA-05 (en macOS) y los requisitos no funcionales.
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
