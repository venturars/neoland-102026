# Find users by name

## What

Show the users saved with a name. Several users can share a name.

## Who

Whoever manages the user list (an admin).

## Input

A name. Spaces around it do not matter. Capitals do: the name must be the same as the saved one.

## Output

The users with that name, lowest number first. An empty list when there is none.
Example: two users called `Ada`, 1 `ada@x.com` and 2 `ada2@x.com` → both, user 1 first, with their dates. `ada` → an empty list.

## Failures

- An empty name, or only spaces → `Name is empty`.
- The users cannot be read → `Could not find the user`.

## Out of scope

- Partial matches (part of a name).
- Ignoring capitals or accents.
