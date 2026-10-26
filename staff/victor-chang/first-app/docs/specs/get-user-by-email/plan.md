# Plan — get a user by email

## Files

- Create: `logic/get-user-by-email.js`.
- Touch: none. `findByEmail` and its `.sql` already exist (create-user).

## Looks like

`logic/get-user.js`, plus the email check from `logic/validate-email.js`.

## Signature

`getUserByEmail(email)` → `{ id, name, email, createdAt, updatedAt }`

## SQL

None new. Reuses `find-user-by-email.sql`. Case is ignored because the input and every saved email are lowercase.

## Errors

| Spec failure            | Message                   |
| ----------------------- | ------------------------- |
| email without `@`       | `Email is invalid`        |
| no user with that email | `User not found`          |
| cannot be read          | `Could not find the user` |

## Open questions

None.
