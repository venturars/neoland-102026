# Instrucciones para el agente

## Fuente de verdad

Lee completamente `docs/CONSTITUTION.md` antes de modificar código.

Respeta el árbol, el flujo y las responsabilidades definidos allí. No los repitas ni los redefinas en otros documentos.

Si el código contradice la Constitución, explica la contradicción y espera una decisión antes de programar.

## Antes de editar

1. Inspecciona los archivos relacionados.
2. Explica en español:
   - qué se quiere conseguir;
   - qué archivos habría que cambiar;
   - por qué son necesarios;
   - cómo se comprobará el resultado.
3. Espera autorización explícita.

Una petición de explicación, revisión, comparación o planificación no autoriza cambios.

## Forma de trabajar

- Trabaja en pasos pequeños.
- Implementa una sola funcionalidad cada vez.
- No añadas funcionalidades no solicitadas.
- No refactorices archivos no relacionados.
- No cambies contratos existentes silenciosamente.
- No añadas dependencias sin explicar su necesidad.
- No hagas `commit`, `push`, merge ni pull request sin autorización.
- Si hay varias soluciones razonables, presenta primero las opciones.


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

Los comentarios explican motivos; no repiten lo que ya expresa el código.

## Comentarios educativos en el código

Cuando crees una funcionalidad nueva o modifiques código con autorización, añade comentarios breves que ayuden a la desarrolladora a entender qué etapa se está realizando.

Los comentarios deben:

- escribirse en inglés sencillo, como el resto del código;
- separar los pasos importantes de la función;
- explicar decisiones o reglas que no sean evidentes;
- ayudar a relacionar el código con el orden de la lógica de negocio.

Ejemplo:

```js
// Validate the input

// Normalize the email

// Check the business rules

// Execute the database operation

// Return a safe response
```

No añadas un comentario a cada línea ni repitas literalmente lo que ya dice una función o variable con un nombre claro.

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
- Se genera internamente.
- No se acepta desde el cliente.

### `updated_at`

- Tipo en JavaScript: `string`.
- Tipo en SQLite: `TEXT NOT NULL`.
- Se genera internamente.
- No se acepta desde el cliente.

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
