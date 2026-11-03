import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

async function testSharedDatabase() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-shared-"));
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = path.join(folder, "users.sqlite");

  let dataServer;
  let database;
  let server;

  try {
    // Same rule as the HTTP test: the temporary data server must own
    // port 3000, or the test stops before any query reaches it.
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
    const collectionUrl = "http://127.0.0.1:" + address.port + "/api/users";

    // The web page calls these same functions in the browser.
    const listing = await import("../src/logic/list-users.js");
    const updating = await import("../src/logic/update-user.js");

    let response = await fetch(collectionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "From HTTP", email: "http@example.com" }),
    });
    assert.equal(response.status, 201);
    const created = await response.json();

    // What HTTP created is in the list the web shows.
    let users = await listing.listUsers();
    assert.equal(users.length, 1);
    assert.equal(users[0].name, "From HTTP");

    // What the web saves is what HTTP finds when it updates again.
    await updating.updateUser(created.id, { name: "From web" });
    response = await fetch(collectionUrl + "/" + created.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    assert.deepEqual(await response.json(), {
      id: created.id,
      name: "From web",
      email: "http@example.com",
    });

    // A terminal example is another Node process. It also reaches the
    // same data through the server, not through a file of its own.
    // The child is awaited, not run with spawnSync: spawnSync would block
    // this process, and this process is the one answering the child's fetch.
    const appUrl = new URL("../", import.meta.url);
    const appDirectory = fileURLToPath(appUrl);
    const script =
      'import { createUser } from "./src/logic/create-user.js"; await createUser("From terminal", "terminal@example.com");';
    const runNode = promisify(execFile);
    await runNode(process.execPath, ["--input-type=module", "-e", script], {
      cwd: appDirectory,
    });

    users = await listing.listUsers();
    assert.equal(users.length, 2);
    assert.equal(users[1].email, "terminal@example.com");
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
  "Web, HTTP and terminal share the same database through the data server",
  testSharedDatabase,
);
