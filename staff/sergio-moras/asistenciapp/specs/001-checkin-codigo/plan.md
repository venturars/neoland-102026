# Plan técnico 001 · Check-in con código

> Estado: **Aprobado** (2026-10-20, incluidas §2.11–§2.12) · Spec: [spec.md](spec.md) v1.2 · Creado: 2026-10-19 · Re-planificado: 2026-10-20

Este documento explica **cómo** construimos lo que pide la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

> **Historial:** la primera versión (aprobada el 2026-10-19) usaba Node.js. El 2026-10-20 se re-planifica a **Python + Flask** (constitución v2.0). El diseño (códigos, panel privado, polling, modelo de datos, API) **no cambia**; solo cambian las herramientas.

---

## 1. Visión general

```
 Navegador del PROFESOR                    Navegador del ALUMNO
 profesor.html#t=<secreto>                 alumno.html?s=<idSesión>
        │  fetch cada 2 s                          │  fetch (1 vez)
        ▼                                          ▼
 ┌──────────────────────────── app.py (Flask) ──────────────────────────────────┐
 │  /*.html, /*.js, /*.css → static/                                            │
 │  /api/...   → rutas en app.py ──► asistencia/codes.py  (códigos)             │
 │                                ──► asistencia/names.py  (validar nombres)    │
 │                                ──► asistencia/export.py (CSV)                │
 │                                ──► asistencia/db.py ──► data/asistencia.db   │
 └──────────────────────────────────────────────────────────────────────────────┘
```

- **Un único proceso Python** (Flask) sirve tanto las páginas como la API JSON.
- **Dependencias**: Flask y pytest; todo lo demás es biblioteca estándar (constitución P3, v2.0).
- Puerto **`8000`** (o el de la variable `PORT`). No usamos el `5000` típico de Flask porque en macOS lo ocupa *AirPlay Receiver*.
- `create_app(db_path, token=None, now=time.time)` construye la aplicación. Así los tests pueden crear una app con su propia BD temporal y un reloj falso.
- Flask se configura con `static_folder="static", static_url_path=""` para que las páginas se sirvan en la raíz (`/profesor.html`, no `/static/profesor.html`).

> Nota: al arrancar, Flask avisa *"This is a development server. Do not use it in a production deployment."* Es esperado: para un MVP de clase el servidor de desarrollo es suficiente.

---

## 2. Decisiones clave

### 2.1 Código rotatorio de 4 dígitos (CA-01, CA-03, CA-05, CA-06)
- Cada sesión tiene un **secreto aleatorio** propio (`secrets.token_bytes(16)`), guardado en la BD y que nunca sale del servidor.
- El tiempo se divide en **ventanas de 30 s**: `window = int(now() // 30)`.
- `código = hmac.new(secreto, window.to_bytes(8, "big"), hashlib.sha256)` → se convierte en un número `% 10000` → se rellena a 4 dígitos con `f"{n:04d}"` (`"0427"`).
- **Validar** = calcular el código de la ventana actual **y** de la anterior; si coincide alguna, vale (CA-05). Cualquier otra, no (CA-06).
- **Por qué así:** el servidor no tiene que guardar ni borrar códigos. Es la misma idea que usan las apps de doble factor (TOTP).
- El reloj se **inyecta** (`now`) para poder probar la rotación en los tests sin esperar 30 s.

### 2.2 Panel privado del profesor (CA-15, CA-16, CA-17)
- La primera vez que arranca, la app genera un **token secreto** (`secrets.token_urlsafe(24)`) y lo guarda en la tabla `config`.
- En cada arranque lo imprime en consola:
  `Panel del profesor: http://localhost:8000/profesor.html#t=<token>`
- El token va en el **`#` (fragmento)** de la URL: el navegador **no lo envía** en peticiones ni en el `Referer`. El JS de la página lo lee y lo manda en la cabecera `X-Teacher-Token` en cada llamada a la API.
- Toda ruta `/api/sessions...` sin token correcto → `401`. La comparación se hace con `hmac.compare_digest` (tiempo constante).

### 2.3 Enlace del alumno (CA-04, CA-09)
- Cada sesión tiene un **id público** corto y aleatorio (`secrets.token_urlsafe(6)`, 8 caracteres).
- Enlace del alumno: `/alumno.html?s=<id>`. Conocer el id **no basta**: también hace falta el código vigente.

### 2.4 Nombres: validar y detectar duplicados (CA-07, CA-08, CA-12)
- **Validar**: `strip()`; vacío o más de 60 caracteres → error.
- **Normalizar para comparar** (`name_key`): `unicodedata.normalize("NFD", ...)` + quitar las marcas diacríticas + `casefold()` + colapsar espacios. Así `"  Ana  García"` y `"ana garcia"` son la misma persona.
- Se guarda el **nombre tal como lo escribió** (para mostrarlo) y el `name_key` (para el `UNIQUE`).
- **Mostrar**: el frontend usa **siempre `textContent`**, nunca `innerHTML`, así que `<b>Ana</b>` se ve literal (CA-12). Flask devuelve JSON, así que el servidor tampoco interpreta HTML.

### 2.5 Lista "en vivo" con polling (CA-03, CA-10, CA-11)
- La página del profesor pide `GET /api/sessions/<id>` **cada 2 s**. La respuesta trae el código actual, los segundos que le quedan, la lista y el total.
- **Por qué no WebSockets:** con ≤ 50 alumnos, 2 s cumplen de sobra los "5 s como máximo" de CA-10 con muchísimo menos código (constitución P2). Además Flask no trae WebSockets de serie: harían falta más dependencias.

### 2.6 Exportar CSV (CA-14)
- `GET /api/sessions/<id>/export` devuelve `text/csv` con columnas `Nombre;Hora`, ordenado por hora.
- Se genera con el módulo estándar **`csv`** (`delimiter=";"`), que ya se encarga de poner comillas cuando un nombre contiene `;` o `"`.
- **BOM UTF-8** (`"\ufeff"` al principio): Excel en español usa `;` y necesita el BOM para mostrar bien las tildes. Google Sheets lo detecta solo.
- **Protección contra fórmulas**: si un nombre empieza por `=`, `+`, `-` o `@`, se le antepone `'` para que Excel no lo ejecute como fórmula.
- Como la descarga necesita la cabecera del token, el frontend hace `fetch`, crea un `Blob` y lo descarga.
- ⚠️ El módulo se llama **`export.py`, no `csv.py`**: un archivo propio llamado `csv.py` "taparía" al `csv` de la biblioteca estándar y `import csv` cargaría el nuestro. Es un error clásico en Python.

### 2.7 Sin límite de intentos (constitución §6, v1.1)
- Con 4 dígitos hay 10.000 combinaciones. Un **script** podría probarlas todas antes de que el código cambie. Una **persona** tecleando a mano, no.
- La constitución solo exige que el código no se pueda adivinar **a mano**, así que no se añade límite de intentos. Si hiciera falta más adelante, se haría en una spec nueva.

### 2.8 Horas
- Se guardan en **ISO UTC**: `datetime.now(timezone.utc).isoformat()`.
- El navegador las muestra en hora local `HH:MM`. El CSV las convierte a la hora local del servidor (`DD/MM/AAAA HH:MM:SS`).

### 2.9 Conexiones a la BD
- El servidor de desarrollo de Flask atiende varias peticiones a la vez (hilos), y una conexión `sqlite3` no debe compartirse entre hilos.
- Por eso se abre **una conexión por petición**, guardada en `flask.g`, y se cierra al terminar con `teardown_appcontext`. Es el patrón que recomienda la documentación de Flask.

### 2.10 Acceso desde casa con un túnel (CA-19, CA-20, CA-21)
- **Problema:** la app corre en el ordenador del profesor. `localhost:8000` solo existe en ese ordenador, así que un alumno en su casa no puede abrirlo.
- **Solución:** un *quick tunnel* de Cloudflare (`cloudflared`). Es un programa que crea una URL pública `https://<palabras-al-azar>.trycloudflare.com` y reenvía las peticiones a `localhost:8000`. No necesita cuenta. Se instala una vez con `brew install cloudflared`.
- **Un solo comando (CA-20):** `python app.py --tunel`
  1. arranca `cloudflared tunnel --url http://127.0.0.1:8000` como subproceso (`127.0.0.1` y no `localhost`, porque `localhost` puede resolverse a IPv6 y Flask solo escucha en IPv4). Hay que seguir leyendo su salida mientras viva: si nadie la vacía, `cloudflared` se bloquea;
  2. lee su salida hasta encontrar la URL `https://….trycloudflare.com` (máx. 30 s; si no aparece, explica el error y sale);
  3. imprime `Panel del profesor: https://….trycloudflare.com/profesor.html#t=<token>`;
  4. arranca Flask; al pararlo (Ctrl+C) también para `cloudflared`.
- La función que extrae la URL de una línea de texto es **pura** (`find_tunnel_url(line)` en `asistencia/tunnel.py`), así que se prueba sin lanzar `cloudflared`.
- **Enlace de alumnos correcto (CA-19):** `cloudflared` reenvía la petición por `http` local pero avisa con la cabecera `X-Forwarded-Proto: https`. Con `werkzeug.middleware.proxy_fix.ProxyFix(x_proto=1, x_host=1)` Flask "se cree" la dirección pública, y `studentUrl` sale como `https://….trycloudflare.com/alumno.html?s=…`.
- **Aviso en local (CA-21):** si `profesor.html` se abre en `localhost` o `127.0.0.1`, muestra un aviso: "Tus alumnos no podrán abrir este enlace. Arranca con `python app.py --tunel`".
- **Puerto ocupado:** antes de abrir el túnel, `python app.py` comprueba que el puerto está libre (intenta conectarse a `127.0.0.1:<puerto>`). Si ya hay algo escuchando (p. ej. otra AsistenciApp olvidada en otra terminal), sale con un mensaje en español y **sin** lanzar `cloudflared`.
- **Más seguro:** Flask escucha solo en `127.0.0.1` (no en toda la red Wi-Fi). Desde fuera solo se llega a través del túnel.
- **Limitación aceptada (spec §5):** la URL cambia en cada arranque, y la app solo funciona mientras el portátil está encendido. Una URL recién creada tarda unos segundos (~15–20 s) en ser accesible; la app lo avisa al arrancar.

### 2.11 Un registro por navegador (CA-22, CA-23)
- Tras un registro correcto (o un "ya estabas registrado"), `alumno.js` guarda en `localStorage` la clave `asistenciapp.registro.<idSesión>` con `{name, checkedAt}`.
- Al abrir el enlace, si existe esa clave para **esa** sesión, muestra "Ya te registraste en esta clase como *Nombre* a las HH:MM." y **no** muestra el formulario (CA-22). Otra sesión tiene otra clave, así que no le afecta (CA-23).
- **Por qué solo en el navegador y no en el servidor:** la alternativa sería que el navegador enviara un identificador aleatorio y el servidor lo guardara con un `UNIQUE`. Pero ese identificador también viviría en el `localStorage` del alumno, así que se salta igual (borrando datos o con una ventana privada). Sería más código y más datos guardados (roza "identificadores de dispositivo", constitución P4) **sin ser más difícil de saltar**. Por P2 y P4: solo en el navegador.
- **Limitación conocida:** si el profesor quita un registro (§2.12), ese navegador sigue mostrando "ya te registraste". El alumno tendría que usar otro navegador. Se acepta: quitar está pensado para registros falsos, no para corregir los propios.
- Si `localStorage` no está disponible (p. ej. algunos modos privados), el límite simplemente no se aplica: la página funciona igual (todo acceso va en `try/catch`).

### 2.12 Quitar registros (CA-24, CA-25, CA-26)
- **API:** `DELETE /api/sessions/<id>/checkins/<checkinId>` → `200`, o `404` si ese registro no existe **en esa sesión**. Está bajo `/api/sessions`, así que ya exige el token del profesor (CA-25).
- `GET /api/sessions/<id>` incluye el `id` de cada registro: `checkins: [{id, name, checkedAt}]`.
- **BD:** `db.remove_checkin(conn, session_id, checkin_id) -> bool` (`DELETE … WHERE id = ? AND session_id = ?`). El registro se borra de verdad (sin papelera ni historial: P2 y P4). Al desaparecer la fila, el `UNIQUE` deja que esa persona vuelva a registrarse (CA-26).
- Se permite con la sesión **abierta o cerrada** (limpiar la lista después de clase).
- **Interfaz:** cada fila de la lista del profesor tiene un botón "Quitar". Al pulsarlo, la fila cambia a "¿Quitar a *Nombre*? [Sí, quitar] [Cancelar]" (confirmación dentro de la página, como al cerrar).
- ⚠️ La lista se repinta cada 2 s (polling). El registro pendiente de confirmar se guarda en una variable (`pendingRemoval`), y el repintado lo respeta para que la confirmación no desaparezca.

---

## 3. Modelo de datos (SQLite, `data/asistencia.db`)

```sql
CREATE TABLE IF NOT EXISTS config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,        -- id público corto
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,           -- semilla del código, nunca sale del servidor
  opened_at  TEXT NOT NULL,           -- ISO UTC
  closed_at  TEXT                     -- NULL = abierta
);

CREATE TABLE IF NOT EXISTS checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,          -- tal como lo escribió el alumno
  name_key    TEXT NOT NULL,          -- normalizado, para detectar duplicados
  checked_at  TEXT NOT NULL,          -- ISO UTC
  UNIQUE (session_id, name_key)
);
```

Solo **nombre y hora** del alumno (constitución P4). El modelo no tiene nada específico de ninguna plataforma (constitución P1).

---

## 4. API

### Pública (alumno)

| Método y ruta | Cuerpo | Respuestas |
| --- | --- | --- |
| `GET /api/s/<id>` | — | `200 {title, open}` · `404` |
| `POST /api/s/<id>/checkin` | `{name, code}` | `201 {name, checkedAt}` (CA-04) · `200 {already: true, checkedAt}` (CA-07) · `400` nombre no válido (CA-08) · `422` código no válido (CA-06) · `409` sesión cerrada (CA-09) · `404` |

### Privada (profesor, cabecera `X-Teacher-Token`; sin ella → `401`)

| Método y ruta | Cuerpo | Respuesta |
| --- | --- | --- |
| `GET /api/sessions` | — | `[{id, title, openedAt, closedAt, total}]`, de la más reciente a la más antigua (CA-16) |
| `POST /api/sessions` | `{title?}` | `201 {id, title}`; sin título se usa fecha y hora (CA-01, CA-02) |
| `GET /api/sessions/<id>` | — | `{id, title, open, code, secondsLeft, studentUrl, total, checkins:[{id, name, checkedAt}]}`. Sin `code` si está cerrada (CA-13) |
| `POST /api/sessions/<id>/close` | — | `200` (CA-13) |
| `DELETE /api/sessions/<id>/checkins/<checkinId>` | — | `200` · `404` (CA-24) |
| `GET /api/sessions/<id>/export` | — | `text/csv` (CA-14) |

Los mensajes de error van en español en `{error: "..."}`, con los textos exactos de la spec.

---

## 5. Archivos

```
asistenciapp/
├── .gitignore             # data/  .venv/  __pycache__/  .pytest_cache/
├── README.md              # cómo preparar el entorno, arrancar y usar
├── requirements.txt       # flask, pytest
├── pytest.ini             # testpaths = tests, pythonpath = . (para importar `asistencia`)
├── app.py                 # create_app(db_path, token, now): rutas de la API + estáticos.
│                          # `python app.py [--tunel]`: crea data/, obtiene el token, (abre el túnel,) imprime la URL del panel y arranca en 127.0.0.1:8000
├── asistencia/            # paquete con la lógica (sin nada de Flask)
│   ├── __init__.py
│   ├── codes.py           # code_for(secret, t), is_valid_code(secret, code, t), seconds_left(t)
│   ├── names.py           # clean_name(raw), name_key(name)
│   ├── export.py          # to_csv(rows)
│   ├── tunnel.py          # find_tunnel_url(line), start_tunnel(port): lanza cloudflared y espera su URL
│   └── db.py              # connect(path), init_schema(conn) y consultas
├── static/
│   ├── index.html         # portada: "pide el enlace a tu profesor"
│   ├── profesor.html/.js  # panel: crear sesión, sesiones anteriores, vista de sesión en vivo
│   ├── alumno.html/.js    # formulario nombre + código
│   └── styles.css         # estilos comunes, móvil primero
└── tests/
    ├── conftest.py        # fixtures: app (BD temporal en tmp_path, token fijo, reloj falso) y client
    ├── test_codes.py
    ├── test_names.py
    ├── test_export.py
    ├── test_tunnel.py
    └── test_api.py        # usa app.test_client(): prueba la API sin levantar un servidor real
```

**Por qué separar `asistencia/` de `app.py`:** la lógica (códigos, nombres, CSV, BD) no sabe nada de Flask. Se prueba con funciones normales, y si mañana cambiara el servidor, esa parte no se tocaría.

Detalles de la interfaz:
- **Profesor**: el código se ve con letra muy grande (para compartir pantalla), con una cuenta atrás y un botón "Copiar enlace de alumnos". Cerrar pide confirmación **dentro de la página**, no con `confirm()`.
- **Alumno**: el campo de código usa `inputmode="numeric"`. El nombre se recuerda en `localStorage`, **solo en su propio dispositivo**, para la siguiente clase (ayuda a < 30 s).

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01, CA-02 | `test_api.py`: crear con y sin título |
| CA-03 | `test_codes.py`: el código cambia al cambiar de ventana. **Manual**: se actualiza en pantalla |
| CA-04, CA-05, CA-06 | `test_api.py` con reloj falso: código actual, anterior y antiguo |
| CA-07 | `test_names.py` (normalización) + `test_api.py` (segundo registro → `already`) |
| CA-08 | `test_names.py` + `test_api.py` (`400`) |
| CA-09, CA-13 | `test_api.py`: cerrar → registro `409` y sin `code` |
| CA-10, CA-11 | `test_api.py`: la lista y el total incluyen al nuevo alumno. **Manual**: aparece en ≤ 5 s |
| CA-12 | `test_api.py`: el nombre se devuelve tal cual. **Manual**: se ve literal en pantalla |
| CA-14 | `test_export.py` (BOM, `;`, orden, comillas, fórmulas) + `test_api.py` |
| CA-15, CA-17 | `test_api.py`: rutas privadas sin token o con token incorrecto → `401` |
| CA-16 | `test_api.py`: listado con totales |
| CA-18 | **Manual**: DevTools a 400 px |
| CA-19 | `test_api.py`: con cabeceras `X-Forwarded-Proto/Host`, `studentUrl` es `https://<host público>/…`. **Manual**: registrarse desde un móvil con datos móviles |
| CA-20 | `test_tunnel.py`: se extrae la URL de las líneas reales de `cloudflared`. **Manual**: `python app.py --tunel` imprime un enlace que funciona |
| CA-21 | **Manual**: abrir el panel en `localhost` muestra el aviso |
| CA-22, CA-23 | **Chrome automatizado**: registrarse, recargar → mensaje y sin formulario; abrir otra sesión → formulario visible |
| CA-24 | `test_api.py`: quitar → desaparece de la lista, del total y del CSV; id de otra sesión → `404`. **Chrome automatizado**: confirmar y cancelar |
| CA-25 | `test_api.py`: `DELETE` sin token → `401` |
| CA-26 | `test_api.py`: tras quitar, el mismo nombre se registra otra vez → `201` |

---

## 7. Comprobación de la constitución (v2.0)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | Funciona con cualquier llamada. El modelo de datos no tiene campos de Discord ni de Meet |
| P2 Simplicidad | ✅ | Polling en vez de WebSockets, HMAC en vez de guardar códigos, un único proceso, límite por navegador sin código de servidor (§2.11) |
| P3 Dependencias mínimas | ✅ | Python: solo Flask y pytest; el resto es biblioteca estándar. `cloudflared` no es una dependencia de Python, sino un programa externo **opcional** (sin él la app funciona en local). Justificación: es la forma más simple y gratuita, sin cuenta, de cumplir HU-08 |
| P4 Privacidad (v2.1) | ✅ | Solo nombre y hora; se almacenan solo en local. Por el túnel viajan cifrados (HTTPS) y Cloudflare no los guarda. No se usa ni se guarda la IP. El límite por navegador (§2.11) solo guarda datos en el propio dispositivo del alumno; quitar un registro lo borra de verdad |
| P5 Accesible y móvil | ✅ | HTML semántico, `<label>`, móvil primero, verificación manual (CA-18) |
| P6 Español | ✅ | Interfaz y errores en español; código en inglés |
| §3 Stack | ✅ | Python 3.13 + Flask + `sqlite3` + frontend sin frameworks en `static/` + pytest |
| §5 Calidad | ✅ | Cada CA tiene su test o verificación manual (§6) |
| §6 Seguridad (v1.1) | ✅ | Códigos de 4 dígitos que caducan cada 30 s (no adivinables a mano), `UNIQUE` contra duplicados, sesión cerrada bloqueada, `textContent` y escape en CSV |

---

## 8. Decisiones tomadas por Victor

1. **Límite de intentos** (2026-10-19): no. Se enmienda la constitución a v1.1 (§6) en lugar de dejar una excepción (§2.7).
2. **Separador del CSV** (2026-10-19): `;` (§2.6).
3. **Re-plan a Python** (2026-10-20): Flask + pytest. Se enmienda la constitución a v2.0.
4. **Acceso remoto** (2026-10-20): túnel de Cloudflare con un solo comando (`--tunel`). Se enmienda P4 de la constitución a v2.1.
5. **Un registro por navegador + quitar registros** (2026-10-20, spec v1.2): límite solo en el navegador (§2.11); quitar con confirmación, en sesiones abiertas o cerradas (§2.12).
