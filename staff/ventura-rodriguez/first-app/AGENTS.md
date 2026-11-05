# AGENTS.md — first-app

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Las paradas son las de «Orden». Ese flujo no las quita.

## Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Las reglas de base están en `docs/CONSTITUTIONS.md`. Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

## Orden

Lo primero es el orquestador. Elige un momento y llama a ese subagente como un agente aparte. El padre no entrevista, no crea la issue y no ejecuta el git ni el MCP de ese momento.

No se crea `docs/specs/<nombre>/` antes de que exista el número de issue. `<nombre>` va en kebab-case.

Con la issue escrita, el proceso siguiente escribe `spec.md` y `plan.md`. La spec abre con `Issue: #N`. No toca ningún otro fichero. Ahí se para. Una persona revisa la spec y el plan.

Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`.

Si dicen lo mismo y la persona ha revisado, el siguiente proceso escribe `tasks.md`. Ahí se para. No se implementa.

La implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Reglas

- Un cambio del proyecto empieza por el orquestador y sigue «Orden».
- La implementación empieza cuando una persona ha leído la spec, el plan y las tareas y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee docs/CONSTITUTIONS.md y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea y se para.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: investiga antes de escribir y compara si la tarea tiene parentesco con otra ya resuelta. El código que ya existe sirve para ver a qué fichero se parece una función nueva. La forma de cada línea se copia de `docs/STYLE.md`. Un spec nuevo no se para porque el código ya escrito no tenga esa forma.
- Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.

## Paquetes

Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket antes de aceptar el plan.

Entra el paquete y la versión. También entran las dependencias de ese paquete, hasta 3 capas.

El resumen entra en el plan antes de aceptarlo. Para el paquete y para cada dependencia, el resumen dice si esa versión está en una campaña, si tiene una alerta y si alguna stat está por debajo de 50 puntos.

Las alertas se comentan. Quien acepta el plan decide si las acepta.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.

## Comandos

- Ejecutar: no hay comando de ejecución todavía.
- Tests: no hay tests. El script `test` de `package.json` es el placeholder de pnpm.
- Lint/formato: `pnpm format` lanza Prettier. El formato es el estándar, sin configuración propia. `pnpm lint` lanza ESLint.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
- Lanza el formato antes de dar la tarea por terminada. El comando es `pnpm format`.
- Lanza el lint antes de dar la tarea por terminada. El comando es `pnpm lint`.
