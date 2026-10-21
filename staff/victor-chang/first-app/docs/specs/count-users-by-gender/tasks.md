# Tasks — count users by gender

The feature already exists. These steps change how it asks the AI and reads the answer: JSON instead of one word per line.

1. [x] In a terminal, run `ollama serve`. In another, run `ollama list`: `llama3.2` is listed.
2. [x] Open `logic/count-users-by-gender.js`. Look at the constants, the `fetch` body and how the answer is read.
3. [x] Replace the system text with the plan's four sentences.
4. [x] Replace the six example names and genders with the plan's five example pairs, one name each.
5. [x] Add the constant `RESPONSE_FORMAT` with the plan's `json_schema`. Add `response_format: RESPONSE_FORMAT` to the `fetch` body.
6. [x] Build `messages`: system, then each example as a `user` name and an `assistant` `{ "genders": [...] }`, then the batch.
7. [x] Read the answer: `JSON.parse` the message. No message or JSON that cannot be read: the whole batch adds to `genderUndefined`.
8. [x] If `genders` is not an array with one value per name: the whole batch adds to `genderUndefined`. Otherwise count value by value.
9. [x] Paste `clients/terminal/count-users-by-gender.txt` in Git Bash: three numbers print, and they add up to 21.
10. [x] Stop Ollama and paste the block again: `Could not classify the users` prints.
11. [x] Run `npx prettier --write .`. Commit.
