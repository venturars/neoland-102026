# Arquitectura de AsistenciApp

> Versión 1.2 · 2026-10-26 · Alineada con `staff/ventura-rodriguez/asistenciapp`

Este documento dice **cómo se organiza el código**. La [constitución](CONSTITUTIONS.md) fija reglas de producto; aquí van las capas.

---

## 1. Tres partes

Las flechas solo van hacia dentro:

1. **Reglas** (`asistencia/domain/`): deciden si un registro vale. No dibujan pantallas ni abren la base.
2. **Acciones** (`asistencia/usecases/`): abrir, cerrar, listar, exportar, quitar y registrarse (incluye rate limit spec 006).
3. **Borde**: `asistencia/web/flask_app.py` y `static/` hablan HTTP y llaman a las acciones. `asistencia/storage/` es el almacén. `asistencia/infra/sqlite/` guarda solo el DDL (`schema.py`) y `connect`/`init_schema` (`connection.py`).

`flask_app.py` no ejecuta SQL directo. El almacén no decide reglas.

---

## 2. Estructura de carpetas

```
asistenciapp/
├── docs/
│   ├── CONSTITUTIONS.md
│   └── ARCHITECTURE.md
├── AGENTS.md
├── app.py                 # main() y --tunel
├── asistencia/
│   ├── domain/            # codes, names, session, attempts
│   ├── usecases/          # attendance.py
│   ├── storage/           # sqlite.py (asistencia + rate limit)
│   ├── infra/sqlite/      # schema.py, connection.py
│   ├── export.py
│   ├── tunnel.py
│   └── web/               # flask_app.py, client_ip.py
├── static/
└── tests/
```

---

## 3. Qué archivo vive en cada parte

| Archivo | Parte | Qué hace |
| --- | --- | --- |
| `domain/codes.py`, `names.py` | Reglas | Códigos y nombres |
| `domain/session.py` | Reglas | Clase existe, abierta, código válido |
| `domain/attempts.py` | Reglas | Umbrales IP (spec 006) |
| `usecases/attendance.py` | Acciones | Orquesta reglas + `storage` |
| `storage/sqlite.py` | Almacén | Abre `data/asistencia.db`, guarda y lee |
| `infra/sqlite/schema.py` | DDL | Tablas (compartido con el almacén) |
| `export.py` | Utilidad | CSV de filas ya cargadas |
| `web/flask_app.py` | HTTP | Factory Flask, rutas JSON |

---

## 4. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-22 | Spec 005 inicial. |
| 1.1 | 2026-10-26 | Estilo funcional sin repositorios OOP. |
| 1.2 | 2026-10-26 | Misma forma que Ventura: `usecases/`, `storage/sqlite.py`; DDL en `infra/sqlite/`. |
