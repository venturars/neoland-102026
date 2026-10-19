# getUserByEmail

## Signature

`getUserByEmail(queries)(email)` → `{ id, name, email }`

## Rules

1. `email` is validated and normalized (trimmed, lowercased) like in [createUser](create-user.md) rules 2–3 before the lookup.
2. The match ignores case: `ANA@x.com` finds `ana@x.com`.
3. A missing user is an error, never `null`.

## Scenarios

| ID   | Given                     | When                     | Then                                                                      |
| ---- | ------------------------- | ------------------------ | ------------------------------------------------------------------------- |
| GE-1 | user 1 `Ana`, `ana@x.com` | get by `ana@x.com`       | returns `{ id: 1, name: 'Ana', email: 'ana@x.com' }`                      |
| GE-2 | user 1 `Ana`, `ana@x.com` | get by `'  ana@x.com  '` | returns user 1 (input is trimmed)                                         |
| GE-3 | no users                  | get by `nobody@x.com`    | throws `NOT_FOUND`, details `{ resource: 'user', email: 'nobody@x.com' }` |
| GE-4 | —                         | get by `ana.x.com`       | throws `VALIDATION`, details `{ field: 'email' }`                         |
| GE-6 | user 1 `Ana`, `ana@x.com` | get by `ANA@X.com`       | returns user 1 (match ignores case)                                       |
