# Arquitectura

La aplicación usa Node.js con módulos ES y SQLite gestionado por node:sqlite.

Las cuatro capas viven bajo src/. El servidor `src/db/server.js` abre únicamente `src/db/users.sqlite`, fuera de Git, y ejecuta SQL en `http://127.0.0.1:3000/execute`. No contiene reglas de usuarios ni sirve HTML.

Cada consulta es un módulo .js de `src/queries/queries/` con una constante SQL y parámetros nombrados. `src/queries/users.js` importa esas constantes y usa fetch para acceder al servidor; no lee archivos con readFile ni abre SQLite.

Las decisiones de negocio viven en `src/logic/`. Sus funciones esperan las consultas con await y mantienen sus reglas, resultados y errores. Los clientes de terminal y Jupyter importan logic directamente y esperan el resultado. La preparación de tabla utiliza queries y listTables, sin una conexión alternativa.

Flujo: cliente → logic → queries → HTTP/JSON /execute → servidor SQL → users.sqlite. El cliente HTTP expone las operaciones de usuarios y llama directamente a logic; queries conserva la interfaz HTTP de datos con el servidor SQL. Los clientes comparten la base del servidor y no se llaman entre sí. Uso en [DATABASE.md](DATABASE.md) y [JUPYTER.md](JUPYTER.md).

El cliente `src/clients/browser/` contiene `index.html`, `app.js` y `styles.css`. La página se abre mediante file:// e importa directamente listUsers, updateUser y deleteUser desde logic. El navegador conserva sus imports directos; el servidor SQL no sirve HTML ni incorpora una API de usuarios. `npm.cmd run browser` abre Chrome instalado con un perfil temporal separado y permiso para cargar módulos locales.

`src/clients/http/app.js` importa y espera con await las cinco operaciones existentes de `src/logic/`. Express escucha en `http://127.0.0.1:3001`, sin repetir reglas de negocio. Se arranca con `pnpm http`; no sustituye al servidor SQL de `src/db/server.js`, que permanece en 3000.

`src/logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `src/queries/` ni a `src/clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

El cliente `src/clients/electron/` abre una ventana de escritorio propia e importa las operaciones de `src/logic/`. No reutiliza `src/clients/browser/` ni sustituye al servidor SQL de `src/db/server.js`.

El cliente `src/clients/chrome/` reúne una extensión Manifest V3 y su API
Fastify. El popup consulta exclusivamente `http://127.0.0.1:3002` con fetch;
la API importa las cinco operaciones de usuarios de `src/logic/` y conserva
sus reglas. `pnpm chrome` inicia la API. La extensión se carga manualmente
en Chrome, según `README.md`. El servidor SQL permanece en 3000 y el
cliente HTTP conserva su API Express en 3001.

El cliente `src/clients/vscode/` aporta la vista Usuarios en la barra lateral
de VS Code. Su proceso de extensión importa las cinco operaciones de
`src/logic/`; la vista envía mensajes y presenta sus resultados. `pnpm vscode`
abre la aplicación en una ventana de desarrollo desde Windows/PowerShell.
No incorpora API ni puerto y conserva el servidor SQL en 3000, el cliente
HTTP en 3001 y el cliente Chrome en 3002.

Los contratos de funciones siguen [STYLE.md](STYLE.md); las salidas y los errores se definen en [ERRORS.md](ERRORS.md).

`eslint.config.js` configura la revisión del JavaScript con las reglas
recomendadas de ESLint y excluye `.venv` y `node_modules`.

## Automatización del trabajo

La automatización de Git vive en agents/, skills/, tools/, templates/ y MCPS/, separada de src/ y de los datos de usuarios. Los siete scripts Bash de tools/ conservan el código original de la fuente fijada; no se mantienen herramientas ni ensayos PowerShell propios.

Los agentes y skills mantienen su estructura original. Solo se adaptan las siete rutas de comandos para ejecutarlos desde la raíz Git y se añade al orquestador la referencia al SDD local. AGENTS.md conserva las revisiones separadas de spec/plan y tareas antes de implementar; ese SDD prevalece sobre la continuación automática del template.

Las doce plantillas originales son la fuente editorial de issues y PR. MCPS contiene la referencia original, sin ejecutar su configuración. La guía [GIT-AUTOMATION.md](GIT-AUTOMATION.md) explica uso con Git Bash, MCP y alternativa gh, así como los límites de esta copia. Los ensayos autorizados usan repositorios desechables con remoto local y evidencia separada de los resultados históricos.

`MCPS/socket-mcp/mcp.txt` referencia el MCP remoto de Socket con OAuth. [SOCKET.md](SOCKET.md) documenta la consulta PURL autenticada con `SOCKET_API_TOKEN`, el inventario directo derivado del manifiesto y lockfile y la interpretación de alertas. Son documentación de desarrollo; la conexión y configuración existentes se conservan.
