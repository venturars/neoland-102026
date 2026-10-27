# Constitution

## Project

This app is for learning two things:

- Application logic: the rules that decide what is allowed.
- Spec-driven development (SDD): write the rules first, then write the code that follows them.

The app manages users. You can create a user, list users, find a user by email, find a user by id, update a user, and delete a user.

The rest of the rules live in their own files:

- [ARCHITECTURE.md](ARCHITECTURE.md): the job of each layer and each file.
- [TREE.md](TREE.md): the tree of the app.
- [DATABASE.md](DATABASE.md): the table and the queries.
- [ERRORS.md](ERRORS.md): the list of errors.
- [STYLE.md](STYLE.md): the conventions and the shape of each line.

## One logic file per action

A new feature is a new file in `logic/`. Do not add a second feature to a file in `logic/` that already exists. A new query is a new function in `queries/users.js` and a new `.sql` file in `queries/queries/`. The file name is the function name in kebab-case.

The actions are listed in [TREE.md](TREE.md).

Each file exports one function. The function is built in this order:

1. A function that takes input receives one object: `createUser({ name, email })`, `findUserByEmail({ email })`, `findUserById({ id })`, `updateUser({ id, name, email })`, or `deleteUser({ id })`. `listUsers()` takes nothing.
2. It cleans the input by calling `.trim()` on the string directly: `name.trim()`, `email.trim().toLowerCase()`. It does not test the type first. If `name` or `email` is missing, the `TypeError` is expected. Do not catch it. In `updateUser`, a field that is `undefined` is not cleaned, because it keeps its current value.
3. It checks the input, without the database: "The name is missing.", "The email is not valid.", "There is nothing to update."
4. It checks the business rules, with the queries it needs: "This email is already used.", "No user was found."
5. It applies the action with a function exported by `queries/users.js`.
6. It returns the result: only `id`, `name`, `email`, `createdAt`, `updatedAt`. No SQLite object leaves `logic/`. `countUsersByGender()` returns a count object, `{ male, female, undefined }`. A count is an allowed return, not only user fields.

A function with no input skips steps 1 and 2. A function that reads an outside tool instead of the database does step 4 and step 5 against that tool.

`updateUser({ id, name, email })` can change the name, the email, or both. A field passed as `undefined` keeps its current value. If both are `undefined`, it throws "There is nothing to update."

A success returns the user directly, with `id`, `name`, `email`, `createdAt`, and `updatedAt`. List returns the array of users. Delete returns nothing. There is no `{ ok: true, user }` wrapper. A failure throws one of the sentences in [ERRORS.md](ERRORS.md).

## Packages

Every Node package that is added, or whose version is changed, is validated with Socket before the plan is accepted. How to do it is written in `AGENTS.md`.

## Specs

A new feature is a new folder in `docs/specs/`. The folder name is kebab-case, like `docs/specs/classifier/`. Each folder has three files, written in this order. No code for a feature is written until its `spec.md`, `plan.md`, and `tasks.md` exist, in that order. If the folder or a file is missing, write the missing file.

### spec.md

The person who decides the feature writes this file. They say what they want. They do not need to know how the code works.

It says what is asked, who will use it, who has access, examples of use, and what goes wrong. It does not name files, functions, or SQL.

### plan.md

This file says how the code will follow the spec. It does not list the work steps. Those belong in `tasks.md`.

Keep it short. It names:

- The files to add or change.
- The function in `logic/`: whether it is sync or async, what it receives, what it returns (the exact shape, even when it is not a user), and which error sentences it throws.
- The edge cases and what the function returns for each, such as no users or nothing to do.
- The query function and the `.sql` file, if the feature touches the database. If it does not, say so.
- Any outside tool or package the feature needs, and what must already be running on the machine for it to work.
- The order inside the logic file, matching the steps in "One logic file per action".
- The changes this feature needs in this constitution: a new error sentence in [ERRORS.md](ERRORS.md), a new file in [TREE.md](TREE.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
- What stays as it is.

### tasks.md

The steps to build the feature, in the order a person would do them.

Rules for the steps:

- Each step does one thing. If a step needs the word "and", split it into two steps.
- Each step is one line and says its result.
- Each change to the constitution is its own step. Do not bundle several edits in one step.
- Each file is its own step. Do not create two files in one step.
- A step that writes a function in `logic/` is split into one step per part of the order in "One logic file per action": read the input, clean it, check it, check the business rules, apply the action, return the result. A part that does not apply is skipped.
- An outside tool the feature needs is made ready before the step that uses it, not after.
- Group the steps under the task they belong to, in this order: update the constitution, get any outside tool ready, write the query, write the logic, write the client, run it.

This environment is one pass: spec, plan, tasks, code. Do not rewrite the three files once the code works, and do not run the cycle again, unless a person asks. The work stops when the last step is done.
