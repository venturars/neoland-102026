# Referencia del MCP de Socket

Issue: #651.

## Qué se pide

Quien comprueba un paquete de Node tiene la referencia del MCP de Socket junto a la del MCP de GitHub. Además, la sección «Paquetes» de `docs/CONSTITUTION.md` dice con qué herramienta de Socket se escribe cada dato.

## A quién obliga

A quien construye la app con IA y a quien acepta el plan que añade un paquete de Node o cambia su versión.

## La regla

- Entra el paquete y la versión. También entran las dependencias de ese paquete, hasta 3 capas.
- Sale el resumen en el plan, antes de aceptarlo. Separa tres datos: si esa versión está en una campaña, si tiene una alerta y si alguna stat está por debajo de 50 puntos.
- Cada dato se escribe con la herramienta de Socket que le corresponde y dice de dónde sale.
- Si esa herramienta no puede contestar, el resumen dice el motivo que devolvió. No se escribe «no consta» sin haberla llamado.

## Ejemplo correcto

Las stats se leen y ninguna baja de 50. La lista de alertas de la organización está vacía y el resumen lo dice así. La campaña no se lee porque la cuenta no tiene esa fuente y el resumen da ese motivo. La persona decide con eso escrito.

## Ejemplo que no se sigue

El plan de un paquete dice «Campaña: no consta. Alerta: no consta» sin haber llamado a ninguna herramienta de Socket. Es lo que pasó en el plan de Prettier y ESLint.

## Cómo se comprueba

- Existe `MCPS/socket-mcp/mcp.txt` con una sola línea, como `MCPS/github-mcp-server/mcp.txt`.
- «Paquetes» de `docs/CONSTITUTION.md` nombra una herramienta para cada uno de los tres datos.
- Un resumen con «no consta» sin llamada a la herramienta no se acepta.

## Queda fuera

Comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona. Cambiar el flujo de git.
