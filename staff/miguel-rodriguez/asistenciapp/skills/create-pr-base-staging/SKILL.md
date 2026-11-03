### Herramienta: CREATE_PR_BASE_STAGING

- **Descripción**: Úsala desde el agente `create-pr` para abrir la pull request con base `staging`. No la uses para enlazar la issue: eso es `link-pr-to-issue`. Abre la PR directamente con draft=true si la herramienta lo permite; create-draft verifica ese estado. Si no permite abrir en draft, detente antes de crear y comunica el bloqueo.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`. No uses `gh` ni un script de `tools/`.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a esta plantilla. La base es `staging` y la descripción va en español.

#### Especificación de Argumentos

1. **Base** _(Obligatorio)_: `staging`.
2. **Cabeza** _(Obligatorio)_: La rama que acaba de subirse.
3. **Título** _(Obligatorio)_: Sigue las reglas editoriales de la plantilla de PR elegida.
4. **Cuerpo** _(Obligatorio)_: Usa templates/pull-request/<tipo>-pull-request.md y conserva sus secciones y comprobaciones. Si falta una plantilla específica, usa la más cercana al propósito sin convertir el tipo recibido ni renombrar ramas. La sección Issue se deja vacía para el principal y las casillas sin marcar mientras esté en draft.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si ya hay una pull request de esa rama hacia `staging`, comprueba su identidad y devuelve esa sin duplicarla. No actualices cuerpo o estado después de aprobaciones sin petición expresa. Devuelve la URL. Si el MCP falla, comunica el error y no inventes el enlace.

Comprueba por lectura repositorio, head, base, draft y asignación. El cuerpo distingue el trabajo ya presente del alcance previsto y pendiente en el draft; no afirma cambios o verificaciones que aún no existen. No cambies nunca la base de una PR existente; una base distinta es un bloqueo que se comunica. Tras un fallo, consulta el estado antes de repetir una creación.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
