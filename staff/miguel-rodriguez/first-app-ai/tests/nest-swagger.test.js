import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import {
  cp,
  mkdtemp,
  readFile,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as wait } from "node:timers/promises";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const ORIGIN = "http://127.0.0.1:23903";

test(
  "Nest serves Swagger with the existing CRUD inputs and statuses",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "nest-swagger-"));
    let server;
    try {
      await cp(join(ROOT, "dist"), join(folder, "dist"), {
        recursive: true,
        filter: (path) => !path.includes(".sqlite"),
      });
      await writeFile(join(folder, "package.json"), '{"type":"module"}');
      await symlink(join(ROOT, "node_modules"), join(folder, "node_modules"));
      const mainPath = join(folder, "dist/clients/nest/main.js");
      const main = await readFile(mainPath, "utf8");
      await writeFile(
        mainPath,
        main.replace("const PORT = 3003;", "const PORT = 23903;"),
      );
      server = spawn(process.execPath, [mainPath], {
        cwd: folder,
        stdio: "ignore",
      });
      let page;
      for (let attempt = 0; attempt < 100; attempt++) {
        try {
          page = await fetch(ORIGIN);
          break;
        } catch {
          await wait(50);
        }
      }
      assert.ok(page, "Nest must start");
      assert.equal(page.status, 200);
      assert.match(await page.text(), /Swagger UI/);
      const css = await fetch(`${ORIGIN}/swagger-ui.css`);
      assert.equal(css.status, 200);
      assert.match(css.headers.get("content-type"), /text\/css/);
      const init = await fetch(`${ORIGIN}/swagger-ui-init.js`);
      assert.equal(init.status, 200);
      const documentResponse = await fetch(`${ORIGIN}/-json`);
      assert.equal(documentResponse.status, 200);
      const document = await documentResponse.json();
      assert.equal(document.info.title, "First app");
      assert.equal(document.info.version, "1.0.0");
      assert.deepEqual(Object.keys(document.paths).sort(), [
        "/users",
        "/users/{id}",
      ]);
      assert.deepEqual(Object.keys(document.paths["/users"]).sort(), [
        "get",
        "post",
      ]);
      const byId = document.paths["/users/{id}"];
      assert.deepEqual(Object.keys(byId).sort(), ["delete", "get", "patch"]);
      const create = document.paths["/users"].post;
      const createSchema =
        create.requestBody.content["application/json"].schema;
      assert.equal(create.requestBody.required, true);
      assert.deepEqual(createSchema.required, ["name", "email"]);
      assert.equal(createSchema.properties.name.type, "string");
      assert.equal(createSchema.properties.email.type, "string");
      const update = byId.patch.requestBody.content["application/json"].schema;
      assert.deepEqual(update.required ?? [], []);
      assert.deepEqual(Object.keys(update.properties).sort(), [
        "email",
        "name",
      ]);
      for (const operation of Object.values(byId)) {
        const parameter = operation.parameters.find(
          (value) => value.name === "id",
        );
        assert.equal(parameter.in, "path");
        assert.equal(parameter.required, true);
      }
      assert.ok(create.responses["201"]);
      assert.ok(document.paths["/users"].get.responses["200"]);
      assert.ok(byId.get.responses["200"]);
      assert.ok(byId.patch.responses["200"]);
      assert.ok(byId.delete.responses["204"]);
      assert.equal(byId.delete.responses["204"].content, undefined);
      const unknown = await fetch(`${ORIGIN}/unknown`);
      assert.equal(unknown.status, 404);
      assert.equal(await unknown.text(), "");
    } finally {
      if (server && server.exitCode === null) {
        const stopped = once(server, "exit");
        server.kill();
        await stopped;
      }
      await rm(folder, { recursive: true, force: true });
    }
  },
);
