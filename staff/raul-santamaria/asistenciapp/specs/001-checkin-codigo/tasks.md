# Tareas 001 · Check-in con código

> Estado: **Pendiente de aprobación** · Plan: [plan.md](plan.md) (aprobado 2026-10-22) · Desglose reescrito: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- `🧪` = primero el test (que falle), luego el código hasta que pase.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- No se empieza una fase sin cerrar la previa.

Hay código base en esta carpeta (copia de referencia). Al implementar/verificar, se marca cada tarea solo cuando cumple su criterio *Hecha cuando* / tests.

---

## Fase A · Preparación

- [ ] **T01** · Preparar el entorno de Python:
  - `requirements.txt` con `flask` y `pytest`.
  - Entorno virtual: `python3 -m venv .venv` y `pip install -r requirements.txt` (en Windows: `.\.venv\Scripts\Activate.ps1`).
  - `.gitignore` con `data/`, `.venv/`, `__pycache__/`, `.pytest_cache/`.
  - Carpetas `asistencia/` (con `__init__.py`) y `tests/`.
  - `pytest.ini` con `testpaths = tests` y `pythonpath = .`.
  - *Hecha cuando:* `pytest` corre sin errores (aunque aún no haya tests).

## Fase B · Lógica pura (sin servidor ni BD)

- [ ] **T02** 🧪 · `asistencia/codes.py`: `code_for`, `is_valid_code`, `seconds_left`.
  - Tests en `tests/test_codes.py`: 4 dígitos · misma ventana → mismo código · ventana siguiente → distinto · acepta actual y anterior · rechaza el de hace dos ventanas y uno incorrecto · `seconds_left` coherente.
  - *Cubre:* CA-03, CA-05, CA-06.
- [ ] **T03** 🧪 · `asistencia/names.py`: `clean_name`, `name_key`.
  - Tests en `tests/test_names.py`: strip · vacío/61 chars → error · 60 ok · misma clave con mayúsculas/tildes/espacios · `<b>Ana</b>` se conserva.
  - *Cubre:* CA-07, CA-08, CA-12.
- [ ] **T04** 🧪 · `asistencia/export.py` (no `csv.py`, plan §2.6): `to_csv`.
  - Tests en `tests/test_export.py`: BOM · `Nombre;Hora` · `;` · comillas · prefijo `'` en `=+-@`.
  - *Cubre:* CA-14.

## Fase C · Base de datos

- [ ] **T05** · `asistencia/db.py`: `connect`, `init_schema` (plan §3) y consultas: token, sesiones, checkins, `remove_checkin` (fase G también lo usa).
  - *Hecha cuando:* se puede crear BD y sesión desde la consola de Python. Los tests llegan con la API (fase D).

## Fase D · API

Tests en `tests/test_api.py` con fixtures de `conftest.py` (BD temporal, token fijo, reloj falso, `test_client`).

- [ ] **T06** 🧪 · `create_app`, BD por petición, estáticos, token del profesor + `conftest.py`.
  - Tests: `/api/sessions…` sin token o token malo → `401` · ruta desconocida → `404`.
  - *Cubre:* CA-15, CA-17.
- [ ] **T07** 🧪 · `POST/GET /api/sessions`.
  - Tests: con/sin título · listado reciente→antigua con totales.
  - *Cubre:* CA-01, CA-02, CA-16.
- [ ] **T08** 🧪 · `GET/POST /api/s/<id>/…` check-in.
  - Tests: código actual/anterior → `201` · viejo → `422` · vacío → `400` · duplicado → `already` · HTML literal · `404`.
  - *Cubre:* CA-04, CA-05, CA-06, CA-07, CA-08, CA-12.
- [ ] **T09** 🧪 · `GET /api/sessions/<id>`.
  - Tests: `code`, `secondsLeft`, `studentUrl`, lista, `total` · nuevo registro visible en la siguiente llamada.
  - *Cubre:* CA-10, CA-11.
- [ ] **T10** 🧪 · `POST …/close`.
  - Tests: cerrada sin `code` · check-in → `409`.
  - *Cubre:* CA-09, CA-13.
- [ ] **T11** 🧪 · `GET …/export`.
  - Tests: CSV, cabeceras, orden.
  - *Cubre:* CA-14.
- [ ] **T12** · Arranque `python app.py`: crea `data/`, imprime panel, escucha `PORT` o `8000` en `127.0.0.1`.
  - *Hecha cuando:* la URL del panel responde `200` a una ruta privada con el token.

## Fase D2 · Acceso desde casa (plan §2.10)

- [ ] **T13** 🧪 · `ProxyFix` para URL pública del túnel.
  - Tests: con `X-Forwarded-Proto/Host`, `studentUrl` es `https://…`.
  - *Cubre:* CA-19.
- [ ] **T14** 🧪 · `asistencia/tunnel.py` + `python app.py --tunel`.
  - Instalar `cloudflared` (macOS: `brew`; Windows: instalador oficial).
  - Tests en `test_tunnel.py` para `find_tunnel_url`.
  - Mensajes de error en español si falta el binario o no sale la URL.
  - *Cubre:* CA-19, CA-20.
- [ ] **T14b** 🧪 · `port_in_use` antes de arrancar (y antes del túnel).
  - Tests en `test_port.py`. Mensaje claro si el puerto está ocupado.

## Fase E · Interfaz

- [ ] **T15** · `static/styles.css` + `index.html`.
  - *Cubre:* CA-18 (base).
- [ ] **T16** · `alumno.html` / `alumno.js` (nombre, código, localStorage del nombre, errores, sesión cerrada).
  - *Cubre:* CA-04…CA-09 (UI).
- [ ] **T17** · `profesor.html` / panel: token `#t=`, abrir sesión, historial, descarga, aviso localhost → `--tunel`.
  - *Cubre:* CA-01, CA-02, CA-14, CA-16, CA-21 (UI).
- [ ] **T18** · Vista de sesión: código grande, countdown, copiar enlace, polling 2 s, cerrar con confirmación, `textContent`.
  - *Cubre:* CA-03, CA-10, CA-11, CA-12, CA-13 (UI).

## Fase F · Cierre

- [ ] **T19** · `README.md`: entorno, túnel, arranque, pasar lista, tests. Rutas `staff/raul-santamaria/asistenciapp/`.
- [ ] **T20** · Verificación manual (dos navegadores o navegador + móvil):
  - [ ] CA-03 · el código rota cada 30 s.
  - [ ] CA-10 · alumno en lista ≤ 5 s.
  - [ ] CA-12 · HTML literal en lista.
  - [ ] CA-18 · usable a ~400 px.
  - [ ] CA-19 · `--tunel` + registro desde otra red.
  - [ ] CA-20 · enlace del panel sin retocar.
  - [ ] CA-21 · aviso en localhost.
  - [ ] CSV abre bien con tildes.
- [ ] **T21** · Repasar definición de terminado (`AGENT.md` §6) y actualizar estado en `AGENT.md` §7.

## Fase G · Un registro por navegador + quitar (spec v1.2)

- [ ] **T22** 🧪 · `remove_checkin` + `DELETE …/checkins/<id>` + `id` en listado.
  - Tests: desaparece de lista/total/CSV · `404`/`401` · sesión cerrada · re-registro tras quitar.
  - *Cubre:* CA-24, CA-25, CA-26.
- [ ] **T23** · Botón "Quitar" con confirmación que sobrevive al polling.
  - *Cubre:* CA-24 (UI).
- [ ] **T24** · Marca en `localStorage` por sesión; mensaje sin formulario (CA-22, CA-23).
- [ ] **T25** · Verificación y cierre:
  - [ ] CA-22, CA-23, CA-24 en navegador.
  - [ ] Capturas ~400 px con "Quitar".
  - [ ] README: límite por navegador y cómo quitar.
  - [ ] Prueba en móvil: segundo nombre bloqueado; quitar desde el panel.
