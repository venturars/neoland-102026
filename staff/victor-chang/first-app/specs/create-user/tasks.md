# Tasks — create a user

1. [x] Open `db/schema.sql`. Check the `users` table has `id`, `name`, `email UNIQUE`.
2. [x] Write `test/logic/create-user.test.js` with CU-1 … CU-9. Run `npm test`: they fail.
3. [x] Create `logic/validate-email.js`: reject a value without `@`, return it trimmed and lowercase.
4. [x] Create `logic/validate-user.js`: reject a blank name, then call `validateEmail`.
5. [x] Create `query/find-user-by-email.js` and `query/insert-user.js` with the plan's SQL. Register both in `query/index.js`.
6. [x] Create `logic/create-user.js`: validate, check `findUserByEmail`, then `insertUser`.
7. [x] Run `npm test`: CU-1 … CU-9 pass.
8. [x] Write `client/terminal/create-user.txt`. Paste it in Git Bash: Ana is added, the duplicate fails.
