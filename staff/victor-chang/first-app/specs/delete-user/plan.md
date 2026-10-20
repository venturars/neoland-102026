# Plan — delete a user

## Files

- Create: `logic/delete-user.js`, `query/remove-user.js`.
- Touch: `query/index.js` (register `removeUser`).

## Looks like

`logic/get-user.js`.

## Signature

`deleteUser(queries)(id)` → `undefined`

## SQL

```sql
DELETE FROM users WHERE id = :id
```

Also uses `findUserById`.

## Errors

| Spec failure         | Message          | Code        |
| -------------------- | ---------------- | ----------- |
| no user with that id | `user not found` | `NOT_FOUND` |

## Tests

`test/logic/delete-user.test.js` — DU-1, DU-2.

## Open questions

None.
