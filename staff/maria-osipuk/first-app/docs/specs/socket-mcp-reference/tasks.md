# Tareas — referencia del MCP de Socket

## 1. Escribir la referencia

Crear `MCPS/socket-mcp/mcp.txt` con una línea: `https://docs.socket.dev/docs/remote-socket-mcp`.
Abrir la URL y comprobar que existe.

## 2. Comprobar los nombres de las herramientas

Con `socket-mcp` autorizado, llamar a `depscore`, `alerts`, `organizations` y `threat_feed` y confirmar que los nombres existen.

## 3. Sincronizar las guías

Añadir la línea de Socket a `docs/ARCHITECTURE.md`, después de la del MCP de GitHub.
Añadir `socket-mcp/mcp.txt` y la carpeta de esta spec a `docs/TREE.md`.

## 4. Completar «Paquetes»

Abrir `docs/CONSTITUTION.md` y, en «Paquetes», escribir qué herramienta da la stat, la alerta y la campaña, y que sin llamarla no se escribe «no consta».

## 5. Comprobar

Ejecutar `pnpm format`, `pnpm lint` y `git diff --check`.
Revisar que el diff solo tiene los ficheros del plan.
