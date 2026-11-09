# Plan — actualización del flujo Git

[Spec](spec.md) · Issue #1170.
Fuente: exercises/git-workflow-agent-template en staging 28382ae6.

## Integración

Incorporar tools/github-cache.mjs y su skill, las dos plantillas knowledge y
tools/create-pr-base-staging.sh. Adaptar rutas a staff/miguel-rodriguez/first-app-ai.
La caché usa la raíz Git ya ignorada y separa host/cuenta/repositorio durante
48 horas. Guarda alias, logins, nombres públicos y ETags; no tokens ni permisos.

create-pr resuelve identidades y pide revisión. El principal conserva estado,
pull y Development. assign-reviewers comprueba permisos en vivo, excluye autor,
deduplica y revisa evidencia. Crear PR usa staging/draft/assignee en una llamada
mediante MCP o gh con la misma cuenta. Una escritura incierta se consulta antes
de repetir y no se eluden confirmaciones ni rechazos de permisos.

Actualizar los mensajes de commit con asunto, desglose técnico y pie. Ampliar
knowledge en las validaciones locales de tipos y admitir ! en el mensaje.
Conservar las validaciones de rutas e índice de first-app-ai. AsistenciApp mantiene
su herramienta alternativa por compatibilidad; el flujo normal parte de staging.

Actualizar orquestador, create-pr, create-commit, skills afectadas, AGENTS, README
y arquitectura; en first-app-ai también TREE y eslint. Añadir
tests/git-workflow.test.mjs. No hay paquetes nuevos ni cambios de lockfile.

## Verificación

CA-01: tests de alias, contexto, TTL, ETag y paginación con API simulada.
CA-02/05: Git desechable para knowledge, commit con pie, archivo ajeno preparado y
rechazo de directorios. CA-04: gh simulado comprueba base/draft/assignee/body-file.
CA-03: cotejar agente y skill con el encargo de revisión y las guardas anteriores.
Ejecutar node --test tests/git-workflow.test.mjs, y los controles de cada app.
Registrar comandos y resultados en tasks.md.

## Comprobación de la constitución

Se mantiene la secuencia SDD y las reglas de dependencias de first-app-ai.
El encargo del 9 de noviembre cubre esta entrega completa. No se atribuyen
aprobaciones separadas de documentos ni se cambian los futuros momentos SDD.
