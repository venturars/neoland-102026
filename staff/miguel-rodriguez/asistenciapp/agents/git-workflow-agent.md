# Orquestación de Git — asistenciapp

El agente principal carga estas instrucciones. No es otro subagente anidado.

## Entrada y estado

Lee AGENTS.md, la constitución y `skills/check-status/SKILL.md`. Ejecuta solo el momento solicitado de AsistenciApp: issue, draft, specs, implementación o acción sobre la PR. Dentro del momento no pidas confirmaciones repetidas. Si Miguel pide varios expresamente, ejecútalos en orden; una autorización global no resuelve dudas ni permite ampliar el alcance.

## Delegación y cinco momentos

Para responsabilidades Git delegadas, lanza subagentes reales secuenciales con las herramientas nativas de Codex. Entrega a cada uno su documento `agents/<nombre>.md`, petición, raíz app/Git, estado e identidad de tarea. Espera su resultado antes del siguiente paso. Leer el archivo no equivale a lanzar el agente. No requiere abrir Cursor; si falta delegación informa, sin simularla.

1. **Issue:** si falta concreción, lanza help-me-to-think, una pregunta cada vez. Con la tarea concreta lanza create-issue. No abre rama.
2. **Draft:** ejecuta pull-changes; lanza create-branch, create-commit para `chore: open #N`, launch-push y create-pr; después ejecuta link-pr-to-issue desde el principal. Todo parte de staging actualizado y la PR nace draft hacia staging. No escribir specs ni código.
3. **Specs:** prepara y revisa spec, plan y tasks en orden en la misma pasada, siguiendo AGENTS. No se requiere otro ok entre esos tres documentos. No implementar.
4. **Implementación:** ejecuta las tareas cubiertas por los documentos preparados, revisa y registra resultados reales. No hacer commits ni push.
5. **PR:** si se pide guardar/publicar, delega create-commit con archivos explícitos y launch-push. Si se pide revisión, usa assign-reviewers con los nombres de Miguel y las casillas realmente comprobadas. No cambies base, head o commits al pedir revisión. Si falta una comprobación necesaria, informa antes de sacar del draft. No hacer merge.

El principal ejecuta status, pull, enlace y revisores. Los roles no se invocan unos a otros. Si un paso falla, conserva lo realizado, informa y consulta el estado antes de reanudar.

## Reanudación y límites

Antes de repetir una operación, lee sus resultados existentes. Reutiliza la issue/PR inequívoca y la rama de la misma tarea; si la identidad es dudosa, pregunta. No dupliques el commit de apertura. No devuelvas una PR revisada a draft ni cambies su base. Un fallo parcial conserva lo ya hecho y detiene los pasos restantes; informa con precisión y consulta el estado antes de reintentar.

Todo el trabajo nuevo parte de staging actualizado y sus PRs apuntan a staging desde la creación. No encadenes tareas desde otra rama. Si hay otra tarea sin terminar, no abras una dependiente: informa y espera la decisión. No fuerces pushes, sobrescribas datos, limpies cambios ni guardes provisionalmente trabajo ajeno sin autorización. No cambies commits o base después de aprobaciones sin petición expresa. No prometas que GitHub mantendrá aprobaciones si cambia la comparación revisada.

No fusiones PRs, cierres issues ni borres ramas automáticamente. No se inicia un desarrollo posterior por terminar un momento. El enlace deja Closes #N y Development; no llama a la API para cerrar la issue. Consulta la rama predeterminada real: GitHub cierra la issue al fusionar la PR con el enlace de cierre en esa rama. Si es staging, el merge allí permite el cierre automático; no cambies la base staging ni la configuración para provocar el cierre. Antes de afirmar éxito, verifica la acción por lectura y devuelve número, URL, rama o commit según corresponda.

## Skills del principal

- skills/check-status/SKILL.md
- skills/pull-changes/SKILL.md
- skills/link-pr-to-issue/SKILL.md
- skills/assign-reviewers/SKILL.md

Las demás skills pertenecen a los agentes asignados. Conserva el SDD de cinco momentos, la constitución, la seguridad y las reglas de dependencias de AsistenciApp. No importes el SDD de first-app ni el de ChromaDB.
