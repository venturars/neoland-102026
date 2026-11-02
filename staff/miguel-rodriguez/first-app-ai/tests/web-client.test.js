import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";

const APP = fileURLToPath(new URL("../", import.meta.url));

test("web client preserves existing contact contracts in an isolated copy", async () => {
  const temporary = mkdtempSync(join(tmpdir(), "first-app-web-"));
  let server;
  try {
    cpSync(join(APP, "src"), join(temporary, "src"), {
      recursive: true,
      filter: (source) => !source.includes(".sqlite"),
    });
    cpSync(join(APP, "package.json"), join(temporary, "package.json"));
    const seed = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
        import { createUsersTable } from './src/queries/users.js';
        import { createUser } from './src/logic/create-user.js';
        createUsersTable(); createUsersTable();
        createUser({name:'<img src=x onerror=alert(1)>',email:'ada@example.test'});
        createUser({name:'Grace',email:'grace@example.test'});
      `,
      ],
      { cwd: temporary, encoding: "utf8" },
    );
    assert.equal(seed.status, 0, seed.stderr);
    server = spawn(process.execPath, ["src/clients/http/start-server.js"], {
      cwd: temporary,
      env: { ...process.env, WEB_PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const base = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Server did not start")),
        5000,
      );
      server.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Server exited: ${code}`));
      });
      server.stdout.on("data", (data) => {
        const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match) {
          clearTimeout(timer);
          resolve(match[0]);
        }
      });
    });
    const initial = await fetch(`${base}/api/users`);
    assert.equal(initial.status, 200);
    const contacts = await initial.json();
    assert.deepEqual(
      contacts.map((user) => user.id),
      [1, 2],
    );
    assert.deepEqual(Object.keys(contacts[0]).sort(), [
      "createdAt",
      "email",
      "id",
      "name",
      "updatedAt",
    ]);
    assert.equal(contacts[0].name, "<img src=x onerror=alert(1)>");
    const database = join(temporary, "src/db/users.sqlite");
    const beforeRead = readFileSync(database);
    assert.equal((await fetch(`${base}/api/users/1`)).status, 200);
    assert.deepEqual(readFileSync(database), beforeRead);
    assert.equal((await fetch(`${base}/api/users/999`)).status, 404);
    assert.equal((await fetch(`${base}/api/users/0`)).status, 400);
    assert.equal(
      (await fetch(`${base}/api/users/9007199254740992`)).status,
      400,
    );
    const patch = (body, headers = {}) =>
      fetch(`${base}/api/users/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headers },
        body,
      });
    assert.equal((await patch("{")).status, 400);
    assert.equal((await patch("[]")).status, 400);
    assert.equal((await patch('{"name":2}')).status, 400);
    assert.equal((await patch('{"role":"admin"}')).status, 400);
    assert.equal((await patch('{"name":"   "}')).status, 400);
    assert.equal((await patch('{"email":"grace@example.test"}')).status, 409);
    assert.equal(
      (await patch("{}", { "Content-Type": "text/plain" })).status,
      415,
    );
    assert.equal(
      (await patch("{}", { Origin: "https://other.example" })).status,
      403,
    );
    assert.equal(
      (await patch(JSON.stringify({ name: "x".repeat(9000) }))).status,
      413,
    );
    const edited = await patch(
      '{"name":" Ada Lovelace ","email":" ADA@EXAMPLE.TEST "}',
    );
    assert.equal(edited.status, 200);
    const updated = await edited.json();
    assert.equal(updated.name, "Ada Lovelace");
    assert.equal(updated.email, "ada@example.test");
    assert.equal(updated.createdAt, contacts[0].createdAt);
    assert.deepEqual(
      await (await fetch(`${base}/api/users/2`)).json(),
      contacts[1],
    );
    const html = await fetch(`${base}/`);
    assert.equal(html.status, 200);
    assert.match(html.headers.get("content-type"), /text\/html/);
    assert.equal((await fetch(`${base}/main.js`)).status, 200);
    assert.equal((await fetch(`${base}/styles.css`)).status, 200);
    assert.equal((await fetch(`${base}/package.json`)).status, 404);
    assert.equal(
      (await fetch(`${base}/api/users`, { method: "POST" })).status,
      405,
    );
    assert.equal(
      (await fetch(`${base}/api/users/1`, { method: "DELETE" })).status,
      204,
    );
    assert.equal(
      (await fetch(`${base}/api/users/1`, { method: "DELETE" })).status,
      404,
    );
    assert.deepEqual(
      (await (await fetch(`${base}/api/users`)).json()).map((user) => user.id),
      [2],
    );
    assert.equal(
      (await fetch(`${base}/api/users/2`, { method: "DELETE" })).status,
      204,
    );
    assert.deepEqual(await (await fetch(`${base}/api/users`)).json(), []);
  } finally {
    if (server && server.exitCode === null) {
      const stopped = once(server, "exit");
      server.kill("SIGTERM");
      await stopped;
    }
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("startup initializes an empty table and rejects invalid port configuration", async () => {
  const temporary = mkdtempSync(join(tmpdir(), "first-app-empty-"));
  let server;
  try {
    cpSync(join(APP, "src"), join(temporary, "src"), {
      recursive: true,
      filter: (source) => !source.includes(".sqlite"),
    });
    cpSync(join(APP, "package.json"), join(temporary, "package.json"));
    const invalid = spawnSync(
      process.execPath,
      ["src/clients/http/start-server.js"],
      {
        cwd: temporary,
        env: { ...process.env, WEB_PORT: "not-a-port" },
        encoding: "utf8",
      },
    );
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /WEB_PORT must be an integer/);
    server = spawn(process.execPath, ["src/clients/http/start-server.js"], {
      cwd: temporary,
      env: { ...process.env, WEB_PORT: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const base = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Server did not start")),
        5000,
      );
      server.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Server exited: ${code}`));
      });
      server.stdout.on("data", (data) => {
        const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match) {
          clearTimeout(timer);
          resolve(match[0]);
        }
      });
    });
    const response = await fetch(`${base}/api/users`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
    const dropped = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        "import {db} from './src/db/connection.js';db.exec('DROP TABLE users');",
      ],
      { cwd: temporary, encoding: "utf8" },
    );
    assert.equal(dropped.status, 0, dropped.stderr);
    const failure = await fetch(`${base}/api/users`);
    assert.equal(failure.status, 500);
    assert.deepEqual(await failure.json(), {
      error: "Could not complete the request",
    });
  } finally {
    if (server && server.exitCode === null) {
      const stopped = once(server, "exit");
      server.kill("SIGTERM");
      await stopped;
    }
    rmSync(temporary, { recursive: true, force: true });
  }
});
