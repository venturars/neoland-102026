# AGENTS.md — mi-primer-proyecto

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Las paradas son las de «Orden». Ese flujo no las quita.

## Proyecto

Primera app con IA para alumnos junior de AI Engineering. Se construye siguiendo SDD.
Node, módulos ES y una sola base SQLite en `db/users.sqlite`.
Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Orden

Lo primero es el orquestador. Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea `docs/specs/<nombre>/` antes de que exista el número de issue. `<nombre>` va en kebab-case.

Con la issue escrita, el proceso siguiente escribe `spec.md` y `plan.md`. La spec abre con `Issue: #N`. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`.

Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe `tasks.md`. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Comandos

Las dependencias se instalan con pnpm (`pnpm install`). No uses npm ni generes `package-lock.json`.
No hay comando de ejecución. No hay tests.
`pnpm format` lanza Prettier. El formato es el estándar de `docs/STYLE.md`, sin configuración propia.
`pnpm lint` lanza ESLint.

## Estilo

La forma de cada línea y las convenciones están en `docs/STYLE.md`.
El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Los errores están en `docs/ERRORS.md`.

## Reglas

- Un cambio del proyecto empieza por el orquestador y sigue «Orden».
- La implementación empieza cuando una persona ha leído la spec, el plan y las tareas y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea y se para.
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
Lanza el lint antes de dar la tarea por terminada. El comando es `pnpm lint`.
