# AGENTS.md — first-app

## Proyecto

first-app es la primera app del curso de IA Engineer creada por una alumna junior. Creada a través de interacción con IA. No es una web. Se usa desde la terminal.

Está en Node, con módulos ES (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`). La arquitectura, los campos del usuario, los nombres de las funciones y los mensajes de error están en `docs/CONSTITUTIONS.md`. Ese documento manda sobre el comportamiento de la app.

## Orden

Un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación.

El detalle de los tres ficheros está en `docs/CONSTITUTIONS.md`. `spec.md` es el negocio. `plan.md` es la técnica. `tasks.md` son los pasos.

El primer proceso de un cambio crea `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. Escribe `spec.md` y `plan.md`. Si la constitución, el código actual y la spec dicen lo mismo, escribe también `tasks.md`. Si no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. En ese proceso no se toca ningún otro fichero. Ahí se para.

No hay loop. No se vuelve a escribir el ciclo hasta que un test pase.

Una persona lee lo escrito. El proceso de implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

## Reglas

- Un cambio del proyecto empieza por `docs/specs/<nombre>/`. El primer proceso crea `spec.md` y `plan.md`. Si no hay contradicción, crea también `tasks.md`. No toca ningún otro fichero. Ahí se para.
- El proceso de implementación empieza cuando una persona ha leído esos ficheros y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea y se para.
- No hay loop. Si la constitución, el código actual y la spec no dicen lo mismo, la pregunta queda al final del plan. No se escriben `tasks.md` ni código.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: investiga antes de escribir, compara si la tarea tiene parentesco con otra ya resuelta, y sigue las convenciones y el estilo del código actual.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.
- Si algo falla, se lanza `throw new Error("...")`. No se devuelve `{ ok: false }`. Los textos de error son los de la constitución.

## Comandos

- Ejecutar: no hay comando de arranque. `package.json` no tiene scripts.
- Tests: los `.txt` de `clients/terminal/`. Se pegan en PowerShell desde la raíz del repositorio. El fragmento entra en `first-app` y no captura errores. No hay `npm test`.
- Lint/formato: Prettier, formato estándar. No hay script de lint ni de formato, ni fichero de configuración.

## Estilo y convenciones

El código se escribe en inglés. El proyecto es para personas hispanohablantes: los comentarios pueden ir en español.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` y el manejo de errores están en `docs/CONSTITUTIONS.md`.

El orden del cuerpo es el de la constitución. En una acción que guarda o borra: comprobar lo que llega, llamar a la consulta que busca, lanzar el error si no se puede seguir y llamar a la consulta que guarda o borra. Si guarda, devuelve el usuario plano. Borrar termina en `removeUser` y no devuelve el usuario. `listUsers` no guarda ni borra: lee con `findAll` y devuelve la lista. Si la tabla está vacía, devuelve `[]`. La lógica no abre los `.sql` y no inventa el `id` ni la hora.

El código tiene que leerse de arriba a abajo, con `if` y con nombres que digan qué hacen. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal desde la raíz del repositorio. Ese cliente entra en `first-app`, importa la función de `logic/` y hace `console.log` del resultado. Es el test manual.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
