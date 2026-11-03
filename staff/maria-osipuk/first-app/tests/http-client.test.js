import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

async function testHttpClient() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-http-"));
  const databaseFile = path.join(folder, "users.sqlite");
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = databaseFile;

  let server;
  let database;
  let databaseIsClosed = false;

  try {
    // Import only after choosing the temporary database. Importing earlier
    // would open the application's default database during the test.
    const connection = await import("../src/db/connection.js");
    database = connection.database;
    const creation = await import("../src/logic/create-user.js");
    const lookup = await import("../src/logic/find-user-by-id.js");
    const http = await import("../src/clients/http/create-http-server.js");
    server = http.createHttpServer();
    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    const address = server.address();
    const baseUrl = "http://127.0.0.1:" + address.port;
    let response = await fetch(baseUrl + "/api/users");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);

    // Public resources must be served with a browser-readable content type.
    for (const publicPath of ["/", "/styles.css", "/main.js"]) {
      response = await fetch(baseUrl + publicPath);
      assert.equal(response.status, 200);
      const contentType = response.headers.get("content-type");
      assert.ok(contentType.includes("charset=utf-8"));
      const content = await response.text();
      assert.ok(content.length > 0);
    }

    const first = creation.createUser("Example One", "one@example.com");
    const second = creation.createUser("Example Two", "two@example.com");
    const userUrl = baseUrl + "/api/users/" + first.id;
    response = await fetch(baseUrl + "/api/users");
    const selection = await response.json();
    assert.deepEqual(selection, [
      { id: first.id, name: first.name, email: first.email },
      { id: second.id, name: second.name, email: second.email },
    ]);
    assert.equal(response.headers.get("cache-control"), "no-store");

    response = await fetch(userUrl);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), selection[0]);

    // A partial update must preserve the absent email and ignore fields that
    // a browser is not allowed to edit, such as the id and creation date.
    response = await fetch(userUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "  Nombre con acento: Á  ",
        id: second.id,
        createdAt: "changed",
      }),
    });
    assert.equal(response.status, 200);
    let saved = await response.json();
    assert.equal(saved.name, "Nombre con acento: Á");
    assert.equal(saved.email, first.email);
    assert.equal(saved.id, first.id);
    const existing = lookup.findUserById(first.id);
    assert.equal(existing.createdAt, first.createdAt);

    response = await fetch(userUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "  UPDATED@EXAMPLE.COM  " }),
    });
    assert.equal(response.status, 200);
    saved = await response.json();
    assert.equal(saved.email, "updated@example.com");
    assert.equal(saved.name, "Nombre con acento: Á");

    const invalidChanges = [
      { name: "   " },
      { name: 123 },
      { email: "invalid" },
      { email: null },
      { email: "name@@example.com" },
      { email: "a".repeat(65) + "@example.com" },
    ];

    for (const changes of invalidChanges) {
      response = await fetch(userUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      assert.equal(response.status, 400);
      const problem = await response.json();
      assert.equal(typeof problem.error, "string");
    }

    response = await fetch(userUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: second.email }),
    });
    assert.equal(response.status, 409);
    response = await fetch(userUrl);
    assert.deepEqual(await response.json(), saved);

    const invalidBodies = ["{", "null", "[]", '"text"'];

    for (const body of invalidBodies) {
      response = await fetch(userUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      assert.equal(response.status, 400);
    }

    response = await fetch(userUrl, { method: "PATCH", body: "name=value" });
    assert.equal(response.status, 400);
    response = await fetch(userUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "x".repeat(70_000) }),
    });
    assert.equal(response.status, 413);

    for (const id of ["0", "-1", "1.5", "1abc", "9007199254740993"]) {
      response = await fetch(baseUrl + "/api/users/" + id);
      assert.equal(response.status, 400);
    }

    response = await fetch(baseUrl + "/api/users/999999");
    assert.equal(response.status, 404);
    response = await fetch(baseUrl + "/api/users", { method: "POST" });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET");
    response = await fetch(userUrl, { method: "PUT" });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET, PATCH, DELETE");

    for (const privatePath of [
      "/src/db/users.sqlite",
      "/src/queries/users.js",
      "/../package.json",
      "/%2e%2e/package.json",
      "/__proto__",
      "/api/users/1/notes",
    ]) {
      response = await fetch(baseUrl + privatePath);
      assert.equal(response.status, 404);
    }

    // A second Node process reads the saved data from disk, rather than
    // relying on an object already held by this process.
    const appUrl = new URL("../", import.meta.url);
    const appDirectory = fileURLToPath(appUrl);
    const script =
      'import { findUserById } from "./src/logic/find-user-by-id.js"; console.log(JSON.stringify(findUserById(' +
      first.id +
      ")));";
    const reopened = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      {
        cwd: appDirectory,
        env: process.env,
        encoding: "utf8",
      },
    );
    assert.equal(reopened.status, 0, reopened.stderr);
    const persisted = JSON.parse(reopened.stdout);
    assert.equal(persisted.name, saved.name);
    assert.equal(persisted.email, saved.email);

    response = await fetch(userUrl, { method: "DELETE" });
    assert.equal(response.status, 204);
    assert.equal(await response.text(), "");
    response = await fetch(userUrl);
    assert.equal(response.status, 404);
    response = await fetch(baseUrl + "/api/users");
    const remaining = await response.json();
    assert.deepEqual(remaining, [selection[1]]);
    response = await fetch(userUrl, { method: "DELETE" });
    assert.equal(response.status, 404);

    // Closing this temporary connection forces a real storage failure.
    // The API must return an error instead of a misleading empty list.
    database.close();
    databaseIsClosed = true;
    response = await fetch(baseUrl + "/api/users");
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "No se ha podido obtener la lista de usuarios.",
    });
  } finally {
    if (server && server.listening) {
      const closed = once(server, "close");
      server.close();
      await closed;
    }

    if (database && !databaseIsClosed) {
      database.close();
    }

    if (previousDatabaseFile === undefined) {
      delete process.env.FIRST_APP_DATABASE_FILE;
    } else {
      process.env.FIRST_APP_DATABASE_FILE = previousDatabaseFile;
    }

    rmSync(folder, { recursive: true, force: true });
  }
}

test(
  "The HTTP client manages existing users without changing the real database",
  testHttpClient,
);
