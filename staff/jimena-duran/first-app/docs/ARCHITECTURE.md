# Arquitectura

La aplicación usa Node.js con módulos ES y SQLite gestionado por node:sqlite.

Las cuatro capas viven bajo src/. El servidor `src/db/server.js` abre únicamente `src/db/users.sqlite`, fuera de Git, y ejecuta SQL en `http://127.0.0.1:3000/execute`. No contiene reglas de usuarios ni sirve HTML.

Cada consulta es un módulo .js de `src/queries/queries/` con una constante SQL y parámetros nombrados. `src/queries/users.js` importa esas constantes y usa fetch para acceder al servidor; no lee archivos con readFile ni abre SQLite.

Las decisiones de negocio viven en `src/logic/`. Sus funciones esperan las consultas con await y mantienen sus reglas, resultados y errores. Los clientes de terminal y Jupyter importan logic directamente y esperan el resultado. La preparación de tabla utiliza queries y listTables, sin una conexión alternativa.

Flujo: cliente → logic → queries → HTTP/JSON /execute → servidor SQL → users.sqlite. No hay API entre cliente y logic; sí una interfaz HTTP de datos entre queries y el servidor. Los clientes comparten la base del servidor y no se llaman entre sí. Uso en [DATABASE.md](DATABASE.md) y [JUPYTER.md](JUPYTER.md).

El cliente `src/clients/browser/` contiene `index.html`, `app.js` y `styles.css`. La página se abre mediante file:// e importa directamente listUsers, updateUser y deleteUser desde logic. Node solo ejecuta el servidor SQL; no sirve HTML ni incorpora una API de usuarios. `npm.cmd run browser` abre Chrome instalado con un perfil temporal separado y permiso para cargar módulos locales.

`src/logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `src/queries/` ni a `src/clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

Los contratos de funciones siguen [STYLE.md](STYLE.md); las salidas y los errores se definen en [ERRORS.md](ERRORS.md).

`eslint.config.js` configura la revisión del JavaScript con las reglas
recomendadas de ESLint y excluye `.venv` y `node_modules`.

## Automatización del trabajo

La automatización de Git vive en agents/, skills/, tools/, templates/ y MCPS/, separada de src/ y de los datos de usuarios. Los siete scripts Bash de tools/ conservan el código original de la fuente fijada; no se mantienen herramientas ni ensayos PowerShell propios.

Los agentes y skills mantienen su estructura original. Solo se adaptan las siete rutas de comandos para ejecutarlos desde la raíz Git y se añade al orquestador la referencia al SDD local. AGENTS.md conserva las revisiones separadas de spec/plan y tareas antes de implementar; ese SDD prevalece sobre la continuación automática del template.

Las doce plantillas originales son la fuente editorial de issues y PR. MCPS contiene la referencia original, sin ejecutar su configuración. La guía [GIT-AUTOMATION.md](GIT-AUTOMATION.md) explica uso con Git Bash, MCP y alternativa gh, así como los límites de esta copia. Los ensayos autorizados usan repositorios desechables con remoto local y evidencia separada de los resultados históricos.

`MCPS/socket-mcp/mcp.txt` referencia el MCP remoto de Socket con OAuth. [SOCKET.md](SOCKET.md) documenta la consulta PURL autenticada con `SOCKET_API_TOKEN`, el inventario directo derivado del manifiesto y lockfile y la interpretación de alertas. Son documentación de desarrollo; la conexión y configuración existentes se conservan.
