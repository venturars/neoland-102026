# Arquitectura de AsistenciApp

Este documento dice **cómo se organiza el código**.

La forma sale de una arquitectura por capas: las reglas no saben dónde se guardan los datos ni cómo se dibuja la pantalla.

---

## 1. Tres partes

Las flechas solo van hacia dentro. Una parte de fuera puede llamar a una de dentro. Una de dentro no llama a una de fuera.

1. **Reglas** (`asistencia/domain/`): deciden si un registro vale. No dibujan pantallas ni abren la base.
2. **Acciones** (`asistencia/usecases/`): el profesor abre, cierra, lista, exporta o quita; el alumno se registra. Piden la decisión a las reglas y el guardado al almacén.
3. **Borde**: `app.py` y `static/` son la pantalla HTTP. `bot_discord.py` es el bot de Discord (proceso aparte): llama a las acciones y no abre la base. `asistencia/storage/` es el almacén: abre el archivo y guarda lo que la acción ya decidió.

`app.py` y `bot_discord.py` no abren la base. El almacén no decide reglas ni dibuja pantallas.

---

## 2. Estructura de carpetas

```
asistenciapp/
├── agents/                # orquestador y subagentes del flujo de git
├── skills/                # skills del flujo de git
├── tools/                 # scripts del flujo de git (desde la raíz del monorepo)
├── templates/             # plantillas de issue y pull request
├── MCPS/                  # referencia al MCP de GitHub
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # este archivo
├── AGENTS.md              # cómo se trabaja y cómo se escribe el código
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # Flask, pytest; discord.py justificado en spec 007
├── pytest.ini             # configuración de pytest
├── app.py                 # HTTP: llama a las acciones, no abre la base
├── bot_discord.py         # bot Discord: proceso aparte, llama a las acciones
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

El orquestador (`agents/git-workflow-agent.md`) reconoce el momento (issue, draft, specs, implementar, pull request) y llama al subagente o a la skill que toca. El padre no hace ese trabajo.

---

## 3. Qué archivo vive en cada parte

| Archivo | Parte | Qué hace |
| --- | --- | --- |
| `asistencia/domain/codes.py` | Reglas | Calcula el código y dice si el que escribió el alumno vale |
| `asistencia/domain/names.py` | Reglas | Acepta o rechaza el nombre |
| `asistencia/domain/session.py` | Reglas | Dice si la clase existe, si sigue abierta y si el código vale ahora |
| `asistencia/domain/attempts.py` | Reglas | Decide si los intentos de una IP se han pasado. No abre la base ni dibuja pantallas |
| `asistencia/usecases/attendance.py` | Acciones | Abre, cierra, lista, exporta, quita y registra |
| `asistencia/storage/sqlite.py` | Almacén | Abre `data/asistencia.db`, guarda y lee |
| `asistencia/export.py` | Acción de exportar | Da formato CSV a filas que ya están cargadas. No abre la base |
| `asistencia/tunnel.py` | Borde | Publica el enlace para que los alumnos entren desde casa. No sabe de asistencia |
| `app.py` | Pantalla | Recibe HTTP, llama a una acción y devuelve la respuesta |
| `bot_discord.py` | Borde | Bot de Discord (`discord.py`): registro con nombre visible y código. No abre la base |
| `static/` | Pantalla | HTML, CSS y JavaScript. No se enteran de la base |

---

## 4. Lo que esta app no usa

De ejemplos de arquitectura por capas **no** se copian, porque aquí no hacen falta:

- PostgreSQL, SQLAlchemy ni Alembic. El guardado es `sqlite3` y el archivo `data/asistencia.db`.
- Una segunda forma de guardar (memoria) ni una interfaz para elegirla. Solo hay un almacén.
- Una aplicación de línea de comandos genérica. Las entradas son `app.py` (HTTP) y, si se usa Discord, `bot_discord.py`.
- Variables `.env`, pre-commit ni documentación generada automáticamente. El token del bot vive en `data/discord_token.txt` (no se sube a git).
