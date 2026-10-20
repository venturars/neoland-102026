# Specs

One file per use-case. A spec is the source of truth: write or change it **before** the tests and the code.

## Format

Each spec has:

- **Signature** — how it is called and what it returns.
- **Rules** — numbered business rules.
- **Scenarios** — numbered `Given / When / Then` examples with a stable ID (`CU-1`, `GU-2`...).

Every scenario ID has exactly one test whose name starts with that ID, so filtering by name runs the test for one scenario (see the commands in [AGENTS.md](../AGENTS.md)). Removing a scenario removes its test; IDs are never reused.

## Index

| Prefix | Spec                                   | Tests                                  |
| ------ | -------------------------------------- | -------------------------------------- |
| `CU`   | [createUser](create-user.md)           | `test/logic/create-user.test.js`       |
| `GU`   | [getUser](get-user.md)                 | `test/logic/get-user.test.js`          |
| `GE`   | [getUserByEmail](get-user-by-email.md) | `test/logic/get-user-by-email.test.js` |
| `LU`   | [listUsers](list-users.md)             | `test/logic/list-users.test.js`        |
| `UU`   | [updateUser](update-user.md)           | `test/logic/update-user.test.js`       |
| `DU`   | [deleteUser](delete-user.md)           | `test/logic/delete-user.test.js`       |
| `SQ`   | [safe queries](safe.md)                | `test/query/safe.test.js`              |
