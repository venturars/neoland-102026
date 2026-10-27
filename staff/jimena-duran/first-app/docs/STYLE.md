# Estilo

El código fuente se redacta en inglés. Los comentarios de los clientes de terminal pueden estar en español para facilitar el aprendizaje de alumnos hispanohablantes.

Usa nombres de fichero en kebab-case, variables y funciones en camelCase, exportaciones con nombre e imports ESM que incluyan `.js`.

El flujo debe poder leerse de principio a fin. Prefiere condicionales claros y nombres descriptivos. No añadas envoltorios de resultados, jerarquías de errores, helpers genéricos ni abstracciones que oculten los pasos que un principiante necesita ver.

Cada línea contiene una sola acción: una llamada o una comprobación.
Obtener `input.name` y aplicar `.trim()` se escribe en líneas distintas.
Las comprobaciones con `if` y su `throw new Error` van en líneas separadas.
No se permiten clases, `this` ni métodos.

Aplica el formato estándar de Prettier: comillas dobles, punto y coma, coma final, dos espacios de indentación y líneas de hasta 80 columnas.

Los valores fijos se declaran como constantes en MAYÚSCULAS; las variables normales usan camelCase.

Cada archivo de `logic/` exporta una sola función. La firma define el nombre, las entradas y la salida, y no se acompaña de un comentario de contrato. Las acciones usan nombres como `createUser`, `updateUser`, `deleteUser` y `listUsers`; los argumentos se declaran directamente (`name`, `email`, `id`) en vez de envolverlos en un objeto cuando ya se conocen.
