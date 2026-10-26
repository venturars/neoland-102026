# Tasks — create a user

1. [x] Open `db/schema.sql`. Check `users` has `id`, `name`, `email UNIQUE`, `createdAt`, `updatedAt`.
2. [x] Write `queries/queries/insert-user.sql` and `find-user-by-email.sql` with the plan's SQL.
3. [x] In `queries/users.js`, add `insert(name, email)` and `findByEmail(email)`.
4. [x] Create `logic/validate-email.js`: reject a value without `@`; return it trimmed and lowercase.
5. [x] Create `logic/validate-user.js`: reject a blank name, then call `validateEmail`.
6. [x] Create `logic/create-user.js` in the 4 steps: validate, check `findByEmail`, `insert`, return a plain object.
7. [x] Write `clients/terminal/create-user.txt`. Paste it in Git Bash: the user prints, then the three failure messages.
