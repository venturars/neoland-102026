# Tasks — delete a user

1. [x] Write `test/logic/delete-user.test.js` with DU-1, DU-2. Run `npm test`: they fail.
2. [x] Create `query/remove-user.js` with the plan's SQL. Register it in `query/index.js`.
3. [x] Create `logic/delete-user.js`: `findUserById`, throw `NotFoundError` on `null`, then `removeUser`.
4. [x] Run `npm test`: DU-1, DU-2 pass.
5. [x] Write `client/terminal/delete-user.txt`. Paste it in Git Bash: only Ana is left.
