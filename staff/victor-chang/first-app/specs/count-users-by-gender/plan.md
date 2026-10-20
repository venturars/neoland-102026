# Plan — count users by gender

## Files

- Create: `ai/classify-names.js`, `logic/count-users-by-gender.js`.
- Touch: none. `query/find-all-users.js` already exists.

## Looks like

`logic/list-users.js`, plus a second injected dependency (`classifier`) next to `queries`.

## Signature

- `classifyNames(url)(names)` → `Promise<{ [name]: "woman" | "man" | "undefined" }>`
  - `POST <url>/api/chat` to Ollama, model `llama3.2`, `stream: false`, `format: "json"`.
  - Asks for one gender per name: `woman`, `man` or `undefined`.
  - Empty message → `{}`.
- `countUsersByGender(queries, classifier)()` → `Promise<{ women, men, genderUndefined }>`
  - Each user is counted once, using the gender given for their name.
  - A name missing from the answer, or with any value other than `woman` / `man`, counts as undefined.
  - No users → returns zeros without calling the classifier.

## SQL

None new. Reuses:

```sql
SELECT * FROM users ORDER BY id
```

## Errors

| Spec failure                        | Message                         | Code     |
| ----------------------------------- | ------------------------------- | -------- |
| the AI sends no message             | none: every name is undefined   | —        |
| the answer has no gender for a name | none: that name is undefined    | —        |
| the AI does not respond             | `users could not be classified` | `SYSTEM` |

- `ai/classify-names.js` turns a failed `fetch` (no connection, non-2xx status) into `SystemError("users could not be classified", {}, { cause })`.

## Tests

`test/logic/count-users-by-gender.test.js` — CG-1 … CG-5.

- The classifier is a fake function passed in by the test; the real AI is never called.

## Open questions

Stop here until these are answered. The constitution, the current code and the spec do not say the same thing:

1. **External service.** Section 1 says "user management CRUD" and section 2 lists only SQLite. May the app call a local Ollama server at `http://localhost:11434` with model `llama3.2`, using the built-in `fetch` (no npm dependency)? If yes, section 2 must list it.
2. **New folder `ai/`.** No folder may do this today: `logic/` must not do I/O and `query/` is for the database only. Add `ai/` to section 3 (owns AI calls, never business rules) and to section 4 (`logic/` receives `classifier` by injection, like `queries`; `ai/` may import only `logic/errors.js`)?
3. **First async use-case.** Every use-case is synchronous today. This one returns a Promise and its tests use `await`. Accept?
4. **Terminal client.** Section 8 says the `.txt` block runs SQL with `sqlite3` only. This feature's query is a plain `SELECT`; the AI call would need `curl`. Allow `curl` in the `.txt`, or practise only the SQL?
5. **Error code.** `users could not be classified` is listed with `SYSTEM` (HTTP 500). Keep it, or add a new code such as `UNAVAILABLE` (HTTP 503)?
6. **Which AI.** The source text says the gender comes from `llama3.2` but the failure case names `nimble-v3`. The spec assumes both mean `llama3.2`. Confirm.
