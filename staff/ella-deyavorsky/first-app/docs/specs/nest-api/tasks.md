# Tasks — A Nest HTTP API for the users

Do the tasks in order. Inside a task, do the steps in order. There is no query and no change in `logic/`, so those tasks do not exist. `docs/CONSTITUTIONS.md`, `docs/STYLE.md` and `docs/ERRORS.md` do not change. The work is on the branch `991-feat-nest-http-client`.

Tasks 1 to 6 were done on 2026-11-04 with plain Node. On 2026-11-05 the person changed the answer to question 1a of `plan.md` to Babel with real `@`. Tasks 7 to 10 make that change and replace what Tasks 2, 3, 4 and 5 left in `package.json`, in the three Nest files and in the docs. The pnpm exemption of Task 2 applies to Task 8 as well.

## Task 1 — Update the docs

- [x] In `AGENTS.md`, replace the framework line with: "The only web frameworks are Express, used only by the HTTP client in `src/clients/api/`, Fastify, used only by the program of the extension in `src/clients/chrome/`, and Nest, used only by the Nest client in `src/clients/nest/`, which runs on Express through `@nestjs/platform-express`. There is no TypeScript." Result: the line allows Nest for this client only.
- [x] In `AGENTS.md`, add `src/clients/nest/` to the list of `pnpm format` in "Commands". Result: the list matches `package.json` after this feature.
- [x] In `AGENTS.md`, add to "Commands": "`pnpm nest` starts the Nest client on `http://127.0.0.1:3003` (the database program must be running)." Result: the script is described.
- [x] In `AGENTS.md`, add to "Style": "`src/clients/nest/` departs from `docs/STYLE.md` and `docs/ERRORS.md`: it uses the conventions of Nest (file names, classes, methods, `this`, decorators and error classes). It uses the same sentences of `docs/ERRORS.md` and adds none. The rest of the project follows both guides." Result: a reader of the guide sees the notice.
- [x] In `docs/ARCHITECTURE.md`, add `nest/` under `src/clients/`: the Nest app started with `pnpm nest`, on `http://127.0.0.1:3003`, what each file does, that the database program must be running. Result: the clients list has `nest/`.
- [x] In `docs/ARCHITECTURE.md`, add the same notice to the `nest/` entry. Result: the entry says this client departs from the two guides.
- [x] In `docs/TREE.md`, add `nest/` under `clients/` with `app.module.js`, `errors.filter.js`, `main.js`, `users.controller.js`. Result: the tree lists the four files.
- [x] In `docs/TREE.md`, add `nest.txt` under `clients/terminal/`. Result: the tree lists the file.

## Task 2 — Get Nest ready

The Socket review of these packages and their dependencies is in `plan.md`, accepted with the plan.

Note: `@nestjs/*` 12.3.3 was published on 2026-11-04 at 09:36 UTC, so the pnpm minimum release age (24h) rejects it until 2026-11-05 at 09:37 UTC. On 2026-11-04, Ella authorized bypassing it. `electron`, `@nestjs/common`, `@nestjs/core` and `@nestjs/platform-express` were exempted, per command, with `--config.minimumReleaseAgeExclude=<package>`. `electron` 45.2.2 was already in the lockfile from staging. pnpm wrote `@nestjs/common@12.3.3` to a new `pnpm-workspace.yaml` by itself; that file was deleted, so nothing stays exempted.

Note: the install also brought `mime-db@1.52.0`, 4 layers down and not on the list of `plan.md`. It was reviewed with Socket after the install, and Ella accepted it on 2026-11-04. The result is in `plan.md`.

- [x] Run `pnpm add --save-exact rxjs@7.8.2`. Result: `package.json` lists `rxjs` 7.8.2.
- [x] Run `pnpm add --save-exact reflect-metadata@0.2.2`. Result: `package.json` lists `reflect-metadata` 0.2.2.
- [x] Run `pnpm add --save-exact @nestjs/common@12.3.3`. Result: `package.json` lists `@nestjs/common` 12.3.3.
- [x] Run `pnpm add --save-exact @nestjs/core@12.3.3`. Result: `package.json` lists `@nestjs/core` 12.3.3.
- [x] Run `pnpm add --save-exact @nestjs/platform-express@12.3.3`. Result: `package.json` lists `@nestjs/platform-express` 12.3.3.
- [x] Add the `nest` script to `package.json`: `node src/clients/nest/main.js`. Result: `pnpm nest` runs the Nest client.
- [x] Add `\"src/clients/nest/**/*.js\"` to the `format` script in `package.json`. Result: `pnpm format` covers the Nest client.

## Task 3 — Write the error filter

Decorators are called as functions, with no `@`. The file names are Nest's.

- [x] Create `src/clients/nest/errors.filter.js` with `/* global console */`, the exported class `ErrorsFilter`, a constructor that keeps the HTTP adapter in `this`. Result: the file exists, with an empty `catch(error, host)`.
- [x] Call `Catch()(ErrorsFilter)`. Result: the class catches every error.
- [x] Add the table of sentences with a status at the top of the file: 400, 404, 409, as in the spec. Result: each sentence has its status in one place.
- [x] In `catch`, answer a sentence of the table with `this.httpAdapter.reply(response, { error: message }, status)`. Result: an error of `logic/` answers its status with its sentence.
- [x] In `catch`, answer an `HttpException` with status 404 with an empty body. Result: a route Nest does not know answers 404 with no body.
- [x] In `catch`, answer any other `HttpException` with a 4xx status with 400 "The request is not valid." Result: broken JSON or a body too large answers 400 in JSON.
- [x] In `catch`, call `console.error(error)` if the message is not "The database failed." Result: a real bug shows in the terminal.
- [x] In `catch`, answer what is left with 500 "The database failed." Result: nothing else leaks.

## Task 4 — Write the controller

- [x] Create `src/clients/nest/users.controller.js` with the imports of Nest, the exported class `UsersController`, the call `Controller("users")(UsersController)`. Result: the file exists with no route yet.
- [x] Add the imports of the five `logic/` functions, with the `.js` extension. Result: the five names are imported.
- [x] Add the method for `POST /users`, with its `Post()` call plus its `Body()` call. Result: Nest routes the request to the method.
- [x] In `POST /users`, check that the body is an object. Result: `null`, `undefined` or a non-object throws `new BadRequestException("The request is not valid.")`.
- [x] In `POST /users`, check that `name` is a string. Result: anything else throws the same class with the same sentence.
- [x] In `POST /users`, check that `email` is a string. Result: anything else throws the same class with the same sentence.
- [x] In `POST /users`, return `createUser({ name, email })`. Result: a valid body answers 201 with the user.
- [x] Add the method for `GET /users`, with its `Get()` call, returning `listUsers()`. Result: 200 with the list, empty if there are none.
- [x] Add the method for `GET /users/:id`, with its `Get(":id")` call plus its `Param("id")` call. Result: Nest routes the request to the method.
- [x] In `GET /users/:id`, return `findUserById({ id })` with the id turned into a number by `Number(...)`. Result: an existing id answers the user, `abc` answers 404.
- [x] Add the method for `PATCH /users/:id`, with its `Patch(":id")`, `Param("id")`, `Body()` calls. Result: Nest routes the request to the method.
- [x] In `PATCH /users/:id`, check that the body is an object. Result: `null`, `undefined` or a non-object throws `new BadRequestException("The request is not valid.")`.
- [x] In `PATCH /users/:id`, check that `name`, if present, is a string. Result: `{"name": ["x"]}` throws the same class with the same sentence.
- [x] In `PATCH /users/:id`, check that `email`, if present, is a string. Result: `{"email": 5}` throws the same class with the same sentence.
- [x] In `PATCH /users/:id`, return `updateUser({ id, name, email })` with the id as a number. Result: a valid body answers 200 with the user.
- [x] Add the method for `DELETE /users/:id`, with its `Delete(":id")`, `HttpCode(204)`, `Param("id")` calls. Result: Nest routes the request to the method.
- [x] In `DELETE /users/:id`, await `deleteUser({ id })` with the id as a number. Result: 204 with no body.

## Task 5 — Write the rest of the client

- [x] Create `src/clients/nest/app.module.js` with the class `AppModule`, the call `Module({ controllers: [UsersController] })(AppModule)`. Result: the module has the controller.
- [x] Create `src/clients/nest/main.js` with `import "reflect-metadata"` as the first line, the imports of Nest, the constants `HOST` (`127.0.0.1`) with `PORT` (`3003`), each with a short comment. Result: the file exists, with no app yet.
- [x] In `main.js`, create the app with `NestFactory.create(AppModule, { bodyParser: false, logger: false })`. Result: Nest reads no body on its own, printing nothing.
- [x] In `main.js`, call `app.useBodyParser("json")`. Result: the body is read as JSON only.
- [x] In `main.js`, call `app.useGlobalFilters(new ErrorsFilter(app.getHttpAdapter()))`. Result: every error goes through the filter.
- [x] In `main.js`, listen on `HOST` with `PORT`, then log the address. Result: `pnpm nest` prints `Nest client on http://127.0.0.1:3003`.
- [x] Create `src/clients/terminal/nest.txt` with Spanish comments, the first lines about `first-app` with the two programs that must run, a `curl` for each of the five routes on port 3003. Result: the file can be pasted into the terminal.

## Task 6 — Run it

Note: the row "No users" of `plan.md` was run in the spike. It is not repeated here, because it would need deleting the real users.

Note: on 2026-11-04 the database program on 3000, the HTTP client on 3001 and the program on 3002 were already running from the main folder, on the branch of another session, so they were used and not started again. The database has real users, and `ady@example.com` and no id 1, so the five `curl` of `nest.txt` were run with a test email and the id it returned, not pasted as they are. The two steps that stop and start the database program are not done: they wait for Ella.

- [x] Run `pnpm start`. Result: the database program is on 3000.
- [x] Run `pnpm nest`. Result: the one line prints, the Nest client is on 3003.
- [x] Run `lsof -nP -iTCP:3003 -sTCP:LISTEN`. Result: it listens on `127.0.0.1` only.
- [x] Paste `src/clients/terminal/nest.txt`. Result: the five routes answer 201, 200, 200, 200, 204.
- [x] With `curl` on 3003, follow the example of the spec with Ada, using the id it returns. Result: the update keeps the email, the deleted user is gone from the list.
- [x] With `curl`: create with an empty name, then with a bad email. Result: 400 with each sentence.
- [x] With `curl`: create with the email of another user. Result: 409 "This email is already used."
- [x] With `curl`: `POST` with no body, `name` as a number, no `email`, `[]` as body. Result: the four answer 400 "The request is not valid."
- [x] With `curl`: `POST` with broken JSON, then with `"x"` as body. Result: both answer 400 "The request is not valid."
- [x] With `curl`: `POST` with a form body, then with a `text/plain` body. Result: both answer 400 "The request is not valid."
- [x] With `curl`: `POST` with a JSON body over 100 KB. Result: 400 "The request is not valid.", no user created.
- [x] With `curl`: `PATCH` with `{}`. Result: 400 "There is nothing to update."
- [x] With `curl`: `PATCH` with `{"name": ["x"]}`. Result: 400 "The request is not valid."
- [x] With `curl`: `GET` an id that does not exist, then `abc`, then `1.5`. Result: the three answer 404 "No user was found."
- [x] With `curl`: `HEAD /users`, then `GET /users/`. Result: both answer 200.
- [x] With `curl`: an unknown route, a wrong method on `/users`, `OPTIONS /users`. Result: the three answer 404 with an empty body.
- [x] Add a temporary `throw new TypeError("test")` to the method of `GET /users`. Result: the bug is in place for the next step.
- [x] Restart `pnpm nest`, then call `GET /users` with `curl`. Result: 500 "The database failed.", the `TypeError` in the terminal.
- [x] Remove the temporary line. Result: `git diff` shows no `TypeError` in `users.controller.js`.
- [x] Restart `pnpm nest`. Result: `GET /users` answers 200.
- [x] Stop `pnpm start`, then call `GET /users` on 3003. Result: 500 "The database failed.", nothing in the terminal.
- [x] Start `pnpm start` again. Result: the database program is on 3000.
- [x] Run `pnpm api`, then call `GET /users` on 3001. Result: 200, as before.
- [x] Run `pnpm chrome`, then call `GET /users` on 3002. Result: 200, as before.
- [x] Run `pnpm format`. Result: no errors.
- [x] Run `pnpm lint`. Result: no errors.
- [x] Show the result, then stop. Result: the next feature is not started.

## Task 7 — Update the docs for the change

- [ ] In `AGENTS.md`, add "This client is the only code with a build step." after the framework sentence of "Project", before "There is no TypeScript." Result: the line says the Nest client has a build step.
- [ ] In `AGENTS.md`, replace the description of `pnpm nest` in "Commands" with: "`pnpm nest` builds `src/` with Babel into `dist/` and starts the Nest client on `http://127.0.0.1:3003` (the database program must be running)." Result: the script is described as it runs.
- [ ] In `AGENTS.md`, add "a build step" to the list of the notice in "Style". Result: the notice lists the build step with the file names, classes, methods, `this`, decorators and error classes.
- [ ] In `docs/ARCHITECTURE.md`, add to the `nest/` entry: the build with `babel.config.json` into `dist/`, which is not in git. Result: the entry says how the client starts.
- [ ] In `docs/ARCHITECTURE.md`, change the line of `eslint.config.js`: it ignores `dist` and reads `src/clients/nest/` with the Babel parser. Result: the line matches the file after this change.
- [ ] In `docs/ARCHITECTURE.md`, add `babel.config.json` under "first-app/": the decorators plugin that the build reads. Result: the file is described.
- [ ] In `docs/TREE.md`, add `babel.config.json` in the root of `first-app/`. Result: the tree lists the file.

## Task 8 — Get Babel ready

The Socket review of these packages and their dependencies is in `plan.md`. `@babel/preset-env` is not added. The pnpm minimum release age can reject `@nestjs/*` 12.3.3 and `electron` 45.2.2 until 2026-11-05 at 09:37 UTC, because `pnpm add` checks the whole lockfile. Ella authorized the per-command exemption again for this change: write the four flags `--config.minimumReleaseAgeExclude=@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` and `electron`, add `--ignore-scripts`, and delete the `pnpm-workspace.yaml` that pnpm may write.

- [ ] Run `pnpm add -D --save-exact @babel/core@8.1.0`. Result: `package.json` lists `@babel/core` 8.1.0 in `devDependencies`.
- [ ] Run `pnpm add -D --save-exact @babel/cli@8.1.0`. Result: `package.json` lists `@babel/cli` 8.1.0.
- [ ] Run `pnpm add -D --save-exact @babel/plugin-proposal-decorators@8.0.2`. Result: `package.json` lists `@babel/plugin-proposal-decorators` 8.0.2.
- [ ] Run `pnpm add -D --save-exact @babel/eslint-parser@8.0.7`. Result: `package.json` lists `@babel/eslint-parser` 8.0.7.
- [ ] Check that no `pnpm-workspace.yaml` or `.npmrc` was left. Result: nothing stays exempted.
- [ ] Compare the new entries of `pnpm-lock.yaml` with the lists of `plan.md`. Result: every new package is on a reviewed list. If one is not, stop and tell the person.
- [ ] Add `dist/` to `.gitignore` of `first-app`. Result: `git status` does not show the build output.
- [ ] Change the `nest` script in `package.json` to `babel src --out-dir dist --delete-dir-on-start && node dist/clients/nest/main.js`. Result: `pnpm nest` builds, then starts.
- [ ] Create `babel.config.json` with the decorators plugin in `legacy` mode. Result: Babel reads `@`.
- [ ] Add `dist/**` to `ignores` in `eslint.config.js`. Result: ESLint does not read the build output.
- [ ] Add a block to `eslint.config.js` for `src/clients/nest/**/*.js` with `@babel/eslint-parser` and the same plugin in `babelOptions`. Result: ESLint reads `@` in the Nest folder.

## Task 9 — Write the client with `@`

Decorators are written with `@`, as in the Nest docs. The input uses `@Bind(...)`, because Babel does not read `@` in parameters.

- [ ] In `src/clients/nest/errors.filter.js`, write `@Catch()` before `export class ErrorsFilter`. Result: the class catches every error.
- [ ] In `src/clients/nest/errors.filter.js`, remove the call `Catch()(ErrorsFilter)` and its comment. Result: the decorator is not applied twice.
- [ ] In `src/clients/nest/app.module.js`, write `@Module({ controllers: [UsersController] })` before `export class AppModule`. Result: the module has the controller.
- [ ] In `src/clients/nest/app.module.js`, remove the call to `Module(...)` and its comment. Result: the decorator is not applied twice.
- [ ] In `src/clients/nest/users.controller.js`, write `@Controller()` before `export class UsersController`. Result: the class is a controller with no prefix.
- [ ] In `users.controller.js`, write `@Post("users")` and `@Bind(Body())` before `create`. Result: Nest routes `POST /users` to the method.
- [ ] In `users.controller.js`, write `@Get("users")` before `list`. Result: Nest routes `GET /users` to the method.
- [ ] In `users.controller.js`, write `@Get("users/:id")` and `@Bind(Param("id"))` before `findOne`. Result: Nest routes `GET /users/:id` to the method.
- [ ] In `users.controller.js`, write `@Patch("users/:id")` and `@Bind(Param("id"), Body())` before `update`. Result: Nest routes `PATCH /users/:id` to the method.
- [ ] In `users.controller.js`, write `@Delete("users/:id")`, `@HttpCode(204)` and `@Bind(Param("id"))` before `remove`. Result: Nest routes `DELETE /users/:id` and answers 204.
- [ ] In `users.controller.js`, remove the constant `methods` and every call of a decorator at the end of the file. Result: the file has only `@` decorators.
- [ ] Check that `main.js` does not need a change. Result: it imports the module and the filter as before.
- [ ] In `src/clients/terminal/nest.txt`, say in the first lines that `pnpm nest` builds before it starts. Result: the file matches the script.

## Task 10 — Run the change

Note: the database program on 3000 is Ella's, already running; it is not stopped. The step "Stop `pnpm start`" of Task 6 is not repeated: it was run on the Babel build in the spike of `plan.md` and gave 500 "The database failed.". The checks that change users use a test email, and the users they create are deleted at the end.

- [ ] Run `pnpm nest`. Result: Babel compiles `src/` into `dist/`, then the one line prints: `Nest client on http://127.0.0.1:3003`.
- [ ] Run `git status`. Result: `dist/` does not show.
- [ ] Run `lsof -nP -iTCP:3003 -sTCP:LISTEN`. Result: it listens on `127.0.0.1` only.
- [ ] With `curl` on 3003, create a test user, list, view, change the name only, delete. Result: 201, 200, 200, 200, 204, the email kept in the update, the user gone from the list.
- [ ] With `curl`: create with an empty name, then with a bad email. Result: 400 with each sentence.
- [ ] With `curl`: create with the email of another user. Result: 409 "This email is already used."
- [ ] With `curl`: `POST` with no body, `name` as a number, no `email`, `[]` as body. Result: the four answer 400 "The request is not valid."
- [ ] With `curl`: `POST` with broken JSON, `"x"` as body, a form body, a `text/plain` body. Result: the four answer 400 "The request is not valid."
- [ ] With `curl`: `POST` with a JSON body over 100 KB. Result: 400 "The request is not valid.", no user created.
- [ ] With `curl`: `PATCH` with `{}`. Result: 400 "There is nothing to update."
- [ ] With `curl`: `PATCH` with `{"name": ["x"]}`. Result: 400 "The request is not valid."
- [ ] With `curl`: `GET` an id that does not exist, then `abc`, then `1.5`. Result: the three answer 404 "No user was found."
- [ ] With `curl`: `HEAD /users`, then `GET /users/`. Result: both answer 200.
- [ ] With `curl`: an unknown route, a wrong method on `/users`, `OPTIONS /users`. Result: the three answer 404 with an empty body.
- [ ] Add a temporary `throw new TypeError("test")` to `list` in `users.controller.js`. Result: the bug is in place for the next step.
- [ ] Restart `pnpm nest`, then call `GET /users` with `curl`. Result: 500 "The database failed.", the `TypeError` in the terminal.
- [ ] Remove the temporary line and restart `pnpm nest`. Result: `grep` finds no `TypeError` in the source or in `dist/`, `git diff` shows no change, and `GET /users` answers 200.
- [ ] Call `GET /users` on 3001 and on 3002. Result: both answer 200, as before.
- [ ] Run `pnpm format`. Result: no errors, and no file outside the plan changes.
- [ ] Run `pnpm lint`. Result: no errors.
- [ ] Add an unused import to a Nest file, run `pnpm lint`, then remove the import. Result: lint reports the mistake, and the file is back as it was.
- [ ] Run `git merge-tree --write-tree --name-only --no-messages origin/staging HEAD` after `git fetch`. Result: no conflict.
- [ ] Show the result, then stop. Result: the next feature is not started.
