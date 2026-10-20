# Tasks — update a user

1. [x] Write `test/logic/update-user.test.js` with UU-1 … UU-7. Run `npm test`: they fail.
2. [x] Create `query/modify-user.js` with the plan's SQL; return the user with `findUserById`. Register it in `query/index.js`.
3. [x] Create `logic/update-user.js`: `validateUser`, then `findUserById`, then `findUserByEmail` (ignore the same id), then `modifyUser`.
4. [x] Run `npm test`: UU-1 … UU-7 pass.
5. [x] Write `client/terminal/update-user.txt`. Paste it in Git Bash: user 1 becomes Ana B, Bob's change fails.
