# Tareas — actualizar el flujo de git

Issue: #860. La plantilla del curso es `exercises/git-workflow-agent-template/`.

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

4. Sustituye `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/link-pr-to-issue/SKILL.md`, `skills/assign-reviewers/SKILL.md` y `skills/grill-me/SKILL.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   `link-pr-to-issue` deja `Closes #N` y no llama a la API para cerrar.

5. Sustituye `skills/create-branch/SKILL.md` y `skills/create-branch-from-staging/SKILL.md` por el texto de la plantilla del curso.
   El comando sigue en `staff/diego-torres/first-app/tools/`.
   No pasa a `./tools/`.

6. Sustituye `tools/create-branch.sh` y `tools/create-branch-from-staging.sh`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Siguen pudiendo ejecutarse.
   Ya no rechazan el tipo por una lista fija.

7. Sustituye `MCPS/github-mcp-server/mcp.txt`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Incluye el header `X-MCP-Features: mcp_apps_disable_form_deferral`.
   `MCPS/socket-mcp/` no cambia.

8. Comprueba.
   Frente a la plantilla del curso, la diferencia que queda en `agents/`, `skills/`, `templates/`, `tools/` y `MCPS/github-mcp-server/` es la ruta `staff/diego-torres/first-app/tools/`.
   `basic_issue`, `basic-pull-request` y `Related to` no aparecen en la app.
   `src/`, `package.json`, `AGENTS.md` y `docs/` (salvo esta spec) no cambian.
   Los dos scripts de rama terminan su revisión de sintaxis (`bash -n`) sin error.
