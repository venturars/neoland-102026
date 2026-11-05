# Plan técnico 007 · App de escritorio para el profesor

> Versión 1.3 · Estado: **Pendiente de aprobación** (2026-11-05; v1.2 aprobada) · Spec: [spec.md](spec.md) v1.1 · Arquitectura: [ARCHITECTURE.md](../../ARCHITECTURE.md) v1.1 · Constitución v3.2 · Creado: 2026-11-04 · Issue: #919

Este documento explica **cómo** se empaqueta AsistenciApp como app de escritorio para macOS (Apple Silicon) y Windows x64 sin cambiar sus reglas. El escritorio es **una entrada nueva** (C3): una ventana que muestra el mismo panel y llama a los mismos casos de uso. Dominio, casos de uso y base de datos no cambian. Las reglas se citan por su identificador (`C2`, `F4`…).

---

## 0. Riesgo principal: verificarlo antes de construir

Hay cosas que solo se saben probándolas en la app empaquetada. La primera tarea es una prueba de concepto (*spike*, T01) en el Mac de Victor, con un `.app` mínimo (Flask + ventana + `cloudflared`):

| # | Qué se comprueba | Si falla |
| --- | --- | --- |
| 1 | La descarga del CSV con el diálogo nativo de §2.9 guarda el archivo con su BOM | Se revisa §2.9 |
| 2 | El inicio de sesión de Google (`run_local_server`) abre el navegador del sistema desde la app empaquetada y vuelve a ella | Se para y se revisa la spec (CA-14) |
| 3 | La llave publicada **en producción sin verificar** funciona con una cuenta que **no** es de prueba: aviso de Google, permiso concedido y sin caducidad semanal | Se para y se revisa la spec (CA-15) |
| 4 | El `cloudflared` incluido arranca desde dentro del `.app` y da su URL | Se revisa §2.6 |
| 5 | macOS ofrece "Abrir igualmente" en Privacidad y seguridad para el `.app` con firma *ad hoc* | Se revisa §2.11 y la página de descarga |
| 6 | Tamaño de la descarga (< 100 MB) y tiempo hasta ver el panel (< 10 s) | Se revisa §2.11 (`--onedir`, exclusiones) |

En Windows las comprobaciones 1, 2, 4 y 6 se repiten con la primera compilación de Actions (T16), en un PC con Windows (decisión §8.7).

**Resultado (2026-11-05): las seis pasan en macOS, y la puerta se pasa.** Detalle en `tasks.md`, T01. Lo que mostró, y que esta versión del plan ya aplica:

| # | Hallazgo | Dónde se aplica |
| --- | --- | --- |
| 1 | Guardar por el diálogo nativo y la descarga del navegador (con `ALLOW_DOWNLOADS`) **funcionan los dos** en macOS y preguntan dónde guardar; el BOM se conserva | §2.9 sin cambios: el diálogo nativo es el que se sabe igual en Windows |
| 2 | Una cuenta que **nunca** fue de prueba da permiso con la app en producción sin verificar, tras el aviso de Google; la API de Meet responde `200` | §2.8 |
| 3 | Google no muestra casilla de Meet cuando solo se pide ese permiso; si se deniega, llega solo `openid` (ya lo trata `MeetPermissionMissingError`) | Sin cambios |
| 4 | Abrir un diálogo desde el evento `closing` **congela la app** (los dos esperan al hilo principal) | §2.7: se usa la confirmación nativa de pywebview |
| 5 | pywebview no deja seleccionar texto por defecto (`text_select=False`) | §2.2: ventana con `text_select=True` |
| 6 | La suma SHA-256 del `.tgz` de macOS en las notas de `cloudflared` no coincide con el archivo, que sí es auténtico (Developer ID de Cloudflare, notarizado); la de Windows sí coincide | §2.11 |
| 7 | La primera consulta DNS a la URL del túnel llega antes de que exista y macOS guarda el "no existe": la app no debe comprobar su propia URL | §2.6 (no se comprueba) |
| 8 | Abierta desde la carpeta de descargas, macOS la ejecuta desde una ruta aleatoria de solo lectura (*App Translocation*) | §2.11: la página de descarga dice "arrástrala a Aplicaciones" |
| 9 | 40 MB el `.dmg`; ventana en 0,8–2,7 s (hasta 10 s la primera vez tras compilar) | Sin cambios |

Para publicar la app de Google en producción, Google exige nombre, email de soporte, página principal y política de privacidad: se publicaron en GitHub Pages del repositorio público (§2.8).

---

## 1. Visión general

```
 doble clic ─► app.py (modo escritorio: empaquetada o --ventana)
                 │ 1. una sola instancia (infra/instance.py)       ── si ya hay otra: aviso y sale (CA-03)
                 │ 2. Config con las rutas del usuario (config.py)  ── data/ al ejecutar desde el código (CA-18)
                 │ 3. servidor Flask en un hilo, puerto libre (infra/server.py)
                 │ 4. Tunnel sin abrir (infra/tunnel.py)            ── se abre desde el panel (CA-07)
                 ▼
          entrypoints/desktop.py ── ventana pywebview ──► http://127.0.0.1:<puerto>/profesor.html#t=<token>
                 │   · al cerrar: si hay clase online, confirmar (CA-10, CA-11)
                 │   · "Descargar lista": diálogo nativo de guardar (CA-17)
                 ▼
          al cerrarse la ventana: cierra el túnel, para el servidor, suelta el bloqueo (CA-12)
```

- **Sin la ventana todo sigue igual**: `python app.py`, `--tunel` y `--meet` funcionan como hoy (CA-18). `--tunel` pasa a abrir el mismo `Tunnel` que el botón del panel.
- El modo Meet ya existe en el panel (selector de modo, enlace de la reunión y `meet-sync`, spec 004). Lo único nuevo en el panel es **"Clase online"** y la versión.

---

## 2. Decisiones clave

### 2.1 Dónde va cada pieza (C1, C3, O1)

| Pieza | Capa | Archivo |
| --- | --- | --- |
| Elegir el modo escritorio y montar las piezas | arranque | `app.py` |
| Rutas por sistema (carpeta del usuario, llave incluida) | configuración | `attendance/config.py` |
| Ventana, cierre con confirmación, guardar el CSV | entrada | `attendance/entrypoints/desktop.py` (NUEVO) |
| Rutas de la clase online y de la versión | entrada | `attendance/entrypoints/web/online.py` (NUEVO) |
| Túnel con estado: abrir, cerrar, URL actual | infraestructura | `attendance/infra/tunnel.py` (clase `Tunnel`) |
| Servidor en un hilo que se puede parar | infraestructura | `attendance/infra/server.py` (NUEVO) |
| Bloqueo de una sola instancia | infraestructura | `attendance/infra/instance.py` (NUEVO) |

Ni `domain/` ni `usecases/` cambian.

### 2.2 Modo escritorio en `app.py` (C4)

`app.py` sigue siendo el único punto de montaje. Entra en modo escritorio si `getattr(sys, "frozen", False)` (lo pone PyInstaller) o con la opción nueva `--ventana` (para probarlo desde el código). En modo escritorio:

1. toma el bloqueo de instancia (§2.5);
2. `load_config(os.environ, desktop=True)` (§2.3);
3. `create_app(config, fetch_participants=…, tunnel=tunnel)`;
4. `server.start(app)` → puerto (§2.4);
5. `desktop.run_window(url_del_panel, tunnel)`: ventana con `text_select=True` (el enlace de alumnos se puede seleccionar; spike §0 #5) y los textos del cierre en español (§2.7); vuelve cuando se cierra la ventana;
6. en un `finally`: `tunnel.close()`, `server.stop()`, soltar el bloqueo (S7, F4).

`main()` se divide en `_run_terminal()` (lo de hoy) y `_run_desktop()` para no pasar de ~40 líneas (M2).

**Siempre en claro (CA-19, v1.2).** La ventana abre `profesor.html?tema=claro#t=…`: en la consulta y no en el fragmento, para que no se pierda al navegar ni al recargar. `static/tema.js`, cargado en el `<head>` del panel **sin `defer`** (se aplica antes de pintar, sin parpadeo), pone `data-tema="claro"` en `<html>`, y el bloque oscuro de `styles.css` pasa a `:root:not([data-tema="claro"])`. En un navegador y en las páginas de los alumnos no hay parámetro: siguen el modo del sistema, como pide la spec 006 (CA-06).

### 2.3 Configuración por sistema (CA-05, CA-06, CA-18; F5)

`load_config(environ, desktop=False, platform=sys.platform, home=Path.home())`: los dos últimos parámetros existen para los tests.

| Valor | Desde el código (como hoy) | Escritorio |
| --- | --- | --- |
| Carpeta de datos | `data/` del proyecto | macOS: `~/Library/Application Support/AsistenciApp/` · Windows: `%APPDATA%\AsistenciApp\` |
| `db_path` | `data/asistencia.db` | `<carpeta>/asistencia.db` |
| `google_token_path` | `data/google-token.json` | `<carpeta>/google-token.json` |
| `google_client_path` | `data/google-client.json` | `<carpeta>/google-client.json` si existe (llave propia, CA-16); si no, la incluida en la app (§2.8) |
| `cloudflared_path` (NUEVO) | `None`: se busca en el `PATH`, como hoy | el binario incluido en la app (`sys._MEIPASS`) |

- Las variables `ASISTENCIA_*` siguen mandando sobre todo lo anterior.
- Sin dependencia nueva para las carpetas: son dos rutas fijas por sistema (P2, P3).
- Un `.app` o una carpeta nueva al actualizar no tocan la carpeta del usuario: los datos sobreviven (CA-05).
- En Windows, `%APPDATA%` ya es privada del usuario; el `chmod 0600` del permiso de Google no hace nada allí y no falla.

### 2.4 Servidor en un hilo con puerto libre (Q16, CA-12)

`infra/server.py`: `start(app) -> RunningServer` crea `werkzeug.serving.make_server("127.0.0.1", 0, app, threaded=True)`, lo lanza en un hilo y devuelve el puerto que eligió el sistema. `RunningServer.stop()` llama a `shutdown()` y espera al hilo. Puerto 0 sin carrera: el sistema lo asigna al abrir el socket. Sigue escuchando solo en local (X6). En modo escritorio no se usa `PORT` ni `port_in_use`.

### 2.5 Una sola instancia (CA-03)

`infra/instance.py`: `acquire() -> InstanceLock` abre un socket en `127.0.0.1:47913` (constante `LOCK_PORT`) sin `SO_REUSEADDR`. Si ya está ocupado, lanza `AlreadyRunningError` ("AsistenciApp ya está abierta. Búscala en el Dock o en la barra de tareas."), y `app.py` lo muestra en una ventana pequeña y sale.

- **Por qué un socket y no un archivo de bloqueo**: el sistema lo suelta solo si la app se cuelga o se mata, y es el mismo código en macOS y Windows (los bloqueos de archivo son `fcntl` en uno y `msvcrt` en otro).
- Límite conocido: si otro programa usa justo ese puerto, la app diría que ya está abierta. Se acepta (puerto alto y poco común); se puede cambiar con `ASISTENCIA_LOCK_PORT`.

### 2.6 Clase online desde el panel (CA-07, CA-08, CA-09; F4)

`infra/tunnel.py` gana la clase `Tunnel` (M3: guarda el proceso entre operaciones), que usa el `start_tunnel` de hoy:

- `Tunnel(executable, port)`: `executable` sale de `Config.cloudflared_path`.
- `open() -> str`: si ya está abierto, devuelve la URL; si no, `start_tunnel` (tiempo máximo de 30 s, errores con nombre de hoy). Un `threading.Lock` evita dos `cloudflared` por dos clics seguidos.
- `close()`: termina el proceso y espera como mucho 5 s; si no sale, lo mata. No falla si ya está cerrado.
- `url` (propiedad): la URL pública o `None`.
- En Windows, `cloudflared` se lanza con `CREATE_NO_WINDOW` para que no aparezca una consola.
- `start_tunnel` recibe el ejecutable por parámetro; si es `None`, `shutil.which` como hoy.

**Enlace de alumnos.** Hoy sale de `request.host_url`, que en la ventana sería `127.0.0.1`. Pasa a ser `tunnel.url` si hay clase online y, si no, `request.host_url` como hoy (con `--tunel` y el panel abierto desde el túnel, las dos coinciden).

**Panel.** El aviso `#local-warning` se sustituye por un interruptor **"Clase online"** con su estado ("Abriendo…", "Activa", "Desactivada: tus alumnos no pueden entrar desde fuera de este ordenador", CA-09) y el error en `role="status"` si falla (CA-08).

### 2.7 Cerrar la app (CA-10 a CA-13)

Se usa la **confirmación nativa** de pywebview, que macOS y Windows leen en el momento de cerrar (`window.confirm_close`). **No** se abre un diálogo propio desde el evento `closing`: en el spike eso congeló la app (§0 #4).

- `Tunnel` avisa de cada cambio (`on_change`, una lista de funciones); `desktop.run_window` registra una que pone `window.confirm_close = tunnel.url is not None`. Con clase online, pregunta; sin ella, no (CA-11).
- Los textos van en `localization` de `create_window`: `global.quitConfirmation` = "Los alumnos no podrán registrarse. ¿Cerrar igualmente?", `global.quit` = "Cerrar", `global.cancel` = "Cancelar" (P6).

Al volver `webview.start()`, el `finally` de §2.2 cierra todo (CA-12). Una asistencia abierta sigue en la base de datos y se continúa al volver a abrir (CA-13, ya es así hoy).

### 2.8 Llave de Google compartida (CA-14, CA-15, CA-16)

- Un solo proyecto de Google Cloud (el de Victor), con la app de OAuth **en producción sin verificar** y una llave de tipo *aplicación de escritorio*. Google trata estas llaves como no secretas, pero no se sube a git (F5).
- **Publicada el 2026-11-05.** Google pide para ello nombre (`AsistenciApp`), email de soporte, página principal y política de privacidad. Las dos páginas son de GitHub Pages del repositorio público: `https://changvictor.github.io/asistenciapp/` (el README) y `…/PRIVACIDAD.html` (`PRIVACIDAD.md`, en esta carpeta). `changvictor.github.io` es dominio autorizado. Sin logotipo: subirlo obliga a la verificación.
- La llave vive en el **secreto de Actions `GOOGLE_CLIENT_JSON`** del repositorio público (§2.11). El flujo de compilación la escribe en un archivo y PyInstaller la mete en la app (`--add-data`).
- `GooglePermission` no cambia: ya renueva el permiso y ya vuelve a pedirlo si falla. En producción el permiso no caduca a los 7 días (CA-15); el comentario de spec 004 P7 se actualiza.
- **Tope de 100 profesores (CA-16)**: cuando se alcanza, Google muestra su error en el navegador y la app no recibe respuesta, así que acaba en `MeetLoginNotCompletedError` a los 2 minutos. Su mensaje gana una frase: "Si Google dice que la app ha alcanzado su límite de usuarios, usa tu propia llave (README §4.1) y guárdala en la carpeta de datos de la app." El modo *código* no depende de Google.

### 2.9 Guardar el CSV (CA-17)

En la ventana no se usa la descarga del navegador (las vistas web incrustadas no la tratan igual que un navegador). `desktop.py` expone a la página la API `DesktopApi.save_file(filename, content) -> bool` (`js_api` de pywebview), que abre el diálogo nativo de guardar (`create_file_dialog(SAVE_DIALOG, save_filename=…)`) y escribe con `utf-8-sig`, con el mismo BOM que hoy (`infra/export.py`). `downloadCsv` en `profesor.js` usa `window.pywebview.api.save_file` si existe y, si no, la descarga de siempre. El contenido sigue saliendo de la misma ruta `export` (sin reglas nuevas).

### 2.10 Versión (CA-04)

`attendance/__init__.py` gana `__version__ = "1.0.0"`. El panel la muestra en el pie, leída de `GET /api/app` (§4). El flujo de compilación comprueba que la etiqueta (`v1.0.0`) coincide con `__version__` antes de publicar.

### 2.11 Compilar y publicar (CA-01, CA-02; constitución §7)

- **Repositorio público propio** `ChangVictor/asistenciapp`, copia de esta carpeta. `scripts/publicar.sh` (en esta carpeta) hace `git subtree split --prefix=staff/victor-chang/asistenciapp` y empuja el resultado a la rama `main` de ese repositorio, más la etiqueta `vX.Y.Z`. No se desarrolla allí.
- El flujo vive en `asistenciapp/.github/workflows/publicar.yml`: en el repositorio del curso GitHub no lo lee (no está en la raíz), y en la copia queda en la raíz y se activa. Se lanza con cada etiqueta `v*`.
- Dos trabajos en paralelo, cada uno en su sistema (PyInstaller no compila para otro):

| Trabajo | Máquina | Pasos | Resultado |
| --- | --- | --- | --- |
| macOS | `macos-14` (Apple Silicon) | `pytest`, `ruff`, `mypy` · descargar `cloudflared` darwin-arm64 · PyInstaller `--windowed --onedir` (firma *ad hoc* automática) · `hdiutil` | `AsistenciApp-X.Y.Z-macos.dmg` |
| Windows | `windows-latest` (x64) | `pytest`, `ruff`, `mypy` · descargar `cloudflared` windows-amd64 · PyInstaller `--windowed --onedir` · comprimir | `AsistenciApp-X.Y.Z-windows.zip` |

- Un último paso crea la *Release* con los dos archivos y unas notas que enlazan a la página de descarga del README (abrir sin firma en cada sistema, CA-02; aviso de Google, CA-15).
- `cloudflared` se descarga en una **versión fija** (constante en el flujo) y se comprueba antes de incluirlo (§0 #6):
  - su suma SHA-256 con el *digest* que GitHub da de ese archivo de la versión (`gh api …/releases/tags/<versión>`), no con las notas;
  - en macOS, además, la firma: `codesign --verify` y que la firma sea del equipo de Cloudflare (`TeamIdentifier=68WVV388M8`). PyInstaller la cambia después por una *ad hoc*, pero ya se ha comprobado que el binario es el auténtico.
- GitHub Pages sirve desde `main` la página principal y la política de privacidad que pide Google (§2.8).
- La página de descarga dice que en macOS hay que **arrastrar la app a Aplicaciones** antes de abrirla (§0 #8).
- `--onedir` y no `--onefile`: `--onefile` se descomprime en cada arranque y no cumpliría los 10 s.

### 2.12 Errores nuevos (E3, E4, E5)

| Excepción | Dónde | Mensaje | HTTP |
| --- | --- | --- | --- |
| `AlreadyRunningError` | `infra/instance.py` | "AsistenciApp ya está abierta. Búscala en el Dock o en la barra de tareas." | — (lo muestra `app.py`) |
| `CloudflaredMissingError` (ya existe) | `infra/tunnel.py` | el de hoy | 422 |
| `TunnelTimeoutError`, `TunnelExitedError` (ya existen) | `infra/tunnel.py` | los de hoy ("Revisa tu conexión a internet…") | 502 |

Los errores de túnel entran en la tabla única de `entrypoints/web/errors.py` (hoy solo los usaba el arranque).

---

## 3. Modelo de datos

**Sin cambios.** Ni tablas, ni columnas, ni migración. Solo cambia **dónde** está el archivo en modo escritorio (§2.3).

---

## 4. API (cambios)

Las rutas nuevas exigen el token del profesor: `auth.py` pasa de un prefijo privado a una tupla `PRIVATE_PREFIXES = ("/api/sessions", "/api/online", "/api/app")`, comprobada en el mismo sitio (X3).

| Método y ruta | Recibe | Devuelve | Errores |
| --- | --- | --- | --- |
| `GET /api/app` | — | `200 {"version": "1.0.0", "desktop": true, "online": {"active": false}}` | `401` |
| `POST /api/online` | — | `200 {"active": true, "url": "https://….trycloudflare.com"}`; si ya estaba abierta, la misma URL | `401` · `422` sin `cloudflared` · `502` tiempo agotado o `cloudflared` cerrado |
| `DELETE /api/online` | — | `200 {"active": false}` (también si ya estaba cerrada) | `401` |
| `GET /api/sessions/<id>` (cambia) | — | `studentUrl` con la URL del túnel si hay clase online (§2.6) | los de hoy |

`desktop` es `true` en modo escritorio y sirve para que el panel no muestre el texto de "para la app con Ctrl+C". `WebContext` gana `tunnel: Tunnel | None` y `desktop: bool`; `create_app` los recibe por parámetro (C4).

---

## 5. Archivos

```
asistenciapp/
├── requirements.txt                 # + pywebview (app); + pyinstaller (herramienta de empaquetado, P3 v3.2)
├── app.py                           # modo escritorio (--ventana o empaquetada), _run_terminal / _run_desktop
├── AsistenciApp.spec                # NUEVO: receta de PyInstaller (datos: static/, llave, cloudflared; icono)
├── .github/workflows/publicar.yml   # NUEVO: solo activo en la copia pública (§2.11)
├── scripts/publicar.sh              # NUEVO: copia la carpeta al repositorio público con su etiqueta
├── attendance/
│   ├── __init__.py                  # + __version__
│   ├── config.py                    # desktop, platform, home; carpetas por sistema; cloudflared_path
│   ├── domain/errors.py             # MeetLoginNotCompletedError: frase del tope (§2.8)
│   ├── entrypoints/
│   │   ├── desktop.py               # NUEVO: run_window, DesktopApi.save_file, show_already_open
│   │   └── web/
│   │       ├── __init__.py          # create_app(..., tunnel, desktop)
│   │       ├── auth.py              # PRIVATE_PREFIXES
│   │       ├── context.py           # WebContext: tunnel, desktop
│   │       ├── errors.py            # + errores de túnel
│   │       ├── online.py            # NUEVO: /api/app, /api/online
│   │       └── teacher.py           # studentUrl con la URL del túnel
│   └── infra/
│       ├── instance.py              # NUEVO: acquire, InstanceLock, AlreadyRunningError
│       ├── server.py                # NUEVO: start, RunningServer.stop
│       └── tunnel.py                # + Tunnel; start_tunnel(port, executable, timeout)
├── static/
│   ├── profesor.html / .js          # interruptor "Clase online", versión en el pie, save_file en la ventana
│   └── styles.css                   # interruptor
├── tests/
│   ├── test_config.py               # rutas de escritorio en macOS y Windows, llave propia antes que la incluida
│   ├── test_instance.py             # NUEVO
│   ├── test_server.py               # NUEVO
│   ├── test_tunnel.py               # + Tunnel con un cloudflared falso
│   ├── test_desktop.py              # NUEVO: cierre con y sin clase online; save_file con un diálogo falso
│   ├── test_web_online.py           # NUEVO
│   └── test_app.py                  # elige modo escritorio con --ventana y con sys.frozen
└── README.md                        # "Descargar la app" (macOS y Windows, aviso de Google), "Publicar una versión"
```

`desktop.py` importa `webview` dentro de sus funciones, para que el resto de los tests no necesite una interfaz gráfica.

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01 | Manual: descargar la *Release* en un Mac con Apple Silicon y en un PC con Windows sin Python; doble clic → panel en una ventana |
| CA-02 | Manual: seguir la página de descarga en los dos sistemas ("Abrir igualmente"; "Más información → Ejecutar de todas formas") |
| CA-03 | `test_instance`: el segundo `acquire` lanza `AlreadyRunningError`; tras soltar el primero, vuelve a funcionar. Manual: abrir la app dos veces |
| CA-04 | `test_web_online`: `GET /api/app` devuelve `__version__`. El flujo falla si la etiqueta no coincide. Manual: versión en el pie |
| CA-05 | `test_config`: en escritorio, las rutas están en la carpeta del usuario en macOS y en Windows. Manual: actualizar de versión y ver las clases |
| CA-06 | `test_config`: ninguna ruta de escritorio sale de la carpeta del usuario. Sin cambios en lo que se guarda (§3) |
| CA-07 | `test_web_online`: `POST /api/online` con un `Tunnel` falso → `active` y `url`; `test_web_teacher`: `studentUrl` con la URL del túnel. `test_tunnel`: `open` dos veces → un solo proceso. Manual: el enlace desde un móvil con datos |
| CA-08 | `test_web_online`: `TunnelTimeoutError` → `502` con su mensaje; `CloudflaredMissingError` → `422`. Manual: sin internet |
| CA-09 | Manual: con la clase online desactivada, el panel muestra el aviso |
| CA-10, CA-11 | `test_desktop`: con una ventana falsa, abrir el túnel pone `confirm_close` a `True` y cerrarlo a `False`; los textos de `localization` están en español. Manual en los dos sistemas (el diálogo nativo no se puede probar sin pantalla) |
| CA-12 | `test_tunnel`: `close` termina el proceso; `test_server`: `stop` libera el puerto. Manual: tras cerrar, `lsof` / Administrador de tareas sin `cloudflared` ni la app |
| CA-13 | Ya cubierto por los tests de la spec 001 (la sesión abierta sigue en la BD). Manual: cerrar con una asistencia abierta y volver |
| CA-14, CA-15 | Spike §0 #2 y #3. Manual: con una cuenta que nunca ha dado permiso, tomar asistencia; repetir pasados 7 días sin que lo pida |
| CA-16 | `test_config`: llave propia en la carpeta del usuario antes que la incluida; mensaje de `MeetLoginNotCompletedError` con la frase del tope |
| CA-17 | `test_desktop`: `save_file` con un diálogo falso escribe el contenido con BOM; si se cancela, devuelve `False` sin escribir. Manual: guardar en los dos sistemas y abrir en Excel |
| CA-18 | Los 498 tests de hoy siguen en verde; `test_app`: sin `--ventana` ni `sys.frozen`, el arranque de siempre |
| CA-19 | `test_static`: el bloque oscuro se salta con `data-tema="claro"`, `tema.js` va sin `defer` en el `<head>` del panel y lee `?tema=claro`, y las páginas de alumnos no lo cargan; `test_app`: la ventana abre `?tema=claro`. Manual: con el sistema en oscuro, panel claro (también tras navegar y recargar); sin parámetro y en la página del alumno, oscuro |

---

## 7. Comprobaciones

### 7.1 Constitución (v3.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | El escritorio es una entrada; las reglas no saben de ventanas ni de sistemas |
| P2 Simplicidad | ✅ | Sin actualizaciones automáticas, sin instalador en Windows (una carpeta comprimida), sin firma. Carpetas por sistema sin biblioteca; bloqueo con un socket |
| P3 Dependencias mínimas | ⚠️ Justificada | **`pywebview`**: abre una ventana nativa con el motor web del sistema (WebKit en macOS, WebView2 en Windows). Sin ella, el profesor tendría que usar un navegador y no habría forma de confirmar el cierre (CA-10) ni de guardar con un diálogo nativo (CA-17). Frente a Electron: se queda en Python, pesa ~5 veces menos y no añade un segundo lenguaje (§8.1). **`pyinstaller`** es herramienta de empaquetado: no cuenta como dependencia (P3 v3.2). `cloudflared` es un programa externo, como hoy, ahora incluido en la app. **`tzdata`** (v1.3, **solo en Windows**): los datos oficiales de zonas horarias de IANA, el paquete que recomienda la documentación de Python (PEP 615) para `zoneinfo` cuando el sistema no los trae. Windows no los trae, así que sin él `ZoneInfo("Europe/Madrid")` falla: lo descubrió la primera compilación de Windows (T15) |
| P4 Privacidad mínima | ✅ | Los datos siguen solo en el ordenador del profesor. La llave compartida no da acceso a los datos de nadie: cada permiso se guarda en el ordenador de su profesor. Sin datos nuevos |
| P5 Accesible y móvil | ✅ | El interruptor es un `<button aria-pressed>` con su texto; el estado se anuncia en `role="status"`. Los alumnos no cambian |
| P6 Español | ✅ | Mensajes nuevos en español (§2.12), también los diálogos nativos |
| §3 Stack (v3.2) | ✅ | PyInstaller, pywebview y carpeta del usuario, como dice la enmienda |
| §5 Calidad | ✅ | Cada CA con test o paso manual (§6) |
| §6 Seguridad | ✅ | Las rutas nuevas exigen el token (§4); el servidor solo escucha en local; `cloudflared` con versión fija y suma comprobada |
| §7 Alcance | ✅ | Todo el código vive en esta carpeta; el repositorio público es solo una copia (v3.2) |

### 7.2 Arquitectura (v1.1)

| Regla | Cómo |
| --- | --- |
| C1, C3 | `desktop.py` y `online.py` son entradas; dominio y casos de uso no cambian |
| C2, C5 | Las rutas de `online.py` validan, llaman a `Tunnel` y responden; ver la excepción de abajo |
| C4, F5 | Todo se monta en `app.py`; `create_app` recibe `tunnel` y `desktop`; las rutas salen de `Config` |
| M2 | `main()` se divide en `_run_terminal` y `_run_desktop` (§2.2) |
| M3, §12 | `Tunnel`, `RunningServer` e `InstanceLock` son clases porque guardan estado (un proceso, un hilo, un socket). Sin `Protocol`: una sola implementación de cada una |
| S7, F4 | Proceso, hilo y sockets se liberan en `finally`; el túnel tiene tiempo máximo al abrir y al cerrar |
| X3 | El token se comprueba en un único sitio, ahora con varios prefijos |
| X6 | El servidor sigue en `127.0.0.1`; desde fuera solo por el túnel cifrado |
| T4 | Se simulan solo lo externo: `cloudflared` (un ejecutable falso), el diálogo de la ventana y la ventana misma |

**Excepciones a la arquitectura:**

- **C2 en `/api/online`**: las rutas llaman a `Tunnel` (infraestructura) sin caso de uso. Abrir o cerrar el túnel no aplica ninguna regla del negocio: es como encender la app hacia fuera. Un caso de uso que solo pasara la llamada sería ceremonia (P2). Hasta cuándo: si abrir la clase online llega a depender de una regla (p. ej. solo con una asistencia abierta), pasa a ser un caso de uso.

---

## 8. Decisiones

Tomadas por Victor el 2026-11-04: §8.1–§8.6 en la sesión de preguntas previa a la spec (spec §7), y §8.7–§8.9 al aprobar este plan.

1. **pywebview en vez de Electron.** Electron daría el mismo motor en todos los sistemas y descargas que funcionan sin más, pero añade Node.js como segundo lenguaje, ~150–200 MB por descarga, dos procesos que coordinar (Electron y el servidor de Python) y dos herramientas de empaquetado en cada compilación. Lo único que Electron resolvía mejor (guardar el CSV) son unas líneas en Python (§2.9). *Difícil de deshacer: cambiaría la receta de compilación y `desktop.py` entero.*
2. **Llave de Google compartida, en producción sin verificar.** Quita los 15 minutos de preparación y el permiso semanal a cada profesor, a cambio de un aviso de Google la primera vez y un **tope de 100 profesores para siempre** (Google no lo reinicia). Una promoción del bootcamp cabe de sobra; si se acerca al tope, se verifica la app ante Google o se crea en el Google Workspace de Neoland (cuentas @neoland). La llave propia queda como alternativa (CA-16). *Difícil de deshacer: el tope consumido no se recupera.*
3. **Compilar en un repositorio público propio** (`ChangVictor/asistenciapp`) con GitHub Actions. Es la única forma de tener una versión de Windows sin un PC con Windows y sin tocar el repositorio del curso, que no es de Victor. **Público y no privado** (2026-11-04): en un repositorio privado solo los colaboradores invitados pueden descargar las *Releases* (rompería CA-01), y macOS gasta los minutos gratuitos ×10. Privado no oculta nada: el código ya es público en el repositorio del curso, y la llave de Google está en un secreto de Actions en los dos casos.
4. **Solo Apple Silicon y Windows x64** en la v1.
5. **Sin actualizaciones automáticas ni firma** en la v1.
6. **Un solo punto de montaje** con modo escritorio, puerto libre, una sola instancia y confirmación al cerrar solo con clase online.
7. **Quién prueba en Windows.** Victor no tiene un PC con Windows: un compañero con Windows prueba la primera versión (T16) siguiendo la lista de §6; si no hay ninguno, una máquina virtual de Windows 11 en otro ordenador.
8. **Los datos que Victor ya tiene en `data/`**: no se migran solos; el README explica cómo copiar `asistencia.db` a la carpeta de datos de la app una vez (P2).
9. **Windows sin instalador**: la v1 se descarga como carpeta comprimida con `AsistenciApp.exe` dentro (doble clic, sin instalar). Un instalador con acceso en el menú Inicio queda para más adelante.

---

## 9. Orden de trabajo (resumen para `tasks.md`)

1. **Spike** (§0) en el Mac de Victor. Puerta: si #2 o #3 fallan, se para y se revisa la spec.
2. Infraestructura con sus tests: `config.py` (§2.3), `server.py` (§2.4), `instance.py` (§2.5), `Tunnel` (§2.6).
3. Entrada web: `online.py`, `auth.py`, `studentUrl`, errores (§4, §2.12).
4. Panel: interruptor "Clase online", versión, `save_file` (§2.6, §2.9, §2.10).
5. `desktop.py` y modo escritorio en `app.py` (§2.2, §2.7).
6. Receta de PyInstaller y prueba del `.app` en el Mac (§2.11).
7. Repositorio público, secreto de la llave, flujo de Actions y primera *Release* (§2.11).
8. Prueba en Windows (§8.7) y README.

---

## 10. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-04 | Borrador inicial | Spec 007 v1.0 aprobada por Victor |
| 1.0 | 2026-11-04 | Aprobado por Victor, con §8.7–§8.9 decididas como se proponían; §8.3 explica por qué el repositorio de compilación es público | — |
| 1.1 | 2026-11-05 | Resultados del spike (§0); confirmación nativa al cerrar en vez de un diálogo desde `closing` (§2.7, §6); ventana con texto seleccionable (§2.2); app de Google publicada con sus páginas en GitHub Pages (§2.8); comprobación de `cloudflared` por *digest* de GitHub y firma de Cloudflare, y "arrastrar a Aplicaciones" (§2.11) | Spike de la tarea T01. Aprobado por Victor |
| 1.2 | 2026-11-05 | Panel de escritorio siempre en claro (§2.2, §6; spec v1.1 CA-19) | Decisión de Victor al probar la app empaquetada (T14) |
| 1.3 | 2026-11-05 | Dependencia nueva `tzdata`, solo en Windows (§7.1, P3); PyInstaller la incluye (`hiddenimports`). Pendiente de aprobación | La primera compilación de Windows (T15, ejecución 42018306912) falló: Windows no trae las zonas horarias y `ZoneInfo("Europe/Madrid")` no se encuentra |
