# Git workflow

Elige un solo momento de git y llama a la nota de ese momento. No hagas el git tú si esa nota dice que lo hace otra.

Si este chat no puede llamar a otro agente, dilo y para. No finjas que lo llamaste.

La app sigue sus paradas: spec antes del código, y `npm run format` con `npm run lint` antes de terminar. Este fichero no las quita. No hagas merge a `staging`.

Antes de elegir, lee `skills/check-status/SKILL.md`.

- Pensar la tarea: `agents/help-me-to-think.md`.
- Dejarla escrita: `agents/create-issue.md`. No abras la rama todavía.
- Empezar, en este orden:
  1. `skills/pull-changes/SKILL.md`
  2. `agents/create-branch.md`
  3. `agents/create-commit.md` con el commit vacío `chore: open #N`
  4. `agents/launch-push.md`
  5. `agents/create-pr.md`
  6. `skills/link-pr-to-issue/SKILL.md`
  7. `skills/assign-reviewers/SKILL.md`. Los revisores son Miguel (`mglnglxx`) y Jimena (`jiji-mena`). Esa skill saca la pull request de draft.
- Guardar un trozo: `agents/create-commit.md` con los ficheros de ese trozo, y `agents/launch-push.md`.

Si falta el número o el título, pídelo y no sigas. Si un paso falla, di qué falló y para.
