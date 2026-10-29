# bootcamp-102026

Curso de IA Engineer. Se aprende iterando: pides un cambio con tus palabras, lees lo que el agente escribe, lo corriges y solo entonces pasa al código. Si el resultado no encaja, se cambia el documento del cambio y se vuelve a pedir.

Cada proyecto automatiza ese ciclo de una forma distinta. Las reglas de uno no valen en otro. Antes de pedir un cambio, abre la guía del agente y la constitución de **ese** proyecto.

## Qué mirar en cualquier proyecto

1. **La guía del agente.** Dice cómo tiene que trabajar la IA: cuándo se para, qué ficheros crea y qué no puede inventar.
2. **La constitución.** Lo que no se negocia: qué hace el proyecto, cómo se escribe el código y qué queda fuera.
3. **La spec del cambio.** Qué se pide, para quién y cómo se comprueba que está hecho. El plan dice cómo. Las tasks son los pasos.
4. **El README del proyecto.** Cómo se arranca en tu ordenador.

El código sigue a esos documentos. Si dos documentos se contradicen, no se elige uno en silencio: se pregunta.

## Dónde está cada cosa

| Carpeta | Para qué sirve |
| --- | --- |
| `exercises/` | Proyectos compartidos. Ahí está el punto de partida. |
| `staff/<tu-carpeta>/` | Tu copia. El trabajo de clase se hace aquí, no en la carpeta de otra persona. |

## first-app

Primera app del curso. Gestiona usuarios con Node y SQLite. Sirve para aprender la lógica de la aplicación y el desarrollo guiado por especificaciones.

**Automatización.** El agente trabaja en dos tiempos. Primero crea `docs/specs/<nombre>/spec.md` y `plan.md`. Si la constitución, el código y la spec dicen lo mismo, crea también `tasks.md`. Ahí se para y no toca código. Tú lees esos ficheros. La implementación empieza cuando tú la pides: entonces ejecuta `tasks.md` y no inventa pasos.

Un paquete de Node nuevo, o un cambio de versión, se revisa con Socket antes de aceptar el plan. Al cerrar una funcionalidad hay un cliente en `clients/terminal/` para probarla a mano, y se lanzan `pnpm format` y `pnpm lint`.

Los documentos están en tu copia, `staff/<tu-carpeta>/first-app/`:

| Fichero | Qué guarda |
| --- | --- |
| `AGENTS.md` | Cómo trabaja el agente en esta app. |
| `docs/CONSTITUTIONS.md` | La forma de una función de `logic/` y el orden spec, plan, tasks. |
| `docs/ARCHITECTURE.md` | El trabajo de cada capa: `logic/`, `queries/`, `db/`, `clients/`. |
| `docs/TREE.md` | El árbol de ficheros. |
| `docs/DATABASE.md` | La tabla y las consultas. |
| `docs/ERRORS.md` | Las frases de error. |
| `docs/STYLE.md` | La forma de cada línea. |
| `docs/specs/<nombre>/` | La spec, el plan y las tasks del cambio en curso. |

## AsistenciApp

Pasar lista en una clase online en menos de un minuto. Python y Flask. El punto de partida compartido es `exercises/asistenciapp/`. Tu copia, si la tienes, está en `staff/<tu-carpeta>/asistenciapp/`.

**Automatización.** Cada funcionalidad recorre cuatro fases y el agente se detiene al acabar cada una. Sigue cuando hay un ok explícito.

| Fase | Fichero | Qué responde |
| --- | --- | --- |
| Especificar | `spec.md` | Qué hay que construir y por qué. No nombra tecnologías. |
| Planificar | `plan.md` | Cómo se construye y cómo cumple la constitución. |
| Desglosar | `tasks.md` | Pasos pequeños. Cada uno apunta a un criterio de aceptación. |
| Implementar | código y tests | Una task cada vez. `pytest` tiene que pasar. |

Si falta un dato, el documento lo marca como `[NECESITA ACLARACIÓN]`. No se inventa la respuesta.

Documentación del proyecto:

- [README](exercises/asistenciapp/README.md): cómo preparar el entorno, arrancar la clase y cerrar la app.
- [CONSTITUTION.md](exercises/asistenciapp/CONSTITUTION.md): privacidad, dependencias mínimas, stack y el orden spec, plan, tasks.
- [AGENT.md](exercises/asistenciapp/AGENT.md): el manual de trabajo del agente.
- [Spec 001, check-in con código](exercises/asistenciapp/specs/001-checkin-codigo/spec.md): la funcionalidad ya cerrada. El plan y las tasks están en la misma carpeta.

## ChromaDB

Un índice local de la documentación oficial de Python, de la versión que descargas. El agente lo consulta al escribir código, en lugar de fiarse de otra versión que recuerde. ChromaDB guarda el índice y Ollama calcula los vectores. Todo corre en tu equipo. El proyecto compartido es `exercises/ChromaDB/`.

**Automatización.** Hay un agente principal y dos subagentes. El principal no escribe código ni lanza las comprobaciones: escribe la spec, el plan y las tasks, y abre rondas. En cada ronda lanza al developer. El tester entra si la task toca `src/core` o `src/sdk`. El developer, antes de escribir Python, usa la skill `python-docs` y consulta el índice con scripts.

El CRUD de usuarios con Jupyter vive en `src/` y es otro ejercicio dentro del mismo proyecto: no usa ChromaDB ni Ollama.

Documentación del proyecto:

- [README](exercises/ChromaDB/README.md): entorno, Ollama, descarga de la documentación, índice, consultas y notebooks.
- [AGENTS.md](exercises/ChromaDB/AGENTS.md): el ciclo de rondas y los comandos.
- [Constitución](exercises/ChromaDB/docs/CONSTITUTION.md): qué entra en el índice, el estilo y las capas del CRUD.
- [Developer](exercises/ChromaDB/agents/developer.md): qué puede hacer el subagente que escribe código.
- [Tester](exercises/ChromaDB/agents/tester.md): qué comprueba y qué no puede editar.
- [Skill python-docs](exercises/ChromaDB/skills/python-docs/SKILL.md): cuándo buscar en la documentación y con qué comando.

## El resto del repositorio

`exercises/halloween/`, `exercises/pomodoro/` y `exercises/poema.md` son ejercicios sueltos. No definen cómo trabaja el agente. Las presentaciones de cada persona están en `staff/<tu-carpeta>/README.md`.
