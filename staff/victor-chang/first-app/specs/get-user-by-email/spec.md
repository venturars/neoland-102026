# Get a user by email

## What

Show one user, chosen by their email.

## Who

Whoever manages the user list (an admin).

## Input

An email.

## Output

The user with that email. Case and surrounding spaces do not matter.
Example: `ANA@X.com` with spaces around → user 1, `Ana`, `ana@x.com`.

## Failures

- Email without `@` → `email is invalid`.
- No user with that email → `user not found`.

## Examples

| ID   | Given                     | When                                  | Then                       |
| ---- | ------------------------- | ------------------------------------- | -------------------------- |
| GE-1 | user 1 `Ana`, `ana@x.com` | get by `ana@x.com`                    | user 1, `Ana`, `ana@x.com` |
| GE-2 | user 1 `Ana`, `ana@x.com` | get by `ana@x.com` with spaces around | user 1                     |
| GE-3 | no users                  | get by `nobody@x.com`                 | `user not found`           |
| GE-4 | —                         | get by `ana.x.com`                    | `email is invalid`         |
| GE-6 | user 1 `Ana`, `ana@x.com` | get by `ANA@X.com`                    | user 1                     |

GE-5 was removed and is not reused.

## Out of scope

- Partial matches (part of an email).
