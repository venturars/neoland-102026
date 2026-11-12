import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { runCache } from "../tools/github-cache.mjs";

const APP = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "workflow-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test("aliases expire and remain isolated by account, host and repository", async (t) => {
  const root = fixture(t);
  let time = 1000;
  const config = {
    root,
    host: "github.com",
    account: "owner",
    now: () => time,
    request: () => {
      throw new Error("unexpected network");
    },
  };
  await runCache(["alias", "set", "org/repo", "Jimena", "jiji-mena"], config);
  let result = await runCache(["alias", "get", "org/repo", "JIMENA"], config);
  assert.equal(result.reviewers[0].login, "jiji-mena");
  for (const override of [{ account: "someone" }, { host: "other.example" }]) {
    result = await runCache(["alias", "get", "org/repo", "Jimena"], {
      ...config,
      ...override,
    });
    assert.equal(result.reviewers[0].login, null);
  }
  result = await runCache(["alias", "get", "org/another", "Jimena"], config);
  assert.equal(result.reviewers[0].login, null);
  time += 48 * 60 * 60 * 1000;
  result = await runCache(["alias", "get", "org/repo", "Jimena"], config);
  assert.equal(result.reviewers[0].login, null);
});

test("aliases require explicit replacement and can be removed", async (t) => {
  const root = fixture(t);
  const config = {
    root,
    host: "github.com",
    account: "owner",
    request: async () => {},
  };
  await runCache(
    ["alias", "set", "org/repo", "Meghan", "meghanmartin995"],
    config,
  );
  await assert.rejects(
    runCache(["alias", "set", "org/repo", "Meghan", "another"], config),
    /replace/,
  );
  await runCache(
    ["alias", "set", "org/repo", "Meghan", "another", "--replace"],
    config,
  );
  await runCache(["alias", "remove", "org/repo", "Meghan"], config);
  const result = await runCache(["alias", "get", "org/repo", "Meghan"], config);
  assert.equal(result.reviewers[0].login, null);
});

test("directory pagination is cached; refresh uses ETags without persisting permissions", async (t) => {
  const root = fixture(t);
  const calls = [];
  const config = {
    root,
    host: "github.com",
    account: "owner",
    request: async (endpoint, etag) => {
      calls.push([endpoint, etag]);
      if (etag) return { status: 304, headers: {} };
      const first = endpoint.endsWith("page=1");
      return {
        status: 200,
        headers: {
          etag: first ? "one" : "two",
          link: first ? '<next>; rel="next"' : "",
        },
        body: [
          {
            login: first ? "jiji-mena" : "meghanmartin995",
            email: "unused@example.com",
            permissions: { push: true },
          },
        ],
      };
    },
  };
  const result = await runCache(["directory", "org/repo"], config);
  assert.equal(result.collaborators.length, 2);
  await runCache(["directory", "org/repo"], config);
  assert.equal(calls.length, 2);
  await runCache(["directory", "org/repo", "--refresh"], config);
  assert.equal(calls.length, 4);
  assert.equal(calls[2][1], "one");
  const stored = readFileSync(join(root, ".git-workflow-cache.json"), "utf8");
  assert.ok(!stored.includes("unused@example.com"));
  assert.ok(!stored.includes("permissions"));
});

test("profiles retain only public identity and failed refresh is reported", async (t) => {
  const root = fixture(t);
  let failed = false;
  const config = {
    root,
    host: "github.com",
    account: "owner",
    request: async () => {
      if (failed) return { status: 403, headers: {}, body: {} };
      return {
        status: 200,
        headers: { etag: "profile" },
        body: {
          login: "jiji-mena",
          name: "Jimena",
          email: "private@example.com",
        },
      };
    },
  };
  const result = await runCache(["profile", "org/repo", "jiji-mena"], config);
  assert.deepEqual(result.profile, { login: "jiji-mena", name: "Jimena" });
  failed = true;
  await assert.rejects(
    runCache(["profile", "org/repo", "jiji-mena", "--refresh"], config),
    /403/,
  );
});

function git(root, ...args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

test("knowledge branch, scoped commit and push preserve unrelated staged work", (t) => {
  const root = fixture(t);
  const repo = join(root, "repo");
  const remote = join(root, "remote.git");
  mkdirSync(repo);
  git(root, "init", "--bare", remote);
  git(repo, "init", "-b", "staging");
  git(repo, "config", "user.email", "test@example.com");
  git(repo, "config", "user.name", "Workflow Test");
  const relative = "staff/miguel-rodriguez/" + APP.split("/").at(-1);
  const copied = join(repo, relative);
  mkdirSync(copied, { recursive: true });
  cpSync(join(APP, "tools"), join(copied, "tools"), { recursive: true });
  writeFileSync(join(copied, "change.txt"), "before");
  writeFileSync(join(copied, "other.txt"), "before");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "test: seed");
  git(repo, "remote", "add", "origin", remote);
  git(repo, "push", "-u", "origin", "staging");
  const run = (tool, ...args) =>
    execFileSync("bash", [join(copied, "tools", tool), ...args], {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  run("create-branch-from-staging.sh", "42", "knowledge", "example");
  assert.equal(git(repo, "branch", "--show-current"), "42-knowledge-example");
  run("create-empty-commit.sh", "42");
  writeFileSync(join(copied, "change.txt"), "after");
  writeFileSync(join(copied, "other.txt"), "after");
  git(repo, "add", relative + "/other.txt");
  const message =
    "knowledge: explain the workflow\n\nDescribe the changed example.\n\nRefs #42";
  run("commit-changes.sh", message, relative + "/change.txt");
  assert.equal(
    git(repo, "show", "--pretty=", "--name-only", "HEAD"),
    relative + "/change.txt",
  );
  assert.equal(
    git(repo, "diff", "--cached", "--name-only"),
    relative + "/other.txt",
  );
  assert.match(git(repo, "log", "-1", "--format=%B"), /Refs #42/);
  assert.throws(() =>
    run("commit-changes.sh", "chore: reject directory", relative),
  );
  run("launch-push.sh");
  assert.equal(
    git(repo, "rev-parse", "HEAD"),
    git(remote, "rev-parse", "refs/heads/42-knowledge-example"),
  );
});

test("PR helper sends staging, draft, assignee and body file in one invocation", (t) => {
  const root = fixture(t);
  git(root, "init", "-b", "staging");
  const bin = join(root, "bin");
  mkdirSync(bin);
  const log = join(root, "gh-args.json");
  writeFileSync(
    join(bin, "gh"),
    "#!/usr/bin/env node\nrequire('fs').writeFileSync(process.env.WORKFLOW_TEST_LOG, JSON.stringify(process.argv.slice(2))); console.log('https://example.test/pr/1');\n",
    { mode: 0o755 },
  );
  const body = join(root, "body.md");
  writeFileSync(body, "Review body");
  execFileSync(
    "bash",
    [
      join(APP, "tools/create-pr-base-staging.sh"),
      "42-chore-example",
      "Example title",
      body,
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        PATH: bin + ":" + process.env.PATH,
        WORKFLOW_TEST_LOG: log,
      },
      encoding: "utf8",
    },
  );
  assert.deepEqual(JSON.parse(readFileSync(log, "utf8")), [
    "pr",
    "create",
    "--base",
    "staging",
    "--head",
    "42-chore-example",
    "--title",
    "Example title",
    "--body-file",
    body,
    "--draft",
    "--assignee",
    "@me",
  ]);
});
