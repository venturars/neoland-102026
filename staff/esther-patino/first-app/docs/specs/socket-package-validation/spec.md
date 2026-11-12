# Validación de paquetes con Socket

Quien añade un paquete de Node, o cambia su versión, lo valida con Socket antes de aceptar el plan.

Lo usa quien escribe ese plan y quien lo acepta.

Entra el paquete y la versión. También entran las dependencias de ese paquete, hasta 3 capas, con los mismos criterios.

Sale un resumen dentro del plan, antes de aceptarlo. Para el paquete y para cada dependencia, el resumen dice si esa versión está afectada por una campaña, por una alerta, o si alguna de sus stats está por debajo de 50 puntos.

Las alertas se comentan. La persona decide si las acepta.

Ejemplo: el plan quiere añadir un paquete en una versión concreta. El resumen dice que esa versión no está en una campaña, comenta una alerta y señala una stat por debajo de 50. En la primera capa, una dependencia no tiene campaña, no tiene alerta y ninguna stat está por debajo de 50. La segunda y la tercera capa no traen dependencias. La alerta sigue comentada hasta que la persona dice si la acepta.

Si el plan no trae ese resumen, no se acepta. Si hay una alerta y la persona no ha decidido, no se acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.
