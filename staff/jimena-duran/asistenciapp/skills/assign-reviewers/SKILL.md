---
name: assign-reviewers
description: Solicita revisión solo a las personas expresamente indicadas.
---

# assign-reviewers

La ejecuta el orquestador en el quinto momento autorizado. Resuelve identidades y acceso dentro del repositorio, excluye a la autora y conserva revisores existentes. Si no puedes verificar una cuenta, informa antes de asignar. Alternativa gh: `gh pr edit $number --repo $repository --add-reviewer $reviewerLogin`. Solo tras completar las asignaciones autorizadas, y si se pidió revisión, usa la operación compatible o `gh pr ready $number --repo $repository`. Relee revisores y draft por separado. No merge.

Lee docs/GIT-AUTOMATION.md: identidad, repositorio, autorizaciones y relectura del estado remoto antes de reintentar. Prefiere MCP compatible; si no sirve, explica el motivo y usa gh autenticado sin cambiar credenciales. No imprimas secretos ni inventes resultados.
