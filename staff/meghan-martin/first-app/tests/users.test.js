import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { before, beforeEach, test } from "node:test";

const dir = mkdtempSync(join(tmpdir(), "first-app-"));
process.env.USERS_DB_PATH = join(dir, "users.sqlite");

const { db } = await import("../db/connection.js");
const { createUsersTable } = await import("../queries/users.js");
const { createUser } = await import("../logic/create-user.js");
const { listUsers } = await import("../logic/list-users.js");
const { updateUser } = await import("../logic/update-user.js");
const { deleteUser } = await import("../logic/delete-user.js");
const { findUserByEmail } = await import("../logic/find-user-by-email.js");
const { findUserById } = await import("../logic/find-user-by-id.js");
const { usersGenderCount } = await import("../logic/users-gender-count.js");

function throws(fn, message) {
  assert.throws(fn, (error) => {
    assert.equal(error.message, message);
    return true;
  });
}

before(() => {
  createUsersTable();
});

beforeEach(() => {
  db.exec("DELETE FROM users");
});

test("create, list, update, and delete a user", () => {
  const created = createUser({ name: "Ada", email: "ada@example.com" });
  assert.equal(created.name, "Ada");
  assert.equal(created.email, "ada@example.com");

  const listed = listUsers();
  assert.equal(listed.length, 1);
  assert.equal(listed[0].id, created.id);

  const updated = updateUser(created.id, { name: "Ada Lovelace" });
  assert.equal(updated.name, "Ada Lovelace");
  assert.equal(updated.email, "ada@example.com");

  deleteUser(created.id);
  assert.equal(listUsers().length, 0);
});

test("rejects empty names and invalid emails", () => {
  throws(
    () => createUser({ name: "  ", email: "ada@example.com" }),
    "Name is empty",
  );
  throws(
    () => createUser({ name: "\0", email: "ada@example.com" }),
    "Name is empty",
  );
  throws(
    () => createUser({ name: "Ada", email: "not-an-email" }),
    "Email is invalid",
  );
  throws(
    () => createUser({ name: "Example", email: "a b@c d" }),
    "Email is invalid",
  );
});

test("rejects duplicate emails", () => {
  createUser({ name: "Ada", email: "ada@example.com" });
  throws(
    () => createUser({ name: "Ada 2", email: "ADA@example.com" }),
    "Email is already used",
  );
});

test("partial updates keep omitted fields", () => {
  const created = createUser({ name: "Ada", email: "ada@example.com" });
  const updated = updateUser(created.id, { name: "Ada Lovelace" });
  assert.equal(updated.email, "ada@example.com");
});

test("missing users throw User not found", () => {
  throws(() => updateUser(99, { name: "Example" }), "User not found");
  throws(() => deleteUser(99), "User not found");
  throws(() => findUserByEmail("missing@example.com"), "User not found");
  throws(() => findUserById(99), "User not found");
});

test("invalid ids throw Invalid id instead of crashing", () => {
  throws(() => deleteUser(undefined), "Invalid id");
  throws(() => updateUser(undefined, { name: "Example" }), "Invalid id");
  throws(() => findUserById(undefined), "Invalid id");
});

test("find user by email", () => {
  createUser({ name: "Ada", email: "ada@example.com" });
  const found = findUserByEmail("ADA@example.com");
  assert.equal(found.name, "Ada");
  assert.equal(found.email, "ada@example.com");
});

test("find user by id", () => {
  const created = createUser({ name: "Ada", email: "ada@example.com" });
  const found = findUserById(created.id);
  assert.equal(found.name, "Ada");
  assert.equal(found.email, "ada@example.com");
});

function answersFor(words) {
  const answers = {};
  for (let index = 0; index < words.length; index += 1) {
    answers[`name${index}`] = { choice: words[index] };
  }
  return { answers };
}

function jsonResponse(body, ok = true) {
  return {
    ok,
    json: async () => body,
  };
}

async function withFetch(fetchImpl, fn) {
  const original = globalThis.fetch;
  globalThis.fetch = fetchImpl;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
  }
}

function addUsers(count) {
  for (let index = 0; index < count; index += 1) {
    createUser({
      name: `Name${index}`,
      email: `name${index}@example.com`,
    });
  }
}

test("users gender count batches names and tallies choices", async () => {
  addUsers(7);
  const calls = [];
  const counts = await withFetch(async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, names: body.state.names, questions: body.questions });
    const words = body.state.names.map(() => "women");
    if (calls.length === 2) {
      words[0] = "men";
    }
    return jsonResponse(answersFor(words));
  }, () => usersGenderCount());

  assert.equal(calls.length, 2);
  assert.equal(calls[0].names.length, 6);
  assert.equal(calls[1].names.length, 1);
  assert.equal(Object.keys(calls[0].questions).length, 6);
  assert.match(String(calls[0].url), /\/v1\/systemone$/);
  assert.deepEqual(counts, { women: 6, men: 1, genderUndefined: 0 });
});

test("users gender count empty table does not call fetch", async () => {
  let called = false;
  const counts = await withFetch(async () => {
    called = true;
    return jsonResponse(answersFor([]));
  }, () => usersGenderCount());
  assert.equal(called, false);
  assert.deepEqual(counts, { women: 0, men: 0, genderUndefined: 0 });
});

test("users gender count short answer counts that batch as genderUndefined", async () => {
  addUsers(7);
  const counts = await withFetch(async (_url, options) => {
    const names = JSON.parse(options.body).state.names;
    if (names.length === 6) {
      return jsonResponse(answersFor(["women"]));
    }
    return jsonResponse(answersFor(["men"]));
  }, () => usersGenderCount());
  assert.deepEqual(counts, { women: 0, men: 1, genderUndefined: 6 });
});

test("users gender count other words count as genderUndefined", async () => {
  createUser({ name: "Ada", email: "ada@example.com" });
  const counts = await withFetch(
    async () => jsonResponse(answersFor(["mujer"])),
    () => usersGenderCount(),
  );
  assert.deepEqual(counts, { women: 0, men: 0, genderUndefined: 1 });
});

test("users gender count throws if the request fails", async () => {
  createUser({ name: "Ada", email: "ada@example.com" });
  await withFetch(
    async () => {
      throw new Error("down");
    },
    async () => {
      await assert.rejects(() => usersGenderCount(), {
        message: "Could not classify the users",
      });
    },
  );
  await withFetch(
    async () => jsonResponse({}, false),
    async () => {
      await assert.rejects(() => usersGenderCount(), {
        message: "Could not classify the users",
      });
    },
  );
});

test("users gender count throws if the table is missing", async () => {
  db.exec("DROP TABLE users");
  try {
    await assert.rejects(() => usersGenderCount(), {
      message: "Could not classify the users",
    });
  } finally {
    createUsersTable();
  }
});
