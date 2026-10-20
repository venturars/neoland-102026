# Update a user

## What

Change the name and email of an existing user.

## Who

Whoever manages the user list (an admin).

## Input

- The user's number.
- The new name and the new email.

## Output

The user with the new values. Same cleaning as when creating: spaces removed, email in lowercase.
Example: user 1 → `Ana B`, `anab@x.com`.

- A user may keep their own email.

## Failures

Checked in this order:

1. No name, or only spaces → `name is required`. Email without `@` → `email is invalid`.
2. No user with that number → `user not found`.
3. Another user has that email, in any case → `email already exists`. Nothing changes.

## Examples

| ID   | Given                   | When                              | Then                                  |
| ---- | ----------------------- | --------------------------------- | ------------------------------------- |
| UU-1 | user 1 `Ana`            | update 1 to `Ana B`, `anab@x.com` | user 1, `Ana B`, `anab@x.com`         |
| UU-2 | user 1 `Ana`            | update 1 to `Ana B`, `ana@x.com`  | user 1, `Ana B`, `ana@x.com`          |
| UU-3 | user 1 `Ana`            | update 1 with an empty name       | `name is required`                    |
| UU-4 | no users                | update 9 with good values         | `user not found`                      |
| UU-5 | no users                | update 9 with a bad email         | `email is invalid`                    |
| UU-6 | `Ana` (1) and `Bob` (2) | update 2 with `ana@x.com`         | `email already exists`; Bob unchanged |
| UU-7 | `Ana` (1) and `Bob` (2) | update 2 with `ANA@x.com`         | `email already exists`                |

## Out of scope

- Changing only one of the two fields.
