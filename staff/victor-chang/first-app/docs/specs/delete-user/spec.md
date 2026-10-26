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

- No user with that number → `User not found`.
- The user cannot be removed → `Could not delete the user`.

## Out of scope

- Undo.
- Deleting several users at once.
