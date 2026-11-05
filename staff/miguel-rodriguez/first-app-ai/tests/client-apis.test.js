import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { setTimeout } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const ports = [3001, 3002];
const fields = ["id", "name", "email", "createdAt", "updatedAt"];

async function request(port, method, path, body) {
  const options = { method };
  if (body !== undefined) {
    options.headers = { "content-type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const text = await response.text();
  const value = text ? JSON.parse(text) : undefined;
  return { status: response.status, value };
}

async function start(app, file, port) {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(port, "127.0.0.1", () => {
      probe.close(resolve);
    });
  });
  const child = spawn(process.execPath, [join(app, file)], {
    cwd: app,
    stdio: ["ignore", "ignore", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  const exited = once(child, "exit");
  const server = { child, exited };
  try {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null || child.signalCode !== null) {
        throw new Error(`Server did not start: ${stderr}`);
      }
      try {
        await fetch(`http://127.0.0.1:${port}/`);
        return server;
      } catch {
        await setTimeout(50);
      }
    }
    throw new Error(`Server startup timed out: ${stderr}`);
  } catch (error) {
    await stop(server);
    throw error;
  }
}

async function stop(server) {
  const running =
    server.child.exitCode === null && server.child.signalCode === null;
  if (running) {
    server.child.kill("SIGTERM");
  }
  await server.exited;
}

test(
  "Express and Fastify reuse shared operations and database records",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "first-app-client-apis-"));
    const app = join(folder, "app");
    const clients = [];
    let dataServer;
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
      dataServer = await start(app, "src/db/server.js", 3000);
      clients.push(await start(app, "src/clients/http/app.js", 3001));
      clients.push(await start(app, "src/clients/chrome/server.js", 3002));
      const queries = await import(
        pathToFileURL(join(app, "src/queries/users.js")).href
      );
      for (const port of ports) {
        assert.deepEqual(await request(port, "GET", "/users"), {
          status: 500,
          value: { message: "Could not list the users" },
        });
      }
      await queries.createUsersTable();
      for (const port of ports) {
        assert.deepEqual(await request(port, "GET", "/users"), {
          status: 200,
          value: [],
        });
        assert.deepEqual(await request(port, "GET", "/users/gender-count"), {
          status: 200,
          value: { women: 0, men: 0, genderUndefined: 0 },
        });
        assert.deepEqual(await request(port, "GET", "/missing"), { status: 404, value: undefined });
        const malformed = await fetch(`http://127.0.0.1:${port}/users`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "not json",
        });
        assert.equal(malformed.status, 400);
      }
      for (const origin of ["null", "file://", "https://unrelated.example"]) {
        const response = await fetch(
          "http://127.0.0.1:3001/users/gender-count",
          {
            headers: { Origin: origin },
          },
        );
        assert.equal(response.status, 200);
        assert.equal(
          response.headers.get("access-control-allow-origin"),
          null,
        );
        await response.arrayBuffer();
      }

      const keeper = await queries.insert({
        name: "Grace",
        email: "grace@example.test",
      });

      for (const port of ports) {
        const email = `ada-${port}@example.test`;
        const created = await request(port, "POST", "/users", {
          name: " Ada ",
          email: ` ${email.toUpperCase()} `,
        });
        assert.equal(created.status, 201);
        const user = created.value;
        assert.deepEqual(Object.keys(user), fields);
        assert.equal(typeof user.id, "number");
        assert.equal(user.name, "Ada");
        assert.equal(user.email, email);
        assert.equal(typeof user.createdAt, "string");
        assert.equal(typeof user.updatedAt, "string");
        for (const other of ports) {
          assert.deepEqual(await request(other, "GET", `/users/${user.id}`), {
            status: 200,
            value: user,
          });
        }
        assert.deepEqual(await queries.findById(user.id), user);
        assert.deepEqual(await request(port, "GET", "/users"), {
          status: 200,
          value: [keeper, user],
        });
        const beforeErrors = await queries.findAll();
        for (const [body, status, message] of [
          [{ name: " ", email: "bad" }, 400, "Name is empty"],
          [{ name: "Grace", email: "bad" }, 400, "Email is invalid"],
          [{ name: "Grace", email }, 409, "Email is already used"],
        ]) {
          assert.deepEqual(await request(port, "POST", "/users", body), {
            status,
            value: { message },
          });
        }
        assert.deepEqual(
          await request(port, "PATCH", "/users/999999", { name: "" }),
          { status: 404, value: { message: "User not found" } },
        );
        assert.deepEqual(
          await request(port, "PATCH", `/users/${user.id}`, { email: "bad" }),
          { status: 400, value: { message: "Email is invalid" } },
        );
        assert.deepEqual(
          await request(port, "PATCH", `/users/${user.id}`, { name: " " }),
          { status: 400, value: { message: "Name is empty" } },
        );
        assert.deepEqual(
          await request(port, "PATCH", `/users/${user.id}`, {
            email: keeper.email,
          }),
          { status: 409, value: { message: "Email is already used" } },
        );
        assert.deepEqual(await queries.findAll(), beforeErrors);
        const updated = await request(port, "PATCH", `/users/${user.id}`, {
          name: " Ada Lovelace ",
        });
        assert.equal(updated.status, 200);
        assert.deepEqual(Object.keys(updated.value), fields);
        assert.equal(updated.value.name, "Ada Lovelace");
        assert.equal(updated.value.email, user.email);
        assert.equal(updated.value.createdAt, user.createdAt);
        const other = port === 3002 ? 3001 : 3002;
        assert.deepEqual(
          await request(other, "GET", `/users/${user.id}`),
          updated,
        );
        const updatedEmail = await request(
          other,
          "PATCH",
          `/users/${user.id}`,
          { email: ` NEXT-${port}@EXAMPLE.TEST ` },
        );
        assert.equal(updatedEmail.status, 200);
        assert.equal(updatedEmail.value.name, updated.value.name);
        assert.equal(updatedEmail.value.email, `next-${port}@example.test`);
        assert.equal(updatedEmail.value.createdAt, user.createdAt);
        assert.deepEqual(
          await request(port, "GET", `/users/${user.id}`),
          updatedEmail,
        );
        assert.deepEqual(await request(other, "DELETE", `/users/${user.id}`), {
          status: 204,
          value: undefined,
        });
        assert.deepEqual(await request(port, "GET", `/users/${user.id}`), {
          status: 404,
          value: { message: "User not found" },
        });
        assert.deepEqual(await queries.findAll(), [keeper]);
      }

      await stop(dataServer);
      dataServer = undefined;
      for (const port of ports) {
        for (const [method, path, body, message] of [
          ["GET", "/users", undefined, "Could not list the users"],
          ["GET", "/users/1", undefined, "Could not find the user"],
          [
            "GET",
            "/users/gender-count",
            undefined,
            "Could not classify the users",
          ],
          [
            "POST",
            "/users",
            { name: "Ada", email: "ada@example.test" },
            "Could not create the user",
          ],
          ["PATCH", "/users/1", { name: "Ada" }, "Could not update the user"],
          ["DELETE", "/users/1", undefined, "Could not delete the user"],
        ]) {
          assert.deepEqual(await request(port, method, path, body), {
            status: 500,
            value: { message },
          });
        }
      }
    } finally {
      for (const client of clients.reverse()) {
        await stop(client);
      }
      if (dataServer) {
        await stop(dataServer);
      }
      await rm(folder, { recursive: true, force: true });
    }
  },
);
