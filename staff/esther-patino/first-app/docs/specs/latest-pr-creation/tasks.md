# Tareas — apertura de la pull request en un solo paso

1. Abrir `agents/create-pr.md`.
   La pull request se crea con base `staging`, en draft y asignada al usuario autenticado, en una misma invocación.

2. Abrir `agents/git-workflow-agent.md`.
   Llama a `create-pr` con `create-pr-base-staging`.
   Confirma cada paso antes del siguiente.
   Al enlazar, deja `Closes #N` y la issue sigue abierta.

3. Abrir `skills/create-pr-base-staging/SKILL.md`.
   Apunta a `staff/esther-patino/first-app/tools/create-pr-base-staging.sh`.

4. Abrir `tools/create-pr-base-staging.sh`.
   Llama a `gh pr create` con `--base staging`, `--draft` y `--assignee "@me"`.

5. Abrir `skills/create-draft/SKILL.md`.
   Pasa a draft una pull request que ya existe.

6. Abrir `docs/ARCHITECTURE.md`.
   Nombra el script y esa apertura en una sola invocación.
   El resto de los puntos sigue igual.

7. Comprobar.
   `src/`, `package.json` y `MCPS/socket-mcp/` no cambian.
   La issue #928 sigue abierta.
