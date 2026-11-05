# Plan — flujo de git al día

Cumple `docs/specs/flujo-git/spec.md`.

## Tocar

- `agents/help-me-to-think.md`, `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`: devuelven las preguntas que hagan falta y paran.
- `agents/git-workflow-agent.md`: si la issue ya está escrita y hay cambios, el momento es Empezar. Si no puede reanudar la entrevista, pasa el historial. Los revisores siguen siendo `mglnglxx` y `jiji-mena`.
- `skills/commit-changes/SKILL.md`: la descripción nombra el fichero o la función y el cambio. El comando sigue en `staff/meghan-martin/first-app/tools/commit-changes.sh`.
- `agents/create-pr.md` y `skills/create-pr-base-staging/SKILL.md`: una llamada abre la pull request en draft y asignada.
- `tools/create-pr-base-staging.sh`: ese comando.
- `agents/create-issue.md`, `skills/create-issue/SKILL.md` y `skills/create-draft/SKILL.md`: la plantilla que falta se sustituye por la más cercana. El draft se confirma.

## No tocar

- `src/`, `package.json` y `MCPS/socket-mcp/`
- `skills/assign-reviewers/SKILL.md`
- Los scripts cuya única diferencia con la plantilla es la ruta o el arranque común

## Comprobar

Leer las notas de arriba. `bash -n tools/create-pr-base-staging.sh` desde `first-app`.
