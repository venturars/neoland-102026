### Herramienta: CREATE_PR_BASE_STAGING

- **Descripción**: Úsala desde el agente `create-pr` para abrir la pull request con base `staging`, directamente en draft y asignada al usuario autenticado en una misma invocación.
- **Comando de Terminal**: `bash ./staff/luis-duque/first-app/tools/create-pr-base-staging.sh "[RAMA]" "[TITULO]" "[CUERPO]"`

Ejecuta el comando desde la raíz del repositorio git. Si la plantilla se copia a un proyecto, usa la ruta de su carpeta `tools/` desde esa raíz. `[CUERPO]` es la ruta de un fichero temporal con la plantilla rellenada. Requiere GitHub CLI autenticado: esa cuenta será el autor de la PR y `--assignee "@me"` la persona asignada.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a esta plantilla.

#### Especificación de Argumentos

1. **RAMA** _(Obligatorio)_: La rama subida, que se pasa como `--head`.
2. **TITULO** _(Obligatorio)_: El título de la issue.
3. **CUERPO** _(Obligatorio)_: Fichero con la descripción en español y la plantilla del tipo de `templates/pull-request/` del proyecto. Deja la sección Issue vacía. Si el tipo no tiene plantilla, usa la más cercana.

#### Reglas de Invocación Críticas

- **PR existente**: Comprueba si ya hay una PR de esa rama hacia `staging`. Reutilízala y actualiza el cuerpo conservando el enlace con la issue; usa `assign-author` y `create-draft` cuando haga falta.
- **Procesamiento de respuestas**: Si el código de salida es 0, devuelve la URL y confirma draft y asignación. Si falla, comunica el error.
