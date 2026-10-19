import { test } from "node:test";
import assert from "node:assert/strict";
import { deleteUser } from "../../logic/delete-user.js";
import { createTestQueries } from "../create-test-queries.js";

test("DU-1: removes the user", () => {
  const { queries } = createTestQueries(
    { name: "Ana", email: "ana@x.com" },
    { name: "Bob", email: "bob@x.com" },
  );
  assert.equal(deleteUser(queries)(2), undefined);
  assert.deepEqual(queries.findAllUsers(), [
    { id: 1, name: "Ana", email: "ana@x.com" },
  ]);
});

test("DU-2: rejects a missing user", () => {
  const { queries } = createTestQueries();
  assert.throws(() => deleteUser(queries)(9), {
    code: "NOT_FOUND",
    details: { resource: "user", id: 9 },
  });
});
