import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import {
  createUserAction,
  deleteUserAction,
  findUserAction,
  listUsersAction,
  updateUserAction,
} from "../src/clients/electron/user-actions.js";

async function testUserActions() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-electron-"));
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

    // A new database answers an empty list, not an error.
    assert.deepEqual(await listUsersAction(), { data: [] });

    const created = await createUserAction("Ada", "ada@example.com");
    const ada = created.data;
    assert.equal(ada.name, "Ada");
    assert.equal(ada.email, "ada@example.com");

    const listed = await listUsersAction();
    assert.equal(listed.data.length, 1);

    const found = await findUserAction(ada.id);
    assert.equal(found.data.email, "ada@example.com");
    assert.equal(found.data.createdAt, ada.createdAt);

    // A field that is not sent keeps the value already saved.
    const updated = await updateUserAction(ada.id, { name: "Ada Lovelace" });
    assert.equal(updated.data.name, "Ada Lovelace");
    assert.equal(updated.data.email, "ada@example.com");

    // Business errors arrive as { error } with the message of logic/,
    // because a thrown error would reach the page with extra text in front.
    assert.deepEqual(await createUserAction("", "new@example.com"), {
      error: "User name is required",
    });
    assert.deepEqual(await createUserAction("New", "not-an-email"), {
      error: "User email is invalid",
    });
    assert.deepEqual(await createUserAction("New", "ada@example.com"), {
      error: "User email is already registered",
    });
    assert.deepEqual(await updateUserAction(ada.id, { name: "" }), {
      error: "User name is required",
    });
    assert.deepEqual(await findUserAction(9999), {
      error: "User does not exist",
    });

    assert.deepEqual(await deleteUserAction(ada.id), { data: null });
    assert.deepEqual(await deleteUserAction(ada.id), {
      error: "User does not exist",
    });
    assert.deepEqual(await listUsersAction(), { data: [] });

    // With the data server stopped, each action answers its own operation
    // error, not an empty list or a SQLite message.
    const closed = once(dataServer, "close");
    dataServer.close();
    await closed;

    assert.deepEqual(await listUsersAction(), {
      error: "Unable to list users",
    });
    assert.deepEqual(await findUserAction(1), {
      error: "Unable to find user",
    });
    assert.deepEqual(await createUserAction("Ada", "ada@example.com"), {
      error: "Unable to create user",
    });
    assert.deepEqual(await updateUserAction(1, { name: "Ada" }), {
      error: "Unable to update user",
    });

    // deleteUser looks for the user first, so that step is the one that fails.
    assert.deepEqual(await deleteUserAction(1), {
      error: "Unable to find user",
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

test("Electron user actions answer data or the logic error", testUserActions);
