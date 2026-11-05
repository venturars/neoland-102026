import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import vm from "node:vm";

async function loadClient(client) {
  const filename = client === "electron" ? "app.js" : "popup.js";
  const folder = new URL(`../src/clients/${client}/`, import.meta.url);
  const html = await readFile(new URL("index.html", folder), "utf8");
  const source = await readFile(new URL(filename, folder), "utf8");
  const elements = new Map();

  function makeElement(tag, id = "", hidden = false) {
    let value = "";
    return {
      tagName: tag.toUpperCase(),
      id,
      hidden,
      disabled: false,
      dataset: {},
      textContent: "",
      children: [],
      listeners: {},
      get value() {
        return value;
      },
      set value(next) {
        value = String(next);
      },
      get options() {
        return this.children;
      },
      set innerHTML(_value) {
        throw new Error("Use textContent for contact data");
      },
      addEventListener(type, listener) {
        this.listeners[type] = listener;
      },
      replaceChildren() {
        this.children = [];
        this.value = "";
      },
      append(child) {
        child.parent = this;
        this.children.push(child);
      },
      remove() {
        this.parent.children = this.parent.children.filter(
          (child) => child !== this,
        );
      },
      focus() {},
      reset() {
        const prefix = id === "delete-form" ? "delete" : id.split("-")[0];
        const fields = prefix === "delete" ? ["email"] : ["name", "email"];
        for (const field of fields)
          elements.get(`#${prefix}-${field}`).value = "";
      },
    };
  }
  for (const match of html.matchAll(
    /<([a-z][a-z0-9-]*)\b[^>]*\bid="([^"]+)"[^>]*>/gi,
  )) {
    const hidden = /\bhidden\b/.test(match[0]);
    elements.set(`#${match[2]}`, makeElement(match[1], match[2], hidden));
  }
  function get(selector) {
    const element = elements.get(selector);
    assert.ok(element, `Missing HTML element ${selector}`);
    return element;
  }
  const document = {
    querySelector: get,
    querySelectorAll() {
      return [...elements.values()].filter((element) =>
        ["BUTTON", "INPUT", "SELECT"].includes(element.tagName),
      );
    },
    createElement: makeElement,
  };
  const state = {
    rows: [],
    calls: [],
    failLists: 0,
    writeError: null,
    waitForWrite: null,
    waitForList: null,
    beforeList: null,
  };
  async function call(operation, args = []) {
    state.calls.push(operation);
    if (operation === "list") {
      if (state.waitForList) await state.waitForList;
      if (state.failLists > 0) {
        state.failLists--;
        throw new Error("Could not list the users");
      }
      if (state.beforeList) {
        const change = state.beforeList;
        state.beforeList = null;
        change();
      }
      return state.rows.map((user) => ({ ...user }));
    }
    if (state.writeError) throw new Error(state.writeError);
    if (state.waitForWrite) await state.waitForWrite;
    if (operation === "create") {
      const user = {
        id: 1,
        ...args[0],
        createdAt: "2026-11-04 21:00:00",
        updatedAt: "2026-11-04 21:00:00",
      };
      state.rows.push(user);
      return { ...user };
    }
    if (operation === "update") {
      const user = state.rows.find((row) => row.id === args[0]);
      Object.assign(user, args[1], { updatedAt: "2026-11-04 21:01:00" });
      return { ...user };
    }
    if (operation === "delete") {
      state.rows = state.rows.filter((row) => row.id !== args[0]);
      return;
    }
    throw new Error(`Unexpected operation ${operation}`);
  }
  async function fetch(url, options) {
    const path = new URL(url).pathname;
    const method = options.method;
    const id = Number(path.split("/").at(-1));
    let operation = "list";
    let args = [];
    if (method === "POST") {
      operation = "create";
      args = [JSON.parse(options.body)];
    }
    if (method === "PATCH") {
      operation = "update";
      args = [id, JSON.parse(options.body)];
    }
    if (method === "DELETE") {
      operation = "delete";
      args = [id];
    }
    try {
      const value = await call(operation, args);
      return {
        ok: true,
        status: method === "DELETE" ? 204 : 200,
        json: async () => value,
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        json: async () => ({ message: error.message }),
      };
    }
  }
  const context = vm.createContext({
    document,
    createUser: (input) => call("create", [input]),
    listUsers: () => call("list"),
    findUserById: (id) => call("find", [id]),
    updateUser: (id, changes) => call("update", [id, changes]),
    deleteUser: (id) => call("delete", [id]),
    usersGenderCount: () => call("genderCount"),
    fetch,
  });
  vm.runInContext(source.replace(/^import .*;\n/gm, ""), context);
  async function idle() {
    for (let attempt = 0; attempt < 100; attempt++) {
      await setImmediate();
      if (!vm.runInContext("busy", context)) return;
    }
    throw new Error("Client operation did not settle");
  }
  function fire(selector, type = "click") {
    get(selector).listeners[type]({ preventDefault() {} });
  }
  async function act(selector, type = "click") {
    fire(selector, type);
    await idle();
  }
  async function create() {
    await act("#new-user");
    get("#create-name").value = "Ada";
    get("#create-email").value = "ada@example.test";
    await act("#create-form", "submit");
  }
  await idle();
  return { get, state, act, fire, idle, create };
}

for (const client of ["electron", "chrome"]) {
  test(`${client}: confirmed creation survives a failed list refresh`, async () => {
    const ui = await loadClient(client);
    ui.state.failLists = 1;
    await ui.create();
    assert.equal(ui.state.rows.length, 1);
    assert.equal(ui.get("#create-form").hidden, true);
    assert.equal(ui.get("#editor").hidden, false);
    assert.equal(ui.get("#users").value, "1");
    assert.equal(ui.get("#create-email").value, "");
    assert.match(ui.get("#message").textContent, /^Contacto creado.*lista/);
    assert.equal(ui.get("#message").dataset.error, "false");
    assert.equal(ui.get("#created-at").textContent, ui.state.rows[0].createdAt);
    assert.equal(ui.get("#updated-at").textContent, ui.state.rows[0].updatedAt);
    await ui.act("#refresh");
    assert.equal(ui.get("#editor").hidden, true);
    assert.equal(ui.state.calls.filter((call) => call === "create").length, 1);
  });

  test(`${client}: confirmed contact is visible while its optional reload is still pending`, async () => {
    const ui = await loadClient(client);
    let release;
    ui.state.waitForList = new Promise((resolve) => {
      release = resolve;
    });
    await ui.act("#new-user");
    ui.get("#create-name").value = "Ada";
    ui.get("#create-email").value = "ada@example.test";
    ui.fire("#create-form", "submit");
    await setImmediate();
    try {
      assert.equal(ui.state.rows.length, 1);
      assert.equal(ui.get("#editor").hidden, false);
      assert.equal(ui.get("#create-form").hidden, true);
      assert.equal(
        ui.get("#created-at").textContent,
        ui.state.rows[0].createdAt,
      );
      assert.equal(ui.get("#message").textContent, "Contacto creado");
    } finally {
      release();
      await ui.idle();
    }
  });

  test(`${client}: confirmed email edit remains the deletion confirmation after refresh fails`, async () => {
    const ui = await loadClient(client);
    await ui.create();
    ui.state.failLists = 1;
    ui.get("#edit-email").value = "new@example.test";
    await ui.act("#edit-form", "submit");
    assert.equal(ui.state.rows[0].email, "new@example.test");
    assert.equal(ui.get("#user-email").textContent, "new@example.test");
    assert.match(ui.get("#message").textContent, /^Contacto guardado.*lista/);
    assert.equal(ui.get("#created-at").textContent, "2026-11-04 21:00:00");
    assert.equal(ui.get("#updated-at").textContent, "2026-11-04 21:01:00");
    ui.get("#delete-email").value = "ada@example.test";
    await ui.act("#delete-form", "submit");
    assert.equal(ui.state.rows.length, 1);
    assert.match(ui.get("#message").textContent, /email no coincide/);
    ui.get("#delete-email").value = " NEW@EXAMPLE.TEST ";
    await ui.act("#delete-form", "submit");
    assert.equal(ui.state.rows.length, 0);
    assert.equal(ui.get("#editor").hidden, true);
  });

  test(`${client}: confirmed deletion clears its editor even when refresh fails`, async () => {
    const ui = await loadClient(client);
    await ui.create();
    ui.state.failLists = 1;
    ui.get("#delete-email").value = "ada@example.test";
    await ui.act("#delete-form", "submit");
    assert.equal(ui.state.rows.length, 0);
    assert.equal(ui.get("#editor").hidden, true);
    assert.equal(ui.get("#users").value, "");
    assert.equal(
      ui.get("#users").options.some((option) => option.value === "1"),
      false,
    );
    assert.equal(ui.get("#delete-email").value, "");
    assert.equal(ui.get("#created-at").textContent, "");
    assert.equal(ui.get("#updated-at").textContent, "");
    assert.match(ui.get("#message").textContent, /^Contacto eliminado.*lista/);
    await ui.act("#refresh");
    assert.equal(ui.state.calls.filter((call) => call === "delete").length, 1);
  });

  test(`${client}: successful reload uses another client's newer email and timestamps`, async () => {
    const ui = await loadClient(client);
    await ui.create();
    ui.get("#edit-email").value = "saved@example.test";
    ui.state.beforeList = () => {
      ui.state.rows[0].email = "newer@example.test";
      ui.state.rows[0].updatedAt = "2026-11-04 21:02:00";
    };
    await ui.act("#edit-form", "submit");
    assert.equal(ui.get("#user-email").textContent, "newer@example.test");
    assert.equal(ui.get("#updated-at").textContent, "2026-11-04 21:02:00");
    ui.get("#delete-email").value = "saved@example.test";
    await ui.act("#delete-form", "submit");
    assert.equal(ui.state.rows.length, 1);
    assert.match(ui.get("#message").textContent, /email no coincide/);
    ui.get("#delete-email").value = "newer@example.test";
    await ui.act("#delete-form", "submit");
    assert.equal(ui.state.rows.length, 0);
  });

  test(`${client}: a successful reload does not restore a concurrently deleted contact`, async () => {
    const ui = await loadClient(client);
    ui.state.beforeList = () => {
      ui.state.rows = [];
    };
    await ui.create();
    assert.equal(ui.state.rows.length, 0);
    assert.equal(ui.get("#editor").hidden, true);
    assert.equal(ui.get("#users").value, "");
    assert.equal(
      ui.get("#users").options.some((option) => option.value === "1"),
      false,
    );
    assert.equal(ui.state.calls.filter((call) => call === "create").length, 1);
  });

  test(`${client}: rejected writes retain entered values and never announce success`, async () => {
    const ui = await loadClient(client);
    ui.state.writeError = "Email is invalid";
    await ui.create();
    assert.equal(ui.state.rows.length, 0);
    assert.equal(ui.get("#create-form").hidden, false);
    assert.equal(ui.get("#create-email").value, "ada@example.test");
    assert.equal(ui.get("#message").textContent, "Email is invalid");
    assert.equal(ui.get("#message").dataset.error, "true");
  });

  test(`${client}: overlapping submissions cannot repeat a pending write`, async () => {
    const ui = await loadClient(client);
    let release;
    ui.state.waitForWrite = new Promise((resolve) => {
      release = resolve;
    });
    await ui.act("#new-user");
    ui.get("#create-name").value = "Ada";
    ui.get("#create-email").value = "ada@example.test";
    ui.fire("#create-form", "submit");
    ui.fire("#create-form", "submit");
    await setImmediate();
    assert.equal(ui.state.calls.filter((call) => call === "create").length, 1);
    assert.equal(ui.get("#new-user").disabled, true);
    release();
    await ui.idle();
    assert.equal(ui.state.rows.length, 1);
    assert.equal(ui.get("#new-user").disabled, false);
  });
}

for (const client of ["electron", "chrome"]) {
  test(`${client}: editing a name preserves a newer stored email`, async () => {
    const ui = await loadClient(client);
    await ui.create();
    ui.state.rows[0].email = "changed-elsewhere@example.test";
    ui.get("#edit-name").value = "Ada Lovelace";
    await ui.act("#edit-form", "submit");
    assert.equal(ui.state.rows[0].name, "Ada Lovelace");
    assert.equal(ui.state.rows[0].email, "changed-elsewhere@example.test");
    assert.equal(ui.get("#user-email").textContent, ui.state.rows[0].email);
    assert.equal(ui.get("#edit-email").value, "");
  });
  test(`${client}: list labels show the expected contact fields`, async () => {
    const ui = await loadClient(client);
    await ui.create();
    const label = ui.get("#users").options[1].textContent;
    const user = ui.state.rows[0];
    for (const field of ["id", "name", "email"]) {
      assert.ok(label.includes(String(user[field])));
    }
    if (client === "chrome") {
      assert.ok(label.includes(user.createdAt));
      assert.ok(label.includes(user.updatedAt));
    }
  });
}
