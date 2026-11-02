# Tareas — automatización de Git

Issue: #602 · PR: #604.
Estado: aprobadas por Miguel el 2026-10-30.
Referencias: [spec aprobada](spec.md) · [plan aprobado](plan.md).

Las rutas de aplicación son relativas a `staff/miguel-rodriguez/first-app-ai/`.
Seguir la lista de arriba abajo. Una tarea solo se marca al comprobar su resultado. No iniciar implementación antes de aprobar estas tareas. Ante una autorización necesaria o un bloqueo, detener el paso afectado sin saltar a publicaciones posteriores.

## Preparación

- [x] **T01 · Estado y conservación — CA-04, CA-06.** Confirmar rama #602, destino staging y estado local. Registrar la referencia inicial y el inventario/hash de los archivos protegidos indicados en el plan, sin leer bases ni secretos. Resultado: alcance inicial conocido y archivos ajenos identificados.
- [x] **T02 · Entorno de pruebas — CA-04, CA-06.** Preparar repositorios temporales y un origin bare local con datos ficticios. Mantener la estructura de nuestra carpeta. Resultado: pruebas de scripts aisladas del repo real y de GitHub.

## Scripts y skills de Git

- [x] **T03 · Estado — CA-01, CA-04.** Adaptar `tools/check-status.sh` y `skills/check-status/SKILL.md`. Probar rama, upstream ausente/presente y archivos preparados, modificados y sin seguimiento. Resultado: informe correcto sin modificaciones ni falsa afirmación de remoto actualizado.
- [x] **T04 · Actualización — CA-02, CA-04.** Adaptar `tools/pull-changes.sh` y su skill. Probar staging atrasado, divergente, cambios locales, estado Git sin resolver y staging abierto en otro worktree. Resultado: fast-forward cuando procede; errores sin reset, stash, limpieza ni alteración de trabajo ajeno.
- [x] **T05 · Rama — CA-02, CA-04.** Adaptar `tools/create-branch-from-staging.sh` y su skill. Probar nombre válido, argumentos inválidos, base actualizada y reanudación de rama local/remota existente. Resultado: rama correcta desde staging; reanudación sin duplicar ni mezclar trabajo.
- [x] **T06 · Apertura — CA-02, CA-04.** Adaptar `tools/create-empty-commit.sh` y su skill. Probar número de issue, rama correspondiente, índice ocupado y rechazo de main, staging y HEAD separado. Resultado: `chore: open #N` vacío; índice ajeno conservado.
- [x] **T07 · Archivos elegidos — CA-03, CA-04.** Adaptar `tools/commit-changes.sh` y su skill. Probar mensaje, archivos explícitos, borrados/renombres e índice ajeno. Rechazar directorios, pathspecs amplios, rutas externas a la app y ramas no permitidas. Resultado: commit solo de los archivos elegidos y resto del estado conservado.
- [x] **T08 · Publicación — CA-03, CA-04.** Adaptar `tools/launch-push.sh` y su skill. Probar push y upstream contra el origin temporal, rechazo remoto, argumentos de fuerza, main, staging y HEAD separado. Resultado: publica solo la rama validada y comunica errores sin reescribir historia.
- [x] **T09 · Revisión conjunta de scripts — CA-04, CA-06.** Ejecutar `bash -n` en los seis scripts y los casos positivos/negativos locales del plan. Comparar commits, archivos e índice antes/después. Resultado: ninguna prueba modifica el repo real ni publica en GitHub; fallos corregidos antes de continuar.

## GitHub y entrevistas

- [x] **T10 · Escritura de tareas — CA-01, CA-02.** Adaptar `templates/issues/basic_issue.md`, `skills/create-issue/SKILL.md` y `skills/assign-author/SKILL.md`. Incluir búsqueda de duplicados, título inglés, cuerpo español y autenticado. Resultado: procedimiento coherente, sin publicar todavía.
- [x] **T11 · Apertura de PR — CA-02, CA-04.** Adaptar la plantilla de PR y las skills `create-pr-base-staging` y `create-draft`. Fijar staging, asignación, apertura en draft y reanudación sin duplicados ni vuelta automática de una PR revisada a draft. Resultado: instrucciones compatibles con la protección de aprobaciones.
- [x] **T12 · Enlace — CA-02, CA-05.** Adaptar `skills/link-pr-to-issue/SKILL.md`: cuerpo por MCP y Development por gh GraphQL según el plan. Incluir lectura posterior y comprobación de issue abierta. Resultado: distingue ambos enlaces, comunica fallos y no cambia la base.
- [x] **T13 · Revisores — CA-03, CA-04.** Adaptar `skills/assign-reviewers/SKILL.md`. Revisar nombres ausentes, cuentas ambiguas, autor incluido y fallo parcial. Resultado: solo colaboradores indicados por Miguel y estado real de cada petición, sin solicitudes durante esta preparación; se ejecutan únicamente en el paso final cuando Miguel nombre revisores.
- [x] **T14 · Entrevistas — CA-01.** Adaptar las skills `grill-with-docs` y `grill-me` desde la referencia. Comprobar selección, orden y devolución de una pregunta al principal. Resultado: no espera interacción dentro del subagente ni crea publicaciones durante la entrevista.
- [x] **T15 · Referencia MCP — CA-01, CA-05.** Crear `MCPS/github-mcp-server/mcp.txt` con la referencia pública de GitHub. Resultado: referencia y opción pública de escritura directa, sin token ni configuración privada; no afirma que la conexión esté instalada.

## Agentes y compatibilidad de editor

- [x] **T16 · Entrevista y issue — CA-01, CA-05.** Adaptar `agents/help-me-to-think.md` y `agents/create-issue.md`, cada uno con sus skills y entradas/salidas. Resultado: responsabilidades distintas y preguntas devueltas al principal; no ejecutan otros momentos.
- [x] **T17 · Rama y commits — CA-01 a CA-04.** Adaptar `agents/create-branch.md` y `agents/create-commit.md`. Incorporar comprobaciones de identidad y apertura existente antes de repetir acciones. Resultado: solo base staging en este flujo y commits limitados a lo solicitado.
- [x] **T18 · Push y PR — CA-01 a CA-04.** Adaptar `agents/launch-push.md` y `agents/create-pr.md`. Resultado: push antes de PR; create-pr no enlaza, no solicita revisores ni cambia aprobaciones al reanudarse.
- [x] **T19 · Orquestación — CA-01 a CA-05.** Adaptar `agents/git-workflow-agent.md` con el reparto y orden del plan. Resultado: delegaciones reales secuenciales; skills propias del principal identificadas; ningún momento posterior automático ni confirmaciones redundantes.
- [x] **T20 · Registro — CA-01, CA-05.** Crear las seis entradas `.cursor/agents/<nombre>.md` del plan, con name, description y model heredado. Permitir solo esas entradas en el .gitignore local y comprobar que otra configuración Cursor sigue ignorada. Resultado: cada entrada remite a una sola instrucción de agents/, sin duplicarla ni introducir otro orquestador anidado.
- [x] **T21 · Manual y uso — CA-01, CA-04, CA-06.** Actualizar AGENTS.md y README.md conforme al plan. Resultado: autorización limitada de Git, paradas SDD independientes, uso en Codex y diagnóstico de conexión; Jupyter y Socket conservados.
- [x] **T22 · Guías — CA-01, CA-06.** Actualizar docs/TREE.md y docs/ARCHITECTURE.md con los archivos y responsabilidades reales, incluidos los documentos de este cambio. Resultado: rutas válidas, sin duplicar las reglas de otro documento.

## Comprobación inicial en Codex

- [x] **T23 · Delegación sin publicaciones — CA-05.** Invocar help-me-to-think mediante un subagente nativo de Codex con su documento de rol, sin cambios ni GitHub. Resultado: ID de encargo real y su respuesta; si falla la delegación, registrar el bloqueo.
- [x] **T24 · Conexión efectiva — CA-05.** Descubrir las herramientas GitHub del entorno Codex y comprobar cuenta y acceso al repositorio por lectura mediante el rol correspondiente. Resultado: datos de diagnóstico sin secretos. Si falta configuración, presentar el cambio concreto y esperar autorización específica antes de aplicarlo.

## Prueba controlada en GitHub

- [x] **T25 · Autorizar prueba controlada — CA-02, CA-05, CA-06.** Presentar título, asignación, recorrido de creación y limpieza descritos en el plan. Esperar autorización específica antes de publicar recursos de prueba. Resultado: autorización registrada o criterio pendiente, sin abrir la siguiente funcionalidad.
- [x] **T26 · Copia para la prueba — CA-04, CA-05.** Preparar la copia temporal desde staging actualizado con las instrucciones candidatas disponibles localmente. Verificar acceso a los documentos de los roles desde Codex, estado Git y exclusión de implementación/datos del commit vacío. Resultado: entorno de prueba separado de #602.
- [x] **T27 · Recorrido de creación — CA-02, CA-05.** En esa copia, ejecutar con delegación real la creación de una única issue de prueba, rama, commit vacío, push, PR draft a staging, asignación y ambos enlaces. Resultado: IDs, estado y ejecuciones comprobados; no fusionar ni solicitar revisores.
- [x] **T28 · Reanudación — CA-02, CA-03, CA-05.** Repetir la apertura de la misma tarea de prueba. Resultado: misma issue, rama, PR y commit de apertura, sin duplicados ni cambios de base.
- [x] **T29 · Confirmaciones — CA-05.** Comprobar las confirmaciones requeridas durante las acciones autorizadas de la prueba controlada y registrar también las de las publicaciones posteriores de esta entrega. Resultado: intervención accesible y resultados verificables; una tarjeta inaccesible detiene la operación, sin saltar a otro cliente ni desactivar controles.
- [x] **T30 · Limpieza autorizada — CA-04, CA-06.** Cerrar exclusivamente la PR/issue de prueba con nota de verificación de #602 y retirar su rama/copia según la autorización. Resultado: recursos identificados y cerrados; #602/#604 siguen abiertos. Ante fallo parcial, limpiar solo lo efectivamente creado y autorizado.

## Verificación final

- [x] **T31 · Enlace de esta entrega — CA-02, CA-05.** Mediante el flujo instalado, completar o verificar ambos enlaces #604 ↔ #602 y confirmar base staging, draft y issue abierta. Resultado: evidencia real del enlace, sin atribuir la apertura anterior a los nuevos agentes.
- [x] **T32 · Formato y lint — CA-06.** En copia desechable sin datos ni secretos, ejecutar pnpm format y pnpm lint con las dependencias exactas existentes. Resultado: ambos pasan; si falta entorno, informar antes de instalar o alterar paquetes.
- [x] **T33 · Comparación final — CA-01, CA-04, CA-06.** Comparar archivos protegidos y estado local con T01; revisar rutas y correspondencia entre spec, plan, tareas, instrucciones y guías. Resultado: sin cambios de app, contratos, Socket, datos ni archivos ajenos; solo alcance aprobado.
- [x] **T34 · Evidencia y temporales — CA-01 a CA-06.** Completar el registro siguiente con comandos, resultados, delegaciones y cobertura real de las comprobaciones realizadas; retirar temporales propios. Resultado: distingue comprobado, pendiente y bloqueado. Las publicaciones y la petición de revisión siguientes conservan evidencia en sus registros de ejecución; no se marca aquí como probado lo que aún no ocurrió. No fusionar/cerrar #602/#604 automáticamente.

## Publicación y revisión

- [ ] **T35 · Guardar esta entrega — CA-03, CA-04.** Cuando Miguel autorice sus commits y push, usar el flujo instalado en Codex para guardar solo los archivos de #602. Resultado: implementación y evidencia publicadas con encargos y resultados verificables; no solicitar revisores, cambiar base ni declarar este paso probado si se ejecuta por otra vía.
- [ ] **T36 · Revisión solicitada — CA-03, CA-05.** Solo cuando Miguel nombre revisores para #604, verificar esas cuentas, excluir al autor y ejecutar la petición desde Codex. Resultado: solicitudes verificadas y PR lista; si aún no hay nombres, registrar este paso pendiente sin inventarlos.

## Evidencia

Implementación local realizada el 2026-10-30. Miguel cambió expresamente el entorno a Codex; verificación en curso. No se considera terminada la tarea. Las tareas de publicación y revisión se acreditan con sus registros reales de ejecución; no se añaden commits solo para marcar esas casillas después de recibir aprobaciones.

| Criterio | Comprobaciones previstas | Resultado observado |
| --- | --- | --- |
| CA-01 | T03, T10, T14, T15, T16, T17, T18, T19, T20, T21, T22, T33 | Archivos, rutas y responsabilidades comprobados; seis roles disponibles mediante delegación nativa de Codex. Verificación real en curso. |
| CA-02 | T04, T05, T06, T10, T11, T12, T25, T26, T27, T28, T31 | Scripts locales comprobados. Issue622/PR626 creadas por subagentes MCP; enlace604↔602 verificado. |
| CA-03 | T07, T08, T13, T28, T35, T36 | Commit/push real del test vacío y reanudación comprobados; publicación de entrega y revisores pendientes. |
| CA-04 | T01, T02, T04, T05, T06, T07, T08, T09, T11, T13, T17, T18, T19, T21, T25, T26, T30, T33, T35 | Protecciones locales y prueba real completadas; sin cambios de base ni solicitudes de revisión. |
| CA-05 | T12, T15, T16, T17, T18, T19, T20, T23, T24, T25, T26, T27, T28, T29, T31, T35, T36 | Seis roles y escrituras MCP reales verificados; no se presentó formulario diferido tras reiniciar. Petición final de revisores pendiente. |
| CA-06 | T01, T02, T09, T21, T22, T25, T30, T32, T33, T34 | Formato/lint y conservación comprobados; issue622/PR626 cerradas sin merge y rama/copia temporal retiradas. |

Para cada ejecución registrar: tarea, comando o acción, entorno, resultado real y recurso afectado. Para delegación: agente, encargo, resultado y referencia al registro visible; nunca tokens ni headers. Si un fallo requiere cambiar el reparto o el diseño aprobado, revisar el plan antes de continuar ese trabajo.

Antes de publicar, repetir formato y comparación si hubo cambios desde sus comprobaciones. La solicitud de revisión es el último paso: no añadir commits ni cambiar la base después sin una petición expresa. No declarar terminado mientras falten verificaciones exigidas.

### Ejecución local — 2026-10-30

- Referencia inicial: `8519dd3`, rama `602-chore-add-git-workflow-automation`. Lectura de #604: base staging, draft=true, misma rama. No se ha hecho commit ni push de esta implementación.
- Inventario inicial: 73 archivos versionados de la app. Comparación final: 68 idénticos byte a byte. Solo cambian los cinco archivos previstos de documentación/ignore; las incorporaciones están dentro de esta app. Socket en AGENTS conserva exactamente su texto; no se abrieron bases locales.
- `bash -n` pasó en los seis scripts. El programa temporal de comprobación ejecutó 45 invocaciones de los scripts en repositorios desechables, con resultado satisfactorio. Origen bare local: ningún push de prueba fue a GitHub.
- Casos comprobados: estado de archivos y upstream, fast-forward y divergencia, estado de merge pendiente, staging en otro worktree, rama existente local/remota, argumentos inválidos, commit vacío con índice ocupado, archivos concretos, renombre preparado, borrado, directorios/pathspecs/rutas externas y directorio simbólico externo, main/staging/HEAD separado, push correcto y rechazo remoto. El índice ajeno, el cambio sin preparar y el archivo sin seguimiento conservaron su contenido/estado en la prueba de commits.
- Primera prueba descubrió que un renombre ya preparado no se validaba correctamente y que sincronizar el índice con add tras el commit podía fallar para el nombre eliminado. Se corrigió usando la existencia en HEAD para borrados y una actualización del índice limitada a los archivos elegidos. Las 45 invocaciones pasaron después. Otra revisión distinguió error de conexión de rama remota inexistente.
- Revisión estática: 14 skills, siete documentos de agentes y seis entradas de Cursor; referencias de agentes/skills válidas, sin rutas personales de Ventura. La excepción local de .gitignore permite solo esas seis entradas; `.cursor/mcp.json` sigue ignorado. El ajuste está documentado en el plan.
- En copia desechable, Node 24.12.0 y dependencias existentes copiadas: `pnpm --config.verifyDepsBeforeRun=false format` y `pnpm --config.verifyDepsBeforeRun=false lint`, ambos con salida 0. El parámetro evita que esta ejecución intente reinstalar; no modifica configuración permanente, dependencias ni políticas de seguridad. Los 13 archivos JavaScript comprobados permanecieron idénticos. Se eliminó la copia después.
- Un primer intento con node_modules enlazado produjo un aviso de reinstalación automática y permiso de escritura de shims; no se tomó como verificación limpia. Se repitió con una copia real de la instalación y sin reinstalación automática, con los resultados anteriores.

### Intento anterior en Cursor — evidencia histórica, ya no es requisito

- Se abrió first-app-ai como carpeta del proyecto mediante Open Folder. Customize → Subagents muestra `1 Workspaces 6`: create-branch, create-commit, create-issue, create-pr, help-me-to-think y launch-push.
- Customize → MCPs muestra `github`, origen `User`, conectado, con `46 tools, 4 resources enabled`. No se abrió ni volcó configuración privada ni se modificaron tokens o permisos. Esto no acredita aún el usuario autenticado ni una acción del MCP.
- Se envió una petición de solo lectura para invocar realmente help-me-to-think, sin Git, escritura, publicación ni credenciales. Cursor respondió: **Weekly usage limit reached. It resets in 3 days.** No se ejecutó el agente en ese editor; ese resultado no acredita ni bloquea la ejecución posterior en Codex. Registro visible: conversación `T23 read-only test` de esta carpeta.
- Para esta prueba se seleccionó Composer 2.5 Fast en la nueva conversación; no se ejecutó Grok desde la interfaz ni se compraron créditos. Las entradas de los agentes siguen con model: inherit.
- No se sustituyó la ejecución de Cursor por Codex/gh ni se inició la prueba de GitHub. T25–T31, T35 y T36 permanecen pendientes; no se creó ningún recurso de prueba ni se pidió revisión.

### Continuación autorizada en Codex — 2026-10-30

Miguel indicó «Dont use Cursor, you do it». Spec y plan ajustados a esa instrucción. Reanudar T23/T24 con subagentes reales y MCP de este entorno. Mantener pendiente T25 hasta autorización específica de la prueba GitHub; no publicar, pedir revisión ni cambiar la base de #604 por este cambio de entorno.

### Delegación real en Codex — 2026-10-30

- T23: encargo nativo `/root/help_me_to_think`, contexto separado. Leyó su rol y ambas skills de entrevista, AGENTS, README, spec y orquestador. Devolvió un resumen concreto de cómo comprobar comprensión del flujo, sin preguntas de producto pendientes. No ejecutó Git, escritura ni GitHub. Esto acredita delegación real; no acredita una prueba de usabilidad con una persona junior.
- T24: encargo nativo `/root/create_issue_connection`. Mediante `mcp__github__get_me` y `mcp__github__issue_read` verificó usuario `mglnglxx`, issue #602 abierta, título esperado, asignación a ese mismo usuario y URL. Sin gh, creación o edición. La conexión MCP de Codex funciona en lectura.
- Comprobación local adicional: `/root/create_branch_local` ejecutó el script de rama en un repositorio desechable, con origin bare local. Rama `602-chore-codex-local-check`; HEAD, staging y origin/staging iguales tras crearla. No publicó nada en GitHub.

- `/root/create_commit_local`: creó de verdad la apertura vacía `d433531` y el commit selectivo `646f456` en la copia local. Solo cambió sample.txt; unrelated.txt conservó su cambio en el índice y no entró al commit. Ningún archivo de instrucciones se incorporó.
- `/root/launch_push_local`: verificó primero que origin era `/tmp/neoland-602/codex-delegation/origin.git` y ejecutó el script candidato. HEAD local y remoto coincidieron en `646f4564913f2bc7e4c3fd1b9b04f5751c9e9074`; upstream establecido. Es transporte Git local, no una publicación en GitHub.

La prueba de creación real de T25 sigue pendiente de autorización específica: título propuesto `Test first-app-ai Git workflow for issue 602`, asignación `mglnglxx`, rama `N-chore-verify-git-workflow` con el número de la issue de prueba. Una issue y una PR draft hacia staging, sin merge ni revisores; después cerrar ambas con nota de prueba y borrar solo su rama/copia. No se ha ejecutado ninguna parte de esa publicación.

- `/root/create_pr_existing`: lectura real con `mcp__github__pull_request_read` confirmó #604 abierta, draft=true, base staging, head esperado, asignación mglnglxx y Related to #602. No escribió ni duplicó la PR. La creación, confirmaciones de escritura y enlace Development no se acreditan con esta lectura.
- Las seis responsabilidades se invocaron como subagentes reales de Codex: entrevista, issue existente, rama local, commits locales, push local y PR existente. Cada resultado conserva el alcance de lo observado; solo la futura prueba de escritura autorizada puede completar el recorrido GitHub. La copia de delegación con origin bare local se eliminó tras registrar los resultados.

## Arreglo de Ventura autorizado — 2026-10-30

Miguel pidió adaptar el arreglo 30149d61 de exercises/git-workflow-agent-template, disponible en staging 42462132. Se usa Closes #N en la plantilla y el enlace de descripción, manteniendo Development, base staging e issue abierta durante la apertura. No se cierra mediante API como parte del flujo. GitHub solo aplica ese cierre al integrarse en la rama por defecto; staging no se sustituye por main.

Se documenta mcp_apps_disable_form_deferral: header en el servidor remoto o --features en el servidor local stdio de Codex. La configuración privada no se versiona. La instrucción específica autoriza esa opción para evitar el formulario diferido; no elimina otras confirmaciones ni autoriza cambiar permisos o cliente. Si persiste una confirmación inaccesible, se registra el bloqueo. Se conserva el reparto de subagentes y las paradas SDD. Este ajuste sustituye las referencias anteriores a Related to y la prohibición general de headers públicos; las credenciales siguen excluidas.

### Evidencia del arreglo

- T25: Miguel autorizó la prueba temporal y su limpieza con «hm no, test it». T26: copia /tmp/neoland-602/live-test desde staging 42462132, sin datos ni implementación incorporados al commit.
- Los intentos anteriores de issue_write por subagente y principal devolvieron formulario diferido; no crearon issue ni acreditan T27. Miguel no vio el formulario. No hubo fallback a gh.
- Se añadió args = ["--features", "mcp_apps_disable_form_deferral"] a la conexión local de Codex con autorización directa. Debe comprobarse que el wrapper los reenvía y que la conexión los recarga antes de acreditar el resultado. T27–T31 continúan pendientes.

- Revisión encontró que el wrapper local no reenviaba los argumentos de config.toml; la primera configuración por sí sola no podía activar la opción. Se corrigió el exec para reenviar "$@", preservando la carga de credenciales. sh -n pasó. Un proceso nuevo inicializó por protocolo MCP y devolvió 46 herramientas, incluida issue_write, con la opción reenviada. Es una comprobación de arranque/configuración, no una creación real ni una recarga de la conexión activa de este chat. El primer intento sin acceso al almacén de credenciales terminó antes de inicializar; se repitió con el permiso de ejecución correspondiente, sin imprimir secretos.
- La escritura real de T27 sigue pendiente de reconectar Codex. No se crearon recursos ni se cambió la base o las aprobaciones de #604 durante esta adaptación.

### Prueba real tras reiniciar Codex — 2026-10-30

- T27: create_issue_connection creó por MCP la issue #622 abierta y asignada a mglnglxx sin formulario diferido. create_branch_local abrió 622-chore-verify-git-workflow desde staging 02c15582734ce41d5ecac2b3d0ed41e0b9511343. create_commit_local creó c17b213a3491800c634411abb5c08bb0829d00f3, apertura vacía sin archivos. launch_push_local publicó únicamente esa rama; ls-remote confirmó el mismo hash. create_pr_existing creó por MCP #626, draft hacia staging, asignada al autenticado y sin revisores. El principal completó Closes #622 por MCP y Development mediante la mutación documentada; la lectura devolvió issue OPEN y PR626 relacionada.
- T28: búsqueda exacta reutilizó la única issue622 y única PR626. La comprobación de apertura encontró exactamente un commit y omitió crear otro. La prueba encontró que el helper comprobaba staging incluso para ramas existentes; los merges concurrentes impedían reanudar. Se trasladó la comprobación de base actualizada exclusivamente a la creación nueva. El subagente volvió a ejecutar el helper: salida0, rama existente reutilizada y HEAD c17b213a intacto. Las 45 invocaciones aisladas volvieron a pasar tras la corrección.
- T29: creación, asignación, edición y cierre por MCP devolvieron recursos reales sin formulario diferido. La revisión automática inicialmente rechazó el push del subagente por no identificar la autorización. Se aportó la petición expresa «hm no, test it», el destino y la comprobación de commit vacío; el mismo script fue aprobado y completado, sin otro cliente ni ampliación de alcance.
- T30: PR626 cerrada con comentario de prueba, merged=false; issue622 cerrada como completed con comentario. Se borró exclusivamente la rama remota622 y ls-remote confirmó ausencia. Copia live-test retirada después de conservar esta evidencia; no hubo merge ni solicitud de revisores.
- T31: #604 conserva head8519dd3, draft=true, estado abierto y base staging. Cuerpo actualizado a Closes #602 y referencia Codex. Development se verificó por lectura de la mutación: issue602 OPEN y PR604 relacionada. No se atribuye su creación anterior al flujo nuevo.
- T32/T33: se repitieron format y lint con las dependencias existentes en copia sin datos: salida0 en ambos. bash -n pasó en seis scripts; git diff --check sin errores. De los 73 archivos originales, solo cambian los cinco previstos (ignore e instrucciones/guías); los otros68 mantienen SHA-256.
- T34: prueba y limpieza documentadas. T35 y T36 siguen pendientes: no hay commits/push de la implementación de #602 ni solicitud de revisores. No se declara publicada la entrega.

### Revisión previa a entrega — 2026-10-30

Miguel pidió continuar tras explicar revisión, commits pequeños, push y actualización de #604. Se verificó #604 abierta, draft, base staging y sin reviews: no hay aprobaciones que invalidar con esta publicación. Revisión final: rutas y roles válidos, bash -n y git diff --check correctos, 68 originales protegidos sin cambios. Se preparan tres commits separados (SDD/evidencia, herramientas/skills, integración/documentación) usando el subagente y scripts aprobados. No solicitar revisores hasta recibir sus nombres. Los hashes y el resultado de push se informarán desde los registros reales, sin otro commit para marcar casillas.
