# Plan — validar paquetes de Node con Socket

Issue: #414.

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. No hay firma
ni SQL nuevo.

El código actual no valida paquetes. `package.json` declara dependencias y no
dice cómo se comprueban.

La constitución no dice que haya que usar Socket. La spec sí. El cómo va en
`AGENTS.MD` y se escribe tal como pide la spec. La consulta a Socket usa el MCP
`socket-mcp` del bootcamp (`MCP.md`, namespace `user-socket-mcp`).

## Ficheros

Se tocan:

- `docs/CONSTITUTIONS.md`
- `AGENTS.MD`

No se toca el `AGENTS.md` de la raíz del repositorio.

No se tocan `package.json`, `pnpm-lock.yaml`, el código ni otras specs ya
escritas.

## Constitución

Se añade una sección `## Paquetes`, después de `## Specs` y antes de
`## Base de datos`, con este texto:

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket.

El procedimiento concreto no va en la constitución; está en `AGENTS.MD`.

## AGENTS.MD

Se añade una sección `## Paquetes`, después de `## Reglas` y antes de
`## Comandos`, con este texto:

### Cuándo

Antes de dar por aceptado un `plan.md` que añade un paquete de Node o cambia su
versión en `package.json`. También antes de ejecutar `tasks.md` que incluya ese
cambio si el plan aún no trae el resumen.

### Qué se revisa

Ecosistema `npm`. Entra el paquete principal con la versión exacta que propone
el plan. Entran sus dependencias hasta **3 capas**, cada una con versión
concreta resuelta (no rangos en el resumen).

Para obtener el árbol hasta 3 capas: partir del manifest publicado de la versión
(`pnpm view <paquete>@<versión> dependencies`, y repetir por cada dependencia
nueva hasta la tercera capa). Si un paquete ya salió en una capa anterior con
la misma versión, no se vuelve a consultar.

### MCP Socket

1. Si el MCP no responde o pide autenticación, usar `mcp_auth` y reintentar. Si
   sigue fallando, no se acepta el plan (spec: no inventar resumen).
2. Llamar a `organizations` y guardar `org_slug` para herramientas de org.
3. Por cada `depname@version` del árbol (capa 0 = directo, 1–3 = dependencias):

   - **`depscore`**: `ecosystem` `npm`, `depname`, `version`. Anotar las stats
     que devuelve Socket. Marcar **stat &lt; 50** cuando cualquier puntuación
     numérica de la respuesta sea menor que 50.
   - **`alerts`**: `org_slug`, `artifact_type` `npm`, `artifact_name` =
     `depname`, `status` `open`. Quedarse con las que correspondan a esa versión
     si la respuesta lo permite.
   - **`threat_feed`**: `org_slug`, `ecosystem` `npm`, `name`, `version`. Si
     hay coincidencia, cuenta como **campaña / threat feed** para el resumen.

4. **Alertas**: las abiertas relevantes se **comentan en la conversación**
   (paquete, versión, tipo o categoría, severidad si viene). No se acepta el
   plan ni se sigue con dependencias hasta que la persona diga si acepta esas
   alertas.

5. **Resumen en el plan**: añadir la sección `## Validación Socket` al
   `plan.md` del desarrollo **antes** de darlo por aceptado. Una fila por
   paquete revisado, con columnas: capa, paquete@versión, campaña (sí/no),
   alertas (sí/no; detalle en conversación), stats &lt; 50 (listar cuáles o
   «ninguna»). Si no hubo incidencias, decirlo explícitamente.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya
versión no cambia en el plan, mirar más de 3 capas, decidir alertas sin la
persona y usar herramientas distintas del MCP Socket para sustituir esta
validación.

## Parecido

No hay fichero de `logic/` parecido. Es cambio de documentación y procedimiento
del agente.

## Firma

No hay firma nueva.

## SQL

No hay SQL.

## Errores

No aplica la lista de «Errores» de la constitución. Si Socket no puede
consultarse, no se acepta el plan hasta repetir la comprobación o acordar otro
camino (spec).

## Validación Socket (plantilla)

En cada plan que cambie dependencias, esta sección se rellena con datos reales
del MCP antes de aceptar el plan:

```markdown
## Validación Socket

| Capa | Paquete@versión | Campaña | Alertas | Stats < 50 |
| --- | --- | --- | --- | --- |
| 0 | ejemplo@1.0.0 | no | no | ninguna |

Alertas comentadas en conversación: (ninguna / listar).
Decisión humana sobre alertas: (pendiente / aceptadas / rechazadas).
```
