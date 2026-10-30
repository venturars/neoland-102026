# Plan — validación de paquetes con Socket

Documentación. No reemplaza ningún fichero de `logic/`. No guarda datos. No instala un paquete.

El código actual no valida paquetes. `package.json` declara dependencias y no dice cómo se comprueban.

La constitución no dice que haya que usar Socket. La spec sí. No hay otra regla que diga lo contrario. El cómo va en el `AGENTS.md` de first-app.

## Ficheros

Se tocan:

- `docs/CONSTITUTIONS.md` — lo fundamental: hay que validar el paquete con Socket
- `AGENTS.md` de first-app — cómo se hace esa validación

No se toca el `AGENTS.md` de la raíz.

No se tocan `package.json`, el código ni las specs ya escritas.

## Parecido

No hay fichero de `logic/` al que se parezca. El cambio deja una regla de trabajo. La constitución manda el qué. `AGENTS.md` manda el cómo, igual que ya manda el orden de un cambio.


## Errores

Ningún fallo de esta spec usa un mensaje de la sección 6. El fallo se ve en el plan: sin el resumen no se acepta, y una alerta no queda aceptada hasta que la persona lo dice.

## Constitución

Se añade la sección `## 9. Validación de paquetes`, después de la sección 8, con este texto:

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket. El cómo está en `AGENTS.md`.

## AGENTS.md

Se añade una sección `## Validación de paquetes`, después de `## Reglas` y antes de `## Comandos`, con este texto:

Cada vez que un plan añade un paquete de Node o cambia su versión, el chequeo es automático. Se hace con el MCP `socket-mcp` de `MCP.md`, antes de aceptar el plan.

Se mira el paquete y la versión: si una campaña lo afecta, si una alerta lo afecta, o si alguna de sus stats está por debajo de 50 puntos.

Las alertas se comentan en el plan. La persona decide si las acepta.

Se miran las dependencias de ese paquete hasta 3 capas. Cada capa sigue los mismos criterios.

El resumen de ese chequeo entra en el plan antes de aceptarlo.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.
