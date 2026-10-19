# listUsers

## Signature

`listUsers(queries)()` → `[{ id, name, email }, ...]`

## Rules

1. Returns every user, ordered by `id` ascending.
2. No users is an empty array, not an error.

## Scenarios

| ID   | Given                         | When | Then                      |
| ---- | ----------------------------- | ---- | ------------------------- |
| LU-1 | no users                      | list | returns `[]`              |
| LU-2 | users `Ana` (1) and `Bob` (2) | list | returns both, `Ana` first |
