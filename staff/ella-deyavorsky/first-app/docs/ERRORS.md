# Errors

A failure throws an English sentence with `throw new Error(...)`. It is not returned inside an object. These are the only sentences:

- "The name is missing." — the name is empty or only spaces.
- "The email is not valid." — the email is not two parts around `@`, or it is 64 characters or longer.
- "This email is already used." — another user already has this email.
- "No user was found." — no user has this id, or no user has this email.
- "There is nothing to update." — an update was sent with no name and no email.
- "The request is not valid." — the Electron window sent a value that is not text or a whole number where one is needed. It is checked in `clients/electron/main.js` before `logic/` is called.
- "The database failed." — SQLite failed, or the database program is not running. Every call to `queries/` is wrapped in try/catch and throws this sentence instead. The original message stays hidden.
- "The classifier failed." — Ollama did not answer. The original message stays hidden.

A new failure is added to this list before it is used in code.
