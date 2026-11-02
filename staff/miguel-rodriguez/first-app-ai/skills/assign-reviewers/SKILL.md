### Herramienta: ASSIGN_REVIEWERS

* **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Resuelve el login dentro de este repositorio, asigna esos logins y sácala de draft. No la uses para asignar al autor.
* **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`. No uses `gh` ni un script de `tools/`.

#### Especificación de Argumentos

1. **Pull request** *(Obligatorio)*: El número o la URL.
2. **Revisores** *(Obligatorio)*: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

* **Login**: Cada nombre se resuelve dentro de este repositorio. Primero un colaborador cuyo login o nombre coincida. Si no coincide, el login de quien hace commits aquí con ese nombre o ese correo. No elijas un usuario público que no colabora.
* **Si no hay login de colaborador**: Dilo y no pidas la revisión de ese nombre.
* **Procesamiento de respuestas**: Quita al autor de la lista si aparece. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.

Solo actúa con una petición expresa de revisión y nombres concretos. Si no puedes resolver todas las cuentas, devuelve la duda antes de enviar solicitudes. Tras un fallo parcial, informa de las solicitudes efectivamente hechas y del estado real de draft; no repitas las ya enviadas. No cambies head, base ni commits.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
