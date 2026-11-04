# Tareas — alinear la apertura de pull request

1. Añadir `staff/sergio-cortes/first-app/docs/specs/align-pr-creation-flow/spec.md`,
   `plan.md` y este `tasks.md`.

2. Sustituir `staff/sergio-cortes/first-app/agents/git-workflow-agent.md`,
   `agents/create-pr.md` y `skills/create-draft/SKILL.md` por los del
   ejercicio. Los tres diffs quedan vacíos.

3. Sustituir `skills/create-pr-base-staging/SKILL.md` por el del ejercicio
   y cambiar la ruta del comando a
   `staff/sergio-cortes/first-app/tools/create-pr-base-staging.sh`.

4. Copiar `tools/create-pr-base-staging.sh` del ejercicio a
   `staff/sergio-cortes/first-app/tools/` y darle permiso de ejecución.

5. Actualizar `docs/ARCHITECTURE.md` en los puntos del plan (orquestador,
   create-pr, create-pr-base-staging, create-draft y el script nuevo).

6. Comprobar el árbol git-workflow. Los únicos desfases template ↔ first-app
   son las siete skills de ruta y `create-pr-base-staging` (misma clase).

7. Ejecutar `staff/sergio-cortes/first-app/tools/check-status.sh` desde la
   raíz del repositorio. Tiene que terminar bien.

8. Comprobar que no han cambiado `AGENTS.md`, `docs/CONSTITUTIONS.md`,
   `docs/TREE.md`, `src/`, `package.json` ni `MCPS/socket-mcp/`.
