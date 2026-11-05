# Tareas — actualizar el flujo de git

- [x] 1. Crear en `templates/issues/` las seis plantillas del tipo con el texto de `exercises/git-workflow-agent-template`. Borrar `templates/issues/basic_issue.md`. En la carpeta quedan feat, fix, docs, refactor, test y chore.

- [x] 2. Crear en `templates/pull-request/` las seis plantillas del tipo con el texto del ejercicio. Borrar `templates/pull-request/basic-pull-request.md`. La sección Issue de cada una lleva `Closes #`.

- [x] 3. Sustituir `agents/git-workflow-agent.md`, `agents/create-issue.md`, `agents/create-branch.md` y `agents/create-pr.md` por los del ejercicio. En el orquestador conservar las menciones a las paradas de «Orden» en `AGENTS.md`. El resto de cada fichero coincide con la plantilla.

- [x] 4. Sustituir `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/link-pr-to-issue/SKILL.md`, `skills/assign-reviewers/SKILL.md` y `skills/grill-me/SKILL.md` por las del ejercicio. `link-pr-to-issue` deja `Closes #N` y no llama a la API para cerrar.

- [x] 5. Sustituir `skills/create-branch/SKILL.md` y `skills/create-branch-from-staging/SKILL.md` por las del ejercicio. Volver a poner la ruta `staff/raul-santamaria/mi-primer-proyecto/tools/`. El único diff frente al ejercicio es esa ruta.

- [x] 6. Sustituir `tools/create-branch.sh` y `tools/create-branch-from-staging.sh` por los del ejercicio. Los dos scripts terminan su revisión de sintaxis sin error.

- [x] 7. Sustituir `MCPS/github-mcp-server/mcp.txt` por el del ejercicio. Incluye el header `X-MCP-Features: mcp_apps_disable_form_deferral`. `MCPS/socket-mcp/` no cambia.

- [x] 8. Abrir `docs/specs/adapt-git-workflow/spec.md`. Sustituir el enlace por `Closes #N` y la regla de cierre al fusionar en la rama por defecto, como en esta spec.

- [x] 9. Abrir `docs/ARCHITECTURE.md`. Sustituir los bullets del apartado «Arquitectura» del plan. Salen `basic_issue`, `basic-pull-request` y `Related to #N`. `docs/TREE.md` no cambia.

- [x] 10. Comprobar. Frente al ejercicio, la diferencia que queda es la ruta de `tools/` y las paradas de «Orden» en el orquestador. `src/logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian. `staff/raul-santamaria/mi-primer-proyecto/tools/check-status.sh` termina bien desde la raíz del monorepo.
