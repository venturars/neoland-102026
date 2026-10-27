# Estilo

El código y los nombres técnicos se escriben en inglés. Los comentarios de los clientes de terminal se escriben en español.

Los ficheros van en kebab-case. Las funciones y las variables van en camelCase. Los exports son con nombre. Los imports de JavaScript llevan la extensión `.js`. El SQL usa parámetros con nombre. No hay envoltorios ni helpers genéricos. El formato es el estándar de Prettier. Una constante va en mayúsculas.

Una función por fichero, sin clases, sin `this` y sin métodos. Un usuario sigue siendo un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`. Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación, así que `input.name` y `.trim()` van en líneas distintas y Prettier no las junta. Un fallo de la lista se comprueba con `if` y `throw new Error` en su propia línea. Se escribe como lo escribiría un junior a mano.
