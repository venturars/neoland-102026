# Spec · Repartir reglas Socket y referencia MCP

Issue: #658

## Qué se pide

Repartir la sección Paquetes de first-app: la **regla** queda en `docs/CONSTITUTIONS.md`; el **procedimiento** queda en `AGENTS.md` y apunta a esa regla. La dirección del servidor MCP queda en `MCPS/socket-mcp/mcp.txt`.

Lo usa quien construye la app con IA.

## Reglas de negocio

- La constitución dice cuándo se valida un paquete de Node, que entran la versión exacta y las dependencias hasta 3 capas, qué resumen debe traer el `plan.md`, que las alertas las decide la persona, qué pasa si la consulta no se completa, que no se instala ni se cambia `package.json` ni el lock antes de aprobar `spec.md` y `plan.md`, y qué queda fuera. El procedimiento MCP no se copia ahí.
- `AGENTS.md` abre la sección Paquetes apuntando a la constitución. Debajo solo el cómo: al redactar `plan.md`, servidor en `MCPS/socket-mcp/mcp.txt`, árbol con `pnpm view`, argumentos de `depscore`, `alerts` y `threat_feed`, tabla `## Validación Socket`, y qué escribir si el MCP no contesta. No es un momento del orquestador de git.
- En SDD, si un desarrollo añade o cambia paquetes, el primer paso de `tasks.md` solo se ejecuta tras aprobación de `spec.md` y `plan.md` (y alertas Socket, si las hubo).

## Criterios de aceptación

1. `docs/CONSTITUTIONS.md`, sección Paquetes, contiene la regla completa y no nombra argumentos del MCP ni `pnpm view`.
2. `AGENTS.md`, sección Paquetes, abre apuntando a la constitución y solo describe procedimiento y `MCPS/socket-mcp/mcp.txt`.
3. `MCPS/socket-mcp/mcp.txt` tiene una sola línea con `https://docs.socket.dev/docs/remote-socket-mcp`.
4. `docs/ARCHITECTURE.md` nombra `MCPS/socket-mcp/mcp.txt` después del MCP de GitHub.
5. La frase de `tasks.md` en Specs (constitución SDD) apunta a Paquetes.
6. `agents/git-workflow-agent.md`, `docs/TREE.md`, `package.json` y el código no cambian.

## Fuera de alcance

- Cambiar reglas de `logic/`, base de datos o clientes.
- Añadir un subagente en `agents/` solo para Socket.
- Modificar el flujo paso a paso de `git-workflow-agent.md`.
