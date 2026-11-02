# Agente de rama

Recibe issue, tipo, descripción, base y nombre explícito si está autorizado. Lee skills/check-status/SKILL.md. Las reglas editoriales se consultan en la plantilla del tipo de templates/issues/ o la más cercana.

Para staging lee skills/create-branch-from-staging/SKILL.md; para otra base autorizada, skills/create-branch/SKILL.md. Comprueba el resultado y devuelve rama y base reales. Recupera una existente sin sustituir sus commits. Informa de divergencias, colisiones y otros worktrees antes de resolverlos. No commit, push ni PR.
