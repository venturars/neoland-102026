# Database errors

## What

When the database fails, the user sees a clear message from the Errors list, never a raw database error.

## Who

Whoever manages the user list (an admin), through any feature.

## Input

Any request that reaches the database.

## Output

- A request that works: the normal answer, unchanged.
- A request that fails for a known reason (for example, user not found): that same message, unchanged.

## Failures

- An email that is already taken reaches the database → `email already exists`.
- Any other database problem → `database error`.

## Examples

| ID   | Given                      | When                                            | Then                   |
| ---- | -------------------------- | ----------------------------------------------- | ---------------------- |
| SQ-1 | the database works         | a request that succeeds                         | the normal answer      |
| SQ-2 | the user does not exist    | a request fails with `user not found`           | `user not found`       |
| SQ-3 | `a@x.com` exists           | save another `a@x.com` straight to the database | `email already exists` |
| SQ-4 | the users table is missing | list users                                      | `database error`       |

## Out of scope

- Retrying after a failure.
