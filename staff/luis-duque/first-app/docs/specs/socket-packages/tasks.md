# Tareas — comprobar un paquete con Socket

1. Abre `docs/CONSTITUTIONS.MD`.
   Después de «Desarrollos», añade la sección «Paquetes».
   El texto dice que un paquete de Node nuevo, o un cambio de su versión, se comprueba con Socket antes de aceptar el plan, y que el cómo está en `AGENTS.MD`.
   La línea del desarrollo abierto se queda igual. La sección se puede leer.

2. Abre `AGENTS.MD` y, antes de «Git», añade «Paquetes».
   Antes de aceptar un plan que añade un paquete de Node o cambia su versión, se comprueba con `socket-mcp` de `MCP.md`: campaña, alerta y stat bajo 50, también hasta 3 capas.
   Las alertas se comentan y las decide quien acepta el plan. El resumen entra en el plan. Si una comprobación no está, se dice.
   Queda fuera lo que no es de Node, lo que no cambia de versión y lo que pasa de la tercera capa.

3. Lee `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
   La sección «Paquetes» está en los dos y coincide con el plan.
   `package.json`, `logic`, `queries`, `db` y `clients` siguen igual.
   No se ha consultado Socket.
