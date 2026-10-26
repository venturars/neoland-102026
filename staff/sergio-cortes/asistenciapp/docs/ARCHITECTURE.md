# Arquitectura de AsistenciApp

> Versión 1.0 · 2026-10-22 · Spec `005-clean-architecture`, issue #239

Este documento fija **cómo organizamos el código del servidor**. La [constitución](CONSTITUTIONS.md) dice qué reglas de producto y stack son obligatorias; aquí se describe **dónde va cada pieza** y **qué puede importar qué**.

Inspiración: [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example) (capas domain → interactor → infra → app). **No** copiamos SQLAlchemy, PostgreSQL, Alembic, presenters duplicados ni apps CLI alternativas: solo la separación que esta app necesita hoy (constitución P2).

---

## 1. Por qué capas en un proyecto pequeño

- Las **reglas de asistencia** (códigos, nombres, sesiones cerradas) deben poder probarse sin levantar Flask ni tocar SQLite.
- El **almacenamiento** puede cambiar de forma interna sin mezclar SQL en las rutas HTTP.
- Las **rutas** solo traducen HTTP ↔ casos de uso (códigos de estado, JSON, cabeceras).

Si una capa nueva no aporta una de esas ventajas, **no se añade**.

---

## 2. Capas

| Capa | Paquete | Responsabilidad |
| --- | --- | --- |
| **Dominio** | `asistencia/domain/` | Reglas puras: códigos rotatorios, validación de nombres, CSV, errores de negocio. Sin Flask, sin SQLite. |
| **Casos de uso** | `asistencia/use_cases/` | Orquesta dominio + repositorio para un flujo (check-in, crear sesión, exportar…). |
| **Ports** | `asistencia/ports/` | Contratos (`Protocol`): p. ej. `AttendanceRepository`. El dominio y los casos de uso dependen de abstracciones, no de SQLite. |
| **Infraestructura** | `asistencia/infra/` | Implementaciones concretas: SQLite, túnel cloudflared. |
| **Web** | `asistencia/web/` | Flask: factory, middleware (token profesor, BD por petición), rutas JSON y estáticos. |
| **Entrada** | `app.py` | Punto de arranque humano: `main()`, `--tunel`, comprobación de puerto. |

El front (`static/`) no forma parte de estas capas: es HTML/JS servido por Flask.

---

## 3. Regla de dependencias

Solo se importa **hacia dentro** (hacia dominio y ports):

```
  app.py  →  web  →  use_cases  →  domain
                      ↓              ↑
                    ports            │
                      ↓              │
                    infra  ──────────┘ (infra NO importa web ni use_cases)
```

- **`domain`** no importa nada de `asistencia` fuera de sí mismo.
- **`use_cases`** importa `domain` y `ports`; no importa Flask ni `infra` concreta.
- **`infra`** implementa `ports` y puede usar `sqlite3`, subprocess, etc.
- **`web`** importa `use_cases`, `infra` (solo para cableado: conexión BD, arranque) y Flask.

En tests: los de dominio no usan Flask; `tests/test_api.py` es el contrato HTTP.

---

## 4. Dónde va cada cosa

| Tema | Capa | Ubicación |
| --- | --- | --- |
| Código de 4 dígitos / ventanas 30 s | Dominio | `domain/codes.py` |
| Validar nombre / clave duplicado | Dominio | `domain/names.py` |
| CSV con BOM y fórmulas Excel | Dominio | `domain/export.py` |
| Sesión inexistente / cerrada / código inválido / IP bloqueada | Dominio | `domain/errors.py` |
| Umbrales intentos inválidos por IP | Dominio | `domain/rate_limit.py` |
| Crear sesión, check-in, cerrar, exportar | Casos de uso | `use_cases/attendance.py` |
| Bloqueos e intentos inválidos | Casos de uso | `use_cases/rate_limit.py` |
| Contrato persistencia asistencia | Port | `ports/repository.py` |
| Contrato anti-abuso IP | Port | `ports/rate_limit_repository.py` |
| Tablas SQLite, INSERT/SELECT | Infra | `infra/sqlite/` |
| Túnel Cloudflare | Infra | `infra/tunnel.py` |
| Token `X-Teacher-Token`, rutas `/api/` | Web | `web/flask_app.py` |
| Páginas estáticas | Web | Flask `static/` (sin cambio) |

---

## 5. Casos de uso (lista)

Cada función en `use_cases/attendance.py` corresponde a un flujo ya existente en la spec `001-checkin-codigo`:

| Caso de uso | Descripción breve |
| --- | --- |
| `create_session` | Nueva clase; título por defecto con fecha si falta. |
| `list_sessions` | Listado del profesor con totales. |
| `get_public_session` | Info mínima para el alumno (sin lista ni secreto). |
| `teacher_session_view` | Panel en vivo: código si abierta, check-ins, total. |
| `check_in` | Registro con nombre + código; duplicados y errores de dominio. |
| `close_session` | Cierra asistencia. |
| `remove_checkin` | Borra un registro (sesión abierta o cerrada según reglas actuales). |
| `export_session_csv` | Filas para CSV. |
| `assert_not_blocked`, `after_invalid_code`, listar/desbloquear IP | Anti-abuso spec 006 (`use_cases/rate_limit.py`) |

Los casos de uso reciben un `AttendanceRepository` y, cuando hace falta, un callable `now` (segundos Unix) para códigos y fechas en tests. El rate limit usa `RateLimitRepository` y la IP la resuelve `web/client_ip.py` (con `ProxyFix` y túnel).

---

## 6. Cableado en tiempo de ejecución

1. Al arrancar: conectar SQLite, aplicar schema, leer o crear token de profesor (una vez).
2. Por petición HTTP: abrir conexión en `g`, instanciar `SqliteAttendanceRepository(conn)`, pasarlo al caso de uso.
3. El caso de uso devuelve datos o lanza excepciones de `domain.errors`; **web** las convierte en JSON y códigos HTTP (401, 404, 409, 422…).

---

## 7. Tests

| Tipo | Qué prueba |
| --- | --- |
| `test_codes.py`, `test_names.py`, `test_export.py` | Dominio aislado. |
| `test_api.py` | Contrato HTTP completo (no cambiar campos JSON sin spec). |
| `test_tunnel.py`, `test_port.py` | Infra y arranque. |

`pytest` debe pasar antes de dar por cerrada una tarea de refactor.

---

## 8. Fuera de alcance (explícito)

- ORM, migraciones automáticas, repositorios en memoria duplicados “por ejemplo”.
- Capa presenter/view JSON aparte de las rutas Flask (una traducción HTTP es suficiente).
- Microservicios, colas, contenedores, capas de logging genéricas.
- Cambiar el stack de la constitución §3 (Flask, sqlite3, static, pytest).

---

## 9. Comparación rápida con el repo ejemplo

| En el ejemplo | En AsistenciApp |
| --- | --- |
| `src/domain/entities` | `asistencia/domain/` (reglas + tipos ligeros) |
| `src/interactor/` | `asistencia/use_cases/` |
| `src/infra/repositories` + SQLAlchemy | `asistencia/infra/sqlite/` con `sqlite3` stdlib |
| `src/app/flask_*/controllers/presenters/views` | `asistencia/web/` (rutas + jsonify) |
| Varios entrypoints (CLI, Flask memoria, Flask PG) | Un solo `app.py` + Flask |

---

## 10. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-22 | Versión inicial (spec 005). |
