# Plan — classify users by name, six at a time

## Files

- Change `logic/count-users-by-gender.js` — send names in groups of six, with a strict JSON schema.
- No new client. `clients/terminal/count-users-by-gender.txt` stays as it is.
- No query change. The feature still uses `findAll()`. No new `.sql` file.
- No new package. The model is still called with Node's built-in `fetch`.

## The function

`countUsersByGender()` — takes nothing, like before.

- It is `async`.
- It returns `{ male, female, undefined }` — three numbers.
- It reads every name with `findAll()`.
- It splits the names into groups of six. For each group, it asks the model once and adds one to the count of each label.
- It throws:
  - "The database failed." if `findAll()` fails.
  - "The classifier failed." if the model does not answer, the answer is not valid JSON, or the number of labels is not the number of names.
- No partial count: if a call throws, the function throws and returns nothing.

## Edge cases

- No users: returns `{ male: 0, female: 0, undefined: 0 }` without calling the model.
- A number of users that is not a multiple of six: the last group is smaller.

## The model

- Llama 3 through Ollama, tag `llama3.2:latest`, on the same machine.
- Called with `fetch` to Ollama's OpenAI-style endpoint `http://127.0.0.1:11434/v1/chat/completions`, because only that endpoint takes `strict: true`.
- `temperature` 0. The same example names in the prompt. The names are sent as a numbered list.
- `response_format` is `{ type: "json_schema", json_schema: { name: "gender_list", strict: true, schema } }`. The schema is an object with one required field, `genders`: an array of strings that can only be `male`, `female`, or `undefined`. `additionalProperties` is `false`.
- The answer text is in `choices[0].message.content`. It is parsed with `JSON.parse`.
- Ollama must be running and the model pulled. That is a precondition.

## Order inside the logic file

1. No input to receive.
2. No input to clean.
3. Read all users with `findAll()`. If there are none, return the three zeros.
4. For each group of six names, ask the model and add one to `male`, `female`, or `undefined` for each label.
5. Return the three counts.

## Constitution changes this feature needs

None. No new logic file, no new error sentence, no new client file.

## What stays the same

`queries/`, `db/`, the other `logic/` files, all clients, and `docs/CONSTITUTIONS.md`.
