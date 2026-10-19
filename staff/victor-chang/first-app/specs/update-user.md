# updateUser

## Signature

`updateUser(queries)(id, { name, email })` → `{ id, name, email }`

## Rules

1. Replaces both `name` and `email`; same validation and normalization as [createUser](create-user.md) rules 1–3.
2. Checks run in order: input → existence → uniqueness.
3. The user may keep its own email.
4. The new email must not belong to another user, ignoring case.

## Scenarios

| ID   | Given                         | When                                                             | Then                                                                                   |
| ---- | ----------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| UU-1 | user 1 `Ana`                  | update 1 to `{ name: 'Ana B', email: 'anab@x.com' }`             | returns `{ id: 1, name: 'Ana B', email: 'anab@x.com' }`                                |
| UU-2 | user 1 `Ana`                  | update 1 to `{ name: 'Ana B', email: 'ana@x.com' }` (same email) | succeeds                                                                               |
| UU-3 | user 1 `Ana`                  | update 1 with empty name                                         | throws `VALIDATION`, details `{ field: 'name' }`                                       |
| UU-4 | no users                      | update 9 with valid input                                        | throws `NOT_FOUND`, details `{ resource: 'user', id: 9 }`                              |
| UU-5 | no users                      | update 9 with bad email                                          | throws `VALIDATION` (input is checked before existence)                                |
| UU-6 | users `Ana` (1) and `Bob` (2) | update 2 with email `ana@x.com`                                  | throws `DUPLICATE`, details `{ field: 'email', value: 'ana@x.com' }`; user 2 unchanged |
| UU-7 | users `Ana` (1) and `Bob` (2) | update 2 with email `ANA@x.com`                                  | throws `DUPLICATE`, details `{ field: 'email', value: 'ana@x.com' }`                   |
