# Classifier implementation tasks

Tasks approved by Miguel on 2026-10-20.

References: [approved specification](spec.md), [approved technical plan](plan.md), and [constitution](../../CONSTITUTIONS.md). Execute these tasks only after Miguel approves this task list. The model and dependency choices are approved; the SDK/model/schema combination passed the recorded real-service verification. Real unavailable-service verification remains outstanding.

1. **Project environment — check prerequisites.** Inspect local Node, pnpm, Ollama, and the locally available `llama3.2` model without changing global tools or downloading models. Record versions, Node SQLite support, and local endpoint availability. **Result:** known prerequisites and blockers. If prerequisites or compatibility prevent the approved approach at any stage, report the blocker and stop affected work for a decision; never silently substitute versions, models, APIs, or response formats.

2. **Project dependencies — install the approved package.** During authorized implementation, run `pnpm add --save-exact openai@7.39.0` and let pnpm generate its lockfile without manual edits. **Result:** `package.json` pins exactly `7.39.0`, `pnpm-lock.yaml` agrees, and the SDK is available. No opportunistic upgrades or other dependencies.

3. **`logic/users-gender-count.js` — establish the public operation.** Add the single parameterless async `usersGenderCount()` export, directly reuse `findAll()`, map database-reading failures to the planned ordinary error, and return the three zero counts for empty data. **Result:** the public contract exists, with no model contact for an empty table.

4. **`logic/users-gender-count.js` — add the approved local requests.** Use the single uppercase `MODEL` constant, local SDK connection, `chat.completions.create`, and temperature from the plan. Process query-ordered batches of six using only names, the five ordered plain-name/plain-label pairs (Carmen/women, Lucia/women, Javier/men, Pablo/men, Kim/undefined), then the batch's newline-separated names, all in one request per batch. Preserve the planned `json_schema` response format. **Result:** requests follow the approved endpoint, model, message, batching, and response-format decisions exactly.

5. **`logic/users-gender-count.js` — complete counting and failure handling.** Apply the plan's positional counting, individual undefined fallback, whole-batch malformed-response fallback with continuation, and generic API-request failure behavior. **Result:** success returns only `{ women, men, genderUndefined }` totaling the contact count; database/request failures throw `Error("Could not classify the users")` with no partial return. No output, writes, helpers, injected arguments, or connection management.

6. **`clients/terminal/users-gender-count.txt` — add the terminal example.** Create the copyable module heredoc that imports and awaits the operation and prints its result, with the project-directory, initialization, saved-contact, dependency, Ollama, and model prerequisites from the plan. **Result:** a standalone copyable client that neither initializes nor creates data.

7. **`docs/CONSTITUTIONS.md` — align the application contract.** Apply only the plan's structure, async public return, error, read-only behavior, dependency/lockfile status, and feature-stage updates. **Result:** the constitution describes the actual implementation, while classifier request details remain in the feature documents and all other contracts remain intact.

8. **Disposable project copies — perform controlled verification.** Use temporary request interception or stubbing outside application code to check empty data without a request; thirteen contacts in six/six/one batches; request contents; exact result keys and total; all planned malformed-response and individual-value fallbacks; and database/request failures, including failure after a successful batch. Compare every record and timestamp before and after. **Result:** observed controlled outcomes match the plan, with unchanged data and no persistent tests or application injection hooks.

9. **Disposable project copy with local Ollama available — verify the real client.** Execute the actual initialization and classifier terminal clients with the approved local model and enough contacts for multiple batches. Confirm required API/schema compatibility, exact result shape and total, and unchanged records/timestamps. **Result:** recorded real-model counts and compatibility evidence, clearly separated from controlled checks and illustrative classifications.

10. **Disposable project copy with local Ollama unavailable — verify real request failure.** Execute the actual classifier client with saved contacts while the local endpoint is unavailable, without disrupting unrelated services. **Result:** the generic classification error and no partial result, with unchanged data. If this state cannot be arranged safely, report the check as blocked rather than claiming a controlled simulation is a real unavailable-service run.

11. **Disposable project copies and working project — check regressions and preservation.** Run all seven existing terminal clients in a suitable order and verify existing operation contracts and errors as specified in the plan. Confirm the working project's data remains untouched and no working-project database was created for verification. **Result:** existing behavior passes and working data is preserved.

12. **Verification workspace — clean up and report.** Remove temporary copies and verification files, then report commands, Node/pnpm/SDK/Ollama/model versions, actual results, and blocked checks. Distinguish controlled checks, available-service runs, and unavailable-service runs. **Result:** no temporary verification artifacts remain and no unsupported success claims are made.

Scope excludes extra functionality, configuration files, helpers, injected arguments, persistent tests, `.gitignore`, `.nvmrc`, and `README.md`. Leave existing operations and SQL unchanged. Git and publishing remain manual.

## Execution results — 2026-10-20

Initial attempt: blocked at task 1 before implementation; superseded by the resumed results below.

- Read `AGENTS.md`, the constitution, and all three classifier documents.
- `node --version`: `v24.12.0`. A `node --input-type=module -e` import of `DatabaseSync` from `node:sqlite` confirmed it is available, without opening a database.
- `pnpm --version`: `11.25.0`.
- Initial sandboxed Ollama checks could not access the local service. Repeated read-only checks outside the network sandbox using `ollama --version`, `ollama list`, and `curl --max-time 5 --silent --show-error http://127.0.0.1:11434/api/tags` confirmed Ollama `0.40.6` is running.
- Blocker: the local model list contains only `nimble-v3:latest`; approved `llama3.2` is not installed. No model was called, downloaded, or substituted, and no service was changed.
- Stopped dependent tasks for a decision as required. Did not run `pnpm add --save-exact openai@7.39.0`; SDK availability/compatibility remains unverified. No implementation, client, lockfile, or constitution changes were made.
- Controlled checks, actual classifier-client checks with available/unavailable Ollama, and existing-operation regressions were not run because implementation is blocked. No verification success is claimed.
- No disposable copies or verification artifacts were created. Working data remains untouched, and no working-project database was created. No Git commands were run.

Initial blocker resolution: Miguel subsequently authorized `ollama pull llama3.2`, without replacing the existing model or changing services.

## Resumed execution results — 2026-10-20

Status: classifier implemented and verified with the real local model. One environment-dependent check remains unrun: real Ollama-unavailable execution.

- `ollama pull llama3.2` completed successfully. `ollama list` confirmed `llama3.2:latest`, ID `a80c4f17acd5`, approximately 2.0 GB. Existing `nimble-v3:latest`, ID `5b6e67d8b09b`, remained present and unchanged. No tools were upgraded or services changed.
- Versions used: Node `v24.12.0`, pnpm `11.25.0`, Ollama `0.40.6`, OpenAI JavaScript SDK `7.39.0`.
- Ran `pnpm add --save-exact openai@7.39.0` successfully. pnpm updated `package.json` and generated `pnpm-lock.yaml`; no manual lockfile edits or additional dependencies. `node_modules` is a local installation artifact.
- Created `logic/users-gender-count.js` and `clients/terminal/users-gender-count.txt`; updated only the constitution's approved structure/contracts/dependency/stage descriptions. Existing operations, queries, and SQL were preserved. `node --check logic/users-gender-count.js` passed.
- Controlled verification: temporary Python harnesses copied the project, linked its installed SDK, and ran `node --input-type=module` assertions. Temporary SDK-method interception confirmed zero requests for empty data; thirteen contacts in six/six/one batches; local connection and placeholder; exact model, temperature, plain-label messages, names-only payload, and JSON schema. Exact three-key result and totals passed. Missing message, unreadable/null JSON, missing/non-array genders, wrong-size arrays, and unknown individual values used the approved fallbacks. First-request and later-request failures produced the exact generic error without partial results. A closed or uninitialized database produced the exact generic error. Records/timestamps remained unchanged.
- Real local service: executed the actual initialization and classifier heredocs through `/bin/zsh` in a disposable copy against the installed SDK and local Ollama, without interception. For thirteen temporary contacts (Elena, Mateo, Alex, Carmen, Lucia, Javier, Pablo, Kim, Ada, Grace, Sam, Maria, Robin), the actual client printed `{ women: 6, men: 5, genderUndefined: 2 }`. Shape, nonnegative whole counts, total 13, and unchanged records/timestamps passed. This confirms the approved SDK/model/API/schema combination worked in this run; it does not establish verified gender identities or guarantee identical future classifications.
- Actual empty-data client: `/bin/zsh` execution printed `{ women: 0, men: 0, genderUndefined: 0 }`.
- Real unavailable-service check: not run. Ollama was already serving the existing model as well as the newly downloaded model. Stopping or changing that service would risk unrelated work and was not authorized. Controlled request-failure checks passed but are not evidence of a real unavailable-service run.
- Regression verification: executed all seven existing terminal heredocs through `/bin/zsh` in a disposable copy. Additional Node assertions checked creation, listing, updating, deletion, both lookups, normalization, exact ordinary-object values, duplicates, missing users, validation (including malformed stored email), repeated initialization, uninitialized-table errors, and failed-write error mapping. Passed.
- All temporary project copies and verification artifacts were removed. No working-project database was created; working data was preserved. No Git commands, feature expansion, or publishing actions were performed.

## Request-alignment amendment — 2026-10-20

- Applied Miguel's focused amendment: removed only the additional system message from `logic/users-gender-count.js`. Requests now contain exactly the five approved plain user/assistant pairs followed by one batch user message, eleven messages total. Updated the plan's explicit message contract and current verification status, and corrected this document's stale introductory compatibility status. Earlier execution records remain intact.
- `node --check logic/users-gender-count.js` passed. Verification used a temporary Python harness, `node --input-type=module` assertions with temporary SDK-method interception, and actual heredocs executed through `/bin/zsh` in a disposable project copy, linked to the existing installed SDK.
- Controlled checks passed: empty data produced zero requests; thirteen contacts produced exactly three requests in six/six/one order; each request contained exactly eleven messages, the ten exact ordered examples followed by newline-separated names, and no system message. Endpoint, placeholder key, model, temperature, and full JSON schema were unchanged. Exact counts and totals, individual unknown-value fallback, all planned missing/unreadable/malformed/wrong-length response fallbacks with subsequent batches continuing, first/later request failures, and generic database failure passed. Records and timestamps were unchanged.
- Real local service: the actual unchanged classifier terminal client ran without interception against local Ollama using thirteen temporary contacts and returned `{ women: 6, men: 6, genderUndefined: 1 }`. Exact keys, nonnegative integer counts, total 13, and preservation of every record/timestamp passed. This is a real-model result, separate from controlled verification; it does not establish gender identities or guaranteed repeatability.
- Environment remained Node `v24.12.0`, installed SDK `7.39.0`, model `llama3.2`, and Ollama `0.40.6`. No dependencies were changed or installed for this amendment.
- Real unavailable-service verification remains outstanding. The running Ollama service was not stopped or changed. Controlled failures do not replace that unrun check.
- The disposable copy and verification artifacts were removed. Working data was preserved; no working-project database was created. No changes to other operations, SQL, dependencies, or configuration; no Git commands.
