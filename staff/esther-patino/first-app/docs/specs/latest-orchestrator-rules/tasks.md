# Tareas — reglas nuevas del flujo de git

1. Abrir la spec `close-issue-on-merge`.
   `spec.md` y `plan.md` dicen que nadie cierra la issue con una llamada.
   GitHub la cierra al fusionar en la rama por defecto.
   Fusionar solo en staging no la cierra.

2. Abrir `agents/create-branch.md` y las dos skills de rama.
   El tipo es el de la plantilla. Si no hay plantilla, se elige la más cercana.
   No se pregunta.

3. Abrir `tools/create-branch.sh` y `tools/create-branch-from-staging.sh`.
   Dejan de rechazar un tipo fuera de la lista de seis.
   La descripción sigue en minúsculas y con guiones.

4. Abrir `skills/link-pr-to-issue/SKILL.md`.
   Deja `Closes #N` y no llama a la API para cerrar la issue.
   El header de `MCPS/github-mcp-server/mcp.txt` está en `mcp.json` antes de escribir.
   Este paso va después de la spec `close-issue-on-merge`.

5. Abrir `agents/git-workflow-agent.md`.
   Sale el paso que cierra la issue con la API cuando la pull request ya está fusionada.
   Al enlazar, la issue sigue abierta.

6. Abrir `docs/ARCHITECTURE.md`.
   Los puntos de la rama y del enlace dicen lo mismo que estas tareas.
   El resto de los puntos sigue igual.

7. Comprobar.
   La rama usa el tipo de la plantilla y el enlace no cierra la issue con una llamada.
   `logic/`, `queries/`, `db/`, `clients/`, `scripts/` y `package.json` no cambian.
