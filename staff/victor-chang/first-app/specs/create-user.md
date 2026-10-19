# createUser

## Signature

`createUser(queries)({ name, email })` → `{ id, name, email }`

## Rules

1. `name` is required: a string that is not empty after trimming.
2. `email` is required: a string containing `@`.
3. `name` and `email` are stored trimmed.
4. `email` is unique across all users.
5. `id` is assigned by the database.

## Scenarios

| ID   | Given                       | When                                               | Then                                                                                |
| ---- | --------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| CU-1 | no users                    | create `{ name: 'Ana', email: 'ana@x.com' }`       | returns `{ id: 1, name: 'Ana', email: 'ana@x.com' }`                                |
| CU-2 | no users                    | create `{ name: '  Ana  ', email: ' ana@x.com ' }` | returns name `'Ana'` and email `'ana@x.com'`                                        |
| CU-3 | no users                    | create with name `'   '`                           | throws `VALIDATION`, details `{ field: 'name' }`                                    |
| CU-4 | no users                    | create without name                                | throws `VALIDATION`, details `{ field: 'name' }`                                    |
| CU-5 | no users                    | create with email `'ana.x.com'`                    | throws `VALIDATION`, details `{ field: 'email' }`                                   |
| CU-6 | no users                    | create with empty name **and** bad email           | throws `VALIDATION`, details `{ field: 'name' }` (first failing field)              |
| CU-7 | user with email `ana@x.com` | create another with `ana@x.com`                    | throws `DUPLICATE`, details `{ field: 'email', value: 'ana@x.com' }`; no user added |
