# getUser

## Signature

`getUser(queries)(id)` → `{ id, name, email }`

## Rules

1. Returns the user with that `id`.
2. A missing user is an error, never `null`.

## Scenarios

| ID | Given | When | Then |
|---|---|---|---|
| GU-1 | user 1 `Ana` | get `1` | returns `{ id: 1, name: 'Ana', email: 'ana@x.com' }` |
| GU-2 | no users | get `9` | throws `NOT_FOUND`, details `{ resource: 'user', id: 9 }` |
