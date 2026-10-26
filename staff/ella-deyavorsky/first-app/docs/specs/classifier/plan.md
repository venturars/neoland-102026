# Plan — classify users by name

## Constitution first

Replace the `### plan.md` section in `docs/CONSTITUTIONS.md` with:

### plan.md

This file says how the code will follow the spec. It does not list the work steps. Those belong in `tasks.md`.

Keep it short. It names:

- The files to add or change.
- The function in `logic/`: whether it is sync or async, what it receives, what it returns (the exact shape, even when it is not a user), and which error sentences it throws.
- The edge cases and what the function returns for each, such as no users or nothing to do.
- The query function and the `.sql` file, if the feature touches the database. If it does not, say so.
- Any outside tool or package the feature needs, and what must already be running on the machine for it to work.
- The order inside the logic file, matching the steps in "One logic file per action".
- The changes this feature needs in this constitution: a new logic file in the action list, a new error sentence in the Errors list, a new client file in the tree.
- What stays as it is.

Replace the `### tasks.md` section in `docs/CONSTITUTIONS.md` with:

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

## Files

- Add `logic/count-users-by-gender.js` — the new action.
- Add `clients/terminal/count-users-by-gender.txt` — paste-and-run client.
- Change `docs/CONSTITUTIONS.md` — see "Constitution changes" below.
- No query change. The feature reuses `findAll()`. No new `.sql` file, no schema change.
- No new package. The model is called with Node's built-in `fetch`.

## The function

`countUsersByGender()` — takes nothing, like `listUsers()`.

- It is `async`: it waits for the model, so it returns a Promise.
- It returns a count object: `{ male, female, undefined }` — three numbers. Not a user, not a row.
- It reads every name with `findAll()` from `queries/users.js`.
- For each name, it asks the local model to label it `male`, `female`, or `undefined`, and adds one to that count.
- It throws:
  - "The database failed." if `findAll()` fails.
  - "The classifier failed." if the model does not answer (Ollama off, no connection, timeout).
- No partial count: if a call throws, the function throws and returns nothing.

## The model

- Llama 3 through Ollama, on the same machine, called with `fetch` to `http://127.0.0.1:11434`.
- The model must be pulled and Ollama must be running. That is a precondition, not the code's job. If it is not running, the call fails and the function throws "The classifier failed."
- One request per name. `temperature` 0. A few example names in the prompt. The model answers exactly one word: `male`, `female`, or `undefined`.
- An answer that is not clearly `male` or `female` counts as `undefined`. Only a missing answer is a failure.

## Order inside the logic file

1. No input to receive.
2. No input to clean.
3. Read all users with `findAll()`. If there are none, return `{ male: 0, female: 0, undefined: 0 }`.
4. For each name, ask the model and add one to `male`, `female`, or `undefined`.
5. Return the three counts.

## What stays the same

`queries/`, `db/`, the other `logic/` files, and the other clients do not change. One database, one connection.

## Constitution changes this feature needs

- Add `logic/count-users-by-gender.js` to the "One logic file per action" list.
- Add `count-users-by-gender.txt` to the clients list in the tree.
- Add "The classifier failed." to the Errors list (a new failure is added before it is used).
- Note that this function returns a count object, not user fields. Step 6 ("only id, name, email, createdAt, updatedAt") is about user data; a count is a different, allowed return.
- After the 6-step list in "One logic file per action", add: "A function with no input skips steps 1 and 2. A function that reads an outside tool instead of the database does step 4 and step 5 against that tool."
