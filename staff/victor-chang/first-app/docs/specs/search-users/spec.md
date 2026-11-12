# Search users

## What

Show the users whose name contains a piece of text, while the text is being typed. It is the search of the web client.

## Who

Whoever manages the user list (an admin).

## Input

A piece of a name. Spaces around it do not matter. Capitals do not matter for the letters A to Z: `ma` finds `María` and `Amanda`. `%` and `_` are searched as plain characters.

## Output

The users whose name contains the text, ordered by name; two users with the same name, lowest number first. An empty list when there is none.
Example: users 1 `Ada` `ada@x.com`, 2 `María` `maria@x.com` and 3 `Adam` `adam@x.com`; `ad` → `Ada` (1) then `Adam` (3), with their emails and dates. `zz` → an empty list.

## Failures

- An empty text, or only spaces → `Name is empty`.
- The users cannot be read → `Could not find the user`.

## Out of scope

- Ignoring accents: `maria` does not find `María`, and `Á` and `á` count as different.
- Searching by email.
- Changing find users by name, which keeps finding only the same name.
