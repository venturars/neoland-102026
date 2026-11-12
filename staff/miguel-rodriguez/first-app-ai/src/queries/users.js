import { CREATE_USERS_TABLE } from "./queries/create-users-table.js";
import { FIND_ALL } from "./queries/find-all.js";
import { FIND_BY_EMAIL } from "./queries/find-by-email.js";
import { FIND_BY_ID } from "./queries/find-by-id.js";
import { FIND_BY_NAME } from "./queries/find-by-name.js";
import { INSERT } from "./queries/insert.js";
import { UPDATE } from "./queries/update.js";
import { REMOVE } from "./queries/remove.js";
import { LIST_TABLES } from "./queries/list-tables.js";

const ORIGIN = "http://127.0.0.1:3000";

async function execute(method, sql, params = {}) {
  const payload = JSON.stringify({ method, sql, params });
  const response = await fetch(`${ORIGIN}/execute`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
  });
  const requestFailed = !response.ok;
  if (requestFailed) {
    throw new Error("Query failed");
  }
  const result = await response.json();
  const invalidResult =
    !result || typeof result !== "object" || Array.isArray(result);
  if (invalidResult) {
    throw new Error("Query failed");
  }
  const executed = method === "exec" && result.ok === true;
  if (executed) {
    return undefined;
  }
  const singleRow = method === "get" && Object.hasOwn(result, "row");
  if (singleRow) {
    return result.row ?? undefined;
  }
  const rowList = method === "all" && Array.isArray(result.rows);
  if (rowList) {
    return result.rows;
  }
  const runResult =
    method === "run" &&
    typeof result.changes === "number" &&
    typeof result.lastInsertRowid === "number";
  if (runResult) {
    return result;
  }
  throw new Error("Query failed");
}

export async function createUsersTable() {
  await execute("exec", CREATE_USERS_TABLE);
}
export async function findByEmail(email) {
  return await execute("get", FIND_BY_EMAIL, { email });
}
export async function insert({ name, email }) {
  return await execute("get", INSERT, { name, email });
}
export async function findAll() {
  return await execute("all", FIND_ALL);
}
export async function findById(id) {
  return await execute("get", FIND_BY_ID, { id });
}
export async function update({ id, name, email }) {
  return await execute("get", UPDATE, { id, name, email });
}
export async function remove(id) {
  return await execute("run", REMOVE, { id });
}
export async function findByName(name) {
  return await execute("all", FIND_BY_NAME, { name });
}
export async function listTables() {
  return await execute("all", LIST_TABLES);
}
