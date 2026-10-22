# Instrucciones para el agente

## Fuente de verdad

Lee completamente `docs/CONSTITUTION.md` antes de modificar código.

Respeta el árbol, el flujo y las responsabilidades definidos allí. No los repitas ni los redefinas en otros documentos.

Si el código contradice la Constitución, explica la contradicción y espera una decisión antes de programar.

## Antes de editar

Cuando el pedido sea una funcionalidad o una forma de trabajar, crea primero `docs/specs/<nombre-en-kebab-case>/` con `spec.md`, `plan.md` y `tasks.md`. No toques código, consultas, clientes ni la constitución hasta que esa carpeta exista y María diga de forma explícita que la revisión está hecha.

Una petición de explicación, revisión, comparación o planificación no autoriza cambios. Crear o reescribir esos tres ficheros tampoco autoriza cambios de código.

Cuando la revisión esté hecha, implementa solo ese pedido:

1. Inspecciona los archivos relacionados.
2. Sigue `tasks.md` de esa carpeta, en orden.
3. Trabaja un solo pedido a la vez.

## Forma de trabajar

- Trabaja en pasos pequeños.
- Implementa una sola funcionalidad cada vez.
- No añadas funcionalidades no solicitadas.
- No refactorices archivos no relacionados.
- No cambies contratos existentes silenciosamente.
- No añadas dependencias sin explicar su necesidad.
- No hagas `commit`, `push`, merge ni pull request sin autorización.
- Si hay varias soluciones razonables, presenta primero las opciones.

Las reglas de este documento se aplican al código nuevo y a las partes que se modifiquen dentro de una tarea autorizada. No refactorices una funcionalidad antigua únicamente para adaptarla a una convención añadida después de su creación.


## Nivel del código

La desarrolladora es junior. El código debe ser:

- sencillo;
- explícito;
- lineal;
- fácil de leer de arriba abajo;
- escrito con nombres descriptivos;
- dividido en pasos visibles.

Evita:

- clases innecesarias;
- abstracciones prematuras;
- patrones de diseño no solicitados;
- helpers genéricos que oculten pasos;
- expresiones demasiado compactas;
- dependencias externas innecesarias.

Una solución más larga es preferible si resulta más fácil de comprender.

## Idioma y formato

- Código y nombres técnicos: inglés.
- Explicaciones para la desarrolladora: español.
- Archivos: kebab-case.
- Funciones y variables: camelCase.
- Módulos: ESM.
- Imports JavaScript con extensión `.js`.
- Comillas dobles.
- Punto y coma.
- Indentación de 2 espacios.
- Formato estándar de Prettier.

Los comentarios son material de estudio. Deben ser lo más explicativos posible para que la desarrolladora pueda aprender el código leyéndolos.

## Comentarios educativos en el código

Cuando crees una funcionalidad nueva o modifiques código con autorización, deja comentarios lo más explicativos posible. Sirven para aprender el código, no solo para marcar un paso.

Cada comentario debe poder leerse solo y responder, cuando aplique:

- qué se está haciendo en este punto;
- por qué se hace así y no de otra forma;
- qué regla de negocio o de datos se está aplicando;
- qué entra, qué sale y qué puede fallar;
- cómo encaja este paso con el anterior y el siguiente.

Escríbelos en inglés sencillo, como el resto del código. Prefiere una frase completa a una etiqueta de una o dos palabras. Si un bloque tiene una decisión, un límite o un caso que no se ve en el nombre de la función, explícalo en el comentario.

Ejemplo:

```js
// Check that id is a whole number greater than zero.
// The client sends it as a JavaScript value, so a string like "1"
// or a decimal like 1.5 must be rejected here, before any query runs.

// Trim spaces and lowercase the email so "Ada@Example.com"
// and "ada@example.com" are treated as the same address.

// Ask the database for that email. If SQLite fails, do not return
// its message: replace it with a clear error about this operation.

// Return only the fields the client needs, with camelCase names.
// created_at stays inside the database column name until this mapping.
```

Un comentario puede repetir la idea de un nombre si eso aclara el motivo, el límite o el orden. No hace falta comentar una línea cuyo significado ya quedó explicado en el bloque anterior.

No modifiques las funcionalidades antiguas únicamente para añadir comentarios. Esta regla se aplica al código nuevo y a las partes que se modifiquen como parte de una tarea autorizada.

## Tipos y formatos

### `id`

- Tipo en JavaScript: `number`.
- Tipo en SQLite: `INTEGER`.
- Debe ser un número entero mayor que cero.
- No se aceptan texto, decimales, cero, números negativos ni `NaN`.
- SQLite genera el ID al crear un usuario.

Validación:

```js
Number.isInteger(id) && id > 0
```

### `name`

- Tipo en JavaScript: `string`.
- Tipo en SQLite: `TEXT NOT NULL`.
- Se aplica `trim()`.
- Después de aplicar `trim()`, no puede quedar vacío.
- Un valor de otro tipo no se convierte silenciosamente en texto.

Ejemplo válido:

```text
Ada Lovelace
```

Ejemplos inválidos:

```text
""
"   "
null
123
```

### `email`

JavaScript no tiene un tipo nativo `email`. En Node se representa como `string`, pero su contenido debe ser una dirección de email válida.

- Tipo en JavaScript: `string`.
- Tipo en SQLite: `TEXT NOT NULL UNIQUE`.
- Tipo de dominio: email.
- Se aplica `trim().toLowerCase()`.
- Debe contener un único `@`.
- Debe tener contenido antes y después de `@`.
- Debe tener como máximo 64 caracteres.
- No puede repetirse.
- La comprobación se escribe en pasos visibles: `split("@")`, un solo `@`, texto a ambos lados y longitud. No se sustituye por una expresión regular.

Ejemplo válido:

```text
ada@example.com
```

Ejemplos inválidos:

```text
ada
@example.com
ada@
ada@@example.com
""
null
```

Si posteriormente existe un formulario HTML, utilizará:

```html
<input type="email">
```

El formulario no sustituye la validación de `logic/`.

### `created_at`

- Tipo en JavaScript: `string`.
- Tipo en SQLite: `TEXT NOT NULL`.
- En código nuevo, lo genera SQLite al insertar la fila con `DEFAULT (datetime('now', 'localtime'))`.
- `logic/` no crea esta fecha con `new Date()` ni la envía a la consulta.
- No se acepta desde el cliente.

### `updated_at`

- Tipo en JavaScript: `string`.
- Tipo en SQLite: `TEXT NOT NULL`.
- En código nuevo, lo genera SQLite al insertar la fila y lo actualiza la consulta SQL con `datetime('now', 'localtime')`.
- `logic/` no crea esta fecha con `new Date()` ni la envía a la consulta.
- No se acepta desde el cliente.

Las fechas de persistencia son responsabilidad de SQLite. La capa `logic/` decide cuándo se crea o modifica una entidad, pero no calcula sus timestamps.

## Firma de las funciones

La firma debe mostrar claramente qué datos necesita la función.

- Una función sin entrada no recibe argumentos: `listUsers()`.
- Si necesita un solo dato, lo recibe directamente y con un nombre descriptivo: `findUserById(id)` o `findUserByEmail(email)`.
- Si necesita varios valores fijos y conocidos, los parámetros aparecen de forma visible en la firma.
- No agrupes un `id`, un `email` u otro dato único dentro de un objeto sin necesidad.
- Utiliza un objeto solo cuando el grupo tenga un significado propio, como `changes` en una actualización parcial, o cuando la spec defina expresamente ese contrato.
- El nombre de la función debe describir la acción completa y coincidir con la finalidad de su archivo.

No desestructures un objeto directamente en la firma. Cuando una función reciba un objeto con significado propio, comprueba primero que sea un objeto válido y después lee sus propiedades dentro del cuerpo.

## Actualizaciones parciales

Una nueva función de actualización recibe el identificador y los cambios por separado:

```js
updateUser(id, changes);
```

- Valida primero `id`.
- Comprueba que `changes` sea un objeto válido.
- Solo modifica las propiedades que estén presentes en `changes` y que la spec permita actualizar.
- Conserva el valor actual de una propiedad cuando no aparezca en `changes`.
- Valida y normaliza cada valor proporcionado con las mismas reglas que se aplican al crearlo.
- Si se modifica un valor único, permite que la entidad conserve su propio valor, pero no que utilice el de otra fila.
- Devuelve la entidad completa y saneada después de actualizarla, salvo que la spec defina otro resultado.

## Orden de una función de negocio

1. Recibir los parámetros.
2. Validar sus tipos.
3. Normalizar los datos.
4. Validar las reglas de negocio.
5. Solicitar la operación correspondiente.
6. Estructurar la respuesta.

Los pasos deben ser visibles y no combinarse en una única expresión compleja.

## Gestión de errores

Los errores se gestionan en `logic/`, cerca de la regla de negocio que puede fallar.

Cuando una entrada o una regla de negocio no es válida, la función lanza un `Error` con un mensaje claro en inglés:

```js
throw new Error("User email is invalid");
```

El mensaje explica el problema de forma comprensible. No se utilizan códigos opacos, clases de error propias ni objetos genéricos como `{ ok: false, error }`.

Mensajes de referencia para esta aplicación:

- `User id must be a positive integer`;
- `User name is required`;
- `User email is invalid`;
- `User email is already registered`;
- `User does not exist`.

Los errores internos de SQLite nunca llegan directamente al cliente. `logic/` los captura y lanza un nuevo error que identifica la operación que no pudo completarse.

Mensajes de referencia para errores de operación:

- `Unable to create user`;
- `Unable to update user`;
- `Unable to delete user`;
- `Unable to list users`;
- `Unable to find user`.

Ejemplo:

```js
let user;

try {
  user = findUserByEmail(email);
} catch {
  throw new Error("Unable to find user");
}
```

Cuando una operación funciona, devuelve directamente el dato saneado. No lo envuelve en `{ ok: true }`.

```js
return {
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
};
```

Si una operación correcta no produce datos, no devuelve un valor artificial.

Al crear o modificar una funcionalidad, aplica estas reglas de forma consistente a todas las funciones afectadas y actualiza sus clientes de terminal.

Cada archivo de `clients/terminal/` contiene una sola línea: un ejemplo del caso correcto. Los casos incorrectos se prueban al implementar, pero no se guardan en el `.txt`.

## Reglas de implementación

- Utiliza las capas existentes según `docs/CONSTITUTION.md`.
- Antes de crear un archivo, comprueba si ya existe uno con esa responsabilidad.
- Antes de crear una consulta, comprueba si puede reutilizarse una existente.
- Lee los archivos SQL una vez al cargar el módulo.
- Utiliza parámetros SQL con nombre.
- Nunca concatenes datos del usuario dentro del SQL.
- No devuelvas campos que el cliente no necesita.
- No conviertas silenciosamente datos inválidos.
- No cambies el esquema como efecto secundario de otra tarea.
- `logic/` no llama a `createUsersTable()` ni crea tablas. La tabla `users` queda preparada al cargar `queries/users.js`. Asegurarla con `CREATE TABLE IF NOT EXISTS` no es un cambio de esquema.

## Seguridad

- Valida la entrada antes de utilizarla.
- No guardes secretos, tokens ni contraseñas en el repositorio.
- No subas `db/users.sqlite`.
- No registres emails reales en los ejemplos.
- No borres ni reemplaces la base real durante las comprobaciones.
- No añadas autenticación ni contraseñas sin una tarea específica.

## Cambios en la base de datos

Antes de cambiar columnas, tipos o restricciones:

1. Explica el esquema actual.
2. Explica el cambio propuesto.
3. Indica si los datos existentes pueden verse afectados.
4. Presenta el plan de migración.
5. Espera autorización.

## Sincronización de la documentación

`docs/CONSTITUTION.md` debe representar siempre el estado real del proyecto.

Después de implementar un cambio, comprueba si también hay que actualizar la Constitución.

Actualízala en la misma tarea cuando:

- se crea, elimina, mueve o renombra un archivo o carpeta;
- se añade o elimina una funcionalidad;
- cambia el árbol del proyecto;
- cambia el recorrido de los datos;
- cambia la responsabilidad de una capa;
- cambia el contrato de entrada o salida de `logic/`;
- cambia la estructura de la base de datos;
- cambia una decisión fundamental de la arquitectura.

Al actualizar la Constitución:

- describe únicamente lo que ya existe;
- no añadas archivos ni funcionalidades planificadas;
- actualiza el árbol para que coincida con el proyecto;
- elimina información que haya dejado de ser cierta.

Si cambian los tipos o las reglas de validación de `id`, `name`, `email`, `created_at` o `updated_at`, actualiza también la sección correspondiente de este `AGENTS.md`.

Si una modificación interna no afecta al árbol, al alcance, al flujo, al contrato ni a la arquitectura, no cambies la Constitución innecesariamente. Indica al terminar que se revisó y que no necesitaba actualización.

Una tarea que requiera actualizar la documentación no se considera terminada hasta que el código y la Constitución vuelvan a coincidir.

## Verificación

Para comprobar una funcionalidad:

1. Revisa la sintaxis.
2. Ejecuta su cliente de terminal.
3. Prueba un caso correcto.
4. Prueba al menos un caso incorrecto.
5. Utiliza una copia temporal cuando sea posible.
6. Comprueba que no se modificaron archivos no relacionados.
7. Comprueba si `docs/CONSTITUTION.md` necesita actualizarse.

Al finalizar, informa:

- qué archivos cambiaron;
- qué hace cada cambio;
- qué se comprobó;
- cuál fue el resultado;
- si se actualizó la Constitución;
- qué quedó pendiente.

No afirmes que algo funciona si no se ha comprobado.
