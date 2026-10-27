# Create a user

## What

Add a new user to the list.

## Who

Whoever manages the user list (an admin).

## Input

- A name.
- An email.

## Output

The new user with the number the list gives it and the date it was created.
Example: `Ana`, `ana@x.com` → user 1, `Ana`, `ana@x.com`, created and updated now.

- Spaces around the name and the email are removed.
- The email is saved in lowercase.

## Failures

- No name, or only spaces → `Name is empty`.
- Email without `@` → `Email is invalid`.
- Both wrong → `Name is empty` (the name is checked first).
- Another user has that email, in any case → `Email is already used`. Nothing is added.
- The user cannot be saved → `Could not create the user`.

## Out of scope

- Checking that the email really exists.
- Other user fields.
