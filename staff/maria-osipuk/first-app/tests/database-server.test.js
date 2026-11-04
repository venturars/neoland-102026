import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

async function testDatabaseServer() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-data-"));
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = path.join(folder, "users.sqlite");

  let server;
  let database;

  try {
    // The data server opens the temporary file, never src/db/users.sqlite.
    // A port already in use rejects here, before any SQL is sent.
    const data = await import("../src/db/server.js");
    database = data.openDatabase();
    server = data.createDatabaseServer(database);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    const address = server.address();
    const url = "http://127.0.0.1:" + address.port + "/execute";

    async function send(body) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: body,
      });
      return response;
    }

    // The table already exists, because the server creates it on start.
    let response = await send(
      JSON.stringify({
        method: "run",
        sql: "INSERT INTO users (name, email) VALUES (:name, :email)",
        params: { name: "Example", email: "example@example.com" },
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    const inserted = await response.json();
    assert.equal(inserted.changes, 1);
    assert.equal(typeof inserted.lastInsertRowid, "number");

    response = await send(
      JSON.stringify({
        method: "get",
        sql: "SELECT name FROM users WHERE id = :id",
        params: { id: inserted.lastInsertRowid },
      }),
    );
    assert.deepEqual(await response.json(), { row: { name: "Example" } });

    // A missing row travels as null, because JSON has no undefined.
    response = await send(
      JSON.stringify({
        method: "get",
        sql: "SELECT name FROM users WHERE id = :id",
        params: { id: 999 },
      }),
    );
    assert.deepEqual(await response.json(), { row: null });

    response = await send(
      JSON.stringify({ method: "all", sql: "SELECT email FROM users" }),
    );
    assert.deepEqual(await response.json(), {
      rows: [{ email: "example@example.com" }],
    });

    response = await send(JSON.stringify({ method: "exec", sql: "SELECT 1" }));
    assert.deepEqual(await response.json(), { ok: true });

    // Broken SQL and broken JSON answer 500 with no SQLite detail.
    for (const body of [
      JSON.stringify({ method: "get", sql: "SELEC wrong" }),
      "{",
    ]) {
      response = await send(body);
      assert.equal(response.status, 500);
      assert.equal(await response.text(), "");
    }

    response = await send(JSON.stringify({ method: "other", sql: "SELECT 1" }));
    assert.equal(response.status, 404);
    response = await fetch(url);
    assert.equal(response.status, 404);
    response = await fetch(url.replace("/execute", "/users"));
    assert.equal(response.status, 404);

    // Chrome asks with OPTIONS before a JSON POST from a file:// page.
    response = await fetch(url, { method: "OPTIONS" });
    assert.equal(response.status, 204);
  } finally {
    if (server && server.listening) {
      const closed = once(server, "close");
      server.close();
      await closed;
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

test("The data server runs SQL on a temporary database", testDatabaseServer);
