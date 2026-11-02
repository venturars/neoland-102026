# Repartir la regla de paquetes

Issue: #650.

## Qué se pide

Quien acepta un plan que añade un paquete de Node, o cambia su versión, lo juzga con la regla. La regla dice qué entra, qué resumen tiene que verse y quién decide las alertas. El procedimiento dice cómo se consulta Socket y no repite la regla.

La dirección del servidor de esa consulta queda registrada junto a la del servidor de GitHub. La regla no copia esa dirección.

## Quién lo usa

Quien construye la app con IA y quien acepta el plan.

## Entrada

Un paquete de Node y la versión que el plan propone añadir o cambiar. También sus dependencias, hasta 3 capas, con versión concreta.

## Salida

Un resumen en el plan, antes de aceptarlo. Para cada paquete revisado, el resumen dice si esa versión está en una campaña, si tiene alerta, las puntuaciones de licencia, mantenimiento, calidad, cadena de suministro y vulnerabilidad, y si alguna baja de 50.

Las alertas las decide la persona. Si el resumen no está, o la consulta no se pudo completar, el plan no está listo y no hay tareas. Nadie instala ni cambia versiones de ese desarrollo hasta que la persona haya aprobado la spec y el plan y, si hubo alertas abiertas, las haya aceptado.

Ejemplo: el plan quiere añadir un paquete en una versión concreta. La persona lee la regla y el resumen. Una dependencia trae una alerta. La persona decide si la acepta. El procedimiento indica de qué consulta sale cada dato y no vuelve a escribir el umbral ni la prohibición de instalar.

## Fallo

No hay un fallo de la lista «Errores».

Si la regla y el procedimiento dicen lo mismo dos veces, si el resumen se inventa cuando la consulta no contesta, o si se instala antes de esa aceptación, el reparto no está hecho.

## Fuera

- Comprobar paquetes que no son de Node, un paquete cuya versión no cambia, y más de 3 capas.
- Que el agente decida las alertas.
- Cambiar las reglas de usuarios, la base de datos o los clientes.
- Instalar paquetes o cambiar versiones en este desarrollo.
- Reescribir las specs ya escritas.
- Añadir un momento nuevo al flujo de git.
