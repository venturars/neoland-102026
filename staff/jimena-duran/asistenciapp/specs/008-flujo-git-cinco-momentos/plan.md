Issue: #751

# Plan de automatización y SDD de cinco momentos

Estado: spec, plan y T01–T55 aprobados; implementación, enmienda 3.1 y publicación completadas con autorización expresa. [PR draft #756](https://github.com/venturars/neoland-102026/pull/756) contra staging, sin revisores ni merge. Resultados en [verification.md](verification.md).

## Estado inicial y alcance

Rama exclusiva: `751-chore-asistenciapp-git-five-stages`, desde `50094711`. Fuente: `exercises/git-workflow-agent-template` en ese commit de origin/staging; última modificación del template: `25208d23`. No actualizar esta referencia silenciosamente durante la implementación.

Al preparar el plan faltaban agents, skills, tools, templates y MCPS. Esos componentes y la documentación necesaria ya están incorporados y adaptados al entorno actual. El código de asistencia, las pantallas, las pruebas funcionales, las specs anteriores y los datos permanecen intactos. No cambian modelo de datos, tablas, rutas HTTP, API, dependencias, credenciales o configuración personal.

Las rutas siguientes son relativas a AsistenciApp. El código de referencia son los siete scripts del template; las comprobaciones existentes del proceso están en `tests/test_sdd_rules.py`.

## Archivos afectados

| Archivos                              | Cambio previsto                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                           | Integrar entrada al orquestador, cinco momentos, lectura explícita de skills, límites de autorización y estado de la 008. Conservar reglas de código y del producto; sustituir solo las instrucciones incompatibles del proceso.                                                                                                                     |
| `docs/CONSTITUTION.md`                | Proponer y, solo tras autorización, aplicar la enmienda de §4 y su versión; conservar P1–P6 y el resto de obligaciones.                                                                                                                                                                                                                              |
| `docs/ARCHITECTURE.md`                | Añadir agents, skills, tools, templates y MCPS al árbol y explicar su separación de la aplicación.                                                                                                                                                                                                                                                   |
| `docs/GIT-AUTOMATION.md`              | Nueva guía breve de PowerShell, autorizaciones, seguridad, MCP con alternativa gh y limitaciones de verificación. No modificar el README funcional.                                                                                                                                                                                                  |
| `agents/`                             | Incorporar `git-workflow-agent.md`, `help-me-to-think.md`, `create-issue.md`, `create-branch.md`, `create-commit.md`, `launch-push.md` y `create-pr.md`.                                                                                                                                                                                             |
| `skills/<nombre>/SKILL.md`            | Incorporar las quince skills del template: assign-author, assign-reviewers, check-status, commit-changes, create-branch, create-branch-from-staging, create-draft, create-empty-commit, create-issue, create-pr-base-staging, grill-me, grill-with-docs, launch-push, link-pr-to-issue y pull-changes. Adaptar comandos y límites al flujo aprobado. |
| `tools/`                              | Crear los equivalentes `.ps1` de check-status, pull-changes, create-branch-from-staging, create-branch, create-empty-commit, commit-changes y launch-push; compartir únicamente los controles necesarios en `git-common.ps1`.                                                                                                                        |
| `templates/issues/`                   | Incorporar `{feat,fix,docs,refactor,test,chore}_issue.md`, iguales a la fuente fijada.                                                                                                                                                                                                                                                               |
| `templates/pull-request/`             | Incorporar `{feat,fix,docs,refactor,test,chore}-pull-request.md`, iguales a la fuente fijada.                                                                                                                                                                                                                                                        |
| `MCPS/github-mcp-server/mcp.txt`      | Referencia de conexión y capacidades, sin tokens ni instrucciones que sobrescriban configuración personal o presupongan otro cliente.                                                                                                                                                                                                                |
| `tests/test_sdd_rules.py`             | Ajustar únicamente las verificaciones de las puertas SDD y de la versión constitucional; conservar cobertura, ámbito personal e integridad de specs y sus casos de saltos de línea.                                                                                                                                                                  |
| `tools/tests/test-git-automation.ps1` | Comprobaciones específicas de esta automatización, aisladas de los datos de la aplicación y sin mutaciones remotas de prueba.                                                                                                                                                                                                                        |
| `specs/008-flujo-git-cinco-momentos/` | Mantener aprobación y estados; preparar tasks solo después de aprobar este plan. Registrar resultados reales en `verification.md` durante la implementación autorizada.                                                                                                                                                                              |

## Flujo y enmienda propuesta

La enmienda prevista es 3.0 → 3.1: modifica el proceso de §4, sin eliminar ni contradecir principios del producto. Actualizar versión y fecha de aplicación y añadir únicamente el motivo de esta enmienda según §8; conservar las entradas existentes, sin añadir nombres ajenos, rutas personales ni historial de incidencias.

El nuevo §4 y AGENTS expresarán las mismas cinco puertas:

1. **Issue:** concretar, crear o reutilizar y detenerse, sin abrir rama.
2. **Rama y draft:** con autorización expresa del momento y de sus operaciones de publicación, actualizar staging por avance rápido, crear o recuperar rama, preparar el commit de apertura cuando corresponda, publicar y crear o reutilizar PR draft contra staging, asignar autor y enlazar issue. Detenerse sin specs.
3. **Documentos:** con autorización, escribir spec, plan y tasks en la misma pasada, en ese orden, usando el siguiente número disponible; detenerse para su revisión conjunta.
4. **Implementación:** exigir documentos revisados y autorización expresa; ejecutar solo las tareas aprobadas y detenerse con resultados, sin commit ni push.
5. **Publicación o revisión:** realizar únicamente las operaciones, archivos y revisores autorizados; no implica merge ni otro momento.

Se conservan la spec aprobada antes de modificar código o pruebas, una nueva spec para alcance no cubierto, la prohibición de inventar requisitos y la obligación de detenerse si cambian los documentos. Issue, rama y PR no autorizan implementación. No habrá un permiso global implícito de commit o push.

**Transición de esta entrega:** se revisaron spec, plan y tareas por separado bajo el SDD anterior. Después se autorizó expresamente implementar y aplicar la enmienda 3.1, ahora vigente. La autorización de ensayos permitió commits y push solo en repositorios desechables con remoto local. La publicación del repositorio de trabajo se autorizó después y se realizó en la rama existente, sin recrear documentos: PR draft contra staging, sin revisores ni merge.

## Adaptación a PowerShell y seguridad

- Compatibilidad con Windows PowerShell 5.1. Resolver la ubicación con `$PSScriptRoot` y la raíz con `git rev-parse`; invocaciones desde raíz o aplicación, rutas literales y argumentos separados, incluidos arrays reales de archivos. UTF-8 y comprobación explícita de `$LASTEXITCODE`; restaurar directorio y variables temporales incluso al fallar. No depender de Bash ni instalar herramientas.
- Interfaz prevista: `create-branch-from-staging.ps1 -Issue -Type -Description`, `create-branch.ps1 -Base -Issue -Type -Description`, `create-empty-commit.ps1 -Issue -ExpectedBranch`, `commit-changes.ps1 -Message -Paths -ExpectedBranch` y `launch-push.ps1 -ExpectedBranch`. Estado y actualización de staging no requieren parámetros. Un nombre explícito autorizado puede pasarse con `-BranchName`.
- Tipos y forma editorial remiten a las plantillas. Si falta una, usar la más cercana, sin imponer una lista fija, exigir plantillas para generar un nombre ni introducir reglas de renombrado. Mantener validación del número, descripción y referencia Git, y la regla independiente de mensajes convencionales de commit.
- Antes de mutar, comprobar rama, índice, cambios versionados, conflictos, operaciones pendientes y otros worktrees. Los archivos sin seguimiento no bloquean por sí solos; conservarlos y dejar que Git rechace colisiones reales. Usar `--no-overwrite-ignore` al cambiar de rama o avanzar staging.
- Adelantar staging solo tras comprobar ascendencia, preservando la rama actual. Si staging está en otro worktree, hay divergencia o colisión, informar y detenerse. Sustituir el avance forzado del template por una actualización condicional al valor anterior, tras verificar el avance rápido. Recuperar ramas existentes sin reemplazar sus commits; no integrar otras ramas automáticamente.
- Commits selectivos mediante índice temporal y lista explícita de archivos relativos a la raíz; rechazar directorios, opciones y comodines. Conservar el índice ajeno y bloquear hooks activos para revisión, sin ejecutarlos ni desactivarlos. Commits y publicación verifican `-ExpectedBranch` y bloquean main/staging. Nunca reset destructivo, clean, stash automático ni push forzado.
- Un proceso con `-ExecutionPolicy Bypass` solo se usará si es necesario y está permitido; no cambiar la política global ni eludir una política administrada. La autorización de implementación incluyó commits y push exclusivamente en repositorios desechables con remoto local para comprobar esta automatización; el permiso no se extiende al repositorio de trabajo ni a GitHub.

## Agentes, plantillas y acceso remoto

El orquestador transmite momento, issue, rama, archivos permitidos y prohibiciones a agentes reales. Lee las skills por ruta, sin asumir su autodetección; si no puede delegar, informa y se detiene. Las preguntas vuelven a la persona responsable y cada momento termina antes de iniciar el siguiente.

Las doce plantillas mantienen comentarios y reglas editoriales. Create-pr usa el título de la issue, base staging, draft y casillas sin marcar; retira el marcador `Closes #` antes del alta. El orquestador escribe después una única línea con el número real, conserva el resto del cuerpo y relee Development por separado. Comprueba la rama predeterminada y no promete cierre al fusionar en staging si no es la predeterminada.

Comprobar identidad y repositorio a partir de origin antes de escribir; preferir MCP compatible y conservar gh autenticado como alternativa, explicando el motivo. Buscar recursos existentes y, ante respuesta incierta, releer el estado remoto antes de reintentar o cambiar de vía. Usar archivos temporales UTF-8 para cuerpos con gh; no interpolar el contenido como código. En Windows comprobar acceso al almacén de credenciales antes de interpretar un 401 como credencial inválida, sin imprimir secretos.

No copiar instrucciones de configuración personal ni llamadas GraphQL del template sin verificar su contrato y soporte. Conservar vínculos existentes y verificar cuerpo y Development de forma independiente; si falta capacidad, informar del límite sin inventar un enlace. Asignar revisores solo cuando se indiquen y nunca cerrar issues ni hacer merge implícito.

## Comprobación de la constitución

- **P1:** no se modifican integraciones ni independencia de la plataforma de clase.
- **P2:** adaptación localizada del template, sin reorganizar ni abstraer la aplicación.
- **P3:** ninguna dependencia nueva ni cambio de versión; usar Git, PowerShell, pytest y herramientas ya disponibles. No instalar nada automáticamente.
- **P4:** no abrir bases personales ni transmitir datos de asistencia. Repositorios y datos de ensayo son desechables.
- **P5:** no se modifica la interfaz ni su accesibilidad.
- **P6:** documentación, cuerpos y mensajes dirigidos a la persona en español; títulos y convenciones de Git según los comentarios de las plantillas.
- **§5:** cada CA tiene comprobación indicada abajo. Ejecutar pytest solo sobre las pruebas del SDD afectadas y comprobar la automatización; las pruebas funcionales inalteradas no se repiten por el alcance solicitado. No afirmar que se ejecutó la suite completa.
- **§6:** autenticación de la aplicación, códigos, sesiones, entradas y seguridad de asistencia permanecen intactos.
- **§4 y §8:** la preparación respetó las aprobaciones separadas vigentes. La enmienda 3.1 se aplicó después de autorizar expresamente su implementación; la aprobación de documentos no equivale a publicar.
- **§7:** todos los cambios de esta entrega permanecen dentro de AsistenciApp.

## Comprobaciones tras autorizar tareas e implementación

| Criterios          | Comprobación prevista                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CA-01–CA-05, CA-08 | Adaptar `test_sdd_gates` para verificar las cinco puertas, su orden, pausas y permisos en AGENTS y constitución. Conservar las invariantes que siguen vigentes: spec aprobada para implementar, nueva numeración, dudas y ausencia de autorización implícita. Recorrer los agentes en lectura; diferenciar esa revisión estática de una ejecución real.  |
| CA-06              | Comparar contenido de las doce plantillas con la fuente fijada; verificar selección para seis tipos y uno sin plantilla, secciones, casillas y retirada del marcador. Buscar referencias genéricas y reglas editoriales duplicadas en componentes operativos, sin reescribir specs anteriores.                                                           |
| CA-07              | Parser de los `.ps1`, ejecución de estado desde raíz y aplicación y ruta con espacios. Generar nombres con tipo sin plantilla y nombre explícito; rechazar números, descripciones y referencias inseguros y ramas protegidas. Comprobar controles de índice, hooks, worktrees y códigos nativos.                                                         |
| CA-07              | Ensayar avance rápido, divergencia, ramas existentes, colisiones con archivos ignorados y sin seguimiento y conservación del índice en repositorios temporales con remoto local. La autorización de implementación incluyó los commits y push exclusivamente en esos repositorios desechables. No se ejecutan contra el repositorio de trabajo o GitHub. |
| CA-08–CA-09        | Ajustar `test_constitution_amendment` para la versión aprobada y su nueva entrada, conservando las entradas e invariantes anteriores. No borrar, saltar ni relajar verificaciones para obtener verde. Mantener intactos los tests de ámbito e integridad histórica y todas las pruebas funcionales.                                                      |
| CA-10              | Revisar diff y hashes contra la base de archivos funcionales, pruebas funcionales, specs anteriores y datos locales; no ejecutar ejemplos ni abrir bases reales. Solo los archivos previstos pueden cambiar.                                                                                                                                             |

Ejecutar las comprobaciones de SDD afectadas mediante el intérprete existente del entorno de la aplicación: `python -m pytest tests/test_sdd_rules.py -k "sdd_gates or constitution_amendment"`. Ampliar esa selección únicamente para casos nuevos del SDD previstos en las tareas, conservando las comprobaciones restantes sin volver a ejecutarlas si son ajenas al cambio.

El ensayo específico de PowerShell vivirá en `tools/tests/test-git-automation.ps1`; separará comprobaciones de lectura y validación de las mutaciones limitadas a repositorios desechables, incluidas en la autorización de implementación. No creará issues, PR ni solicitudes de revisión para probar el flujo. Antes de publicar realmente se verificará el estado remoto, solo cuando exista autorización para esa publicación.

Revisar formato de los documentos afectados, enlaces y `git diff --check`, incluidos archivos nuevos. Registrar comandos, resultados, límites y pendientes en `verification.md`, sin reutilizar resultados de otras entregas como evidencia de esta. La evidencia de implementación se registra separando pruebas ejecutadas y revisión estática; no se presentan escrituras remotas o recorridos reales de agentes no realizados como comprobados.

## Revisión pendiente

Implementación, enmienda 3.1 y publicación autorizada completadas. El diff se limita a los 53 archivos aprobados de AsistenciApp; los archivos y datos protegidos no cambiaron. La PR permanece en draft contra staging, con cuerpo y Development verificados por relectura, sin revisores ni merge. Los resultados y límites se registran sin repetir pruebas satisfactorias.
