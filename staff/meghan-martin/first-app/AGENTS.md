# AGENTS.md — first-app

El trabajo de git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md). Las paradas de la app siguen: spec antes del código, y `npm run format` con `npm run lint` antes de terminar.

## Proyecto

first-app es la app de Meghan en este curso. Se construye con IA siguiendo SDD. No es una web: se usa desde la terminal y guarda personas en SQLite.

Las reglas de la app, y el camino a cada tema, están en [docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md). Para escribir código se sigue [docs/STYLE.md](docs/STYLE.md).

## Flujo

Ningún código de una funcionalidad nueva se escribe antes de spec, plan y tasks. Carpeta nueva `docs/specs/<nombre>/`. No se sobrescriben. No hay loop.

1. Constitución.
2. `spec.md`, y revisión humana.
3. `plan.md` y `tasks.md`.
4. Implementación.
5. El ejemplo de `src/clients/terminal/` de esa acción.

El ejemplo de terminal es obligatorio. Un logic ya creado no se reemplaza.

## Git

Cada tarea nueva sigue `docs/GIT-WORKFLOW.md` aunque el prompt no nombre ese fichero. Es una issue, una rama desde `staging` y una pull request en draft hacia `staging`.

La plantilla de la pull request es `.github/pull_request_template.md` de esta app. Si el workspace es el repositorio de la clase, la ruta es `staff/meghan-martin/first-app/.github/pull_request_template.md`.

## Comandos

- No hay comando de arranque de la app. Cada acción se prueba pegando su `src/clients/terminal/*.txt` desde dentro de `first-app`.
- `npm run jupyter`, desde `first-app`, abre la lista de notebooks. La primera vez prepara el Jupyter de esta app.
- No hay tests. `package.json` no tiene script `test`.
- El lock que hay es `package-lock.json`. No hay `pnpm-lock.yaml`.
- `npm run format` lanza Prettier. El formato es el estándar, sin configuración propia.
- `npm run lint` lanza ESLint.

## Estilo

El código va en inglés. Los comentarios de `src/clients/terminal/*.txt` van en español. Esos `.txt` son un bloque `node --input-type=module`. Las acciones de `src/logic/` importan su función y hacen `console.log`. Crear la tabla importa `createUsersTable` y `db`, y muestra el nombre de la tabla.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en la constitución. La frase de error de cada acción está en su plan.

Se lee de arriba abajo, con `if` y con nombres que digan qué hacen. No añadas envoltorios de resultado, clases de error, helpers genéricos ni capas que oculten los pasos.

Prettier sin configuración propia: comillas dobles, punto y coma, coma final, 2 espacios, ancho 80.
- No hay script de lint ni de formato. Cómo queda el código está en [docs/STYLE.md](docs/STYLE.md).

## Reglas

- Lee la constitución y la spec activa antes de tocar código.
- Temperatura próxima a 0. No inventes: cíñete al plan y a la spec activa.
- En cada tarea: mira lo que ya existe antes de escribir. Si se parece a una acción ya hecha, sigue ese patrón.
- Si la constitución, el código, una spec y esta guía no dicen lo mismo, no elijas un lado. La pregunta va al final del plan y se para. No hay código hasta la respuesta.
- No digas que algo funciona si no has ejecutado el ejemplo de terminal.
- `.gitignore` ignora `node_modules/` y los ficheros `*.sqlite`. No subas tampoco `.DS_Store` ni restos de Jupyter (`Untitled.ipynb`).

## Al terminar una tarea
## Paquetes

La regla está en la sección «Paquetes» de [docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md). Aquí solo el cómo, al escribir el plan.

El servidor es el de `MCPS/socket-mcp/mcp.txt`. La entrada se llama `socket-mcp`.

- Las puntuaciones salen de `depscore`, con la versión exacta. Una puntuación por debajo de 50 se escribe. 50 no baja.
- La alerta sale de `alerts`, con la organización `vibecodingneoland` y el nombre del paquete. Solo cuenta una alerta de esa misma versión. Una lista vacía es la de un paquete vigilado. No dice que no haya alerta.
- La campaña sale de `threat_feed`. Si responde 403 `threat_feed_not_entitled`, el resumen dice que la cuenta no tiene ese feed.

Si una herramienta no contesta, el resumen dice el motivo. No escribe «no consta» sin haberla llamado. Quien aprueba el plan decide. Esto no es un momento del flujo de git.

## Al terminar

Al crear una funcionalidad se crea su ejemplo en `src/clients/terminal/`: un `.txt` que se pega con el directorio actual en `first-app`. Importa la función de `src/logic/` y hace `console.log` del resultado. Si la función es async, el ejemplo la espera con `await`. Esa es la comprobación.

Antes de dar la tarea por terminada, lanza `npm run format` y `npm run lint`.

La tarea está terminada solo si hubo spec aprobada, plan, código, y ese ejemplo ejecutado.
