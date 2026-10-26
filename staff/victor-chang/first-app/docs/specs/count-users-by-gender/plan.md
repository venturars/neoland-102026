# Plan — count users by gender

New feature. It replaces no `logic/` file, saves no data and changes no other feature.

## Files

- Create: `logic/count-users-by-gender.js`, `clients/terminal/count-users-by-gender.txt`.
- Touch: `docs/CONSTITUTION.md`, only the tree: `logic/` lists `count-users-by-gender.js`.

## Looks like

`logic/list-users.js`: it reads every user, then counts instead of returning them.

## Signature

`countUsersByGender()` → `Promise<{ women, men, genderUndefined }>`

- No parameters. It is `async` because it waits for the AI.
- The three values are whole numbers. Their sum is the number of users read.
- No users → `{ women: 0, men: 0, genderUndefined: 0 }`, without calling the AI.

## SQL

None new. No writes. Reuses `findAll()` from `queries/users.js`.

## AI

- Constants in `logic/count-users-by-gender.js`:
  - `MODEL` = `"llama3.2"`. Changing model is changing this constant.
  - `AI_URL` = `"http://127.0.0.1:11434/v1"` (Ollama's OpenAI-compatible API).
  - `BATCH_SIZE` = `6`.
- Ollama must be running with `llama3.2` downloaded. Local, no cost, no key.
- Names come from `findAll()`, in that order, and go in batches of 6. The last batch may have fewer. One call per batch. Only names are sent, never the email.
- The client is the `openai` npm package, installed with pnpm: `new OpenAI({ baseURL: AI_URL, apiKey: "ollama" })`. Ollama ignores the key, but the client needs one.
- Each call is `chat.completions.create({ model: MODEL, temperature: 0, response_format, messages })`. A failed call (Ollama stopped, error status) throws, and the `catch` turns it into `Could not classify the users`.
- `response_format` makes the AI answer JSON with this shape:

  ```js
  {
    type: "json_schema",
    json_schema: {
      name: "genders",
      strict: true,
      schema: {
        type: "object",
        properties: {
          genders: {
            type: "array",
            items: { type: "string", enum: ["women", "men", "undefined"] },
          },
        },
        required: ["genders"],
        additionalProperties: false,
      },
    },
  }
  ```

- `messages`, in this order:
  1. `system`, one sentence per line:

     ```
     The user sends first names, one per line.
     Answer genders with one value per name, in the same order.
     Each value is women, men or undefined.
     Judge only by the name.
     ```

  2. Five `user` / `assistant` example pairs, one name each, with names not in the database:

     | user   | assistant                      |
     | ------ | ------------------------------ |
     | Carmen | `{ "genders": ["women"] }`     |
     | Lucia  | `{ "genders": ["women"] }`     |
     | Javier | `{ "genders": ["men"] }`       |
     | Pablo  | `{ "genders": ["men"] }`       |
     | Kim    | `{ "genders": ["undefined"] }` |

  3. `user`: the batch, one name per line, in the order read.

- The answer is `choices[0].message.content`, read with `JSON.parse`. Its `genders` must be an array with one value per name in the batch. Value by value:
  - `women` adds 1 to `women`
  - `men` adds 1 to `men`
  - `undefined`, or any other value, adds 1 to `genderUndefined`
- No message, JSON that cannot be read, or `genders` that is not one value per name: every name in that batch adds 1 to `genderUndefined`, and the next batch goes on.
- Nothing is written to the database. Neither the list nor each user's gender is returned.

## Errors

| Spec failure                                               | Message                                             |
| ---------------------------------------------------------- | --------------------------------------------------- |
| the AI does not respond (no connection, or status not 2xx) | `Could not classify the users`                      |
| SQLite fails while reading the users                       | `Could not classify the users`                      |
| the AI sends no message                                    | not a failure: that batch adds to `genderUndefined` |
| the answer cannot be read                                  | not a failure: that batch adds to `genderUndefined` |
| the answer does not give one gender per name               | not a failure: that batch adds to `genderUndefined` |
| a value is neither `women` nor `men`                       | not a failure: that name adds to `genderUndefined`  |

If one call fails, no partial count is returned.

## Client

`clients/terminal/count-users-by-gender.txt` imports `countUsersByGender`, `await`s it and prints the result with `console.log`. When Ollama is not running it prints `error.message`. The current folder is `first-app`.

## Open questions

None.
