# First app AI

Aplicación local de contactos. Los nueve documentos de Jupyter permiten ejecutar sus operaciones y leer los resultados desde el navegador.

## Abrir el cliente web

Desde esta carpeta, con las dependencias existentes preparadas:

```sh
pnpm web
```

Abre la dirección que imprime la terminal, normalmente
**http://127.0.0.1:8080**. El servidor inicializa la tabla si falta, sin añadir
contactos. Utiliza `src/db/users.sqlite` de esta copia, igual que Terminal y
Jupyter. La selección de usuario es por ID, sin contraseña: úsalo localmente,
no como una aplicación con control de acceso.

Si la lista está vacía, crea un contacto desechable desde Jupyter o usa este
comando desde la carpeta del proyecto:

```sh
node --input-type=module <<'JS'
import { createUsersTable } from "./src/queries/users.js";
import { createUser } from "./src/logic/create-user.js";
createUsersTable();
console.log(createUser({ name: "Ada", email: "ada-web@example.test" }));
JS
```

Para comprobar las tres pantallas:

1. Elige el contacto por su ID en la lista.
2. El menú permite volver a la lista o abrir **Modificar usuario**.
3. Cambia nombre/email y guarda. Un email duplicado o un nombre vacío muestra
   el error sin borrar lo escrito.
4. Vuelve al editor y pulsa **Eliminar usuario**. Cancelar conserva el contacto;
   confirmar lo borra permanentemente y refresca la lista.

**Ir a notas** está desactivado y marcado como próximo trabajo. No hay gestión
ni almacenamiento de notas en esta entrega. Si otro cliente borra al contacto
seleccionado, se informa y se vuelve a la lista.

Para usar otro puerto: `WEB_PORT=8081 pnpm web` en macOS/Linux, o
`$env:WEB_PORT=8081; pnpm web` en PowerShell. El servidor solo escucha en
127.0.0.1. Para detenerlo, pulsa **Ctrl+C** en su terminal; cerrar la pestaña
no lo detiene.

`pnpm test:web` ejecuta comprobaciones HTTP con una base ficticia temporal;
no utiliza los contactos de esta copia. Requiere permiso para escuchar en loopback.

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

Para parar Notebook vuelve a la terminal y pulsa **Ctrl+C**; confirma la parada si Jupyter lo solicita. Cerrar una pestaña no para el servidor.

Los ejemplos anteriores siguen disponibles en `src/clients/terminal/`. Las reglas están en [la constitución](docs/CONSTITUTIONS.md) y la verificación del cliente en [las tareas](docs/specs/jupyter-client/tasks.md).

## Trabajo con IA y Git

Trabaja sobre esta carpeta first-app-ai en Codex. Git pertenece al repositorio NEOLAND que la contiene: no ejecutes git init aquí.

Puedes pedir pensar una tarea, dejarla escrita como issue, empezarla, guardar un trozo o pedir revisión indicando personas. [El flujo](agents/git-workflow-agent.md) coordina las acciones y lanza los seis subagentes con las herramientas nativas de Codex, entregando a cada uno su documento de agents/. Git usa staging actualizado y las PRs nacen en draft hacia staging. La spec, el plan y las tareas requieren aprobaciones separadas antes de implementar.

Comprueba una invocación real de help-me-to-think: debe existir un encargo separado y un resultado, no solo lectura del documento en la conversación principal. Verifica por lectura la cuenta autenticada y el acceso al repositorio con el MCP GitHub del entorno activo. `MCPS/github-mcp-server/mcp.txt` es una referencia pública; no instala el servidor ni contiene credenciales.

Reutiliza la conexión existente. Configura la escritura directa según [la referencia MCP](MCPS/github-mcp-server/mcp.txt): header X-MCP-Features en remoto o --features en el servidor local de Codex. Recarga la conexión después del cambio; no des por probada la escritura hasta verificar su resultado. Si falla, identifica el error y acuerda el cambio concreto antes de modificar autenticación. Los tokens permanecen en configuración local, fuera de Git, comandos y capturas. Una confirmación inaccesible detiene la operación; el agente no desactiva controles ni sustituye el MCP silenciosamente por otro cliente.

Las entradas `.cursor/agents/` se conservan como compatibilidad opcional. Requieren abrir esta app como proyecto en Cursor y verificar su propio entorno; el resultado de Codex no acredita ejecución allí. No son necesarias para usar el flujo en Codex.

Las verificaciones y pendientes están en [las tareas de Git](docs/specs/git-workflow-automation/tasks.md). Las solicitudes de revisión van después de publicar los cambios finales; después no se cambian commits ni base sin petición expresa.
