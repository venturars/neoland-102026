# AGENT.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [CONSTITUTION.md](CONSTITUTION.md) dice **qué reglas** se cumplen; este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `CONSTITUTION.md`: las reglas no negociables.
2. Este archivo (`AGENT.md`).
3. `ARCHITECTURE.md`: las reglas de arquitectura, diseño y estilo que sigue todo el código.
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cada funcionalidad recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación de Victor. No se avanza sin un "ok" explícito.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de Victor |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de Victor |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de Victor |
| 4. Implementar | código + tests | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**

### 2.2 Planificar (`plan.md`)
- Arquitectura, modelo de datos, rutas/API, archivos que se crearán.
- Sección obligatoria **"Comprobación de la constitución"**: repasa P1–P6 y §5–§6 y di cómo los cumple el plan.
- Si propones una dependencia externa, justifícala aquí (constitución P3).

### 2.3 Desglosar (`tasks.md`)
- Lista de casillas `- [ ] T01 …` en orden de ejecución.
- Cada tarea es pequeña (un archivo o una función), tiene un resultado comprobable e indica qué `CA-xx` cubre.
- Primero el test, luego el código, siempre que sea posible.

### 2.4 Implementar
- Haz **una tarea cada vez**. Al acabarla, márcala `[x]` en `tasks.md`.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación. El código nunca se adelanta a los documentos.

---

## 3. Estructura de carpetas

```
asistenciapp/
├── CONSTITUTION.md        # reglas no negociables
├── AGENT.md               # este archivo
├── ARCHITECTURE.md        # reglas de arquitectura, diseño y estilo del código
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # Flask y las herramientas de desarrollo (pytest, ruff, mypy)
├── pytest.ini             # configuración de pytest
├── pyproject.toml         # configuración de ruff y mypy (no es un paquete instalable)
├── app.py                 # arranque: lee la configuración, monta las piezas y lanza (ARCHITECTURE C4)
├── attendance/            # código de la app, por capas (ARCHITECTURE O1)
│   ├── config.py          # Config y load_config: variables de entorno
│   ├── domain/            # reglas y tipos, sin E/S: códigos, nombres, clases, errores
│   ├── usecases/          # una acción de usuario por función: clases y registros
│   ├── entrypoints/web/   # Flask: fábrica, rutas, credencial, errores, validación, JSON
│   └── infra/             # SQLite, CSV, cloudflared, puertos
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests: test_<módulo>.py, y test_web_<área>.py para la web
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

El código sigue `ARCHITECTURE.md` desde la spec 005. Antes de añadir un módulo, mira en qué capa va (O1).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-discord-bot`.

---

## 4. Comandos

Ejecutar desde `staff/victor-chang/asistenciapp/`, **con el entorno activado**. Sin él, `python` puede ser el Python 2 del sistema, que falla con `SyntaxError: Non-ASCII character` (incidencia del 2026-10-23 en la spec 005, T19).

| Acción | Comando |
| --- | --- |
| Preparar el entorno (solo la primera vez) | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate` |
| Comprobar que es el Python del proyecto | `python --version` (debe decir `Python 3.13`) |
| Instalar el túnel (solo la primera vez) | `brew install cloudflared` |
| Arrancar para una clase online | `python app.py --tunel` (imprime el enlace público del panel) |
| Arrancar solo en local (desarrollo) | `python app.py` (abre en `http://localhost:8000`) |
| Ejecutar los tests | `pytest` |
| Dar formato al código | `ruff format` |
| Revisar estilo y errores habituales | `ruff check` |
| Revisar los tipos | `mypy` |
| Probar con otra BD, puerto o zona horaria | `ASISTENCIA_DB=/tmp/copia.db PORT=8001 ASISTENCIA_TZ=Europe/Madrid python app.py` |

Las dependencias de la app son Flask y `google-auth-oauthlib` (justificada en el plan 004 §7.1). pytest, ruff y mypy son herramientas de desarrollo: no cuentan como dependencias (constitución P3 v3.1).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/victor-chang/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Victor está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que Victor lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo Victor aprueba (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] `ruff format --check`, `ruff check` y `mypy` no dan ningún aviso.
- [ ] La lista de comprobación de `ARCHITECTURE.md` (§13) se cumple, o cada excepción está justificada en el `plan.md`.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Victor la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): CA-01 a CA-26 verificados. Revisión de código (2026-10-21, fase H): 30 tareas, 102 tests | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-discord-bot` | Idea futura | Fuera del MVP |
| `003-servidor-mcp` | Idea futura | Implementar MCP: que un asistente de IA (p. ej. Claude) pueda abrir y cerrar la asistencia, consultar listas y pedir informes por chat |
| `004-asistencia-meet` | 4 · Implementar (2026-10-25): spec v1.2, plan v2.1 y tareas v2.1 aprobados. T01–T09 hechas (fase C terminada); siguiente T10 | Asistencia automática de todos los participantes de una reunión de Meet, sin que el alumno haga nada |
| `005-adaptar-arquitectura` | ✅ Terminada v1.1 (2026-10-23): 21 tareas, CA-01 a CA-08 verificados, 240 tests; `ruff` y `mypy --strict` sin avisos | Código adaptado a `ARCHITECTURE.md` sin cambiar el comportamiento, salvo errores más claros y el título de 20 caracteres como máximo |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.
