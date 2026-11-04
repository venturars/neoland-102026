# Spec: Actualizar el orquestador del flujo de git

Issue: #871.

## Qué queremos conseguir
Que el agente que lleva el flujo de git en first-app siga las últimas reglas del curso al decidir qué paso toca y al empezar una tarea. Hoy elige el paso sin mirar el estado de la tarea y no dice cuándo crear la issue directamente ni cuándo pensarla antes.

## Cómo se usa
- Cualquier cambio en el proyecto se hace en una rama nueva, con una pull request nueva en draft.
- El agente elige el paso por cómo está la tarea, no por las palabras de la petición.
- Antes de crear la issue mira si están claros el problema, el resultado esperado, el alcance y cómo comprobarlo, y si encajan con el proyecto:
  - Si todo está claro, crea la issue y explica en una frase por qué no hacía falta pensarla más.
  - Si algo falta o se contradice, la piensa antes con `agents/help-me-to-think.md`. No vuelve a preguntar lo que ya quedó resuelto, salvo que haya algo nuevo.
- Para empezar, la issue ya está escrita, y la rama sale de `staging` antes de cualquier cambio.
- En los demás pasos, si falta un dato, lo pide antes de seguir, igual que hoy.

## Ejemplo
- Se pide «añade buscar usuarios por id, con su comando y su documento de Jupyter, y si no existe que dé `User not found: id <id>`». Está todo: el agente crea la issue y dice que el resultado y la prueba ya estaban claros.
- Se pide «mejora los usuarios». No se sabe qué ni cómo probarlo: el agente llama a `help-me-to-think` antes de escribir la issue.

## Fuera de alcance
- Cambiar los pasos de «Empezar», los otros agentes, las skills, los scripts de `tools/` o las plantillas.
- Cambiar las rutas de las skills: las de first-app son `./tools/...`.
- `AGENTS.md`, la constitución y las guías de la app.
- El flujo de git de AsistenciApp.
