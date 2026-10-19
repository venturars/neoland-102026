import { test } from "node:test";
import assert from "node:assert/strict";
import { updateUser } from "../../logic/update-user.js";
import { createTestQueries } from "../create-test-queries.js";

const ANA = { name: "Ana", email: "ana@x.com" };
const BOB = { name: "Bob", email: "bob@x.com" };

test("UU-1: replaces name and email", () => {
  const { queries } = createTestQueries(ANA);
  assert.deepEqual(
    updateUser(queries)(1, { name: "Ana B", email: "anab@x.com" }),
    { id: 1, name: "Ana B", email: "anab@x.com" },
  );
});

test("UU-2: lets a user keep its own email", () => {
  const { queries } = createTestQueries(ANA);
  assert.deepEqual(
    updateUser(queries)(1, { name: "Ana B", email: "ana@x.com" }),
    { id: 1, name: "Ana B", email: "ana@x.com" },
  );
});

test("UU-3: rejects a blank name", () => {
  const { queries } = createTestQueries(ANA);
  assert.throws(
    () => updateUser(queries)(1, { name: "", email: "ana@x.com" }),
    { code: "VALIDATION", details: { field: "name" } },
  );
});

test("UU-4: rejects a missing user", () => {
  const { queries } = createTestQueries();
  assert.throws(() => updateUser(queries)(9, ANA), {
    code: "NOT_FOUND",
    details: { resource: "user", id: 9 },
  });
});

test("UU-5: checks input before existence", () => {
  const { queries } = createTestQueries();
  assert.throws(() => updateUser(queries)(9, { name: "Ana", email: "bad" }), {
    code: "VALIDATION",
    details: { field: "email" },
  });
});

test("UU-6: rejects an email owned by another user and changes nothing", () => {
  const { queries } = createTestQueries(ANA, BOB);
  assert.throws(
    () => updateUser(queries)(2, { name: "Bob", email: "ana@x.com" }),
    { code: "DUPLICATE", details: { field: "email", value: "ana@x.com" } },
  );
  assert.deepEqual(queries.findUserById(2), { id: 2, ...BOB });
});
