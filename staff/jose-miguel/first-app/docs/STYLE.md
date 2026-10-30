# Estilo y convenciones

El código se escribe en inglés. Los comentarios de los clientes de terminal están en español, porque el proyecto es para alumnos hispanohablantes.

Ficheros en kebab-case, funciones y variables en camelCase, exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Los errores están en `docs/ERRORS.md`.

Una función por fichero. No hay clases, no hay `this` y no hay métodos.

Un usuario es un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`.

Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación. `input.name` y `.trim()` van en líneas distintas. Prettier no las junta.

Un fallo de la lista se comprueba con `if` y `throw new Error`, en su propia línea.

Se escribe como lo escribiría un junior a mano. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, clases de error, helpers genéricos y abstracciones que oculten los pasos.

Un nombre en mayúsculas es un valor fijo. No cambia durante la ejecución. Si el nombre tiene varias palabras, van en mayúsculas y se separan con `_`. `MAX_NAME_LENGTH` es una constante. `trimmedName` es una variable normal y sigue en camelCase.

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.
