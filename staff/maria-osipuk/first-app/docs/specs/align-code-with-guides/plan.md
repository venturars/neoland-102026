# Plan — Alinear el código con las guías

## Recorrido

El cambio reescribe la forma de las líneas dentro de las capas actuales. No crea ni borra ficheros, no cambia el recorrido, no cambia SQL y no cambia el contrato de entrada y salida de `logic/`.

Hay un único cambio que cruza dos ficheros: la conexión pasa de `export default` a un export con nombre y `queries/users.js` cambia su import. Es la capa siguiente del recorrido, así que no se salta ninguna capa.

## Referencia: la forma de Ventura

La `first-app` de Ventura Rodríguez (`staff/ventura-rodriguez/first-app`, issue #412, PR #413) ya aplicó estas guías. De ahí se copia la forma, no la lógica de negocio:

- cada acción tiene su línea y su nombre (`rawEmail`, `trimmedEmail`, `normalizedEmail`);
- una condición con varias partes se calcula con una bandera `let` y `if` anidados, y el `if` final solo lanza el error (salvo la validación del `id`, que se queda como está);
- no se usan `&&`, `||` ni ternarios dentro de una condición ni de una asignación;
- la llamada a la base y su resultado van en dos líneas (`const statement = ...` y `statement.get(...)`).

Lo que no se copia, porque cambiaría el funcionamiento o contradice `AGENTS.md`: las firmas (`createUser(input)`), los mensajes de error (`Email is invalid`), la ausencia de validación de tipos y de `id`, y la eliminación de `FIRST_APP_DATABASE_FILE`. En esta app se conservan `createUser(name, email)`, los mensajes de `docs/ERRORS.md` y las validaciones actuales.

## Cómo queda cada patrón

La validación del `id` no cambia. Se queda como está hoy en `find-user-by-id`, `delete-user` y `update-user`.

Comprobación del email, en `create-user`, `find-user-by-email` y `update-user`. Es el mismo bloque de Ventura con el mensaje `User email is invalid`:

```js
const trimmedEmail = email.trim();
const normalizedEmail = trimmedEmail.toLowerCase();
const parts = normalizedEmail.split("@");
const hasTwoParts = parts.length === 2;
let hasSingleAt = false;
if (hasTwoParts) {
  const localPart = parts[0];
  const domainPart = parts[1];
  const hasLocalPart = localPart.length > 0;
  const hasDomainPart = domainPart.length > 0;
  if (hasLocalPart) {
    if (hasDomainPart) {
      hasSingleAt = true;
    }
  }
}
const emailIsTooLong = normalizedEmail.length > 64;
if (!hasSingleAt) {
  throw new Error("User email is invalid");
}
if (emailIsTooLong) {
  throw new Error("User email is invalid");
}
```

Otro usuario con el mismo email, en `update-user`:

```js
let emailUsedByAnother = false;
if (owner) {
  const sameUser = owner.id === existing.id;
  if (!sameUser) {
    emailUsedByAnother = true;
  }
}
if (emailUsedByAnother) {
  throw new Error("User email is already registered");
}
```

Valores que se conservan, en `update-user`, en lugar de los ternarios:

```js
let nextName = existing.name;
if (hasName) {
  nextName = name;
}
```

Si algún caso no entra en estos patrones, se aplica la misma idea y se explica en el informe.

## Qué diferencia hay hoy con las guías

- **Una acción por línea.** Hay encadenados como `email.trim().toLowerCase()`, `changes.name.trim()`, `parts[0].length > 0`, `database.prepare(query).get(...)` y `JSON.parse(...)`.
- **Condiciones compuestas.** `logic/` y `classifyNames` usan `&&` y `||` dentro del `if`: validación del objeto `changes`, del email, de la respuesta del modelo y de `female` o `male`. La validación del `id` queda fuera por decisión de María.
- **Ternarios.** `logic/update-user.js` y `db/connection.js` los usan.
- **Constantes.** `batchSize` en el recuento por género es un valor fijo y pasa a `BATCH_SIZE`.
- **Exports.** `db/connection.js` usa `export default`. `docs/STYLE.md` pide exports con nombre.

## Ficheros que se tocan

- `logic/create-user.js`, `logic/find-user-by-email.js`, `logic/find-user-by-id.js`, `logic/delete-user.js`, `logic/update-user.js`, `logic/list-users.js`.
- `logic/count-users-by-gender.js`, tanto `countUsersByGender` como `classifyNames`.
- `queries/users.js`: el directorio, las lecturas de SQL, las ejecuciones y el import de la conexión.
- `db/connection.js`: llamadas encadenadas, ternarios y el export.

`classifyNames` se queda dentro de `logic/count-users-by-gender.js`. No se mueve a otro fichero porque añadiría un fichero y cambiaría `docs/TREE.md` y `docs/ARCHITECTURE.md`.

## Ficheros que no se tocan

Los SQL, los clientes de terminal, los cuadernos Jupyter y `run_logic.py`.

## Conexión con export con nombre

`db/connection.js` pasa de `export default database;` a `export const database = new DatabaseSync(databaseFile);`. `queries/users.js` pasa de `import database from "../db/connection.js";` a `import { database } from "../db/connection.js";`. Ventura llama `db` a su conexión; aquí se conserva `database`, por decisión de María y para no tocar el resto de `queries/users.js`. `FIRST_APP_DATABASE_FILE` y `db/users.sqlite` funcionan como hoy.

## Decisiones que quedan abiertas

- `docs/STYLE.md` pide una función por fichero. `classifyNames` y las funciones de `queries/users.js` no lo cumplen. En `queries/users.js` es una capa de ejecución; `classifyNames` es una ayuda del recuento. Se quedan así hasta una tarea posterior, porque separarlas añade ficheros.
- La validación del `id` se queda como está, por decisión de María. `AGENTS.md` no cambia por este motivo.
- `Unable to classify names` no está en la lista de referencia de `docs/ERRORS.md`. No se cambia el mensaje. Se revisa al final si la lista debe nombrarlo.
- Los comentarios se conservan. Si una línea se separa en varias, el comentario sigue explicando el bloque.

## Documentación

No se crean, borran ni mueven ficheros y no cambia el contrato de `logic/`. `docs/TREE.md` solo añade esta carpeta, y ya la tiene. `docs/ARCHITECTURE.md` y `docs/CONSTITUTION.md` se revisan al terminar. Ninguna de las dos menciona el tipo de export de la conexión; si no lo hacen, se indica en el informe que no necesitan cambio.

## Comprobación

- Antes de cambiar nada, se ejecuta cada caso de `clients/terminal/` sobre una copia temporal de la base (con `FIRST_APP_DATABASE_FILE`) y se guarda la salida.
- Después de cada fichero se repiten los mismos casos, más al menos un caso incorrecto por operación, y se comparan las salidas. Se prueban `id` con `"1"`, `1.5`, `0`, `-1` y `NaN` para confirmar que la validación no cambió.
- `countUsersByGender` se comprueba con la tabla vacía, que no contacta con Ollama. Si Ollama está en marcha, también con filas. Los fallos de `classifyNames` se comprueban con un cliente simulado, no con el modelo real.
- Al final, `pnpm format`, `pnpm lint`, `pnpm exec prettier --check .` y `git diff --check`.

No se añaden dependencias, así que no hace falta la revisión con Socket.
