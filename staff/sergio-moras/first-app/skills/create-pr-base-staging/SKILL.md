### Herramienta: CREATE_PR_BASE_STAGING

- **Descripción**: Úsala desde el agente `create-pr` para abrir la pull request con base `staging`, ya en draft y asignada al usuario autenticado, en un solo paso. No la uses para enlazar la issue: eso es `link-pr-to-issue`. No la uses con una pull request que ya existe.
- **Comando de Terminal**: `./tools/create-pr-base-staging.sh "[RAMA]" "[TITULO]" "[CUERPO]"`

El script trabaja desde la raíz del repositorio git. Necesita GitHub CLI (`gh`) con la sesión iniciada: esa cuenta es la autora y la persona asignada.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a esta plantilla. La base es `staging` y la descripción va en español.

#### Especificación de Argumentos

1. **RAMA** _(Obligatorio)_: La rama que acaba de subirse.
2. **TITULO** _(Obligatorio)_: El título de la issue.
3. **CUERPO** _(Obligatorio)_: La ruta de un fichero temporal con el cuerpo, en español y con la plantilla del tipo en `templates/pull-request/`. La sección Issue se deja vacía. Si el tipo no tiene plantilla, usa la más cercana.

#### Reglas de Invocación Críticas

- **Pull request que ya existe**: Antes del comando, mira con `gh pr list --head [RAMA] --base staging` si la rama ya tiene una. Si la tiene, no lances el comando ni abras otra: devuélvela a `create-pr`, que actualiza el cuerpo y usa `assign-author` y `create-draft`.
- **Procesamiento de respuestas**: Si el código de salida es 0, devuelve la URL y confirma que está en draft y asignada. Si no, comunica el error y no inventes el enlace.
