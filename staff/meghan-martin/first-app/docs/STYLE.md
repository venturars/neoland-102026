# Estilo

El código va en inglés. Los comentarios de `clients/terminal/*.txt` van en español. Esos `.txt` son un bloque `node --input-type=module`. Las acciones de `logic/` importan su función y hacen `console.log`. Crear la tabla importa `createUsersTable` y `db`, y muestra el nombre de la tabla.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con `.js`. El contrato de `logic/` está en [CONSTITUTIONS.md](CONSTITUTIONS.md).

Se lee de arriba abajo, con `if` y con nombres que digan qué hacen. No añadas envoltorios de resultado, clases de error, helpers genéricos ni capas que oculten los pasos.

Prettier sin configuración propia: comillas dobles, punto y coma, coma final, 2 espacios, ancho 80.
