# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. La [arquitectura](docs/ARCHITECTURE.md) dice **qué hace cada parte**. Este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: qué hace cada parte.
3. Este archivo (`AGENTS.md`).
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual"). Busca specs **únicamente** en `staff/maria-osipuk/asistenciapp/specs/`. Un spec o una aprobación de un compañero no autorizan un cambio aquí.
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cada cambio en esta app recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación explícita de la persona que trabaja en esta carpeta. No se avanza sin un "ok" explícito. Una issue, una rama o una pull request **no sustituyen** al spec.

Al empezar el cambio, el único fichero nuevo permitido es el `spec.md` dentro de `staff/maria-osipuk/asistenciapp/specs/`. El agente lo enseña y espera el ok. El plan, las tasks y el cambio vienen después.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que hacer y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de quien trabaja en esta carpeta |
| 2. Planificar | `plan.md` | ¿**Cómo** lo hacemos? | Pasa la comprobación de la constitución + esa misma aprobación |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + esa misma aprobación |
| 4. Implementar | el cambio que digan las tasks | Hacerlo, tarea a tarea. Incluye el README cuando una task lo diga | Criterios verificados |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si ninguna spec **local** aprobada describe lo pedido, no se reutiliza `001-checkin-codigo` ni se usa una spec de un compañero: se abre `staff/maria-osipuk/asistenciapp/specs/NNN-nombre/spec.md` con el siguiente número disponible en esa carpeta.

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
- Ningún fichero de la app se adelanta al spec. Si ninguna spec local aprobada cubre el pedido, **para**, escribe el spec en `staff/maria-osipuk/asistenciapp/specs/` y espera aprobación.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación.

---

## 3. Estructura de carpetas

```
asistenciapp/
├── AGENTS.md              # este archivo: cómo trabajar
├── README.md              # cómo arrancar la app (para humanos)
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # qué hace cada parte
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # entrada HTTP, puerto y túnel
├── asistencia/
│   ├── domain/
│   │   ├── codes.py       # códigos
│   │   ├── names.py       # nombres
│   │   ├── session.py     # la clase existe, está abierta y el código vale
│   │   └── attempts.py    # tope de intentos y error de bloqueo
│   ├── usecases/
│   │   └── attendance.py  # acciones de profesor y alumno
│   ├── storage/
│   │   └── sqlite.py      # lectura y escritura
│   ├── export.py          # CSV de filas ya cargadas
│   └── tunnel.py          # túnel, lo usa app.py
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos (no se sube a git)
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/maria-osipuk/asistenciapp/`:

| Acción | Comando |
| --- | --- |
| Preparar el entorno (solo la primera vez) | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate` |
| Instalar el túnel (solo la primera vez) | `brew install cloudflared` |
| Arrancar para una clase online | `python app.py --tunel` (imprime el enlace público del panel) |
| Arrancar solo en local (desarrollo) | `python app.py` (abre en `http://localhost:8000`) |
| Ejecutar los tests | `pytest` |

Las únicas dependencias son Flask y pytest (constitución P3).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/maria-osipuk/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar quien trabaja en esta carpeta.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que quien trabaja en esta carpeta lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo aprueba quien trabaja en esta carpeta (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Quien trabaja en esta carpeta la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | ✅ Implementada (2026-10-23) | Ningún fichero de esta app se toca sin un spec local aprobado |
| `003-aclarar-instrucciones-arranque` | ✅ Implementada (2026-10-23) | T01–T03 hechas en el README, sin cambio de requisitos |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-10-23) | Referencias personales quitadas de la documentación. Instrucciones con un usuario genérico |
| `005-reorganizar-documentos-y-arquitectura` | ✅ Implementada (2026-10-23) | Dominio, acciones, almacenamiento y entrada HTTP. Correcciones de pruebas, tipos y tabla de estado. Tres fallos de validación quedan para otra spec |
| `006-limitar-intentos-por-ip` | ✅ Implementada (2026-10-26) | Tope de 5 intentos por segundo y 20 por minuto. Con el túnel, la dirección es `CF-Connecting-IP` si la conexión es la de este ordenador. Falta la prueba de quien trabaja en esta carpeta |
| Bot de Discord | Idea futura, sin número | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

---

## 8. Funciones comprensibles

Una persona tiene que poder leer una función sin adivinar. No se añade un formateador, un linter ni otra herramienta para vigilar estas normas.

- Cada módulo explica en pocas líneas cuál es su responsabilidad.
- Una función hace una sola cosa y el nombre dice cuál.
- Se lee de arriba abajo.
- Los parámetros y el resultado llevan tipos.
- El docstring dice qué entra, qué sale y qué errores importan, con `:param`, `:return`, `:rtype` y `:raises`.
- Si un ejemplo corto ayuda, va en `Usage::`.
- No se comenta una línea que ya se entiende leyéndola.
- No hay abreviaturas ambiguas, funciones que solo pasan la llamada, ni la misma regla escrita dos veces.
- Las explicaciones y los mensajes que ve el usuario van en español.
