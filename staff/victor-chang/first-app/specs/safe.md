# safe queries

## Signature

`safe(fn)` → a function with the same arguments and result as `fn`, whose errors follow the constitution's error contract.

## Rules

1. Results pass through unchanged.
2. An `AppError` thrown inside passes through unchanged.
3. A SQLite UNIQUE violation becomes `DuplicateError` with the column as `field` and the attempted value as `value`, keeping the original as `cause`.
4. Any other error becomes `SystemError` with message `database error`, keeping the original as `cause`.

## Scenarios

| ID   | Given                               | When                                                  | Then                                                                            |
| ---- | ----------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| SQ-1 | a function returning `42`           | call the wrapped function                             | returns `42`                                                                    |
| SQ-2 | a function throwing `NotFoundError` | call it                                               | the same `NotFoundError` is thrown                                              |
| SQ-3 | user with email `a@x.com`           | `insertUser` with `a@x.com` directly (skipping logic) | throws `DUPLICATE`, details `{ field: 'email', value: 'a@x.com' }`, has `cause` |
| SQ-4 | the `users` table was dropped       | `findAllUsers`                                        | throws `SYSTEM`, message `database error`, has `cause`                          |
