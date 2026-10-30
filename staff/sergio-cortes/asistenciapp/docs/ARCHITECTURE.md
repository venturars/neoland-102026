# Arquitectura de AsistenciApp

> Versión 1.5 · 2026-10-26

Este documento dice **cómo se organiza el código** y **dónde vive cada cosa** en el repo de la app. La [constitución](CONSTITUTIONS.md) fija reglas de producto; aquí van las capas y la estructura de carpetas.

---

## 1. Tres partes

Las flechas solo van hacia dentro:

1. **Reglas** (`asistencia/domain/`): deciden si un registro vale. No dibujan pantallas ni abren la base.
2. **Acciones** (`asistencia/usecases/`): abrir, cerrar, listar, exportar, quitar y registrarse (incluye rate limit spec 006).
3. **Borde**: `app.py` y `static/` hablan HTTP y llaman a las acciones. `asistencia/storage/` es el almacén. `asistencia/infra/sqlite/` guarda solo el DDL (`schema.py`) y `connect`/`init_schema` (`connection.py`).

`app.py` no ejecuta SQL directo. El almacén no decide reglas.

---

## 2. Estructura del repositorio

Raíz de trabajo: `staff/sergio-cortes/asistenciapp/` (en el diagrama, `asistenciapp/`).

```
asistenciapp/
├── docs/
│   ├── CONSTITUTIONS.md   # reglas no negociables
│   └── ARCHITECTURE.md    # este documento
├── AGENTS.md              # manual de trabajo para agentes de IA
├── README.md              # arranque y uso (humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué (SDD)
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # HTTP (`create_app`, rutas, `main`, --tunel)
├── asistencia/
│   ├── domain/            # reglas (codes, names, session, attempts)
│   ├── usecases/          # acciones (`attendance.py`)
│   ├── storage/           # almacén SQLite (`sqlite.py`)
│   ├── infra/sqlite/      # schema.py y connection.py
│   ├── export.py          # informe .xlsx
│   └── tunnel.py          # cloudflared
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (`test_*.py`)
├── .venv/                 # entorno virtual (no se sube a git)
└── data/                  # base SQLite local (no se sube a git)
```

### 2.1 Carpetas que no son capas de runtime

| Carpeta / fichero | Rol |
| --- | --- |
| `docs/`, `specs/`, `AGENTS.md` | Gobernanza y SDD; no se importan en tiempo de ejecución. |
| `README.md` | Instrucciones para personas; el agente usa `AGENTS.md` y la constitución. |
| `requirements.txt`, `pytest.ini` | Herramientas de desarrollo (constitución P3). |
| `static/` | Front estático; el servidor lo sirve desde Flask en `app.py`. |
| `tests/` | Contrato automatizado; validan capas sin sustituir la documentación. |
| `.venv/`, `data/` | Artefactos locales; fuera de git. |

---

## 3. Qué archivo vive en cada parte

Rutas relativas a `asistenciapp/` salvo donde se indique bajo `asistencia/`.

| Archivo | Parte | Qué hace |
| --- | --- | --- |
| `domain/codes.py`, `names.py` | Reglas | Códigos y nombres |
| `domain/session.py` | Reglas | Clase existe, abierta, código válido |
| `domain/attempts.py` | Reglas | Umbrales IP (spec 006) |
| `usecases/attendance.py` | Acciones | Orquesta reglas + `storage` |
| `storage/sqlite.py` | Almacén | Abre `data/asistencia.db`, guarda y lee |
| `infra/sqlite/schema.py` | DDL | Tablas (compartido con el almacén) |
| `infra/sqlite/connection.py` | Infra SQLite | `connect`, `init_schema(conn)` |
| `export.py` | Utilidad | Informe `.xlsx` de filas ya cargadas |
| `tunnel.py` | Adaptador | Túnel cloudflared (arrancado desde `app.py`) |
| `app.py` | Borde HTTP | Factory Flask, rutas JSON, `ProxyFix`, `main()`, IP del check-in vía `request.remote_addr` |
| `static/` | Borde | Pantallas alumno y profesor |

---

## 4. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-22 | Spec 005 inicial. |
| 1.1 | 2026-10-26 | Estilo funcional sin repositorios OOP. |
| 1.2 | 2026-10-26 | `usecases/`, `storage/sqlite.py`; DDL en `infra/sqlite/`. |
| 1.3 | 2026-10-26 | IP del check-in: `request.remote_addr`; `ProxyFix` con `x_for=0`. |
| 1.4 | 2026-10-26 | Árbol completo del repo en ARCHITECTURE; AGENTS remite aquí. |
