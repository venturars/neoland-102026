# Alertas Socket relevantes al validar paquetes

Issue: #908.

Quien añade un paquete de Node, o cambia su versión, sigue comprobándolo con
Socket antes de aceptar el plan. El resumen del plan solo debe incluir alertas
útiles para decidir sobre **esa versión concreta**, no el ruido de toda la
organización.

Lo usa quien construye la app con IA y quien acepta el plan.

Entra el paquete y la versión exacta del plan. También entran las dependencias,
hasta 3 capas, con la misma regla.

Sale un resumen antes de aceptar el plan. Para cada paquete revisado, el
resumen dice campaña, alertas **aplicables** y stats. Una alerta aplicable es
la de la misma versión del plan y del contexto de este repositorio; no entran
alertas de otras versiones, de otros repos del bootcamp ni avisos informativos
de upgrade (p. ej. que existe una versión más nueva sin ser una vulnerabilidad
sobre la versión elegida).

Si Socket responde que no hay cuota (créditos agotados), la revisión **se
detiene**: el resumen explica el motivo, qué datos faltan y no se sigue
consultando Socket en esa validación ni se inventan resultados.

Las alertas aplicables se comentan. Quien acepta el plan decide si las acepta.

Ejemplo: el plan fija `express@5.3.0`. En la org hay CVEs abiertos de
`body-parser@1.20.3` y avisos `socketUpgradeAvailable` en dependencias transitivas
de otras versiones. El resumen no los lista. Solo comenta una alerta de
`proxy-addr@2.0.7` si esa es la versión del plan y aplica a este repo.

Ejemplo: la primera llamada a Socket devuelve cuota agotada. El resumen dice
que la cuota se agotó, que stats y alertas quedaron sin revisar, y no hay más
consultas Socket en ese plan hasta que una persona recargue o espere.

Queda fuera cambiar el número de capas de dependencias, decidir alertas por la
persona, configurar notificaciones de email o Slack en socket.dev, usar Socket
cuando la cuota no permite contestar, y **modificar** `AGENTS.md` o
`docs/CONSTITUTIONS.md` (reglas solo en la referencia MCP y guías que la tarea
autorice).
