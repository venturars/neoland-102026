---
name: create-draft
description: Comprueba o conserva el borrador autorizado.
---

# create-draft

La ejecuta agents/create-pr.md. Lee el estado y no repitas una transición ya aplicada. Si debe convertirse una PR existente a draft, usa MCP compatible o `gh pr ready $number --repo $repository --undo`. No la marques lista para revisión. Relee isDraft y base.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
