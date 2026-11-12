# Plan — comprobar un paquete con Socket

Cumple `docs/specs/socket-packages/spec.md`.

No hay función nueva, ni SQL, ni cliente. La aplicación sigue igual.

## Ficheros

Se toca `docs/CONSTITUTIONS.MD`. Se añade una sección «Paquetes». Dice que un paquete de Node nuevo, o un cambio de su versión, se comprueba con Socket antes de aceptar el plan, y que el cómo está en `AGENTS.MD`.

Se toca `AGENTS.MD`. Se añade una sección «Paquetes». El servidor es `socket-mcp`, el de `MCP.md` en la raíz del repositorio. La sección dice:

- La comprobación se hace antes de aceptar un plan que añade un paquete de Node o cambia su versión.
- Se mira ese paquete y esa versión: campaña, alerta y alguna stat por debajo de 50.
- Las alertas se comentan en el plan. Quien acepta el plan decide. El agente no decide.
- Se miran las dependencias hasta 3 capas, con los mismos criterios. Sus alertas también se comentan.
- El plan lleva un resumen antes de aceptarse: paquete, versión, capa, campaña, alertas y stats por debajo de 50.
- Si una comprobación no está disponible, se dice. No se presenta como ausencia de avisos.
- Quedan fuera un paquete que no es de Node, un paquete cuya versión no cambia y una dependencia más allá de la tercera capa.

No se toca `package.json`, `pnpm-lock.yaml`, `logic`, `queries`, `db` ni `clients`. No se toca el `AGENTS.md` de la raíz del repositorio. La línea del desarrollo abierto, en la constitución, se queda como está.

Esta tarea no añade ningún paquete, así que no consulta Socket.
