# Plan — validar paquetes de Node con Socket

Issue: #396.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo.

El código actual no valida paquetes. `package.json` declara dependencias y no
dice cómo se comprueban.

La constitución no dice que haya que usar Socket. La spec sí. El cómo va en el
`AGENTS.md` de first-app y se escribe tal como pide la spec.

## Ficheros

Se tocan:

- `docs/CONSTITUTIONS.md`
- `AGENTS.md` de first-app

No se toca el `AGENTS.md` de la raíz.

No se tocan `package.json`, el código ni las specs ya escritas.

## Constitución

Se añade una sección `## Paquetes`, después de `## Specs`, con este texto:

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket.

## AGENTS.md

Se añade una sección `## Paquetes`, después de `## Reglas` y antes de
`## Comandos`, con este texto:

Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket
antes de aceptar el plan.

Entra el paquete y la versión. También entran las dependencias de ese paquete,
hasta 3 capas.

El resumen entra en el plan antes de aceptarlo. Para el paquete y para cada
dependencia, el resumen dice si esa versión está en una campaña, si tiene una
alerta y si alguna stat está por debajo de 50 puntos.

Las alertas se comentan. Quien acepta el plan decide si las acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya
versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.

## Contrato

No hay función de `logic/`, firma pública ni SQL.
