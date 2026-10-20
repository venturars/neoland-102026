# Tasks — get a user

1. [x] Write `test/logic/get-user.test.js` with GU-1, GU-2. Run `npm test`: they fail.
2. [x] Create `query/find-user-by-id.js` with the plan's SQL; return `null` when there is no row. Register it in `query/index.js`.
3. [x] Create `logic/get-user.js`: call `findUserById`, throw `NotFoundError` on `null`.
4. [x] Run `npm test`: GU-1, GU-2 pass.
5. [x] Write `client/terminal/get-user.txt`. Paste it in Git Bash: id 1 shows Ana, id 9 shows nothing.
