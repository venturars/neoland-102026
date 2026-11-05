import "reflect-metadata";
import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import {
  cp,
  mkdtemp,
  readdir,
  readFile,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as wait } from "node:timers/promises";
import { NestFactory, APP_FILTER } from "@nestjs/core";
import { UsersController } from "../dist/clients/nest/users.controller.js";
import { UsersService } from "../dist/clients/nest/users.service.js";
import { HttpExceptionFilter } from "../dist/clients/nest/http-exception.filter.js";

const root = fileURLToPath(new URL("../", import.meta.url));
async function request(base, method, path, body) {
  const response = await fetch(base + path, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  return {
    status: response.status,
    value: text ? JSON.parse(text) : undefined,
  };
}
async function rewrite(folder) {
  for (const file of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, file.name);
    if (file.isDirectory()) {
      await rewrite(path);
    } else if (
      path.endsWith(join("db", "server.js")) ||
      path.endsWith(join("queries", "users.js"))
    ) {
      const text = await readFile(path, "utf8");
      const configured = text.replace(
        /http:\/\/127\.0\.0\.1:\d+/g,
        "http://127.0.0.1:23010",
      );
      await writeFile(
        path,
        configured.replace(/server\.listen\(\d+,/, "server.listen(23010,"),
      );
    }
  }
}
test(
  "compiled Nest CRUD shares records and preserves omitted fields and errors",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "nest-client-"));
    let data;
    let app;
    try {
      await cp(join(root, "dist"), join(folder, "dist"), {
        recursive: true,
        filter: (path) => !path.endsWith(".sqlite"),
      });
      await writeFile(join(folder, "package.json"), '{"type":"module"}');
      await symlink(join(root, "node_modules"), join(folder, "node_modules"));
      await rewrite(join(folder, "dist"));
      data = spawn(process.execPath, ["dist/db/server.js"], {
        cwd: folder,
        stdio: "ignore",
      });
      for (let i = 0; i < 100; i++) {
        try {
          await fetch("http://127.0.0.1:23010/");
          break;
        } catch {
          await wait(50);
        }
      }
      const queries = await import(
        pathToFileURL(join(folder, "dist/queries/users.js")).href
      );
      const { AppModule } = await import(
        pathToFileURL(join(folder, "dist/clients/nest/app.module.js")).href
      );
      app = await NestFactory.create(AppModule, { logger: false });
      await app.listen(0, "127.0.0.1");
      const base = await app.getUrl();
      assert.deepEqual(await request(base, "GET", "/users"), {
        status: 500,
        value: { message: "Could not list the users" },
      });
      await queries.createUsersTable();
      assert.deepEqual(await request(base, "GET", "/users"), {
        status: 200,
        value: [],
      });
      const created = await request(base, "POST", "/users", {
        name: " Ada ",
        email: "ADA@example.test",
      });
      assert.equal(created.status, 201);
      const user = created.value;
      assert.deepEqual(
        Object.keys(user).sort(),
        ["id", "name", "email", "createdAt", "updatedAt"].sort(),
      );
      const other = await request(base, "POST", "/users", {
        name: "Grace",
        email: "grace@example.test",
      });
      assert.deepEqual(
        (await request(base, "GET", `/users/${user.id}`)).value,
        user,
      );
      const updated = await request(base, "PATCH", `/users/${user.id}`, {
        name: "Ada Lovelace",
      });
      assert.equal(updated.value.email, user.email);
      assert.equal(updated.value.createdAt, user.createdAt);
      assert.equal(updated.value.id, user.id);
      const renamed = await request(base, "PATCH", `/users/${user.id}`, {
        email: "new@example.test",
      });
      assert.equal(renamed.value.name, "Ada Lovelace");
      for (const [body, status, message] of [
        [{ name: "" }, 400, "Name is empty"],
        [{ email: "bad" }, 400, "Email is invalid"],
        [{ email: "grace@example.test" }, 409, "Email is already used"],
      ]) {
        assert.deepEqual(
          await request(base, "PATCH", `/users/${user.id}`, body),
          { status, value: { message } },
        );
      }
      assert.deepEqual(
        (await request(base, "GET", `/users/${other.value.id}`)).value,
        other.value,
      );
      assert.deepEqual(
        (await request(base, "GET", "/users")).value.map((row) => row.id),
        [user.id, other.value.id],
      );
      assert.deepEqual(await request(base, "DELETE", `/users/${user.id}`), {
        status: 204,
        value: undefined,
      });
      assert.deepEqual(await request(base, "GET", `/users/${user.id}`), {
        status: 404,
        value: { message: "User not found" },
      });
      assert.deepEqual(await request(base, "GET", "/unknown"), {
        status: 404,
        value: undefined,
      });
      assert.deepEqual(await queries.findAll(), [other.value]);
      data.kill();
      await new Promise((resolve) => data.once("exit", resolve));
      data = undefined;
      for (const [method, path, body, message] of [
        [
          "POST",
          "/users",
          { name: "Ada", email: "ada@example.test" },
          "Could not create the user",
        ],
        ["GET", "/users", undefined, "Could not list the users"],
        ["GET", "/users/1", undefined, "Could not find the user"],
        ["PATCH", "/users/1", { name: "Ada" }, "Could not update the user"],
        ["DELETE", "/users/1", undefined, "Could not delete the user"],
      ]) {
        assert.deepEqual(await request(base, method, path, body), {
          status: 500,
          value: { message },
        });
      }
    } finally {
      await app?.close();
      data?.kill();
      await wait(100);
      await rm(folder, { recursive: true, force: true });
    }
  },
);

test("Nest injects its registered provider and filters unknown thrown values", async () => {
  let receivedId;
  const provider = {
    find(id) {
      receivedId = id;
      return { id, name: "Injected" };
    },
    list() {
      throw new Error("toString");
    },
    create() {
      throw "secret";
    },
    update() {
      throw new Error("unknown");
    },
    remove() {
      throw null;
    },
  };
  class TestModule {}
  const app = await NestFactory.create(
    {
      module: TestModule,
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: provider },
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
      ],
    },
    { logger: false },
  );
  try {
    await app.listen(0, "127.0.0.1");
    const base = await app.getUrl();
    assert.deepEqual(await request(base, "GET", "/users/7"), {
      status: 200,
      value: { id: 7, name: "Injected" },
    });
    assert.equal(receivedId, 7);
    for (const [method, path, body, message] of [
      ["GET", "/users", undefined, "Could not list the users"],
      ["POST", "/users", {}, "Could not create the user"],
      ["PATCH", "/users/1", {}, "Could not update the user"],
      ["DELETE", "/users/1", undefined, "Could not delete the user"],
    ]) {
      assert.deepEqual(await request(base, method, path, body), {
        status: 500,
        value: { message },
      });
    }
  } finally {
    await app.close();
  }
});
