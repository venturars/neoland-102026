# Tareas — alinear el flujo de git

1. Copiar `templates/` de `exercises/git-workflow-agent-template` a
   `staff/sergio-cortes/first-app/templates`. Borrar
   `basic_issue.md` y `basic-pull-request.md`.
   Quedan las doce plantillas del ejercicio, con `Closes #`.

2. Sustituir `agents/git-workflow-agent.md`, `create-issue.md`,
   `create-pr.md` y `create-branch.md` por los del ejercicio.
   El diff de esos cuatro ficheros queda vacío.

3. Sustituir `skills/create-issue`, `create-pr-base-staging`,
   `link-pr-to-issue` y `assign-reviewers` por las del ejercicio.
   El diff de esas cuatro skills queda vacío.

4. Sustituir `skills/create-branch` y `create-branch-from-staging`
   por las del ejercicio. Volver a poner la ruta
   `staff/sergio-cortes/first-app/tools/`.
   El único diff de esas dos es esa ruta.

5. Sustituir `tools/create-branch.sh` y
   `create-branch-from-staging.sh` por los del ejercicio.
   El diff de esos dos scripts queda vacío.

6. Sustituir `MCPS/github-mcp-server/mcp.txt` por el del ejercicio.
   No tocar `MCPS/socket-mcp/`. El diff de `mcp.txt` queda vacío.

7. Abrir `docs/ARCHITECTURE.md`. Sustituir las líneas por las del
   apartado «Arquitectura» del plan.
   Ya no aparecen `basic_issue`, `basic-pull-request` ni `Related to`.

8. Comprobar. `AGENTS.md` no ha cambiado. `src/` y `package.json`
   tampoco. Fuera de `docs/specs/adapt-git-workflow/`, no queda
   `Related to #N` ni `basic_issue`.
