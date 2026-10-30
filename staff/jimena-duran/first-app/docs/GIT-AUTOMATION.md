# Automatización de Git en first-app

El punto de entrada es [AGENTS.md](../AGENTS.md) y el flujo se coordina desde [git-workflow-agent.md](../agents/git-workflow-agent.md). Las reglas de negocio y los clientes de usuarios mantienen sus carpetas actuales. Esta automatización no reorganiza la aplicación ni añade dependencias de Node.

## Pedir una tarea

Puedes pedir pensar una tarea, dejarla escrita, empezar, guardar un trozo, abrir una PR o pedir revisión. El orquestador elige un momento y lanza el subagente correspondiente. Si falta una decisión, devuelve una pregunta antes de actuar. El agente ejecutor devuelve resultados o preguntas al orquestador; no espera por su cuenta la respuesta humana.

El orden es issue, spec y plan, revisión humana, tareas, revisión humana e implementación autorizada. La spec abre con `Issue: #N`. No se crea su carpeta antes de que exista la issue. Aprobar código no autoriza automáticamente commits, push, PR o merge. Las restricciones de una entrega concreta se mantienen en su documentación y contexto, sin fijar una rama personal en los scripts reutilizables.

Las ramas habituales siguen `numero-tipo-descripcion`. Se admite un nombre explícito autorizado con `-BranchName`. Las tareas futuras pueden usar ramas diferentes. El script verifica la rama recibida en `-ExpectedBranch` antes de hacer commit o publicar, y bloquea main y staging para esas acciones.

## Carpetas

| Ruta | Responsabilidad |
| --- | --- |
| `agents/` | Orquestador y roles delimitados de cada momento. |
| `skills/` | Instrucciones reutilizables que los roles leen por ruta. |
| `tools/` | Comandos PowerShell que comprueban Git y su resultado. |
| `templates/issues/` | Cuerpo de issue en español. |
| `templates/pull-request/` | Cuerpo de PR en español. |
| `MCPS/github-mcp-server/mcp.txt` | Referencia de conexión del MCP de GitHub. |
| `docs/specs/<nombre>/` | Spec, plan, tareas y evidencia del cambio. |

## PowerShell y VS Code

Abre la carpeta del repositorio en VS Code y usa una terminal PowerShell. Los scripts calculan la raíz con Git y no dependen de Bash ni de un directorio personal fijo. Requieren Git; las operaciones remotas requieren una cuenta autorizada. Los comandos siguientes son ejemplos: sustituye issue, tipo, descripción, rama y archivos con los datos aprobados de tu tarea.

Desde la raíz del repositorio, la comprobación de lectura es:

```powershell
& '.\staff\jimena-duran\first-app\tools\check-status.ps1'
```

Desde first-app, el mismo comando es:

```powershell
& '.\tools\check-status.ps1'
```

Si la política local es Restricted y bloquea esa invocación, puedes ejecutar un proceso para ese script sin cambiar la política global:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\tools\check-status.ps1'
```

Ese parámetro dura únicamente en el proceso iniciado. Una política administrada puede impedirlo: si falla, registra el bloqueo; no intentes sustituir la política de la organización. No uses un cambio global de ExecutionPolicy como requisito de esta automatización.

Comandos desde first-app, solo cuando la operación correspondiente esté autorizada:

```powershell
& '.\tools\pull-changes.ps1'
& '.\tools\create-branch-from-staging.ps1' -Issue 123 -Type feat -Description 'describe-the-task'
& '.\tools\create-branch.ps1' -Base 'another-base' -Issue 123 -Type feat -Description 'describe-the-task'
& '.\tools\create-empty-commit.ps1' -Issue 123 -ExpectedBranch '123-feat-describe-the-task'
& '.\tools\commit-changes.ps1' -Message 'docs: explain the workflow' -Paths @('path/to/file.md') -ExpectedBranch '123-feat-describe-the-task'
& '.\tools\launch-push.ps1' -ExpectedBranch '123-feat-describe-the-task'
```

Para una ruta con espacios, mantén las comillas y el operador `&`. Si necesitas el proceso con Bypass para un script con un array de archivos, prepara una invocación PowerShell con un array real; no conviertas varios archivos en una única cadena separada por comas. El agente debe comprobar los parámetros reales con `Get-Help .\tools\nombre.ps1` antes de adaptar una invocación.

`pull-changes.ps1` actualiza staging únicamente con avance rápido y conserva la rama actual. Los comandos de rama recuperan una existente sin reemplazarla. Integrar nuevos cambios en una rama existente requiere la autorización aplicable; ante un conflicto se informa antes de resolver. No hay stash automático, reset --hard, clean ni force push.

Los archivos sin seguimiento que no colisionan con el destino no bloquean actualizar staging o crear y recuperar ramas, aunque estén fuera de first-app. Permanecen visibles y sin seguimiento: no se añaden, borran, excluyen ni ocultan para permitir la operación. La comprobación inicial sigue bloqueando cambios versionados y operaciones Git sin terminar. Al cambiar de rama o avanzar staging, Git comprueba las colisiones reales y rechaza sobrescribir datos locales.

Los cambios de rama y avances rápidos usan `--no-overwrite-ignore`: un archivo ignorado también debe conservarse si otra rama lo tiene versionado. Antes de un commit automático se comprueba si hay hooks activos que puedan modificar el índice, mensajes o referencias. Si existen, el script se detiene para revisión; no los desactiva ni los ejecuta a escondidas. Los `.sample` que trae Git no activan ese bloqueo.

Las comprobaciones reproducibles de Git están en [tools/tests/test-git-workflow.ps1](../tools/tests/test-git-workflow.ps1) y `tools/tests/test-git-safety.ps1`. La ruta del recorrido general, comprobada contra el archivo real, es `staff/jimena-duran/first-app/tools/tests/test-git-workflow.ps1` desde la raíz del repositorio. Crean repositorios temporales con un remoto local y requieren autorización para commits y publicaciones exclusivamente en esa prueba. No apuntan al remoto del repositorio personal ni modifican sus datos. Conservan las carpetas temporales para inspección; el ensayo de seguridad deja intencionadamente un conflicto sin resolver en su repositorio desechable.

La comprobación específica de archivos sin seguimiento está en [tools/tests/test-untracked-worktree.ps1](../tools/tests/test-untracked-worktree.ps1). Usa datos ficticios en su propio repositorio temporal para verificar operaciones seguras, conservación de archivos y bloqueos ante colisiones y conflictos. Desde first-app: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File './tools/tests/test-untracked-worktree.ps1'`.

Desde first-app, tras autorizar esas pruebas:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File './tools/tests/test-git-workflow.ps1'
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\tools\tests\test-git-safety.ps1'
```

Desde la raíz del repositorio, el recorrido general se ejecuta con:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File './staff/jimena-duran/first-app/tools/tests/test-git-workflow.ps1'
```

## GitHub y autenticación

Antes de escribir, comprobar qué herramientas están disponibles y quién está autenticado. Preferir el MCP de GitHub si soporta la operación y corresponde a la cuenta autorizada. El archivo `mcp.txt` solo guarda una referencia; no conecta un servidor ni concede permisos. Conserva las conexiones existentes y no añadas tokens a estos archivos.

Si el MCP no tiene una capacidad necesaria o corresponde a otra cuenta, informar del motivo y usar GitHub CLI autenticado como alternativa. Para revisar la sesión:

```powershell
gh auth status
gh api user --jq .login
```

En Windows, gh puede requerir acceso al almacén de credenciales fuera del sandbox de Codex. Un 401 dentro del sandbox no demuestra por sí solo que la credencial sea inválida. Comprobar identidad y acceso con los permisos necesarios sin imprimir tokens, antes de concluir que hace falta renovar la sesión. Para renovarla, `gh auth login --hostname github.com --git-protocol https --web` requiere que la persona complete la autorización en GitHub.

Buscar issues y PR existentes antes de crear otras. El título va en inglés y el cuerpo en español. Las PR usan base staging y estado draft. La plantilla contiene el marcador `Closes #N`; create-pr lo retira al preparar el cuerpo y el orquestador escribe después una única referencia con el número real, conservando el resto del texto. Al actualizar una PR, sustituir la referencia anterior de esa misma issue y mantener los vínculos existentes en Development. El texto y Development se comprueban por separado; no cerrar issues manualmente.

GitHub interpreta las palabras de cierre de una PR únicamente cuando esta apunta a la rama predeterminada. Si la predeterminada es main, fusionar una PR con base staging no cierra la issue ni crea automáticamente el vínculo a partir de `Closes #N`. Al promover el cambio a la rama predeterminada, conservar y verificar la referencia de cierre en la PR o commit correspondiente. La [documentación de GitHub](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue) explica estas condiciones; no prometer el cierre solo por añadir la palabra en staging.

### Consultar el estado remoto antes de reintentar

Esta regla se aplica a todas las escrituras de GitHub, tanto mediante el MCP configurado en Codex como mediante gh. Después de un error, timeout o respuesta incierta, consultar el estado remoto con una vía disponible y autenticada antes de reintentar o cambiar de MCP a gh; cambiar de vía para leer no autoriza repetir la escritura.

- Si GitHub ya aplicó la operación, reutilizar el recurso y su resultado; completar únicamente lo que falte y esté autorizado, sin repetir la creación.
- Si la consulta confirma que no se aplicó, reintentar solo la operación pendiente con identidad, repositorio y autorización comprobados.
- Si no puede determinarse el resultado, detenerse e informar de la incertidumbre; no crear otro recurso ni repetir la escritura a ciegas.

Para crear issues, buscar la tarea por título y contexto y verificar sus datos, incluidas las cerradas. Para crear PR, buscar por repositorio y rama de origen en todos los estados y comprobar base, draft y relación de issue; una coincidencia ambigua no confirma el resultado. Para las actualizaciones, releer asignaciones, revisores, draft, cuerpo completo y Development según el paso afectado. Conservar datos ajenos y verificar el resultado por separado; si la lectura falla o no descarta una operación aún en curso, el resultado sigue siendo incierto. Si falla gh dentro del sandbox, comprobar primero el acceso al almacén de Windows descrito arriba, sin cambiar credenciales automáticamente.

## Capacidades y límites de Codex

Los archivos `agents/*.md` son instrucciones que se entregan a agentes reales mediante la herramienta de delegación disponible. No registran automáticamente agentes personalizados. Si una sesión no dispone de delegación, el orquestador informa y se detiene; no simula subagentes. Los agentes heredan los permisos de la sesión y no pueden ampliarlos con su archivo de instrucciones. La [documentación oficial de subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) describe el registro opcional de agentes TOML.

El flujo lee explícitamente `skills/<nombre>/SKILL.md`. No presupone que Codex descubra esa carpeta. El [descubrimiento local de skills](https://learn.chatgpt.com/docs/build-skills) utiliza ubicaciones `.agents/skills` según el directorio de inicio. Esta entrega no sobrescribe skills o configuraciones personales; la lectura explícita conserva una fuente única reproducible desde la raíz.

AGENTS.md no fija la temperatura del modelo ni concede permisos del sistema. Las herramientas e interfaces disponibles pueden variar entre sesiones. Las comprobaciones que no puedan ejecutarse se registran como pendientes; no se presentan como superadas.

## Verificación

Las herramientas que mutan Git se comprueban en un repositorio temporal con remoto local, con autorización para esos commits de prueba. Las funciones y clientes se prueban en una copia con SQLite desechable, porque la conexión de la aplicación usa una ruta fija junto al módulo. No se utiliza la base personal para ejecutar ejemplos destructivos.

El cierre incluye sintaxis PowerShell, comportamiento seguro de Git, recorrido del orquestador con agentes reales, regresión de usuarios, `pnpm format`, `pnpm lint` y revisión del diff. `pnpm test` es un marcador y no cuenta como prueba. Los resultados concretos y cualquier limitación se guardan con los documentos del cambio; este manual no afirma que una comprobación se haya ejecutado.
