# Plan — A Nest HTTP API for the users

**Status: reviewed, then changed.** The person accepted every recommendation on 2026-11-04, and on 2026-11-05 changed the answer to question 1a ("Decisions", below). The questions at the end stay as the record of what was found; where a line is replaced by the change, it says so.

## Decisions

- **1a:** ~~option A, plain Node with no build.~~ **Replaced on 2026-11-05, see "Change of 2026-11-05" below.**
- **1b:** no `UsersService`. The routes call `logic/` directly.
- **2:** the client is plain ESM, with no interop and no CommonJS.
- **3:** `@nestjs/platform-express` 12.3.3, with the second Express copy (5.3.0 next to the app's 5.2.1) accepted.
- **Packages:** `@nestjs/core`, `@nestjs/common` and `@nestjs/platform-express` at 12.3.3, `reflect-metadata` 0.2.2 and `rxjs` 7.8.2, pinned exact. The Socket review, its gaps and the version published today are accepted.
- **4a:** a table of sentences in the filter, in the order of question 4.
- **4b:** the shape checks go in the controller methods and throw `new BadRequestException("The request is not valid.")`.
- **5:** the replacement line of question 5, with Express as the platform and the real folder `src/clients/chrome/`.
- **6:** the notice goes in `AGENTS.md` ("Style") and in `docs/ARCHITECTURE.md` (the `nest/` entry), with "file names" added to its list. `docs/STYLE.md` and `docs/ERRORS.md` are not touched, including the out-of-date line about "The request is not valid."
- **7:** a body too large answers 400 "The request is not valid."
- **8:** files use Nest's names: `users.controller.js`, `app.module.js`, `errors.filter.js`.
- **9:** `logger: false` and one line: `Nest client on http://127.0.0.1:3003`.

### Change of 2026-11-05

The person changed 1a from option A to option B (Babel) and accepted everything below. It replaces the lines marked "superseded" in this plan; the other decisions above stay.

- **1a:** real `@` decorators, written as in the Nest docs: `@Controller()`, `@Post("users")`, `@Get("users/:id")`, `@Patch("users/:id")`, `@Delete("users/:id")`, `@HttpCode(204)`, `@Catch()` and `@Module(...)`. The parameters use `@Bind(Body())`, `@Bind(Param("id"))` and `@Bind(Param("id"), Body())`, which is Nest's way for plain JavaScript and needs only `@` on methods, so the Babel limit on `@` in parameters does not apply.
- **Build:** `pnpm nest` runs Babel over all of `src/` into `dist/`, then runs `dist/clients/nest/main.js`. The script is `babel src --out-dir dist --delete-dir-on-start && node dist/clients/nest/main.js`, so old files do not stay in `dist/`. The whole of `src/` is built because the compiled client imports `logic/` and `queries/` from `dist/`.
- **Packages:** four dev packages, pinned exact: `@babel/core` 8.1.0, `@babel/cli` 8.1.0, `@babel/plugin-proposal-decorators` 8.0.2 and `@babel/eslint-parser` 8.0.7. `@babel/preset-env` is **not** added: Node 23.7.0 runs the output and the imports stay ESM. SWC is not chosen.
- **Config:** a `babel.config.json` with the decorators plugin in `legacy` mode. `eslint.config.js` ignores `dist/` and reads `src/clients/nest/` with `@babel/eslint-parser`. No other ESLint rule changes.
- **`dist/`:** ignored by git (`.gitignore` of `first-app`) and by ESLint. `pnpm format` does not touch it, because its patterns name the source folders.
- **`AGENTS.md`:** the framework line of question 5 gets "This client is the only code with a build step." The notice of question 6 gets "a build step" in its list.
- Superseded by this change: the text of 1a above, the row "A: plain Node" as the chosen option, the `"nest"` script `node src/clients/nest/main.js`, "`eslint.config.js` with option A" in "What stays as it is", and the replacement line of question 5 without the build-step sentence.

A new client in `src/clients/nest/`: a small Nest program on `127.0.0.1:3003`. It is a thin layer, like `src/clients/api/server.js`: each route calls one existing function of `logic/`, and one error filter turns the result or the thrown error into an HTTP answer. Nothing in `logic/`, `queries/` or `db/` changes. There is no new function in `logic/`, no new query and no new `.sql` file.

A note on names: the issue brief says "the extension server in `src/clients/extension/`". The real folder is `src/clients/chrome/`, started with `pnpm chrome`. This plan uses the real names.

## What was tried (a spike, not code to keep)

Nest was installed outside the repository, in a scratch folder, with `--ignore-scripts`, using a copy of `src/` and its own empty database on ports 3100-3110. Your `users.sqlite`, your running programs on 3000-3002 and this repository were not touched. The same 35 requests were sent to a copy of the HTTP client and to each Nest version, then the database was stopped. Everything was run on Node 23.7.0, the version on this computer. All processes were stopped afterwards.

| Version run | Result |
|---|---|
| A: plain Node, `platform-express` | All routes and errors of the spec are right |
| A: plain Node, `platform-fastify` | Same, with the differences in question 3 |
| A: plain Node, `platform-node` | Same |
| B: Babel, `@` everywhere | The build says "success", the program does not start (question 1) |
| B: Babel, `@` on classes and methods only, `platform-express` | All routes and errors of the spec are right, except the row below |
| C: SWC, `@` everywhere, `platform-express` | All routes and errors of the spec are right, except the row below |

The "something unexpected" case (log + 500) was run only on the three versions of A. Not run: the `@babel/register` way of the official starter, Babel 7, and B or C on Fastify.

**Second spike, 2026-11-05, for the change (also not code to keep).** A copy of `src/` in a scratch folder, `--ignore-scripts`, a fresh database on port 3100 and the client on 3103. The three Nest files were written with real `@` and `@Bind(...)`, with `babel.config.json` and the four Babel packages, no `preset-env`. `babel src --out-dir dist` compiled 22 files, and `node dist/clients/nest/main.js` ran them.

| Check on the Babel build | Result |
|---|---|
| Create, list, view, update with a name only (email kept), delete | 201, 200, 200, 200, 204, as the spec |
| Empty name, bad email, `PATCH` with `{}` | 400 with each sentence |
| Duplicate email | 409 "This email is already used." |
| No body, `name` as a number, broken JSON, a form, a body of 200 KB, `name` as an array in `PATCH` | 400 "The request is not valid." |
| Id `999999` and `abc` | 404 "No user was found." |
| Unknown route, `PUT /users`, `OPTIONS /users` | 404 with an empty body |
| `HEAD /users`, `GET /users/` | 200 |
| Database program stopped | 500 "The database failed." |
| Something unexpected (log + 500) | Not run in this spike |

For lint, in the same copy: with the current `eslint.config.js`, `pnpm lint` stopped with `Parsing error: Unexpected character '@'` on the three Nest files. With `@babel/eslint-parser` on the Nest folder it passed, and it still reported a deliberate unused import and an undefined variable. Prettier accepted the `@` syntax.

## Files to add or change

**Add**, with option B of question 1 (see "Change of 2026-11-05") and the names of question 8.

- `src/clients/nest/main.js`: creates the app, sets the JSON body parser and the filter, and listens. `HOST` and `PORT` are constants at the top, with a short comment.
- `src/clients/nest/app.module.js`: the module, with the controller, written with `@Module(...)`.
- `src/clients/nest/users.controller.js`: the five routes, with `@Controller()`, one verb decorator per method and `@Bind(...)` for the input.
- `src/clients/nest/errors.filter.js`: the error filter (question 4), written with `@Catch()`.
- `babel.config.json`, in the root of `first-app`: the decorators plugin in `legacy` mode.
- `src/clients/terminal/nest.txt`: `curl` examples for the five routes on port 3003, with Spanish comments, like `api.txt` and `chrome.txt`. The first lines say it is pasted with `first-app` as the current folder and that `pnpm start` and `pnpm nest` must be running.

**Change**

- `package.json`: the new dependencies, pinned exact (question 1 and 3), the four Babel packages in `devDependencies`, the script `"nest": "babel src --out-dir dist --delete-dir-on-start && node dist/clients/nest/main.js"`, and `\"src/clients/nest/**/*.js\"` in `format`. `pnpm-lock.yaml` changes with the install.
- `eslint.config.js`: add `dist/**` to the ignored paths, and a block for `src/clients/nest/**/*.js` that uses `@babel/eslint-parser` with the decorators plugin. No other rule changes.
- `.gitignore`, in `first-app`: add `dist/`.
- `AGENTS.md`: the framework line (question 5). In "Commands", add `src/clients/nest/` to the `pnpm format` list and add: "`pnpm nest` builds `src/` with Babel into `dist/` and starts the Nest client on `http://127.0.0.1:3003` (the database program must be running)."
- `docs/TREE.md`: add `nest/` with its files under `clients/`, `nest.txt` under `terminal/`, and `babel.config.json` in the root of `first-app`. Nothing for `dist/`, which is not in git.
- `docs/ARCHITECTURE.md`: add `nest/` under `src/clients/`: the Nest app started with `pnpm nest`, on `http://127.0.0.1:3003`, what each file does, the build with `babel.config.json` into `dist/` (not in git), and that the database program must be running.
- The notice that this client departs from `docs/STYLE.md` and `docs/ERRORS.md` (question 6).

`docs/CONSTITUTIONS.md` does not mention a framework or a build, so it stays. `docs/STYLE.md` and `docs/ERRORS.md` stay (question 6).

## Routes

Every method is `async` and returns the result of one function of `logic/`. Nest sends it as JSON.

| Route | Calls | Success |
|---|---|---|
| `POST /users` | `createUser({ name, email })` | 201 (Nest's default for `POST`), the user |
| `GET /users` | `listUsers()` | 200, the array |
| `GET /users/:id` | `findUserById({ id })` | 200, the user |
| `PATCH /users/:id` | `updateUser({ id, name, email })` | 200, the user |
| `DELETE /users/:id` | `deleteUser({ id })` | 204 (`HttpCode(204)`), no body |

- The routes are written with decorators: `@Controller()` on the class, `@Post("users")`, `@Get("users")`, `@Get("users/:id")`, `@Patch("users/:id")` and `@Delete("users/:id")` on the methods, plus `@HttpCode(204)` on delete. The input comes in with `@Bind(Body())`, `@Bind(Param("id"))` or `@Bind(Param("id"), Body())`.
- `id` comes from the path as text and is turned into a number with `Number(...)`, as in the HTTP client.
- The shape checks are the same as in `src/clients/api/server.js` and go in the controller methods (question 4).
- The body is read as JSON only: `bodyParser: false` and `app.useBodyParser("json")`. Without this, Nest also reads forms, and the spike created a user from a form where the HTTP client answers 400.

## Errors and edge cases

Real results from the first spike with `platform-express`, compared with a copy of the HTTP client. The Babel build gave the same answers in the second spike (see "What was tried"), except the row "Something unexpected", which it did not run.

| Request | HTTP client | Nest client |
|---|---|---|
| No users | 200 `[]` | Same |
| Empty name, bad email | 400 with the sentence | Same |
| Email of another user | 409 | Same |
| No body, `name` as a number, no `email`, `[]` as body | 400 "The request is not valid." | Same |
| Broken JSON, `"x"` as body | 400 "The request is not valid." | Same |
| A form or `text/plain` body | 400 "The request is not valid." | Same, with the JSON-only parser |
| `PATCH` with `{}` | 400 "There is nothing to update." | Same |
| Id that does not exist, `abc`, `1.5` | 404 "No user was found." | Same |
| Database program stopped | 500 "The database failed.", no log | Same |
| Something unexpected (spike: a `TypeError`) | 500 "The database failed.", log | Same |
| `HEAD /users`, `GET /users/` | 200 | Same |
| Unknown route, or wrong method on a known path | 404 with an HTML page | 404 with an empty body, as the spec asks |
| `OPTIONS /users` | 200 `GET, HEAD, POST` | 404 with an empty body, as the spec asks for any other route |
| Body over 100 KB | 413 with an HTML page | 400 "The request is not valid." (question 7) |

## Packages

Versions are the `latest` of `npm view` on 2026-11-04. Exact pins, as the other dependencies.

- Always: `@nestjs/core` 12.3.3, `@nestjs/common` 12.3.3, `reflect-metadata` 0.2.2, `rxjs` 7.8.2.
- One platform (question 3): `@nestjs/platform-express`, `@nestjs/platform-fastify` or `@nestjs/platform-node`, 12.3.3.
- Dev packages, for the build and the lint (question 1, option B): `@babel/core` 8.1.0, `@babel/cli` 8.1.0, `@babel/plugin-proposal-decorators` 8.0.2 and `@babel/eslint-parser` 8.0.7. Not added: `@babel/preset-env` (not needed, and never reviewed) and the packages of C (SWC).

Worth knowing: `12.3.3` was published today (2026-11-04, 09:36 UTC). Socket already scores it. The version before it, 12.3.2, was not reviewed.

## Socket review

Every option was reviewed, so the person could pick any; option B was chosen on 2026-11-05, so what counts for this plan is the Nest group, `platform-express`, the Babel group, the ESLint parser group and `mime-db@1.52.0`. SWC and the other two platforms are not installed. **254 package versions** across the options: each package and its dependencies down to 3 layers (real tree from `pnpm install --lockfile-only`). The full list is in "Every package checked". The session in `neoland1` answered; no new sign-in was needed.

- **Campaign (`threat_feed`):** cannot be read. It answers 403 `threat_feed_not_entitled`: "Threat feed is not enabled for this organization". Campaigns are not checked.
- **Alerts (`alerts`, filtered by the 243 package names, open ones):** none on a version of this plan. For the rest, "no alert on a watched package". `alerts` only lists packages the organization already watches, so this does not say the versions are clean. The open alerts on other versions do not count, and you decide anyway:

  | Package | Version with the alert | Version in this plan | Alert | Repository |
  |---|---|---|---|---|
  | `ajv` | 6.12.6 | 8.20.0 | medium CVE | `crochet4ever` |
  | `baseline-browser-mapping` | 2.9.14 | 2.11.35 | medium CVE | `crochet4ever` |
  | `brace-expansion` | 1.1.12 | 2.1.7, 5.0.12 | high and medium CVE | `crochet4ever` |
  | `browserslist` | 4.28.1 | 4.29.5 | high CVE | `crochet4ever` |
  | `minimatch` | 3.1.2 | 9.0.9, 11.0.4 | high CVE | `crochet4ever` |
  | `picomatch` | 2.3.1, 4.0.3 | 4.0.7 | high and medium CVE | `crochet4ever`, `nomadsetup` |

- **Stats below 50 (`depscore`):** none in the chosen packages. Only under SWC (option C), which is not chosen, all "quality":
  - quality 39: the 17 `@napi-rs/nice-*` binary packages (optional, one per system).
  - quality 40: `@swc/core-linux-arm-gnueabihf`, `-linux-s390x-gnu`, `-linux-ppc64-gnu`, `-win32-ia32-msvc`.
  - quality 41: `@swc/counter`.
- **Close to the line, not below it:** `object-assign` 4.1.1 maintenance 50, supply chain 67; `es-define-property` 1.0.1 maintenance 53, supply chain 66; `side-channel` 1.1.1 maintenance 53, supply chain 66; `@swc/core-*` binaries quality 53; `@fastify/middie` 9.3.6 supply chain 68. The four main Nest packages: license 100, quality 100, vulnerability 100, maintenance 95-97, supply chain 99. `@nestjs/platform-node`: maintenance 92, supply chain 95. `reflect-metadata`: license 80.
- **One gap:** for `append-field` the tree uses 1.0.0 (through `multer`), but `depscore` answered twice with 2.0.0: license 100, maintenance 79, quality 82, supply chain 100, vulnerability 100. The stats of 1.0.0 were not obtained.
- **Found at install, accepted:** `mime-db@1.52.0` is 4 layers down (`@nestjs/platform-express` → `multer` → `type-is` → `mime-types` → `mime-db`), below the 3 layers reviewed, and it was not on the list. Reviewed on 2026-11-04 after the install: `depscore` license 100, maintenance 84, quality 100, supply chain 100, vulnerability 100; `alerts`: no alert on a watched package; `threat_feed`: 403 `threat_feed_not_entitled`. No script runs at install. Ella accepted it on 2026-11-04.
- **Install scripts:** among the packages installed in the spike, only `@swc/core` has one (`postinstall`). The spike ran SWC with `--ignore-scripts` without trouble.

## What stays as it is

`logic/`, `queries/`, `db/`, port 3000 and the database program, the HTTP client on 3001, the program of the extension on 3002, the web, terminal, Jupyter and Electron clients, every error sentence, every ESLint rule (`eslint.config.js` only gets the ignore of `dist/` and the block for the Nest folder), `pnpm format` and the style of every other client.

## What must be running

The database program (`pnpm start`), then `pnpm nest`, which builds first. Port 3003 is free today, and the client listens on `127.0.0.1` only. Nothing else must be installed outside `pnpm install`.

## How it is checked

`pnpm start` and `pnpm nest` (check that `dist/` is created and that `git status` does not show it). With `curl` on 3003 (`src/clients/terminal/nest.txt`), every row of "Errors and edge cases" and the example of the spec. Check it listens on `127.0.0.1` only. Stop `pnpm start` and see 500. Check the HTTP client on 3001 and the program on 3002 answer as before. Then `pnpm format` and `pnpm lint`, and check that lint still catches a deliberate mistake in a Nest file, such as an unused import.

## Every package checked

Exact versions, with `depscore`. The groups share some packages, so each one lists only what is new against "Nest". For C, `pnpm` installs only the binary of your system; all were checked. The `eslint` that `@babel/eslint-parser` asks for is the 10.13.0 the app already has, so its tree is not repeated. Chosen on 2026-11-05: Nest, `platform-express`, Babel, ESLint parser and `mime-db@1.52.0`. Of the Babel list, `babel-plugin-parameter-decorator@1.0.16` is not installed (the spike used it); the other lists are not installed.

- **Nest (21):** `@borewit/text-codec@0.2.3 @lukeed/csprng@1.1.0 @nestjs/common@12.3.3 @nestjs/core@12.3.3 @standard-schema/spec@1.1.0 @tokenizer/inflate@0.6.0 @tokenizer/token@0.3.0 debug@4.4.3 fast-safe-stringify@2.1.1 file-type@22.3.0 ieee754@1.2.1 iterare@1.2.1 load-esm@1.0.3 path-to-regexp@8.4.2 reflect-metadata@0.2.2 rxjs@7.8.2 strtok3@10.7.0 token-types@6.2.0 tslib@2.9.1 uid@2.0.2 uint8array-extras@1.6.0`
- **`platform-express` (55):** `@nestjs/platform-express@12.3.3 accepts@2.0.0 append-field@1.0.0 body-parser@2.4.0 busboy@1.6.0 bytes@3.1.2 content-disposition@2.0.1 content-type@2.1.0 cookie-signature@1.2.2 cookie@0.7.2 cors@2.8.6 depd@2.0.0 ee-first@1.1.1 encodeurl@2.0.1 es-define-property@1.0.1 escape-html@1.0.3 etag@1.8.1 express@5.3.0 finalhandler@2.1.1 forwarded@0.2.0 fresh@2.0.0 http-errors@2.0.1 iconv-lite@0.7.3 inherits@2.0.4 ipaddr.js@1.9.1 is-promise@4.0.0 media-typer@0.3.0 media-typer@1.1.1 merge-descriptors@2.0.0 mime-db@1.54.0 mime-types@2.1.35 mime-types@3.0.2 ms@2.1.3 multer@2.5.0 negotiator@1.1.0 object-assign@4.1.1 on-finished@2.4.2 once@1.4.0 parseurl@1.3.3 proxy-addr@2.0.8 qs@6.17.1 range-parser@1.3.0 raw-body@3.0.2 router@2.2.0 send@1.2.1 serve-static@2.2.1 setprototypeof@1.2.0 side-channel@1.1.1 statuses@2.0.2 streamsearch@1.1.0 toidentifier@1.0.1 type-is@1.6.18 type-is@2.1.0 vary@1.1.2 wrappy@1.0.2`
- **`platform-fastify` (48):** `@fastify/ajv-compiler@4.0.7 @fastify/cors@11.4.0 @fastify/deepmerge@3.2.4 @fastify/error@4.2.1 @fastify/fast-json-stringify-compiler@5.1.1 @fastify/formbody@9.0.1 @fastify/forwarded@3.1.2 @fastify/merge-json-schemas@0.2.2 @fastify/middie@9.3.6 @fastify/proxy-addr@5.1.2 @nestjs/platform-fastify@12.3.3 @pinojs/redact@0.4.0 abstract-logging@2.0.1 ajv-formats@3.0.1 ajv@8.20.0 atomic-sleep@1.0.0 avvio@9.3.1 cookie@2.0.1 fast-decode-uri-component@1.0.1 fast-deep-equal@3.1.3 fast-json-stringify@7.2.1 fast-querystring@1.1.2 fast-uri@4.2.3 fastify-plugin@6.0.1 fastify@5.12.8 fastq@1.20.3 find-my-way@9.10.0 ipaddr.js@2.5.0 json-schema-ref-resolver@3.0.1 light-my-request@6.8.0 on-exit-leak-free@2.1.2 pino-abstract-transport@3.0.0 pino-std-serializers@7.1.0 pino@10.4.0 process-warning@5.1.1 quick-format-unescaped@4.0.4 real-require@1.0.0 ret@0.5.1 reusify@1.1.0 rfdc@1.4.1 safe-regex2@5.1.2 safe-stable-stringify@2.5.0 secure-json-parse@4.1.1 semver@7.8.6 set-cookie-parser@3.2.2 sonic-boom@4.2.1 thread-stream@4.2.1 toad-cache@3.7.4`
- **`platform-node` (53):** `@fastify/forwarded@3.1.2 @fastify/proxy-addr@5.1.2 @nestjs/platform-node@12.3.3 append-field@1.0.0 busboy@1.6.0 content-type@2.1.0 cookie-signature@1.2.2 cookie@0.7.2 cors@2.8.6 depd@2.0.0 ee-first@1.1.1 encodeurl@2.0.1 es-define-property@1.0.1 es-errors@1.3.0 escape-html@1.0.3 etag@1.8.1 fast-decode-uri-component@1.0.1 fast-deep-equal@3.1.3 fast-querystring@1.1.2 find-my-way@9.10.0 fresh@2.0.0 http-errors@2.0.1 inherits@2.0.4 ipaddr.js@2.5.0 media-typer@0.3.0 media-typer@1.1.1 mime-db@1.54.0 mime-types@2.1.35 mime-types@3.0.2 ms@2.1.3 multer@2.5.0 object-assign@4.1.1 object-inspect@1.13.4 on-finished@2.4.2 parseurl@1.3.3 qs@6.17.1 range-parser@1.3.0 ret@0.5.1 safe-regex2@5.1.2 secure-json-parse@4.1.1 send@1.2.1 serve-static@2.2.1 setprototypeof@1.2.0 side-channel-list@1.0.1 side-channel-map@1.0.1 side-channel-weakmap@1.0.2 side-channel@1.1.1 statuses@2.0.2 streamsearch@1.1.0 toidentifier@1.0.1 type-is@1.6.18 type-is@2.1.0 vary@1.1.2`
- **Babel, option B (58):** `@babel/cli@8.1.0 @babel/code-frame@8.0.6 @babel/compat-data@8.0.5 @babel/core@8.1.0 @babel/generator@8.1.0 @babel/helper-annotate-as-pure@8.0.0 @babel/helper-compilation-targets@8.0.7 @babel/helper-create-class-features-plugin@8.0.10 @babel/helper-globals@8.0.6 @babel/helper-member-expression-to-functions@8.0.5 @babel/helper-optimise-call-expression@8.0.0 @babel/helper-plugin-utils@8.0.1 @babel/helper-replace-supers@8.0.1 @babel/helper-skip-transparent-expression-wrappers@8.1.0 @babel/helper-string-parser@8.0.8 @babel/helper-validator-identifier@8.0.6 @babel/helper-validator-option@8.0.0 @babel/helpers@8.1.0 @babel/parser@8.1.0 @babel/plugin-proposal-decorators@8.0.2 @babel/plugin-syntax-decorators@8.0.1 @babel/template@8.0.0 @babel/traverse@8.1.0 @babel/types@8.1.0 @isaacs/nonrecursive-glob-match@1.0.3 @jridgewell/gen-mapping@0.4.0-beta.0 @jridgewell/resolve-uri@3.1.2 @jridgewell/sourcemap-codec@1.6.0 @jridgewell/trace-mapping@0.3.31 @types/gensync@1.0.5 @types/jsesc@2.5.1 babel-plugin-parameter-decorator@1.0.16 baseline-browser-mapping@2.11.35 brace-expansion@5.0.12 browserslist@4.29.5 caniuse-lite@1.0.30001820 chokidar@5.0.0 commander@14.0.3 convert-source-map@2.0.0 electron-to-chromium@1.5.473 empathic@2.1.0 flru@1.0.2 gensync@1.0.0-beta.2 glob@14.0.3 import-meta-resolve@4.2.0 js-tokens@10.0.0 jsesc@3.1.0 json5@2.2.3 lru-cache@11.5.3 minimatch@11.0.4 minipass@7.1.3 node-releases@2.0.63 obug@3.0.0 path-scurry@3.0.0 readdirp@5.1.1 slash@5.1.0 update-browserslist-db@1.3.4 verkit@0.5.0`
- **ESLint parser, needed by B and C to lint `@` (4):** `@babel/eslint-parser@8.0.7 eslint-scope@9.1.2 eslint-visitor-keys@5.0.1 verkit@0.5.0`
- **SWC, option C (64):** `@napi-rs/nice@1.1.1 @napi-rs/nice-android-arm-eabi@1.1.1 @napi-rs/nice-android-arm64@1.1.1 @napi-rs/nice-darwin-arm64@1.1.1 @napi-rs/nice-darwin-x64@1.1.1 @napi-rs/nice-freebsd-x64@1.1.1 @napi-rs/nice-linux-arm-gnueabihf@1.1.1 @napi-rs/nice-linux-arm64-gnu@1.1.1 @napi-rs/nice-linux-arm64-musl@1.1.1 @napi-rs/nice-linux-ppc64-gnu@1.1.1 @napi-rs/nice-linux-riscv64-gnu@1.1.1 @napi-rs/nice-linux-s390x-gnu@1.1.1 @napi-rs/nice-linux-x64-gnu@1.1.1 @napi-rs/nice-linux-x64-musl@1.1.1 @napi-rs/nice-openharmony-arm64@1.1.1 @napi-rs/nice-win32-arm64-msvc@1.1.1 @napi-rs/nice-win32-ia32-msvc@1.1.1 @napi-rs/nice-win32-x64-msvc@1.1.1 @swc/cli@0.8.2 @swc/core@1.16.21 @swc/core-darwin-arm64@1.16.21 @swc/core-darwin-x64@1.16.21 @swc/core-linux-arm-gnueabihf@1.16.21 @swc/core-linux-arm64-gnu@1.16.21 @swc/core-linux-arm64-musl@1.16.21 @swc/core-linux-ppc64-gnu@1.16.21 @swc/core-linux-s390x-gnu@1.16.21 @swc/core-linux-x64-gnu@1.16.21 @swc/core-linux-x64-musl@1.16.21 @swc/core-win32-arm64-msvc@1.16.21 @swc/core-win32-ia32-msvc@1.16.21 @swc/core-win32-x64-msvc@1.16.21 @swc/counter@0.1.3 @swc/types@0.1.28 @xhmikosr/archive-type@8.1.0 @xhmikosr/bin-check@8.3.0 @xhmikosr/bin-wrapper@14.5.2 @xhmikosr/decompress@11.1.4 @xhmikosr/downloader@16.3.1 @xhmikosr/os-filter-obj@4.1.0 balanced-match@1.0.2 binary-version-check@6.1.0 binary-version@7.1.0 brace-expansion@2.1.7 commander@8.3.0 content-disposition@2.0.1 ext-name@5.0.0 fdir@6.5.0 file-type@21.3.4 filenamify@7.0.3 got@14.6.6 isexe@4.0.0 minimatch@9.0.9 picomatch@4.0.7 piscina@4.9.4 semver-truncate@3.0.0 semver@7.8.6 signal-exit@4.1.0 slash@3.0.0 source-map@0.7.6 system-architecture@1.0.0 tinyexec@1.3.1 tinyglobby@0.2.17 write-file-atomic@7.0.1`
- **Found at install (1):** `mime-db@1.52.0`
- **Also scored:** `express@5.2.1` (license 100, maintenance 92, quality 100, supply chain 97, vulnerability 100).

## Questions for you

Each one gives what was found, the options and a recommendation. The answers are in "Decisions", at the top.

### 1. Without TypeScript, how does Nest run?

> **Changed on 2026-11-05:** option B (Babel) was chosen. The text below is what was found before the choice. With B, `@Bind(...)` replaces the `@` in parameters.

**Found.** Nest's decorators are plain functions. What TypeScript or a build gives is the `@` syntax. Node 23.7.0 does not understand `@`: it stops with `SyntaxError: Invalid or unexpected token`. The Nest docs say plain JavaScript "requires Babel" ([first steps](https://docs.nestjs.com/first-steps)), but option A shows it runs without it, as long as nothing is written with `@`.

Your brief asks for decorators. With A they are used, but called by hand, so the code does not look like the Nest docs. This is the real choice:

```js
// Option A: plain Node
export class AppModule {}
Module({ controllers: [UsersController] })(AppModule);
Body()(UsersController.prototype, "create", 0);

// Options B and C: needs a build
@Module({ controllers: [UsersController] })
export class AppModule {}
async create(@Body() body) { ... }  // parameter "@": C only
```

| | A: plain Node | B: Babel | C: SWC |
|---|---|---|---|
| Runs with | `node src/clients/nest/main.js` | a build, then `node` | a build, then `node` |
| Packages it adds to Nest | none | `@babel/core` 8.1.0, `@babel/cli` 8.1.0, `@babel/plugin-proposal-decorators` 8.0.2 | `@swc/core` 1.16.21 (native binary), `@swc/cli` 0.8.2 |
| New packages in the lockfile, without Nest | 0 | 58 | 137 (many are optional binaries for other systems) |
| Written with `@` | Nothing | Classes and methods. Not parameters | Everything |
| Stats below 50 | None | None | Yes, see "Socket review" |
| `pnpm lint` | Works, with `/* global console, process */` as the other clients | Fails: `Parsing error: Unexpected character '@'` | Same as B |
| `pnpm format` | Works | Works, with `@` in parameters too | Works |
| Build output | None | A folder to ignore in git, Prettier and ESLint | Same as B |

- **Babel and parameters.** With `{ "version": "legacy" }` (the setting of the official [javascript-starter](https://github.com/nestjs/javascript-starter)) the build reports success but leaves `@Body()` in the output, and the program stops with a `SyntaxError`. `babel-plugin-parameter-decorator` 1.0.16 crashes on Babel 8: `"_class2.prototype" is not a valid identifier name`. So the parameters are written as calls, as in A. The [Babel page](https://babeljs.io/docs/babel-plugin-proposal-decorators) says nothing on parameter decorators and contradicts itself on `legacy` in version 8; the spike shows 8.0.2 accepts it. The starter's own example avoids parameters on its one route.
- **SWC settings.** `{ "jsc": { "parser": { "syntax": "ecmascript", "decorators": true, "decoratorsBeforeExport": true }, "transform": { "legacyDecorator": true } }, "module": { "type": "es6" } }`. Without `decoratorsBeforeExport` it refuses `@Module(...)` before `export`. Neither the [Nest SWC page](https://docs.nestjs.com/recipes/swc) (it shows only `typescript`) nor the [SWC page](https://swc.rs/docs/configuration/compilation) describe parameter decorators in JavaScript. They worked in the spike, but that rests on the spike only.
- **Lint with B or C.** It needs `@babel/eslint-parser` 8.0.7, which brings `@babel/core` even with SWC, plus a block in `eslint.config.js`. Even then, the spike reports `Body` and `Param` as `no-unused-vars`, so that rule also has to be adjusted. The other way is to leave this folder out of the lint.

**Injection.** It works in plain Node in both ways, run in the spike:

```js
Dependencies(UsersService)(UsersController);       // Nest: "required with a vanilla JavaScript objects"
Inject(UsersService)(UsersController, undefined, 0);  // the explicit @Inject()
```

But the routes can call `logic/` directly, so this client may need no injection at all.

**Question 1a.** A, B or C? *Recommendation: A.* **Answered on 2026-11-05: B.** It adds no build, keeps `pnpm lint` and `pnpm format` as they are, and starts like the other clients. The cost is real: the decorators are calls, not `@`. If reading like the Nest docs matters more to you for the course, choose C, and accept the lint work and the stats below 50.

**Question 1b.** Is there a `UsersService` class between the controller and `logic/`? *Recommendation: no.* `logic/` already is that layer, and a service would only forward each call. Choose yes if you want this client to show Nest's injection.

### 2. How does the code import `logic/`, which is ESM?

**Found.** The premise has changed: Nest 12 is not CommonJS. `@nestjs/core`, `@nestjs/common` and the three platforms have `"type": "module"` in the registry. So with A, `src/clients/nest/` is plain ESM like the rest of the app, and imports `../../logic/create-user.js` directly. `logic/` does not change. This ran in the spike.

- `reflect-metadata`: `@nestjs/core` and `@nestjs/common` import it themselves in their `index.js`, so there is no order trap. The plan keeps `import "reflect-metadata"` as the first line of `main.js`, as a required peer. Running without that line was not tried.
- With B or C, the build must keep ESM. The spike did: no `preset-env` in Babel, `"type": "es6"` in SWC. The source and the output must be at the same depth from `logic/`, because the `../../logic/` path is copied as it is.
- The official starter does the opposite: it compiles to CommonJS with `@babel/register`, and its `package.json` has no `"type": "module"`. It was not run here. Its `engines` are `^22.18.0 || >=24.11.0`, which leaves out your Node 23.7.0. `@nestjs/core` itself asks for `>= 20`.

**Question.** Is it fine that this client stays ESM with no interop, and that the plan drops the starter's CommonJS way? *Recommendation: yes.*

### 3. Which HTTP platform?

**Found**, in the real installed tree. Nest's docs list three, not two: Express, Fastify and `node:http` ([first steps](https://docs.nestjs.com/first-steps)).

| | `platform-express` | `platform-fastify` | `platform-node` |
|---|---|---|---|
| Framework it pulls | `express` 5.3.0, pinned exact | `fastify` 5.12.8, pinned exact | None |
| A second copy? | **Yes:** 5.3.0 next to the app's 5.2.1. pnpm keeps them apart: `src/clients/api/` still gets 5.2.1 | **No:** the same 5.12.8 as the app | No |
| New packages in the lockfile, with Nest | 32 | 24 | 30 |
| `GET /users/` | 200, as the HTTP client | **404**, not as the HTTP client | 200 |
| A body of 200 KB | Refused, as the HTTP client (413) | **Accepted:** it created a user with that name | Refused (413) |
| Extras it brings | `multer`, `cors` | `@fastify/middie` (supply chain 68), `@fastify/cors`, `@fastify/formbody`, `light-my-request` | `multer`, `cors`, `find-my-way` |
| Line in `AGENTS.md` | Express gets a second user | Fastify gets a second user | Adds Nest only, but it is the option you did not name |

`@nestjs/core` and `@nestjs/common` ask for `rxjs` and `reflect-metadata` as peers, which go in `package.json`. None of the platform packages has an install script.

**Question.** Which one? *Recommendation: `platform-express`.* The brief asks for the same behaviour as the HTTP client, and it is the closest: apart from question 7, the two differ only where the spec asks. `platform-node` behaved the same in the spike, but you did not name it. The cost is the second Express copy. Moving the app to 5.3.0 to have one copy would change the HTTP client's package, which is out of scope. Fastify has no second copy, but its differences need more code to match.

### 4. How does the filter work?

**Found**, and run in the spike on the three platforms. `logic/` throws a plain `Error` and knows nothing about HTTP. A class with `Catch()` and no argument catches everything ([exception filters](https://docs.nestjs.com/exception-filters)). In `catch(error, host)`, it answers in this order with `httpAdapter.reply(response, body, status)`:

1. The message is a sentence with a status (400, 404 or 409, the table of the spec): it answers `{ "error": message }`.
2. `HttpException` with status 404, which Nest throws as `NotFoundException` for a route it does not know: 404 with an empty body. "No user was found." never gets here, because it is a plain `Error` caught in step 1. So the two 404 stay apart. A wrong method on a known path also gets here.
3. Any other `HttpException` with a 4xx status: 400 "The request is not valid." Broken JSON comes as `BadRequestException` with the parser's own message, and on Fastify as `HttpException` 400, so the message is never shown. A body too large comes as `HttpException` 413 (question 7).
4. Anything else, such as a `TypeError`: if the message is not "The database failed.", `console.error(error)`. Then 500 "The database failed." in both cases.

The filter is registered with `app.useGlobalFilters(new ErrorsFilter(app.getHttpAdapter()))`, and it works with any platform.

**Question 4a.** How is "error classes" read, given that `logic/` must stay as it is? *Recommendation: the table in the filter (the order above), plus Nest's error class for the shape checks.* The other way, a `try`/`catch` in each route that rethrows an `HttpException`, repeats the same `if` chain five times, and this is what a filter avoids.

**Question 4b.** Where do the shape checks go, and what do they throw?

- In the controller methods, throwing `new BadRequestException("The request is not valid.")`. *Recommendation.* The checks read as in `src/clients/api/server.js`, and it uses Nest's class with no new file. The spike ran the same path with a small class of its own (`InvalidRequestError`), and got the same answers; the `BadRequestException` form was exercised only through broken JSON.
- A small class of your own, `InvalidRequestError`: one more file, more explicit.
- A pipe (Nest's step that checks input before the method): more Nest, but `POST` and `PATCH` need different pipes, so two more classes. Not run.

### 5. What line replaces the one in `AGENTS.md`?

Current line in this branch (`AGENTS.md`, line 11):

> The only web frameworks are Express, used only by the HTTP client in `src/clients/api/`, and Fastify, used only by the program of the extension in `src/clients/chrome/`. There is no TypeScript.

Replacement with the recommended platform:

> The only web frameworks are Express, used only by the HTTP client in `src/clients/api/`, Fastify, used only by the program of the extension in `src/clients/chrome/`, and Nest, used only by the Nest client in `src/clients/nest/`, which runs on Express through `@nestjs/platform-express`. There is no TypeScript.

With another platform, the end changes to "which runs on Fastify through `@nestjs/platform-fastify`" or "which runs on `node:http` through `@nestjs/platform-node`". With B or C, this is added: "This client is the only code with a build step." **Chosen on 2026-11-05 (B):** the replacement line ends with "... through `@nestjs/platform-express`. This client is the only code with a build step. There is no TypeScript."

The sentence before it stays true with every option: "`package.json` sets `"type": "module"`, so files use ESM".

**Question.** Is this the line? It says the real folder `src/clients/chrome/`, not `src/clients/extension/` of your brief: is that right?

### 6. Where does the notice go?

**Found.** You say `docs/STYLE.md` and `docs/ERRORS.md` "stay the same for the rest of the project", and that the documentation gets a notice. That can mean the files do not change, or that their rules do not change. Also, `docs/ERRORS.md` says "The request is not valid." comes from "the HTTP client in `src/clients/api/`". That is already out of date, because `src/clients/chrome/server.js` uses it too. Nest would be a third.

Options:

- The notice in `AGENTS.md` ("Style") and in `docs/ARCHITECTURE.md` (the `nest/` entry), and the two guides are not touched. *Recommendation:* it follows your words literally. A reader of the guides sees nothing there, but `AGENTS.md` is read first.
- The same, plus one line at the top of each guide: easier to find, but the guides change.

Proposed text: "`src/clients/nest/` departs from `docs/STYLE.md` and `docs/ERRORS.md`: it uses the conventions of Nest (classes, methods, `this`, decorators and error classes). It uses the same sentences of `docs/ERRORS.md` and adds none. The rest of the project follows both guides." With the change of 2026-11-05 the list also says "file names" and "a build step".

**Question.** Which option? And do you want the out-of-date line about "The request is not valid." left as it is? *Recommendation: leave it.* Fixing it is another task.

### 7. A body too large

**Found.** Your brief says "the same statuses as `server.js`", with the `{ "error" }` body. The two do not fit here. The HTTP client answers 413 with an HTML page, and writes the error in the terminal. `src/clients/chrome/server.js` answers 400 "The request is not valid."

Options:

- 400 "The request is not valid.", as the Chrome program. *Recommendation:* JSON, an existing sentence, and what the spike ran.
- 413 `{ "error": "The request is not valid." }`: the same status as the HTTP client, the same body shape. Not run.

**Question.** Which one?

### 8. File names

**Found.** `docs/STYLE.md` asks for kebab-case, as in `create-user.js`. Nest's convention has a dot: `users.controller.js`. The notice of question 6 lists the conventions that change, and file names are not in your list.

**Question.** `users.controller.js` or `users-controller.js`? *Recommendation: `users.controller.js`*, the Nest way, and add "file names" to the notice.

### 9. Nest's messages at startup

**Found.** By default Nest prints about 10 colored lines when it starts (one per route, and more). The other clients print one line. With `logger: false` it prints nothing of its own, and a busy port still stops the program with a visible error, as seen in the spike.

**Question.** Keep Nest's lines, or `logger: false` and one line `Nest client on http://127.0.0.1:3003`? *Recommendation: `logger: false` and one line*, like the other clients.
