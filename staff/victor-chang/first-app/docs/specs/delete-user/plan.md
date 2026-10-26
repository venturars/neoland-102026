# Plan — delete a user

## Files

- Create: `logic/delete-user.js`, `queries/queries/delete-user.sql`.
- Touch: `queries/users.js` (add `remove`).

## Looks like

`logic/get-user.js`, returning nothing.

## Signature

`deleteUser(id)` → nothing

## SQL

`delete-user.sql`:

```sql
DELETE FROM users WHERE id = :id
```

## Errors

| Spec failure         | Message                     |
| -------------------- | --------------------------- |
| no user with that id | `User not found`            |
| cannot be removed    | `Could not delete the user` |

## Open questions

None.
