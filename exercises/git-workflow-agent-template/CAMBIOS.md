# Cambios respecto a la plantilla original

La plantilla original es la de la pull request [#571](https://github.com/venturars/neoland-102026/pull/571) (commit `f769163`). Estos cambios la convierten en un paquete APM que se instala en cualquier proyecto, con Claude Code, Cursor o Codex.

## Estructura

| Original | Ahora | Por qué |
|---|---|---|
| `agents/create-issue.md`, `create-branch.md`, `create-commit.md`, `launch-push.md`, `create-pr.md` | `.apm/agents/<nombre>.agent.md` | APM busca los subagentes en `.apm/agents/` con la extensión `.agent.md`. |
| `agents/git-workflow-agent.md` | `.apm/skills/git-workflow/SKILL.md` | Pasa de subagente a skill: tiene que poder pedir datos al alumno ([ADR 0001](docs/adr/0001-orquestador-y-entrevista-como-skills.md)). Se renombra a `git-workflow` para invocarla como `/git-workflow`. |
| `agents/help-me-to-think.md` | `.apm/skills/help-me-to-think/SKILL.md` | Pasa de subagente a skill: una entrevista necesita esperar cada respuesta ([ADR 0001](docs/adr/0001-orquestador-y-entrevista-como-skills.md)). |
| `skills/<nombre>/SKILL.md` | `.apm/skills/<nombre>/SKILL.md` | Carpeta de skills de APM. |
| `skills/grill-with-docs/` | `.apm/skills/entrevista-con-repo/` | Renombrada: con el nombre de la skill de Matt Pocock, la del usuario (`~/.claude/skills/`) gana a la del proyecto y la tapa. |
| `skills/grill-me/` | `.apm/skills/entrevista-libre/` | Igual que la anterior. |
| `skills/create-branch-from-staging/` y `skills/create-branch/` | `.apm/skills/create-branch/` | Fusionadas: la rama base se detecta y la base pasa a ser opcional ([ADR 0002](docs/adr/0002-rama-base-detectada.md)). |
| `skills/create-pr-base-staging/` | `.apm/skills/create-pr-base/` | La base ya no es siempre `staging`. |
| `tools/<script>.sh` | `.apm/skills/<skill>/scripts/<script>.sh` | APM copia cada carpeta de skill entera, pero no una carpeta `tools/` suelta. |
| `tools/create-branch-from-staging.sh` | Borrado | Lo cubre `create-branch.sh`. |
| `templates/issues/basic_issue.md` | `.apm/skills/create-issue/assets/basic_issue.md` | La plantilla viaja con la skill que la usa. |
| `templates/pull-request/basic-pull-request.md` | `.apm/skills/create-pr-base/assets/basic-pull-request.md` | Igual. |
| `MCPS/github-mcp-server/mcp.txt` | `dependencies.mcp` en `apm.yml` (servidor `github`) | APM escribe el servidor remoto de GitHub en `.mcp.json` en vez de dejar un enlace. Va declarado a mano (`registry: false`) con `Authorization: Bearer ${GITHUB_TOKEN}`: la entrada del registro de APM (`io.github.github/github-mcp-server`) pedía un token de forma interactiva y aun así lo dejaba sin cabecera de autenticación (APM 0.35.0). |
| — | `apm.yml`, `README.md`, `CAMBIOS.md`, `GLOSSARY.md`, `docs/adr/` | Manifiesto del paquete y documentación. |

## Comportamiento

- **Rama base detectada.** Donde ponía `staging`, ahora se usa la rama base: `GIT_WORKFLOW_BASE`, si no `staging` si existe en `origin`, y si no la rama por defecto del remoto. En el repositorio del curso sigue siendo `staging`. Afecta a `pull-changes`, `create-branch`, `create-pr-base`, `create-pr` y al orquestador.
- **`create-branch.sh`.** Los argumentos pasan de `BASE NUMERO TIPO DESCRIPCION` a `NUMERO TIPO DESCRIPCION [BASE]`.
- **`create-empty-commit.sh`.** Se niega a hacer el commit vacío en la rama base detectada, además de en `staging` y `main`, y también en `master`.
- **`check-status.sh`.** Escribe además la rama base y si `GITHUB_TOKEN` está definida (sin mostrar su valor). El orquestador para antes de los pasos con MCP si falta el token.
- **Tres herramientas.** `apm.yml` declara `targets: [claude, cursor, codex]`. La plantilla original solo pensaba en Claude Code.
- **Rutas de los scripts.** Las skills llaman a sus scripts desde la carpeta de la skill (`<carpeta de esta skill>/scripts/…`) en vez de `./tools/…`, y dicen cuál es esa carpeta en cada herramienta: `${CLAUDE_SKILL_DIR}` en Claude Code y `.agents/skills/<skill>` en Cursor y Codex, que no tienen variable. Lo mismo para las plantillas de `assets/`. Los comandos se lanzan desde la raíz del repositorio.
- **Frontmatter.** Cada skill y cada subagente lleva `name` y `description` (en español), que Claude Code necesita para encontrarlos. Los subagentes precargan sus skills con `skills:`. Codex descarta ese campo al instalar (APM lo avisa), pero sus subagentes heredan las skills igualmente.
- **Referencias.** Las rutas a ficheros (`agents/…`, `skills/…/SKILL.md`, `templates/…`, `MCPS/…`) pasan a nombres de skill y de subagente, porque al instalar cambian de sitio.
- **Entrevistas.** `entrevista-con-repo` y `entrevista-libre` mantienen sus reglas. Quitan la línea de instalación de las skills de Matt Pocock y la cambian por un enlace de inspiración: no hace falta instalarlas.
- **Erratas.** «En empezar» pasa a «Al empezar» en `create-commit`. `check-status.sh` fallaba en un repositorio sin commits: ahora escribe la rama y «todavía no hay commits». La rama nueva ya no sigue a la rama base remota (`--no-track`): hasta el primer push, `check-status` decía que seguía a `origin/staging`.

## Cambios de `staging` incorporados

Después de #571, `staging` cambió la plantilla. Esos cambios están portados a la nueva estructura:

- **`assign-reviewers`.** Resuelve cada nombre a un login de colaborador del repositorio y no pide revisión a quien no colabora. Igual que en `staging`.
- **`link-pr-to-issue`.** Deja `Closes #N` en el cuerpo (antes `Related to #N`) y enlaza la issue en Development con `gh api graphql`. La issue ya no queda abierta para siempre: GitHub la cierra al fusionar en la rama por defecto del repositorio. Ni la skill ni el orquestador la cierran por su cuenta. La plantilla de pull request trae `Closes #` en la sección Issue.
- **Cabecera para Cursor.** El servidor `github` lleva `X-MCP-Features: mcp_apps_disable_form_deferral` además de `Authorization`. Sin ella, en Cursor crear o editar una issue o una pull request abre un formulario sin botón de enviar. En `staging` se explica en `MCPS/github-mcp-server/mcp.txt` para añadirla a mano. Aquí va en `apm.yml`, y APM la escribe en las tres herramientas.
- **`gh` permitido.** `create-issue`, `create-pr-base` y `assign-reviewers` ya no prohíben `gh`, igual que en `staging`.
- **`help-me-to-think`.** En `staging` pasó a hacer una pregunta y devolverla al orquestador sin esperar la respuesta, porque era un subagente. Aquí es una skill en la conversación principal ([ADR 0001](docs/adr/0001-orquestador-y-entrevista-como-skills.md)), así que sigue esperando cada respuesta. Se incorpora «no escribas ficheros».
- **`grill-me`.** El cambio de formato de la línea Fuente no aplica: esa línea pasó a ser la de inspiración de `entrevista-libre`.

## Sin cambios

- Las convenciones: `número-tipo-descripcion`, los seis tipos, conventional commits en inglés, cuerpos en español, sin force push y sin `git add -A`.
- Los cinco momentos y el orden de los pasos al empezar.
- `commit-changes.sh` y `launch-push.sh`, salvo la ruta.
- El texto en español de los subagentes y las skills, salvo lo descrito arriba.
