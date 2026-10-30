# Plan — referencia del MCP de Socket

Issue: #633.

Documentación. No reemplaza ningún fichero de `logic/`. No guarda datos. No instala un paquete. No hay firma nueva ni SQL nuevo.

La dirección del MCP de GitHub es una línea en `MCPS/github-mcp-server/mcp.txt`. `docs/ARCHITECTURE.md` nombra ese fichero. La de Socket se escribe igual, al lado.

`AGENTS.md` pide campaña, alerta y stats por debajo de 50, hasta 3 capas. El cómo de cada dato entra en `## Validación de paquetes`. En el plan de Prettier y ESLint la campaña y la alerta quedaron sin la herramienta del MCP.

La constitución dice que un paquete de Node se valida con Socket y que el cómo está en `AGENTS.md`. La spec dice lo mismo, añade la referencia junto a la de GitHub y separa los tres datos con su fuente. Si una fuente no contesta, el resumen dice el motivo. No se contradicen. El flujo de git no entra en este cambio.

## Revisión

Hecha el 30 de octubre de 2026 con el MCP `socket-mcp`, después de guardar el token. Organización `socket-dev-neoland`, plan free.

- `depscore` da las cinco stats, de 0 a 100. No lista alertas ni campañas. Prettier `3.9.10`: license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100. ESLint `10.13.0`: license 100, maintenance 95, quality 100, supplyChain 97, vulnerability 100. Ninguna stat está por debajo de 50.
- `organizations` devuelve `socket-dev-neoland`.
- `alerts` responde. Con las alertas abiertas la lista viene vacía. Es la lista de la organización. No dice que esas versiones no tengan alerta.
- `threat_feed` responde 403 `threat_feed_not_entitled`. El plan free no incluye el threat feed. La campaña no se lee porque la cuenta no tiene esa fuente. No se escribe que no consta.

## Ficheros

Se tocan:

- `MCPS/socket-mcp/mcp.txt`
- `docs/ARCHITECTURE.md`
- `AGENTS.md` de first-app, solo `## Validación de paquetes`

No se toca `agents/git-workflow-agent.md`. No se tocan `## Orden` ni `## Reglas`. No se toca el `AGENTS.md` de la raíz. No se toca `docs/CONSTITUTIONS.md`.

No se tocan `package.json`, el código ni las specs ya escritas. `docs/tree.md` lista `MCPS/` y no lista cada `mcp.txt`.

## Parecido

`MCPS/github-mcp-server/mcp.txt` es una línea con la dirección. Este fichero se escribe igual. No hay fichero de `logic/` al que se parezca.

## Errores

Ningún fallo de esta spec usa un mensaje de la sección 6. Si una fuente no contesta, el resumen dice el motivo que devolvió la herramienta.

## Referencia

`MCPS/socket-mcp/mcp.txt` tiene una línea:

```
https://docs.socket.dev/docs/remote-socket-mcp
```

En `docs/ARCHITECTURE.md`, después de la línea del MCP de GitHub:

```
- `MCPS/socket-mcp/mcp.txt` es la dirección del MCP de Socket.
```

## AGENTS.md

En `## Validación de paquetes`, el texto queda así:

Cada vez que un plan añade un paquete de Node o cambia su versión, el chequeo es automático. Se hace con el MCP `socket-mcp` de `MCPS/socket-mcp/mcp.txt`, antes de aceptar el plan.

Se mira el paquete y la versión. También se miran las dependencias de ese paquete, hasta 3 capas. El resumen entra en el plan antes de aceptarlo. Separa tres datos. Cada dato dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Una stat por debajo de 50 puntos se escribe. 50 no baja.

La alerta sale de `alerts`, con el `org_slug` que devuelve `organizations`. Una lista vacía es la lista de la organización. No dice que esa versión no tenga alerta.

La campaña sale de `threat_feed`, con ese mismo `org_slug`.

Si una de esas herramientas no contesta, el resumen dice el motivo. No escribe que no consta sin haberla consultado.

Las alertas se comentan en el plan. La persona decide si las acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.
