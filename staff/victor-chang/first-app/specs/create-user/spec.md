# Create a user

## What

Add a new user to the list.

## Who

Whoever manages the user list (an admin).

## Input

- A name.
- An email.

## Output

The new user with the number the list gives it.
Example: name `Ana`, email `ana@x.com` → user 1, `Ana`, `ana@x.com`.

- Spaces around the name and the email are removed.
- The email is saved in lowercase.

## Failures

- No name, or only spaces → `name is required`.
- Email without `@` → `email is invalid`.
- Both wrong → `name is required` (the name is checked first).
- Another user has that email, in any case → `email already exists`. Nothing is added.

## Examples

| ID   | Given              | When                                               | Then                                   |
| ---- | ------------------ | -------------------------------------------------- | -------------------------------------- |
| CU-1 | no users           | create `Ana`, `ana@x.com`                          | user 1, `Ana`, `ana@x.com`             |
| CU-2 | no users           | create `Ana`, `ana@x.com`, both with spaces around | name `Ana`, email `ana@x.com`          |
| CU-3 | no users           | create with name `   `                             | `name is required`                     |
| CU-4 | no users           | create with no name                                | `name is required`                     |
| CU-5 | no users           | create with email `ana.x.com`                      | `email is invalid`                     |
| CU-6 | no users           | create with no name and a bad email                | `name is required`                     |
| CU-7 | `ana@x.com` exists | create another with `ana@x.com`                    | `email already exists`; still one user |
| CU-8 | no users           | create with email `Ana@X.com` and spaces around    | email `ana@x.com`                      |
| CU-9 | `ana@x.com` exists | create another with `ANA@x.com`                    | `email already exists`                 |

## Out of scope

- Checking that the email really exists.
- Other user fields.
