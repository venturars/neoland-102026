# Tareas — sincronizar el flujo de git con la plantilla

- [x] 1. Copiar `exercises/git-workflow-agent-template/tools/create-pr-base-staging.sh` a `tools/create-pr-base-staging.sh`. El script termina bien con `bash -n`.

- [x] 2. Sustituir `agents/create-pr.md`, `agents/help-me-to-think.md` y `agents/git-workflow-agent.md` por los de la plantilla. En `git-workflow-agent.md` conservar las menciones a las paradas de «Orden» en `AGENTS.md`.

- [x] 3. Sustituir `skills/create-pr-base-staging/SKILL.md` por el de la plantilla. El comando apunta a `staff/raul-santamaria/mi-primer-proyecto/tools/create-pr-base-staging.sh`. El texto habla de «esta app», no de la carpeta del ejercicio.

- [x] 4. Sustituir `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md` por los de la plantilla.

- [x] 5. Sustituir `skills/check-status/SKILL.md`, `skills/pull-changes/SKILL.md`, `skills/create-empty-commit/SKILL.md`, `skills/launch-push/SKILL.md` y `skills/commit-changes/SKILL.md` por los de la plantilla. En cada una, la ruta del script es `staff/raul-santamaria/mi-primer-proyecto/tools/...`.

- [x] 6. Sustituir `skills/create-branch/SKILL.md` y `skills/create-branch-from-staging/SKILL.md` por los de la plantilla. Mantener la misma ruta `staff/raul-santamaria/mi-primer-proyecto/tools/`.

- [x] 7. Sustituir `skills/create-draft/SKILL.md` por el de la plantilla (sigue usándose cuando la PR ya existe).

- [x] 8. Abrir `docs/ARCHITECTURE.md`. Actualizar los bullets de `agents/create-pr.md`, `agents/git-workflow-agent.md`, `agents/help-me-to-think.md`, `skills/create-pr-base-staging/SKILL.md` y añadir `tools/create-pr-base-staging.sh`.

- [x] 9. Comprobar. Frente a `exercises/git-workflow-agent-template`, la única diferencia en skills con script es la ruta bajo `staff/raul-santamaria/mi-primer-proyecto/tools/`; en el orquestador, las paradas de «Orden». `staff/raul-santamaria/mi-primer-proyecto/tools/check-status.sh` desde la raíz del monorepo termina bien. `src/logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian.
