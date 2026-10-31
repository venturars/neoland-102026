# Plan — Actualizar el flujo de Git

Issue: #690.

Estado: borrador para revisión. Este plan no autoriza la implementación.

## Fuente

La fuente es el template compartido en `exercises/git-workflow-agent-template/`. Antes de copiar, se compara su versión vigente con la adaptación local para identificar las novedades que corresponden a esta tarea.

Todas las rutas de archivos de la aplicación que se citan a continuación son relativas a la raíz de `first-app`.

## Recorrido y contratos

Es una actualización de las herramientas e instrucciones de trabajo. No cambia ninguna capa ni el recorrido de datos de la aplicación. No hay entradas, salidas, contratos ni SQL nuevos en `src/logic/`.

## Plantillas

Se copian las doce plantillas del template, conservando sus nombres y contenido:

| Tipo       | Issue, dentro de `templates/issues/` | PR, dentro de `templates/pull-request/` |
| ---------- | ------------------------------------ | --------------------------------------- |
| `feat`     | `feat_issue.md`                      | `feat-pull-request.md`                  |
| `fix`      | `fix_issue.md`                       | `fix-pull-request.md`                   |
| `docs`     | `docs_issue.md`                      | `docs-pull-request.md`                  |
| `refactor` | `refactor_issue.md`                  | `refactor-pull-request.md`              |
| `test`     | `test_issue.md`                      | `test-pull-request.md`                  |
| `chore`    | `chore_issue.md`                     | `chore-pull-request.md`                 |

Se retiran `templates/issues/basic_issue.md` y `templates/pull-request/basic-pull-request.md` después de corregir sus referencias vigentes. Las specs anteriores conservan sus referencias históricas.

## Archivos existentes que se actualizan

Son trece archivos del template. Las correcciones de redacción se detallan en «Documentación». Se conserva la adaptación de las rutas necesarias:

| Responsabilidad                              | Archivos                                                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Elegir las plantillas y consultar sus reglas | `agents/create-issue.md`, `agents/create-pr.md`, `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md`                                                 |
| Crear ramas con las reglas del template      | `agents/create-branch.md`, `skills/create-branch/SKILL.md`, `skills/create-branch-from-staging/SKILL.md`, `tools/create-branch.sh`, `tools/create-branch-from-staging.sh` |
| Enlazar la issue con la regla nueva          | `agents/git-workflow-agent.md`, `skills/link-pr-to-issue/SKILL.md`                                                                                                        |
| Mantener las instrucciones de revisión       | `skills/assign-reviewers/SKILL.md`                                                                                                                                        |
| Documentar la conexión de GitHub             | `MCPS/github-mcp-server/mcp.txt`                                                                                                                                          |

Los dos scripts de ramas dejan de validar el tipo contra una lista fija, tal como hace el template. Conservan las demás comprobaciones y su permiso de ejecución.

## Adaptaciones que se conservan

Las siete skills que lanzan scripts conservan la ruta de `tools/` de la aplicación, relativa a la raíz del repositorio: `check-status`, `pull-changes`, `create-branch-from-staging`, `create-branch`, `create-empty-commit`, `commit-changes` y `launch-push`.

Cinco de ellas solo difieren del template por esa ruta y no requieren cambios. En las dos skills de ramas se actualizan las instrucciones y se conserva la ruta local.

`AGENTS.md` conserva las paradas SDD y añade la regla principal de redacción general. Las instrucciones usan roles y las guías del propio proyecto como referencia. Las specs anteriores mantienen sus requisitos y decisiones, con correcciones de redacción que eliminan referencias personales y comparaciones con otras copias.

## Enlace y conexión de GitHub

La skill de enlace incorpora `Closes #N` y la asociación en Development, sin llamar a una operación de cierre manual. Conserva la explicación de la diferencia entre `staging` y la rama predeterminada.

El documento del MCP incorpora el header `X-MCP-Features: mcp_apps_disable_form_deferral` y el ejemplo del template con un marcador de credencial. No se edita ningún `mcp.json` personal, no se introduce un token real y no se cambia la configuración del conector de Codex. El header documentado para Cursor no se considera una solución al error de permisos 403 observado en el conector de Codex.

La pull request conserva su enlace actual durante la revisión de estos documentos. La incorporación de la regla nueva a su descripción se comprueba después de implementar, siguiendo la skill actualizada.

## Documentación

- `AGENTS.md` fija la regla de redacción general y expresa la aprobación mediante el rol de la persona responsable, conservando las mismas paradas.
- Las specs anteriores solo reciben correcciones de redacción: se eliminan nombres y comparaciones con otras copias, se expresan las rutas respecto al proyecto y se sustituyen referencias concretas a ramas o commits por las guías correspondientes.
- `docs/TREE.md` sustituye las dos plantillas básicas por las doce nuevas y añade `docs/specs/update-git-workflow-template/` con estos tres documentos.
- `docs/ARCHITECTURE.md` actualiza las referencias a las plantillas, el enlace de issues y la finalidad del documento MCP. No cambia la descripción de las capas de la aplicación.
- Se revisa `docs/CONSTITUTION.md` al terminar y se registra si necesita ajustarse. Solo se modifica si el cambio deja alguna descripción vigente incorrecta, de acuerdo con su sección de sincronización.

## Paquetes y límites

No se añaden ni se cambian paquetes. No hace falta una validación nueva de Socket. No se modifican `src/`, `scripts/jupyter.sh`, `package.json`, el lockfile, AsistenciApp ni archivos ajenos a esta aplicación. Los requisitos y decisiones de las specs anteriores se conservan.

## Comprobación

1. Comparar agentes, skills, scripts, plantillas y MCP con el template compartido vigente. Al comparar las skills, normalizar solo el prefijo local de `tools/` para distinguir la adaptación de una diferencia pendiente.
2. Comprobar las doce plantillas y la ausencia de las dos básicas. Buscar referencias antiguas en las instrucciones y guías vigentes, excluyendo las specs históricas.
3. Comprobar sintaxis con `bash -n` y permisos de ejecución de los siete scripts. Ejecutar el script `tools/check-status.sh` con la ruta de la aplicación desde la raíz del repositorio.
4. Revisar las instrucciones de tipos, títulos, enlace y MCP. Revisar que `AGENTS.md` mantiene las paradas SDD. No crear ni cerrar issues, ramas o PR de prueba.
5. Ejecutar `pnpm format` y `pnpm lint` desde `first-app`, y `git diff --check`. Si el formato cambia archivos ajenos, separar esos cambios y conservar únicamente los de esta tarea, sin descartar los cambios previos.
6. Comprobar que la redacción no incluye nombres personales, carpetas de otras personas ni una rama o un commit concretos como punto de partida.
7. Revisar el diff final: solo incluye esta spec, las correcciones de redacción y los cambios previstos del flujo de Git y sus guías. Registrar los resultados reales; no dar por probada una integración externa que no se haya ejecutado.
