---
name: launch-push
description: Publica exclusivamente la rama autorizada sin fuerza.
---

# launch-push

La ejecuta agents/launch-push.md con permiso expreso. Desde AsistenciApp: `& .\tools\launch-push.ps1 -ExpectedBranch $branchName`. Comprueba origin y commits salientes, bloquea main/staging y ramas distintas, no usa force. Verifica upstream y SHA con lectura remota; ante resultado incierto consulta antes de repetir. No crea commit ni PR.
