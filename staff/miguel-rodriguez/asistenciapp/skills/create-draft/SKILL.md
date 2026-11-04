### Herramienta: CREATE_DRAFT

Comprueba mediante GitHub MCP el estado de la PR recién abierta para esta tarea. La referencia pública del servidor está en `MCPS/github-mcp-server/mcp.txt`.

Entrada: número o URL de PR, repositorio y contexto de apertura/reanudación.

- Si está en draft, no escribas nada.
- Si falta la PR, informa del error; esta skill no la crea.
- Si una PR existente ya está lista para revisión, no la devuelvas a draft al reanudar. Informa del estado y conserva las revisiones.
- Una conversión explícitamente solicitada requiere comprobar sus efectos y permisos; no está autorizada por el mero hecho de reanudar.
- Si faltan permisos o una confirmación accesible, comunica el bloqueo y no declares completado el paso.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
