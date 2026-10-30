# AGENTS.md — first-app

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta.

## Proyecto

first-app es la primera app del curso de IA Engineer creada por una alumna junior. Creada a través de interacción con IA. No es una web. Se usa desde la terminal.

Está en Node, con módulos ES (`"type": "module"`) y SQLite (`node:sqlite`, fichero `src/db/users.sqlite`). Los campos del usuario están en `docs/CONSTITUTIONS.md`. Ese documento manda sobre el comportamiento de la app. La arquitectura está en `docs/ARCHITECTURE.md`. Los mensajes de error están en `docs/errors.md`. Los nombres de las funciones están en `docs/style.md`.

## Orden

Un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación.

El detalle de los tres ficheros está en `docs/CONSTITUTIONS.md`. `spec.md` es el negocio. `plan.md` es la técnica. `tasks.md` son los pasos.

El primer proceso de un cambio crea `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. Escribe `spec.md` y `plan.md`. Si la constitución, el código actual y la spec dicen lo mismo, escribe también `tasks.md`. Si no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. En ese proceso no se toca ningún otro fichero. Ahí se para.

No hay loop. No se vuelve a escribir el ciclo hasta que un test pase.

Una persona lee lo escrito. El proceso de implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Reglas

- Un cambio del proyecto empieza por `docs/specs/<nombre>/`. El primer proceso crea `spec.md` y `plan.md`. Si no hay contradicción, crea también `tasks.md`. No toca ningún otro fichero. Ahí se para.
- El proceso de implementación empieza cuando una persona ha leído esos ficheros y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md`, `docs/style.md`, `docs/ARCHITECTURE.md`, `docs/database.md`, `docs/errors.md`, `docs/tree.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea y se para.
- No hay loop. Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan. No se escriben `tasks.md` ni código.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: investiga antes de escribir, compara si la tarea tiene parentesco con otra ya resuelta, y sigue las convenciones y el estilo del código actual.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.
- Si algo falla, se lanza `throw new Error("...")`. No se devuelve `{ ok: false }`. Los textos de error son los de la constitución.

## Validación de paquetes

Cada vez que un plan añade un paquete de Node o cambia su versión, el chequeo es automático. Se hace con el MCP `socket-mcp` de `MCP.md`, antes de aceptar el plan.

Se mira el paquete y la versión: si una campaña lo afecta, si una alerta lo afecta, o si alguna de sus stats está por debajo de 50 puntos.

Las alertas se comentan en el plan. La persona decide si las acepta.

Se miran las dependencias de ese paquete hasta 3 capas. Cada capa sigue los mismos criterios.

El resumen de ese chequeo entra en el plan antes de aceptarlo.

Queda fuera comprobar paquetes que no son de Node, comprobar un paquete cuya versión no cambia, mirar más de 3 capas y decidir las alertas por la persona.

## Comandos

Los comandos están en `docs/style.md`.

## Estilo y convenciones

El estilo está en `docs/style.md`.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `src/clients/terminal/`, un `.txt` que se pega en la terminal desde la raíz del repositorio. Ese cliente entra en `first-app`, importa la función de `src/logic/` y hace `console.log` del resultado. Es el test manual.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `src/clients/terminal/`.
- Antes de dar la tarea por terminada se lanza `format`. Aplica Prettier con el formato estándar.
- Antes de dar la tarea por terminada se lanza `lint`. ESLint avisa de la sintaxis y de las reglas de código.
