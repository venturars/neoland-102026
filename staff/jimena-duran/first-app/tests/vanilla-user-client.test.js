import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, cp, readFile, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SEED = `
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
const db = new DatabaseSync("src/db/users.sqlite");
db.exec(readFileSync("src/queries/queries/create-users-table.sql", "utf8"));
const insert = db.prepare("INSERT INTO users (id,name,email) VALUES (?,?,?)");
insert.run(2,"Berta","berta@example.test");
insert.run(1,"Ada","ada@example.test");
db.close();
`;

async function createFixture() {
  const directory = await mkdtemp(join(tmpdir(), "first-app-757-"));
  await cp(join(ROOT, "src"), join(directory, "src"), {
    recursive: true,
    filter: (source) => !/users\.sqlite(?:$|-)/.test(source),
  });
  await writeFile(join(directory, "package.json"), '{"type":"module"}');
  const seeded = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", SEED],
    { cwd: directory, encoding: "utf8" },
  );
  assert.equal(seeded.status, 0, seeded.stderr);
  return directory;
}

async function startFixture(directory) {
  const moduleUrl = pathToFileURL(
    join(directory, "src/clients/http/create-user-client-server.js"),
  );
  const { createUserClientServer } = await import(moduleUrl.href);
  const server = createUserClientServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return server;
}

test("transport uses disposable data and preserves the other user", async (t) => {
  const directory = await createFixture();
  const server = await startFixture(directory);
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  );
  const base = `http://127.0.0.1:${server.address().port}`;
  async function check(path, options, status, expected) {
    const response = await fetch(base + path, options);
    assert.equal(response.status, status);
    const body = await response.text();
    if (typeof expected === "string") {
      assert.equal(body, expected);
    } else {
      assert.deepEqual(JSON.parse(body), expected);
    }
  }
  const response = await fetch(base + "/api/users");
  const users = await response.json();
  assert.deepEqual(
    users.map((user) => user.id),
    [1, 2],
  );
  await check("/api/users/1", {}, 200, users[0]);
  await check("/api/users/999", {}, 404, "User not found");
  for (const id of ["bad", "0", "-1", "1.5", "9007199254740992"]) {
    await check(`/api/users/${id}`, {}, 404, "User not found");
  }
  const patch = (body) => ({ method: "PATCH", body: JSON.stringify(body) });
  for (const body of [
    null,
    [],
    "text",
    { name: 7 },
    { email: false },
    { id: 1 },
  ]) {
    await check("/api/users/1", patch(body), 400, "Could not update the user");
  }
  await check(
    "/api/users/1",
    { method: "PATCH", body: "{" },
    400,
    "Could not update the user",
  );
  await check("/api/users/1", patch({ name: "  " }), 400, "Name is empty");
  await check(
    "/api/users/1",
    patch({ email: "invalid" }),
    400,
    "Email is invalid",
  );
  await check(
    "/api/users/1",
    patch({ email: " BERTA@EXAMPLE.TEST " }),
    409,
    "Email is already used",
  );
  await check(
    "/api/users/999",
    patch({ name: "Absent" }),
    404,
    "User not found",
  );
  const saved = await fetch(
    base + "/api/users/1",
    patch({ name: " Ada edited ", email: " ADA2@EXAMPLE.TEST " }),
  );
  assert.equal(saved.status, 200);
  const updated = await saved.json();
  assert.equal(updated.id, 1);
  assert.equal(updated.name, "Ada edited");
  assert.equal(updated.email, "ada2@example.test");
  assert.deepEqual(Object.keys(updated).sort(), [
    "createdAt",
    "email",
    "id",
    "name",
    "updatedAt",
  ]);
  await check("/api/users/2", {}, 200, users[1]);
  for (const asset of ["/", "/styles.css", "/app.js"]) {
    const staticResponse = await fetch(base + asset);
    assert.equal(staticResponse.status, 200);
  }
  for (const path of [
    "/src/db/users.sqlite",
    "/src/logic/list-users.js",
    "/package.json",
    "/api/users/1/extra",
  ]) {
    await check(path, {}, 404, "");
  }
  await check("/api/users/1", { method: "POST" }, 404, "");
  await check("/api/users/999", { method: "DELETE" }, 404, "User not found");
  await check("/api/users/1", { method: "DELETE" }, 204, "");
  await check("/api/users/1", {}, 404, "User not found");
  await check("/api/users/2", {}, 200, users[1]);
  await check("/api/users/2", { method: "DELETE" }, 204, "");
  await check("/api/users", {}, 200, []);
});

test("operation failures expose only the catalog messages", async (t) => {
  const directory = await createFixture();
  const broken = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { DatabaseSync } from "node:sqlite";
    const db = new DatabaseSync("src/db/users.sqlite");
    db.exec("DROP TABLE users");
    db.close();
  `,
    ],
    { cwd: directory, encoding: "utf8" },
  );
  assert.equal(broken.status, 0, broken.stderr);
  const server = await startFixture(directory);
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, options, message] of [
    ["/api/users", {}, "Could not list the users"],
    ["/api/users/1", {}, "Could not find the user"],
    [
      "/api/users/1",
      { method: "PATCH", body: '{"name":"Ada"}' },
      "Could not update the user",
    ],
    ["/api/users/1", { method: "DELETE" }, "Could not delete the user"],
  ]) {
    const response = await fetch(base + path, options);
    assert.equal(response.status, 500);
    assert.equal(await response.text(), message);
  }
});

test("launcher refuses a missing database without creating it", async () => {
  const directory = await mkdtemp(join(tmpdir(), "first-app-757-no-db-"));
  await cp(
    join(ROOT, "src/clients/http"),
    join(directory, "src/clients/http"),
    { recursive: true },
  );
  await writeFile(join(directory, "package.json"), '{"type":"module"}');
  const launched = spawnSync(
    process.execPath,
    ["src/clients/http/start-user-client.js"],
    { cwd: directory, encoding: "utf8" },
  );
  assert.notEqual(launched.status, 0);
  assert.match(launched.stderr, /ENOENT/);
  await assert.rejects(access(join(directory, "src/db/users.sqlite")));
});

test("the four terminal clients still run against disposable users", async () => {
  for (const [client, expected] of [
    ["list-users", /Ada/],
    ["find-user-by-id", /Ada/],
    ["update-user", /Ada/],
    ["delete-user", /undefined/],
  ]) {
    const directory = await createFixture();
    const prepared = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
      import { DatabaseSync } from "node:sqlite";
      const db = new DatabaseSync("src/db/users.sqlite");
      db.prepare("INSERT INTO users(id,name,email) VALUES(?,?,?)").run(3,"Ada three","ada3@example.test");
      db.close();
    `,
      ],
      { cwd: directory, encoding: "utf8" },
    );
    assert.equal(prepared.status, 0, prepared.stderr);
    const text = await readFile(
      join(ROOT, `src/clients/terminal/${client}.txt`),
      "utf8",
    );
    const script = text.split("@'")[1].split("'@")[0];
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      { cwd: directory, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, expected);
  }
});
