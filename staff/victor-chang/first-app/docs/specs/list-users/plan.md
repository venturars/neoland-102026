# Plan — list users

## Files

- Create: `logic/list-users.js`, `queries/queries/find-all-users.sql`.
- Touch: `queries/users.js` (add `findAll`).

## Looks like

`logic/get-user.js`, returning a list.

## Signature

`listUsers()` → `[{ id, name, email, createdAt, updatedAt }, ...]`

## SQL

`find-all-users.sql`:

```sql
SELECT * FROM users ORDER BY id
```

## Errors

| Spec failure   | Message                    |
| -------------- | -------------------------- |
| cannot be read | `Could not list the users` |

## Open questions

None.
