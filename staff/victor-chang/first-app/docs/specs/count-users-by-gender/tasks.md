# Tasks — count users by gender

1. [ ] In a terminal, run `ollama serve`. In another, run `ollama list`: `llama3.2` is listed.
2. [ ] Open `docs/CONSTITUTION.md`, section Tree. Add `count-users-by-gender.js` under `logic/`.
3. [ ] Open `queries/users.js`. Check `findAll()` exists and returns users ordered by id.
4. [ ] Create `logic/count-users-by-gender.js` with the constants `MODEL`, `AI_URL`, `BATCH_SIZE` and the plan's system text and example names as constants.
5. [ ] In that file, write `async function countUsersByGender()`: call `findAll()`; with no users return `{ women: 0, men: 0, genderUndefined: 0 }`.
6. [ ] Split the names into batches of `BATCH_SIZE`, in the order read. Print the batches once to check: 21 users give 4 batches (6, 6, 6, 3). Remove the print.
7. [ ] For each batch, `fetch` `AI_URL` with the plan's body and messages. A failed connection or a status that is not 2xx throws.
8. [ ] Read `choices[0].message.content`; split into lines, drop empty ones, trim and lowercase each.
9. [ ] If there is no message, the body is not JSON, or the line count differs from the batch size: add the whole batch to `genderUndefined`.
10. [ ] Otherwise count line by line: `women` → `women`, `men` → `men`, anything else → `genderUndefined`.
11. [ ] Wrap steps 5–10 in one `try/catch`: anything thrown becomes `SystemError("Could not classify the users", {}, { cause: error })`.
12. [ ] Return `{ women, men, genderUndefined }`. Check: the three numbers add up to the number of users.
13. [ ] Write `clients/terminal/count-users-by-gender.txt`: import `countUsersByGender`, `await` it, `console.log` the result; on error print `error.message`.
14. [ ] With Ollama running, paste the block in Git Bash: three numbers print, and they add up to 21.
15. [ ] Stop Ollama and paste the block again: `Could not classify the users` prints.
16. [ ] Run `npx prettier --write .`. Commit.
