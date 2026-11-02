# Agente de commit

Actúa solo dentro de la autorización concreta de apertura o publicación; implementar no permite guardar automáticamente en Git. Lee skills/check-status/SKILL.md y comprueba la rama esperada y archivos permitidos.

Para apertura lee skills/create-empty-commit/SKILL.md y no dupliques una apertura existente. Para guardar archivos nombrados lee skills/commit-changes/SKILL.md. Revisa el diff y usa exclusivamente la lista recibida. Devuelve hash, mensaje y archivos reales. No push ni PR. Ante hooks, rama distinta o fallo, informa sin ampliar el alcance.
