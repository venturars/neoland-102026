# Socket — validar paquetes en el plan

Organización `ai-engineering`, repositorio `neoland-102026`, servidor MCP
https://mcp.socket.dev/.

## Herramientas

- Stats: `depscore`, versión exacta.
- Alertas: `alerts` con `org_slug` `ai-engineering`, `artifact_type` npm y
  `artifact_name`.
- Campaña: `threat_feed` (plan free: 403 `threat_feed_not_entitled` → motivo en
  el plan).

## Qué alertas entran en el resumen

- Nunca `alerts` sin filtrar por paquete.
- Solo la versión exacta del plan y repo `neoland-102026`.
- No `socketUpgradeAvailable` ni avisos de «hay versión más nueva».
- Sin match: «sin alerta aplicable en paquete vigilado para esta versión».

## Cuota

- 429 o cuota agotada: parar toda la revisión Socket; no más llamadas; motivo y
  datos pendientes; no inventar stats ni alertas.

## Stats

- Por debajo de 50 se escribe; 50 no baja.

Conexión OAuth en Cursor: `MCPS/socket-mcp/mcp.txt`.
