# Delete a user

## What

Remove a user from the list.

## Who

Whoever manages the user list (an admin).

## Input

The user's number.

## Output

Nothing. The user is no longer in the list.
Example: Ana (1) and Bob (2), delete 2 → only Ana is left.

## Failures

- No user with that number → `user not found`.

## Examples

| ID   | Given                   | When     | Then               |
| ---- | ----------------------- | -------- | ------------------ |
| DU-1 | `Ana` (1) and `Bob` (2) | delete 2 | only `Ana` is left |
| DU-2 | no users                | delete 9 | `user not found`   |

## Out of scope

- Undo.
- Deleting several users at once.
