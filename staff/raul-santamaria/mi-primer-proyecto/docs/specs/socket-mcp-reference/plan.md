# Plan — referencia del MCP de Socket

Issue: #631.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo.

`AGENTS.md` pide campaña, alerta y stats, y no dice qué herramienta
contesta cada dato. En el plan de Prettier y ESLint la campaña y la
alerta quedaron en «no consta» porque solo se llamó a `depscore`.

La constitución dice que un paquete de Node se valida con Socket y que un
humano lee la spec, el plan y las tareas antes de seguir. La spec dice lo
mismo, añade el motivo cuando una fuente no contesta y nombra las dos
paradas. No se contradicen.

## Revisión

Hecha el 29 de octubre de 2026. Organización `ai-engineering`, plan free.

- `depscore` da las cinco stats, de 0 a 100. No lista alertas ni campañas.
  `eslint@10.13.0` y `prettier@3.9.10` están por encima de 50.
- `alerts` responde. Con las alertas abiertas la lista viene vacía, también
  filtrando `eslint`. Lista alertas de paquetes que la organización ya
  vigila. Una lista vacía no dice que esa versión no tenga alerta.
- `threat_feed` responde 403 `threat_feed_not_entitled`. El plan free no
  incluye el threat feed. Una campaña no se puede leer con esta cuenta.
- `curl` a la página de alertas de socket.dev recibe 403 de Cloudflare.
  Esa página no se usa.

## Ficheros

Se tocan:

- `MCPS/socket-mcp/mcp.txt`
- `docs/ARCHITECTURE.md`
- `docs/CONSTITUTIONS.md`
- `AGENTS.md` de mi-primer-proyecto
- `agents/git-workflow-agent.md`

No se toca el `AGENTS.md` de la raíz. No se toca `docs/CONSTITUTIONS.md`
en la parte de las paradas: ya dice que un humano lee la spec, el plan y
las tareas antes de seguir.

No se tocan `docs/TREE.md`, `package.json` ni el código. `docs/TREE.md`
ya lista `MCPS/` y no lista cada `mcp.txt`.

## Referencia

`MCPS/socket-mcp/mcp.txt` tiene una línea, como el de GitHub:

```
https://docs.socket.dev/docs/remote-socket-mcp
```

En `docs/ARCHITECTURE.md`, después de la línea del MCP de GitHub:

```
- `MCPS/socket-mcp/mcp.txt` es la dirección del MCP de Socket.
```

## Constitución

En `docs/CONSTITUTIONS.md`, sección `## Paquetes`, después de la frase
que valida con Socket, se añade este texto:

La referencia del MCP está en `MCPS/socket-mcp/mcp.txt`. La organización
es `ai-engineering`.

Las stats salen de `depscore`, con la versión exacta. Una stat por debajo
de 50 puntos se escribe. 50 no baja.

La alerta sale de `alerts`, con `org_slug` `ai-engineering`. Una lista
vacía es la lista de la organización. No dice que esa versión no tenga
alerta.

La campaña sale de `threat_feed`. Si responde 403
`threat_feed_not_entitled`, el resumen dice que la cuenta no tiene threat
feed. No escribe «no consta».

Si una herramienta no contesta, el resumen dice el motivo. No deja el
dato en blanco.

## Paradas

En `AGENTS.md` de mi-primer-proyecto, sección `## Orden`, después de «No
toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el
plan.»:

Aunque el mismo mensaje pida dejar un fichero, ese proceso solo escribe
`spec.md` y `plan.md`. El fichero queda descrito en el plan.

Después de «Ahí se para. No se implementa.»:

Aunque la persona diga que se implemente, si `tasks.md` no existe o no lo
ha leído, ese proceso escribe `tasks.md` y se para.

La frase de la implementación queda así:

La implementación empieza cuando esa persona ha leído la spec, el plan y
las tareas y lo pide. Ejecuta `tasks.md` y no inventa pasos. «Implementa»
no escribe las tareas y no las ejecuta en la misma respuesta.

En `agents/git-workflow-agent.md`, el objetivo cambia «sin parar el
avance» por «sin parar el avance de ese momento de git».

En el paso 3, «Llama y continúa. No espera un sí.» queda así:

Llama y continúa. No espera un sí entre los pasos de git de ese momento.
Las paradas de «Orden» en `AGENTS.md` siguen: después de `spec.md` y
`plan.md`, y después de `tasks.md`.

## Contrato

No hay función de `logic/`, firma pública ni SQL.
