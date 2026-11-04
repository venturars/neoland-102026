# First app AI

Aplicación local de contactos. Los nueve documentos de Jupyter permiten ejecutar sus operaciones y leer los resultados desde el navegador.

## Arrancar los datos

Desde esta carpeta, con las dependencias del proyecto disponibles:

```sh
pnpm server
```

Deja esa terminal abierta. El servicio escucha en `http://127.0.0.1:3000` y abre
`src/db/users.sqlite`; la tabla se prepara explícitamente en el primer notebook
o con el ejemplo Terminal de inicialización. Terminal y Jupyter utilizan esos
mismos datos. El servicio es local y no tiene autenticación.

En otra terminal puedes usar los ejemplos de `src/clients/terminal/` o abrir Jupyter.

## Abrir el cliente web

Con `pnpm server` en ejecución, prepara la tabla una vez desde otra terminal:

```sh
node --input-type=module -e 'import { createUsersTable } from "./src/queries/users.js"; await createUsersTable();'
```

Después ejecuta:

```sh
pnpm web
```

El comando abre `src/clients/web/index.html` como archivo en Chrome/Chromium,
con permiso para cargar sus módulos locales y un perfil temporal separado.
Selecciona tu ID, modifica nombre/email
o vuelve sin guardar. Para eliminar, escribe el email guardado que muestra la
confirmación. Notas queda como opción futura.

La web usa los mismos contactos que Terminal y Jupyter. No crea ejemplos; una
base vacía muestra una lista vacía. Para añadir contactos usa la operación de
creación de Terminal o Jupyter. Repetir la preparación conserva los contactos.
Los errores de nombre/email aparecen junto al campo; los fallos de conexión
permiten reintentar. Pulsa Ctrl+C en la terminal de `pnpm web` para cerrar el
cliente y eliminar su perfil temporal. El servidor de datos sigue
en su propia terminal.

El lanzador busca Chrome en las ubicaciones habituales de macOS/Windows y
Chrome/Chromium en PATH en Linux. Si está en otra ubicación, configura `CHROME_BIN`
con la ruta de su ejecutable. La apertura y el recorrido se verificaron en macOS.
Abrir el HTML con doble clic en una sesión normal puede bloquear los módulos.

## Abrir Jupyter

Requisitos: Node compatible con `node:sqlite` (`24.12.0` verificado), pnpm y Python 3.10 o posterior. En Windows, Python debe estar disponible mediante `py -3`.

Desde esta carpeta:

```sh
pnpm jupyter
```

El primer arranque instala las dependencias del cliente y prepara `.venv/` con Notebook. Los siguientes reutilizan ese entorno. Se abre **Jupyter Notebook**, con nueve documentos en `src/clients/jupyter/` y el kernel **First app AI**.

Si preparas dependencias por separado, usa `pnpm install --frozen-lockfile`. No hace falta instalar Jupyter globalmente. El servidor escucha solo en el equipo local y conserva la autenticación de Jupyter.

## Probar las operaciones

1. Abre **01-create-users-table** y ejecuta su celda con **Shift+Enter**.
2. Abre **02-create-user**, cambia nombre y email, ejecuta y anota el ID devuelto.
3. Usa los documentos 03–06 para listar o buscar. En la búsqueda por ID sustituye `None` por el ID real.
4. En 07 puedes actualizar ese contacto. Los campos omitidos se conservan.
5. En 08 elimina únicamente un contacto desechable: el borrado es permanente.
6. En 09 consulta las categorías estimadas por nombre. Con contactos necesita Ollama local activo y `llama3.2` ya disponible; con tabla vacía devuelve ceros sin llamar al modelo.

Cada documento funciona tras **Kernel → Restart Kernel**; no necesita variables de otro notebook. Sí necesita los datos que se preparan explícitamente en 01 y 02. Un error muestra el mensaje de la operación, sin una tabla de éxito.

## Datos y parada

Preparar, crear, actualizar y eliminar trabajan sobre **`src/db/users.sqlite` de esta copia**. Las consultas conservan los contactos y las fechas. Para experimentar, copia el proyecto sin su base de datos y usa datos ficticios en esa copia.

Para parar el servicio de datos pulsa **Ctrl+C** en su terminal. Para parar Notebook vuelve a la terminal y pulsa **Ctrl+C**; confirma la parada si Jupyter lo solicita. Cerrar una pestaña no para el servidor.

Los ejemplos anteriores siguen disponibles en `src/clients/terminal/`. Las reglas están en [la constitución](docs/CONSTITUTIONS.md) y la verificación del cliente en [las tareas](docs/specs/jupyter-client/tasks.md).

## Trabajo con IA y Git

Trabaja sobre esta carpeta first-app-ai en Codex. Git pertenece al repositorio NEOLAND que la contiene: no ejecutes git init aquí.

Puedes pedir pensar una tarea, dejarla escrita como issue, empezarla, guardar un trozo o pedir revisión indicando personas. [El flujo](agents/git-workflow-agent.md) coordina las acciones y lanza los seis subagentes con las herramientas nativas de Codex, entregando a cada uno su documento de agents/. Git usa staging actualizado y las PRs nacen en draft hacia staging. La spec, el plan y las tareas requieren aprobaciones separadas antes de implementar.

Comprueba una invocación real de help-me-to-think: debe existir un encargo separado y un resultado, no solo lectura del documento en la conversación principal. Verifica por lectura la cuenta autenticada y el acceso al repositorio con el MCP GitHub del entorno activo. `MCPS/github-mcp-server/mcp.txt` es una referencia pública; no instala el servidor ni contiene credenciales.

Reutiliza la conexión existente. Configura la escritura directa según [la referencia MCP](MCPS/github-mcp-server/mcp.txt): header X-MCP-Features en remoto o --features en el servidor local de Codex. Recarga la conexión después del cambio; no des por probada la escritura hasta verificar su resultado. Si falla, identifica el error y acuerda el cambio concreto antes de modificar autenticación. Los tokens permanecen en configuración local, fuera de Git, comandos y capturas. Una confirmación inaccesible detiene la operación; el agente no desactiva controles ni sustituye el MCP silenciosamente por otro cliente.

Las entradas `.cursor/agents/` se conservan como compatibilidad opcional. Requieren abrir esta app como proyecto en Cursor y verificar su propio entorno; el resultado de Codex no acredita ejecución allí. No son necesarias para usar el flujo en Codex.

Las verificaciones y pendientes están en [las tareas de Git](docs/specs/git-workflow-automation/tasks.md). Las solicitudes de revisión van después de publicar los cambios finales; después no se cambian commits ni base sin petición expresa.

## Cliente REST y Postman

Prepara la tabla de esta copia y deja `pnpm server` abierto. En otra terminal:

```sh
pnpm http
```

El cliente escucha en http://127.0.0.1:3001. En Postman usa Body → raw → JSON
para POST y PATCH, con Content-Type: application/json.

| Petición | Body | Respuesta |
| --- | --- | --- |
| POST /users | {"name":"Ada","email":"ada@example.com"} | 201, usuario |
| GET /users | — | 200, lista |
| GET /users/ID | — | 200, usuario |
| PATCH /users/ID | {"name":"Ada Lovelace"} | 200, usuario modificado |
| DELETE /users/ID | — | 204, cuerpo vacío |

Sustituye ID por el recibido al crear. PATCH conserva los campos omitidos.
Los errores devuelven JSON con message: 400 para nombre/email inválido, 409
para email ocupado, 404 para usuario inexistente y 500 para fallos de datos.
Una ruta desconocida devuelve 404 vacío; JSON mal formado, 400 vacío.

Usa datos desechables para borrar. Terminal, Jupyter, web y REST comparten los
contactos. Ctrl+C detiene cada servicio desde su propia terminal. El cliente REST
no sirve la página web.
