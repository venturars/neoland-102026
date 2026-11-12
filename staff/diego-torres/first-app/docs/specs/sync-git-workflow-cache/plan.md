# Plan — poner al día el flujo de git con la plantilla del curso

Issue: #1165

No es una funcionalidad de la app. No toca `src/` ni `package.json`. No hay firma nueva, SQL nuevo, mensaje de error nuevo ni paquete de Node, así que no entra Socket. `tools/github-cache.mjs` solo usa módulos de Node y los programas `git` y `gh`.

Esta rama sale de `staging`. La plantilla es `exercises/git-workflow-agent-template`, tal como está en esta rama.

## Ficheros

Se crean, copiados de la plantilla sin cambios:

- `tools/github-cache.mjs`
- `templates/issues/knowledge_issue.md`
- `templates/pull-request/knowledge-pull-request.md`

Se crea, copiado de la plantilla, con la ruta de esta carpeta:

- `skills/github-cache/SKILL.md`

Se sustituyen por el texto de la plantilla:

- `agents/git-workflow-agent.md`
- `agents/create-pr.md`
- `agents/create-commit.md`
- `skills/assign-reviewers/SKILL.md`

Se sustituyen por el texto de la plantilla, con la ruta de esta carpeta:

- `skills/commit-changes/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`

No se tocan:

- `skills/check-status`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `launch-push` y `pull-changes`: su única diferencia con la plantilla es la ruta.
- `MCPS/socket-mcp/`, que no está en la plantilla y es de esta app.
- `AGENTS.md`, `docs/TREE.md` y `docs/ARCHITECTURE.md`: no nombran los ficheros que cambian, y el árbol lista las carpetas, no su contenido.
- `.gitignore` de la raíz: ya ignora `.git-workflow-cache.json`, sus temporales y su `.lock`.

## Rutas

Cada ruta de la plantilla se cambia por la de esta carpeta, desde la raíz del repo:

| Skill | En la plantilla | Aquí |
| --- | --- | --- |
| `github-cache` | `node exercises/git-workflow-agent-template/tools/github-cache.mjs` | `node staff/diego-torres/first-app/tools/github-cache.mjs` |
| `commit-changes` | `./tools/commit-changes.sh` | `staff/diego-torres/first-app/tools/commit-changes.sh` |
| `create-pr-base-staging` | `bash ./exercises/git-workflow-agent-template/tools/create-pr-base-staging.sh` | `bash staff/diego-torres/first-app/tools/create-pr-base-staging.sh` |

## La caché

`tools/github-cache.mjs` busca la raíz con `git rev-parse --show-toplevel` y guarda allí `.git-workflow-cache.json`. No hay que cambiar nada para usarla desde esta carpeta. Guarda alias y logins, nunca correos ni permisos, y separa los datos por servidor, cuenta y repositorio.

## Qué cambia en la forma de trabajar

- El orquestador ya no usa `assign-reviewers` directamente. Delega en `create-pr`, que lee `github-cache` y después `assign-reviewers`.
- `commit-changes` pide asunto en imperativo, sin rutas de fichero, con desglose y con pie `Closes #N` o `Refs #N`.- `tools/create-empty-commit.sh` no cambia y sigue escribiendo solo `chore: open #N`.

## Comprobación

1. `diff -r --strip-trailing-cr` de `agents/`, `skills/`, `tools/` y `templates/` con la plantilla: solo quedan las rutas de las skills.
2. Buscar `exercises/git-workflow-agent-template` en `agents/`, `skills/` y `tools/`: no aparece.
3. `node staff/diego-torres/first-app/tools/github-cache.mjs alias get venturars/neoland-102026 "Prueba"`, desde la raíz: responde `null`, sin error.
4. `alias set` con un alias de prueba y un login real del repo, y `alias remove` para quitarlo. `git status` no muestra el fichero de la caché.
5. `pnpm lint` pasa.
6. `tools/check-status.sh` funciona.
7. `git diff --stat staging` solo muestra ficheros de `agents/`, `skills/`, `tools/`, `templates/` y `docs/specs/sync-git-workflow-cache/`.

## Riesgo

- ESLint no aplica sus reglas a `tools/github-cache.mjs`, porque `eslint.config.js` las pone en `**/*.js`. Si aun así lo marca como error, se para y se avisa a Diego: ni el script ni la configuración se cambian para arreglarlo.
- La plantilla solo se ha validado en Windows, según su PR #1125, y este equipo es Windows. Linux y macOS quedan sin probar.
- Nada de esto se ha lanzado todavía.

## Sin preguntas abiertas

La constitución, el código actual y esta spec dicen lo mismo. Si la plantilla cambia otra vez en `staging` antes de implementar, se avisa a Diego y no se sincroniza esa novedad en silencio.
