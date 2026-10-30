# Plan · Repartir reglas Socket y referencia MCP

Issue: #658

## Visión

Solo documentación. No hay cambios en `src/`, `package.json` ni `pnpm-lock.yaml`.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/split-socket-package-rules/` |
| Tocar | `docs/CONSTITUTIONS.md` |
| Tocar | `AGENTS.md` |
| Tocar | `MCPS/socket-mcp/mcp.txt` |

No se tocan `agents/git-workflow-agent.md`, `docs/TREE.md`, `docs/ARCHITECTURE.md` (salvo comprobar que ya nombra Socket MCP), `package.json` ni código.

## Constitución

Ampliar `## Paquetes` y la frase de `tasks.md` en `## SDD` (ver tasks de esta spec).

## AGENTS.md

Añadir `## Orden`, reestructurar `## Reglas` y `## Paquetes` (regla en constitución; procedimiento aquí). Corregir rutas `src/` en Comandos y Al terminar.

## MCPS

`MCPS/socket-mcp/mcp.txt` → una línea URL remota.

## Setup local opcional (no commitear en mcp.txt)

En Windows, con usuario con espacios en la ruta, Cursor puede usar `node` + ruta a `@socketsecurity/mcp/dist/index.cjs` y `NODE_OPTIONS=--use-system-ca` en `~/.cursor/mcp.json`. Namespace Cursor: `user-socket-mcp`.

## Validación Socket

Este desarrollo no añade dependencias: no aplica tabla de paquetes.

## Comprobación

Checklist de la spec (CA 1–6).
