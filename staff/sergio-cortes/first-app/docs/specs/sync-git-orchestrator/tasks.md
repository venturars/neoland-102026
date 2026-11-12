# Tareas — sincronizar el orquestador git

1. Sustituir `staff/sergio-cortes/first-app/agents/git-workflow-agent.md`
   por `exercises/git-workflow-agent-template/agents/git-workflow-agent.md`.
   El diff de ese fichero queda vacío.

2. Comprobar el árbol git-workflow. Recorrer cada fichero bajo
   `exercises/git-workflow-agent-template` que exista en
   `staff/sergio-cortes/first-app`. Los únicos diffs permitidos son estos
   siete skills (ruta de script):
   `check-status`, `commit-changes`, `create-branch`,
   `create-branch-from-staging`, `create-empty-commit`, `launch-push`,
   `pull-changes`. En cada uno, el único cambio es
   `staff/sergio-cortes/first-app/tools/` frente a `./tools/`.

3. Desde la raíz del repositorio, ejecutar
   `staff/sergio-cortes/first-app/tools/check-status.sh`. Tiene que
   terminar bien.

4. Comprobar que no han cambiado `AGENTS.md`, `docs/CONSTITUTIONS.md`,
   `docs/TREE.md`, `docs/ARCHITECTURE.md`, `src/` ni `package.json`.
