# Comprobar la tarea antes de avanzar en el workflow

Issue: [#893](https://github.com/venturars/neoland-102026/issues/893) ·
PR: [#897](https://github.com/venturars/neoland-102026/pull/897).
Estado: aprobada por Miguel el 2026-11-04.

## Propósito

Miguel necesita que el workflow de first-app-ai compruebe qué está resuelto y qué
falta antes de publicar una tarea. Una petición como «crea la issue» debe pasar
por esa comprobación; una tarea ya definida debe avanzar sin repetir preguntas.

## Comportamiento esperado

La entrada es la petición, el estado del trabajo y las decisiones disponibles.
Antes de escribir una issue, el workflow comprueba que problema, resultado
esperado, alcance y forma de verificar están claros y son coherentes con el
proyecto. Cuando dependen del repositorio, contrasta sus documentos.

Si la tarea está definida, pasa a escribirla y explica brevemente qué información
lo permite. Si faltan decisiones o hay contradicciones, solicita la aclaración
necesaria y espera la respuesta antes de publicar. Conserva las respuestas de
entrevistas anteriores; vuelve a preguntar cuando cambia el alcance o aparece
una decisión nueva. Para cualquier otro momento, pide los datos necesarios que
todavía falten antes de continuar.

Al empezar una tarea nueva, completa la preparación antes de editar el proyecto:
issue existente, staging actualizado, rama nueva, commit de apertura, push,
PR draft hacia staging y enlace con la issue en el cuerpo y Development.
Al reanudar la misma tarea, utiliza sus recursos existentes y evita duplicarlos.

## Criterios de aceptación

- **CA-01:** Una tarea definida avanza a escritura con una explicación breve
  basada en la información disponible. La redacción del prompt por sí sola no
  acredita que esté definida.
- **CA-02:** Una tarea ambigua o contradictoria devuelve la pregunta necesaria
  antes de publicar. Reanudar una entrevista conserva lo ya resuelto y consulta
  únicamente las decisiones pendientes o nuevas.
- **CA-03:** La apertura exige el orden descrito antes de editar el proyecto.
  Una reanudación reconoce lo ya completado.
- **CA-04:** Se conservan la delegación nativa de Codex, las aprobaciones separadas
  de spec, plan y tareas, el acceso MCP, las rutas de la app y las protecciones de
  revisión existentes. El inventario y las responsabilidades documentadas reflejan
  los documentos añadidos. Formato y lint pasan al finalizar.

## Comprobación

Recorrer una tarea definida, una ambigua o contradictoria, una entrevista
reanudada y el inicio de una tarea. Registrar en cada caso la entrada, la decisión
esperada y la observada, sin crear recursos de prueba en GitHub. Revisar el diff
completo junto con las comprobaciones finales.

## Alcance y referencias

Actualización documental del workflow de first-app-ai. Los scripts, skills,
plantillas y comportamiento de la aplicación se conservan.

Fuentes revisadas el 2026-11-04: issue #893; instrucciones y constitución de la
app; template `exercises/git-workflow-agent-template/agents/git-workflow-agent.md`
en `b2a9e6b8f3582181a513f89766dce34aace227a2`; transcripción del 3 de noviembre,
aclaración sobre tareas definidas, preguntas necesarias y entrevistas resueltas.
