import { test } from "node:test";
import assert from "node:assert/strict";
import { getUserByEmail } from "../../logic/get-user-by-email.js";
import { createTestQueries } from "../create-test-queries.js";

const ANA = { name: "Ana", email: "ana@x.com" };

test("GE-1: returns the user by email", () => {
  const { queries } = createTestQueries(ANA);
  assert.deepEqual(getUserByEmail(queries)("ana@x.com"), { id: 1, ...ANA });
});

test("GE-2: trims the email before the lookup", () => {
  const { queries } = createTestQueries(ANA);
  assert.deepEqual(getUserByEmail(queries)("  ana@x.com  "), { id: 1, ...ANA });
});

test("GE-3: rejects a missing user", () => {
  const { queries } = createTestQueries();
  assert.throws(() => getUserByEmail(queries)("nobody@x.com"), {
    code: "NOT_FOUND",
    details: { resource: "user", email: "nobody@x.com" },
  });
});

test("GE-4: rejects an invalid email", () => {
  const { queries } = createTestQueries();
  assert.throws(() => getUserByEmail(queries)("ana.x.com"), {
    code: "VALIDATION",
    details: { field: "email" },
  });
});

test("GE-5: matches the email exactly", () => {
  const { queries } = createTestQueries(ANA);
  assert.throws(() => getUserByEmail(queries)("ANA@x.com"), {
    code: "NOT_FOUND",
  });
});
