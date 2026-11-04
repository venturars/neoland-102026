import { setImmediate } from "node:timers";
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import Module from "node:module";

const require = createRequire(import.meta.url);
const originalLoad = Module._load;
Module._load = function (request, ...args) {
  if (request === "vscode") return {};
  return originalLoad.call(this, request, ...args);
};
const { execute } = require("../src/clients/vscode/extension.cjs");
Module._load = originalLoad;

test("rejects unsupported actions and malformed inputs before accessing data", async () => {
  await assert.rejects(execute({ action: "unknown" }), /Unknown action/);
  await assert.rejects(execute({ action: "id", id: Number.MAX_SAFE_INTEGER + 1 }), /Invalid ID/);
  await assert.rejects(execute({ action: "id", id: "1" }), /Invalid ID/);
  await assert.rejects(execute({ action: "create", name: null, email: "x" }), /Invalid input/);
  await assert.rejects(execute({ action: "delete", id: 1 }), /Confirm the saved email/);
});

test("adapter uses shared user operations for CRUD, search, and confirmations", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email VARCHAR(64) NOT NULL UNIQUE, createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')), updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))) ");
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    const { method, sql, params } = JSON.parse(options.body);
    const statement = db.prepare(sql);
    let result;
    if (method === "get") result = { row: statement.get(params) ?? null };
    else if (method === "all") result = { rows: statement.all(params) };
    else if (method === "run") result = statement.run(params);
    else throw new Error(`Unexpected method ${method}`);
    return { ok: true, json: async () => result };
  };
  try {
    assert.deepEqual(await execute({ action: "list" }), []);
    const ana = await execute({ action: "create", name: " Ana ", email: " ANA@EXAMPLE.COM " });
    assert.equal(ana.name, "Ana");
    assert.equal(ana.email, "ana@example.com");
    const other = await execute({ action: "create", name: "ana", email: "other@example.com" });
    assert.deepEqual((await execute({ action: "name", name: "Ana" })).map((u) => u.id), [ana.id]);
    assert.deepEqual(await execute({ action: "name", name: "ANA" }), []);
    assert.equal((await execute({ action: "email", email: " ANA@EXAMPLE.COM " })).id, ana.id);
    assert.equal((await execute({ action: "id", id: ana.id })).id, ana.id);
    await assert.rejects(execute({ action: "id", id: 999 }), /User not found/);
    await assert.rejects(execute({ action: "create", name: "", email: "x@y" }), /Name is empty/);
    await assert.rejects(execute({ action: "create", name: "X", email: "bad" }), /Email is invalid/);
    await assert.rejects(execute({ action: "create", name: "X", email: "ana@example.com" }), /Email is already used/);
    await assert.rejects(execute({ action: "update", id: ana.id, name: "Ana", email: other.email }), /Email is already used/);
    const updated = await execute({ action: "update", id: ana.id, name: "Anita", email: ana.email });
    assert.equal(updated.name, "Anita");
    await assert.rejects(execute({ action: "delete", id: ana.id, confirmation: "incorrect" }), /Email does not match/);
    assert.equal((await execute({ action: "list" })).length, 2);
    await execute({ action: "delete", id: ana.id, confirmation: " ANA@EXAMPLE.COM " });
    assert.deepEqual((await execute({ action: "list" })).map((u) => u.id), [other.id]);
    await assert.rejects(execute({ action: "delete", id: ana.id, confirmation: ana.email }), /User not found/);
    globalThis.fetch = async () => { throw new Error("offline"); };
    await assert.rejects(execute({ action: "list" }), /Could not list the users/);
  } finally {
    globalThis.fetch = originalFetch;
    db.close();
  }
});

test("a late initial refresh cannot overwrite a newer search", async () => {
  const { readFile } = await import("node:fs/promises");
  const vm = await import("node:vm");
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: "", textContent: "", hidden: false, children: [], handlers: {},
      addEventListener(type, fn) { this.handlers[type] = fn; },
      replaceChildren() { this.children = []; },
      append(...items) { this.children.push(...items); },
      setAttribute() {}, focus() {}, reset() {},
    });
    return elements.get(id);
  }
  const messages = [];
  let receive;
  const context = {
    acquireVsCodeApi: () => ({ postMessage: (message) => messages.push(message) }),
    document: { getElementById: element, createElement: () => element(Symbol()) },
    window: { addEventListener: (_type, fn) => { receive = fn; } },
  };
  vm.runInNewContext(await readFile(new URL("../src/clients/vscode/panel.js", import.meta.url), "utf8"), context);
  const initial = messages[0];
  element("search-type").value = "name";
  element("search-value").value = "Ana";
  const search = element("search").handlers.submit({ preventDefault() {} });
  const request = messages[1];
  receive({ data: { request: request.request, value: [{ id: 1, name: "Ana", email: "ana@example.com" }] } });
  await search;
  receive({ data: { request: initial.request, value: [] } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(element("users").children.length, 1);
  assert.equal(element("users").children[0].children[0].textContent, "1: Ana — ana@example.com");

  const refresh = element("refresh").handlers.click();
  const staleRefresh = messages.at(-1);
  element("search-type").value = "id";
  element("search-value").value = "not-an-id";
  await element("search").handlers.submit({ preventDefault() {} });
  assert.equal(element("status").textContent, "Enter a safe integer ID.");
  receive({ data: { request: staleRefresh.request, error: "offline" } });
  await refresh;
  assert.equal(element("status").textContent, "Enter a safe integer ID.");
  assert.equal(element("users").children.length, 1);

  element("search-type").value = "name";
  element("search-value").value = "old";
  const oldSearch = element("search").handlers.submit({ preventDefault() {} });
  const oldRequest = messages.at(-1);
  const newerRefresh = element("refresh").handlers.click();
  const newerRequest = messages.at(-1);
  receive({ data: { request: newerRequest.request, value: [] } });
  await newerRefresh;
  receive({ data: { request: oldRequest.request, error: "offline" } });
  await oldSearch;
  assert.equal(element("status").textContent, "");
  assert.equal(element("users").children.length, 0);

  element("name").value = "New User";
  element("email").value = "new@example.com";
  const create = element("user-form").handlers.submit({ preventDefault() {} });
  const createRequest = messages.at(-1);
  assert.equal(createRequest.action, "create");
  receive({ data: { request: createRequest.request, value: { id: 2 } } });
  await new Promise((resolve) => setImmediate(resolve));
  const listRequest = messages.at(-1);
  assert.equal(listRequest.action, "list");
  receive({ data: { request: listRequest.request, error: "offline" } });
  await create;
  assert.equal(element("status").textContent, "User created. Could not refresh users: offline");
  assert.equal(messages.filter((message) => message.action === "create").length, 1);
  const retry = element("refresh").handlers.click();
  const retryRequest = messages.at(-1);
  assert.equal(retryRequest.action, "list");
  receive({ data: { request: retryRequest.request, value: [{ id: 2, name: "New User", email: "new@example.com" }] } });
  await retry;
  assert.equal(element("users").children[0].children[0].textContent, "2: New User — new@example.com");
  assert.equal(messages.filter((message) => message.action === "create").length, 1);
});
