import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { once } from "node:events";

const origin = "http://127.0.0.1:3000";
const root = fileURLToPath(new URL("../", import.meta.url));
async function scenario(app) {
  const load = (file) => import(pathToFileURL(`${app}/src/${file}`).href);
  const q = await load("queries/users.js");
  const ops = {};
  for (const [name, file] of Object.entries({
    createUser: "create-user",
    listUsers: "list-users",
    findUserById: "find-user-by-id",
    findUserByEmail: "find-user-by-email",
    findUserByName: "find-user-by-name",
    updateUser: "update-user",
    deleteUser: "delete-user",
    usersGenderCount: "users-gender-count",
  }))
    ops[name] = (await load(`logic/${file}.js`))[name];
  const results = [];
  const clean = (value) =>
    JSON.parse(
      JSON.stringify(value, (key, item) =>
        ["createdAt", "updatedAt"].includes(key) ? "<timestamp>" : item,
      ) ?? "null",
    );
  async function call(name, args = [], message) {
    try {
      const value = await ops[name](...args);
      assert.equal(message, undefined, `Expected ${message}`);
      results.push({ name, args, result: clean(value) });
      return value;
    } catch (error) {
      if (!message) throw error;
      assert.equal(error.message, message);
      results.push({ name, args, error: error.message });
    }
  }
  await call("listUsers", [], "Could not list the users");
  await call("usersGenderCount", [], "Could not classify the users");
  await q.createUsersTable();
  assert.deepEqual(await call("listUsers"), []);
  assert.deepEqual(await call("usersGenderCount"), {
    women: 0,
    men: 0,
    genderUndefined: 0,
  });
  assert.deepEqual(await call("findUserByName", ["Nobody"]), []);
  await call("createUser", [{ name: " ", email: "bad" }], "Name is empty");
  await call("createUser", [{ name: "Ada", email: "bad" }], "Email is invalid");
  const ada = await call("createUser", [
    { name: " Ada ", email: " ADA@EXAMPLE.TEST " },
  ]);
  assert.deepEqual(Object.keys(ada), [
    "id",
    "name",
    "email",
    "createdAt",
    "updatedAt",
  ]);
  const grace = await call("createUser", [
    { name: "Grace", email: "grace@example.test" },
  ]);
  await call(
    "createUser",
    [{ name: "Ada", email: "ada@example.test" }],
    "Email is already used",
  );
  await call("createUser", [{ name: "Ada", email: "ada2@example.test" }]);
  await call("createUser", [
    { name: "Ada Lovelace", email: "lovelace@example.test" },
  ]);
  const before = await ops.listUsers();
  await q.createUsersTable();
  assert.deepEqual(await ops.listUsers(), before);
  assert.deepEqual(await call("listUsers"), before);
  assert.deepEqual(
    before.map((user) => user.id),
    [1, 2, 3, 4],
  );
  assert.deepEqual(await call("findUserById", [ada.id]), ada);
  assert.deepEqual(await call("findUserByEmail", [" ADA@EXAMPLE.TEST "]), ada);
  assert.deepEqual(await call("findUserByName", [" Ada "]), [
    before[0],
    before[2],
  ]);
  assert.deepEqual(await call("findUserByName", ["ada"]), []);
  assert.deepEqual(await call("findUserByName", ["Ad"]), []);
  await call("findUserByName", [" "], "Name is empty");
  await call("findUserByEmail", ["bad"], "Email is invalid");
  await call("findUserByEmail", ["missing@example.test"], "User not found");
  await call("findUserById", [99999], "User not found");
  await call(
    "updateUser",
    [99999, { name: "", email: "bad" }],
    "User not found",
  );
  await call("updateUser", [ada.id, { name: " " }], "Name is empty");
  await call("updateUser", [ada.id, { email: "bad" }], "Email is invalid");
  await call(
    "updateUser",
    [ada.id, { email: grace.email }],
    "Email is already used",
  );
  assert.deepEqual(await ops.listUsers(), before);
  const updated = await call("updateUser", [
    ada.id,
    { name: " Augusta ", email: " AUGUSTA@EXAMPLE.TEST " },
  ]);
  assert.equal(updated.createdAt, ada.createdAt);
  assert.equal(updated.name, "Augusta");
  assert.equal(updated.email, "augusta@example.test");
  await call("updateUser", [ada.id, {}]);
  assert.deepEqual(await ops.findUserById(grace.id), grace);
  const removed = await call("deleteUser", [ada.id]);
  assert.equal(removed, undefined);
  await call("deleteUser", [ada.id], "User not found");
  await call("findUserById", [ada.id], "User not found");
  await call("createUser", [{ name: "Reused", email: "augusta@example.test" }]);
  const after = await ops.listUsers();
  assert.deepEqual(await ops.findUserById(grace.id), grace);
  assert.equal(after.length, 4);
  return results;
}
async function start(app) {
  const child = spawn(process.execPath, [join(app, "src/db/server.js")], {
    cwd: tmpdir(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const exited = once(child, "exit");
  await Promise.race([
    once(child.stdout, "data"),
    exited.then(() => {
      throw new Error(`Server did not start: ${stderr}`);
    }),
  ]);
  return { child, exited };
}
async function stop(server) {
  if (server.child.exitCode === null && server.child.signalCode === null) {
    server.child.kill("SIGTERM");
  }
  await server.exited;
}
async function request(method, sql, params = {}) {
  return fetch(`${origin}/execute`, {
    method: "POST",
    headers: { "content-type": "application/json", Origin: "null" },
    body: JSON.stringify({ method, sql, params }),
  });
}

test(
  "shared data server preserves operations and client results",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "first-app-data-test-"));
    const app = join(folder, "app");
    let server;
    try {
      await cp(join(root, "src"), join(app, "src"), {
        recursive: true,
        filter: (path) => !/\.sqlite(?:-|$)/.test(path),
      });
      await cp(join(root, "package.json"), join(app, "package.json"));
      await symlink(
        join(root, "node_modules"),
        join(app, "node_modules"),
        "dir",
      );
      server = await start(app);
      const occupied = spawn(
        process.execPath,
        [join(app, "src/db/server.js")],
        {
          stdio: ["ignore", "ignore", "pipe"],
        },
      );
      let occupiedError = "";
      occupied.stderr.on("data", (chunk) => {
        occupiedError += chunk;
      });
      const [occupiedCode] = await once(occupied, "exit");
      assert.equal(occupiedCode, 1);
      assert.match(occupiedError, /Could not start data server:.*EADDRINUSE/);
      const options = await fetch(`${origin}/execute`, {
        method: "OPTIONS",
        headers: {
          Origin: "null",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "content-type",
        },
      });
      assert.equal(options.status, 204);
      assert.equal(options.headers.get("access-control-allow-origin"), "*");
      assert.match(options.headers.get("access-control-allow-methods"), /POST/);
      assert.match(
        options.headers.get("access-control-allow-headers"),
        /content-type/,
      );
      const noTable = await request("all", "SELECT * FROM users");
      assert.equal(noTable.status, 500);
      assert.equal(noTable.headers.get("access-control-allow-origin"), "*");
      assert.deepEqual(await noTable.json(), { error: "Query failed" });
      const invalid = await fetch(`${origin}/execute`, {
        method: "POST",
        body: "not json",
      });
      assert.equal(invalid.status, 400);
      assert.equal(invalid.headers.get("access-control-allow-origin"), "*");
      assert.equal((await request("unknown", "SELECT 1")).status, 400);
      assert.equal((await request("get", "invalid SQL")).status, 500);
      assert.equal((await fetch(`${origin}/missing`)).status, 404);
      assert.equal((await fetch(`${origin}/execute`)).status, 405);
      await scenario(app);
      const q = await import(
        pathToFileURL(join(app, "src/queries/users.js")).href
      );
      assert.equal(await q.findById(999999), undefined);
      assert.equal(await q.findByEmail("nobody@example.test"), undefined);
      assert.deepEqual(await q.findByName("nobody"), []);
      assert.ok((await q.listTables()).some((table) => table.name === "users"));
      const absent = await q.remove(999999);
      assert.equal(absent.changes, 0);
      assert.equal(typeof absent.lastInsertRowid, "number");
      const before = await q.findAll();
      await stop(server);
      server = undefined;
      server = await start(app);
      assert.deepEqual(await q.findAll(), before);
      await stop(server);
      server = undefined;
      const { listUsers } = await import(
        pathToFileURL(join(app, "src/logic/list-users.js")).href
      );
      const { createUser } = await import(
        pathToFileURL(join(app, "src/logic/create-user.js")).href
      );
      const { updateUser } = await import(
        pathToFileURL(join(app, "src/logic/update-user.js")).href
      );
      await assert.rejects(listUsers(), {
        message: "Could not list the users",
      });
      const originalFetch = globalThis.fetch;
      try {
        for (const result of [null, {}, { rows: null }]) {
          globalThis.fetch = async () => ({
            ok: true,
            json: async () => result,
          });
          await assert.rejects(listUsers(), {
            message: "Could not list the users",
          });
        }
        globalThis.fetch = async () => ({
          ok: true,
          json: async () => {
            throw new SyntaxError("Invalid JSON");
          },
        });
        await assert.rejects(listUsers(), {
          message: "Could not list the users",
        });
      } finally {
        globalThis.fetch = originalFetch;
      }
      await assert.rejects(createUser({ name: "", email: "bad" }), {
        message: "Name is empty",
      });
      await assert.rejects(updateUser(99999, { name: "" }), {
        message: "Could not update the user",
      });
    } finally {
      if (server) await stop(server);
      await rm(folder, { recursive: true, force: true });
    }
  },
);
