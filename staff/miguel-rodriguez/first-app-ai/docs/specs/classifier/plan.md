# Classifier technical plan

Plan approved by Miguel on 2026-10-20.

References: [approved business specification](spec.md) and [application constitution](../../CONSTITUTIONS.md). This plan does not authorize implementation; reviewed and approved tasks follow plan approval.

## Files and public contract

Create `logic/users-gender-count.js` and `clients/terminal/users-gender-count.txt`.

The logic file exports one async function, `usersGenderCount()`, without parameters. Import and call `findAll()` directly from `queries/users.js`; retain its query order. Return only an ordinary object containing `women`, `men`, and `genderUndefined`. Every contact contributes once, and the counts sum to the retrieved contact count. An empty list returns three zeroes without contacting the model.

Do not change SQL, write data, introduce helpers or injected arguments, or change existing business operations. Business logic prints nothing. Preserve every stored value and timestamp on success and failure. Classifications are name-based guesses, not verified gender identities.

## Local AI connection and dependency

The approved chat-compatible local model is `llama3.2`. Store the name once in an uppercase `MODEL` constant.

Use the OpenAI JavaScript library with explicit `baseURL: http://127.0.0.1:11434/v1` and `apiKey: ollama`. The key is the SDK's required placeholder, ignored by local Ollama, not a paid-service credential. Do not connect to a hosted OpenAI service or use a cloud model. [Ollama's compatibility documentation](https://docs.ollama.com/api/openai-compatibility) describes local OpenAI-client connections and the placeholder key.

Use `chat.completions.create` with `temperature: 0`. This setting does not guarantee identical classifications across runs.

The approved exact dependency is `openai@7.39.0`, installed during implementation with:

```sh
pnpm add --save-exact openai@7.39.0
```

Let pnpm generate and maintain `pnpm-lock.yaml`; do not edit it manually. Keep it consistent with `package.json`. No package or model installation, package metadata changes, or lockfile creation belongs to this planning step.

## Requests

Process contacts sequentially in query order, in batches of six, with a smaller final batch when needed. Send only names: never emails, IDs, timestamps, or other stored fields.

Each batch is one request containing exactly these five few-shot user/assistant pairs in order, followed by the batch user message, with no additional system message (eleven messages total):

| User name | Assistant classification |
| --- | --- |
| Carmen | women |
| Lucia | women |
| Javier | men |
| Pablo | men |
| Kim | undefined |

Each few-shot pair uses the name as plain user-message content and its plain label as assistant-message content. Keep the five pairs above in order. Follow the examples with one user message containing that batch's names, one name per line. The example pairs are messages inside the batch request, not separate API requests. Uncertain or ambiguous classifications count as `undefined`.

Use `response_format` with `json_schema`: an object containing only the required `genders` property, an array of strings whose allowed values are `women`, `men`, and `undefined`; disallow additional object properties. Request one entry per supplied name in the same order.

## Responses and failures

Associate each returned classification with the corresponding name by batch position. Count exact `women` and `men` labels; all other individual values contribute to `genderUndefined`. Do not return per-contact classifications.

Read the completion message and parse its JSON. A missing message, unreadable JSON, missing or non-array `genders`, or an array length different from the batch size makes the entire affected batch contribute to `genderUndefined`. Continue with subsequent batches. A usable array with an unrecognized individual value falls back only for that contact. Do not count the few-shot examples as saved contacts.

A database-reading or API-request failure throws an ordinary `Error("Could not classify the users")`. Return no partial count, even if earlier batches succeeded. Keep these failures distinct from successfully received but unusable response content, which uses the undefined fallback.

## Terminal client and prerequisites

Use the existing copyable `node --input-type=module` heredoc pattern. Import `usersGenderCount` with a `.js` extension, await `usersGenderCount()`, and print only its returned result with `console.log`.

State that the example runs from the project directory after separate table initialization and, for a nonempty example, contact creation. Local Ollama must be running at the specified endpoint with `llama3.2` already available locally; the approved dependency must be installed. Do not initialize the table, create contacts, start services, or download models inside the client. Empty-data execution does not require a running model service.

## Constitution updates during implementation

Update the folder structure with the new logic/client files and feature documents. Add the parameterless async public contract and its three-count return, without changing existing user-return contracts. Document `Could not classify the users`, read-only behavior, the installed exact dependency and pnpm lockfile status, and the classifier's actual feature stage. Replace the stale statement that the classifier has not started. Keep batching, messages, model settings, and response details in this feature's documents rather than the common constitution.

## Verification during implementation

Use disposable project copies, temporary data, and a Node version supporting `node:sqlite`. Execute the actual initialization and classifier terminal clients; preserve the working project's data and remove all temporary files afterward. Report commands, Node/package/model versions, actual results, and blockers accurately.

Controlled checks, without changing the public signature or adding persistent tests:

- Empty table: exactly three zeroes and no model request.
- More than six contacts, for example thirteen: batches of six, six, and one in query order; one request per batch, correct few-shot messages, and names as the only stored data sent.
- Exact result keys, nonnegative whole counts, and a total equal to the retrieved contact count.
- Missing message, unreadable JSON, missing/non-array `genders`, and wrong-length arrays: entire affected batch undefined, with later batches still processed. Unknown individual values affect only their contact.
- Database failure and request failure, including failure after a successful batch: exact generic error and no partial result.
- Compare all records and timestamps before and after every outcome.
- Run all seven existing terminal clients in a suitable order and check existing operations, normalization, validation, duplicates, missing users, and query-failure behavior.

Use temporary request interception or stubbing in the disposable verification environment for controlled responses and request inspection; do not add application helpers, dependency-injection parameters, or permanent support files.

Separately run the actual new terminal client against available local Ollama with the approved model and enough saved contacts for multiple batches. Record the real counts and verify shape, total, and unchanged data; do not treat illustrative name labels as guaranteed real-model results. Also execute the actual client with local Ollama unavailable and confirm the generic failure with no partial result. Coordinate service availability without disrupting unrelated work. Clearly distinguish these real-service runs from controlled response checks. If a prerequisite is unavailable, report that verification as blocked rather than claiming it passed.

## Conflicts and unresolved decisions

No confirmed business conflict was found. Miguel approved `llama3.2` and the exact `openai@7.39.0` dependency on 2026-10-20. These choices are settled. The approved SDK/model/API/`json_schema` combination passed the recorded real-service verification in `tasks.md`; the earlier prerequisite blocker and its resolution remain recorded there. Real unavailable-service verification is explicitly outstanding and is not replaced by controlled request-failure checks. If prerequisites or compatibility prevent this approved approach, report the blocker and stop the affected work for a decision rather than changing versions, models, APIs, or response formats silently.
