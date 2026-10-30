# Plan — repartir la regla de paquetes

Issue: #650.

No es una funcionalidad nueva. No hay fichero nuevo en `src/logic/`. No hay
firma ni SQL nuevo. No hay paquete de Node ni cambio de versión. No hay
validación Socket en este plan.

Hoy la regla y el procedimiento están en `AGENTS.md`, sección `## Paquetes`.
La constitución solo remite allí. La arquitectura dice que la constitución
conserva los paquetes y que `AGENTS.md` apunta a la constitución. Este
desarrollo deja la regla en la constitución y el procedimiento en `AGENTS.md`.

La misma puerta de aprobación está en la frase de `tasks.md` dentro de
`## Specs`. Esa frase pasa a apuntar a `## Paquetes`. La viñeta de `## Reglas`
sobre añadir dependencias solo en la fase Implementación se queda.

## Ficheros

Se crea:

- `MCPS/socket-mcp/mcp.txt`

Se toca:

- `docs/CONSTITUTIONS.md`
- `AGENTS.md` de first-app
- `docs/ARCHITECTURE.md`

No se toca el `AGENTS.md` de la raíz del repositorio. No se toca
`agents/git-workflow-agent.md`. No se tocan `skills/`, `package.json`, el
código ni `docs/specs/socket-package-validation/`.

## Constitución

`## Paquetes` se sustituye por este texto:

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket antes de aceptar el plan.

Entra ese paquete en la versión exacta que propone el plan, y sus dependencias hasta 3 capas, cada una con versión concreta.

El plan incluye, antes de pedir aprobación, un resumen por cada paquete revisado: si esa versión está en una campaña, si tiene alerta, las puntuaciones license, maintenance, quality, supplyChain y vulnerability, y si alguna baja de 50.

Las alertas las decide la persona. El agente no las acepta por su cuenta.

Si el resumen no está, o la consulta no se pudo completar, el plan no está listo: la pregunta queda al final del plan y no hay `tasks.md`.

Nadie instala ni cambia `package.json` ni el lock de ese desarrollo hasta que la persona haya aprobado el `spec.md` y el `plan.md`, y haya aceptado las alertas abiertas si las hubo.

Queda fuera un paquete que no es de Node, un paquete cuya versión no cambia, mirar más de 3 capas y que el agente decida las alertas.

El procedimiento para consultar Socket está en `AGENTS.md`.

En `## Specs`, esta frase:

Si el desarrollo añade o cambia paquetes de Node, el primer paso de `tasks.md` dice que solo se ejecuta tras aprobación del `spec.md` y del `plan.md` (y de las alertas Socket, si las hubo).

pasa a:

Si el desarrollo añade o cambia paquetes de Node, el primer paso de `tasks.md` dice que solo se ejecuta tras la aprobación de «Paquetes».

## AGENTS.md

`## Paquetes` se sustituye por este texto. No repite la regla.

La regla está en `docs/CONSTITUTIONS.md`, sección Paquetes. Aquí solo el cómo.

### Cuándo

Al redactar el `plan.md`. No es un momento de `agents/git-workflow-agent.md`. El orquestador no llama a este MCP. Las paradas de «Orden» siguen.

### Árbol

Ecosistema `npm`. Para las capas que marca la regla: partir del manifest publicado de la versión (`pnpm view <paquete>@<versión> dependencies`, y repetir por cada dependencia nueva hasta esa capa). Si un paquete ya salió en una capa anterior con la misma versión, no se vuelve a consultar.

### MCP Socket

El servidor remoto es el descrito en `MCPS/socket-mcp/mcp.txt`.

1. Si el MCP no responde o pide autenticación, usar `mcp_auth` y reintentar. Si sigue fallando, se documenta el fallo en el plan y no se inventa el resumen. No se sustituye Socket por una muestra parcial. La consecuencia está en la constitución.
2. Llamar a `organizations` y guardar `org_slug`. No se fija un slug.
3. Por cada `depname@version` del árbol (capa 0 = directo; las siguientes, hasta la capa de la regla):

   - **`depscore`**: `ecosystem` `npm`, `depname`, `version`. Anotar **license**, **maintenance**, **quality**, **supplyChain** y **vulnerability** (0–100).
   - **`alerts`**: `org_slug`, `artifact_type` `npm`, `artifact_name` = `depname`, `status` `open`. Quedarse con las que correspondan a esa versión si la respuesta lo permite.
   - **`threat_feed`**: `org_slug`, `ecosystem` `npm`, `name`, `version`. Si hay coincidencia, cuenta como campaña para el resumen.

4. Las alertas abiertas se comentan en la conversación (paquete, versión, tipo o categoría, severidad si viene).

5. Añadir la sección `## Validación Socket` al `plan.md`. Una fila por paquete revisado, con columnas: **capa**, **paquete@versión**, **campaña** (sí/no; si `threat_feed` no aplica en el plan de la org, indicarlo, p. ej. `n/d (plan free)`), **alertas** (sí/no; detalle en conversación), **license**, **maintenance**, **quality**, **supplyChain**, **vulnerability**, **stats < 50** (las puntuaciones que bajan del umbral de la regla, o «ninguna»). Si no hubo incidencias, decirlo explícitamente en el texto de la sección.

## Referencia

`MCPS/socket-mcp/mcp.txt` tiene una línea, como el de GitHub:

```
https://docs.socket.dev/docs/remote-socket-mcp
```

## Arquitectura

En `docs/ARCHITECTURE.md`, después de la línea del MCP de GitHub:

- `MCPS/socket-mcp/mcp.txt` es la dirección del MCP de Socket.

## Árbol

`docs/TREE.md` no cambia. `MCPS/` ya está y no lista cada `mcp.txt`.

## Parecido

No hay fichero de `src/logic/` parecido. Es cambio de documentación.

## Firma

No hay firma nueva.

## SQL

No hay SQL.

## Errores

No hay mensaje de la lista «Errores». El fallo de la spec es el reparto mal hecho.

## Decisión

La constitución queda alineada con la spec en las tareas de este desarrollo. No hay pregunta abierta. `tasks.md` espera a que una persona haya leído esta spec y este plan.
