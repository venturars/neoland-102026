# Plan técnico 005 · Adaptar el código a la arquitectura

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.0 · Arquitectura: [ARCHITECTURE.md](../../ARCHITECTURE.md) v1.1 · Creado: 2026-10-23

Este documento explica **cómo** se adapta el código de la spec 001 a `ARCHITECTURE.md` sin cambiar lo que hace la app (spec 005, CA-01). Las reglas se citan por su identificador (`C2`, `E4`…).

---

## 1. Visión general

Hoy el código tiene tres piezas: `app.py` (arranque, rutas, errores y conversión a JSON, todo junto), el paquete `asistencia/` (reglas y base de datos mezcladas en el mismo nivel) y `static/`. Se reorganiza en las cuatro capas de la arquitectura:

```
 Navegador ──► entrypoints/web ──► usecases ──► domain
                     │                 │          ▲
                     │ (lecturas C5)   ▼          │
                     └────────────► infra ────────┘
 app.py: lee Config, monta las piezas, arranca (C4)
```

La forma de trabajar es **mover y luego mejorar**, por pasos pequeños, con los 102 tests como red de seguridad: cada tarea deja `pytest` en verde.

---

## 2. Decisiones clave

### 2.1 Estructura y nombres (O1, O2, S1)

```
asistenciapp/
├── app.py                        # arranque: argumentos, Config, puerto, túnel, create_app, run
├── pyproject.toml                # NUEVO: solo configuración de ruff y mypy (§2.10)
├── attendance/                   # antes asistencia/ (S1: identificadores en inglés)
│   ├── config.py                 # Config + load_config(environ)
│   ├── domain/
│   │   ├── errors.py             # AppError y los errores del dominio (E3)
│   │   ├── codes.py              # código rotatorio (sin cambios de lógica)
│   │   ├── names.py              # clean_name, name_key
│   │   └── sessions.py           # tipos Session, SessionSummary, Checkin; reglas de sesión
│   ├── usecases/
│   │   ├── sessions.py           # crear, cerrar, vista del profesor, exportar
│   │   └── checkins.py           # registrarse, quitar un registro
│   ├── entrypoints/web/
│   │   ├── __init__.py           # create_app (la fábrica)
│   │   ├── auth.py               # credencial del profesor (X3)
│   │   ├── errors.py             # tabla excepción → HTTP y manejadores (E4, F3)
│   │   ├── validation.py         # forma y tipo de lo que llega (E1)
│   │   ├── serializers.py        # tipo → JSON, una función por tipo (F2, D7)
│   │   ├── public.py             # rutas del alumno
│   │   └── teacher.py            # rutas del profesor
│   └── infra/
│       ├── storage.py            # antes db.py: todo el SQL
│       ├── export.py             # CSV
│       ├── tunnel.py             # cloudflared
│       └── ports.py              # port_in_use (sale de app.py)
```

- El paquete se renombra a **`attendance`**: todos los archivos cambian de sitio igualmente, y así el nombre cumple S1. Los datos (`data/asistencia.db`) no cambian de nombre.
- `asistencia/checkin.py` se reparte: sus excepciones van a `domain/errors.py` y `register` a `usecases/checkins.py`.

### 2.2 Tipos de datos (M4)
En `domain/sessions.py`, `dataclass(frozen=True)`:

| Tipo | Campos | Sustituye a |
| --- | --- | --- |
| `Session` | `id`, `title`, `secret: bytes`, `opened_at`, `closed_at: str \| None`; propiedad `is_open` | el `dict` de `db.get_session` |
| `SessionSummary` | `id`, `title`, `opened_at`, `closed_at`, `total` (sin secreto) | las filas de `db.list_sessions` |
| `Checkin` | `id`, `name`, `checked_at` | las filas de `db.list_checkins` |
| `CheckinResult` | `checkin: Checkin`, `created: bool` | la tupla `(dict, bool)` de `add_checkin` |
| `TeacherView` | `session`, `checkins: list[Checkin]`, `code: str \| None`, `seconds_left: int \| None` | el `dict` que monta hoy la ruta |
| `ExportFile` | `filename`, `content` | el nombre y el CSV que monta hoy la ruta |

Las fechas siguen siendo texto ISO 8601 en UTC (D6).

### 2.3 Casos de uso y lecturas sin reglas (C1, C2, C5)

| Acción | Dónde | Reglas que se mueven de la ruta al caso de uso |
| --- | --- | --- |
| Abrir clase | `usecases.sessions.create_session(conn, title, clock, tz)` | Título por defecto con la fecha local (spec 001 CA-02). Genera id y secreto con `secrets` (X1) |
| Cerrar clase | `usecases.sessions.close_session(conn, session_id, clock)` | Clase inexistente → `SessionNotFound` |
| Vista del profesor | `usecases.sessions.teacher_view(conn, session_id, clock)` | Código y segundos solo si está abierta (spec 001 CA-13) |
| Exportar | `usecases.sessions.export_attendance(conn, session_id, tz)` | Nombre del archivo con el día de apertura |
| Información pública de una clase | `usecases.sessions.find_session(conn, session_id)` | Clase inexistente → `SessionNotFound` |
| Registrarse | `usecases.checkins.check_in(conn, session_id, name, code, clock)` | El orden actual: cerrada → nombre → código |
| Quitar registro | `usecases.checkins.remove_checkin(conn, session_id, checkin_id)` | Clase o registro inexistentes → error con nombre |
| Lista de clases | la ruta llama a `infra.storage.list_sessions` (C5) | Ninguna: solo lee |

- Cada ruta: valida (E1), llama a **una** función de la tabla y responde con un serializador (C2, F2).
- Los casos de uso no importan nada de Flask (C1).

### 2.4 Montaje y configuración (C4, F5, M5)
- `Config` (`dataclass`): `db_path`, `port`, `timezone` (`tzinfo | None`).
- `load_config(environ)` lee `ASISTENCIA_DB` (por defecto `data/asistencia.db`), `PORT` (por defecto `8000`) y `ASISTENCIA_TZ` (por defecto la zona del sistema). Un valor no válido → `ConfigError` con un mensaje que dice qué variable corregir.
- `create_app(config, clock=time.time, teacher_token=None)`: recibe todo por parámetro. Los tests pasan una `Config` con una BD temporal, el reloj falso y un token fijo, como hoy.
- El reloj sigue siendo `Callable[[], float]` (segundos Unix): el código rotatorio trabaja en segundos y los tests ya usan ese reloj falso. Los casos de uso convierten a ISO UTC con una sola función del dominio.
- `app.py` solo arranca: argumentos, `load_config(os.environ)`, comprobar el puerto, túnel, `create_app`, `run`.

### 2.5 Almacenamiento (D1–D5)
- `infra/storage.py` contiene todo el SQL y devuelve los tipos de §2.2, nunca filas (D1, D7).
- **Las funciones de almacenamiento ya no confirman** (`commit`): cada caso de uso que escribe abre la transacción con `with conn:` (D3). Así "insertar y leer el registro" de `check_in` queda en una sola transacción.
- La conexión de preparación de `create_app` se abre con `contextlib.closing` (D4, S7).
- **El esquema no cambia**: las mismas tablas, columnas y restricciones. La base de datos del profesor sigue funcionando sin migración (spec 005, CA-02).

### 2.6 Validación de lo que llega (E1, E2)
`entrypoints/web/validation.py`:
- `json_object()`: si el cuerpo no es un objeto JSON → `MalformedRequest` (`400`).
- `optional_str(body, key)`: campo ausente → `""`; presente y no texto → `MalformedRequest` (`400`), **sin convertir** (un número no se convierte en texto).

Cambios de comportamiento que esto trae (spec 005, CA-06 y P1):

| Envío | Hoy | Después |
| --- | --- | --- |
| Check-in con `code` numérico (`1234`) | Se acepta como `"1234"` | `400` |
| Abrir clase con un cuerpo que no es objeto o con `title` que no es texto | Se ignora y el título es la fecha | `400` |
| Check-in con cuerpo mal formado en una clase cerrada | `409` | `400` (la forma se comprueba primero, E1) |
| Abrir clase sin cuerpo o con `title` vacío | Título con la fecha | Igual (spec 001, CA-02) |

El dominio recibe ya `str` y sigue comprobando sus reglas (E2): nombre vacío o demasiado largo, formato del código con `[0-9]{4}`.

### 2.7 Errores (E3–E6, F3)
`domain/errors.py`:

```python
class AppError(Exception):
    """Base de los errores que puede provocar un usuario."""
    MESSAGE = "Error inesperado. Inténtalo de nuevo en unos segundos."
```

| Excepción | Dónde se define | HTTP | Mensaje (E5: qué pasa y qué hacer) |
| --- | --- | --- | --- |
| `EmptyName` | dominio | 400 | "Escribe tu nombre." |
| `NameTooLong` | dominio | 400 | "El nombre no puede tener más de 60 caracteres. Escríbelo más corto." |
| `InvalidCode` | dominio | 422 | "El código no es válido o ha caducado. Pide el código actual al profesor." |
| `SessionClosed` | dominio | 409 | "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor." |
| `SessionNotFound` | dominio | 404 | "Esta clase no existe. Revisa el enlace." |
| `CheckinNotFound` | dominio | 404 | "Ese registro ya no está en esta clase. Recarga la lista." |
| `MalformedRequest` | entrada web | 400 | "No se ha entendido lo que se ha enviado. Recarga la página e inténtalo de nuevo." |
| `TeacherUnauthorized` | entrada web | 401 | "Acceso no autorizado. Abre el panel con tu enlace secreto de profesor." |
| `ConfigError`, errores del túnel | infraestructura / config | — (se imprimen al arrancar) | Los textos actuales de `tunnel.py`, como constantes |

- La tabla excepción → código vive **solo** en `entrypoints/web/errors.py` (E4). Las rutas no tienen `try/except`.
- Rutas de la API inexistentes o métodos no permitidos: "Esta dirección no existe. Revisa el enlace." (`404`) y "Esta acción no está permitida aquí. Recarga la página e inténtalo de nuevo." (`405`) (CA-05).
- Cualquier otra excepción: se registra con `logger.exception` y se responde `500` con `AppError.MESSAGE` (E6, F3). El texto de una excepción estándar nunca llega al usuario.

### 2.8 Registros sin datos personales (E7, spec 005 CA-07)
- Un `logger` por módulo (`logging.getLogger(__name__)`).
- El registro de accesos del servidor de desarrollo de Flask escribe la IP de cada petición. `app.py` lo silencia (`logging.getLogger("werkzeug").setLevel(logging.WARNING)`); lo que la app enseña al arrancar ya lo imprime `app.py`.
- Los mensajes que se registran no incluyen nombres ni el cuerpo de las peticiones.

### 2.9 Frontend (U1–U5)
Ya cumple U1, U2 (`textContent` siempre), U4 (`role="status"` y `aria-live`) y U5. Falta **U3**:
- `profesor.js` ya pasa todo por `api()`.
- `alumno.js` llama a `fetch` en dos sitios: se unifican en una función `api()` que lee el JSON y convierte errores y fallos de red en un mensaje.

### 2.10 Herramientas de desarrollo (spec 005, P2; constitución P3 v3.1)
- `requirements.txt` añade **ruff** y **mypy**.
- `pyproject.toml` solo con su configuración (no convierte el proyecto en un paquete instalable, §12):
  - **ruff** (`line-length = 120`, comillas dobles, docstrings estilo Google). Reglas: errores y estilo básicos (`E`, `W`, `F`), imports (`I`, `TID`: sin relativos), nombres (`N`), sintaxis moderna (`UP`), errores habituales (`B`, `BLE`), anotaciones (`ANN`), docstrings (`D`), sin tapar módulos (`A`), seguridad (`S`), `print` (`T20`) y complejidad (`C90`, máximo 10).
  - **mypy** en modo `strict` sobre `app.py` y `attendance/`.
- Comandos: `ruff format`, `ruff check`, `mypy`. Se añaden a `AGENT.md` (§4) y a la definición de terminado (§6).

### 2.11 Tests (T1–T6)
Se reorganizan según T6; cada test conserva su marca `# CA-xx` de la spec 001:

| Archivo | Prueba | Sale de |
| --- | --- | --- |
| `test_codes.py`, `test_names.py` | dominio | igual |
| `test_sessions.py` | casos de uso de sesiones (BD real temporal y reloj falso) | `test_api.py` (parte) |
| `test_checkins.py` | casos de uso de registros | `test_checkin.py` |
| `test_storage.py` | SQL, restricciones y que no confirma por su cuenta | nuevo |
| `test_config.py` | `load_config` con valores buenos y malos | nuevo |
| `test_app.py` | arranque: silencia el registro de accesos (§2.8) | nuevo |
| `test_export.py`, `test_tunnel.py`, `test_ports.py` | infraestructura | `test_export`, `test_tunnel`, `test_port` |
| `test_web_public.py`, `test_web_teacher.py`, `test_web_errors.py` | entrada web: contrato, códigos y formato de error | `test_api.py` |

- Los tests de `test_api.py` se **mueven**, no se reescriben, salvo los afectados por §2.6 y §2.7 (CA-01).
- Nuevos tests de T3 para cada campo que entra (`name`, `code`, `title`): vacío, tipo equivocado y formato raro.

---

## 3. Modelo de datos

Sin cambios. Mismo esquema que la spec 001 (plan 001 §3).

---

## 4. API

Mismas rutas, cuerpos y respuestas que la spec 001 (plan 001 §4), con dos diferencias:
- Los cambios de validación de §2.6.
- Los mensajes de error nuevos de §2.7.

---

## 5. Excepciones a la arquitectura

| Regla | Excepción | Por qué | Hasta cuándo |
| --- | --- | --- | --- |
| S2, S3 (tipos y docstrings en toda función) | Los tests no llevan anotaciones de tipo ni docstring en cada función (`ANN` y `D` desactivadas en `tests/`) | El nombre del test ya dice qué prueba, y sus parámetros son *fixtures* de pytest. Añadirlos no aporta nada (P2) | Permanente, salvo que se enmiende `ARCHITECTURE.md` para decirlo |
| M5 ("`Callable[[], datetime]` o similar") | El reloj devuelve segundos Unix (`float`) | El código rotatorio trabaja en segundos, y es lo que ya usan los tests (§2.4). La regla lo permite ("o similar"); se anota para que quede claro | Permanente |

---

## 6. Trazabilidad: criterio → cómo se prueba

| CA | Prueba |
| --- | --- |
| CA-01 | Todos los tests de la spec 001 pasan tras moverlos; solo cambian los de §2.6 y §2.7. Revisión: cada `# CA-xx` de la spec 001 sigue apareciendo en algún test |
| CA-02 | `test_storage`: abrir una BD creada con el esquema de la spec 001 y leer sus clases. Manual: arrancar con **una copia** de `data/asistencia.db` de Victor y ver sus clases y el mismo enlace de profesor |
| CA-03 | Manual: `python app.py`, `python app.py --tunel` y `pytest` funcionan como hoy; el README y `AGENT.md` explican los comandos nuevos (`ruff`, `mypy`) |
| CA-04 | `ruff check` y `mypy` sin errores. Revisión manual de la lista de `ARCHITECTURE.md` §13, anotada en `tasks.md` punto por punto |
| CA-05 | `test_web_errors`: cada excepción de la tabla de §2.7 responde con su código y su mensaje; `404`, `405` y `500` con su mensaje |
| CA-06 | `test_web_public` y `test_web_teacher`: cuerpos que no son objeto, `code` numérico, `name` lista, `title` número → `400` y nada guardado |
| CA-07 | `test_web_errors`: un error inesperado durante un check-in no deja el nombre del alumno en el registro (`caplog`). `test_app`: el arranque silencia el registro de accesos. Manual: arrancar, registrarse y revisar la consola |

---

## 7. Comprobación de la constitución (v3.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | ✅ | Las reglas quedan en `domain/` y `usecases/`, listas para otras entradas (Meet, Discord) |
| P2 Simplicidad | ✅ | Sin interfaces, clases de servicio ni contenedores (§12 de la arquitectura). Funciones de módulo y `dataclass` |
| P3 Dependencias mínimas | ✅ | Ninguna dependencia nueva de la app. ruff y mypy son herramientas de desarrollo (P3 v3.1) |
| P4 Privacidad | ✅ | No cambia qué se guarda. Se deja de registrar la IP en la consola (§2.8) |
| P5 Accesible y móvil | ✅ | Las pantallas no cambian |
| P6 Español | ✅ | Mensajes y documentación en español; identificadores en inglés |
| §3 Stack | ✅ | Sin cambios |
| §5 Calidad | ✅ | Cada CA con test o paso manual (§6). Los mensajes nuevos dicen qué hacer |
| §6 Seguridad | ✅ | El código rotatorio, el token y el escape no cambian. Se rechaza un tipo equivocado en lugar de convertirlo |

---

## 8. Decisiones tomadas por Victor

1. **Orden** (2026-10-23): esta spec va antes de reescribir el plan 004.
2. **Cuerpos mal formados** (2026-10-23): se rechazan con `400` (spec P1).
3. **Herramientas de desarrollo** (2026-10-23): ruff y mypy (spec P2).

4. **Plan aprobado** (2026-10-23), incluidos el nuevo nombre del paquete (`attendance`, §2.1), los textos de los mensajes (§2.7) y las excepciones de §5.
