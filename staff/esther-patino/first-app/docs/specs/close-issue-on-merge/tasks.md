# Tareas — cerrar la issue al fusionar la pull request

1. Abrir `skills/link-pr-to-issue/SKILL.md`.
   La línea del cuerpo queda `Closes #N`.
   Ese paso no cierra la issue.
   El cierre queda para cuando la pull request ya está fusionada.

2. Abrir `agents/git-workflow-agent.md`.
   Al enlazar, la issue sigue abierta.
   Cuando la pull request ya está fusionada, se cierra la issue si sigue abierta.
   No se cierra en ningún paso anterior.

3. Abrir `docs/ARCHITECTURE.md`.
   El punto de `link-pr-to-issue` dice `Closes #N` y que la issue se cierra al fusionar.
   El resto de los puntos sigue igual.

4. Abrir la spec `git-workflow-in-first-app`.
   `spec.md` y `plan.md` dicen lo mismo que la arquitectura.
   El resto de esa spec sigue igual.

5. Comprobar.
   Esos ficheros coinciden: la issue sigue abierta al enlazar y se cierra al fusionar.
   `logic/`, `queries/`, `db/`, `clients/`, `scripts/` y `package.json` no cambian.
