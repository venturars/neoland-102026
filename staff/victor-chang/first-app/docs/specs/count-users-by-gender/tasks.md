# Tasks — count users by gender

The feature already exists. These steps change how it asks the AI and reads the answer: JSON instead of one word per line.

1. [x] In a terminal, run `ollama serve`. In another, run `ollama list`: `llama3.2` is listed.
2. [x] Open `logic/count-users-by-gender.js`. Look at the constants, the AI call body and how the answer is read.
3. [x] Replace the system text with the plan's four sentences.
4. [x] Replace the six example names and genders with the plan's five example pairs, one name each.
5. [x] Add the constant `RESPONSE_FORMAT` with the plan's `json_schema`. Add `response_format: RESPONSE_FORMAT` to the AI call.
6. [x] Build `messages`: system, then each example as a `user` name and an `assistant` `{ "genders": [...] }`, then the batch.
7. [x] Read the answer: `JSON.parse` the message. No message or JSON that cannot be read: the whole batch adds to `genderUndefined`.
8. [x] If `genders` is not an array with one value per name: the whole batch adds to `genderUndefined`. Otherwise count value by value.
9. [x] Paste `clients/terminal/count-users-by-gender.txt` in Git Bash: three numbers print, and they add up to 21.
10. [x] Stop Ollama and paste the block again: `Could not classify the users` prints.
11. [x] Run `npx prettier --write .`. Commit.

## Call the AI with the openai package

12. [x] In `first-app`, run `pnpm add openai`: `package.json` lists `openai` and `pnpm-lock.yaml` is created. Add `node_modules/` to `.gitignore`.
13. [x] In `logic/count-users-by-gender.js`, set `AI_URL` to `http://127.0.0.1:11434/v1` and create the client `new OpenAI({ baseURL: AI_URL, apiKey: "ollama" })`.
14. [x] Replace the `fetch` and its status check with `ai.chat.completions.create(...)`, same body. Read `completion.choices[0].message.content`.
15. [x] Paste `clients/terminal/count-users-by-gender.txt` in Git Bash: three numbers print, and they add up to 21. Stop Ollama: `Could not classify the users` prints.
