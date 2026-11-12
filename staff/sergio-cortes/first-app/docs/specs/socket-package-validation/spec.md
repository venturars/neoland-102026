# Validar paquetes de Node con Socket

Issue: #414.

## Qué se pide

Antes de aceptar un plan que añade un paquete de Node o cambia su versión, se comprueba ese paquete con Socket. Lo mismo para las dependencias de ese paquete, hasta 3 capas.

El plan incluye un resumen de la comprobación antes de aceptarlo. Para el paquete principal y para cada dependencia revisada, el resumen dice si esa versión está en una campaña, si tiene alerta y si alguna stat está por debajo de 50 puntos.

Las alertas se comentan en la conversación. Quien acepta el plan decide si las acepta.

## Quién lo usa

Quien construye la app con IA y quien lee y acepta el plan de un desarrollo.

## Entrada

- El nombre del paquete de Node y la versión que el plan propone añadir o cambiar.
- Las dependencias de ese paquete, hasta la tercera capa, con la versión que resuelve el árbol para cada una.

## Salida

Un resumen escrito dentro del plan, antes de darlo por aceptado. Para cada paquete revisado (el principal y cada dependencia hasta 3 capas), el resumen indica:

- si esa versión está afectada por una campaña;
- si tiene alertas (detalladas aparte en la conversación);
- las puntuaciones **license**, **maintenance**, **quality**, **supplyChain** y **vulnerability** de Socket (`depscore`, 0–100);
- si alguna stat está por debajo de 50 puntos (columna aparte que resume incidencias).

Ejemplo: el plan quiere añadir un paquete en una versión concreta. El resumen lista ese paquete y sus dependencias hasta la tercera capa. Una dependencia de la segunda capa tiene una stat por debajo de 50 y otra trae una alerta. La alerta aparece comentada; la persona decide si sigue con esas versiones antes de aceptar el plan.

## Fallo

Si Socket no puede consultarse, no se da el plan por aceptado hasta repetir la comprobación o acordar otro camino. No se inventa un resumen.

## Fuera

- Comprobar paquetes que no son de Node.
- Comprobar un paquete cuya versión no cambia en el plan.
- Mirar más de 3 capas de dependencias.
- Que la IA decida por sí sola si se aceptan las alertas.
- Cambiar el comportamiento de las funcionalidades de usuarios que ya existen.
