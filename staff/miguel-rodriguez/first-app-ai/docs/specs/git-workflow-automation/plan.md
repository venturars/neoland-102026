# Plan — automatización de Git

Issue: #602 · PR: #604.
Estado: aprobado por Miguel el 2026-10-30.
Referencia: [spec aprobada](spec.md).

## Enfoque y referencias

Adaptar el flujo de `staff/ventura-rodriguez/first-app/` y contrastarlo con `exercises/git-workflow-agent-template/` en el commit de referencia `6ee92ec6`. No modificar esas fuentes ni trasladar sus reglas de negocio a nuestra app.

Se conservan nuestras aprobaciones separadas de spec, plan y tareas, los clientes, las reglas Socket y todos los contratos. Esta tarea no cambia código de negocio, SQL, dependencias, mensajes de aplicación ni la ubicación de la base de datos. No hay nuevas firmas de negocio ni instalación de paquetes que requiera revisión Socket.

## Ficheros

Todo lo siguiente es relativo a `staff/miguel-rodriguez/first-app-ai/`.

Crear:

- `agents/git-workflow-agent.md`: instrucciones de orquestación que carga el agente principal.
- `agents/help-me-to-think.md`, `agents/create-issue.md`, `agents/create-branch.md`, `agents/create-commit.md`, `agents/launch-push.md`, `agents/create-pr.md`: seis responsabilidades delegadas.
- `.cursor/agents/help-me-to-think.md`, `.cursor/agents/create-issue.md`, `.cursor/agents/create-branch.md`, `.cursor/agents/create-commit.md`, `.cursor/agents/launch-push.md`, `.cursor/agents/create-pr.md`: entradas de registro en Cursor, sin duplicar las instrucciones de los seis agentes.
- `skills/<nombre>/SKILL.md` para: `grill-with-docs`, `grill-me`, `check-status`, `pull-changes`, `create-issue`, `assign-author`, `create-branch-from-staging`, `create-empty-commit`, `commit-changes`, `launch-push`, `create-pr-base-staging`, `create-draft`, `link-pr-to-issue`, `assign-reviewers`.
- `tools/check-status.sh`, `tools/pull-changes.sh`, `tools/create-branch-from-staging.sh`, `tools/create-empty-commit.sh`, `tools/commit-changes.sh`, `tools/launch-push.sh`.
- `templates/issues/basic_issue.md`, `templates/pull-request/basic-pull-request.md`.
- `MCPS/github-mcp-server/mcp.txt`: referencia pública al servidor, sin credenciales.
- `docs/specs/git-workflow-automation/tasks.md`, únicamente después de aprobar este plan.

Modificar al implementar:

- `.gitignore`: permitir solo las seis entradas de agentes de Cursor frente a la exclusión general del repositorio; el resto de configuración local sigue ignorado.
- `AGENTS.md`: sustituir la prohibición de ejecutar Git por el flujo solicitado, enlazar el orquestador y conservar todas las paradas SDD y reglas Socket.
- `README.md`: explicar cómo trabajar sobre esta app en Codex, usar los cinco momentos, verificar conexión y delegación y resolver un bloqueo sin revelar tokens. Conservar el arranque de Jupyter.
- `docs/TREE.md`: reflejar únicamente los archivos realmente incorporados.
- `docs/ARCHITECTURE.md`: describir las responsabilidades de la automatización y separar las entradas de Cursor de las instrucciones compartidas.

No añadir el creador de ramas desde otras bases: existe en la referencia, pero nuestro flujo aprobado no permite tareas encadenadas. No tocar la configuración global ni la raíz del repositorio. No modificar specs históricas ni los archivos de aplicación, paquetes o Socket.

## Codex y delegación real — CA-01, CA-05

Por instrucción expresa de Miguel el 2026-10-30, usar Codex y no Cursor. El principal carga agents/git-workflow-agent.md y lanza los seis roles mediante su herramienta nativa de subagentes; cada encargo incluye el documento del rol, petición, raíz de app/Git, estado y issue/PR. No necesita agentes anidados ni nuevas entradas .codex. Las seis entradas Cursor ya escritas quedan como compatibilidad opcional; no condicionan la aceptación ni acreditan ejecución en ese editor.

Comprobar help-me-to-think mediante una invocación real de solo lectura. Una pregunta vuelve al principal, que espera la respuesta humana antes de otra invocación. Comprobar GitHub por MCP en el mismo entorno y desde el rol correspondiente: cuenta autenticada y acceso al repositorio, sin publicar. Registrar IDs de encargo, resultados y bloqueos, sin credenciales.

Las comprobaciones de Git local usan copias temporales con origin bare local y los mismos scripts candidatos. Su evidencia demuestra delegación y comportamiento local, no publicación real por MCP. El recorrido GitHub sigue sujeto a la autorización específica descrita abajo. No fingir que una simulación crea una issue o PR.

## Reparto de responsabilidades — CA-01 a CA-04

| Momento o paso | Responsable | Acción |
| --- | --- | --- |
| Estado inicial | Principal con `check-status` | Leer rama, remoto, índice, cambios y archivos sin seguimiento. |
| Pensar | `help-me-to-think` | Elegir entrevista con contexto del repo primero; devolver preguntas o resumen, sin publicar. |
| Dejar escrita | `create-issue` | Buscar tarea equivalente, usar la plantilla, crear y asignar al autenticado; devolver número y URL. |
| Empezar: base | Principal con `pull-changes` | Actualizar staging en fast-forward antes de crear la rama. |
| Empezar: rama | `create-branch` | Crear `N-tipo-descripcion` desde staging actualizado. |
| Empezar: apertura | `create-commit` | Commit vacío exacto `chore: open #N`. |
| Publicar | `launch-push` | Subir únicamente la rama de trabajo actual. |
| Abrir PR | `create-pr` | Base staging, asignación al autenticado, título inglés, cuerpo español y draft; no pedir revisores. |
| Enlazar | Principal con `link-pr-to-issue` | `Closes #N` y enlace Development, conservando abierta la issue. |
| Guardar un trozo | `create-commit`, después `launch-push` | Archivos nombrados, commit pequeño y publicación de esa rama. |
| Pedir revisión | Principal con `assign-reviewers` | Resolver colaboradores indicados, excluir autor, pedir revisión y sacar de draft. |

Los subagentes ejecutan sus skills asignadas; el principal no realiza sus operaciones por sustitución. Estado, actualización de staging, enlace y petición de revisión son skills del principal en el flujo de referencia. No convertir cada skill en otro subagente.

Una petición completa autoriza los pasos de ese momento, sin confirmaciones redundantes. Falta de datos, permisos o resultados necesarios detiene los pasos siguientes. Si ya existe la rama o PR de la tarea, comprobar identidad y estado antes de reutilizarla; no reiniciar la apertura, duplicar el commit vacío ni devolver una PR revisada a draft automáticamente. La restricción posterior a aprobaciones prevalece sobre la referencia que devuelve toda PR existente a draft.

## Scripts de Git — CA-02, CA-03, CA-04

Bash con `set -euo pipefail`, argumentos separados y rutas citadas. Las skills indican la ruta de nuestra app desde la raíz real de Git; los scripts obtienen esa raíz con `git rev-parse --show-toplevel`. No contienen rutas absolutas del portátil ni de Ventura. Fuera de un repo, error y ninguna acción.

Adaptar los scripts existentes, sin crear un ejecutor genérico. Mantener el uso de un índice temporal en los dos scripts de commit para excluir lo que ya estaba preparado ajeno a la tarea. Antes de modificar nada, validar argumentos y rama; rechazar main, staging y HEAD separado en commit/publicación. Rechazar directorios, rutas externas y pathspecs que puedan incorporar varios archivos sin enumerarlos. Las rutas de trabajo deben estar dentro de esta app. Comprobar también los archivos borrados y renombrados para no ampliar el alcance.

- `check-status.sh`: solo lectura; presenta rama, upstream, diferencias locales de commits, último commit y los tres estados de archivos. No confundir el remoto almacenado con una consulta recién actualizada.
- `pull-changes.sh`: fetch de origin/staging y avance fast-forward de staging. Detenerse si diverge, hay un estado de Git sin resolver o no puede actualizarse sin afectar trabajo local. No reset, stash ni limpieza automática. Si staging está abierto en otro worktree, informar el impedimento.
- `create-branch-from-staging.sh NUMERO TIPO DESCRIPCION`: validar dígitos, tipo permitido y kebab-case; confirmar staging actualizado y crear desde esa base. Al reanudar una rama existente no mezclar staging ni reescribirla; informar su estado real.
- `create-empty-commit.sh NUMERO`: crear solo el commit vacío de apertura en la rama de esa issue, sin incluir el índice real. El orquestador comprueba si la apertura ya existe antes de repetirla.
- `commit-changes.sh MENSAJE FICHERO...`: validar mensaje convencional en inglés y archivos explícitos; commit con índice temporal y sincronización posterior solo de esos archivos. Verificar que el resto del índice y los archivos ajenos conservan su estado.
- `launch-push.sh`: sin argumentos; `git push -u origin HEAD` sobre la rama de trabajo validada. Rechazar publicación forzada, ramas protegidas y HEAD separado. No cambiar la base de la PR.

No usar `eval`, `git add -A`, carpetas completas, force push, rebase ni amend como parte de este flujo.

## GitHub, permisos y enlaces — CA-02, CA-03, CA-05

Las skills de issues, PR, autor, draft y revisores usan GitHub MCP, como la referencia del curso. Git local se ejecuta por los scripts. `link-pr-to-issue` usa MCP para conservar el cuerpo con `Closes #N` y `gh api graphql` para Development, siguiendo la referencia actual; no inventar otra API.

Leer los node IDs y usar `addCloseIssueReferences(input:{issueId:...,pullRequestIds:[...]})`. Verificar el enlace por lectura posterior y que la issue permanece abierta. La referencia actual distingue staging de la rama por defecto main; comprobar esa configuración antes de enlazar. Si difiere o el enlace tiene efectos distintos, detenerse y resolverlo, sin cerrar la issue para simular éxito. El nombre de la mutación no es prueba de su comportamiento.

Completar también el enlace que aún falta entre esta PR #604 y #602 durante la verificación autorizada, sin cambiar base ni solicitar revisores. Registrar que esta apertura se hizo antes de instalar la automatización; no usarla como prueba retroactiva de delegación.

En Codex descubrir las herramientas disponibles de GitHub y leer la cuenta y el repositorio sin mostrar credenciales. La referencia MCPS no configura el servidor. Reutilizar la conexión existente; si falta o falla, presentar el cambio concreto antes de modificar autenticación. No regenerar tokens, ampliar permisos ni desactivar confirmaciones preventivamente. Si una confirmación no es accesible al rol, devolver el bloqueo al principal sin sustituir silenciosamente MCP por gh.

## Verificación y evidencia — CA-01 a CA-06

1. Revisión estática de rutas, responsabilidades, enlaces y ausencia de instrucciones heredadas contradictorias. Revisar `bash -n` para cada script. Confirmar que no se copian las rutas de Ventura ni Socket.
2. Usar repositorios y un origin bare temporales con datos ficticios para probar scripts: arranque limpio, staging atrasado/divergente, archivos ajenos preparados/sin preparar/sin seguimiento, commit vacío con índice ocupado, commit de archivos concretos, borrados/renombres, argumentos inválidos, directorios/pathspecs/rutas externas, errores y push rechazado. Comprobar estados y commits antes/después y que las pruebas negativas no publican ni incorporan archivos ajenos. El origin temporal nunca será GitHub real.
3. En Codex comprobar invocación real de subagentes sin publicaciones; luego verificar acceso de lectura de GitHub y confirmaciones que el entorno requiera. Evidencia breve de encargos/resultados e incidencias, sin transcribir toda la conversación.
4. Usar las publicaciones de esta tarea para comprobar los pasos disponibles de guardar, publicar, enlazar y, solo cuando Miguel nombre revisores, pedir revisión. No rehacer issue, rama ni apertura de #602/#604 para obtener una prueba. No atribuir a los nuevos agentes operaciones previas a su instalación.
5. Probar la creación dentro de esta tarea mediante una única prueba controlada en GitHub, después de las comprobaciones locales y de conexión. Antes de publicar, solicitar autorización específica mostrando el título de prueba, la asignación a mglnglxx, la rama prevista y el recorrido completo. No depender de la siguiente funcionalidad ni empezar su issue para acreditar esta tarea.
   - El recorrido autorizado crea una issue identificada como prueba de #602 y sin trabajo funcional; abre su rama desde staging actualizado, hace el commit vacío y publica una PR en draft hacia staging, asignada a mglnglxx y enlazada en descripción y Development. Se ejecuta en una copia temporal del repositorio que contiene la automatización candidata, conservando la rama #602 y sus cambios. El commit de apertura de prueba no incorpora archivos de implementación ni datos.
   - Antes de actuar, verificar que esa copia temporal conserva los documentos de los roles accesibles a Codex y que la automatización candidata está disponible como archivos locales de configuración/instrucciones, sin incluirlos en el commit vacío. Validar el estado de Git resultante y registrar invocaciones reales de los agentes. No presentar una simulación local como prueba del MCP.
   - Repetir la petición de apertura sobre esa misma prueba y comprobar que no duplica issue, PR ni commit vacío. No fusionar la PR de prueba, solicitar revisores ni tocar las aprobaciones de #604.
   - La autorización solicitada incluye cerrar la PR y la issue de prueba al acabar, con una nota que las identifique como verificación de #602, y eliminar únicamente la rama de prueba y su copia temporal después de comprobar sus nombres. Esa limpieza es una actuación expresamente autorizada, no una capacidad automática del flujo entregado. Si hay un fallo parcial, registrar qué se creó y limpiar solo esos recursos autorizados.
   - Si Miguel no autoriza esta prueba, detener esta comprobación y dejar CA-02/CA-05 pendientes; no sustituirla por una tarea futura ni declarar terminado el desarrollo. Las pruebas locales de scripts no prueban por sí mismas la creación de issues/PRs por MCP.
6. En una copia desechable sin base ni secretos ejecutar `pnpm format` y `pnpm lint` con las dependencias exactas ya disponibles. Si falta el entorno, informar antes de instalar; no cambiar paquetes. Comparar los archivos protegidos con el estado inicial: clientes, db, queries, logic, scripts de Jupyter, configuración lint, dependencias, constitución y specs históricas. No ejecutar operaciones contra la base real.
7. Registrar en tasks comandos, resultados observados, cobertura por CA y pendientes reales. Quitar copias, repositorios y archivos temporales de las pruebas. No crear una suite permanente ni un servidor, framework o panel para esta tarea.

## Revisión del plan

El alcance responde a los seis criterios de la spec. Se sustituyen las instrucciones antiguas de Git sin cambiar Socket ni los contratos; se verifica delegación real mediante las herramientas de Codex en vez de asumir que leer agents/ basta. Se conservan las aprobaciones separadas y el trabajo secuencial desde staging.

La creación real en GitHub por los subagentes sigue pendiente de autorización específica de prueba. El límite de Cursor no bloquea Codex y no se usará ese editor. Un fallo real de permisos o delegación en Codex deja pendiente el criterio afectado. No hay decisiones de negocio pendientes.

## Ajuste de implementación — 2026-10-30

La regla raíz `.cursor/` oculta también las seis entradas aprobadas. Se añade una excepción limitada en el .gitignore de esta app; no se modifica la raíz ni se versiona configuración MCP o tokens. Revisado contra el alcance: permite publicar los archivos ya previstos sin cambiar el comportamiento del flujo.

## Cambio de entorno autorizado — 2026-10-30

Revisado contra la instrucción directa de Miguel y la spec ajustada: Codex ejecuta los roles con subagentes nativos. No se requiere modificar tokens, comprar créditos, instalar software ni cambiar las responsabilidades. Las pruebas reales de publicación y la entrega conservan sus autorizaciones previas.

## Arreglo de Ventura autorizado — 2026-10-30

Miguel pidió adaptar el arreglo 30149d61 de exercises/git-workflow-agent-template, disponible en staging 42462132. Se usa Closes #N en la plantilla y el enlace de descripción, manteniendo Development, base staging e issue abierta durante la apertura. No se cierra mediante API como parte del flujo. GitHub solo aplica ese cierre al integrarse en la rama por defecto; staging no se sustituye por main.

Se documenta mcp_apps_disable_form_deferral: header en el servidor remoto o --features en el servidor local stdio de Codex. La configuración privada no se versiona. La instrucción específica autoriza esa opción para evitar el formulario diferido; no elimina otras confirmaciones ni autoriza cambiar permisos o cliente. Si persiste una confirmación inaccesible, se registra el bloqueo. Se conserva el reparto de subagentes y las paradas SDD. Este ajuste sustituye las referencias anteriores a Related to y la prohibición general de headers públicos; las credenciales siguen excluidas.
