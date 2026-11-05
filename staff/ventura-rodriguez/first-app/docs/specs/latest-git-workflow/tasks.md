# Tareas — actualizar el flujo de git

1. Crea en `templates/issues/` las seis plantillas del tipo.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Quita `templates/issues/basic_issue.md`.
   En esa carpeta quedan feat, fix, docs, refactor, test y chore.

2. Crea en `templates/pull-request/` las seis plantillas del tipo.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Quita `templates/pull-request/basic-pull-request.md`.
   La sección Issue de cada una lleva `Closes #`.

3. Sustituye `agents/git-workflow-agent.md`, `agents/create-issue.md`, `agents/create-branch.md` y `agents/create-pr.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   El orquestador deja `Closes #N` al enlazar.
   Esos cuatro ficheros se leen igual que en la plantilla.

4. Sustituye `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/link-pr-to-issue/SKILL.md`, `skills/assign-reviewers/SKILL.md` y `skills/grill-me/SKILL.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   `link-pr-to-issue` deja `Closes #N` y no llama a la API para cerrar.
   Esas cinco skills se leen igual que en la plantilla.

5. Abre `skills/create-branch/SKILL.md` y `skills/create-branch-from-staging/SKILL.md`.
   El texto queda como el de la plantilla del curso.
   El comando sigue en `staff/ventura-rodriguez/first-app/tools/`.
   No pasa a `./tools/`.

6. Sustituye `tools/create-branch.sh` y `tools/create-branch-from-staging.sh`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Siguen pudiendo ejecutarse.
   Ya no rechazan el tipo por una lista fija.

7. Sustituye `MCPS/github-mcp-server/mcp.txt`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Incluye el header `X-MCP-Features: mcp_apps_disable_form_deferral`.
   `MCPS/socket-mcp/` no cambia.

8. Abre `docs/ARCHITECTURE.md`.
   Sustituye los puntos del apartado «Arquitectura» del plan.
   Salen los de `basic_issue.md` y `basic-pull-request.md`.
   `docs/TREE.md` no cambia.

9. Comprueba.
   Frente a la plantilla del curso, la diferencia que queda es la ruta `staff/ventura-rodriguez/first-app/tools/`.
   `logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian.
   Los dos scripts de rama terminan su revisión de sintaxis sin error.
