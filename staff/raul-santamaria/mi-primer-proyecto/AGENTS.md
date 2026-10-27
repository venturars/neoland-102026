# AGENTS.md — mi-primer-proyecto

## Proyecto

Primera app con IA para alumnos junior de AI Engineering. Se construye siguiendo SDD.
Node, módulos ES y una sola base SQLite en `db/users.sqlite`.
Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Comandos

Las dependencias se instalan con pnpm (`pnpm install`). No uses npm ni generes `package-lock.json`.
No hay comando de ejecución. No hay tests. No hay script de lint.
`pnpm format` lanza Prettier. El formato es el estándar de `docs/STYLE.md`, sin configuración propia.

## Estilo

La forma de cada línea y las convenciones están en `docs/STYLE.md`.
El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Los errores están en `docs/ERRORS.md`.

## Reglas

- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código.
- Temperatura próxima a 0. No inventes. Cíñete al plan y a la spec activa.
- Antes de escribir, mira el código ya resuelto que se parezca. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
- Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
- Si la constitución, el código, una spec o esta guía se contradicen, no elijas. Pregúntalo en el plan. No escribas código hasta tener la respuesta.
- Una tarea cada vez. El paso se deja en `- [ ]`.

## Paquetes

Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket antes de aceptar el plan.

Entra el paquete y la versión. También entran las dependencias de ese paquete, hasta 3 capas.

El resumen entra en el plan antes de aceptarlo. Para el paquete y para cada dependencia, el resumen dice si esa versión está en una campaña, si tiene una alerta y si alguna stat está por debajo de 50 puntos.

Las alertas se comentan. Quien acepta el plan decide si las acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.

## Al terminar una tarea

El primer cliente es un `.txt` en `clients/terminal/`. Se pega en la terminal con el directorio actual en `mi-primer-proyecto`. Importa la función de `logic/` y hace `console.log` del resultado.
Antes de dar la tarea por terminada, pega ese fragmento y comprueba que el resultado sale.
Lanza el formato antes de dar la tarea por terminada. El comando es `pnpm format`.
