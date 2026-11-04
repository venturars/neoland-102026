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

  try {
    // The queries always ask 127.0.0.1:3000, so the temporary data server
    // listens there. If the real one is running, listen fails here and
    // the test stops before sending anything to the real database.
    const data = await import("../src/db/server.js");
    database = data.openDatabase();
    dataServer = data.createDatabaseServer(database);
    dataServer.listen(3000, "127.0.0.1");
    await once(dataServer, "listening");

    // The web page calls these same functions in the browser.
    const listing = await import("../src/logic/list-users.js");
    const updating = await import("../src/logic/update-user.js");

    // A terminal example is another Node process. It reaches the same
    // data through the server, not through a file of its own.
    // The child is awaited, not run with spawnSync: spawnSync would block
    // this process, and this process is the one answering the child's fetch.
    const appUrl = new URL("../", import.meta.url);
    const appDirectory = fileURLToPath(appUrl);
    const runNode = promisify(execFile);

    async function runTerminal(script) {
      const result = await runNode(
        process.execPath,
        ["--input-type=module", "-e", script],
        { cwd: appDirectory },
      );
      return result.stdout;
    }

    await runTerminal(
      'import { createUser } from "./src/logic/create-user.js"; await createUser("From terminal", "terminal@example.com");',
    );

    // What the terminal created is in the list the web shows.
    const users = await listing.listUsers();
    assert.equal(users.length, 1);
    assert.equal(users[0].name, "From terminal");

    // What the web saves is what the terminal finds afterwards.
    await updating.updateUser(users[0].id, { name: "From web" });
    const output = await runTerminal(
      'import { findUserById } from "./src/logic/find-user-by-id.js"; const user = await findUserById(' +
        users[0].id +
        "); console.log(JSON.stringify(user));",
    );
    const found = JSON.parse(output);
    assert.equal(found.name, "From web");
    assert.equal(found.email, "terminal@example.com");

    // With the data server stopped, the web functions fail with the
    // operation error, not with an empty list or a SQLite message.
    const closed = once(dataServer, "close");
    dataServer.close();
    await closed;
    await assert.rejects(listing.listUsers(), {
      message: "Unable to list users",
    });
  } finally {
    if (dataServer && dataServer.listening) {
      const closed = once(dataServer, "close");
      dataServer.close();
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

test(
  "Web and terminal share the same database through the data server",
  testSharedDatabase,
);
