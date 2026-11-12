# Plan — alinear el código con las guías

Issue: #412.

No es una funcionalidad nueva. No se crea ni se borra ningún fichero.
No hay SQL nuevo. No hay paquete nuevo. Los mensajes de «Errores»
siguen siendo los de ahora.

El código junta varias acciones en una línea. Cada acción pasa a su
propia línea, con su nombre. Prettier no junta dos sentencias. El
resultado de cada función sigue igual.

## Ficheros

No se crean ficheros.

Se tocan:

- `logic/create-user.js`
- `logic/update-user.js`
- `logic/find-user-by-email.js`
- `logic/users-gender-count.js`
- `queries/users.js`
- `db/connection.js`
- `clients/terminal/create-users-table.txt`
- `docs/CONSTITUTIONS.md`

Los clientes siguen igual, salvo la línea partida de
`clients/terminal/create-users-table.txt`. Las specs ya escritas no
cambian.

No se tocan `logic/delete-user.js`, `logic/find-user-by-id.js`,
`logic/find-user-by-name.js` ni `logic/list-users.js`. Cada línea de
esos ficheros ya es una llamada o una comprobación. El `.map` que arma
la salida es una llamada. El objeto de la salida es el paso 4.

No se tocan los `.sql`, `eslint.config.js` ni `package.json`.

## Email

`logic/find-user-by-email.js` ya tiene la firma `findUserByEmail(email)`.
La salida sigue igual. El bloque del email queda así. El resto del
fichero no cambia.

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
  throw new Error("Email is invalid");
}
if (emailIsTooLong) {
  throw new Error("Email is invalid");
}
```

`parts[1]` solo se lee cuando hay dos partes. Un email inválido sigue
lanzando `Email is invalid`.

## Crear usuario

`logic/create-user.js` sigue exportando `createUser(input)`. La salida
sigue igual. El nombre y el email quedan así. El `findByEmail`, el
`insert` y el `return` no cambian.

```js
const rawName = input.name;
const name = rawName.trim();
if (name === "") {
  throw new Error("Name is empty");
}

const rawEmail = input.email;
const trimmedEmail = rawEmail.trim();
const email = trimmedEmail.toLowerCase();
const parts = email.split("@");
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
const emailIsTooLong = email.length > 64;
if (!hasSingleAt) {
  throw new Error("Email is invalid");
}
if (emailIsTooLong) {
  throw new Error("Email is invalid");
}
```

`parts[1]` solo se lee cuando hay dos partes.

## Cambiar usuario

`logic/update-user.js` sigue exportando `updateUser(id, changes)`. La
salida sigue igual. Solo `undefined` conserva el valor guardado. El
`findById`, el `findByEmail`, el `update` y el `return` no cambian.

```js
let name = current.name;
if (changes.name !== undefined) {
  const rawName = changes.name;
  name = rawName.trim();
}
if (name === "") {
  throw new Error("Name is empty");
}

let email = current.email;
if (changes.email !== undefined) {
  const rawEmail = changes.email;
  const trimmedEmail = rawEmail.trim();
  email = trimmedEmail.toLowerCase();
}
const parts = email.split("@");
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
const emailIsTooLong = email.length > 64;
if (!hasSingleAt) {
  throw new Error("Email is invalid");
}
if (emailIsTooLong) {
  throw new Error("Email is invalid");
}
```

La comprobación del otro usuario junta dos condiciones. Queda así. No
cambia cuándo sale `Email is already used`.

```js
let emailUsedByAnother = false;
if (owner) {
  const sameUser = owner.id === current.id;
  if (!sameUser) {
    emailUsedByAnother = true;
  }
}
if (emailUsedByAnother) {
  throw new Error("Email is already used");
}
```

## Conteo por género

En `logic/users-gender-count.js` la firma sigue siendo
`usersGenderCount()`. La salida sigue siendo
`{ women, men, genderUndefined }`. Estos son los únicos cambios.

La lista de nombres y el texto dejan de ir en la misma línea:

```js
const nameList = batch.map((user) => user.name);
const names = nameList.join("\n");
```

No se lee `choice.message` si no hay `choice`:

```js
let missingMessage = false;
if (!choice) {
  missingMessage = true;
}
if (choice) {
  if (!choice.message) {
    missingMessage = true;
  }
}
if (missingMessage) {
  genderUndefined += batch.length;
  continue;
}
```

No se llama a `trim` si el texto no es un string:

```js
let emptyText = false;
if (typeof text !== "string") {
  emptyText = true;
}
if (typeof text === "string") {
  const trimmedText = text.trim();
  if (trimmedText === "") {
    emptyText = true;
  }
}
if (emptyText) {
  genderUndefined += batch.length;
  continue;
}
```

El JSON y la propiedad dejan de ir en la misma línea:

```js
const parsed = JSON.parse(text);
genders = parsed.genders;
```

No se lee `genders.length` si `genders` no es una lista:

```js
const gendersIsArray = Array.isArray(genders);
let sameCount = false;
if (gendersIsArray) {
  const genderCount = genders.length;
  const batchCount = batch.length;
  sameCount = genderCount === batchCount;
}
if (!sameCount) {
  genderUndefined += batch.length;
  continue;
}
```

La llamada a la IA, `MODEL` y el lote de 6 siguen igual.

## Queries

Las firmas de `queries/users.js` siguen igual. `insert` y `update`
siguen recibiendo el objeto que ya reciben. El objeto de `get`, `all`
y `run` es el parámetro con nombre de SQLite.

El directorio queda así:

```js
const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
```

Cada lectura junta `join` y `readFileSync`. Pasan a dos líneas. El
nombre del SQL no cambia.

```js
const createUsersTablePath = join(
  directory,
  "queries",
  "create-users-table.sql",
);
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");
```

La misma forma, con su fichero, para `findByIdSql`, `findByEmailSql`,
`findByNameSql`, `insertSql`, `updateSql`, `removeSql` y `findAllSql`.

Cada ejecución junta `prepare` y el método. Pasan a dos líneas. El
método y el argumento no cambian.

```js
export function findById(id) {
  const statement = db.prepare(findByIdSql);
  return statement.get({ id });
}
```

La misma forma para `findByEmail` (`.get({ email })`), `findByName`
(`.all({ name })`), `insert` (`.get({ name, email })`), `update`
(`.get({ id, name, email })`), `remove` (`.run({ id })`) y `findAll`
(`.all()`).

`createUsersTable` ya es una sola llamada a `db.exec`. No cambia.

## Conexión

`db/connection.js` queda así. Sigue exportando `db`. Sigue abriendo
`users.sqlite` al lado de este fichero.

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

## Cliente de la tabla

`clients/terminal/create-users-table.txt` sigue creando la tabla y
sigue imprimiendo los nombres de `sqlite_master`. El SQL sigue en el
cliente. `prepare` y `all` dejan de ir en la misma línea.

```js
createUsersTable();
const statement = db.prepare(
  "SELECT name FROM sqlite_master WHERE type = 'table'",
);
console.log(statement.all());
```

## Errores

No hay un mensaje nuevo.

| Fallo de la spec                         | Mensaje        |
| ---------------------------------------- | -------------- |
| Un resultado cambia                      | no es un fallo de la lista: el desarrollo no está hecho |
| Un mensaje cambia                        | no es un fallo de la lista: el desarrollo no está hecho |
| Una línea sigue con dos acciones         | no es un fallo de la lista: el desarrollo no está hecho |

## Firmas

En `docs/CONSTITUTIONS.md`, «Un fichero de logic», la frase de la firma
queda así:

```
El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Los parámetros van en la firma, con su nombre (`name`, `email`, `id`). `createUser` recibe un objeto con `name` y `email`. `updateUser` recibe el `id` y un objeto con los cambios. Un campo `undefined` de ese objeto conserva el valor guardado.
```

Se quita «No se agrupa la entrada en un único objeto si los datos ya se
conocen». El resto de la constitución no cambia.

## Decisión

Se sigue el camino A. Las firmas se quedan: `createUser(input)` y
`updateUser(id, changes)`. Los clientes siguen llamando
`createUser({ name: "Ada", email: "ada@example.com" })` y
`updateUser(1, { name: "Ada Lovelace" })`. La constitución queda como
dice «Firmas».
