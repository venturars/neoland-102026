# Validar paquetes de Node con Socket

Issue: #396.

Quien añade un paquete de Node, o cambia su versión, lo comprueba con Socket
antes de aceptar el plan.

Lo usa quien construye la app con IA y quien acepta el plan.

Entra el paquete y la versión. También entran las dependencias de ese paquete,
hasta 3 capas.

Sale un resumen dentro del plan, antes de aceptarlo. Para el paquete y para
cada dependencia, el resumen dice si esa versión está en una campaña, si tiene
una alerta y si alguna stat está por debajo de 50 puntos.

Las alertas se comentan. Quien acepta el plan decide si las acepta.

Ejemplo: se quiere añadir un paquete en una versión concreta. El plan trae el
resumen de ese paquete y de sus dependencias hasta la tercera capa. Una alerta
aparece comentada. La persona decide si sigue con esa versión.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya
versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.
