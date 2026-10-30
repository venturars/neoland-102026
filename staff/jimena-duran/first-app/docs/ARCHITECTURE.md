# Arquitectura

La aplicación usa Node.js con módulos ES (`"type": "module"`) y una base SQLite gestionada por `node:sqlite`.

Las cuatro capas viven bajo `src/`. `src/db/` solo abre la base; su conexión conserva `users.sqlite` junto al módulo y fuera de Git. El SQL permanece en `src/queries/queries/`; `src/queries/users.js` lo lee y lo ejecuta, sin reglas de negocio. Las decisiones de negocio viven en `src/logic/`. Los clientes de `src/clients/terminal/` invocan esa capa desde first-app y muestran su resultado; los notebooks están en `src/clients/jupyter/`.

`src/logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `src/queries/` ni a `src/clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

Los contratos de funciones siguen [STYLE.md](STYLE.md); las salidas y los errores se definen en [ERRORS.md](ERRORS.md).

`eslint.config.js` configura la revisión del JavaScript con las reglas
recomendadas de ESLint y excluye `.venv` y `node_modules`.

## Automatización del trabajo

La automatización de Git es documentación y herramientas de desarrollo, separadas de la lógica de usuarios. No modifica sus contratos, su base de datos ni sus clientes. Su uso se explica en [GIT-AUTOMATION.md](GIT-AUTOMATION.md).

`agents/git-workflow-agent.md` coordina el momento solicitado y lanza agentes reales con responsabilidades delimitadas: `help-me-to-think` concreta la petición, `create-issue` la registra, `create-branch` prepara la rama, `create-commit` guarda un trozo autorizado, `launch-push` publica cuando se indica y `create-pr` crea la revisión en borrador contra staging. Las preguntas y los errores vuelven al orquestador.

Las skills de `skills/` se leen por su ruta. Definen entrevistas, estado, ramas, commits, publicación, asignaciones y relación de issue con PR. El orquestador escribe `Closes #N` después de create-pr, conserva y verifica Development por separado y gestiona las personas revisoras indicadas. La base sigue siendo staging: la palabra de cierre solo se interpreta cuando la PR apunta a la rama predeterminada. No cierra issues manualmente ni realiza merges implícitos.

Los scripts `.ps1` de `tools/` ejecutan las operaciones de Git en PowerShell. Resuelven la raíz desde su ubicación, comprueban códigos de salida nativos, protegen la rama autorizada de cada tarea y conservan cambios ajenos. Los commits selectivos usan un índice temporal. Las herramientas no fijan nombres de ramas personales ni fuerzan publicaciones.

`tools/git-common.ps1` comparte solo las comprobaciones de repositorio, estado, ramas, hooks y comandos nativos. `tools/tests/` verifica el flujo y la conservación de datos en repositorios desechables con remoto local; no ejecuta mutaciones en el repositorio personal.

`templates/issues/` y `templates/pull-request/` dan forma a los cuerpos en español. `MCPS/github-mcp-server/mcp.txt` referencia la documentación del servidor; la conexión, identidad y capacidades se comprueban en la sesión. GitHub CLI es una alternativa documentada si el MCP no resulta suficiente o no corresponde a la cuenta autorizada.

El orden de AGENTS.md permanece por encima del flujo de Git: issue antes de spec; spec y plan antes de la primera pausa; tareas antes de la segunda pausa; implementación tras autorización. La actualización del árbol y la arquitectura forma parte de las tareas aprobadas cuando se añaden o eliminan archivos.

`MCPS/socket-mcp/mcp.txt` referencia el MCP remoto de Socket con OAuth. [SOCKET.md](SOCKET.md) documenta la consulta PURL autenticada con `SOCKET_API_TOKEN`, el inventario directo derivado del manifiesto y lockfile y la interpretación de alertas. Son documentación de desarrollo; la conexión y configuración existentes se conservan.
