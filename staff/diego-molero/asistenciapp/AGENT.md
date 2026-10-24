# AGENT.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [CONSTITUTION.md](CONSTITUTION.md) dice **qué reglas** se cumplen; este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `CONSTITUTION.md`: las reglas no negociables.
2. Este archivo (`AGENT.md`).
3. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
4. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cada cambio en esta aplicación recorre estas fases **en orden**, incluido cualquier cambio en código, tests, README u otra documentación de uso. Al terminar cada una, el agente **se detiene** y pide la aprobación de la persona que trabaja en esta carpeta. No se avanza sin un "ok" explícito.

Al comenzar un pedido sin una spec aprobada que lo cubra, el único archivo que se puede crear o modificar es su `specs/NNN-nombre/spec.md`. El agente presenta la spec y espera el sí antes de escribir el plan, las tareas o la implementación. Una issue, una rama o una pull request no sustituyen esa aprobación; las operaciones de Git siguen el flujo del repositorio.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de la persona que trabaja en esta carpeta |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de la persona que trabaja en esta carpeta |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de la persona que trabaja en esta carpeta |
| 4. Implementar | código + tests + documentación prevista | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados + conformidad final de la persona que trabaja en esta carpeta |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si el pedido no está cubierto por la spec activa, abre una nueva. No reutilices una spec terminada, como `001-checkin-codigo`, para autorizar ese cambio.

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
- Implementa únicamente las tareas aprobadas; incluye el README u otra documentación de uso cuando una tarea lo indique. Ningún archivo del cambio se adelanta a su spec aprobada ni a las aprobaciones del plan y las tareas.
- Si aparece un pedido fuera del alcance de la spec activa, detén ese pedido, escribe una spec nueva y espera su aprobación antes de continuar con sus fases.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación. El código nunca se adelanta a los documentos.

---

## 3. Estructura de carpetas

```
asistenciapp/
├── CONSTITUTION.md        # reglas no negociables
├── AGENT.md               # este archivo
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # aplicación Flask y punto de entrada
├── asistencia/            # lógica del servidor (paquete de Python)
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/diego-molero/asistenciapp/`:

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

- **Solo se edita dentro de `staff/diego-molero/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** La persona que trabaja en esta carpeta está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que la persona que trabaja en esta carpeta lo pida y confirme el mensaje y los archivos conforme al flujo de Git del repositorio.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo la persona que trabaja en esta carpeta aprueba (constitución §8).

---

## 6. Definición de "terminado"

Un cambio está terminado cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] La documentación de uso prevista en las tareas explica el cambio; el `README.md` se actualiza cuando el alcance aprobado lo requiere.
- [ ] La persona que trabaja en esta carpeta ha revisado el cambio, ha realizado la comprobación que corresponde y lo ha dado por bueno.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | Terminada con conformidad final (2026-10-23) | CA-01 a CA-08 revisados; 77 tests en verde; revisión de compañeros e incorporación a `staging` pendientes |
| Bot de Discord | Idea futura, sin número | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.
