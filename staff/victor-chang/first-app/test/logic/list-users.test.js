import { test } from "node:test";
import assert from "node:assert/strict";
import { listUsers } from "../../logic/list-users.js";
import { createTestQueries } from "../create-test-queries.js";

test("LU-1: returns an empty array when there are no users", () => {
  const { queries } = createTestQueries();
  assert.deepEqual(listUsers(queries)(), []);
});

test("LU-2: returns every user ordered by id", () => {
  const { queries } = createTestQueries(
    { name: "Ana", email: "ana@x.com" },
    { name: "Bob", email: "bob@x.com" },
  );
  assert.deepEqual(listUsers(queries)(), [
    { id: 1, name: "Ana", email: "ana@x.com" },
    { id: 2, name: "Bob", email: "bob@x.com" },
  ]);
});
