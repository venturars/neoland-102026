Issue: #588

# Plan de adaptación a Windows y Codex

Estado: spec, plan y tareas T01–T23 aprobados por Jimena. Implementación y comprobaciones realizadas; resultados y límites en [verification.md](verification.md). Sin commit, push ni PR en el repositorio personal.

## Organización y funcionamiento

- La automatización se organiza en agents/, skills/, tools/, templates/ y MCPS/ dentro de la aplicación de Jimena, con los nombres detallados en «Cambios previstos».
- El orquestador selecciona el momento del flujo y delega a agentes reales. Cada agente tiene un cometido delimitado y utiliza las skills, herramientas y plantillas correspondientes.
- La issue precede a la spec. Las preguntas vuelven al orquestador. La revisión humana de spec y plan precede a las tareas, y otra revisión precede a la implementación.
- Guías locales leídas: AGENTS.md, CONSTITUTIONS.md, ARCHITECTURE.md y TREE.md. La aplicación conserva logic/, queries/, db/ y clients/ en su ubicación actual.

## Estado inicial comprobado

Se ejecutaron git fetch origin, git switch staging y git pull --ff-only origin staging. Se creó jimena-duran-291020262 desde staging actualizado, sin conflictos. No existía esa rama local ni remota. No se hicieron commits ni publicaciones.

Los archivos locales de staff/jimena-duran/ChromaDB/ y db/users.sqlite se conservaron. El primero sigue sin seguimiento; SQLite ahora está ignorado por las reglas recibidas de staging. No añadirlos al trabajo.

Entorno observado: PowerShell 5.1, Node v24.22.0 y GitHub CLI autenticado como jiji-mena. gh necesita acceso al almacén de credenciales de Windows fuera del sandbox; dentro devolvió 401. pnpm y code no aparecen en el PATH inspeccionado: eso no demuestra que no estén instalados. No instalar ni cambiar configuración global en esta fase.

La issue #588 fue creada por un subagente real antes de estos documentos.

## Cambios previstos

Todas las rutas siguientes son relativas a staff/jimena-duran/first-app.

- Integrar en AGENTS.md existente una entrada al orquestador y una única sección de orden: issue, spec/plan, revisión, tareas, revisión, implementación autorizada. Conservar reglas, comandos y enlaces útiles existentes, sin duplicar instrucciones.
- Crear agents/git-workflow-agent.md y los roles help-me-to-think, create-issue, create-branch, create-commit, launch-push y create-pr. El padre coordina y entrega el contexto al agente real; el agente devuelve resultados o preguntas, sin esperar por su cuenta la respuesta humana.
- Incorporar skills/grill-with-docs, grill-me, create-issue, assign-author, check-status, pull-changes, create-branch-from-staging, create-branch, create-empty-commit, commit-changes, launch-push, create-pr-base-staging, create-draft, link-pr-to-issue y assign-reviewers, cada una con SKILL.md válido, nombre, descripción y rutas de Jimena.
- Crear tools/check-status.ps1, pull-changes.ps1, create-branch-from-staging.ps1, create-branch.ps1, create-empty-commit.ps1, commit-changes.ps1 y launch-push.ps1. Compartir solo la infraestructura necesaria para comprobar comandos, repositorio y errores, evitando duplicarla.
- La infraestructura compartida queda en tools/git-common.ps1. Las comprobaciones reproducibles quedan en tools/tests/test-git-workflow.ps1 y test-git-safety.ps1; los resultados, en verification.md junto a esta spec.
- Crear templates/issues/basic_issue.md y templates/pull-request/basic-pull-request.md con cuerpos en español; títulos y mensajes de commit en inglés.
- Crear MCPS/github-mcp-server/mcp.txt con la referencia oficial existente y una guía docs/GIT-AUTOMATION.md sobre uso en PowerShell/VS Code/Codex, autenticación, permisos y comprobaciones pendientes. No almacenar tokens.
- Actualizar docs/TREE.md y docs/ARCHITECTURE.md para representar la automatización sin mover el código de negocio.
- No modificar logic/, queries/, db/, clients/, paquetes ni lockfile para implantar esta automatización. No hay firma de negocio ni SQL nuevos; los errores de Git se informan separados de los errores de la aplicación.

## Ejecución y seguridad de Git

Los scripts calculan su ubicación mediante PSScriptRoot y la raíz con git rev-parse. Usan argumentos separados, rutas literales, UTF-8 y comprobación explícita de LASTEXITCODE para comandos nativos; PowerShell 5.1 no garantiza que un fallo nativo provoque una excepción. Restauran el directorio y las variables temporales al terminar.

Antes de mutar, comprobar rama, índice, archivos sin seguimiento, operaciones en curso y destino. Actualizar staging únicamente con fast-forward. Si otra rama o worktree impide hacerlo, informar antes de resolver. Recuperar ramas existentes sin reemplazarlas; integrar staging solo con autorización aplicable y detenerse ante conflictos. Nunca reset --hard, clean, stash automático ni force push.

Usar --no-overwrite-ignore en cambios de rama y merges de avance rápido para proteger también los datos ignorados. Los commits automáticos se detienen ante hooks activos que puedan modificar su alcance; no los ejecutan ni desactivan sin revisión.

Para guardar archivos concretos o hacer un commit vacío, usar un índice temporal desde PowerShell, preservando el índice ajeno y restaurando GIT_INDEX_FILE incluso ante errores. Validar rutas y rechazar directorios, comodines que amplíen el alcance y opciones de incorporación masiva. Bloquear commits y publicaciones en main/staging y comprobar que la rama coincide con la autorizada para la tarea en curso, recibida como parámetro o contexto explícito.

Durante esta entrega no ejecutar los pasos de commit vacío, commit, push ni PR. El flujo habitual puede describirlos, pero la autorización de esta sesión prevalece. La rama jimena-duran-291020262 es una excepción expresamente solicitada al patrón habitual número-tipo-descripción; no renombrarla.

La restricción a jimena-duran-291020262 corresponde únicamente a esta entrega. No fijar ese nombre permanentemente en los scripts, agentes o skills reutilizables. La automatización debe permitir crear y usar otras ramas en futuras tareas, tomando la rama autorizada de los datos de cada tarea. Verificar ese comportamiento con nombres distintos en las pruebas aisladas.

## GitHub y MCP

Descubrir herramientas realmente disponibles y comprobar identidad y acceso antes de escribir. Preferir el MCP de GitHub si sus capacidades e identidad coinciden con la cuenta de Jimena. Conservar gh como alternativa documentada para este entorno cuando el MCP no sea suficiente o no corresponda a su cuenta; informar del motivo. No asumir que un enlace mcp.txt conecta el servicio ni sobrescribir conexiones existentes.

Buscar issues/PR existentes para evitar duplicados. create-pr es el único rol que abre la PR; retira el marcador `Closes #N` de la plantilla para que el orquestador escriba después una única referencia con el número real. Base staging, estado draft y asignación al usuario comprobado. Conservar el resto del cuerpo, sustituir la referencia anterior de la misma issue y usar `Closes #N`. Conservar y comprobar Development por separado; no afirmar que existe solo porque se añadió una línea. GitHub interpreta la palabra de cierre de una PR únicamente cuando apunta a la rama predeterminada: si esta es main, integrar en staging no cierra la issue. Al promover a la predeterminada, verificar que la PR o commit correspondiente conserve la referencia de cierre. No cerrar issues manualmente ni copiar llamadas GraphQL sin verificar su soporte.

## Capacidades y límites de Codex

En esta sesión existe la herramienta de delegación y ya se ha utilizado. Lanzar agentes reales con las instrucciones del rol, esperar su resultado antes del siguiente paso dependiente y evitar escritores concurrentes sobre los mismos archivos. Los archivos agents/*.md sirven como instrucciones explícitas; no registran por sí solos agentes personalizados.

La [documentación oficial de subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents) describe agentes personalizados TOML y permisos heredados. No introducir configuración global ni una sintaxis de otro cliente. Si una sesión carece de delegación, informar y detener el paso para acordar cómo continuar, sin simular agentes.

Las skills en skills/ se leen explícitamente por el flujo. La [documentación oficial de skills](https://learn.chatgpt.com/docs/build-skills) sitúa el descubrimiento local en .agents/skills según el directorio de inicio. No afirmar que skills/ se autodetecta. Documentar la lectura explícita como opción reproducible desde la raíz; cualquier instalación opcional debe conservar una fuente única y no sobrescribir skills ajenas. No cambiar configuraciones personales en esta entrega.

Un AGENTS.md no puede fijar la temperatura del modelo ni conceder permisos del sistema. La instrucción existente de temperatura se interpreta como precisión y ausencia de requisitos inventados. No prometer que todas las interfaces de Codex muestran o permiten lo mismo.

## Verificación después de autorizar tareas e implementación

1. Analizar sintácticamente todos los .ps1 con el parser de PowerShell y ejecutar las comprobaciones de lectura desde raíz y desde first-app, incluyendo una ruta con espacios.
2. Probar los scripts que mutan Git en un repositorio temporal aislado con remoto local: staging actualizado y divergente, ramas nuevas/existentes, cambios preparados y sin preparar, archivos sin seguimiento, commits selectivos/ vacíos, índices preservados y fallos nativos. Esos commits locales de prueba requieren que Jimena autorice expresamente esa verificación; nunca usar su repositorio o GitHub como banco de mutaciones.
3. Recorrer el orquestador con una petición controlada: comprobar delegación real, issue antes de spec, respuesta de preguntas y ambas pausas. Reutilizar #588; no crear nuevas issues ni publicar una PR de prueba. Las acciones remotas no autorizadas quedarán pendientes, sin presentarlas como verificadas.
4. Comprobar funciones y clientes existentes de usuarios: crear, consultar por id/email/nombre, listar, actualizar, borrar y contar por género, además del clasificador si tiene un comportamiento separado. Usar una copia temporal de la app y una base desechable, porque db/connection.js fija users.sqlite junto al módulo. No ejecutar ejemplos destructivos sobre la base personal.
5. Revisar que los notebooks y clientes conservan sus imports. Ejecutar sus comprobaciones disponibles; si Jupyter o su kernel no está accesible, indicar que su ejecución quedó pendiente.
6. Localizar pnpm sin instalarlo automáticamente; ejecutar pnpm format y pnpm lint conforme a AGENTS.md y revisar cualquier modificación de formato. No considerar pnpm test una validación: su script es un marcador que falla. Si una herramienta falta, informar del bloqueo antes de resolverlo.
7. Revisar git diff --check y el diff final: únicamente los archivos aprobados, sin datos locales, secretos, reorganización en src ni incorporación de Socket. Registrar cada comando ejecutado, resultado y limitación; no dar por probado lo que no se pudo ejecutar.

## Decisiones y aprobación

Jimena aprobó spec y plan con la aclaración de que la rama indicada corresponde solo a esta entrega y autorizó continuar con las tareas. El AGENTS.md local ya incluye el orden acordado. La adaptación de MCP/gh y la lectura explícita de skills conservan el funcionamiento en Codex. No se añadieron dependencias, por lo que no se activó la revisión de paquetes con Socket. Las reglas existentes de paquetes permanecen.

Tras revisar tasks.md, Jimena autorizó T01–T23, implementación y verificaciones aisladas. También autorizó instalar herramientas faltantes tras buscar las existentes; no fue necesario instalar ni descargar nada. La implementación no amplía la autorización a commit, push ni PR en el repositorio personal.
