# Plan técnico 001 · Check-in con código

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.2 (aprobada 2026-10-22) · Plan reescrito: 2026-10-22

Este documento explica **cómo** construir lo que pide la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

El diseño describe el árbol real de esta carpeta: `app.py`, paquete plano `asistencia/` y `static/`. Stack: Python + Flask + pytest (constitución §3).

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

- Un solo proceso Flask sirve páginas y API JSON.
- Dependencias de Python: Flask y pytest; el resto es biblioteca estándar (constitución P3).
- Puerto **`8000`** (o `PORT`). Se evita el `5000` por defecto de Flask (en macOS lo usa AirPlay Receiver).
- `create_app(db_path, token=None, now=time.time)` arma la app: los tests usan BD temporal y reloj falso.
- Estáticos en raíz: `static_folder="static", static_url_path=""` → `/profesor.html`, no `/static/profesor.html`.

El aviso de Flask de “development server” es aceptable para un MVP de clase.

---

## 2. Decisiones clave

### 2.1 Código rotatorio de 4 dígitos (CA-01, CA-03, CA-05, CA-06)

- Cada sesión guarda un **secreto** (`secrets.token_bytes(16)`) que no sale del servidor.
- Ventanas de **30 s**: `window = int(now() // 30)`.
- Código = HMAC-SHA256 del secreto y la ventana → número `% 10000` → cuatro dígitos (`f"{n:04d}"`).
- Validar: ventana actual **y** la anterior (CA-05); el resto falla (CA-06).
- No hace falta persistir códigos (idea tipo TOTP). `now` se inyecta para tests sin esperar 30 s.

### 2.2 Panel privado del profesor (CA-15, CA-16, CA-17)

- Al primer arranque se genera un token (`secrets.token_urlsafe(24)`) en la tabla `config`.
- Consola: `Panel del profesor: http://localhost:8000/profesor.html#t=<token>`.
- El token vive en el **fragmento `#`**: el JS lo lee y lo envía en `X-Teacher-Token`. No viaja en `Referer`.
- Rutas `/api/sessions...` sin token válido → `401` (`hmac.compare_digest`).

### 2.3 Enlace del alumno (CA-04, CA-09)

- Id público corto por sesión (`secrets.token_urlsafe(6)`).
- Enlace: `/alumno.html?s=<id>`. Hace falta también el código vigente.

### 2.4 Nombres: validar y duplicados (CA-07, CA-08, CA-12)

- Validar: `strip()`; vacío o > 60 caracteres → error.
- `name_key`: NFD sin diacríticos + `casefold()` + espacios colapsados.
- Se guarda el nombre escrito y el `name_key` (UNIQUE).
- UI con `textContent` (nunca `innerHTML`) → HTML literal (CA-12).

### 2.5 Lista en vivo con polling (CA-03, CA-10, CA-11)

- El profesor hace `GET /api/sessions/<id>` cada **2 s** (código, segundos restantes, lista, total).
- Sin WebSockets: con ≤ 50 alumnos basta para CA-10 y menos dependencias (P2).

### 2.6 Exportar CSV (CA-14)

- `GET /api/sessions/<id>/export` → `text/csv`, columnas `Nombre;Hora`, orden por hora.
- Módulo estándar `csv` con `;`, BOM UTF-8, y `'` delante de nombres que empiezan por `=+-@`.
- Descarga vía `fetch` + `Blob` (hace falta el token).
- El fichero del proyecto se llama **`export.py`**, no `csv.py`, para no tapar la stdlib.

### 2.7 Sin límite de intentos (constitución §6)

- 4 dígitos no se adivinan a mano en 30 s; un script sí podría. La constitución no exige antiautomático → no hay rate limit aquí.

### 2.8 Horas

- Persistencia en ISO UTC; UI en hora local `HH:MM`; CSV en hora local del servidor `DD/MM/AAAA HH:MM:SS`.

### 2.9 Conexiones a la BD

- Una conexión `sqlite3` por petición (`flask.g` + `teardown_appcontext`), porque el servidor de desarrollo usa hilos.

### 2.10 Acceso desde casa con túnel (CA-19, CA-20, CA-21)

- Problema: `localhost:8000` no llega a alumnos en casa.
- Solución: *quick tunnel* de Cloudflare (`cloudflared`) → URL `https://….trycloudflare.com`. Sin cuenta. Instalación: `brew install cloudflared` (macOS) o el instalador oficial en Windows.
- Comando único: `python app.py --tunel`
  1. lanza `cloudflared tunnel --url http://127.0.0.1:8000` (IPv4 explícito; vaciar stdout para que no se bloquee);
  2. espera la URL (máx. 30 s);
  3. imprime el panel con esa base + `#t=<token>`;
  4. arranca Flask; Ctrl+C también para el túnel.
- `find_tunnel_url(line)` en `asistencia/tunnel.py` es pura y testeable.
- `ProxyFix` + cabeceras `X-Forwarded-*` para que `studentUrl` sea HTTPS público (CA-19).
- Aviso en panel si se abre en `localhost`/`127.0.0.1` (CA-21).
- Si el puerto está ocupado, sale con mensaje en español **sin** abrir túnel.
- Flask solo en `127.0.0.1`; el acceso externo es solo por el túnel.
- Limitación (spec §5): la URL puede cambiar en cada arranque.

### 2.11 Un registro por navegador (CA-22, CA-23)

- Tras registro ok (o “ya registrado”), `alumno.js` guarda `localStorage` clave `asistenciapp.registro.<idSesión>` → `{name, checkedAt}`.
- Misma sesión + misma clave → mensaje y sin formulario (CA-22); otra sesión → formulario (CA-23).
- Solo en el navegador (P2, P4): un id en servidor no sería más difícil de saltar y rozaría identificadores de dispositivo.
- Tras “Quitar” (§2.12), ese navegador puede seguir mostrando “ya te registraste”; se acepta.
- Si no hay `localStorage`, el límite no aplica (`try/catch`).

### 2.12 Quitar registros (CA-24, CA-25, CA-26)

- `DELETE /api/sessions/<id>/checkins/<checkinId>` → `200` / `404` (token obligatorio → CA-25).
- Listado con `checkins: [{id, name, checkedAt}]`.
- `db.remove_checkin` borra de verdad; el UNIQUE permite re-registro (CA-26).
- Abierta o cerrada. Confirmación en página; `pendingRemoval` sobrevive al repintado cada 2 s.

---

## 3. Modelo de datos (SQLite, `data/asistencia.db`)

```sql
CREATE TABLE IF NOT EXISTS config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,
  opened_at  TEXT NOT NULL,
  closed_at  TEXT
);

CREATE TABLE IF NOT EXISTS checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
```

Solo nombre y hora del alumno (P4). Sin campos de plataforma (P1).

---

## 4. API

### Pública (alumno)

| Método y ruta | Cuerpo | Respuestas |
| --- | --- | --- |
| `GET /api/s/<id>` | — | `200 {title, open}` · `404` |
| `POST /api/s/<id>/checkin` | `{name, code}` | `201 {name, checkedAt}` (CA-04) · `200 {already: true, checkedAt}` (CA-07) · `400` (CA-08) · `422` (CA-06) · `409` (CA-09) · `404` |

### Privada (profesor, `X-Teacher-Token`; sin ella → `401`)

| Método y ruta | Cuerpo | Respuesta |
| --- | --- | --- |
| `GET /api/sessions` | — | `[{id, title, openedAt, closedAt, total}]` (CA-16) |
| `POST /api/sessions` | `{title?}` | `201 {id, title}` (CA-01, CA-02) |
| `GET /api/sessions/<id>` | — | sesión + código/lista; sin `code` si cerrada (CA-13) |
| `POST /api/sessions/<id>/close` | — | `200` (CA-13) |
| `DELETE /api/sessions/<id>/checkins/<checkinId>` | — | `200` · `404` (CA-24) |
| `GET /api/sessions/<id>/export` | — | `text/csv` (CA-14) |

Errores en español: `{error: "..."}` con los textos de la spec.

---

## 5. Archivos

```
asistenciapp/
├── docs/CONSTITUTION.md
├── AGENT.md
├── README.md
├── requirements.txt       # flask, pytest
├── pytest.ini
├── app.py                 # create_app + arranque [--tunel]
├── asistencia/
│   ├── codes.py
│   ├── names.py
│   ├── export.py
│   ├── tunnel.py
│   └── db.py
├── static/                # index, profesor, alumno, styles
├── specs/001-checkin-codigo/
└── tests/                 # conftest, test_codes, test_names, test_export, test_tunnel, test_api, …
```

La lógica en `asistencia/` no importa Flask: se prueba con funciones normales.

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01, CA-02 | `test_api.py`: crear con y sin título |
| CA-03 | `test_codes.py` + manual en pantalla |
| CA-04…CA-06 | `test_api.py` con reloj falso |
| CA-07 | `test_names.py` + `test_api.py` (`already`) |
| CA-08 | `test_names.py` + `test_api.py` (`400`) |
| CA-09, CA-13 | `test_api.py`: cerrar → `409` / sin `code` |
| CA-10, CA-11 | `test_api.py` + manual ≤ 5 s |
| CA-12 | `test_api.py` + manual literal |
| CA-14 | `test_export.py` + `test_api.py` |
| CA-15, CA-17 | `test_api.py` → `401` |
| CA-16 | `test_api.py` listado |
| CA-18 | Manual DevTools ~400 px |
| CA-19 | `test_api.py` con `X-Forwarded-*` + manual móvil |
| CA-20 | `test_tunnel.py` + manual `--tunel` |
| CA-21 | Manual aviso en localhost |
| CA-22, CA-23 | Manual / automatizado en navegador |
| CA-24…CA-26 | `test_api.py` (+ UI de confirmación manual) |

---

## 7. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | Cualquier llamada; modelo sin Discord/Meet |
| P2 Simplicidad | Sí | Polling, HMAC, un proceso, límite solo en navegador |
| P3 Dependencias mínimas | Sí | Flask + pytest; `cloudflared` es programa externo opcional (HU-08) |
| P4 Privacidad | Sí | Solo nombre y hora en local; túnel cifrado; sin IP; localStorage solo en el dispositivo del alumno |
| P5 Accesible y móvil | Sí | Semántica, labels, móvil primero, CA-18 |
| P6 Español | Sí | UI y errores en español; nombres de código en inglés |
| §3 Stack | Sí | Python 3.13, Flask, `asistencia/`, `data/`, `docs/`, `static/`, pytest |
| §5 Calidad | Sí | Cada CA con test o verificación manual (§6) |
| §6 Seguridad | Sí | Códigos rotatorios, UNIQUE, sesión cerrada, escape en UI/CSV |

---

## 8. Decisiones de producto (a confirmar)

1. Sin límite de intentos de código (§2.7).
2. Separador CSV `;` (§2.6).
3. Stack Python + Flask + pytest.
4. Túnel Cloudflare con `--tunel` para HU-08.
5. Un registro por navegador + quitar registros (§2.11–§2.12).
