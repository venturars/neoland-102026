# Plan — update a user

## Files

- Create: `logic/update-user.js`, `query/modify-user.js`.
- Touch: `query/index.js` (register `modifyUser`).

## Looks like

`logic/create-user.js`, plus the existence check from `logic/get-user.js`.

## Signature

`updateUser(queries)(id, { name, email })` → `{ id, name, email }`

## SQL

```sql
UPDATE users SET name = :name, email = :email WHERE id = :id
```

Also uses `findUserById` and `findUserByEmail`.

## Errors

| Spec failure                | Message                | Code         |
| --------------------------- | ---------------------- | ------------ |
| no name or only spaces      | `name is required`     | `VALIDATION` |
| email without `@`           | `email is invalid`     | `VALIDATION` |
| no user with that id        | `user not found`       | `NOT_FOUND`  |
| email owned by another user | `email already exists` | `DUPLICATE`  |

## Tests

`test/logic/update-user.test.js` — UU-1 … UU-7.

## Open questions

None.
