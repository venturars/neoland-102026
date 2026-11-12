# Plan — alinear el código con las guías

Issue: #580.

No es una funcionalidad nueva. No se crea ni se borra ningún fichero
de código. No hay SQL nuevo. No hay paquete nuevo. Los mensajes de
«Errores» siguen siendo los de ahora. Las firmas siguen siendo las
de ahora: `createUser(input)` y `updateUser(id, changes)` con arrays
en la posición 0 y 1.

El código junta varias acciones en una línea. Cada acción pasa a su
propia línea, con su nombre. Prettier no junta dos sentencias. El
resultado de cada función sigue igual.

## Ficheros

Se crean solo los tres de esta spec.

Se tocan:

- `logic/create-user.js`
- `logic/update-user.js`
- `logic/find-user-by-email.js`
- `logic/delete-user.js`
- `logic/users-gender-count.js`
- `queries/users.js`
- `db/connection.js`
- `docs/CONSTITUTIONS.md`

No se tocan `logic/list-users.js`, los `.sql`, `eslint.config.js`,
`package.json`, los clients ni los notebooks. Cada línea de
`list-users.js` ya es una llamada o una comprobación.

## Constantes

Donde hoy hay literales `100` y `255` de longitud, quedan constantes:

```js
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
```

## Email

La regex actual no cambia. Deja de ir dentro del `if`. El bloque queda
así en `create-user.js`, `update-user.js` y `find-user-by-email.js`:

```js
const emailAsText = String(email);
const trimmedEmailRaw = emailAsText.trim();
const trimmedEmail = trimmedEmailRaw.toLowerCase();
const emailIsTooLong = trimmedEmail.length > MAX_EMAIL_LENGTH;
if (emailIsTooLong) {
  throw new Error("Email cannot exceed 255 characters");
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailIsValid = emailPattern.test(trimmedEmail);
if (!emailIsValid) {
  throw new Error("Email is not valid");
}
```

## Crear usuario

`logic/create-user.js` sigue exportando `createUser(input)`. Lee
`input[0]` e `input[1]`. La salida sigue igual.

```js
const rawName = input[0];
let nameMissing = false;
if (rawName === undefined) {
  nameMissing = true;
}
if (rawName === null) {
  nameMissing = true;
}
let trimmedName = "";
if (!nameMissing) {
  const nameAsText = String(rawName);
  trimmedName = nameAsText.trim();
}
if (trimmedName === "") {
  nameMissing = true;
}
if (nameMissing) {
  throw new Error("Name is required");
}
const nameIsTooLong = trimmedName.length > MAX_NAME_LENGTH;
if (nameIsTooLong) {
  throw new Error("Name cannot exceed 100 characters");
}

const rawEmail = input[1];
let emailMissing = false;
if (rawEmail === undefined) {
  emailMissing = true;
}
if (rawEmail === null) {
  emailMissing = true;
}
let trimmedEmail = "";
if (!emailMissing) {
  const emailAsText = String(rawEmail);
  const trimmedEmailRaw = emailAsText.trim();
  trimmedEmail = trimmedEmailRaw.toLowerCase();
}
if (trimmedEmail === "") {
  emailMissing = true;
}
if (emailMissing) {
  throw new Error("Email is required");
}
```

Después va el bloque de email (longitud y patrón). Luego
`findUserByEmail`, el aviso de email repetido, `insertUser` y el
`return`. Esos pasos no cambian de mensaje ni de orden.

## Cambiar usuario

`logic/update-user.js` sigue exportando `updateUser(id, changes)`.
Lee `changes[0]` y `changes[1]`.

La comprobación del `id` queda partida:

```js
let idMissing = false;
if (id === undefined) {
  idMissing = true;
}
if (id === null) {
  idMissing = true;
}
if (!idMissing) {
  const idAsText = String(id);
  const trimmedId = idAsText.trim();
  if (trimmedId === "") {
    idMissing = true;
  }
}
if (idMissing) {
  throw new Error("User does not exist");
}
```

Nombre y email siguen el mismo patrón que en crear. La comprobación
del otro usuario deja de juntar dos condiciones:

```js
let emailUsedByAnother = false;
if (owner) {
  const sameUser = owner.id === currentUser.id;
  if (!sameUser) {
    emailUsedByAnother = true;
  }
}
if (emailUsedByAnother) {
  throw new Error("A user with that email already exists");
}
```

`findUserById`, `findUserByEmail`, `updateUserRow` y el `return` no
cambian de mensaje.

## Buscar por email

`logic/find-user-by-email.js` sigue con `findUserByEmail(email)`.
Falta de email, longitud, patrón, query y «User does not exist»
siguen igual de mensaje. Solo se parten las líneas.

## Borrar usuario

`logic/delete-user.js` parte la comprobación del `id` como en
cambiar. El resto no cambia.

## Conteo por género

`logic/users-gender-count.js` sigue con `usersGenderCount(names)`.
La salida sigue siendo `{ women, men, genderUndefined }`.

Lista vacía:

```js
let namesMissing = false;
if (!names) {
  namesMissing = true;
}
if (names) {
  if (names.length === 0) {
    namesMissing = true;
  }
}
if (namesMissing) {
  return { women: 0, men: 0, genderUndefined: 0 };
}
```

Texto del lote y lectura de la respuesta:

```js
const namesText = batch.join("\n");
```

```js
const firstChoice = completion.choices[0];
let message;
if (firstChoice) {
  message = firstChoice.message;
}
let content = "";
if (message) {
  content = message.content;
}
answer = content;
```

```js
let answerText = "";
if (answer !== undefined) {
  if (answer !== null) {
    answerText = String(answer);
  }
}
const trimmedAnswer = answerText.trim();
const lines = trimmedAnswer.split("\n");
```

```js
const rawLine = lines[index];
let lineText = "";
if (rawLine !== undefined) {
  if (rawLine !== null) {
    lineText = String(rawLine);
  }
}
const trimmedGender = lineText.trim();
const gender = trimmedGender.toLowerCase();
```

`MODEL`, `BATCH_SIZE` y la llamada a la IA no cambian.

## Queries

Las firmas de `queries/users.js` siguen igual. El directorio queda
así:

```js
const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const fileDirectory = dirname(filePath);
const directory = join(fileDirectory, "queries");
```

Cada lectura parte `join` y `readFileSync`. Cada ejecución parte
`prepare` y el método. Los nombres de exportación no cambian.

## Conexión

`db/connection.js` queda así. Sigue exportando `db`.

```js
import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");

export const db = new DatabaseSync(databasePath);
```

## Firmas en la constitución

En `docs/CONSTITUTIONS.md`, «Un fichero de logic», la frase de la
firma queda así:

```
El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserByEmail`). Los parámetros van en la firma, con su nombre. `createUser` recibe un array con nombre y email en las posiciones 0 y 1. `updateUser` recibe el `id` y un array con los cambios en las posiciones 0 y 1.
```

Se quita «No se recibe un objeto `input` genérico». El resto de la
constitución no cambia.

## Errores

No hay un mensaje nuevo. Si un resultado o un mensaje cambia, el
desarrollo no está hecho.
