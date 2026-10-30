# Estilo

## Quién escribe y quién lee

La desarrolladora es junior. El código es sencillo, explícito y lineal, se lee de arriba abajo, usa nombres descriptivos y se divide en pasos visibles. Una solución más larga es preferible si resulta más fácil de comprender.

Se evitan las abstracciones prematuras, los patrones de diseño no solicitados y las dependencias externas innecesarias.

## Forma del código

El código y los nombres técnicos se escriben en inglés. Los comentarios de los clientes de terminal se escriben en español.

Los ficheros van en kebab-case. Las funciones y las variables van en camelCase. Los exports son con nombre. Los imports de JavaScript llevan la extensión `.js`. El SQL usa parámetros con nombre. No hay envoltorios ni helpers genéricos. El formato es el estándar de Prettier. Una constante va en mayúsculas.

Una función por fichero, sin clases, sin `this` y sin métodos. Un usuario sigue siendo un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`. Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación, así que `input.name` y `.trim()` van en líneas distintas y Prettier no las junta. Un fallo de la lista se comprueba con `if` y `throw new Error` en su propia línea. Se escribe como lo escribiría un junior a mano.

## Comentarios

Los comentarios son material de estudio: la desarrolladora debe poder aprender el código leyéndolos. Se escriben cuando se crea una funcionalidad o se modifica código con autorización, en inglés sencillo y con frases completas, no con etiquetas de una o dos palabras.

Cada comentario se lee solo y responde, cuando aplique:

- qué se hace en ese punto;
- por qué se hace así y no de otra forma;
- qué regla de negocio o de datos se aplica;
- qué entra, qué sale y qué puede fallar;
- cómo encaja con el paso anterior y el siguiente.

Una decisión, un límite o un caso que no se ve en el nombre de la función se explica en el comentario. Un comentario puede repetir la idea de un nombre si aclara el motivo, el límite o el orden. No se comenta una línea cuyo significado ya quedó explicado en el bloque anterior.

```js
// Trim spaces and lowercase the email so "Ada@Example.com"
// and "ada@example.com" are treated as the same address.

// Ask the database for that email. If SQLite fails, do not return
// its message: replace it with a clear error about this operation.
```

No se modifica código antiguo solo para añadir comentarios ni para adaptarlo a una convención posterior.

## Comandos

- `pnpm format` aplica el formato estándar con Prettier, sin un fichero de configuración propio.
- `pnpm lint` comprueba los archivos JavaScript con `eslint.config.js`.
