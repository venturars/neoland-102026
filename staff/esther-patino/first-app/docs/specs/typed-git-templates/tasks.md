# Tareas — plantillas por tipo en el flujo de git

1. Copiar las seis plantillas de `exercises/git-workflow-agent-template/templates/issues/` a `staff/esther-patino/first-app/templates/issues/`.
   Son `feat_issue.md`, `fix_issue.md`, `docs_issue.md`, `refactor_issue.md`, `test_issue.md` y `chore_issue.md`.
   El texto no cambia.
   No se añade ninguna más.

2. Copiar las seis plantillas de `exercises/git-workflow-agent-template/templates/pull-request/` a `staff/esther-patino/first-app/templates/pull-request/`.
   Son `feat-pull-request.md`, `fix-pull-request.md`, `docs-pull-request.md`, `refactor-pull-request.md`, `test-pull-request.md` y `chore-pull-request.md`.
   El texto no cambia.
   No se añade ninguna más.

3. Borrar `staff/esther-patino/first-app/templates/issues/basic_issue.md`.
   No queda otra plantilla de issue con ese nombre.
   Las seis del paso 1 siguen.
   No se borra ninguna de esas seis.

4. Borrar `staff/esther-patino/first-app/templates/pull-request/basic-pull-request.md`.
   No queda otra plantilla de pull request con ese nombre.
   Las seis del paso 2 siguen.
   No se borra ninguna de esas seis.

5. Abrir `skills/create-issue/SKILL.md`.
   El título toma la forma de la plantilla del tipo.
   El cuerpo rellena la plantilla del tipo en `templates/issues/`. Si el tipo no tiene plantilla, usa la más cercana.
   La frase que prohíbe `gh` y un script de `tools/` sigue.

6. Abrir `agents/create-issue.md`.
   La validación rellena la plantilla del tipo en `templates/issues/`. Si el tipo no tiene plantilla, usa la más cercana.
   Las herramientas nombran `templates/issues/`, una plantilla por tipo.
   Se quita la parada de los 72 caracteres.

7. Abrir `skills/create-pr-base-staging/SKILL.md`.
   El cuerpo usa la plantilla del tipo en `templates/pull-request/`. Si el tipo no tiene plantilla, usa la más cercana.
   La sección Issue se deja vacía.
   La frase que prohíbe `gh` y un script de `tools/` sigue.

8. Abrir `agents/create-pr.md`.
   La validación rellena la plantilla del tipo en `templates/pull-request/`. La sección Issue se deja vacía. Si el tipo no tiene plantilla, usa la más cercana.
   Las herramientas nombran `templates/pull-request/`, una plantilla por tipo.
   El agente sigue sin enlazar la issue.

9. Abrir `skills/link-pr-to-issue/SKILL.md`.
   La sección Issue queda en `Closes #N`.
   En ese mismo paso la issue pasa a cerrada.
   No se espera a fusionar la pull request.

10. Abrir `agents/git-workflow-agent.md`.
    El paso del enlace cierra la issue.
    La herramienta de enlace deja `Closes #N` en el cuerpo y cierra la issue.
    El orquestador sigue siendo quien enlaza.

11. Abrir `docs/ARCHITECTURE.md`.
    Las dos líneas de las plantillas básicas pasan a las doce plantillas por tipo.
    La línea de `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` y cierra la issue al enlazar.
    El resto de los puntos sigue igual.

12. Abrir `docs/specs/git-workflow-in-first-app/spec.md`.
    La frase del enlace pasa a `Closes` y el número, y la tarea queda cerrada.
    El fallo es que la tarea siga abierta después de enlazar.
    El resto de la spec sigue igual.

13. Abrir `docs/specs/git-workflow-in-first-app/plan.md`.
    La línea de `skills/link-pr-to-issue/SKILL.md` deja `Closes #N`.
    Cierra la issue al enlazar.
    El resto del plan sigue igual.

14. Comprobar.
    `templates/issues/` y `templates/pull-request/` tienen seis plantillas cada una y no quedan las básicas.
    La skill de enlace y el orquestador nombran `Closes #N` y el cierre al enlazar.
    `logic/`, `queries/`, `db/`, `clients/`, `scripts/` y `package.json` no cambian.
