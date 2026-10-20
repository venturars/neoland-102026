# Plan — get a user by email

## Files

- Create: `logic/get-user-by-email.js`.
- Touch: none. `query/find-user-by-email.js` already exists (used by create-user).

## Looks like

`logic/get-user.js`.

## Signature

`getUserByEmail(queries)(email)` → `{ id, name, email }`

## SQL

None new. Reuses:

```sql
SELECT * FROM users WHERE email = :email
```

Case is ignored because `validateEmail` lowercases the input and every saved email is lowercase.

## Errors

| Spec failure            | Message            | Code         |
| ----------------------- | ------------------ | ------------ |
| email without `@`       | `email is invalid` | `VALIDATION` |
| no user with that email | `user not found`   | `NOT_FOUND`  |

Details for `user not found`: `{ resource: "user", email }`.

## Tests

`test/logic/get-user-by-email.test.js` — GE-1 … GE-4, GE-6.

## Open questions

None.
