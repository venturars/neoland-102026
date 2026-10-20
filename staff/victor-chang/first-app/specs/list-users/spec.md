# List users

## What

Show every user.

## Who

Whoever manages the user list (an admin).

## Input

Nothing.

## Output

All users, lowest number first. No users gives an empty list.
Example: Ana (1) and Bob (2) → Ana, then Bob.

## Failures

None.

## Examples

| ID   | Given                   | When | Then              |
| ---- | ----------------------- | ---- | ----------------- |
| LU-1 | no users                | list | empty list        |
| LU-2 | `Ana` (1) and `Bob` (2) | list | `Ana`, then `Bob` |

## Out of scope

- Pages, filters, other orders.
