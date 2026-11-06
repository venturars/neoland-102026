import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const CLIENT = "http://127.0.0.1:3004";

async function send(method, route, body) {
  const options = { method };

  if (body !== undefined) {
    options.headers = { "content-type": "application/json" };
    options.body = body;
  }

  const url = CLIENT + route;
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;

  if (text !== "") {
    json = JSON.parse(text);
  }

  return { status: response.status, text, json };
}

async function sendUser(method, route, user) {
  const body = JSON.stringify(user);

  return send(method, route, body);
}

async function waitForClient(client) {
  // If the port is taken the child exits. The test must stop there, or
  // its requests would reach a client that uses the real database.
  const started = once(client.stdout, "data");
  const exited = once(client, "exit");
  const failed = exited.then(() => {
    throw new Error("The node:http client did not start");
  });

  await Promise.race([started, failed]);
}

async function testNodeHttpClient() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-node-http-"));
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = path.join(folder, "users.sqlite");

  let dataServer;
  let database;
  let client;

  try {
    // The queries always ask 127.0.0.1:3000, so the temporary data server
    // listens there. If the real one is running, listen fails here and
    // the test stops before sending anything to the real database.
    const data = await import("../src/db/server.js");
    database = data.openDatabase();
    dataServer = data.createDatabaseServer(database);
    dataServer.listen(3000, "127.0.0.1");
    await once(dataServer, "listening");

    client = spawn(process.execPath, ["src/clients/node-http/app.js"], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    await waitForClient(client);

    // The correct case of the spec, in order.
    const emptyList = await send("GET", "/users");
    assert.equal(emptyList.status, 200);
    assert.deepEqual(emptyList.json, []);

    const created = await sendUser("POST", "/users", {
      name: "Ada",
      email: "ada@example.com",
    });
    assert.equal(created.status, 201);
    assert.equal(created.json.name, "Ada");
    assert.equal(created.json.email, "ada@example.com");
    assert.equal(typeof created.json.createdAt, "string");
    assert.equal(typeof created.json.updatedAt, "string");

    const route = "/users/" + created.json.id;

    const listed = await send("GET", "/users");
    assert.equal(listed.status, 200);
    assert.equal(listed.json.length, 1);

    const found = await send("GET", route);
    assert.equal(found.status, 200);
    assert.deepEqual(found.json, created.json);

    const updated = await sendUser("PATCH", route, { name: "Ada Lovelace" });
    assert.equal(updated.status, 200);
    assert.equal(updated.json.id, created.json.id);
    assert.equal(updated.json.name, "Ada Lovelace");
    assert.equal(updated.json.email, "ada@example.com");

    // Bad data answers the message of logic/ and creates nothing.
    const emptyName = await sendUser("POST", "/users", {
      name: "  ",
      email: "other@example.com",
    });
    assert.equal(emptyName.status, 400);
    assert.deepEqual(emptyName.json, { message: "User name is required" });

    const badEmail = await sendUser("POST", "/users", {
      name: "Grace",
      email: "grace",
    });
    assert.equal(badEmail.status, 400);
    assert.deepEqual(badEmail.json, { message: "User email is invalid" });

    const usedEmail = await sendUser("POST", "/users", {
      name: "Grace",
      email: "ada@example.com",
    });
    assert.equal(usedEmail.status, 409);
    assert.deepEqual(usedEmail.json, {
      message: "User email is already registered",
    });

    const afterErrors = await send("GET", "/users");
    assert.equal(afterErrors.json.length, 1);

    // A missing body and broken JSON are the client's fault, not a 500,
    // and they never show an error page of the server.
    const noBody = await send("POST", "/users");
    assert.equal(noBody.status, 400);
    assert.deepEqual(noBody.json, { message: "User name is required" });

    const brokenJson = await send("POST", "/users", "{ broken");
    assert.equal(brokenJson.status, 400);
    assert.deepEqual(brokenJson.json, { message: "Request JSON is invalid" });

    // A valid id that nobody has.
    const missingMessage = { message: "User does not exist" };
    const missingGet = await send("GET", "/users/999");
    assert.equal(missingGet.status, 404);
    assert.deepEqual(missingGet.json, missingMessage);

    const missingPatch = await sendUser("PATCH", "/users/999", { name: "X" });
    assert.equal(missingPatch.status, 404);
    assert.deepEqual(missingPatch.json, missingMessage);

    const missingDelete = await send("DELETE", "/users/999");
    assert.equal(missingDelete.status, 404);
    assert.deepEqual(missingDelete.json, missingMessage);

    // 1e3 is the case that must not turn into the number 1000.
    const invalidMessage = { message: "User id must be a positive integer" };

    for (const id of ["abc", "0", "1.5", "1e3"]) {
      const invalidRoute = "/users/" + id;

      const invalidGet = await send("GET", invalidRoute);
      assert.equal(invalidGet.status, 400);
      assert.deepEqual(invalidGet.json, invalidMessage);

      const invalidPatch = await sendUser("PATCH", invalidRoute, { name: "X" });
      assert.equal(invalidPatch.status, 400);
      assert.deepEqual(invalidPatch.json, invalidMessage);

      const invalidDelete = await send("DELETE", invalidRoute);
      assert.equal(invalidDelete.status, 400);
      assert.deepEqual(invalidDelete.json, invalidMessage);
    }

    const unknownRoute = await send("GET", "/no-existe");
    assert.equal(unknownRoute.status, 404);
    assert.equal(unknownRoute.text, "");

    // This client reads routes by hand, so the edges of the route are
    // checked too: an extra segment, an empty id and a method it lacks.
    const extraSegment = await send("GET", "/users/1/extra");
    assert.equal(extraSegment.status, 404);
    assert.equal(extraSegment.text, "");

    const emptyId = await send("GET", "/users/");
    assert.equal(emptyId.status, 404);
    assert.equal(emptyId.text, "");

    const missingMethod = await send("PUT", "/users");
    assert.equal(missingMethod.status, 404);
    assert.equal(missingMethod.text, "");

    // A JSON that is valid but not an object is treated as no body.
    const nullBody = await send("POST", "/users", "null");
    assert.equal(nullBody.status, 400);
    assert.deepEqual(nullBody.json, { message: "User name is required" });

    const removed = await send("DELETE", route);
    assert.equal(removed.status, 204);
    assert.equal(removed.text, "");

    const afterDelete = await send("GET", "/users");
    assert.deepEqual(afterDelete.json, []);

    // Without the data server each operation answers its own message.
    const closed = once(dataServer, "close");
    dataServer.close();
    await closed;

    const downCreate = await sendUser("POST", "/users", {
      name: "Ada",
      email: "ada@example.com",
    });
    assert.equal(downCreate.status, 500);
    assert.deepEqual(downCreate.json, { message: "Unable to create user" });

    const downList = await send("GET", "/users");
    assert.equal(downList.status, 500);
    assert.deepEqual(downList.json, { message: "Unable to list users" });

    const downGet = await send("GET", "/users/1");
    assert.equal(downGet.status, 500);
    assert.deepEqual(downGet.json, { message: "Unable to find user" });

    const downPatch = await sendUser("PATCH", "/users/1", { name: "X" });
    assert.equal(downPatch.status, 500);
    assert.deepEqual(downPatch.json, { message: "Unable to update user" });

    const downDelete = await send("DELETE", "/users/1");
    assert.equal(downDelete.status, 500);
    assert.deepEqual(downDelete.json, { message: "Unable to find user" });
  } finally {
    if (client) {
      const exited = once(client, "exit");
      client.kill();
      await exited;
    }

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
  "The node:http client answers the five routes and their errors",
  testNodeHttpClient,
);
