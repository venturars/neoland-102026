# Errors

A failure throws an English sentence with `throw new Error(...)`. It is not returned inside an object. These are the only sentences:

- "The name is missing." — the name is empty or only spaces.
- "The email is not valid." — the email is not two parts around `@`, or it is 64 characters or longer.
- "This email is already used." — another user already has this email.
- "No user was found." — no user has this id, or no user has this email.
- "There is nothing to update." — an update was sent with no name and no email.
- "The database failed." — SQLite failed. Every call to `queries/` is wrapped in try/catch and throws this sentence instead. The original SQLite message stays hidden.
- "The classifier failed." — Ollama did not answer. The original message stays hidden.

A new failure is added to this list before it is used in code.
