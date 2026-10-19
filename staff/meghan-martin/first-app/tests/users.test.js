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
});

test("invalid ids throw Invalid id instead of crashing", () => {
  throws(() => deleteUser(undefined), "Invalid id");
  throws(() => updateUser(undefined, { name: "Example" }), "Invalid id");
});

test("find user by email", () => {
  createUser({ name: "Ada", email: "ada@example.com" });
  const found = findUserByEmail("ADA@example.com");
  assert.equal(found.name, "Ada");
  assert.equal(found.email, "ada@example.com");
});
