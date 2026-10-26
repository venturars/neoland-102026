# Plan — get a user

## Files

- Create: `logic/get-user.js`, `queries/queries/find-user-by-id.sql`.
- Touch: `queries/users.js` (add `findById`).

## Looks like

`logic/create-user.js`, without input validation and without writing.

## Signature

`getUser(id)` → `{ id, name, email, createdAt, updatedAt }`

## SQL

`find-user-by-id.sql`:

```sql
SELECT * FROM users WHERE id = :id
```

## Errors

| Spec failure         | Message                   |
| -------------------- | ------------------------- |
| no user with that id | `User not found`          |
| cannot be read       | `Could not find the user` |

## Open questions

None.
