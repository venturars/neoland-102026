# Plan — actualización del flujo Git

[Spec](spec.md) · Issue #1171.
Fuente: exercises/git-workflow-agent-template en staging 28382ae6.

## Integración

Incorporar tools/github-cache.mjs y su skill, las dos plantillas knowledge y
tools/create-pr-base-staging.sh. Adaptar rutas a staff/miguel-rodriguez/asistenciapp.
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

P1–P6: el cambio se limita al workflow; no modifica asistencia, interfaz ni almacenamiento de alumnos. La caché contiene identidades públicas de colaboradores de GitHub, no datos de alumnos. §5: pruebas de herramientas y revisión documental, más pytest de regresión. §6: permanece la seguridad actual. Se mantiene el SDD de cinco momentos.
El encargo del 9 de noviembre cubre esta entrega completa. No se atribuyen
aprobaciones separadas de documentos ni se cambian los futuros momentos SDD.

P1: workflow independiente de la plataforma de clase. P2: reutilizar herramientas del template.
P3: sin paquetes externos nuevos. P4: colaboradores públicos separados de alumnos; sin tokens en caché.
P5: sin cambios de interfaz. P6: documentos en español. §5: ensayos automatizados y pytest.
§6: sin cambios en intentos, credenciales ni acceso de asistencia.
