# AGENTS.md — first-app

## Proyecto

first-app es la primera app del curso de IA Engineer para alumnos junior. Sirve para construirla con IA siguiendo el sistema SDD.

Está en Node, con módulos ESM (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`) y pnpm como gestor de paquetes. La arquitectura y las reglas de base están en `docs/CONSTITUTIONS.md`.

## Orden

Un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación.

El primer proceso crea `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. Escribe `spec.md` y `plan.md`. Si la constitución, el código actual y la spec dicen lo mismo, escribe también `tasks.md`. Si no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. En ese proceso no se toca ningún otro fichero. Ahí se para.

Una persona lee lo escrito. El proceso de implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

El camino issue, rama y pull request del bootcamp está en `docs/GIT-WORKFLOW.md`, en la raíz del repositorio. Dentro de first-app, cualquier funcionalidad nueva sigue SDD (spec antes que código), aunque ya exista issue en GitHub.

## Reglas

- Un cambio del proyecto empieza por `docs/specs/<nombre>/`. El primer proceso crea `spec.md` y `plan.md`. Si no hay contradicción, crea también `tasks.md`. No toca ningún otro fichero. Ahí se para.
- El proceso de implementación empieza cuando una persona ha leído esos ficheros y lo pide. Ese proceso solo ejecuta `tasks.md`.
- Lee `docs/CONSTITUTIONS.md` y la spec activa antes de tocar código. Si no hay spec para ese cambio, se crea (proceso de spec) y se para.
- No inventar ficheros, capas, campos ni enlaces.
- Añadir código, dependencias, scripts, tests, SQL o clientes solo cuando el usuario lo pida en esa tarea.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- Usar pnpm como gestor de paquetes.
- En cada tarea: investiga antes de escribir, compara si la tarea tiene parentesco con otra ya resuelta, y sigue las convenciones y el estilo del código actual.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.

## Comandos

- Ejecutar: no hay comando.
- Tests: no hay. El script `test` de `package.json` termina en error. No se añaden tests ni se cambia ese script.
- Lint/formato: Prettier por defecto. No hay `.prettierrc` ni script de formato.

## Estilo y convenciones

El código se escribe en inglés y está pensado para alumnos hispanohablantes.

- Ficheros en kebab-case.
- Funciones en camelCase. El nombre es la acción. Una función, un propósito.
- Constante de fichero en mayúsculas con guion bajo (`const MODEL`).
- El código tiene que leerse de arriba a abajo, con `if` y con nombres que digan qué hacen. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, helpers genéricos y abstracciones que oculten los pasos.
- Las clases de error se describen en `docs/CONSTITUTIONS.md`.
- El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
