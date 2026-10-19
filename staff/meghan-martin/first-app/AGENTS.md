# AGENTS.md — first-app

## Qué es este proyecto

Una app junior en Node (`"type": "module"`, `node:sqlite`) en `staff/meghan-martin/first-app`. La arquitectura y los mensajes de error están en `docs/CONSTITUTIONS.md`. Lee ese archivo antes de cambiar código.

## Comandos

- No hay script de arranque. Las funcionalidades se prueban pegando `clients/terminal/*.txt` desde dentro de `first-app`.
- Tests: `npm test`. Usan una base temporal. No deben cambiar `db/users.sqlite`.
- Formato: Prettier normal (comillas dobles, punto y coma, coma final, 2 espacios, ancho 80).

## Cómo escribir código aquí

- Inglés en los `.js`. Comentarios en español están bien en los `.txt` de terminal.
- Ficheros: kebab-case. Funciones: camelCase. Imports ESM con `.js`.
- El SQL usa parámetros con nombre (`:id`, `:name`, `:email`).
- Prefiere `if` y nombres claros. No añadas envoltorios de resultado, clases de error propias ni capas extra que oculten los pasos.
- No subas a git `db/users.sqlite`, `.DS_Store` ni restos de Jupyter (`Untitled.ipynb`).

## Reglas

- Sigue `docs/CONSTITUTIONS.md`. No inventes una segunda base de datos ni otro estilo de errores.
- Parece al código actual. Si una tarea se parece a create-user, copia ese patrón.
- Si la constitución, este archivo, una spec y el código no coinciden, para y pregunta cuál seguir. No elijas un lado en silencio.
- No digas que algo funciona si no has ejecutado `npm test` o el snippet de terminal.

## Cuando una tarea está terminada

- Fichero nuevo en logic + nuevo `clients/terminal/*.txt` que lo importa y hace `console.log` del resultado.
- Ejecuta ese snippet y `npm test` antes de dar el trabajo por cerrado.
