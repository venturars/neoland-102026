# Tareas — abrir la pull request en un paso

1. Crea `tools/create-pr-base-staging.sh`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   `bash -n` termina sin error.
   El script llama a `gh pr create` con `--base staging`, `--draft` y `--assignee "@me"`.

2. Sustituye `agents/git-workflow-agent.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   El paso de empezar llama a `create-pr` con `create-pr-base-staging`.
   Confirma el éxito de cada paso antes del siguiente.

3. Sustituye `agents/create-pr.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   La pull request se crea en draft y asignada en una misma invocación.
   Si ya existe, conserva el enlace con la issue y no abre otra.

4. Sustituye `skills/create-draft/SKILL.md`.
   El texto es el de la plantilla del curso, sin cambiarlo.
   Pasa a draft una pull request que ya existe.
   Si ya está en draft, conserva ese estado.

5. Sustituye `skills/create-pr-base-staging/SKILL.md`.
   El texto queda como el de la plantilla del curso.
   El comando es `bash staff/ventura-rodriguez/first-app/tools/create-pr-base-staging.sh "[RAMA]" "[TITULO]" "[CUERPO]"`.
   No usa la ruta de `exercises/` ni `./tools/`.

6. Abre `docs/ARCHITECTURE.md`.
   Sustituye los puntos del apartado «Arquitectura» del plan.
   Añade el del script después de `tools/launch-push.sh`.
   El punto de `skills/assign-author/SKILL.md` sigue igual y `docs/TREE.md` no cambia.

7. Comprueba.
   Frente a la plantilla del curso, la diferencia que queda es la ruta `staff/ventura-rodriguez/first-app/tools/create-pr-base-staging.sh`.
   `logic/`, `queries/`, `db/`, `clients/`, `package.json`, `MCPS/socket-mcp/` y `skills/assign-author/SKILL.md` no cambian.
   `bash -n tools/create-pr-base-staging.sh` termina sin error.
