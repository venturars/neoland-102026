import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

async function testHttpClient() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-http-"));
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = path.join(folder, "users.sqlite");

  let dataServer;
  let database;
  let server;

  try {
    // The queries always ask 127.0.0.1:3000, so the temporary data server
    // listens there. If the real one is running, listen fails here and
    // the test stops before sending anything to the real database.
    const data = await import("../src/db/server.js");
    database = data.openDatabase();
    dataServer = data.createDatabaseServer(database);
    dataServer.listen(3000, "127.0.0.1");
    await once(dataServer, "listening");

    const http = await import("../src/clients/http/app.js");
    server = http.createHttpServer();
    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    const address = server.address();
    const baseUrl = "http://127.0.0.1:" + address.port;
    const collectionUrl = baseUrl + "/api/users";

    async function send(url, method, value) {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      return response;
    }

    let response = await send(collectionUrl, "POST", {
      name: "  Example One  ",
      email: "  ONE@EXAMPLE.COM ",
    });
    assert.equal(response.status, 201);
    const first = await response.json();
    assert.deepEqual(first, {
      id: first.id,
      name: "Example One",
      email: "one@example.com",
    });

    response = await send(collectionUrl, "POST", {
      name: "Example Two",
      email: "two@example.com",
    });
    assert.equal(response.status, 201);
    const second = await response.json();

    // Creating with invalid data or a used email fails with a clear error.
    const invalidUsers = [
      { name: "   ", email: "new@example.com" },
      { email: "new@example.com" },
      { name: "New", email: "invalid" },
      { name: "New", email: "a".repeat(65) + "@example.com" },
    ];

    for (const user of invalidUsers) {
      response = await send(collectionUrl, "POST", user);
      assert.equal(response.status, 400);
      const problem = await response.json();
      assert.equal(typeof problem.error, "string");
    }

    response = await send(collectionUrl, "POST", {
      name: "Copy",
      email: "one@example.com",
    });
    assert.equal(response.status, 409);

    // A partial update keeps the absent email and ignores fields that
    // the client is not allowed to edit, such as the id.
    const userUrl = collectionUrl + "/" + first.id;
    response = await send(userUrl, "PATCH", {
      name: "  Nombre con acento: Á  ",
      id: second.id,
      createdAt: "changed",
    });
    assert.equal(response.status, 200);
    let saved = await response.json();
    assert.deepEqual(saved, {
      id: first.id,
      name: "Nombre con acento: Á",
      email: "one@example.com",
    });

    response = await send(userUrl, "PATCH", {
      email: "  UPDATED@EXAMPLE.COM  ",
    });
    assert.equal(response.status, 200);
    saved = await response.json();
    assert.equal(saved.email, "updated@example.com");

    const invalidChanges = [
      { name: "   " },
      { name: 123 },
      { email: "invalid" },
      { email: null },
      { email: "name@@example.com" },
    ];

    for (const changes of invalidChanges) {
      response = await send(userUrl, "PATCH", changes);
      assert.equal(response.status, 400);
    }

    response = await send(userUrl, "PATCH", { email: second.email });
    assert.equal(response.status, 409);

    for (const body of ["{", "null", "[]", '"text"']) {
      response = await fetch(userUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body,
      });
      assert.equal(response.status, 400);
    }

    response = await fetch(userUrl, { method: "PATCH", body: "name=value" });
    assert.equal(response.status, 400);
    response = await send(userUrl, "PATCH", { name: "x".repeat(70_000) });
    assert.equal(response.status, 413);

    for (const id of ["0", "-1", "1.5", "1abc", "9007199254740993"]) {
      response = await fetch(collectionUrl + "/" + id, { method: "DELETE" });
      assert.equal(response.status, 400);
    }

    response = await send(collectionUrl + "/999999", "PATCH", { name: "X" });
    assert.equal(response.status, 404);

    // Listing, reading one user and the web page are no longer here.
    response = await fetch(collectionUrl);
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST");
    response = await fetch(userUrl);
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "PATCH, DELETE");

    for (const otherPath of ["/", "/styles.css", "/app.js", "/api/other"]) {
      response = await fetch(baseUrl + otherPath);
      assert.equal(response.status, 404);
    }

    response = await fetch(userUrl, { method: "DELETE" });
    assert.equal(response.status, 204);
    assert.equal(await response.text(), "");
    response = await fetch(userUrl, { method: "DELETE" });
    assert.equal(response.status, 404);

    // With the data server stopped, the client answers 500 in Spanish
    // and does not show what failed inside.
    const closed = once(dataServer, "close");
    dataServer.close();
    await closed;
    response = await send(collectionUrl, "POST", {
      name: "Late",
      email: "late@example.com",
    });
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "No se ha podido crear el usuario.",
    });
  } finally {
    for (const openServer of [server, dataServer]) {
      if (openServer && openServer.listening) {
        const closed = once(openServer, "close");
        openServer.close();
        await closed;
      }
    }

    if (database) {
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
  "The HTTP client creates, updates and deletes users on a temporary database",
  testHttpClient,
);
