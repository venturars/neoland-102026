# Plan — list users

## Files

- Create: `logic/list-users.js`, `query/find-all-users.js`.
- Touch: `query/index.js` (register `findAllUsers`).

## Looks like

`logic/get-user.js`, without the failure check.

## Signature

`listUsers(queries)()` → `[{ id, name, email }, ...]`

## SQL

```sql
SELECT * FROM users ORDER BY id
```

## Errors

None.

## Tests

`test/logic/list-users.test.js` — LU-1, LU-2.

## Open questions

None.
