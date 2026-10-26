# Plan — create a user

## Files

- Create: `logic/create-user.js`, `logic/validate-user.js`, `logic/validate-email.js`, `queries/queries/insert-user.sql`, `queries/queries/find-user-by-email.sql`.
- Touch: `queries/users.js` (add `insert`, `findByEmail`).

## Looks like

First feature: no earlier `logic/` file.

## Signature

`createUser(name, email)` → `{ id, name, email, createdAt, updatedAt }`

## SQL

`insert-user.sql`:

```sql
INSERT INTO users (name, email) VALUES (:name, :email)
```

`find-user-by-email.sql`:

```sql
SELECT * FROM users WHERE email = :email
```

## Errors

| Spec failure           | Message                     |
| ---------------------- | --------------------------- |
| no name or only spaces | `Name is empty`             |
| email without `@`      | `Email is invalid`          |
| email taken, any case  | `Email is already used`     |
| cannot be saved        | `Could not create the user` |

## Open questions

None.
