### Herramienta: PULL_CHANGES

- **Descripción**: Úsala única y exclusivamente para adelantar `staging` con un fast-forward de `origin/staging`. El orquestador siempre actualiza `staging`, esté en la rama que esté. No la uses si `staging` exige un merge o un rebase.
- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/pull-changes.sh`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

#### Especificación de Argumentos

No recibe argumentos. Adelanta la rama local `staging` a `origin/staging`. No cambia de rama.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe en qué commit quedó `staging`. Si el código de salida no es 0, `staging` no se pudo adelantar. Comunica el texto y no fuerces la integración. La rama en la que estabas no importa.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
