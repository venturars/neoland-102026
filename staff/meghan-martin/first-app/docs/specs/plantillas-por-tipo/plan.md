# Plan — plantillas de git por tipo

Cumple `docs/specs/plantillas-por-tipo/spec.md`. No es una acción nueva. No se toca `src/`.

## Revisión

Hecha el 3 de noviembre de 2026. La rama por defecto del repositorio es `staging`. Por eso `Closes #N` en una pull request hacia `staging` cierra la issue al fusionar. La base no cambia.

Las doce plantillas salen de `exercises/git-workflow-agent-template` en el commit `25208d23157626954906ffe7da32757c58d9a66e`. Se leen con `git show`. No se copia el resto de ese ejercicio.

No se instalan paquetes. No hace falta una revisión de Socket: no cambia ninguna dependencia.

## Tocar

Rutas dentro de `staff/meghan-martin/first-app/`:

- `templates/issues/{feat,fix,docs,refactor,test,chore}_issue.md`: las seis plantillas de issue.
- `templates/pull-request/{feat,fix,docs,refactor,test,chore}-pull-request.md`: las seis plantillas de pull request.
- `templates/issues/basic_issue.md` y `templates/pull-request/basic-pull-request.md`: se retiran.
- `agents/create-issue.md`, `agents/create-pr.md`, `agents/create-branch.md`, `agents/git-workflow-agent.md`: eligen el tipo y dicen cómo quedan las casillas y el cierre.
- `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`, `skills/assign-reviewers/SKILL.md`, `skills/link-pr-to-issue/SKILL.md`: lo mismo, en el paso concreto.
- `AGENTS.md`, `docs/GIT-AUTOMATION.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`: nombran las doce plantillas.
- `docs/specs/plantillas-por-tipo/`: esta spec, este plan y las tareas.

## No tocar

- `tools/`, `package.json`, el lock y el código de `src/`.
- Las specs ya escritas. Su texto se queda como estaba.
- `.github/pull_request_template.md`. Sigue siendo la plantilla en inglés de la app.

## Comprobar

1. Están las doce plantillas y no quedan las dos genéricas ni una referencia activa a ellas fuera de las specs antiguas.
2. Los seis tipos usan la misma palabra en la issue, en la rama y en la pull request. Un tipo sin plantilla elige el más cercano.
3. El draft deja las casillas vacías. Al pedir revisión se marcan solo las comprobadas. El enlace es `Closes #N`, una vez.
4. La rama por defecto leída es `staging`. La base de la pull request sigue siendo `staging`.
5. El diff no toca scripts, `src/` ni `package.json`.
6. Desde `first-app`, `pnpm format` y después `pnpm lint`. No se instalan paquetes. El formato no tiene que cambiar el código.
