# Plan — referencia del MCP de Socket

Cumple `docs/specs/socket-mcp-reference/spec.md`. No es una acción nueva. No se toca `src/logic/`.

## Revisión

Hecha el 30 de octubre de 2026. Organización `vibecodingneoland`, plan free. El servidor es el de `MCPS/socket-mcp/mcp.txt`. La entrada en Cursor se llama `socket-mcp`. El token no está en el repositorio.

- `depscore` da las cinco puntuaciones, de 0 a 100. No pide sesión de organización y no lista alertas. `prettier@3.9.10`, `eslint@10.13.0`, `@eslint/js@10.0.1`, `cli-table3@0.6.5` y `@colors/colors@1.6.1` están por encima de 50.
- `alerts`, con el nombre del paquete, responde. La lista abierta de `prettier` está vacía. Una lista vacía es la de los paquetes que la organización vigila. No dice que esa versión no tenga alerta.
- `threat_feed` responde 403 `threat_feed_not_entitled`. El plan free no incluye el feed de campañas. El resumen dice ese motivo. No escribe «no consta».

Una puntuación de 50 no baja. Solo baja la que está por debajo de 50.

## Tocar

- `MCPS/socket-mcp/mcp.txt`: una línea, la dirección de la documentación, igual que el MCP de GitHub.
- `docs/CONSTITUTIONS.md`, sección «Paquetes»: la regla. No nombra las herramientas.
- `AGENTS.md`, sección «Paquetes»: abre apuntando a la constitución y dice el cómo.
- `docs/ARCHITECTURE.md`: nombra `MCPS/socket-mcp/mcp.txt` junto al MCP de GitHub.

## No tocar

- `package.json`, el lock y el código.
- `agents/git-workflow-agent.md`. Esto no es un momento de git.
- El token.
