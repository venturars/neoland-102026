# Plan — referencia del MCP de Socket

Issue: #651.

## Recorrido

Documentación. No cambia `logic/`, no guarda datos, no instala un paquete, no añade SQL y no cambia ninguna firma.

La dirección del MCP de GitHub es una línea en `MCPS/github-mcp-server/mcp.txt`, y `docs/ARCHITECTURE.md` nombra ese fichero. La de Socket se escribe igual, al lado.

`docs/CONSTITUTION.md` y `AGENTS.md` ya piden campaña, alerta y stats por debajo de 50, hasta 3 capas. «Paquetes» no dice qué herramienta da cada dato. Por eso en el plan de Prettier y ESLint la campaña y la alerta quedaron en «no consta».

## Referencia

`MCPS/socket-mcp/mcp.txt` tiene una línea:

```
https://docs.socket.dev/docs/remote-socket-mcp
```

Es la página de la documentación del MCP remoto de Socket. Se abre antes de dar la tarea por terminada, para confirmar que existe y que es la oficial.

## Herramientas por dato

En «Paquetes» de `docs/CONSTITUTION.md` se añade una frase por dato:

- Las stats salen de `depscore`, con la versión exacta. Una stat por debajo de 50 se escribe. 50 no baja.
- La alerta sale de `alerts`, con el `org_slug` que devuelve `organizations`. Una lista vacía es la lista de la organización. No dice que esa versión no tenga alerta.
- La campaña sale de `threat_feed`, con ese mismo `org_slug`.
- Si una herramienta no contesta, el resumen dice el motivo. No escribe «no consta» sin haberla llamado.

Los cuatro nombres se comprobaron con `socket-mcp` autorizado el 30 de octubre de 2026. Organización `aiai`, plan free. `depscore` dio las stats de `prettier@3.9.10`. `alerts` respondió con la lista vacía de esa organización. `threat_feed` devolvió 403 `threat_feed_not_entitled`: el plan free no incluye esa fuente. La campaña de esta cuenta no se puede leer y el resumen lo dice con ese motivo.

## Ficheros

Se tocan:

- `MCPS/socket-mcp/mcp.txt`
- `docs/ARCHITECTURE.md`, una línea después de la del MCP de GitHub: ``- `MCPS/socket-mcp/mcp.txt` es la dirección de la documentación del MCP de Socket.``
- `docs/TREE.md`, `socket-mcp/mcp.txt` dentro de `MCPS/`, y la carpeta de esta spec.
- `docs/CONSTITUTION.md`, solo «Paquetes».

No se tocan `AGENTS.md`, `agents/`, `package.json`, el código ni las specs ya escritas.

## Errores

Ningún fallo de esta spec usa un mensaje de errores. Si una herramienta no contesta, el resumen dice el motivo que devolvió.

## Comprobación

- `MCPS/socket-mcp/mcp.txt` tiene una línea y la URL abre.
- `pnpm format` y `pnpm lint` terminan sin error.
- `git diff --check` no encuentra errores de espacios.
- El diff solo contiene los ficheros de la lista.
