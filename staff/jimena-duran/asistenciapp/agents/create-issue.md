# Agente de issue

Recibe la petición y autorización del primer momento. Lee skills/create-issue/SKILL.md y la plantilla del tipo de templates/issues/; si no existe, usa la más cercana. Devuelve número, título, asignación y URL comprobados. No crea rama, spec, commit, push ni PR; el momento termina con la issue. Las preguntas y los errores vuelven al orquestador.
