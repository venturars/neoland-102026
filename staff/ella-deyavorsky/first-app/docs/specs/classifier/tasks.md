# Tasks — classify users by name

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the constitution

- [ ] Replace the `### plan.md` section with the new one from the plan. Result: the plan rules ask for every part of a feature.
- [ ] Add `logic/count-users-by-gender.js` to the "One logic file per action" list. Result: the new action is listed.
- [ ] After the 6-step list, add the two sentences about no input and an outside tool. Result: a no-input, non-database function fits the order.
- [ ] In step 6, note that a count is an allowed return, not only user fields. Result: the return shape is allowed.
- [ ] Add `count-users-by-gender.txt` to the clients list in the tree. Result: the client file is listed.
- [ ] Add "The classifier failed." to the Errors list, with its reason. Result: the new error exists before the code uses it.

## Task 2 — Get the model ready

- [ ] Run `ollama list`. Result: the list of installed models and their tags is shown.
- [ ] If no Llama 3 model is listed, run `ollama pull llama3.2` (or another Llama 3 tag). Result: a Llama 3 model is installed.
- [ ] Copy the exact tag from the NAME column, such as `llama3.2:latest`. Use this same tag in Task 3. Result: the model tag is known.
- [ ] Make sure Ollama is running. Result: the model answers on `http://127.0.0.1:11434`.

## Task 3 — Write the logic file

- [ ] Create `logic/count-users-by-gender.js` that exports `async function countUsersByGender()`. Result: the file and the function exist.
- [ ] Read all users with `findAll()` inside try/catch, and throw "The database failed." on error. Result: the names are loaded, or the error is clear.
- [ ] If there are no users, return `{ male: 0, female: 0, undefined: 0 }`. Result: the empty case is done.
- [ ] Set three counters to 0: `male`, `female`, `undefined`. Result: the tally can start.
- [ ] For each user, send one `POST` with `fetch` to `http://127.0.0.1:11434/api/chat`: the model tag from Task 2, `temperature` 0, a few example names, asking for one word. Result: the model labels one name.
- [ ] Wrap each call in try/catch, and on any error throw "The classifier failed." and stop. Result: no partial count leaves the function.
- [ ] Read the one-word answer, lowercased and trimmed: `male` adds to `male`, `female` adds to `female`, anything else adds to `undefined`. Result: the name is counted.
- [ ] After the loop, return `{ male, female, undefined }`. Result: the three counts are returned.

## Task 4 — Write the client and run it

- [ ] Create `clients/terminal/count-users-by-gender.txt` that imports the function, `await`s it, and `console.log`s the result. Result: a paste-and-run client exists.
- [ ] Paste that file in the terminal with `first-app` as the current folder. Result: the three counts print.
- [ ] Stop. Do not change the three spec files again. Result: the one-pass cycle is done.
