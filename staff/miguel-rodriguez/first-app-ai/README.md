# First app AI

Aplicación local de contactos con clientes web, Jupyter, Terminal, VS Code,
Electron, Chrome y APIs HTTP. Todos utilizan las mismas operaciones y datos.

## Arrancar los datos

Desde esta carpeta, con Node compatible con `node:sqlite` y pnpm:

```sh
pnpm install --frozen-lockfile
pnpm server
```

Deja esa terminal abierta. El servicio escucha en `http://127.0.0.1:3000` y abre
`src/db/users.sqlite`; la tabla se prepara explícitamente en el primer notebook
o con el ejemplo Terminal de inicialización. Terminal y Jupyter utilizan esos
mismos datos. El servicio es local y no tiene autenticación.

Con el servicio en marcha, prepara la tabla desde otra terminal:

```sh
node --input-type=module -e 'import { createUsersTable } from "./src/queries/users.js"; await createUsersTable();'
```

Repetir la preparación conserva los contactos. Deja el servicio abierto mientras
usas los clientes. Cada API se inicia en otra terminal:

| Cliente | Comando | Dirección |
| --- | --- | --- |
| Web | `pnpm web` | Archivo HTML en Chrome/Chromium |
| Escritorio | `pnpm electron` | Ventana de Electron |
| Chrome | `pnpm chrome` | API del popup en `http://127.0.0.1:3002` |
| Express | `pnpm http` | `http://127.0.0.1:3001` |

`pnpm-workspace.yaml` conserva una excepción de antigüedad de publicación solo para
`electron@45.2.2`, la versión revisada. pnpm mantiene el
lockfile; no se desactiva el control de antigüedad para otros paquetes.

El cliente Nest ofrece las cinco operaciones CRUD y una página Swagger UI.

## Elegir al azar

Con el servicio de datos iniciado (`pnpm server`) y la tabla inicializada, abre
el cliente con `pnpm web` y pulsa «Elegir al azar». El resultado muestra nombre,
ID y email sin cambiar quién eres. Cada sorteo consulta los contactos guardados
y permite que vuelva a salir la misma persona.

Para usarlo desde terminal, copia y ejecuta
[src/clients/terminal/pick-random-user.txt](src/clients/terminal/pick-random-user.txt).
Sin contactos muestra un mensaje de lista vacía; si falla la recuperación,
comunica el error.

## Abrir el cliente web

Ejecuta `pnpm web` con el servicio de datos en marcha. El resumen por nombre
usa la misma operación compartida y consulta Ollama directamente.

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

## Abrir el cliente de VS Code

Para abrir o volver a abrir el cliente:

1. Desde `first-app-ai`, inicia `pnpm server` si el servicio no está en marcha. Prepara la tabla como se indica arriba si todavía no existe; repetir la preparación conserva los contactos.
2. Ejecuta `pnpm vscode` con VS Code 1.142.0 o posterior y el comando `code` disponible.
3. En la ventana de desarrollo, abre **Usuarios** en **Explorer**. El comando **First App: Open Users** también enfoca esa vista.

Cerrar VS Code no detiene el servicio de datos. Para detenerlo, pulsa **Ctrl+C**
en su terminal. Usa una copia y contactos ficticios para experimentar.

## Abrir Electron

La primera vez, prepara el ejecutable de la versión instalada:

```sh
node node_modules/electron/install.js
```

Con los datos preparados, ejecuta `pnpm electron`. Abre una ventana propia para
crear, seleccionar, buscar por ID, editar y eliminar contactos. El borrado pide
el email guardado. El resumen usa la misma clasificación que Jupyter.

Electron llama a las operaciones desde los módulos de su renderer; no necesita las
APIs Express o Fastify. Cierra la aplicación con **Salir/Quit**; en macOS
cerrar solo la ventana conserva la aplicación y puedes reabrirla desde el Dock.

## Cargar la extensión de Chrome

1. Con el servicio de datos abierto, ejecuta `pnpm chrome` para iniciar su API Fastify.
2. Abre `chrome://extensions`, activa **Modo de desarrollador** y elige **Cargar descomprimida**.
3. Selecciona `src/clients/chrome/` y abre **First App · Contactos** desde el menú de extensiones.

El popup permite crear, seleccionar, buscar por ID, editar, confirmar el borrado
por email y consultar el resumen. Solo solicita acceso a su API local en el
puerto 3002. Al cerrar el popup, los contactos siguen guardados. **Ctrl+C**
detiene Fastify desde su terminal; el servicio de datos se detiene por separado.

## Consultar el resumen por nombre

Web, VS Code, Electron y Chrome tienen un botón de resumen. Las dos APIs
ofrecen `GET /users/gender-count`. El resultado contiene `women`, `men` y
`genderUndefined`: son estimaciones por nombre, no identidades verificadas.

Una tabla vacía devuelve tres ceros sin modelo. Con contactos se necesita Ollama
local en `http://127.0.0.1:11434/v1` y `llama3.2` disponible. Si falla, se muestra
`Could not classify the users`; no se devuelve un conteo parcial ni se modifican
los datos. La web importa la operación compartida; no necesita Express para
consultar el resumen. Usa el lanzador `pnpm web`, cuyo origen file:// debe estar
permitido por Ollama. Si otra instalación lo bloquea, revisa OLLAMA_ORIGINS para
ese origen local concreto antes de reiniciar tu servicio.

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

Express escucha en `http://127.0.0.1:3001`. Fastify ofrece las mismas
rutas en `http://127.0.0.1:3002`. En Postman usa **Body → raw → JSON** para POST y
PATCH, con `Content-Type: application/json`.

| Petición | Body | Respuesta |
| --- | --- | --- |
| POST /users | {"name":"Ada","email":"ada@example.com"} | 201, usuario |
| GET /users | — | 200, lista |
| GET /users/gender-count | — | 200, tres conteos |
| GET /users/ID | — | 200, usuario |
| PATCH /users/ID | {"name":"Ada Lovelace"} | 200, usuario modificado |
| DELETE /users/ID | — | 204, cuerpo vacío |

Sustituye ID por el recibido al crear. PATCH conserva los campos omitidos.
Los errores devuelven JSON con message: 400 para nombre/email inválido, 409
para email ocupado, 404 para usuario inexistente y 500 para fallos de datos.
En Express, una ruta desconocida devuelve 404 vacío; JSON mal formado, 400 vacío.

Usa datos desechables para borrar. Todos los clientes comparten los contactos.
**Ctrl+C** detiene cada API desde su propia terminal. Las APIs no sirven la
página web; esta se abre con `pnpm web`.


Los campos vacíos al modificar conservan el valor guardado en Electron, Chrome
y VS Code. Electron carga lógica desde su renderer. Para VS Code, ejecuta
`pnpm vscode` con el comando `code` disponible y abre Usuarios en Explorer.


## Bruno

La [guía de Bruno](src/clients/http/bruno.md) prepara una copia con datos
de prueba y explica los dos grupos. Con datos y Express arrancados,
`pnpm bruno` ejecuta el CRUD y sus errores. Detén solo el servicio de datos
antes de ejecutar el grupo offline. Ambos comandos paran al primer fallo.

## Nest

En otra terminal, mantén `pnpm server` y la tabla inicializada. Ejecuta `pnpm nest`
para compilar src y abrir la API en http://127.0.0.1:3003. Ctrl+C la detiene.
En Postman utiliza POST /users con JSON {"name":"Ada","email":"ada@example.com"};
GET /users; GET /users/ID; PATCH /users/ID con JSON {"name":"Ada Lovelace"};
DELETE /users/ID. Creación201, consultas y edición200, borrado204 sin cuerpo.
Sustituye ID por el ID devuelto. Las respuestas de contactos tienen los cinco
campos y PATCH conserva los omitidos.

Abre http://127.0.0.1:3003/ para usar Swagger UI. Despliega una operación,
pulsa «Try it out», introduce el cuerpo o ID y pulsa «Execute». La página
muestra el estado y la respuesta de la API. En PATCH, elimina del JSON el
campo que quieras conservar; enviar una cadena vacía no equivale a omitirlo.
El servicio de datos debe seguir arrancado para ejecutar las operaciones.

Para verificar el adaptador sin dejar el servidor abierto:

```sh
pnpm exec babel src --out-dir dist --delete-dir-on-start
node --test --test-concurrency=1 tests/nest-client.test.js tests/nest-swagger.test.js
```

Estas pruebas preparan datos desechables y utilizan un puerto separado.

## Cliente Node HTTP y Jupyter

Inicializa la tabla y ejecuta `pnpm server`, `pnpm node-http` y `pnpm jupyter-node-http` en terminales separadas. La API escucha en `http://127.0.0.1:3004`. Los cinco notebooks llaman a sus rutas HTTP. `pnpm jupyter` sigue abriendo los notebooks originales.
