### Herramienta: ASSIGN_REVIEWERS

- **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Resuelve el login dentro de este repositorio, asigna esos logins y sácala de draft. No la uses para asignar al autor.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: El número o la URL.
2. **Revisores** _(Obligatorio)_: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

- **Login**: Confirma `OWNER/REPO` y consulta primero `node staff/diego-molero/first-app/tools/reviewer-cache.js get OWNER/REPO "NOMBRE_1" "NOMBRE_2"` desde la raíz Git. El JSON devuelve un login por nombre o `null` si falta. Para un acierto utiliza el login guardado sin volver a buscarlo. La caché es persistente y específica del repositorio.
- **Caducidad**: Todos los alias vencen 48 horas después de comenzar el ciclo de la caché. La primera operación posterior al vencimiento vacía el JSON e inicia otro ciclo; `null` hace que el agente resuelva y guarde de nuevo los nombres necesarios. No se requiere un proceso en segundo plano ni se prolonga el ciclo al consultar o añadir un alias.
- **Ausencias**: Resuelve solo los nombres con login `null` dentro de este repositorio. Primero un colaborador cuyo login o nombre coincida. Si no coincide, el login de quien hace commits aquí con ese nombre o ese correo. No elijas un usuario público que no colabora. Guarda cada resultado inequívoco con `node staff/diego-molero/first-app/tools/reviewer-cache.js set OWNER/REPO "NOMBRE" LOGIN` antes de pedir revisión. Si hay varias personas posibles, pregunta cuál es; no guardes una suposición.
- **Correcciones**: Si la persona indica que una asociación cambió, usa `set OWNER/REPO "NOMBRE" LOGIN --replace`. Usa `remove OWNER/REPO "NOMBRE"` si pide olvidar la asociación. Un error transitorio de GitHub no demuestra que el login sea incorrecto: conserva la caché y comunica el fallo. Si GitHub confirma que el login guardado no puede revisar, comprueba la identidad con la persona y corrige la asociación explícitamente antes de reintentar.
- **Preparación**: Deduplica los logins resueltos y quita al autor antes de enviarlos a GitHub. La caché guarda nombres y logins, nunca credenciales.
- **Si no hay login de colaborador**: Dilo y no pidas la revisión de ese nombre.
- **Procesamiento de respuestas**: Quita al autor de la lista si aparece. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.

La identidad, la consulta previa para evitar duplicados, la alternativa oficial gh y la verificación posterior siguen `MCPS/github-mcp-server/mcp.txt`. Un formulario abierto no acredita una escritura; si el MCP no ejecuta, comprueba antes el estado y usa esa alternativa sin cambiar tokens ni configuración personal.
