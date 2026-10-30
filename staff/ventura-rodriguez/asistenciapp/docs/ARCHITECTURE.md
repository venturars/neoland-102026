# Arquitectura de AsistenciApp

Este documento dice **cómo se organiza el código**.

La forma sale de una arquitectura por capas: las reglas no saben dónde se guardan los datos ni cómo se dibuja la pantalla.

---

## 1. Tres partes

Las flechas solo van hacia dentro. Una parte de fuera puede llamar a una de dentro. Una de dentro no llama a una de fuera.

1. **Reglas** (`asistencia/domain/`): deciden si un registro vale. No dibujan pantallas ni abren la base.
2. **Acciones** (`asistencia/usecases/`): el profesor abre, cierra, lista, exporta o quita; el alumno se registra. Piden la decisión a las reglas y el guardado al almacén.
3. **Borde**: `app.py` y `static/` son la pantalla. Hablan HTTP y llaman a las acciones. `asistencia/storage/` es el almacén: abre el archivo y guarda lo que la acción ya decidió.

`app.py` no abre la base. El almacén no decide reglas ni dibuja pantallas.

No entran PostgreSQL, SQLAlchemy ni Alembic, ni una segunda base, ni una interfaz de almacén, ni una entrada de línea de comandos, ni `.env`, ni pre-commit, ni documentación generada.

---

## 2. Estructura de carpetas

El flujo de git vive junto al código. `agents/git-workflow-agent.md` reconoce el momento y llama al subagente o a la skill que toca. El detalle de cada momento está en `AGENTS.md`.

```
asistenciapp/
├── agents/                # orquestador y subagentes del flujo de git
├── skills/                # skills de ese flujo
├── tools/                 # scripts de git
├── templates/             # cuerpo de la issue y de la pull request
├── MCPS/                  # dirección del MCP de GitHub
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # este archivo
├── AGENTS.md              # cómo se trabaja y cómo se escribe el código
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   ├── 000-historial/
│   │   ├── specs.md       # todas las specs, en orden, con su estado
│   │   ├── enmienda.md    # historial de enmiendas de la constitución
│   │   └── resumenes/     # resúmenes de specs antiguas
│   └── <issue>-nombre/    # 001 a 008 conservan su número
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # HTTP: llama a las acciones, no abre la base
├── asistencia/
│   ├── domain/            # reglas: no abren la base ni dibujan pantallas
│   ├── usecases/          # acciones del profesor y del alumno
│   ├── storage/           # almacén SQLite
│   ├── export.py          # CSV de filas ya cargadas
│   └── tunnel.py          # enlace público
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

---

## 3. Qué archivo vive en cada parte

| Archivo                             | Parte              | Qué hace                                                                            |
| ----------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `asistencia/domain/codes.py`        | Reglas             | Calcula el código y dice si el que escribió el alumno vale                          |
| `asistencia/domain/names.py`        | Reglas             | Acepta o rechaza el nombre                                                          |
| `asistencia/domain/session.py`      | Reglas             | Dice si la clase existe, si sigue abierta y si el código vale ahora                 |
| `asistencia/domain/attempts.py`     | Reglas             | Decide si los códigos fallados de una IP se han pasado y cuánto dura el bloqueo. No abre la base ni dibuja pantallas |
| `asistencia/usecases/attendance.py` | Acciones           | Abre, cierra, lista, exporta, quita y registra                                      |
| `asistencia/storage/sqlite.py`      | Almacén            | Abre `data/asistencia.db`, guarda y lee                                             |
| `asistencia/export.py`              | Acción de exportar | Da formato CSV a filas que ya están cargadas. No abre la base                       |
| `asistencia/tunnel.py`              | Borde              | Publica el enlace para que los alumnos entren desde casa. No sabe de asistencia     |
| `app.py`                            | Pantalla           | Recibe HTTP, saca la IP de quien se registra (con túnel, `CF-Connecting-IP`), llama a una acción y devuelve la respuesta |
| `static/`                           | Pantalla           | HTML, CSS y JavaScript. No se enteran de la base                                    |

---
