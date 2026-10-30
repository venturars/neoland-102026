### Herramienta: VALIDATE_NODE_PACKAGE

- **Descripción**: Úsala al escribir o revisar un `plan.md` que añade un paquete de Node o cambia su versión. No instala dependencias ni toca `package.json` sin plan aceptado.
- **MCP**: El servidor remoto descrito en `MCPS/socket-mcp/mcp.txt`. No uses la web de socket.dev ni `curl`.
- **Contrato**: `docs/CONSTITUTIONS.md`, sección «Paquetes», dice qué herramienta responde cada dato. El procedimiento de alcance y resumen está en `AGENTS.md`, sección «Paquetes».

#### Cuándo

- El plan propone un paquete npm nuevo o una versión distinta de uno ya listado.
- Quedan fuera los ecosistemas que no son Node y los paquetes cuya versión no cambia.

#### Procedimiento

1. Arma la lista con el paquete raíz (nombre y versión exacta) y sus dependencias transitivas, hasta **3 capas**.
2. Por cada entrada npm de esa lista, llama al MCP en este orden:
   - **`depscore`**: `ecosystem` `npm`, `depname`, `version` exacta. Escribe cada stat por debajo de 50 (50 no baja).
   - **`alerts`**: `org_slug` `ai-engineering`. Si la lista viene vacía, dilo tal cual; no concluyas que esa versión no tiene alerta.
   - **`threat_feed`**: `org_slug` `ai-engineering`, con `name` y `version` cuando aplique. Si la respuesta es 403 `threat_feed_not_entitled`, escribe que la cuenta no tiene threat feed (no uses «no consta»).
3. Redacta en español la sección «Paquetes» (o «Paquetes y Socket») del `plan.md`: un bloque por paquete, con campaña, alerta y stats separados y citando la fuente.
4. Comenta las alertas en el plan. Quien acepta el plan decide si las acepta; esta skill no decide.

#### Reglas de invocación

- Si una herramienta no contesta o falla, el resumen nombra el motivo. No dejes huecos ni «no consta» sin haberla consultado.
- No pases de 3 capas de dependencias.
- Si el MCP pide autenticación, autentica y repite la llamada antes de cerrar el plan.
