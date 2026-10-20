# Get a user

## What

Show one user, chosen by their number.

## Who

Whoever manages the user list (an admin).

## Input

The user's number.

## Output

That user.
Example: number 1 → user 1, `Ana`, `ana@x.com`.

## Failures

- No user with that number → `user not found`.

## Examples

| ID   | Given        | When  | Then                       |
| ---- | ------------ | ----- | -------------------------- |
| GU-1 | user 1 `Ana` | get 1 | user 1, `Ana`, `ana@x.com` |
| GU-2 | no users     | get 9 | `user not found`           |

## Out of scope

- Searching by name.
