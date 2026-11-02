---
name: create-issue
description: Registra o reutiliza la issue del primer momento.
---

# create-issue

La ejecuta agents/create-issue.md. Completa la plantilla del tipo de templates/issues/ o la más cercana. Identifica la cuenta autorizada y busca la tarea en todos los estados antes de crear. Con MCP compatible crea y asigna a esa cuenta; alternativa gh: `gh issue create --repo $repository --title $title --body-file $bodyPath --assignee $login`. El cuerpo es un archivo temporal UTF-8. Verifica número, título, asignación y URL. Devuelve el resultado y detente; no rama, spec ni publicación de código.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
