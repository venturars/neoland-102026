# Referencia del MCP de Socket

Issue: #583.

Quien comprueba un paquete de Node tiene la referencia del MCP de Socket
junto a la del MCP de GitHub.

Lo usa quien construye la app con IA y quien acepta el plan.

Entra el paquete y la versión. También entran las dependencias de ese
paquete, hasta 3 capas.

Sale el resumen en el plan, antes de aceptarlo. El resumen separa tres
datos: si esa versión está en una campaña, si tiene una alerta y si alguna
stat está por debajo de 50 puntos. Cada dato dice de dónde sale. Si esa
fuente no puede contestar, el resumen dice el motivo. No escribe que no
consta sin haberla consultado.

Ejemplo: las stats se leen y ninguna baja de 50. La lista de alertas de la
organización está vacía y el resumen lo dice así. La campaña no se lee
porque la cuenta no tiene esa fuente. La persona decide con eso escrito.

Quien escribe la spec y el plan se para ahí. En ese momento no escribe
las tareas ni ningún otro documento, aunque el mismo mensaje pida dejar
un fichero. Ese fichero queda descrito en el plan.

Quien escribe las tareas se para ahí. En ese momento no aplica los
cambios, aunque se diga que se implemente. Los cambios empiezan cuando
una persona ha leído las tareas y lo pide.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete
cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la
persona. Queda fuera saltar esas dos paradas porque el flujo de git sigue
sin esperar un sí.
