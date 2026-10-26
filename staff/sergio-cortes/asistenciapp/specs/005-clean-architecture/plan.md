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

Misma lógica de negocio que antes del refactor, reorganizada en capas **funcionales** (funciones y módulos planos; sin ORM ni capas presenter de más).

```
app.py                         # main(), --tunel, puerto
asistencia/
  domain/                      # codes, names, session, attempts (006)
  usecases/attendance.py       # acciones: prepare, check_in, list_sessions, …
  storage/sqlite.py            # almacén: path → abre SQLite, guarda y lee
  infra/sqlite/
    schema.py                  # DDL compartido
    connection.py              # connect(path), init_schema(conn)
  export.py                    # CSV
  tunnel.py                    # cloudflared
  web/
    flask_app.py               # create_app: HTTP → usecases; IP check-in: request.remote_addr + ProxyFix
docs/ARCHITECTURE.md
```

Flujo de una petición:

```
HTTP (web/flask_app) → usecases/attendance → domain (reglas)
                              ↓
                         storage/sqlite (path)
                              ↓
                         infra/sqlite/connection + schema
```

**Qué no copiamos del ejemplo de arquitectura limpia de la issue:** ORM, PostgreSQL, presenters duplicados, repositorios con clases ni capas vacías.

---

## 2. `docs/ARCHITECTURE.md` (CA-01, CA-02)

Contenido mínimo del documento (en español):

| Sección | Contenido |
| --- | --- |
| Propósito | Por qué hay capas en una app pequeña (P2: solo la separación que paga el alquiler). |
| Capas | `domain`, `usecases`, `storage`, `infra/sqlite`, `web` — una frase cada una. |
| Regla de dependencias | Diagrama como §1.2; prohibido importar `web` o `storage` desde `domain`. |
| Dónde va cada cosa | Tabla: código rotatorio → `domain/codes.py`; INSERT check-in → `storage/sqlite.py`; 401 sin token → `web`. |
| Casos de uso listados | Crear sesión, listar, vista profesor, check-in, cerrar, borrar check-in, exportar, info pública. |
| Testing | Tests de dominio sin Flask; tests API existentes como contrato (CA-08). |
| Fuera de alcance explícito | ORM, migraciones, microservicios, colas, capa presenter JSON. |

Referencia al repo ejemplo solo como **inspiración**, con tabla “En el ejemplo / En AsistenciApp”.

---

## 3. Modelo y casos de uso (CA-03, CA-04)

### 3.1 Dominio

- **`domain/codes.py`**, **`domain/names.py`**: reglas puras (código rotatorio, normalización de nombre).
- **`domain/session.py`**: `require_session`, `ensure_open`, excepciones de negocio (`InvalidCode`, sesión cerrada, etc.) que `web` traduce a HTTP.
- **`domain/attempts.py`** (spec 006): umbrales y `over_limit`; `Banned` con mensaje al alumno.
- **`export.py`** en raíz de `asistencia/` (CSV), no en `domain/`.

### 3.2 Almacén (`storage/sqlite.py`)

Funciones con **`path`** al fichero SQLite (abren/cierran conexión internamente). Incluye asistencia (spec 001) y tablas anti-abuso (spec 006). Usa `infra/sqlite/connection.connect` + `init_schema`.

Reloj inyectable: callable `now` en **`usecases/attendance.py`** y en `create_app` (tests de códigos rotatorios).

### 3.3 Casos de uso (`usecases/attendance.py`)

Un módulo con funciones planas (`prepare`, `check_in`, `list_sessions`, vista profesor, export, bloqueos 006, …). Orquesta `domain` + `storage`. **Sin import Flask.**

| Función | Cubre (spec 001 / 006) | Notas |
| --- | --- | --- |
| `prepare` | arranque | `init_schema`, token profesor |
| `check_in` | CA-04–CA-09, 006 | IP bloqueada / intento inválido vía `_after_invalid_code` |
| `public_session`, vistas profesor | CA-10–CA-16 | |
| `list_blocked`, `unblock_*` | 006 CA-10–CA-11 | delegan en `storage` |

### 3.4 Infraestructura SQLite

- **`infra/sqlite/schema.py`**: DDL (sesiones, check-ins, token, `blocked_ips`, `invalid_code_attempts`).
- **`infra/sqlite/connection.py`**: `connect(path)`, `init_schema(conn)`.
- **`tunnel.py`**: raíz de `asistencia/` (sin cambio de comportamiento).

### 3.5 Web (Flask)

- **`web/flask_app.py`**: `create_app(db_path, token, now)` — ProxyFix, `config["DB_PATH"]`, helper `run(action)` que captura excepciones de `domain/session` y `Banned`.
- Rutas delgadas: JSON → `usecases.attendance` → respuesta con **mismos nombres de campo** (`checkedAt`, `studentUrl`, …) para CA-09.
- **`app.py`**: `main()`, `--tunel`, import de `create_app` y `tunnel`.

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
5. Sin `asistencia/db.py` monolítico: tests y app usan `storage/sqlite` + `usecases`.

Comportamiento de túnel, token, CSV (BOM, fórmulas) permanece en dominio/infra ya existente.

---

## 6. Ficheros previstos (resumen)

| Acción | Ficheros |
| --- | --- |
| Crear | `docs/ARCHITECTURE.md` |
| Crear / mantener | `domain/*`, `usecases/attendance.py`, `storage/sqlite.py`, `infra/sqlite/schema.py` + `connection.py`, `export.py`, `tunnel.py`, `web/*` |
| Modificar | `app.py`, `AGENTS.md`, `docs/CONSTITUTIONS.md`, imports en `tests/` |
| Eliminar | `asistencia/db.py` monolítico tras mover lógica a `storage/` |
| Sin tocar | `static/*`, `requirements.txt`, `pytest.ini` (salvo `pythonpath` si hiciera falta) |

---

## 7. Comprobación de la constitución

| Principio | Cómo lo cumple este plan |
| --- | --- |
| **P1** Plataforma independiente | Dominio y casos de uso no mencionan Discord/Meet; igual que hoy. |
| **P2** Simplicidad | Sin ORM ni presenters; un módulo `storage/sqlite.py`; `usecases` planos. |
| **P3** Dependencias mínimas | Solo Flask + pytest; stdlib sqlite3, csv, hmac. |
| **P4** Privacidad | Check-ins solo nombre + hora; IPs solo en tablas 006 (constitución v2.4). |
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
| Sobre-abstracción | No introducir DTOs duplicados ni factories genéricas; un módulo `storage/sqlite.py` basta. |

---

## 9. Historial

| Fecha | Cambio |
| --- | --- |
| 2026-10-22 | Borrador inicial tras aprobación de spec. |
