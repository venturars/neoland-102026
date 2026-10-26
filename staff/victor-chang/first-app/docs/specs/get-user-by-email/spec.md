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

- Email without `@` → `Email is invalid`.
- No user with that email → `User not found`.
- The user cannot be read → `Could not find the user`.

## Out of scope

- Partial matches (part of an email).
