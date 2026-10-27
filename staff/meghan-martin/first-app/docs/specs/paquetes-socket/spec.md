# Spec — comprobar un paquete con Socket

Quien prepara un plan quiere añadir un paquete de Node o cambiar su versión. Antes de que ese plan se apruebe, esa versión y sus dependencias se miran con Socket, hasta tres capas.

Entra el paquete y la versión. También entran las dependencias de esa versión, tres capas como máximo. Sale un resumen corto de cada paquete y versión: si está en una campaña, si tiene alertas y si alguna puntuación baja de 50. El mismo criterio vale en cada capa.

Las alertas se escriben. Quien aprueba el plan decide si las acepta. Quien prepara el cambio no decide por esa persona.

## Few-shot

- El plan añade `cli-table3` en una versión nueva. El resumen cubre esa versión y sus dependencias hasta la tercera capa. El plan puede pasar a aprobación.
- Esa versión tiene una alerta. La alerta queda escrita. Quien aprueba el plan dice si se acepta.
- El paquete ya está en la app y la versión no cambia. No hace falta mirarlo con Socket.
- El paquete no es de Node, o la dependencia está más allá de la tercera capa. Queda fuera.

No se instala el paquete en esta tarea. No se cambia el código de la app.
