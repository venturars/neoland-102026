# Orquestación de Git — first-app-ai

El agente principal carga estas instrucciones. No es otro subagente anidado.

## Entrada y estado

Lee la petición y ejecuta `skills/check-status/SKILL.md`. Usa solo el momento solicitado: pensar, escribir la issue, empezar, guardar un trozo o pedir revisión. Una petición expresa autoriza sus pasos sin pedir un sí por cada paso. Mantén las confirmaciones de herramientas y las paradas SDD de AGENTS.md. Si falta un dato necesario, pregunta antes de seguir.

Elige el momento por el estado real de la tarea, no solo por las palabras del prompt. Antes de escribir una issue, comprueba que problema, resultado esperado, alcance y forma de verificar estén claros y sean coherentes con el proyecto; contrástalos con sus documentos cuando corresponda. Si está definida, explica brevemente qué información permite escribirla y pasa a create-issue. Si quedan dudas o contradicciones, pasa a help-me-to-think y espera la respuesta necesaria antes de publicar. Conserva las respuestas ya resueltas; pregunta por decisiones pendientes o nuevas cuando cambie el alcance o aparezcan otros datos necesarios.

## Delegación

En Codex, usa su herramienta nativa para lanzar subagentes reales secuenciales y entrega a cada uno el correspondiente documento `agents/<nombre>.md`. Las entradas `.cursor/agents/` son compatibilidad opcional, no un requisito de este entorno. No ejecutes tú la operación asignada a un subagente ni confundas leer su archivo con lanzarlo. Si el entorno no permite delegar, informa del bloqueo. Cada encargo incluye petición, raíz app/Git, estado y issue/PR correspondientes; recoge su resultado antes del siguiente paso.

- Pensar: lanza help-me-to-think. Si devuelve una pregunta, muéstrala a Miguel y espera su respuesta antes de otra invocación. Conserva las respuestas para el resumen final.
- Escribir: lanza create-issue con el resumen o la tarea ya concreta. No abras la rama automáticamente.
- Empezar, con issue existente: completa esta secuencia antes de editar el proyecto. Al reanudar, consulta lo ya completado según «Reanudación y límites»:
  1. Ejecuta la skill pull-changes para actualizar staging en fast-forward.
  2. Lanza create-branch desde staging actualizado.
  3. Lanza create-commit para la apertura vacía si aún no existe.
  4. Lanza launch-push.
  5. Lanza create-pr para abrir en draft hacia staging.
  6. Ejecuta link-pr-to-issue: cuerpo y Development, sin cerrar la issue.
- Guardar: lanza create-commit para los archivos elegidos; después launch-push. No incluyas archivos ajenos. Confirma antes que los cambios están verificados según AGENTS.md.
- Pedir revisión: Miguel debe nombrar revisores. Ejecuta assign-reviewers, excluyendo al autor. Comprueba las casillas según assign-reviewers y marca solo las verificadas al pedir revisión; si falta una comprobación necesaria, informa antes de pasar a revisión. Verifica solicitudes y salida de draft; no inventes usuarios ni resultados.

## Reanudación y límites

Antes de repetir una operación, lee sus resultados existentes. Reutiliza la issue/PR inequívoca y la rama de la misma tarea; si la identidad es dudosa, pregunta. No dupliques el commit de apertura. No devuelvas una PR revisada a draft ni cambies su base. Un fallo parcial conserva lo ya hecho y detiene los pasos restantes; informa con precisión y consulta el estado antes de reintentar.

Todo el trabajo nuevo parte de staging actualizado y sus PRs apuntan a staging desde la creación. No encadenes tareas desde otra rama. Si hay otra tarea sin terminar, no abras una dependiente: informa y espera la decisión. No fuerces pushes, sobrescribas datos, limpies cambios ni guardes provisionalmente trabajo ajeno sin autorización. No cambies commits o base después de aprobaciones sin petición expresa. No prometas que GitHub mantendrá aprobaciones si cambia la comparación revisada.

No fusiones PRs, cierres issues ni borres ramas automáticamente. No se inicia un desarrollo posterior por terminar un momento. El enlace deja Closes #N y Development; no llama a la API para cerrar la issue. Consulta la rama predeterminada real: GitHub cierra la issue al fusionar la PR con el enlace de cierre en esa rama. Si es staging, el merge allí permite el cierre automático; no cambies la base staging ni la configuración para provocar el cierre. Antes de afirmar éxito, verifica la acción por lectura y devuelve número, URL, rama o commit según corresponda.

## Skills del principal

- skills/check-status/SKILL.md
- skills/pull-changes/SKILL.md
- skills/link-pr-to-issue/SKILL.md
- skills/assign-reviewers/SKILL.md

Las demás skills pertenecen a los agentes asignados. Conserva las reglas SDD y Socket de esta app; este flujo no las sustituye.
