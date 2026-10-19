import { test } from "node:test";
import assert from "node:assert/strict";
import { createUser } from "../../logic/create-user.js";
import { createTestQueries } from "../create-test-queries.js";

const ANA = { name: "Ana", email: "ana@x.com" };

test("CU-1: creates a user with a database id", () => {
  const { queries } = createTestQueries();
  assert.deepEqual(createUser(queries)(ANA), { id: 1, ...ANA });
});

test("CU-2: trims name and email", () => {
  const { queries } = createTestQueries();
  assert.deepEqual(
    createUser(queries)({ name: "  Ana  ", email: " ana@x.com " }),
    { id: 1, ...ANA },
  );
});

test("CU-3: rejects a blank name", () => {
  const { queries } = createTestQueries();
  assert.throws(
    () => createUser(queries)({ name: "   ", email: "ana@x.com" }),
    { code: "VALIDATION", details: { field: "name" } },
  );
});

test("CU-4: rejects a missing name", () => {
  const { queries } = createTestQueries();
  assert.throws(() => createUser(queries)({ email: "ana@x.com" }), {
    code: "VALIDATION",
    details: { field: "name" },
  });
});

test("CU-5: rejects an email without @", () => {
  const { queries } = createTestQueries();
  assert.throws(
    () => createUser(queries)({ name: "Ana", email: "ana.x.com" }),
    { code: "VALIDATION", details: { field: "email" } },
  );
});

test("CU-6: reports the first failing field", () => {
  const { queries } = createTestQueries();
  assert.throws(() => createUser(queries)({ name: "", email: "bad" }), {
    code: "VALIDATION",
    details: { field: "name" },
  });
});

test("CU-7: rejects a duplicate email and adds nothing", () => {
  const { queries } = createTestQueries(ANA);
  assert.throws(
    () => createUser(queries)({ name: "Other", email: "ana@x.com" }),
    { code: "DUPLICATE", details: { field: "email", value: "ana@x.com" } },
  );
  assert.equal(queries.findAllUsers().length, 1);
});
