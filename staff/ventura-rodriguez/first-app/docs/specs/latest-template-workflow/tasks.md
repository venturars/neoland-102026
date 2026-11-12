# Tareas — dejar el flujo de git al día

1. Sustituye `agents/git-workflow-agent.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Si la issue ya está escrita y el trabajo siguiente hace cambios, el momento es Empezar.
   Si no puede reanudar el subagente, pasa el historial de preguntas y respuestas.

2. Sustituye `agents/help-me-to-think.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Hace las preguntas que hagan falta, cada una con su respuesta recomendada, y para.
   El orquestador espera y vuelve a llamar con las respuestas.

3. Sustituye `skills/grill-me/SKILL.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Devuelve las preguntas y no sigue hasta que la llamen con las respuestas.
   Sigue sin script y sin MCP.

4. Sustituye `skills/grill-with-docs/SKILL.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Devuelve las preguntas y no sigue hasta que la llamen con las respuestas.
   Si la respuesta está en el repositorio, la lee y no pregunta eso.

5. Sustituye `skills/commit-changes/SKILL.md`.
   El texto queda como el de la plantilla del curso.
   El comando es `staff/ventura-rodriguez/first-app/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`.
   La descripción nombra el fichero o la función y el cambio, en una sola línea.

6. Abre `docs/ARCHITECTURE.md`.
   Sustituye los tres puntos del apartado «Arquitectura» del plan.
   Los puntos de `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md` siguen igual.
   `docs/TREE.md` no cambia.

7. Comprueba.
   Los cuatro textos copiados quedan iguales que la plantilla.
   En `commit-changes` la única diferencia es `staff/ventura-rodriguez/first-app/tools/commit-changes.sh`. Las skills que solo diferían en la ruta no cambian.
   `logic/`, `queries/`, `db/`, `clients/`, `package.json`, `MCPS/socket-mcp/` y `docs/TREE.md` no cambian.
