# Tasks — A Swagger UI page for the Nest client

Do the tasks in order. Inside a task, do the steps in order. `docs/CONSTITUTIONS.md` and `docs/ERRORS.md` do not change. No file is added, so `docs/TREE.md` does not change. Nothing is added to `src/clients/terminal/`, since no function of `logic/` is added. The work is on the branch `1068-feat-nest-swagger-ui`.

## Task 1 — Update the docs

- [x] In `docs/ARCHITECTURE.md`, add to the `nest/` entry that the client also serves the page `/docs`, described by the decorators of `@nestjs/swagger` in `users.controller.js`. Result: the entry names the page and how the routes are described.
- [x] In `AGENTS.md`, in "Commands", add to `pnpm nest` that the page of the routes is at `http://127.0.0.1:3003/docs`. Result: the way to open the page is written.

## Task 2 — Get the package ready

- [x] Run `pnpm add --save-exact --ignore-scripts @nestjs/swagger@12.1.0` in `first-app`. Result: `package.json` has `"@nestjs/swagger": "12.1.0"` and `pnpm-lock.yaml` has the ten versions of the plan; the install script of `@scarf/scarf` did not run.
- [x] Check in `pnpm-lock.yaml` that `js-yaml` is 5.5.0 and that no other new package is outside the ten versions of the Socket review. Result: any other new version is reported before going on.

## Task 3 — Write the Nest client

- [x] In `src/clients/nest/main.js`, import `DocumentBuilder` and `SwaggerModule` from `@nestjs/swagger`. Result: both are available.
- [x] In `src/clients/nest/main.js`, after the filter and before `listen`, build the document with the title "Users API", a one-line description and the version `0.0.0`. Result: the document exists.
- [x] In `src/clients/nest/main.js`, mount the page with `SwaggerModule.setup("docs", app, document)`. Result: `/docs` answers the page; the line printed at start does not change.
- [x] In `src/clients/nest/users.controller.js`, import `ApiBody`, `ApiOperation`, `ApiParam`, `ApiResponse` and `ApiTags` from `@nestjs/swagger`. Result: the decorators are available.
- [x] In `src/clients/nest/users.controller.js`, add a constant with the schema of a user: `id`, `name`, `email`, `createdAt`, `updatedAt`. Result: the user is described once.
- [x] Add `@ApiTags("users")` to the class. Result: the six routes are under one heading.
- [x] Add `@ApiOperation` with a one-line summary to each of the six methods. Result: each route has a short line.
- [x] Add `@ApiParam({ name: "id", type: "integer" })` to `findOne`, `update` and `remove`. Result: the three routes with an id show it.
- [x] Add `@ApiBody` to `create` with `name` and `email`, both text and required. Result: the page shows both fields.
- [x] Add `@ApiBody` to `update` with `name` and `email`, both text, neither required, and a description saying at least one is needed. Result: the page shows the two fields.
- [x] Add `@ApiResponse` to `create` for 201, 400, 409 and 500, with the sentences of the plan. Result: its statuses are described.
- [x] Add `@ApiResponse` to `list` and `listGmail` for 200 and 500. Result: their statuses are described.
- [x] Add `@ApiResponse` to `findOne` for 200, 404 and 500. Result: its statuses are described.
- [x] Add `@ApiResponse` to `update` for 200, 400, 404, 409 and 500, with the sentences of the plan. Result: its statuses are described.
- [x] Add `@ApiResponse` to `remove` for 204, 404 and 500. Result: its statuses are described.

## Task 4 — Run it

- [x] Run `pnpm format` and `pnpm lint`. Result: both end without errors.
- [x] Run `pnpm start`, then `pnpm nest`. Result: the client prints `Nest client on http://127.0.0.1:3003`.
- [x] Open `http://127.0.0.1:3003/docs` in the browser. Result: the six routes appear under "users", each with its line, its inputs and its statuses.
- [x] From the page, run the six steps of the example of the spec: create Ada, list, list Gmail, update the name, delete, list again. Result: 201, 200, 200, 200, 204 and an empty list, as the spec says.
- [x] From the page, send one error of each status: an empty name (400), an unknown id (404), a repeated email (409). Result: each answers its sentence in `{ "error": "<sentence>" }`.
- [x] Stop the database program and send a request from the page. Result: 500 "The database failed.", and the page itself still loads.
- [x] Run `curl -i http://127.0.0.1:3003/nothing`. Result: 404 with an empty body.
- [x] Run `curl -i http://127.0.0.1:3003/users` and `curl -i http://127.0.0.1:3003/users/gmail`. Result: both answer 200 as before.
- [x] Open `http://127.0.0.1:3003/docs-json`. Result: it lists the six routes. The page keeps working with the defaults.

## Task 5 — Print the address of the page

Added on 2026-11-05 at the request of the person; see "Change of 2026-11-05 (after the run)" in `plan.md`.

- [x] In `src/clients/nest/main.js`, after the existing `console.log`, print `Swagger UI on http://127.0.0.1:3003/docs`, built from `HOST` and `PORT`. Result: the client prints two lines at start and the first one is unchanged.
- [x] Run `pnpm format` and `pnpm lint`. Result: both end without errors.
- [x] Run `pnpm nest`. Result: the terminal prints both lines, and the address in the second one opens the page.
