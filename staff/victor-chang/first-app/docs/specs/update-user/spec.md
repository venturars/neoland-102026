# Update a user

## What

Change the name and email of an existing user.

## Who

Whoever manages the user list (an admin).

## Input

- The user's number.
- The new name.
- The new email.

## Output

The user with the new values and a new update date. Same cleaning as when creating: spaces removed, email in lowercase.
Example: user 1 → `Ana B`, `anab@x.com`.

- A user may keep their own email.

## Failures

Checked in this order:

1. No name, or only spaces → `Name is empty`. Email without `@` → `Email is invalid`.
2. No user with that number → `User not found`.
3. Another user has that email, in any case → `Email is already used`. Nothing changes.
4. The user cannot be saved → `Could not update the user`.

## Out of scope

- Changing only one of the two fields.
