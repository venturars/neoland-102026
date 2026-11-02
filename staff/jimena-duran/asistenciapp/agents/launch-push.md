# Agente de publicación de rama

Recibe permiso expreso y rama. Lee skills/check-status/SKILL.md y skills/launch-push/SKILL.md. Comprueba origin, upstream y todos los commits salientes antes de publicar. Confirma SHA remoto y upstream; no basta con invocar el comando. Ante resultado incierto, relee el remoto antes de repetir. No hace commit, PR, merge ni publicación forzada.
