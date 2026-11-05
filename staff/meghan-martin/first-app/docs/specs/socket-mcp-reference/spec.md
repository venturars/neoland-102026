# Spec — referencia del MCP de Socket

Quien prepara un plan quiere añadir un paquete de Node o cambiar su versión. Antes de aprobar ese plan, esa versión y sus dependencias se miran con Socket, hasta tres capas.

Entra el paquete y la versión exacta. También entran las dependencias de esa versión, tres capas como máximo. Sale un resumen en el plan: si esa versión está en una campaña, si tiene una alerta y si alguna puntuación baja de 50. Cada dato dice de dónde sale. Si una fuente no puede contestar, el resumen dice el motivo. No escribe que no consta sin haberla consultado.

La persona que aprueba el plan decide si acepta una alerta. Quien prepara el cambio no decide por ella.

## Few-shot

- Las puntuaciones se leen y ninguna baja de 50. El resumen lo dice.
- La lista de alertas de ese paquete y esa versión está vacía. El resumen dice que no hay alerta en un paquete vigilado. No dice que el paquete sea seguro.
- La campaña no se lee porque la cuenta no tiene esa fuente. El resumen escribe el motivo.
- El paquete no es de Node, la versión no cambia, o la dependencia pasa de la tercera capa. Queda fuera.

Quien escribe la spec y el plan se para ahí, para que una persona los lea. Quien escribe las tareas no aplica los cambios hasta que esa persona lo pida.

No se instala el paquete en esta tarea. No se cambia `package.json`. El token no se guarda en el repositorio.
