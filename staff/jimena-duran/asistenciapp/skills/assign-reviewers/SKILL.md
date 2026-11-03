### Herramienta: ASSIGN_REVIEWERS

- **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Resuelve el login dentro de este repositorio, sácala de draft, verifica que está lista para revisión y después solicita la revisión a esos logins. No la uses para asignar al autor.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: El número o la URL.
2. **Revisores** _(Obligatorio)_: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

- **Login**: Cada nombre se resuelve dentro de este repositorio. Primero un colaborador cuyo login o nombre coincida. Si no coincide, el login de quien hace commits aquí con ese nombre o ese correo. No elijas un usuario público que no colabora.
- **Si no hay login de colaborador**: Dilo y no pidas la revisión de ese nombre.
- **Orden de ejecución**: Con la solicitud de revisión autorizada y los logins validados, quita al autor de la lista. Si no quedan revisores válidos, detente sin cambiar el estado de la PR. Si está en draft, márcala primero como lista para revisión y verifica la transición antes de solicitar revisores. Si ya está lista, solicita directamente los revisores validados.
- **Procesamiento de respuestas**: Si falla la transición o su verificación, detente sin solicitar revisores. Si falla la solicitud, comunica el error y no marques la revisión como pedida; informa del estado real de la PR.
