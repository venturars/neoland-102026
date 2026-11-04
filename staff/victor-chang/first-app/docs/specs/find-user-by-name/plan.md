# Plan — find users by name

## Files

- Create: `logic/find-user-by-name.js`.
- Create: `logic/validate-name.js`, the name check that today lives inside `logic/validate-user.js`.
- Create: `queries/queries/find-users-by-name.sql`.
- Touch: `logic/validate-user.js`, calls `validateName` instead of its own check. Same message and `details`.
- Touch: `queries/users.js`, adds `findByName(name)`.
- Create: `clients/terminal/find-user-by-name.txt` and `clients/jupyter/find-user-by-name.ipynb`.
- Touch: `docs/TREE.md` and `docs/ARCHITECTURE.md` (the new files), `docs/DATABASE.md` (`findByName` in the list of query functions), `docs/specs/README.md`.

## Looks like

`logic/get-user-by-email.js`, with `validateName` in place of `validateEmail`, and `logic/list-users.js` for returning a list. `logic/validate-name.js` looks like `logic/validate-email.js`.

## Signature

`findUserByName(name)` → `[{ id, name, email, createdAt, updatedAt }, …]`

`validateName(name)` → the trimmed name.

`findByName(name)` → the rows, ordered by id.

## SQL

`find-users-by-name.sql`:

```sql
SELECT * FROM users WHERE name = :name ORDER BY id
```

SQLite's `=` on `TEXT` is case-sensitive, so `ada` does not find `Ada`.

## Errors

| Spec failure         | Message                   | Class             | `details`           |
| -------------------- | ------------------------- | ----------------- | ------------------- |
| empty name           | `Name is empty`           | `ValidationError` | `{ field: "name" }` |
| users cannot be read | `Could not find the user` | `SystemError`     | `{}`                |

No user with that name is not a failure: it returns `[]`.

## Open questions

None.
