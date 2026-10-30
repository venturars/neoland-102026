# Tareas — subagentes antes de la spec

1. Abrir `AGENTS.md`, en «Orden».
   El texto queda como el del apartado «Orden» del plan.
   El párrafo de arriba sigue mandando seguir `agents/git-workflow-agent.md`.
   El resto de las secciones no cambia todavía.

2. Abrir `AGENTS.md`, en la primera regla.
   Pasa a «empieza por el orquestador y sigue «Orden»».
   El resto de las reglas no cambia.
   No se toca el `AGENTS.md` de la raíz.

3. Abrir `agents/git-workflow-agent.md`, en «Procesamiento».
   Llamar queda como el apartado «Llamar»: Task, tipo `generalPurpose`.
   La descripción es el nombre del subagente y el encargo es su fichero.
   El padre espera el resultado y no llama a la skill ni al MCP de ese momento.

4. Abrir `agents/help-me-to-think.md`, en «Procesamiento».
   Sigue siendo una pregunta cada vez.
   El subagente devuelve esa pregunta al orquestador.
   No espera la respuesta del alumno y no escribe ficheros.

5. Abrir `docs/CONSTITUTIONS.md`, en el primer párrafo.
   Sigue el paso por `spec.md`, `plan.md` y `tasks.md`, con una lectura humana.
   Se añade que antes está la issue, escrita por su subagente.
   La spec abre con `Issue: #N`.

6. Abrir `docs/ARCHITECTURE.md`, en el punto de `agents/git-workflow-agent.md`.
   El punto queda como el apartado «Guías» del plan.
   El resto de los puntos no cambia.
   No se mueve `agents/` a otra carpeta.

7. Comprobar.
   `logic/`, `queries/`, `db/`, `clients/`, `package.json` y las specs ya escritas no cambian.
   La issue #574 sigue igual.
   Cada llamada del orquestador nombra al subagente y no hace su trabajo.
