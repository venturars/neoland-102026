import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { setImmediate } from "node:timers/promises";
import { pickRandomUser } from "../src/logic/pick-random-user.js";

const rows = [2, 8, 19].map((id) => ({
  id,
  name: "Ada",
  email: `ada${id}@example.test`,
  createdAt: "2026-11-09 10:00:00",
  updatedAt: "2026-11-09 10:00:00",
}));

test("positions, repetitions, fresh data, empty data and retrieval errors", async (t) => {
  let saved = globalThis.structuredClone(rows);
  let fail = false;
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    if (fail) throw new Error("Connection unavailable");
    return {
      ok: true,
      json: async () => ({ rows: globalThis.structuredClone(saved) }),
    };
  });
  const random = t.mock.method(Math, "random", () => 0);
  for (const [value, index] of [
    [0, 0],
    [0.5, 1],
    [0.999999, 2],
    [0.999999, 2],
  ]) {
    random.mock.mockImplementation(() => value);
    const result = await pickRandomUser();
    assert.deepEqual(result, rows[index]);
    assert.deepEqual(Object.keys(result), [
      "id",
      "name",
      "email",
      "createdAt",
      "updatedAt",
    ]);
    result.name = "Changed outside storage";
    assert.deepEqual(saved, rows);
  }
  assert.equal(requests, 4);
  saved = [rows[1]];
  assert.deepEqual(await pickRandomUser(), rows[1]);
  saved = [];
  assert.equal(await pickRandomUser(), null);
  fail = true;
  await assert.rejects(pickRandomUser(), { message: "Could not pick a user" });
});

test("web clears old results, prevents overlap and preserves editing identity", async () => {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector))
      elements.set(selector, {
        textContent: "",
        dataset: {},
        hidden: false,
        disabled: false,
        listeners: {},
        hasAttribute() {
          return false;
        },
        setAttribute() {},
        removeAttribute() {},
        getAttribute() {
          return `${selector.slice(1)}-error`;
        },
        replaceChildren() {},
        focus() {},
        querySelector() {
          return element("h2");
        },
        addEventListener(type, fn) {
          this.listeners[type] = fn;
        },
      });
    return elements.get(selector);
  }
  let calls = 0;
  let release;
  let next = () =>
    new Promise((resolve) => {
      release = resolve;
    });
  const context = vm.createContext({
    document: {
      querySelector: element,
      querySelectorAll: () => [...elements.values()],
      getElementById: (id) => element(`#${id}`),
    },
    listUsers: async () => [],
    pickRandomUser: () => {
      calls++;
      return next();
    },
  });
  const source = await readFile(
    new URL("../src/clients/web/main.js", import.meta.url),
    "utf8",
  );
  vm.runInContext(source.replace(/^import .*;\n/gm, ""), context);
  await setImmediate();
  vm.runInContext(
    'selectedUser = {id: 99, email: "editor@example.test"}',
    context,
  );
  const before = vm.runInContext("selectedUser", context);
  const result = element("#random-result");
  const button = element("#random-pick");
  result.textContent = "Previous winner";
  const pending = button.listeners.click();
  assert.equal(result.textContent, "");
  assert.equal(button.disabled, true);
  await button.listeners.click();
  assert.equal(calls, 1);
  release(rows[0]);
  await pending;
  assert.equal(result.textContent, "Ada · ID 2 · ada2@example.test");
  assert.equal(button.disabled, false);
  next = async () => null;
  await button.listeners.click();
  assert.equal(result.textContent, "No hay contactos guardados.");
  next = async () => {
    throw new Error("Could not pick a user");
  };
  result.textContent = "Previous winner";
  await button.listeners.click();
  assert.equal(
    result.textContent,
    "No se pudo elegir un contacto. Vuelve a intentarlo.",
  );
  assert.equal(vm.runInContext("selectedUser", context), before);
  assert.equal(button.disabled, false);
  const html = await readFile(
    new URL("../src/clients/web/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /id="random-pick"/);
  assert.match(html, /id="random-result" role="status" aria-live="polite"/);
});
