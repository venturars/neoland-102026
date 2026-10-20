# AGENTS.md — first-app

## Proyecto

Está en Node, con módulos ES (`"type": "module"`) y SQLite (`node:sqlite`, fichero `db/users.sqlite`). La arquitectura y las reglas de base están en `docs/CONSTITUTIONS.md`.

## Comandos

- Ejecutar: no hay comando de ejecución todavía.
- Tests: no hay tests. El script `test` de `package.json` es el placeholder de pnpm.
- Lint/formato: Prettier, formato estándar. No hay script de lint ni de formato.

## Estilo y convenciones

El código se escribe en inglés. Los comentarios de los clientes de terminal están en español, porque el proyecto es para alumnos hispanohablantes.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` y el manejo de errores están en `docs/CONSTITUTIONS.md`.

El código tiene que leerse de arriba a abajo, con `if` y con nombres que digan qué hacen. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.

## Reglas

- Lee docs/CONSTITUTIONS.md y la spec activa antes de tocar código.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: investiga antes de escribir, compara si la tarea tiene parentesco con otra ya resuelta, y sigue las convenciones y el estilo del código actual.
- Si aparecen dos fuentes de verdad o dos procedimientos que se contradicen (la constitución, el código actual, una spec o esta guía), no se elige uno. En el plan se pregunta qué camino seguir y si hay que modificar la documentación antes de empezar la spec nueva. No se escribe código hasta tener esa respuesta.
- No propongas código que no se haya comprobado.

## Al terminar una tarea

- Al crear una funcionalidad se crea su primer cliente en `clients/terminal/`, un `.txt` que se pega en la terminal con el directorio actual en `first-app`. Ese cliente importa la función de `logic/` y hace `console.log` del resultado. Es el test manual básico.
- Comprueba que el desarrollo nuevo funciona antes de dar la tarea por terminada. La comprobación es ejecutar ese fragmento de `clients/terminal/`.
