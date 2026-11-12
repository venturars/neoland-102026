import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

const root = fileURLToPath(new URL("../", import.meta.url));
const origin = "http://127.0.0.1:3000";

test(
  "file client can query data but the database server does not serve files",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "first-app-file-test-"));
    let child;
    let exited;
    try {
      await cp(join(root, "src"), join(folder, "src"), {
        recursive: true,
        filter: (path) => !/\.sqlite(?:-|$)/.test(path),
      });
      await cp(join(root, "package.json"), join(folder, "package.json"));
      await symlink(
        join(root, "node_modules"),
        join(folder, "node_modules"),
        "dir",
      );
      child = spawn(process.execPath, [join(folder, "src/db/server.js")], {
        cwd: tmpdir(),
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stderr = "";
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      exited = once(child, "exit");
      await Promise.race([
        once(child.stdout, "data"),
        exited.then(() => {
          throw new Error(`Server did not start: ${stderr}`);
        }),
      ]);
      for (const path of [
        "/",
        "/clients/web/index.html",
        "/clients/web/styles.css",
        "/clients/web/main.js",
        "/logic/list-users.js",
        "/queries/users.js",
        "/queries/queries/find-all.js",
        "/db/users.sqlite",
        "/db/server.js",
        "/package.json",
      ]) {
        const response = await fetch(origin + path, { redirect: "manual" });
        assert.equal(response.status, 404, path);
        assert.equal(response.headers.get("location"), null);
      }
      const options = await fetch(origin + "/execute", {
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
      const query = await fetch(origin + "/execute", {
        method: "POST",
        headers: { Origin: "null", "content-type": "application/json" },
        body: JSON.stringify({
          method: "all",
          sql: "SELECT name FROM sqlite_master WHERE type = 'table'",
          params: {},
        }),
      });
      assert.equal(query.status, 200);
      assert.equal(query.headers.get("access-control-allow-origin"), "*");
      assert.deepEqual(await query.json(), { rows: [] });
    } finally {
      if (child && child.exitCode === null && child.signalCode === null)
        child.kill("SIGTERM");
      if (exited) await exited;
      await rm(folder, { recursive: true, force: true });
    }
  },
);
