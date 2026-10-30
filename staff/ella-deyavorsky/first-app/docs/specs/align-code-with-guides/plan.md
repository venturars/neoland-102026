# Plan: align the code with the guides

Issue: #536.

This is not a new feature. No file is created or removed. There is no
new SQL. There is no new package. The sentences in "Errors" stay the
ones they are now.

The code puts several actions on one line. Each action moves to its own
line, with its own name. Prettier does not join two statements. The
result of each function stays the same, and so does the order of its
checks.

## Files

No file is created.

These change:

- `logic/create-user.js`
- `logic/update-user.js`
- `logic/find-user-by-email.js`
- `logic/find-user-by-id.js`
- `logic/delete-user.js`
- `logic/count-users-by-gender.js`
- `queries/users.js`
- `db/connection.js`
- `clients/terminal/create-users-table.txt`
- `docs/CONSTITUTIONS.md`

These do not change:

- `logic/list-users.js`: each line is already one action. The `.map`
  that builds the output is one call.
- The other files in `clients/terminal/`: each line is already one
  action.
- The `.sql` files, `eslint.config.js`, `package.json`, the notebooks
  and the specs already written.

## Email

`logic/find-user-by-email.js`, `logic/create-user.js` and
`logic/update-user.js` check the email with the same block. The three
conditions of the old `if` become three `if`, in the same order: too
long, not two parts, a part without text. All three throw the same
sentence. `emailParts[1]` is only read when there are two parts, so no
`TypeError` appears.

In `logic/find-user-by-email.js` the block is this. The signature stays
`findUserByEmail({ email })`.

```js
// Search in the same form used when the user was saved.
const trimmedEmail = email.trim();
const cleanedEmail = trimmedEmail.toLowerCase();
const emailIsTooLong = cleanedEmail.length >= MAX_EMAIL_LENGTH;
const emailParts = cleanedEmail.split("@");
const hasTwoParts = emailParts.length === 2;
let bothPartsHaveText = false;
if (hasTwoParts) {
  const localPart = emailParts[0];
  const domainPart = emailParts[1];
  const hasLocalPart = localPart.length > 0;
  const hasDomainPart = domainPart.length > 0;
  if (hasLocalPart) {
    if (hasDomainPart) {
      bothPartsHaveText = true;
    }
  }
}
if (emailIsTooLong) {
  throw new Error("The email is not valid.");
}
if (hasTwoParts === false) {
  throw new Error("The email is not valid.");
}
if (bothPartsHaveText === false) {
  throw new Error("The email is not valid.");
}
```

`logic/create-user.js` uses the same block, with its own comment
("Store every email in one form: no surrounding spaces, all lower
case."). `logic/update-user.js` uses it with `nextEmail` in place of
`cleanedEmail`, as written in "Update a user".

## User not found

`logic/find-user-by-email.js`, `logic/find-user-by-id.js`,
`logic/delete-user.js` and `logic/update-user.js` check `undefined` and
`null` on one line. They become two checks. The name stays the one
each file has now: `user` or `currentUser`.

```js
let userIsMissing = false;
if (user === undefined) {
  userIsMissing = true;
}
if (user === null) {
  userIsMissing = true;
}
if (userIsMissing) {
  throw new Error("No user was found.");
}
```

The `try`/`catch` around each query and its sentence "The database
failed." do not change.

## Find a user by email

`logic/find-user-by-email.js` keeps `findUserByEmail({ email })` and
`MAX_EMAIL_LENGTH`. The email block is the one in "Email". The user
check is the one in "User not found", with `user`. The `findByEmail`
call and `return user;` do not change.

## Find a user by id

`logic/find-user-by-id.js` keeps `findUserById({ id })`. Only the user
check changes, as in "User not found", with `user`. The `findById` call
and `return user;` do not change.

## Delete a user

`logic/delete-user.js` keeps `deleteUser({ id })`. Only the user check
changes, as in "User not found", with `currentUser`. `remove` and the
empty return do not change.

## Create a user

`logic/create-user.js` keeps `createUser({ name, email })` and
`MAX_EMAIL_LENGTH`. The name is still trimmed and checked before the
email is cleaned. The name lines do not change. The email block is the
one in "Email".

The check of the used email has two conditions. It becomes this. It
throws in the same cases as now.

```js
// The same email cannot belong to two users.
let emailIsUsed = false;
if (existingUser !== undefined) {
  if (existingUser !== null) {
    emailIsUsed = true;
  }
}
if (emailIsUsed) {
  throw new Error("This email is already used.");
}
```

The `findByEmail` call, the `insert` call and its `return` do not
change.

## Update a user

`logic/update-user.js` keeps `updateUser({ id, name, email })` and
`MAX_EMAIL_LENGTH`. The checks keep their order: nothing to update,
the user exists, the name, the email, the email of another user.

The first check has two conditions. It becomes this.

```js
let nothingToUpdate = false;
if (name === undefined) {
  if (email === undefined) {
    nothingToUpdate = true;
  }
}
if (nothingToUpdate) {
  throw new Error("There is nothing to update.");
}
```

The user check is the one in "User not found", with `currentUser`. The
name lines do not change.

The email part becomes this. `undefined` still keeps the current email.

```js
let nextEmail = currentUser.email;
// undefined keeps the current email.
if (email !== undefined) {
  const trimmedEmail = email.trim();
  nextEmail = trimmedEmail.toLowerCase();
  const emailIsTooLong = nextEmail.length >= MAX_EMAIL_LENGTH;
  const emailParts = nextEmail.split("@");
  const hasTwoParts = emailParts.length === 2;
  let bothPartsHaveText = false;
  if (hasTwoParts) {
    const localPart = emailParts[0];
    const domainPart = emailParts[1];
    const hasLocalPart = localPart.length > 0;
    const hasDomainPart = domainPart.length > 0;
    if (hasLocalPart) {
      if (hasDomainPart) {
        bothPartsHaveText = true;
      }
    }
  }
  if (emailIsTooLong) {
    throw new Error("The email is not valid.");
  }
  if (hasTwoParts === false) {
    throw new Error("The email is not valid.");
  }
  if (bothPartsHaveText === false) {
    throw new Error("The email is not valid.");
  }

  let existingUser;
  try {
    existingUser = findByEmail(nextEmail);
  } catch {
    throw new Error("The database failed.");
  }

  // This user may keep their own email. Another user may not take it.
  let emailUsedByAnother = false;
  if (existingUser !== undefined) {
    if (existingUser !== null) {
      const isSameUser = existingUser.id === currentUser.id;
      if (isSameUser === false) {
        emailUsedByAnother = true;
      }
    }
  }
  if (emailUsedByAnother) {
    throw new Error("This email is already used.");
  }
}
```

The `update` call and its `return` do not change.

## Count users by gender

`logic/count-users-by-gender.js` keeps `countUsersByGender()`, async.
The output is still `{ male, female, undefined }`. The helper
`askGenders(names)` stays, and still returns the list of labels or
`null`. These are the only changes.

The numbered list and its text stop sharing a line:

```js
// Number the names so the model keeps the order: "1. John", "2. Mary"...
const numberedNames = names.map((name, index) => `${index + 1}. ${name}`);
const nameList = numberedNames.join("\n");
```

The two `?.` are checks. Each one gets its own line. `null` and
`undefined` still leave `content` empty, as `?.` does now:

```js
const firstChoice = completion.choices[0];
let message;
if (firstChoice !== undefined) {
  if (firstChoice !== null) {
    message = firstChoice.message;
  }
}
let content;
if (message !== undefined) {
  if (message !== null) {
    content = message.content;
  }
}
```

`trim` is not called when the text is not a string:

```js
const contentIsText = typeof content === "string";
if (contentIsText === false) {
  return null;
}
const trimmedContent = content.trim();
if (trimmedContent === "") {
  return null;
}
```

The list check stops sharing a line with the length check.
`genders.length` is only read when `genders` is a list:

```js
// One label per name. Anything else would give a wrong count.
const genders = answer.genders;
const gendersIsList = Array.isArray(genders);
if (gendersIsList === false) {
  return null;
}
const sameLength = genders.length === names.length;
if (sameLength === false) {
  return null;
}

return genders;
```

In `countUsersByGender`, the group and its names stop sharing a line:

```js
const group = users.slice(start, start + batchSize);
const names = group.map((user) => user.name);
```

The label check has two conditions. It becomes this:

```js
for (const label of labels) {
  let isKnownLabel = false;
  if (label === "male") {
    isKnownLabel = true;
  }
  if (label === "female") {
    isKnownLabel = true;
  }
  if (isKnownLabel) {
    counts[label] += 1;
  } else {
    counts.undefined += 1;
  }
}
```

The OpenAI client, `modelTag`, `batchSize`, `classifyPrompt`,
`genderSchema`, the request to the model, its `try`/`catch` with "The
classifier failed.", the `JSON.parse` and its `try`/`catch`, the
`findAll` call and the return for no users do not change.

## Queries

The signatures in `queries/users.js` stay the same. `insert` and
`update` still receive the object they receive now. The default import
of `path` stays.

The folder becomes this:

```js
const currentFile = fileURLToPath(import.meta.url);
const currentFolder = path.dirname(currentFile);
const queriesFolder = path.join(currentFolder, "queries");
```

Each read puts `path.join` and `readFileSync` together. They move to
two lines. The name of each SQL text does not change.

```js
// The SQL stays in .sql files. This file only reads them and runs them.
const createUsersTablePath = path.join(
  queriesFolder,
  "create-users-table.sql",
);
const createUsersTableSql = readFileSync(createUsersTablePath, "utf8");
```

The same shape, with its own file, for `insertSql`, `findByIdSql`,
`findByEmailSql`, `findAllSql`, `updateSql` and `removeSql`.

Each run puts `prepare` and the method together. They move to two
lines. The method and the argument do not change.

```js
export function findById(id) {
  const statement = db.prepare(findByIdSql);
  return statement.get({ id });
}
```

The same shape for `insert` (`.get({ name: input.name, email:
input.email })`), `findByEmail` (`.get({ email })`), `findAll`
(`.all()`), `update` (`.get({ id: input.id, name: input.name, email:
input.email })`) and `remove` (`.run({ id })`, with no `return`).

`createUsersTable` is already one call to `db.exec`. It does not
change.

## Connection

`db/connection.js` becomes this. It still exports `db`. It still opens
`users.sqlite` next to this file.

```js
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep the database file next to this file, no matter which folder we run from.
const currentFile = fileURLToPath(import.meta.url);
const currentFolder = path.dirname(currentFile);
const databasePath = path.join(currentFolder, "users.sqlite");

// Opening the database creates users.sqlite when the file is not there yet.
export const db = new DatabaseSync(databasePath);
```

## Table client

`clients/terminal/create-users-table.txt` still creates the table and
still prints the table names from `sqlite_master`. The SQL stays in the
client. `prepare` and `all` stop sharing a line.

```js
createUsersTable();

const statement = db.prepare(
  "SELECT name FROM sqlite_master WHERE type = :type",
);
const result = statement.all({ type: "table" });

console.log(result);
```

## Constitution

In `docs/CONSTITUTIONS.md`, step 2 of "One logic file per action" shows
`email.trim().toLowerCase()`, two actions on one line. The start of the
step becomes this:

```
2. It cleans the input by calling `.trim()` on the string directly, one call per line: `name.trim()`, then `email.trim()` and `.toLowerCase()` on the trimmed email.
```

The rest of step 2 and the rest of the constitution do not change.

## Errors

There is no new sentence.

| Failure of the spec                | Sentence                                       |
| ---------------------------------- | ---------------------------------------------- |
| A result changes                   | not a failure from the list: the work is not done |
| An error sentence changes          | not a failure from the list: the work is not done |
| A check moves                      | not a failure from the list: the work is not done |
| A line still has two actions       | not a failure from the list: the work is not done |

## Check

Before any code changes, `db/users.sqlite` is copied to a folder outside
the repo. That copy is the snapshot. No run writes to it.

A script outside the repo runs every action with the same inputs: good
ones, one bad one for each error sentence, and inputs with two problems
at once. It saves what each one prints or throws, including a
`TypeError`. The actions create, update and delete users, so each run
starts from a fresh copy of the untouched snapshot. That way both runs
see the same users, the same ids and the same free emails.

The script runs once before the change and once after it. The two
outputs must be identical except the dates. Then the original
`db/users.sqlite` is put back.
