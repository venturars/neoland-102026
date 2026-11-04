# Plan — alertas Socket relevantes al validar paquetes

Issue: #908.

No es una funcionalidad nueva. No toca `src/`, `package.json`, clientes ni
`docs/TREE.md`. **No se tocan** `docs/CONSTITUTIONS.md` ni `AGENTS.md`.

La constitución ya remite la referencia del MCP a `MCPS/socket-mcp/mcp.txt`.
Ahí va el detalle de filtros, relevancia y cuota. Los planes (p. ej.
express-rest-client) listaron CVEs de otras versiones y barridos de cientos de
alertas; esta tarea corrige la referencia MCP, no la constitución ni la guía del
agente.

## Revisión

Hecha el 4 de noviembre de 2026. Organización `ai-engineering`, plan free,
servidor `https://mcp.socket.dev/`.

- `depscore` da stats sin sesión. Puede responder 429 si la cuota horaria del
  token está agotada.
- `alerts` con `org_slug` `ai-engineering`, `artifact_type` `npm` y
  `artifact_name` por paquete. Sin filtro de nombre la respuesta es demasiado
  grande. Las filas pueden traer versión y repositorio distintos del plan.
- `threat_feed` sigue pudiendo responder 403 `threat_feed_not_entitled`.
- Referencia de forma: `staff/ella-deyavorsky/first-app/MCPS/socket-mcp/mcp.txt`,
  con org `ai-engineering` y repo de este proyecto `neoland-102026`.

## Ficheros

Se tocan:

- `MCPS/socket-mcp/mcp.txt`
- `docs/ARCHITECTURE.md` (línea de `socket-mcp/mcp.txt`)

No se toca código, `docs/TREE.md`, `docs/CONSTITUTIONS.md` ni `AGENTS.md`.

## Referencia MCP

`MCPS/socket-mcp/mcp.txt` pasa de una sola URL a la guía (herramientas,
filtros, relevancia, cuota). Quien valida paquetes lee ese fichero además de la
constitución y `AGENTS.md`.

## Arquitectura

La línea de `MCPS/socket-mcp/mcp.txt` pasa a: es la referencia del MCP de
Socket (herramientas, filtros y reglas de relevancia).

## Contrato

No hay función de `logic/`, firma pública ni SQL.
