# Plan técnico 005 · Arquitectura limpia adaptada

> Estado: **Implementado** (2026-10-22) · Spec: [spec.md](spec.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** cumplimos la spec #239. Partimos del ejemplo [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example) (capas `domain` → `interactor` → `infra` → `app`), pero **sin** SQLAlchemy, Alembic, PostgreSQL, capas presenter/view duplicadas ni CLI alternativa: solo lo que AsistenciApp ya usa (Flask, sqlite3, pytest).

---

## 1. Visión general

### 1.1 Estado actual (resumen)

```
app.py  ──► Flask routes + reglas HTTP mezcladas con llamadas directas a asistencia/db.py
asistencia/
  codes.py, names.py, export.py   # lógica pura (ya “dominio”)
  db.py                           # SQLite + SQL mezclado con forma de dicts de API
  tunnel.py                       # adaptador externo (cloudflared)
static/                           # sin cambios funcionales
tests/                            # pytest (API + unidades)
```

### 1.2 Estado objetivo

```
app.py                    # create_app(): cableado (inyección) + main()
asistencia/
  domain/                 # entidades ligeras + reglas puras (codes, names, export)
  use_cases/              # casos de uso (orquestación); dependen de domain y ports
  ports/                  # Protocolos: AttendanceRepository, Clock (opcional)
  infra/
    sqlite/               # schema, conexión, implementación del repositorio
    tunnel.py             # sin cambio de comportamiento
  web/
    flask_app.py          # create_app Flask, middleware (token, BD por request)
    routes/               # blueprints o módulos: public, teacher, pages
docs/
  ARCHITECTURE.md         # normas (CA-01, CA-02)
  CONSTITUTIONS.md        # enmienda 2.3 si hace falta (CA-07)
AGENTS.md                 # §3 estructura actualizada (CA-06)
```

Flujo de una petición (igual semántica que hoy):

```
HTTP (web/routes) → caso de uso → domain (validación/códigos) → port → infra/sqlite
                              ↓
                         respuesta JSON / CSV (mapeo en web, sin presenter extra)
```

Diagrama de dependencias (solo hacia dentro):

```
        ┌─────────┐
        │  web    │
        └────┬────┘
             │
        ┌────▼────────┐
        │ use_cases   │
        └────┬────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼──┐ ┌───▼───┐ ┌──▼────┐
│domain│ │ ports │ │ (no)  │
└──────┘ └───┬───┘ └───────┘
             │
        ┌────▼────┐
        │  infra  │
        └─────────┘
```

**Qué no copiamos del ejemplo:** repositorios en memoria duplicados, `db_models` ORM, loggers genéricos, múltiples `flask_*` apps, tests por cada presenter.

---

## 2. `docs/ARCHITECTURE.md` (CA-01, CA-02)

Contenido mínimo del documento (en español):

| Sección | Contenido |
| --- | --- |
| Propósito | Por qué hay capas en una app pequeña (P2: solo la separación que paga el alquiler). |
| Capas | `domain`, `use_cases`, `ports`, `infra`, `web` — una frase cada una. |
| Regla de dependencias | Diagrama como §1.2; prohibido importar `web` o `infra` desde `domain`. |
| Dónde va cada cosa | Tabla: “regla de código rotatorio” → `domain/codes.py`; “INSERT checkin” → `infra/sqlite`; “401 sin token” → `web`. |
| Casos de uso listados | Crear sesión, listar, vista profesor, check-in, cerrar, borrar check-in, exportar, info pública. |
| Testing | Tests de dominio sin Flask; tests API existentes como contrato (CA-08). |
| Fuera de alcance explícito | ORM, migraciones, microservicios, colas, capa presenter JSON. |

Referencia al repo ejemplo solo como **inspiración**, con tabla “En el ejemplo / En AsistenciApp”.

---

## 3. Modelo y casos de uso (CA-03, CA-04)

### 3.1 Dominio

- **`domain/session.py`**: tipos simples (`Session`, `Checkin`) como `dataclass` o `TypedDict` documentado — solo campos ya usados (id, title, secret, fechas, open/closed).
- **`domain/codes.py`**, **`domain/names.py`**, **`domain/export.py`**: mover desde la raíz de `asistencia/` (mismo comportamiento; reexport opcional deprecado una versión interna).
- Errores de negocio como excepciones pequeñas en `domain/errors.py` (`SessionClosed`, `InvalidCode`, `DuplicateCheckin`, `InvalidName`) para que `web` traduzca a HTTP sin `if` de negocio en rutas.

### 3.2 Ports (`ports/repository.py`)

`AttendanceRepository` con los métodos que hoy expone `db.py` (token profesor, sesiones, check-ins). Firma orientada a dominio, no a filas SQLite crudas si se puede sin inflar el diff.

`Clock` opcional: callable `now: float` inyectado en casos de uso que dependen de códigos (como hoy en `create_app`).

### 3.3 Casos de uso (`use_cases/`)

Un módulo por flujo, funciones o clases mínimas:

| Caso de uso | Cubre (spec 001) | Notas |
| --- | --- | --- |
| `create_session` | CA-01, CA-02 | Título por defecto con reloj |
| `list_sessions` | CA-16 | |
| `get_teacher_session_view` | CA-10, CA-11, CA-13 | Incluye código solo si abierta |
| `get_public_session` | alumno | Sin filtrar secretos |
| `check_in` | CA-04–CA-09 | Orquesta names + codes + repo |
| `close_session` | CA-13 | |
| `remove_checkin` | CA-24–CA-26 | |
| `export_session_csv` | CA-14 | Usa `domain/export` |

Cada caso de uso recibe `repo` (+ `now` donde aplique). **Sin import Flask.**

### 3.4 Infraestructura

- **`infra/sqlite/`**: `schema.py`, `connection.py`, `attendance_repository.py` — contenido actual de `db.py` reorganizado, misma BD `data/asistencia.db`.
- **`infra/tunnel.py`**: mover desde raíz de `asistencia/` (mismo API).

### 3.5 Web (Flask)

- **`web/flask_app.py`**: `create_app(db_path, token, now)` — ProxyFix, `g.db`, teardown, `before_request` token, error handlers JSON para `/api/`.
- **`web/routes/`**: handlers delgados: parsear JSON → llamar caso de uso → `jsonify` con **mismos nombres de campo** (`checkedAt`, `studentUrl`, etc.) para CA-09.
- **`app.py`**: reexporta `create_app` desde `web` (o import único) y mantiene `main()` / `--tunel` / `port_in_use` para no romper README ni hábitos.

---

## 4. Gobernanza (CA-06, CA-07)

### 4.1 `AGENTS.md`

- §3: árbol de carpetas como §1.2; añadir lectura obligatoria de `docs/ARCHITECTURE.md` en §1 (después de constitución).
- §7: fila `005-clean-architecture` al cerrar fases.

### 4.2 `docs/CONSTITUTIONS.md`

- **Enmienda 2.3** (patch): en §3 o nuevo §3.1 “Organización del código”, remitir a `ARCHITECTURE.md` y reafirmar P2 (no capas vacías). §4 SDD sin cambio de fondo.
- Historial §8 con fecha 2026-10-22 e issue #239.

Sin contradicción: stack sigue Flask + SQLite + static; P3 intacto.

---

## 5. Migración y compatibilidad (CA-08, CA-09)

1. Refactor por capas **sin** cambiar rutas URL ni cuerpos JSON de la API ya cubiertos por `tests/test_api.py`.
2. Tras cada bloque (infra → use cases → web), ejecutar `pytest`.
3. Tests unitarios existentes: actualizar imports (`asistencia.domain.codes`, etc.).
4. No tocar `static/` salvo que algún import roto (no previsto).
5. Eliminar o dejar shim en `asistencia/db.py` solo si los tests importan directo — preferible actualizar tests a ports/infra.

Comportamiento de túnel, token, CSV (BOM, fórmulas) permanece en dominio/infra ya existente.

---

## 6. Ficheros previstos (resumen)

| Acción | Ficheros |
| --- | --- |
| Crear | `docs/ARCHITECTURE.md` |
| Crear | `asistencia/domain/*`, `use_cases/*`, `ports/*`, `infra/sqlite/*`, `web/*` |
| Modificar | `app.py`, `AGENTS.md`, `docs/CONSTITUTIONS.md`, imports en `tests/` |
| Eliminar / vaciar | `asistencia/db.py`, `asistencia/codes.py`, … tras mover (sin duplicar lógica) |
| Sin tocar | `static/*`, `requirements.txt`, `pytest.ini` (salvo `pythonpath` si hiciera falta) |

---

## 7. Comprobación de la constitución

| Principio | Cómo lo cumple este plan |
| --- | --- |
| **P1** Plataforma independiente | Dominio y casos de uso no mencionan Discord/Meet; igual que hoy. |
| **P2** Simplicidad | Sin ORM ni presenters; un repositorio SQLite; casos de uso planos. |
| **P3** Dependencias mínimas | Solo Flask + pytest; stdlib sqlite3, csv, hmac. |
| **P4** Privacidad | Repositorio sigue guardando solo nombre + hora; sin IPs. |
| **P5** Móvil | Front sin cambios. |
| **P6** Español | ARCHITECTURE.md y docs en español. |
| **§4 SDD** | Spec aprobada → este plan → tasks → implementación. |
| **§5 Calidad** | `pytest` + tests API como contrato. |
| **§6 Seguridad** | Códigos y validación siguen en domain; token en web middleware. |
| **§7 Alcance** | Solo `staff/sergio-cortes/asistenciapp/`. |

---

## 8. Riesgos y mitigación

| Riesgo | Mitigación |
| --- | --- |
| Refactor grande rompe API | Tests API congelados; rutas delegadas solo después de pasar tests. |
| Diff ilegible | Mover ficheros con `git mv` cuando sea posible; commits por capa en tasks. |
| Sobre-abstracción | No introducir DTOs duplicados ni factories genéricas; Protocol único para repo. |

---

## 9. Historial

| Fecha | Cambio |
| --- | --- |
| 2026-10-22 | Borrador inicial tras aprobación de spec. |
