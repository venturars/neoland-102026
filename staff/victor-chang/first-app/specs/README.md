# Specs

One file per use-case or client. A spec is the source of truth: write or change it **before** the tests and the code.

## Format

Each spec has:

- **Signature** — how it is called and what it returns.
- **Rules** — numbered business rules.
- **Scenarios** — numbered `Given / When / Then` examples with a stable ID (`CU-1`, `GU-2`...).

Every scenario ID has exactly one test whose name starts with that ID, so filtering by name runs the test for one scenario (see the commands in [AGENTS.md](../AGENTS.md)). Removing a scenario removes its test; IDs are never reused.

## Index

| Prefix | Spec | Tests |
|---|---|---|
| `CU` | [createUser](createUser.md) | `test/logic/createUser.test.js` |
| `GU` | [getUser](getUser.md) | `test/logic/getUser.test.js` |
| `LU` | [listUsers](listUsers.md) | `test/logic/listUsers.test.js` |
| `UU` | [updateUser](updateUser.md) | `test/logic/updateUser.test.js` |
| `DU` | [deleteUser](deleteUser.md) | `test/logic/deleteUser.test.js` |
| `SQ` | [safe queries](safe.md) | `test/query/safe.test.js` |
| `CLI` | [terminal client](terminal.md) | `test/client/terminal.test.js` |
