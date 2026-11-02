# Automatización de Git en AsistenciApp

El flujo entra por [AGENTS.md](../AGENTS.md) y [agents/git-workflow-agent.md](../agents/git-workflow-agent.md). Sus cinco momentos y autorizaciones siguen [CONSTITUTION.md](CONSTITUTION.md). Cada momento termina antes del siguiente; implementación y publicación son decisiones separadas.

## PowerShell

Desde AsistenciApp, la lectura de estado es `& .\tools\check-status.ps1`. Desde la raíz Git usa `& (Join-Path $appRoot 'tools/check-status.ps1')`, donde `$appRoot` es el directorio de esta aplicación comprobado en la sesión, sin una ruta personal fija. Los scripts resuelven su ubicación con `$PSScriptRoot` y `git rev-parse` y funcionan con rutas que contienen espacios.

Solo cuando la operación correspondiente está autorizada:

```powershell
& .\tools\pull-changes.ps1
& .\tools\create-branch-from-staging.ps1 -Issue $issueNumber -Type $type -Description $description
& .\tools\create-branch.ps1 -Base $base -Issue $issueNumber -Type $type -Description $description
& .\tools\create-empty-commit.ps1 -Issue $issueNumber -ExpectedBranch $branchName
& .\tools\commit-changes.ps1 -Message $message -Paths $filePaths -ExpectedBranch $branchName
& .\tools\launch-push.ps1 -ExpectedBranch $branchName
```

`$filePaths` es un array real de archivos relativos a la raíz Git; no una cadena de nombres separados por comas. `-BranchName` solo permite un nombre explícito autorizado. Verifica los parámetros con Get-Help antes de adaptar una invocación.

Si una política local bloquea scripts, puede usarse un proceso `powershell.exe -NoProfile -ExecutionPolicy Bypass -File` para ese script cuando está permitido. No cambiar políticas globales ni eludir una política administrada. PowerShell 5.1 requiere comprobar códigos de salida nativos; las herramientas los comprueban y propagan fallos.

## Conservación y seguridad

Staging solo avanza por ascendencia comprobada; se conserva la rama actual y se bloquea un staging abierto en otro worktree. No se sustituyen commits de ramas existentes. Los cambios versionados y operaciones pendientes bloquean cambios de rama; los archivos sin seguimiento no colisionantes permanecen visibles y no se ocultan ni añaden para permitir la operación. Git rechaza colisiones reales y `--no-overwrite-ignore` protege archivos ignorados.

Commits selectivos usan un índice temporal y archivos explícitos. Se preserva el índice ajeno, se rechazan ampliaciones de alcance y se detiene el commit ante hooks activos para revisión. No se ejecutan ni desactivan hooks a escondidas. La rama esperada se comprueba antes de commit o push; main y staging están bloqueadas. No hay reset destructivo, clean, stash automático ni push forzado.

## Plantillas y enlace

Templates contiene seis plantillas de issue y seis de PR. Agentes y skills usan la del tipo o la más cercana. Sus comentarios definen título, tipo, forma de rama, cuerpo y comportamiento del draft; no se duplican esas reglas en los ejecutores ni se restringen tipos mediante una lista fija.

Create-pr retira la línea `Closes #` antes de crear el borrador. El orquestador deja después una única referencia real en Issue, conservando el resto del cuerpo y los vínculos existentes. Cuerpo y Development se releen por separado. Se comprueba la rama predeterminada: fusionar en staging no cierra por sí solo la issue si staging no es esa rama. No se cierran issues manualmente ni se hace merge implícito.

## Identidad, acceso y reintentos

Comprobar herramientas disponibles, cuenta autorizada, acceso y repositorio a partir de origin. Preferir MCP compatible; si no soporta la operación o la identidad no corresponde, explicar el motivo y usar gh autenticado. La referencia de MCPS no conecta el servicio ni concede permisos. No modificar conexiones, credenciales o configuración personal, ni guardar tokens.

Lecturas de gh: `gh api user --jq .login` y metadatos del repositorio comprobado. Un 401 dentro del sandbox de Windows puede deberse al acceso al almacén de credenciales; comprobar ese acceso con los permisos necesarios sin imprimir tokens antes de concluir que la sesión es inválida. No renovar autenticación automáticamente.

Para toda escritura fallida o con respuesta incierta, consultar el estado remoto antes de reintentar o cambiar de vía. Buscar issues por tarea en todos los estados y PR por rama y repositorio; releer campos afectados y conservar datos ajenos. Reutilizar lo ya aplicado; reintentar solo lo confirmado como no aplicado. Si no puede determinarse, informar y detenerse. Cambiar de vía para leer no autoriza repetir una escritura.

Los cuerpos enviados por gh usan archivo temporal UTF-8 con --body-file, nunca interpolación como código. Las consultas con parámetros usan variables; no se copian mutaciones GraphQL sin verificar contrato, soporte y autorización. Si Development no puede verificarse, se comunica pendiente. No se solicitan revisores salvo indicación expresa de personas y operación.

## Comprobaciones

`tools/tests/test-git-automation.ps1` crea repositorios desechables con remoto exclusivamente local y datos ficticios. Requiere autorización expresa para los commits y push locales de ensayo; no opera sobre el repositorio de trabajo ni GitHub. Conserva los repositorios para inspección y restaura sus variables de entorno temporales. Las autorizaciones concretas de ensayo y publicación y su estado se registran en los documentos de cada entrega.

Los casos afectados del SDD se comprueban con el intérprete existente: `python -m pytest tests/test_sdd_rules.py -k "sdd_gates or constitution_amendment"`. Las pruebas funcionales y de integridad histórica se conservan; no se repiten si son ajenas al cambio.

Registrar en los documentos de cada entrega las pruebas realmente ejecutadas, revisión estática, límites y pendientes por separado. No considerar un recorrido en lectura como ejecución integral de agentes o prueba de una escritura remota.
