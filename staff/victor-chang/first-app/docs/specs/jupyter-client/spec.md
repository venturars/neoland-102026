# Jupyter client

## What

Try every user feature from the browser, without code. There is one document per feature that can already be tried in the terminal: create a user, get a user by number, get a user by email, list the users, update a user, delete a user and count the users by gender.

Each document explains the feature and has one block that runs it. The result is shown as a table.

## Who

Whoever checks that the app works and does not code (Any C level exec). They open a document, run its block and read the result.

## Input

- One command, run from the app, opens the list of documents in the browser. The first time it also prepares Jupyter; the next times it only opens it.
- The person picks a document and runs its block. They type nothing else: the values each feature needs are already in the block.

## Output

Each document shows, in this order: its title, what the feature does, what happens to the saved users, which feature of the app it uses, the failures it can show, the block, and the result of running it.

The result is a table with a coloured header.

- One user: the columns number, name, email, created and updated.
- A list: one row per user. No users: only the header.
- Count by gender: the columns women, men and undefined.
- A feature that returns nothing, like delete: the table says it returns no data.

Example: creating `Practice`, `practice@x.com` →

| id  | name     | email          | createdAt           | updatedAt           |
| --- | -------- | -------------- | ------------------- | ------------------- |
| 12  | Practice | practice@x.com | 2026-10-26 18:00:00 | 2026-10-26 18:00:00 |

A practice user that a block creates is deleted at the end, so the block can be run again and the real users stay the same.

## Failures

A failure shows only the message the feature already uses, with no table of data:

- Create or update with no name → `Name is empty`.
- Create or update with an email without `@` → `Email is invalid`.
- Create or update with an email another user has → `Email is already used`.
- Get, update or delete a user that does not exist → `User not found`.
- The users cannot be saved, read, changed or deleted → `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` or `Could not delete the user`.
- The local AI does not respond → `Could not classify the users`.

## Out of scope

- Changing the user features or adding new ones.
- Features the terminal client does not have.
- Typing values in a form or changing them in the browser.
- Using the Jupyter installed on the computer, or JupyterLab.
- Saving any new data.
