# Tasks — database errors

1. [x] Open `docs/CONSTITUTION.md` sections 7 and 9. Check `DUPLICATE` and `SYSTEM` are listed.
2. [x] Write `test/query/safe.test.js` with SQ-1 … SQ-4. Run `npm test`: they fail.
3. [x] Create `query/safe.js`: try the function; rethrow `AppError`; turn `UNIQUE` into `DuplicateError`; anything else into `SystemError`.
4. [x] Wrap each `query/*.js` function with `safe(...)`.
5. [x] Run `npm test`: SQ-1 … SQ-4 pass.
