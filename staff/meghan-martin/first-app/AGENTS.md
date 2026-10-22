# AGENTS.md — first-app

## Proyecto

first-app es la app de Meghan en este curso. Se construye con IA siguiendo SDD. No es una web: se usa desde la terminal y guarda personas en SQLite.

Está en `staff/meghan-martin/first-app`, en Node, con módulos ES (`"type": "module"`) y `node:sqlite`. La conexión es `db/connection.js`. El fichero por defecto es `db/users.sqlite`; si existe `USERS_DB_PATH`, se usa ese. La arquitectura, la base de datos y qué llevan spec, plan y tasks están en `docs/CONSTITUTIONS.md`. Léelo antes de cambiar código.

## Flujo

Ningún código de una funcionalidad nueva se escribe antes de spec, plan y tasks. Carpeta nueva `docs/specs/<nombre>/`. No se sobrescriben. No hay loop.

1. Constitución.
2. `spec.md`, y revisión humana.
3. `plan.md` y `tasks.md`.
4. Implementación.
5. El ejemplo de `clients/terminal/` de esa acción.

El ejemplo de terminal es obligatorio. Un logic ya creado no se reemplaza.

## Git

Cada tarea nueva sigue `docs/GIT-WORKFLOW.md` aunque el prompt no nombre ese fichero. Es una issue, una rama desde `staging` y una pull request en draft hacia `staging`.

La plantilla de la pull request es `.github/pull_request_template.md` de esta app. Si el workspace es el repositorio de la clase, la ruta es `staff/meghan-martin/first-app/.github/pull_request_template.md`.

## Comandos

- No hay comando de arranque. Cada acción se prueba pegando su `clients/terminal/*.txt` desde dentro de `first-app`.
- No hay tests. `package.json` no tiene script `test`.
- El lock que hay es `package-lock.json`. No hay `pnpm-lock.yaml`.
- Prettier, formato estándar. No hay script de lint ni de formato.

## Estilo

El código va en inglés. Los comentarios de `clients/terminal/*.txt` van en español. Esos `.txt` son un bloque `node --input-type=module`. Las acciones de `logic/` importan su función y hacen `console.log`. Crear la tabla importa `createUsersTable` y `db`, y muestra el nombre de la tabla.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en la constitución. La frase de error de cada acción está en su plan.

Se lee de arriba abajo, con `if` y con nombres que digan qué hacen. No añadas envoltorios de resultado, clases de error, helpers genéricos ni capas que oculten los pasos.

Prettier sin configuración propia: comillas dobles, punto y coma, coma final, 2 espacios, ancho 80.

## Reglas

- Lee la constitución y la spec activa antes de tocar código.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: mira lo que ya existe antes de escribir. Si se parece a una acción ya hecha, sigue ese patrón.
- Si la constitución, el código, una spec y esta guía no dicen lo mismo, no elijas un lado. La pregunta va al final del plan y se para. No hay código hasta la respuesta.
- No digas que algo funciona si no has ejecutado el ejemplo de terminal.
- `.gitignore` ignora `node_modules/` y los ficheros `*.sqlite`. No subas tampoco `.DS_Store` ni restos de Jupyter (`Untitled.ipynb`).

## Al terminar

Al crear una funcionalidad se crea su ejemplo en `clients/terminal/`: un `.txt` que se pega con el directorio actual en `first-app`. Importa la función de `logic/` y hace `console.log` del resultado. Si la función es async, el ejemplo la espera con `await`. Esa es la comprobación.

La tarea está terminada solo si hubo spec aprobada, plan, código, y ese ejemplo ejecutado.
