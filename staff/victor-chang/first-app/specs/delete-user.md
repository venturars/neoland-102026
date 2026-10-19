# deleteUser

## Signature

`deleteUser(queries)(id)` → `undefined`

## Rules

1. Removes the user with that `id`.
2. Deleting a missing user is an error.

## Scenarios

| ID   | Given                         | When     | Then                                                      |
| ---- | ----------------------------- | -------- | --------------------------------------------------------- |
| DU-1 | users `Ana` (1) and `Bob` (2) | delete 2 | returns `undefined`; list only has `Ana`                  |
| DU-2 | no users                      | delete 9 | throws `NOT_FOUND`, details `{ resource: 'user', id: 9 }` |
