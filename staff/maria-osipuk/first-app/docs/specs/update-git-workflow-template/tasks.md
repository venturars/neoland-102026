# Tareas — Actualizar el flujo de Git

Issue: #690.

Estado: pendientes. Se ejecutan después de que la persona responsable revise y autorice estos tres documentos.

## 1. Confirmar la fuente

Comparar el template compartido vigente con la adaptación local del proyecto.
Confirmar que se trabaja en la rama de la tarea y revisar el alcance; si hay novedades que lo cambien, ajustar el plan antes de copiar.

## 2. Incorporar las plantillas por tipo

Abrir `templates/issues/` y `templates/pull-request/`.
Copiar las doce plantillas indicadas en el plan y comprobar que están los seis tipos en ambas carpetas.

## 3. Actualizar la creación de issues

Abrir `agents/create-issue.md` y `skills/create-issue/SKILL.md`.
Incorporar las instrucciones del template y comprobar que consultan la plantilla del tipo.

## 4. Actualizar la creación de pull requests

Abrir `agents/create-pr.md` y `skills/create-pr-base-staging/SKILL.md`.
Incorporar las instrucciones del template y comprobar que conservan la base `staging` y la separación del enlace con la issue.

## 5. Actualizar las instrucciones de ramas

Abrir `agents/create-branch.md` y las skills `create-branch` y `create-branch-from-staging`.
Incorporar las reglas del template, conservando las rutas locales de los dos scripts.

## 6. Actualizar los scripts de ramas

Abrir `tools/create-branch.sh` y `tools/create-branch-from-staging.sh`.
Aplicar los cambios del template; comprobar con `bash -n` la sintaxis y conservar el permiso de ejecución.

## 7. Actualizar el enlace de issues

Abrir `agents/git-workflow-agent.md` y `skills/link-pr-to-issue/SKILL.md`.
Incorporar `Closes #N`, la asociación en Development y la explicación del cierre según la rama predeterminada.

## 8. Actualizar la documentación del MCP

Abrir `MCPS/github-mcp-server/mcp.txt`.
Incorporar las instrucciones del template con el marcador de credencial; no editar la configuración personal.

## 9. Actualizar las instrucciones de revisión

Abrir `skills/assign-reviewers/SKILL.md`.
Incorporar la versión del template y comprobar que sigue resolviendo los revisores dentro del repositorio.

## 10. Retirar las plantillas básicas

Buscar referencias en `agents/` y `skills/` y confirmar que usan las plantillas por tipo.
Eliminar esas dos plantillas; los requisitos de las specs históricas se conservan.

## 11. Actualizar el árbol

Abrir `docs/TREE.md`.
Sustituir las dos plantillas antiguas por las doce nuevas e incorporar la carpeta de esta spec.

## 12. Actualizar la arquitectura

Abrir `docs/ARCHITECTURE.md`, sección del flujo de Git y lista de ficheros.
Describir las plantillas por tipo, el enlace de issues y el documento MCP, conservando la descripción de las capas.

## 13. Comprobar rutas y scripts

Revisar las siete skills que lanzan scripts y confirmar sus rutas locales.
Comprobar sintaxis y permisos de los siete scripts, y ejecutar `tools/check-status.sh` desde la raíz del repositorio.

## 14. Aplicar formato y comprobar el proyecto

Desde `first-app`, ejecutar `pnpm format` y `pnpm lint`; ejecutar también `git diff --check`.
Revisar cualquier cambio de formato ajeno antes de conservarlo; no descartar los cambios previos.

## 15. Revisar y registrar el resultado

Comparar con el template según el plan; revisar las paradas SDD y la redacción general de las guías y specs.
Registrar las comprobaciones reales y las limitaciones, y comprobar que el diff solo incluye el alcance de #690.
