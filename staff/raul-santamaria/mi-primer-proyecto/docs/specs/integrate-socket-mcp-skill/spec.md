# Integrar el MCP de Socket en el flujo de trabajo

Issue: #656.

Quien construye la app con IA y quien acepta el plan necesitan el mismo
camino que con GitHub: una skill que llame al MCP remoto de Socket cuando
un plan propone un paquete de Node nuevo o un cambio de versión.

Entra el paquete, la versión y las dependencias hasta 3 capas. Sale el
resumen en el plan, con campaña, alerta y stats, cada uno con su fuente.
Si una fuente no puede contestar, el resumen dice el motivo.

La constitución guarda las reglas y el contrato de herramientas
(`depscore`, `alerts`, `threat_feed`). `AGENTS.md` guarda cuándo validar y
el procedimiento. La skill ejecuta las llamadas al MCP descrito en
`MCPS/socket-mcp/mcp.txt`.

También entra alinear las rutas de la documentación con el árbol bajo
`src/` (`logic`, clientes terminal, base de datos), como en
`docs/ARCHITECTURE.md`.

Queda fuera instalar paquetes, tocar `package.json`, cambiar código de la
app y mezclar en la constitución el procedimiento que ya vive en
`AGENTS.md` y en la skill.

Quien escribe la spec y el plan se para ahí. No escribe tareas ni aplica
cambios en la misma pasada.
