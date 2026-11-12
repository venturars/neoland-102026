### Herramienta: LAUNCH_PUSH

- **Descripción**: Úsala única y exclusivamente para subir la rama actual a `origin` y fijar el upstream. No la uses para hacer commit. No la uses con force push.
- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/launch-push.sh`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

#### Especificación de Argumentos

No recibe argumentos. Equivale a `git push -u origin HEAD`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si el código de salida es 0, la rama ya está en el remoto. Si no es 0, comunica el rechazo. No vuelvas a lanzarla con `--force` ni con `-f`.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
