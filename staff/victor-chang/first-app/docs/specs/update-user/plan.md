# Plan — update a user

## Files

- Create: `logic/update-user.js`, `queries/queries/update-user.sql`.
- Touch: `queries/users.js` (add `update`).

## Looks like

`logic/create-user.js`, plus the existence check from `logic/get-user.js`.

## Signature

`updateUser(id, name, email)` → `{ id, name, email, createdAt, updatedAt }`

## SQL

`update-user.sql`:

```sql
UPDATE users SET name = :name, email = :email, updatedAt = datetime('now', 'localtime') WHERE id = :id
```

## Errors

| Spec failure                | Message                     |
| --------------------------- | --------------------------- |
| no name or only spaces      | `Name is empty`             |
| email without `@`           | `Email is invalid`          |
| no user with that id        | `User not found`            |
| email owned by another user | `Email is already used`     |
| cannot be saved             | `Could not update the user` |

## Open questions

None.
