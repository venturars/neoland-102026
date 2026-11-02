---
name: create-pr-base-staging
description: Abre o reutiliza una PR draft contra staging.
---

# create-pr-base-staging

La ejecuta agents/create-pr.md con rama publicada y permiso expreso. Usa el título de la issue y la plantilla del tipo de templates/pull-request/ o la más cercana. Sigue sus comentarios; retira la línea Closes # y deja Issue vacía al crear. Busca primero PR de la rama en todos los estados; una cerrada o base diferente requiere informar. Alternativa gh: `gh pr create --repo $repository --head $branchName --base staging --draft --title $title --body-file $bodyPath`. Verifica base, rama, draft y URL; conserva enlaces ajenos si actualizas una existente. No asigna revisores ni enlaza la issue.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
