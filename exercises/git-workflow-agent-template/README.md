# git-workflow-agent

Paquete [APM](https://github.com/microsoft/apm) con el flujo de git del bootcamp Neoland AI (10/2026) para **Claude Code, Cursor y Codex**. Acompaña al alumno en cinco momentos: pensar la tarea, dejarla escrita como issue, empezar (rama, commit vacío y pull request en draft enlazada a la issue), guardar un trozo y pedir revisión.

Sirve para cualquier proyecto en GitHub, no solo para el repositorio del curso. Los cambios respecto a la plantilla original están en [CAMBIOS.md](CAMBIOS.md).

## Requisitos

- Un proyecto con git y un remoto `origin` en GitHub.
- Claude Code, Cursor o Codex.
- La CLI de GitHub (`gh`) con sesión iniciada (`gh auth login`), para enlazar la pull request con la issue en Development. Sin ella, la pull request solo lleva `Related to #N`.
- APM: `brew install apm` (o `curl -sSL https://aka.ms/apm-unix | sh`).
- Un token de GitHub en la variable `GITHUB_TOKEN` cuando arrancas el editor o el agente. Con la CLI de GitHub:

  ```bash
  export GITHUB_TOKEN=$(gh auth token)
  ```

  Si GitHub rechaza ese token, crea un token clásico con el permiso `repo` en <https://github.com/settings/tokens> y úsalo en su lugar. Añade el `export` a tu `~/.zshrc` para que esté en cada sesión. El paquete guarda en la configuración del MCP una referencia a la variable, nunca el token, así que esos ficheros se pueden subir al repositorio. Si la variable falta, `check-status` lo avisa y las issues y pull requests fallan hasta que la definas y reinicies el editor o el agente.

## Instalación

Desde la raíz de tu proyecto, con la herramienta que uses en `--target`:

```bash
apm install venturars/neoland-102026/exercises/git-workflow-agent-template#git-workflow-agent--v1.0.0 --target cursor
```

`--target` acepta `claude`, `cursor` o `codex`, y varios separados por comas (`--target claude,cursor`). Mientras no exista la etiqueta `git-workflow-agent--v1.0.0`, usa `#staging`.

APM añade el paquete a tu `apm.yml`, fija la versión en `apm.lock.yaml` y deja:

| | Claude Code | Cursor | Codex |
|---|---|---|---|
| Skills | `.claude/skills/` | `.agents/skills/` | `.agents/skills/` |
| Subagentes | `.claude/agents/` | `.cursor/agents/` | `.codex/agents/` |
| MCP `github` | `.mcp.json` | `.cursor/mcp.json` | `.codex/config.toml` |

Haz commit de `apm.yml` y `apm.lock.yaml`. Quien clone el proyecto solo tiene que lanzar `apm install`.

Lo que pide cada herramienta además:

- **Cursor:** comprueba en *Settings → MCP* que el servidor `github` está activado. Cursor pide permiso en cada llamada al MCP y en cada comando de terminal. Si lo abres desde el Dock y no ve `GITHUB_TOKEN`, ábrelo desde la terminal con `cursor .`.
- **Codex:** Codex solo lee `.codex/config.toml` si el proyecto es de confianza (*trusted*). Acepta la confianza cuando Codex la pida al abrir el proyecto. `/mcp` muestra si el servidor `github` está conectado.

## Uso

Llama al orquestador o pide directamente un momento:

| Herramienta | Cómo llamar al orquestador |
|---|---|
| Claude Code | `/git-workflow` |
| Cursor | `/git-workflow` en el chat del agente |
| Codex | `$git-workflow` (o `/skills`) |

| Momento | Ejemplo | Qué pasa |
|---|---|---|
| Pensar la tarea | «Ayúdame a pensar cómo contar usuarios por género» | Una entrevista de una pregunta cada vez y un resumen. |
| Dejarla escrita | «Crea la issue» | Issue con título en inglés y cuerpo en español. |
| Empezar | «Empieza la issue 184» | Rama `184-feat-…` desde la rama base, commit `chore: open #184`, push y pull request en draft con `Related to #184`, enlazada en Development si la rama base no es la rama por defecto. |
| Guardar un trozo | «Guarda `src/users.js` con feat: count users by gender» | Commit solo con esos ficheros y push. |
| Que la revisen | «Que la revisen @ana y @luis» | Revisores asignados y pull request fuera de draft. |

## Rama base

Las ramas de trabajo salen de la rama base y las pull requests van contra ella. Se detecta sola, en este orden:

1. La variable `GIT_WORKFLOW_BASE`, si está definida.
2. `staging`, si existe `origin/staging`.
3. La rama por defecto del remoto (`origin/HEAD`), y si no, `main` o `master`.

Para fijarla: `export GIT_WORKFLOW_BASE=develop`.

## Convenciones

Son reglas del paquete, no opciones:

- Ramas `número-tipo-descripcion`, con tipo `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
- Commits en conventional commits, en inglés.
- Títulos de issue y de pull request en inglés. Cuerpos en español.
- Sin force push y sin `git add -A`.

## Contenido

| Pieza | Tipo | Qué hace |
|---|---|---|
| `git-workflow` | skill | Orquestador: reconoce el momento y llama a quien toca. |
| `help-me-to-think` | skill | Elige la entrevista y cierra con un resumen. |
| `entrevista-con-repo`, `entrevista-libre` | skills | Las dos entrevistas. |
| `create-issue`, `create-branch`, `create-commit`, `launch-push`, `create-pr` | subagentes | Un paso cada uno. |
| `check-status`, `pull-changes`, `create-branch`, `create-empty-commit`, `commit-changes`, `launch-push` | skills con script | Los pasos de git. |
| `create-issue`, `create-pr-base`, `assign-author`, `assign-reviewers`, `create-draft`, `link-pr-to-issue` | skills con MCP | Los pasos de GitHub. |

Las decisiones de diseño están en [docs/adr/](docs/adr/) y el vocabulario en [GLOSSARY.md](GLOSSARY.md).

## Probar el paquete

Una prueba de unos diez minutos en un repositorio desechable, para comprobar el paquete en tu herramienta antes de usarlo en un proyecto de verdad. Los ejemplos usan Cursor; en Claude Code o Codex cambia `--target` y la forma de llamar a las skills.

1. Crea un repositorio de prueba y entra en él:

   ```bash
   gh repo create apm-git-test --private --add-readme --clone
   cd apm-git-test
   ```

2. Define el token e instala el paquete:

   ```bash
   export GITHUB_TOKEN=$(gh auth token)
   apm install venturars/neoland-102026/exercises/git-workflow-agent-template#staging --target cursor
   ```

   Para probar una copia local del paquete, pasa su ruta en vez de `venturars/…#staging`.

3. Comprueba que están las piezas: `ls .agents/skills .cursor/agents` (16 skills y 5 subagentes) y `cat .cursor/mcp.json` (servidor `github` con `Bearer ${env:GITHUB_TOKEN}`).

4. Abre Cursor desde esa misma terminal, para que herede `GITHUB_TOKEN`: `cursor .`. Si no existe el comando, en Cursor abre la paleta de comandos y elige *Shell Command: Install 'cursor' command*.

5. En *Settings → MCP*, el servidor `github` tiene que estar activado y con herramientas listadas. Si sale un error de autenticación, cambia a un token clásico con el permiso `repo` (ver Requisitos) y repite desde el paso 4.

6. En el chat del agente, sigue estos pasos y comprueba el resultado de cada uno. Acepta los permisos que pida Cursor.

   | Escribe | Tiene que pasar |
   |---|---|
   | `/check-status` | `Rama base: main` y `Token de GitHub: GITHUB_TOKEN definido`. |
   | «Crea una issue para añadir un fichero hola.txt con un saludo» | Issue #1 con título en inglés, cuerpo en español y asignada a ti. |
   | «Empieza la issue 1» | Rama `1-feat-…` desde `main`, commit `chore: open #1`, push y pull request en draft con `Related to #1`. |
   | Crea `hola.txt` y escribe «Guarda hola.txt con feat: add greeting» | Commit con solo `hola.txt` y push a la misma rama. |

   Compruébalo también fuera del chat: `git log --oneline` y `gh pr view --web`.

7. Si algo falla, anota el paso, lo que escribiste y el error, y abre una issue en el repositorio del curso.

8. Borra el repositorio de prueba: `gh auth refresh -s delete_repo` y después `gh repo delete apm-git-test --yes`.

## Publicar una versión

Para quien mantiene el paquete: sube `version` en `apm.yml`, haz merge en `staging` y etiqueta ese commit con `git-workflow-agent--v<versión>`:

```bash
git tag git-workflow-agent--v1.0.0
git push origin git-workflow-agent--v1.0.0
```

El prefijo hace falta porque las etiquetas son de todo el repositorio del curso ([ADR 0003](docs/adr/0003-paquete-dentro-del-repositorio-del-curso.md)).
