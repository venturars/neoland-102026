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
  - `AI_URL` = `"http://127.0.0.1:11434/v1/chat/completions"` (Ollama's OpenAI-compatible API).
  - `BATCH_SIZE` = `6`.
- Ollama must be running with `llama3.2` downloaded. Local, no cost, no key.
- The call is the global `fetch`: `POST AI_URL`, JSON body `{ model: MODEL, temperature: 0, messages }`.
- Names come from `findAll()`, in that order, and go in batches of 6. The last batch may have fewer. One call per batch. Only names are sent, never the email.
- `messages`, in this order:
  1. `system`: "For each line, answer one word on its own line: women, men or undefined. Same number of lines, same order. Nothing else."
  2. A `user` / `assistant` example, with names not in the database:

     | user   | assistant |
     | ------ | --------- |
     | Carmen | women     |
     | Javier | men       |
     | Kim    | undefined |

  3. `user`: the batch, one name per line, in the order read.

- The answer is `choices[0].message.content`. It is split into lines; empty lines are dropped; each line is trimmed and lowercased.
- A valid answer has as many lines as names in the batch. Line by line:
  - `women` adds 1 to `women`
  - `men` adds 1 to `men`
  - `undefined`, or any other value, adds 1 to `genderUndefined`
- No message, a body that is not JSON, or a different number of lines: every name in that batch adds 1 to `genderUndefined`, and the next batch goes on.

## Errors

| Spec failure                                               | Message                                             |
| ---------------------------------------------------------- | --------------------------------------------------- |
| the AI does not respond (no connection, or status not 2xx) | `Could not classify the users`                      |
| SQLite fails while reading the users                       | `Could not classify the users`                      |
| the AI sends no message                                    | not a failure: that batch adds to `genderUndefined` |
| the answer has no gender for a name                        | not a failure: that batch adds to `genderUndefined` |
| a value is neither `women` nor `men`                       | not a failure: that name adds to `genderUndefined`  |

If one call fails, no partial count is returned.

## Client

`clients/terminal/count-users-by-gender.txt` imports `countUsersByGender`, `await`s it and prints the result with `console.log`. When Ollama is not running it prints `error.message`. The current folder is `first-app`.

## Open questions

1. **Spec vs one word per line.** With one word per line, an answer that misses a name has one line too few, so the code cannot tell which name is missing. The plan counts **every name in that batch** as undefined. The spec says "that name counts as undefined". Change the spec failure to: "The AI's answer does not give one gender per name → every name sent with it counts as undefined"?
2. **Spec vs batches.** The spec says "The AI sends no message → every name counts as undefined". With batches of 6 there is one message per batch. Change it to: "→ every name sent with it counts as undefined"?
