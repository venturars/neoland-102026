# Tareas — repartir la regla de paquetes

Issue: #650.

1. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md), sección `## Paquetes`.
   Sustituye la sección por el texto de «Constitución» del plan.
   El procedimiento y la dirección del servidor no están ahí.

2. En el mismo fichero, sección `## Specs`.
   La frase del primer paso de `tasks.md` pasa a la del plan.
   Apunta a «Paquetes» y no repite las alertas Socket.

3. Abre [AGENTS.md](../../../AGENTS.md) de first-app, sección `## Paquetes`.
   Sustituye la sección por el texto de «AGENTS.md» del plan.
   La viñeta de `## Reglas` sobre la fase Implementación se queda.
   No se toca el `AGENTS.md` de la raíz.

4. Crea [MCPS/socket-mcp/mcp.txt](../../../MCPS/socket-mcp/mcp.txt).
   Una línea, la de «Referencia» del plan.
   La misma forma que `MCPS/github-mcp-server/mcp.txt`.

5. Abre [docs/ARCHITECTURE.md](../../ARCHITECTURE.md).
   Después de la línea del MCP de GitHub, añade la de «Arquitectura» del plan.
   El resto de las líneas sigue igual.

6. Comprueba los cuatro textos.
   La constitución tiene la regla y no nombra `depscore`, `alerts`, `threat_feed` ni `pnpm view`.
   `AGENTS.md` abre apuntando a la constitución y describe el cómo y `MCPS/socket-mcp/mcp.txt`.
   `docs/TREE.md`, `agents/git-workflow-agent.md`, `package.json` y el código no cambian.
