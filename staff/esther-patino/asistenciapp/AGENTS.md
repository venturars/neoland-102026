# AGENTS.md — Manual de trabajo para agentes de IA

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: cómo se organiza el código.
3. `docs/TREE.md`: la estructura de carpetas.
4. `docs/STYLE.md`: cómo se escribe el código.
5. Este archivo (`AGENTS.md`).
6. La spec activa: `specs/NNN-nombre/spec.md` (ver §4 "Estado actual").
7. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la documentación, **para y pregunta** antes de escribir nada.

- **Solo se edita dentro de la carpeta de este proyecto.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Quien trabaja en el proyecto está aprendiendo este modo de trabajo: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que lo pida quien trabaja en el proyecto.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que la aprueba quien trabaja en el proyecto (constitución §8). El archivo está en `docs/CONSTITUTION.md`.

---

## 2. Flujo SDD paso a paso

Cada funcionalidad recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación de quien trabaja en el proyecto. No se avanza sin un "ok" explícito.

Antes de tocar un fichero de la app:

- **Ningún fichero de la app sin spec aprobado.** No se modifican código, tests, el documento de uso de la app ni otra documentación de uso sin un spec aprobado que cubra ese cambio.
- Un spec aprobado de otro cambio no cubre este.
- Una issue, una rama o una pull request no sustituyen a ese spec ni al «ok» de quien trabaja en el proyecto.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de quien trabaja en el proyecto |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de quien trabaja en el proyecto |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de quien trabaja en el proyecto |
| 4. Implementar | código + tests | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**

### 2.2 Planificar (`plan.md`)
- Arquitectura, modelo de datos, rutas/API, archivos que se crearán.
- Sección obligatoria **"Comprobación de la constitución"**: repasa P1–P6 y §5–§6 y di cómo los cumple el plan.
- Si propones una dependencia externa, justifícala aquí, como pide [docs/CONSTITUTION.md](docs/CONSTITUTION.md).

### 2.3 Desglosar (`tasks.md`)
- Lista de casillas `- [ ] T01 …` en orden de ejecución.
- Cada tarea es pequeña (un archivo o una función), tiene un resultado comprobable e indica qué `CA-xx` cubre.
- Primero el test, luego el código, siempre que sea posible.

### 2.4 Implementar
- Haz **una tarea cada vez**. Al acabarla, márcala `[x]` en `tasks.md`.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación. El código, los tests, el documento de uso de la app y cualquier otra documentación de uso nunca se adelantan a los documentos.

---

## 3. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Quien trabaja en el proyecto la ha probado y la ha dado por buena.

---

## 4. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-require-approved-spec` | ✅ Terminada (2026-10-23): constitución 2.2 y este manual. T01 a T07 hechas; CA-01 a CA-04 leídos | Ningún fichero de la app sin un spec aprobado que cubra ese cambio |
| `003-startup-headings` | 4. Implementar · T01 a T03 hechas (2026-10-23) | CA-01 a CA-03 leídos en el diff del README. Falta el visto bueno |
| `004-impersonal-references` | 4. Implementar · T01 a T04 hechas (2026-10-23) | CA-01, CA-02 y CA-05 leídos. Las specs 001, 002 y 003 no se han tocado. Falta el visto bueno |
| `005-docs-and-architecture` | 4. Implementar · T01 a T12 hechas (2026-10-23) | Implementada. pytest: 82 passed. Las specs 001 a 004 no están en el diff. Falta el visto bueno |
| `006-ip-access-control` | 4. Implementar · T01 a T09 hechas (2026-10-24) | pytest: 98 passed. Nadie quita ni cambia una IP de la blacklist. Falta el visto bueno |
| `007-late-arrivals` | 4. Implementar · T01 a T11 hechas (2026-10-27) | pytest: 107 passed. A 400 px se lee el texto y no hay desplazamiento horizontal. Falta el visto bueno |
| `008-split-agents-docs` | 4. Implementar · T01 a T09 hechas (2026-10-29) | Implementada. pytest: 115 passed. La arquitectura lista `TREE.md` y `STYLE.md`. Las specs 001 a 007 no están en el diff. Falta el visto bueno |


> El agente actualiza esta tabla cada vez que una spec cambia de fase.
