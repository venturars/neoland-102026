# Estilo

## Quién escribe y quién lee

La desarrolladora es junior. El código es sencillo, explícito y lineal, se lee de arriba abajo, usa nombres descriptivos y se divide en pasos visibles. Una solución más larga es preferible si resulta más fácil de comprender.

Se evitan las abstracciones prematuras, los patrones de diseño no solicitados y las dependencias externas innecesarias.

## Forma del código

El código y los nombres técnicos se escriben en inglés. Los comentarios de los clientes de terminal se escriben en español.

Los ficheros van en kebab-case. Las funciones y las variables van en camelCase. Los exports son con nombre. Los imports de JavaScript llevan la extensión `.js`. El SQL usa parámetros con nombre. No hay envoltorios ni helpers genéricos. El formato es el estándar de Prettier. Una constante va en mayúsculas.

Una función por fichero, sin clases, sin `this` y sin métodos. Las excepciones aprobadas están en «Excepciones». Un usuario sigue siendo un registro con `id`, `name`, `email`, `createdAt` y `updatedAt`. Cada línea deja una sola acción en un nombre. Una acción es una llamada o una comprobación, así que `input.name` y `.trim()` van en líneas distintas y Prettier no las junta. Un fallo de la lista se comprueba con `if` y `throw new Error` en su propia línea. Se escribe como lo escribiría un junior a mano.

## Funciones de negocio

Cada funcionalidad de negocio tiene su propio archivo en `src/logic/`. Las responsabilidades de cada capa están en [ARCHITECTURE.md](ARCHITECTURE.md).

### Firma

- Sin entrada, no recibe argumentos: `listUsers()`.
- Un dato se recibe directamente: `findUserById(id)` o `findUserByEmail(email)`.
- Varios valores fijos se muestran en la firma.
- Un objeto se utiliza cuando representa un grupo con significado propio, como `changes`, o cuando la spec define ese contrato.
- No se desestructura un objeto en la firma. Primero se valida y después se leen sus propiedades dentro de la función.
- El nombre describe la acción completa y coincide con la finalidad del archivo.

### Orden de los pasos

1. Recibir los parámetros y validar sus tipos.
2. Normalizar los valores admitidos.
3. Comprobar las reglas de negocio.
4. Solicitar la operación correspondiente a la capa de consultas.
5. Estructurar la respuesta.

Las reglas concretas de los campos y las fechas generadas por SQLite están en [DATABASE.md](DATABASE.md). La lógica no crea tablas ni calcula esas fechas.

### Actualización parcial

`updateUser(id, changes)` recibe el identificador y los cambios por separado. Valida primero `id` y después que `changes` sea un objeto válido.

Solo modifica propiedades presentes en `changes` y admitidas por la spec. Las demás conservan su valor. Cada valor se valida y normaliza como al crearlo. Un usuario puede conservar su propio valor único, pero no usar el de otra fila.

### Funciones asíncronas

Las funciones de `src/logic/` y de `src/queries/users.js` son `async`, porque cada consulta espera la respuesta del servidor de datos. Se llaman siempre con `await`, también dentro de `try`, para que el `catch` reciba el fallo de la consulta. La lógica solo usa `import` y `fetch` (a través de las consultas): no importa módulos `node:*`, para que el navegador pueda usarla.

### Respuesta y errores

Una operación correcta devuelve directamente el dato saneado, sin un envoltorio como `{ ok: true }`. Si no produce datos, no inventa un valor de retorno. Una actualización devuelve la entidad completa, salvo contrato distinto aprobado en la spec.

El usuario que devuelve la lógica tiene `id`, `name`, `email`, `createdAt` y `updatedAt`. Los nombres de columna permanecen dentro del acceso a datos y se adaptan al construir la respuesta. Cada cliente puede presentar únicamente los campos que necesita.

Las entradas inválidas y los fallos de operación siguen [ERRORS.md](ERRORS.md). Los detalles internos de SQLite no se devuelven al cliente.

### Clientes y comprobación

Si cambia un contrato, se actualizan sus clientes afectados. Cada archivo de `src/clients/terminal/` conserva una sola línea con el caso correcto. Los casos incorrectos se comprueban durante la tarea y no se añaden a esos archivos de ejemplo.

Se reutilizan las responsabilidades existentes antes de crear funciones o consultas. El esquema no cambia como efecto secundario de otra tarea. Los cambios de datos siguen el procedimiento de migración de [DATABASE.md](DATABASE.md).

## Excepciones

Aprobadas en la tarea del cliente web independiente:

- `src/clients/web/app.js` reúne las funciones de su cliente en un solo archivo.
- `execute(method, sql, params)` de `src/queries/users.js` es el único envoltorio de `fetch` hacia el servidor de datos.

Aprobadas en la tarea del cliente de escritorio:

- `src/clients/electron/app.js` y `src/clients/electron/user-actions.js` reúnen las funciones de su cliente en un solo archivo.
- `user-actions.js` responde `{ data }` o `{ error }` entre los procesos de ese cliente. `src/logic/` sigue sin envoltorios.

Aprobadas en la tarea del cliente de Chrome:

- `src/clients/chrome/popup.js` reúne las funciones de su cliente en un solo archivo.
- `callApi(method, route, body)` de `popup.js` es el único envoltorio de `fetch` hacia su API.

Aprobadas en la tarea del cliente Nest:

- `src/clients/nest/` se aparta de esta guía: usa clases, `this`, decoradores y nombres de archivo con punto (`users.controller.js`), porque Nest se construye así. El resto de la aplicación no cambia.
- Los exports de ese cliente siguen siendo con nombre. Cada archivo contiene una sola clase.

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
