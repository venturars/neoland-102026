# Plan — A Swagger UI page for the Nest client

**Status: reviewed.** The person accepted every recommendation on 2026-11-05 ("Decisions", below). The questions at the end stay as the record of what was found.

## Decisions

- **1:** the page is at `/docs`.
- **2:** the defaults stay: `/docs-json` and `/docs-yaml` are served by the package.
- **3:** the install script of `@scarf/scarf` is not run: the package is added with `--ignore-scripts`.
- **4:** `js-yaml` 5.5.0 is accepted. The Socket review, its gaps and the alerts on 4.1.1 are accepted.

### Change of 2026-11-05 (after the run)

While checking the page, the person could not find its address: the client printed only `Nest client on http://127.0.0.1:3003`, and `/` is blank. The person chose to print the address. `main.js` prints a second line after the first: `Swagger UI on http://127.0.0.1:3003/docs`. The first line does not change, so this replaces the plan's words "The line printed at start stays as it is." (in "Files to change") and nothing else. `/` still answers 404 with an empty body. `docs/ARCHITECTURE.md` and `AGENTS.md` need no change.

## Summary

The Nest client gets one more package, `@nestjs/swagger`. `main.js` mounts the Swagger UI page, and `users.controller.js` describes each route with the decorators of that package. Nothing in `logic/`, `queries/`, `db/`, the error filter or the other clients changes. There is no new function in `logic/`, no new query, no `.sql` file and no new error sentence. No file is added, so `docs/TREE.md` does not change.

## What was tried (a spike, not code to keep)

On 2026-11-05, in a scratch folder with a copy of `src/` and the `node_modules` of the app, on port 3103 (the repository and the running programs were not touched). `@nestjs/swagger` 12.1.0 was added to `main.js` and to the controller, built with the same Babel setup as `pnpm nest`, and started on Node 23.7.0.

| Check | Result |
|---|---|
| `babel src --out-dir dist` | Compiled 23 files |
| The client starts and prints its line | `Nest client on http://127.0.0.1:3103` |
| `GET /docs` | 200 |
| `GET /docs-json` | Lists the six routes under the tag "users", with `POST /users` and `PATCH /users/{id}` showing a body |
| Parameter `id` of the routes with `@Bind(Param("id"))` | **Not listed.** Only the routes with an explicit `@ApiParam` showed it. `DELETE /users/{id}` had none |
| Body of `POST` and `PATCH` without `@ApiBody` | Not run. With plain JavaScript there is no type to read, so the body is described by hand |

The "Try it out" button and the real answers of the routes (status and body) were **not** run in a browser. The tasks run them.

## The address of the page

`GET /docs` on the Nest client: `http://127.0.0.1:3003/docs`. The package also serves the description it builds as JSON at `/docs-json` and as YAML at `/docs-yaml`; see question 2.

## Files to change

- `package.json`: `@nestjs/swagger` 12.1.0 in `dependencies`, pinned exact like the other Nest packages. `pnpm-lock.yaml` follows.
- `src/clients/nest/main.js`: after the filter and before `listen`, build the document (title "Users API", a one-line description, version `0.0.0`) and mount the page on `docs`. The line printed at start stays as it is.
- `src/clients/nest/users.controller.js`: the decorators below, and nothing else. No route, no check and no call to `logic/` changes.
- `docs/ARCHITECTURE.md`: the `nest/` entry gets one sentence: the page `/docs` and which decorators describe the routes. The sentence about the departure from the style guides stays.
- `AGENTS.md`: in "Commands", `pnpm nest` gets "The page of the routes is at `http://127.0.0.1:3003/docs`." In "Project", the sentence on Nest gets no change, since no new web framework is added.

## What the controller declares

The routes are described with decorators, because there is no TypeScript and no Nest CLI plugin to read types.

- On the class: `@ApiTags("users")`.
- On each method: `@ApiOperation({ summary })`, one short line.
- On each method with an id: `@ApiParam({ name: "id", type: "integer" })`, written by hand, because the spike showed `@Bind(Param("id"))` is not read.
- On `create`: `@ApiBody` with `name` and `email`, both text and required. On `update`: the same two, neither required, with a description saying at least one is needed.
- On each method: one `@ApiResponse` per status of the table below. The user is described once, as a constant in the controller file (`id`, `name`, `email`, `createdAt`, `updatedAt`), and the list as an array of it. An error response has the shape `{ "error": "<sentence>" }` and its description carries the sentences of `docs/ERRORS.md`. No new sentence.

| Route | Statuses described |
|---|---|
| `POST /users` | 201 the user; 400 "The name is missing.", "The email is not valid.", "The request is not valid."; 409 "This email is already used."; 500 "The database failed." |
| `GET /users` | 200 the list; 500 |
| `GET /users/gmail` | 200 the list; 500 |
| `GET /users/:id` | 200 the user; 404 "No user was found."; 500 |
| `PATCH /users/:id` | 200 the user; 400 "The email is not valid.", "There is nothing to update.", "The request is not valid."; 404; 409; 500 |
| `DELETE /users/:id` | 204 empty; 404; 500 |

The decorators only add information to the page. They do not check or change a request, so a request sent from the page behaves like the same request sent with `curl`.

## Edge cases

- With the error filter set, `/docs` answered 200 in the spike. Whether any other unknown route still answers 404 with an empty body was **not** run; the tasks check it.
- If the database program is not running, the page still loads (it does not call the database). Sending a request from it gets the 500 the route gives.
- If the Nest client is not running, the page does not load. That is not an error of the app.
- The page is expected to send its requests to the address it was loaded from, so no CORS setting should be needed. Not run; the tasks check it from the browser.

## Packages and what must be running

New package: `@nestjs/swagger` 12.1.0. The rest of the tree is new to the lockfile too (below). `pnpm start` (the database program) and `pnpm nest` must be running to use the page. `pnpm install` is the only install step.

## Socket review

Reviewed on 2026-11-05 in the organization `neoland1` (free plan). The session answered. The tree comes from the lockfile of the spike: `@nestjs/swagger` and its direct dependencies, down to 3 layers. Ten versions: eight new to the lockfile and two already in it.

| Package | Layer | License | Maintenance | Quality | Supply chain | Vulnerability |
|---|---|---|---|---|---|---|
| `@nestjs/swagger` 12.1.0 | 0 (direct) | 100 | 96 | 86 | 98 | 100 |
| `@microsoft/tsdoc` 0.17.1 | 1 | 100 | 87 | 89 | 100 | 100 |
| `@nestjs/mapped-types` 12.0.1 | 1 | 100 | 89 | 89 | 99 | 100 |
| `es-toolkit` 1.52.0 | 1 | 100 | 98 | 93 | 99 | 100 |
| `js-yaml` 5.5.0 | 1 | 100 | 92 | 86 | 100 | 100 |
| `swagger-ui-dist` 5.34.0 | 1 | **80** | 97 | 83 | 99 | 100 |
| `argparse` 3.0.4 | 2 (through `js-yaml`) | 100 | 89 | 97 | 100 | 100 |
| `@scarf/scarf` 1.4.0 | 2 (through `swagger-ui-dist`) | 100 | 80 | 100 | 82 | 100 |
| `@standard-schema/spec` 1.1.0 | 1 (already in the lockfile) | 100 | 82 | 99 | 100 | 100 |
| `path-to-regexp` 8.4.2 | 1 (already in the lockfile) | 100 | 91 | 100 | 100 | 100 |

- **Stats below 50 (`depscore`):** none. The lowest is `swagger-ui-dist` license 80 and `@scarf/scarf` supply chain 82; neither is below 50.
- **Alerts (`alerts`, filtered by each of the ten names, open ones):** none on a version of this plan. Nine packages returned an empty list: "no alert on a watched package". `alerts` only lists packages the organization already watches, so this does not say the versions are clean. **`js-yaml` returned four open alerts, all on version 4.1.1** (three high, one medium; CVE-2026-59869, CVE-2026-84375, CVE-2026-53550 and one without CVE id), from the repositories `crochet4ever` and `nomadsetup`. The fixed versions listed are 4.2.0 to 4.3.2. This plan uses `js-yaml` 5.5.0, so they do not count; you decide anyway.
- **Campaign (`threat_feed`):** cannot be read. It answers 403 `threat_feed_not_entitled`: "Threat feed is not enabled for this organization". Campaigns are not checked.
- **Install script:** `@scarf/scarf` 1.4.0 declares `"postinstall": "node ./report.js"`. It is the package's usage reporting. Whether `pnpm install` runs it depends on the pnpm settings of the machine and was not run here; see question 3. `swagger-ui-dist` and `@nestjs/swagger` declare no install script; `@nestjs/swagger` has `prepare`, which only runs when it is installed from git.
- **Peer dependencies:** `class-validator`, `class-transformer`, `@fastify/static` and `typescript` are optional peers and are not installed.
- **Licenses:** `swagger-ui-dist` and `@scarf/scarf` are Apache-2.0 (the npm registry); the others were not read.

## What stays as it is

The five routes, the sixth route, their statuses and bodies, `errors.filter.js`, `app.module.js`, `logic/`, `queries/`, `db/`, the other clients, `babel.config.json`, `eslint.config.js` (the Babel parser already reads `@`) and the style notice of this client.

## How it is checked

With `pnpm start` and `pnpm nest` running: open `/docs`, run the six steps of the example in the spec from the page, check one error of each status from the page, check that `GET /nothing` still answers 404 with an empty body, then `pnpm format` and `pnpm lint`. Nothing is added to `src/clients/terminal/`, since no function of `logic/` is added.

## Questions

**1. Where is the page?** *Recommendation: `/docs`.* It is the usual name in the Nest docs and cannot be read as an id by `users/:id`. Choose another path if you prefer.

**2. Keep the JSON and YAML files the package serves by itself?** *Recommendation: yes, leave the defaults (`/docs-json`, `/docs-yaml`).* The spec leaves out "a file of the API to download or share". The package serves these two on its own and the page may read the JSON to draw itself. I did not run it with `raw: false`, so I do not know if the page still works without them. Choose "turn them off" and the tasks will test it first.

**3. What do we do with the install script of `@scarf/scarf`?** *Recommendation: do not run it.* Check after `pnpm install` whether `report.js` ran; if pnpm blocks it by default, nothing is needed. If it ran, the person decides whether to keep it or to block it in the pnpm settings of the app. This is an alert-like finding, so I do not decide it.

**4. Is the `js-yaml` finding acceptable?** The four alerts are on 4.1.1 in other repositories, not on 5.5.0. *Recommendation: accept 5.5.0.* It is yours to decide.
