# Plan: Validar paquetes de Node con Socket

Implementa [spec.md](spec.md). Cambia [CONSTITUTIONS.md](../../CONSTITUTIONS.md) con el permiso explícito del usuario, que lo ha pedido en la issue.

## Archivos
```
docs/CONSTITUTIONS.md     principio 8 nuevo, versión y fecha
AGENTS.md                 sección «Paquetes» nueva, después de «Límites»
MCPS/socket-mcp/mcp.txt   NUEVO: la referencia del MCP de Socket
```
No se toca nada más.

## Revisión del MCP de Socket
Hecha el 2026-10-31 con el MCP `socket-mcp`, después de iniciar sesión. Organización `sergiomoras`, plan free.

| Herramienta | Sirve para | Resultado |
|---|---|---|
| `organizations` | Saber el `org_slug` | `sergiomoras`, plan free |
| `depscore` | Puntuaciones de 0 a 100: supply chain, quality, maintenance, vulnerability y license. No lista alertas | `cli-table3@0.6.5`: 100, 100, 81, 100, 100 |
| `alerts` | Alertas abiertas de la organización, filtradas por `artifact_type` `npm` y `artifact_name` | Responde. Para `cli-table3`, lista vacía. Es la lista de la organización: no dice que esa versión no tenga alertas |
| `threat_feed` | Campañas de ataque, por `name` y `version` | `403 threat_feed_not_entitled`: el plan free no incluye esa fuente |

Las dependencias de cada versión se leen con `npm view <paquete>@<versión> dependencies optionalDependencies`.

## `docs/CONSTITUTIONS.md`
Después del principio 7 se añade:

> ### 8. Paquetes validados
> - Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket antes de aceptar el plan.
> - El resumen de esa validación va en el plan.
>
> *Motivo:* un paquete trae código de otras personas; quien acepta el plan tiene que saber qué entra.

La versión pasa de 1.3.0 a 1.4.0 y la fecha queda en 2026-10-31.

## `AGENTS.md`
Después de «Límites» se añade:

> ## Paquetes
> Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket antes de aceptar el plan. La referencia está en [MCPS/socket-mcp/mcp.txt](MCPS/socket-mcp/mcp.txt).
> - Entran el paquete, su versión exacta y sus dependencias hasta 3 capas. Las dependencias salen de `npm view`.
> - Las puntuaciones salen de `depscore`. Una por debajo de 50 se escribe.
> - Las alertas salen de `alerts`, con el `org_slug` de `organizations`. Una lista vacía es la lista de la organización: el resumen lo dice así y no escribe que esa versión no tenga alertas.
> - Las campañas salen de `threat_feed`. Si responde `403 threat_feed_not_entitled`, el resumen dice que la cuenta no tiene esa fuente.
> - Si una herramienta no contesta, el resumen dice el motivo. No deja el dato en blanco.
> - El resumen va en el plan. Quien acepta el plan decide si acepta las alertas.
> - Queda fuera: paquetes que no son de Node, un paquete cuya versión no cambia y más de 3 capas.

## `MCPS/socket-mcp/mcp.txt`
- La documentación: `https://docs.socket.dev/docs/remote-socket-mcp`.
- El servidor remoto: `https://mcp.socket.dev/`.
- Cómo se conecta en Claude Code: `claude mcp add --scope user --transport http socket-mcp https://mcp.socket.dev/`. Después, `/mcp` → `socket-mcp` → Authenticate, e iniciar sesión en Socket en el navegador. No se guarda ningún token en el repositorio.
- La tabla de herramientas de arriba, con lo que devuelve el plan free.
- Cómo se consulta `depscore` con `curl` cuando el MCP no está conectado: una petición JSON-RPC `tools/call` con `ecosystem`, `depname` y `version` de cada paquete. Solo `depscore` contesta sin sesión.

## Cómo se prueba
- Con el MCP: `organizations`, `depscore`, `alerts` y `threat_feed` con `cli-table3` `0.6.5` dan lo de la tabla.
- Sin el MCP: la consulta `curl` de `mcp.txt` devuelve las puntuaciones de `cli-table3` `0.6.5`.
- Se leen el principio 8, «Paquetes» y `mcp.txt` y dicen lo mismo.
