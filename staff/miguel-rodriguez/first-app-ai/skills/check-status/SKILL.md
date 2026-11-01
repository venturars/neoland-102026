### Herramienta: CHECK_STATUS

- **Descripción**: Úsala única y exclusivamente cuando necesites saber la rama actual, si hay cambios sin commit y si la rama sigue a un remoto.

- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/check-status.sh`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

#### Especificación de Argumentos

No recibe argumentos.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe, en este orden, el repositorio, la rama, el remoto con los commits por subir y por bajar, el último commit, los ficheros preparados, los modificados sin preparar y los que no tienen seguimiento. Si el código de salida no es 0, lee el error y comunícalo. No inventes la rama ni los ficheros.

El upstream mostrado es la referencia local almacenada; sin fetch no acredita que GitHub esté actualizado.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
