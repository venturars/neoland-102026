# Plan — search users

## Files

- Create: `logic/search-users.js`.
- Create: `queries/queries/search-users.sql`.
- Touch: `queries/users.js`, adds `search(text)`.
- Create: `clients/terminal/search-users.txt` and `clients/jupyter/search-users.ipynb`.
- Touch: `docs/TREE.md` and `docs/ARCHITECTURE.md` (the new files), `docs/DATABASE.md` (`search` in the list of query functions), `docs/specs/README.md`.

## Looks like

`logic/find-user-by-name.js`: `validateName`, one query, a list of plain objects.

## Signature

`searchUsers(text)` → `[{ id, name, email, createdAt, updatedAt }, …]`

`search(text)` → the rows, ordered by name, then id.

## SQL

`search-users.sql`:

```sql
SELECT * FROM users WHERE instr(lower(name), lower(:text)) > 0 ORDER BY name COLLATE NOCASE, id
```

`instr` looks for the text as it is, so `%` and `_` are plain characters and nothing needs escaping. SQLite's `lower()` and `NOCASE` only change A to Z, so `Á` and `á` stay different, as the spec says.

## Errors

| Spec failure         | Message                   | Class             | `details`           |
| -------------------- | ------------------------- | ----------------- | ------------------- |
| empty text           | `Name is empty`           | `ValidationError` | `{ field: "name" }` |
| users cannot be read | `Could not find the user` | `SystemError`     | `{}`                |

No user containing the text is not a failure: it returns `[]`.

## Open questions

None.
