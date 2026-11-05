# Rondas de entrevista y mensajes de commit

Issue: #1022 · PR: #1023.
Autorización: Miguel pidió el 2026-11-04 terminar todo lo pendiente hasta dejar
las PRs en revisión y expresó «todo aprobado». Esta autorización conjunta permite
preparar estos documentos e implementar; no acredita revisiones individuales.

## Necesidad y comportamiento

Quien trabaja en first-app-ai necesita aclarar una tarea en rondas de preguntas,
conservar lo decidido y preparar el trabajo antes de editar. Los commits deben
permitir reconocer qué archivo o función cambió y cómo.

El subagente devuelve las preguntas necesarias con una recomendación para cada
una y termina. El principal espera las respuestas y vuelve a llamar con el
historial; un subagente nuevo recibe todas las preguntas y respuestas. Se
conservan las decisiones resueltas y se consultan las pendientes o nuevas.

Una issue escrita cuyo siguiente trabajo requiere cambios conduce a Empezar:
staging actualizado, rama, commit vacío, push, draft hacia staging y enlaces
antes de editar. Se mantienen el momento solicitado y las aprobaciones SDD.

El mensaje de un commit es una línea convencional en inglés que identifica el
archivo o función y el cambio. Por ejemplo, «docs: clarify interview rounds in
help-me-to-think.md». La apertura vacía conserva «chore: open #N».

## Aceptación

- Una ronda devuelve varias preguntas si hacen falta; el principal espera.
- La reanudación conserva respuestas, incluso al cambiar de subagente.
- Una respuesta disponible en el repositorio se consulta antes de preguntar.
- El trabajo sobre una issue existente prepara o reanuda Empezar antes de editar.
- Los mensajes concretos y la apertura vacía siguen sus reglas respectivas.
- La delegación nativa de Codex, rutas, MCP y protecciones de revisión se conservan.

Actualización documental, con recorridos de lectura que registran entrada,
decisión esperada y observada. Las instrucciones personales de Codex permanecen
fuera del proyecto.

Referencia consultada: template compartido en staging a076e268 y origin/staging
2c727db4, sin diferencias entre ambos para este alcance; novedades de #927, #923
y #892. Contraste con issue #1022 y documentos actuales de first-app-ai.
