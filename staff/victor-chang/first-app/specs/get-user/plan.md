# Plan — get a user

## Files

- Create: `logic/get-user.js`, `query/find-user-by-id.js`.
- Touch: `query/index.js` (register `findUserById`).

## Looks like

`logic/create-user.js` (same shape: call a query, throw on failure).

## Signature

`getUser(queries)(id)` → `{ id, name, email }`

## SQL

```sql
SELECT * FROM users WHERE id = :id
```

## Errors

| Spec failure         | Message          | Code        |
| -------------------- | ---------------- | ----------- |
| no user with that id | `user not found` | `NOT_FOUND` |

Details: `{ resource: "user", id }`.

## Tests

`test/logic/get-user.test.js` — GU-1, GU-2.

## Open questions

None.
