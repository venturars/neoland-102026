# Tasks — get a user by email

1. [x] Open `docs/CONSTITUTION.md` section 9. Check `user not found` allows `{ resource, email }`.
2. [x] Write `test/logic/get-user-by-email.test.js` with GE-1 … GE-4, GE-6. Run `npm test`: they fail.
3. [x] Create `logic/get-user-by-email.js`: `validateEmail`, then `findUserByEmail`, throw `NotFoundError` on `null`.
4. [x] Run `npm test`: the GE tests pass.
5. [x] Write `client/terminal/get-user-by-email.txt`. Paste it in Git Bash: `ana@x.com` shows Ana.
