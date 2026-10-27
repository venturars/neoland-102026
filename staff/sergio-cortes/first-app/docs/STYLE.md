# Estilo y convenciones

El código se escribe en inglés y está pensado para alumnos hispanohablantes.

Ficheros en kebab-case. Funciones en camelCase. El nombre es la acción. Una función, un propósito. Exportaciones con nombre e imports ESM con extensión `.js`. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`). El contrato de `logic/` está en `docs/CONSTITUTIONS.md`. Cómo usar los errores está en `docs/ERRORS.md`.

Una función por fichero. No hay clases, no hay `this` y no hay métodos, salvo las clases definidas en `logic/errors.js`. Pueden añadirse más clases de error en ese fichero.

Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación. `input.name` y `.trim()` van en líneas distintas. Prettier no las junta.

Un fallo de la lista se comprueba con `if` y `throw` de la clase que toca, en su propia línea.

El código se lee de arriba a abajo, con nombres que digan qué hacen. Se escribe como lo escribiría un junior a mano. Se evita el código que un programador sin IA no escribiría: envoltorios de resultado, helpers genéricos y abstracciones que oculten los pasos.

Una constante de fichero va en mayúsculas con guion bajo (`const MODEL`).

El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, indentación de 2 espacios y ancho de 80.
