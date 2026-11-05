import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const API = "http://127.0.0.1:3002";

async function send(method, route, body, contentType) {
  const options = { method };

  if (body !== undefined) {
    options.headers = { "content-type": contentType };
    options.body = body;
  }

  const url = API + route;
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;

  if (text !== "") {
    json = JSON.parse(text);
  }

  return { status: response.status, headers: response.headers, text, json };
}

async function sendUser(method, route, user) {
  const body = JSON.stringify(user);

  return send(method, route, body, "application/json");
}

async function waitForApi(api) {
  // If the port is taken the child exits. The test must stop there, or
  // its requests would reach an API that uses the real database.
  const started = once(api.stdout, "data");
  const exited = once(api, "exit");
  const failed = exited.then(() => {
    throw new Error("The Chrome API did not start");
  });

  await Promise.race([started, failed]);
}

async function testChromeApi() {
  const folder = mkdtempSync(path.join(tmpdir(), "first-app-chrome-"));
  const previousDatabaseFile = process.env.FIRST_APP_DATABASE_FILE;
  process.env.FIRST_APP_DATABASE_FILE = path.join(folder, "users.sqlite");

  let dataServer;
  let database;
  let api;

  try {
    // The queries always ask 127.0.0.1:3000, so the temporary data server
    // listens there. If the real one is running, listen fails here and
    // the test stops before sending anything to the real database.
    const data = await import("../src/db/server.js");
    database = data.openDatabase();
    dataServer = data.createDatabaseServer(database);
    dataServer.listen(3000, "127.0.0.1");
    await once(dataServer, "listening");

    api = spawn(process.execPath, ["src/clients/chrome/api.js"], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    await waitForApi(api);

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

    // A user can keep their own email, which is what the form sends.
    const sameEmail = await sendUser("PATCH", route, {
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
    assert.equal(sameEmail.status, 200);

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

    // The same rules when saving, and nothing changes.
    const saveEmptyName = await sendUser("PATCH", route, { name: "" });
    assert.equal(saveEmptyName.status, 400);
    assert.deepEqual(saveEmptyName.json, { message: "User name is required" });

    const saveBadEmail = await sendUser("PATCH", route, { email: "ada" });
    assert.equal(saveBadEmail.status, 400);
    assert.deepEqual(saveBadEmail.json, { message: "User email is invalid" });

    const grace = await sendUser("POST", "/users", {
      name: "Grace",
      email: "grace@example.com",
    });
    const saveUsedEmail = await sendUser("PATCH", route, {
      email: "grace@example.com",
    });
    assert.equal(saveUsedEmail.status, 409);
    assert.deepEqual(saveUsedEmail.json, {
      message: "User email is already registered",
    });

    const afterSaveErrors = await send("GET", route);
    assert.equal(afterSaveErrors.json.name, "Ada Lovelace");
    assert.equal(afterSaveErrors.json.email, "ada@example.com");

    const graceRemoved = await send("DELETE", "/users/" + grace.json.id);
    assert.equal(graceRemoved.status, 204);

    const afterErrors = await send("GET", "/users");
    assert.equal(afterErrors.json.length, 1);

    // A missing body and the JSON text null are the client's fault. They
    // reach the route, and logic/ answers instead of a TypeError.
    const nameMessage = { message: "User name is required" };
    const noBody = await send("POST", "/users");
    assert.equal(noBody.status, 400);
    assert.deepEqual(noBody.json, nameMessage);

    const nullBody = await send("POST", "/users", "null", "application/json");
    assert.equal(nullBody.status, 400);
    assert.deepEqual(nullBody.json, nameMessage);

    const nullPatch = await send("PATCH", route, "null", "application/json");
    assert.equal(nullPatch.status, 200);
    assert.equal(nullPatch.json.name, "Ada Lovelace");

    // Broken or empty JSON never reaches the route, and the text of
    // Fastify is replaced by the message of this client.
    const jsonMessage = { message: "Request JSON is invalid" };
    const brokenJson = await send(
      "POST",
      "/users",
      "{ broken",
      "application/json",
    );
    assert.equal(brokenJson.status, 400);
    assert.deepEqual(brokenJson.json, jsonMessage);

    const emptyJson = await send("POST", "/users", "", "application/json");
    assert.equal(emptyJson.status, 400);
    assert.deepEqual(emptyJson.json, jsonMessage);

    // Fastify accepts text/plain and gives the route a string. It has no
    // name, so logic/ rejects it and nobody is created.
    const plainText = await send(
      "POST",
      "/users",
      "name=Mallory",
      "text/plain",
    );
    assert.equal(plainText.status, 400);
    assert.deepEqual(plainText.json, nameMessage);

    const afterBadBodies = await send("GET", "/users");
    assert.equal(afterBadBodies.json.length, 1);

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

    // Without CORS headers Chrome blocks any web page. OPTIONS is the
    // question a browser asks first, and it gets no permission.
    const fromPage = await fetch(API + "/users", {
      headers: { origin: "https://example.com" },
    });
    assert.equal(fromPage.headers.get("access-control-allow-origin"), null);

    const preflight = await fetch(API + "/users", {
      method: "OPTIONS",
      headers: {
        origin: "https://example.com",
        "access-control-request-method": "POST",
      },
    });
    assert.equal(preflight.status, 404);
    assert.equal(preflight.headers.get("access-control-allow-origin"), null);

    const removed = await send("DELETE", route);
    assert.equal(removed.status, 204);
    assert.equal(removed.text, "");

    const afterDelete = await send("GET", "/users");
    assert.deepEqual(afterDelete.json, []);

    // Without the data server each action answers its own message, the
    // one the spec asks for, even when logic/ fails while looking first.
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
    assert.deepEqual(downDelete.json, { message: "Unable to delete user" });
  } finally {
    if (api) {
      const exited = once(api, "exit");
      api.kill();
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

function testManifest() {
  const text = readFileSync("src/clients/chrome/manifest.json", "utf8");
  const manifest = JSON.parse(text);

  // The extension can only reach its own API and asks for nothing else.
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.action.default_popup, "popup.html");
  assert.deepEqual(manifest.host_permissions, ["http://127.0.0.1:3002/*"]);
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.equal(manifest.background, undefined);
}

test("The Chrome API answers the five routes and their errors", testChromeApi);
test("The extension only has permission for its API", testManifest);
