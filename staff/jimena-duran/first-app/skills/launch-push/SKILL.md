---
name: launch-push
description: Publica la rama autorizada en origin y configura su upstream sin force push.
---

# Publicar una rama

La ejecuta `agents/launch-push.md` cuando Jimena autoriza publicar. Un commit o la aprobación de tareas no implica por sí solo autorización de push. Comprueba rama, remoto, upstream y commits salientes antes de ejecutar.

Desde la raíz:

```powershell
& .\staff\jimena-duran\first-app\tools\launch-push.ps1 -ExpectedBranch $branchName
```

Desde `first-app`, usa `& .\tools\launch-push.ps1` con la rama recibida de esta tarea. Nunca publiques main, staging ni una rama distinta; no hay nombre personal permanente en el script.

No uses `--force` ni `--force-with-lease`. Un rechazo o problema de autenticación se informa antes de resolverlo; no reescribas historial para conseguir publicar. Devuelve la rama remota y upstream comprobados. No crea PR. Si la entrega actual prohíbe push, este paso se omite y queda pendiente.
