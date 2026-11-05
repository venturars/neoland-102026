# Plan — alertas Socket relevantes al validar paquetes

Issue: #908.

No es una funcionalidad nueva. No toca `src/`, `package.json` ni clientes.

La constitución remite el MCP a `MCPS/socket-mcp/mcp.txt`. El procedimiento
resumido va en `docs/SOCKET.md`. Los planes (p. ej. express-rest-client)
mezclaban alertas de toda la org; esta tarea corrige la guía.

`docs/SOCKET.md`, `docs/CONSTITUTIONS.md` y `AGENTS.md` fijan stats por debajo
de 200 y que el lockfile solo instala versiones ya analizadas por Socket.

## Revisión

4 de noviembre de 2026. Org `ai-engineering`, plan free, `https://mcp.socket.dev/`.

## Ficheros

Se tocan:

- `docs/SOCKET.md` (nuevo, resumido)
- `MCPS/socket-mcp/mcp.txt` (URL + enlace a `SOCKET.md`)
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/CONSTITUTIONS.md` (umbral 200 y lockfile)
- `AGENTS.md` (umbral 200 y lockfile)

## Contrato

No hay función de `logic/`, firma pública ni SQL.
