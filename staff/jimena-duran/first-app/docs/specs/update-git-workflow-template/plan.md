Issue: #741

# Plan de actualización de la automatización

Estado: spec, plan y T01–T12 aprobados; implementación y comprobaciones completadas. Commit selectivo, push y PR draft contra staging autorizados; publicación pendiente. Sin revisores ni merge. Resultados en [verification.md](verification.md).

## Estado inicial: base y diferencias detectadas

Fuente: `exercises/git-workflow-agent-template` en `origin/staging` fijado en `ddbf024a`; última modificación del template: `25208d23`. Rama exclusiva: `741-chore-update-git-workflow-template`, desde staging actualizado por fast-forward.

La comparación inicial detectó tres diferencias: faltaban las doce plantillas por tipo; agentes y skills seleccionaban las dos básicas; las reglas editoriales y la lista fija de tipos de rama seguían repetidas fuera de las plantillas. Estas diferencias ya están resueltas por T01–T12. Las protecciones locales y la gestión de MCP, gh, Development y cierre de issues se conservan.

## Cambios propuestos

Rutas relativas a first-app:

- Incorporar desde la fuente `templates/issues/{feat,fix,docs,refactor,test,chore}_issue.md` y `templates/pull-request/{feat,fix,docs,refactor,test,chore}-pull-request.md`. Retirar `basic_issue.md` y `basic-pull-request.md` tras sustituir sus referencias operativas. Conservar las instrucciones editoriales en los comentarios de las plantillas.
- Ajustar `agents/create-issue.md`, `agents/create-pr.md`, `agents/create-branch.md` y las skills `create-issue`, `create-pr-base-staging`, `create-branch-from-staging` y `create-branch`: seleccionar la plantilla del tipo; si no tiene plantilla, usar la más cercana. La PR conserva el título de la issue.
- Actualizar `skills/link-pr-to-issue/SKILL.md` para referirse a la plantilla seleccionada. Adaptar el marcador del template `Closes #` a la retirada previa al alta del draft y su sustitución posterior por una única línea real del orquestador. Mantener la comprobación independiente de Development y las condiciones de cierre según la rama predeterminada.
- En `tools/git-common.ps1`, eliminar la lista fija de tipos de `Get-TaskBranchName`, sin sustituirla por una comprobación obligatoria de plantillas existentes. Conservar validación del número, descripción, referencia Git, ramas protegidas y nombre explícito autorizado. Los scripts de ramas siguen usando esta función compartida, sin validaciones duplicadas.
- Ajustar las referencias de `AGENTS.md`, `docs/GIT-AUTOMATION.md`, `docs/TREE.md` y `docs/ARCHITECTURE.md` solo donde sea necesario para describir las plantillas y su selección. No reescribir specs anteriores ni evidencias históricas. Mantener la regla independiente de mensajes de commit convencionales.

Referencia de implementación: los agentes y scripts PowerShell existentes. No incorporar Bash ni cambiar conexiones MCP, credenciales o configuración personal. Se mantienen avance rápido, `--no-overwrite-ignore`, índice temporal, bloqueo ante hooks, consulta remota antes de reintentos y prohibiciones de descarte o publicación forzada. No hay paquetes, firmas de negocio, SQL ni errores nuevos de la aplicación.

## Verificación propuesta tras autorizar implementación

- Comparar las doce plantillas con la fuente y buscar referencias operativas a las básicas; revisar selección para los seis tipos y un tipo sin plantilla, sin crear recursos remotos.
- Recorrer en lectura la preparación de issue, rama y draft: selección de plantilla, secciones, casillas, retirada del marcador y enlace posterior sin duplicados; comprobar las pausas humanas y autorizaciones.
- Analizar sintaxis PowerShell y comprobar la eliminación de la lista fija de tipos sin introducir una comprobación obligatoria de plantillas; revisar que se conservan las validaciones de seguridad de Git. Sin commits ni publicaciones de prueba. No repetir las suites históricas de Git o de usuarios.
- Revisar formato solo de archivos afectados, lint aplicable y `git diff --check`; confirmar que el diff se limita al alcance y que los datos locales siguen conservados. Registrar únicamente los resultados de esta actualización.

## Criterio de precedencia y aprobación

Las pausas del SDD y las protecciones de first-app prevalecen sobre cualquier automatismo del template. Se aprobaron spec y plan y después T01–T12 con autorización de implementación y comprobaciones. También se autorizó el commit selectivo, push y apertura de una PR draft contra staging, sin revisores ni merge. La publicación debe releerse y documentarse tras completarla.
