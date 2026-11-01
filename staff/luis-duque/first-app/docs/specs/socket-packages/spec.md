# Comprobar un paquete con Socket

Quien prepara un cambio quiere añadir un paquete de Node o cambiar su versión. Antes de aceptar ese cambio, se mira esa versión con Socket. También se miran las dependencias de esa versión, hasta tres capas.

Entra el paquete y la versión. Entran también sus dependencias, tres capas como máximo. Sale un resumen de cada paquete y versión: si una campaña lo afecta, si tiene alguna alerta y si alguna de sus stats está por debajo de 50. El mismo criterio vale en cada capa.

Las alertas se comentan. Quien acepta el cambio decide si las acepta. Quien prepara el cambio no decide por esa persona.

Si una comprobación no se puede hacer, se dice. No se presenta como si no hubiera avisos.

Queda fuera un paquete que no es de Node. Queda fuera un paquete que ya está y no cambia de versión. Queda fuera una dependencia más allá de la tercera capa.

Esta tarea no instala el paquete y no cambia lo que la aplicación ya hace.
