import assert from "node:assert/strict";
import { test } from "node:test";
import { spawn } from "node:child_process";
import { cp, mkdtemp, rm, symlink, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

const root = fileURLToPath(new URL("../", import.meta.url));
const origin = "http://127.0.0.1:3000";

test(
  "web files and browser imports are served without exposing project data",
  { timeout: 30000 },
  async () => {
    const folder = await mkdtemp(join(tmpdir(), "first-app-web-test-"));
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
      const home = await fetch(origin, { redirect: "manual" });
      assert.equal(home.status, 302);
      assert.equal(home.headers.get("location"), "/clients/web/index.html");
      for (const [path, type] of [
        ["/clients/web/index.html", "text/html"],
        ["/clients/web/styles.css", "text/css"],
        ["/clients/web/main.js", "text/javascript"],
        ...["list-users", "find-user-by-id", "update-user", "delete-user"].map(
          (name) => [`/logic/${name}.js`, "text/javascript"],
        ),
        ["/queries/users.js", "text/javascript"],
        ...[
          "create-users-table",
          "find-all",
          "find-by-email",
          "find-by-id",
          "find-by-name",
          "insert",
          "update",
          "remove",
          "list-tables",
        ].map((name) => [`/queries/queries/${name}.js`, "text/javascript"]),
      ]) {
        const response = await fetch(origin + path);
        assert.equal(response.status, 200, path);
        assert.ok(response.headers.get("content-type").startsWith(type), path);
        assert.ok((await response.text()).length > 0);
      }
      for (const path of [
        "/db/users.sqlite",
        "/db/server.js",
        "/package.json",
        "/AGENTS.md",
        "/logic/users-gender-count.js",
        "/clients/web/../../db/users.sqlite",
        "/clients/web/%2e%2e/%2e%2e/db/users.sqlite",
      ]) {
        assert.equal((await fetch(origin + path)).status, 404, path);
      }
      const uninitialized = await fetch(origin + "/execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          method: "all",
          sql: "SELECT * FROM users",
          params: {},
        }),
      });
      assert.equal(uninitialized.status, 500);
      const main = join(folder, "src/clients/web/main.js");
      await rename(main, main + ".missing");
      const missing = await fetch(origin + "/clients/web/main.js");
      assert.equal(missing.status, 500);
      assert.deepEqual(await missing.json(), {
        error: "Could not load the file",
      });
      await rename(main + ".missing", main);
      assert.equal((await fetch(origin + "/clients/web/main.js")).status, 200);
    } finally {
      if (child && child.exitCode === null && child.signalCode === null)
        child.kill("SIGTERM");
      if (exited) await exited;
      await rm(folder, { recursive: true, force: true });
    }
  },
);
