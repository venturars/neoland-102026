# Plan — create a user

## Files

- Create: `logic/create-user.js`, `logic/validate-user.js`, `logic/validate-email.js`, `query/find-user-by-email.js`, `query/insert-user.js`.
- Touch: `query/index.js` (register `findUserByEmail`, `insertUser`).

## Looks like

First feature: no earlier `logic/` file.

## Signature

`createUser(queries)({ name, email })` → `{ id, name, email }`

## SQL

```sql
SELECT * FROM users WHERE email = :email
INSERT INTO users (name, email) VALUES (:name, :email)
```

## Errors

| Spec failure           | Message                | Code         |
| ---------------------- | ---------------------- | ------------ |
| no name or only spaces | `name is required`     | `VALIDATION` |
| email without `@`      | `email is invalid`     | `VALIDATION` |
| email taken, any case  | `email already exists` | `DUPLICATE`  |

## Tests

`test/logic/create-user.test.js` — CU-1 … CU-9.

## Open questions

None.
